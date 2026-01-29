/**
 * Fund Distributor
 * Distributes SOL and tokens to multiple wallets
 */

import {
  Connection,
} from '@solana/web3.js';
import type {
  FundDistributor as IFundDistributor,
  DistributeParams,
  TokenDistributeParams,
  DistributionResult,
  TransactionResult,
  TransferResult,
  CostEstimate,
  WalletErrorCode,
} from '../types.js';
import { WalletManagerError } from '../types.js';
import {
  buildBatchSolTransfers,
  buildBatchTokenTransfers,
  calculateDistribution,
  estimateBatchTransferFees,
  MAX_INSTRUCTIONS_PER_TX,
} from './batch-transfer.js';
import { getWalletBalance } from '../operations/balance.js';

/**
 * Fund Distributor implementation
 */
export class FundDistributorImpl implements IFundDistributor {
  private connection: Connection;
  private signTransaction: (
    walletId: string,
    tx: any,
    password: string
  ) => Promise<any>;
  private getAddress: (walletId: string) => Promise<string>;
  private password: string;

  constructor(options: {
    connection: Connection;
    signTransaction: (walletId: string, tx: any, password: string) => Promise<any>;
    getAddress: (walletId: string) => Promise<string>;
    password: string;
  }) {
    this.connection = options.connection;
    this.signTransaction = options.signTransaction;
    this.getAddress = options.getAddress;
    this.password = options.password;
  }

