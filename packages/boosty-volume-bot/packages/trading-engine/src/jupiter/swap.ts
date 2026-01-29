/**
 * Jupiter Swap Service
 * 
 * Handles building and executing swap transactions via Jupiter V6 API.
 */

import {
  Connection,
  VersionedTransaction,
  AddressLookupTableAccount,
  PublicKey,
  SendTransactionError,
} from '@solana/web3.js';
import type {
  SwapParams,
  ExecuteSwapParams,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';

/**
 * Swap transaction response from Jupiter API
 */
interface SwapTransactionResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports?: number;
}

/**
 * Jupiter Swap service for executing trades
 */
export class JupiterSwap {
  private readonly connection: Connection;
  private readonly apiUrl: string;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.apiUrl = config.jupiterApiUrl;
  }

  /**
   * Get a swap transaction from Jupiter
   */
  async getSwapTransaction(params: SwapParams): Promise<VersionedTransaction> {
    const response = await fetch(`${this.apiUrl}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        userPublicKey: params.userPublicKey,
        quoteResponse: params.quoteResponse,
        wrapAndUnwrapSol: params.wrapAndUnwrapSol ?? true,
        useSharedAccounts: params.useSharedAccounts ?? true,
        feeAccount: params.feeAccount,
        computeUnitPriceMicroLamports: params.computeUnitPriceMicroLamports,
        prioritizationFeeLamports: params.prioritizationFeeLamports,
        skipUserAccountsRpcRequest: params.skipUserAccountsRpcRequest ?? false,
        dynamicComputeUnitLimit: params.dynamicComputeUnitLimit ?? true,
        destinationTokenAccount: params.destinationTokenAccount,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter swap transaction failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as SwapTransactionResponse;
    
    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(data.swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    return transaction;
  }

  /**
   * Execute a swap transaction
   */
  async executeSwap(params: ExecuteSwapParams): Promise<TransactionResult> {
    // Get the swap transaction
    const transaction = await this.getSwapTransaction(params);

    // Sign the transaction
    if (params.signer instanceof Uint8Array) {
      // If signer is a raw key, we need to import and sign
      const { Keypair } = await import('@solana/web3.js');
      const keypair = Keypair.fromSecretKey(params.signer);
      transaction.sign([keypair]);
    } else {
      // Use the provided signing function
      await params.signer(transaction);
    }

    // Send the transaction
    const sendOptions = params.sendOptions ?? {
      skipPreflight: false,
      maxRetries: 3,
      preflightCommitment: 'confirmed',
    };

    try {
      const signature = await this.connection.sendTransaction(transaction, {
        skipPreflight: sendOptions.skipPreflight,
        maxRetries: sendOptions.maxRetries,
        preflightCommitment: sendOptions.preflightCommitment,
      });

      // Wait for confirmation
      const latestBlockhash = await this.connection.getLatestBlockhash();
      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }, 'confirmed');

      if (confirmation.value.err) {
        return {
          signature,
          confirmed: false,
          error: JSON.stringify(confirmation.value.err),
        };
      }

      // Get transaction details for fee info
      const txInfo = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      return {
        signature,
        confirmed: true,
        slot: txInfo?.slot,
        blockTime: txInfo?.blockTime ?? undefined,
        fee: txInfo?.meta?.fee,
      };
    } catch (error) {
      if (error instanceof SendTransactionError) {
        return {
          signature: '',
          confirmed: false,
          error: error.message,
        };
      }
      throw error;
    }
  }

  /**
   * Simulate a swap transaction without executing
   */
  async simulateSwap(params: SwapParams): Promise<{
    success: boolean;
    logs?: string[];
    unitsConsumed?: number;
    error?: string;
  }> {
    const transaction = await this.getSwapTransaction(params);

    const simulation = await this.connection.simulateTransaction(transaction, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    });

    return {
      success: simulation.value.err === null,
      logs: simulation.value.logs ?? undefined,
      unitsConsumed: simulation.value.unitsConsumed ?? undefined,
      error: simulation.value.err ? JSON.stringify(simulation.value.err) : undefined,
    };
  }

  /**
   * Get address lookup table accounts for a transaction
   */
  async getAddressLookupTableAccounts(
    keys: string[]
  ): Promise<AddressLookupTableAccount[]> {
    const addressLookupTableAccountInfos = await this.connection.getMultipleAccountsInfo(
      keys.map(key => new PublicKey(key))
    );

    return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
      const key = keys[index];
      if (accountInfo && key) {
        const addressLookupTableAccount = new AddressLookupTableAccount({
          key: new PublicKey(key),
          state: AddressLookupTableAccount.deserialize(accountInfo.data),
        });
        acc.push(addressLookupTableAccount);
      }
      return acc;
    }, [] as AddressLookupTableAccount[]);
  }

  /**
   * Estimate transaction fee
   */
  async estimateFee(transaction: VersionedTransaction): Promise<number> {
    const fee = await this.connection.getFeeForMessage(transaction.message);
    return fee.value ?? 5000; // Default to 5000 lamports if estimation fails
  }
}
