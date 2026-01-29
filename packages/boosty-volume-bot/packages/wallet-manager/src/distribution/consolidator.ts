/**
 * Fund Consolidator
 * Consolidates funds from multiple wallets back to a main wallet
 */

import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  SystemProgram,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { getAllTokenBalances } from '../operations/balance.js';

/**
 * Minimum SOL to keep for rent
 */
const MIN_SOL_BALANCE = BigInt(890_880); // Minimum for rent exemption

/**
 * Consolidation result
 */
export interface ConsolidationResult {
  signatures: string[];
  successCount: number;
  failedCount: number;
  totalConsolidated: bigint;
  results: ConsolidationWalletResult[];
  totalFees: bigint;
}

/**
 * Per-wallet consolidation result
 */
export interface ConsolidationWalletResult {
  walletId: string;
  amount: bigint;
  signature?: string;
  success: boolean;
  error?: string;
}

/**
 * Consolidate SOL from multiple wallets sequentially
 * Each wallet signs its own transaction
 */
export async function consolidateSolSequential(
  connection: Connection,
  walletIds: string[],
  destinationAddress: string,
  signTransaction: (walletId: string, tx: VersionedTransaction, password: string) => Promise<VersionedTransaction>,
  getAddress: (walletId: string) => Promise<string>,
  password: string
): Promise<ConsolidationResult> {
  const results: ConsolidationWalletResult[] = [];
  const signatures: string[] = [];
  let successCount = 0;
  let failedCount = 0;
  let totalConsolidated = BigInt(0);
  let totalFees = BigInt(0);

  const destPubkey = new PublicKey(destinationAddress);

  for (const walletId of walletIds) {
    try {
      const address = await getAddress(walletId);
      const pubkey = new PublicKey(address);

      // Get balance
      const balance = await connection.getBalance(pubkey);
      const balanceBigInt = BigInt(balance);

      // Calculate amount to send (leave minimum for rent + fee)
      const estimatedFee = BigInt(5000);
      const amountToSend = balanceBigInt - MIN_SOL_BALANCE - estimatedFee;

      if (amountToSend <= BigInt(0)) {
        results.push({
          walletId,
          amount: BigInt(0),
          success: false,
          error: 'Insufficient balance to consolidate',
        });
        failedCount++;
        continue;
      }

      // Build transaction
      const instructions = [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 200 }),
        SystemProgram.transfer({
          fromPubkey: pubkey,
          toPubkey: destPubkey,
          lamports: amountToSend,
        }),
      ];

      const { blockhash } = await connection.getLatestBlockhash();
      const message = new TransactionMessage({
        payerKey: pubkey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const tx = new VersionedTransaction(message);

      // Sign transaction
      const signedTx = await signTransaction(walletId, tx, password);

      // Send transaction
      const signature = await connection.sendTransaction(signedTx);
      signatures.push(signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        results.push({
          walletId,
          amount: amountToSend,
          signature,
          success: false,
          error: 'Transaction failed on-chain',
        });
        failedCount++;
      } else {
        results.push({
          walletId,
          amount: amountToSend,
          signature,
          success: true,
        });
        successCount++;
        totalConsolidated += amountToSend;
      }

      totalFees += estimatedFee;
    } catch (error) {
      results.push({
        walletId,
        amount: BigInt(0),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failedCount++;
    }
  }

  return {
    signatures,
    successCount,
    failedCount,
    totalConsolidated,
    results,
    totalFees,
  };
}

/**
 * Consolidate tokens from multiple wallets sequentially
 */
export async function consolidateTokenSequential(
  connection: Connection,
  walletIds: string[],
  tokenMint: string,
  destinationAddress: string,
  signTransaction: (walletId: string, tx: VersionedTransaction, password: string) => Promise<VersionedTransaction>,
  getAddress: (walletId: string) => Promise<string>,
  password: string,
  closeAccounts: boolean = false
): Promise<ConsolidationResult> {
  const results: ConsolidationWalletResult[] = [];
  const signatures: string[] = [];
  let successCount = 0;
  let failedCount = 0;
  let totalConsolidated = BigInt(0);
  let totalFees = BigInt(0);

  const mintPubkey = new PublicKey(tokenMint);
  const destPubkey = new PublicKey(destinationAddress);
  const destAta = await getAssociatedTokenAddress(mintPubkey, destPubkey);

  for (const walletId of walletIds) {
    try {
      const address = await getAddress(walletId);
      const pubkey = new PublicKey(address);
      const sourceAta = await getAssociatedTokenAddress(mintPubkey, pubkey);

      // Get token balance
      const tokenBalances = await getAllTokenBalances(connection, address);
      const tokenBalance = tokenBalances.find(t => t.mint === tokenMint);

      if (!tokenBalance || tokenBalance.amount === BigInt(0)) {
        results.push({
          walletId,
          amount: BigInt(0),
          success: false,
          error: 'No token balance to consolidate',
        });
        failedCount++;
        continue;
      }

      const amountToSend = tokenBalance.amount;

      // Build transaction
      const instructions = [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
        createTransferInstruction(
          sourceAta,
          destAta,
          pubkey,
          amountToSend
        ),
      ];

      // Optionally close the token account after transfer
      if (closeAccounts) {
        instructions.push(
          createCloseAccountInstruction(
            sourceAta,
            pubkey, // Rent goes back to owner
            pubkey
          )
        );
      }

      const { blockhash } = await connection.getLatestBlockhash();
      const message = new TransactionMessage({
        payerKey: pubkey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const tx = new VersionedTransaction(message);

      // Sign transaction
      const signedTx = await signTransaction(walletId, tx, password);

      // Send transaction
      const signature = await connection.sendTransaction(signedTx);
      signatures.push(signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        results.push({
          walletId,
          amount: amountToSend,
          signature,
          success: false,
          error: 'Transaction failed on-chain',
        });
        failedCount++;
      } else {
        results.push({
          walletId,
          amount: amountToSend,
          signature,
          success: true,
        });
        successCount++;
        totalConsolidated += amountToSend;
      }

      totalFees += BigInt(5000);
    } catch (error) {
      results.push({
        walletId,
        amount: BigInt(0),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failedCount++;
    }
  }

  return {
    signatures,
    successCount,
    failedCount,
    totalConsolidated,
    results,
    totalFees,
  };
}

/**
 * Estimate consolidation returns
 */
export async function estimateConsolidation(
  connection: Connection,
  walletIds: string[],
  getAddress: (walletId: string) => Promise<string>
): Promise<{
  totalSol: bigint;
  walletCount: number;
  estimatedFees: bigint;
  netReturn: bigint;
}> {
  let totalSol = BigInt(0);
  let walletCount = 0;

  for (const walletId of walletIds) {
    try {
      const address = await getAddress(walletId);
      const balance = await connection.getBalance(new PublicKey(address));
      const balanceBigInt = BigInt(balance);

      if (balanceBigInt > MIN_SOL_BALANCE) {
        totalSol += balanceBigInt - MIN_SOL_BALANCE;
        walletCount++;
      }
    } catch {
      // Skip wallets with errors
    }
  }

  const estimatedFees = BigInt(walletCount * 5000);
  const netReturn = totalSol - estimatedFees;

  return {
    totalSol,
    walletCount,
    estimatedFees,
    netReturn: netReturn > BigInt(0) ? netReturn : BigInt(0),
  };
}