  /**
   * Distribute SOL from source wallet to multiple destinations
   */
  async distributeSol(params: DistributeParams): Promise<DistributionResult> {
    const {
      sourceWalletId,
      destinationWalletIds,
      totalAmount,
      distribution,
      weights,
      minPerWallet,
      maxPerWallet,
    } = params;

    // Get source address
    const sourceAddress = await this.getAddress(sourceWalletId);

    // Check source balance
    const balance = await getWalletBalance(this.connection, sourceAddress);
    if (balance.sol < totalAmount) {
      throw new WalletManagerError(
        'INSUFFICIENT_FUNDS' as WalletErrorCode,
        `Insufficient SOL balance. Have ${balance.sol}, need ${totalAmount}`
      );
    }

    // Get destination addresses
    const destinations = await Promise.all(
      destinationWalletIds.map(async (id) => ({
        id,
        address: await this.getAddress(id),
      }))
    );

    // Calculate distribution amounts
    let amounts = calculateDistribution(
      totalAmount,
      destinations.length,
      distribution,
      weights
    );

    // Apply min/max constraints
    if (minPerWallet || maxPerWallet) {
      amounts = amounts.map(amount => {
        if (minPerWallet && amount < minPerWallet) return minPerWallet;
        if (maxPerWallet && amount > maxPerWallet) return maxPerWallet;
        return amount;
      });
    }

    // Build transfers array with guaranteed amounts
    const transfers = destinations.map((dest, i) => ({
      destination: dest.address,
      amount: amounts[i] ?? BigInt(0),
      walletId: dest.id,
    }));

    // Build batch transactions
    const transactions = await buildBatchSolTransfers(
      sourceAddress,
      transfers,
      this.connection
    );

    // Sign and send transactions
    const results: TransferResult[] = [];
    const signatures: string[] = [];
    let successCount = 0;
    let failedCount = 0;
    let totalDistributed = BigInt(0);
    let totalFees = BigInt(0);

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      const batchStart = i * MAX_INSTRUCTIONS_PER_TX;
      const batchEnd = Math.min(batchStart + MAX_INSTRUCTIONS_PER_TX, transfers.length);
      const batchTransfers = transfers.slice(batchStart, batchEnd);

      try {
        // Sign transaction
        const signedTx = await this.signTransaction(sourceWalletId, tx, this.password);

        // Send transaction
        const signature = await this.connection.sendTransaction(signedTx);
        signatures.push(signature);

        // Wait for confirmation
        const confirmation = await this.connection.confirmTransaction(signature);

        if (confirmation.value.err) {
          // Transaction failed
          for (const transfer of batchTransfers) {
            results.push({
              destinationWalletId: transfer.walletId,
              amount: transfer.amount,
              success: false,
              error: 'Transaction failed on-chain',
            });
            failedCount++;
          }
        } else {
          // Transaction succeeded
          for (const transfer of batchTransfers) {
            results.push({
              destinationWalletId: transfer.walletId,
              amount: transfer.amount,
              signature,
              success: true,
            });
            successCount++;
            totalDistributed += transfer.amount;
          }
        }

        // Estimate fees (simplified)
        totalFees += BigInt(5000); // Base fee per transaction
      } catch (error) {
        // Transaction failed to send
        for (const transfer of batchTransfers) {
          results.push({
            destinationWalletId: transfer.walletId,
            amount: transfer.amount,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          failedCount++;
        }
      }
    }

    return {
      signatures,
      successCount,
      failedCount,
      totalDistributed,
      transfers: results,
      totalFees,
    };
  }

  /**
   * Distribute tokens from source wallet to multiple destinations
   */
  async distributeToken(params: TokenDistributeParams): Promise<DistributionResult> {
    const {
      sourceWalletId,
      destinationWalletIds,
      totalAmount,
      distribution,
      weights,
      tokenMint,
    } = params;

    // Get source address
    const sourceAddress = await this.getAddress(sourceWalletId);

    // Get destination addresses
    const destinations = await Promise.all(
      destinationWalletIds.map(async (id) => ({
        id,
        address: await this.getAddress(id),
      }))
    );

    // Calculate distribution amounts
    const amounts = calculateDistribution(
      totalAmount,
      destinations.length,
      distribution,
      weights
    );

    // Build transfers array
    const transfers = destinations.map((dest, i) => ({
      destination: dest.address,
      amount: amounts[i] ?? BigInt(0),
      walletId: dest.id,
    }));

    // Build batch transactions
    const transactions = await buildBatchTokenTransfers(
      sourceAddress,
      tokenMint,
      transfers,
      this.connection
    );

    // Sign and send transactions (same pattern as SOL distribution)
    const results: TransferResult[] = [];
    const signatures: string[] = [];
    let successCount = 0;
    let failedCount = 0;
    let totalDistributed = BigInt(0);
    let totalFees = BigInt(0);

    const batchSize = 10; // Token transfers use smaller batches

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      const batchStart = i * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, transfers.length);
      const batchTransfers = transfers.slice(batchStart, batchEnd);

      try {
        const signedTx = await this.signTransaction(sourceWalletId, tx, this.password);
        const signature = await this.connection.sendTransaction(signedTx);
        signatures.push(signature);

        const confirmation = await this.connection.confirmTransaction(signature);

        if (confirmation.value.err) {
          for (const transfer of batchTransfers) {
            results.push({
              destinationWalletId: transfer.walletId,
              amount: transfer.amount,
              success: false,
              error: 'Transaction failed on-chain',
            });
            failedCount++;
          }
        } else {
          for (const transfer of batchTransfers) {
            results.push({
              destinationWalletId: transfer.walletId,
              amount: transfer.amount,
              signature,
              success: true,
            });
            successCount++;
            totalDistributed += transfer.amount;
          }
        }

        totalFees += BigInt(5000);
      } catch (error) {
        for (const transfer of batchTransfers) {
          results.push({
            destinationWalletId: transfer.walletId,
            amount: transfer.amount,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          failedCount++;
        }
      }
    }

    return {
      signatures,
      successCount,
      failedCount,
      totalDistributed,
      transfers: results,
      totalFees,
    };
  }

  /**
   * Consolidate SOL from multiple wallets to a single destination
   */
  async consolidateSol(
    _walletIds: string[],
    _destinationWallet: string
  ): Promise<TransactionResult> {
    // This is a more complex operation that requires signing from multiple wallets
    // For now, we'll implement a simplified version that processes one at a time
    throw new WalletManagerError(
      'CONSOLIDATION_FAILED' as WalletErrorCode,
      'Consolidation requires multi-wallet signing. Use distributor.consolidateSolSequential() instead.'
    );
  }

  /**
   * Consolidate tokens from multiple wallets to a single destination
   */
  async consolidateToken(
    _walletIds: string[],
    _tokenMint: string,
    _destinationWallet: string
  ): Promise<TransactionResult> {
    throw new WalletManagerError(
      'CONSOLIDATION_FAILED' as WalletErrorCode,
      'Consolidation requires multi-wallet signing. Use distributor.consolidateTokenSequential() instead.'
    );
  }

  /**
   * Estimate the cost of distributing to N wallets
   */
  async estimateDistributionCost(walletCount: number): Promise<CostEstimate> {
    const feeEstimate = await estimateBatchTransferFees(walletCount, false, this.connection);

    // Estimate 400ms per transaction (conservative)
    const estimatedTime = feeEstimate.transactionCount * 0.4;

    return {
      transactionCount: feeEstimate.transactionCount,
      totalFees: feeEstimate.totalFee,
      computeUnits: walletCount * 200, // 200 CU per SOL transfer
      estimatedTime,
    };
  }
}

/**
 * Create a fund distributor instance
 */
export function createFundDistributor(options: {
  connection: Connection;
  signTransaction: (walletId: string, tx: any, password: string) => Promise<any>;
  getAddress: (walletId: string) => Promise<string>;
  password: string;
}): IFundDistributor {
  return new FundDistributorImpl(options);
}
