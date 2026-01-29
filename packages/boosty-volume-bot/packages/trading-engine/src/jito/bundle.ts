/**
 * Jito Bundle Submission
 * 
 * Real integration with Jito MEV protection infrastructure.
 * Uses Jito's block engine for bundle submission and tip payments.
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
  TransactionInstruction,
  SystemProgram,
  TransactionMessage,
  AddressLookupTableAccount,
} from '@solana/web3.js';
import bs58 from 'bs58';
import { HttpClient } from '../utils/http.js';
import { withRetry } from '../utils/retry.js';
import { JitoBundleError } from '../errors.js';

/**
 * Jito block engine endpoints
 * These are the real Jito block engine URLs for mainnet
 */
export const JITO_BLOCK_ENGINES = {
  mainnet: [
    'https://mainnet.block-engine.jito.wtf',
    'https://amsterdam.mainnet.block-engine.jito.wtf',
    'https://frankfurt.mainnet.block-engine.jito.wtf',
    'https://ny.mainnet.block-engine.jito.wtf',
    'https://tokyo.mainnet.block-engine.jito.wtf',
  ],
} as const;

/**
 * Jito tip accounts - real mainnet tip accounts
 * One of these must receive the tip for the bundle to be processed
 */
export const JITO_TIP_ACCOUNTS = [
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
] as const;

/**
 * Bundle status from Jito
 */
export type BundleStatus = 
  | 'Invalid'
  | 'Pending'
  | 'Failed'
  | 'Landed'
  | 'Processed'
  | 'Finalized';

/**
 * Bundle result from Jito
 */
export interface BundleResult {
  bundleId: string;
  status: BundleStatus;
  slot?: number;
  transactions?: string[];
  error?: string;
}

/**
 * Bundle submission options
 */
export interface BundleSubmitOptions {
  /** Region preference for block engine */
  region?: 'amsterdam' | 'frankfurt' | 'ny' | 'tokyo';
  /** Skip preflight checks */
  skipPreflight?: boolean;
  /** Maximum retries */
  maxRetries?: number;
}

/**
 * Jito Bundle Client for MEV protection
 */
export class JitoBundleClient {
  private readonly connection: Connection;
  private readonly httpClient: HttpClient;
  private currentEngineIndex: number = 0;

  constructor(rpcEndpoint: string) {
    this.connection = new Connection(rpcEndpoint, 'confirmed');
    this.httpClient = new HttpClient({
      timeoutMs: 30000,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get the next block engine URL (round-robin)
   */
  private getBlockEngineUrl(region?: string): string {
    if (region) {
      const regionUrl = JITO_BLOCK_ENGINES.mainnet.find(url => url.includes(region));
      if (regionUrl) return regionUrl;
    }
    
    const url = JITO_BLOCK_ENGINES.mainnet[this.currentEngineIndex]!;
    this.currentEngineIndex = (this.currentEngineIndex + 1) % JITO_BLOCK_ENGINES.mainnet.length;
    return url;
  }

  /**
   * Get a random tip account
   */
  getRandomTipAccount(): PublicKey {
    const index = Math.floor(Math.random() * JITO_TIP_ACCOUNTS.length);
    return new PublicKey(JITO_TIP_ACCOUNTS[index]!);
  }

  /**
   * Create a tip instruction
   */
  createTipInstruction(
    payer: PublicKey,
    tipLamports: number
  ): TransactionInstruction {
    return SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: this.getRandomTipAccount(),
      lamports: tipLamports,
    });
  }

  /**
   * Add tip to a transaction
   */
  addTipToTransaction(
    transaction: Transaction,
    payer: PublicKey,
    tipLamports: number
  ): Transaction {
    const tipIx = this.createTipInstruction(payer, tipLamports);
    transaction.add(tipIx);
    return transaction;
  }

  /**
   * Add tip to a versioned transaction
   */
  async addTipToVersionedTransaction(
    transaction: VersionedTransaction,
    payer: Keypair,
    tipLamports: number,
    lookupTables: AddressLookupTableAccount[] = []
  ): Promise<VersionedTransaction> {
    const tipIx = this.createTipInstruction(payer.publicKey, tipLamports);
    
    // Decompile the existing message
    const message = transaction.message;
    const instructions = TransactionMessage.decompile(message, {
      addressLookupTableAccounts: lookupTables,
    });

    // Add tip instruction
    instructions.instructions.push(tipIx);

    // Get fresh blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();

    // Recompile with tip
    const newMessage = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: blockhash,
      instructions: instructions.instructions,
    }).compileToV0Message(lookupTables);

    const newTx = new VersionedTransaction(newMessage);
    newTx.sign([payer]);

    return newTx;
  }

  /**
   * Serialize transaction for bundle submission
   */
  private serializeTransaction(tx: Transaction | VersionedTransaction): string {
    const serialized = tx.serialize();
    return bs58.encode(serialized);
  }

  /**
   * Submit a bundle of transactions
   */
  async submitBundle(
    transactions: (Transaction | VersionedTransaction)[],
    options: BundleSubmitOptions = {}
  ): Promise<BundleResult> {
    if (transactions.length === 0) {
      throw new JitoBundleError('INVALID', 'Bundle must contain at least one transaction');
    }

    if (transactions.length > 5) {
      throw new JitoBundleError('INVALID', 'Bundle cannot contain more than 5 transactions');
    }

    const serializedTxs = transactions.map(tx => this.serializeTransaction(tx));
    const blockEngineUrl = this.getBlockEngineUrl(options.region);

    const result = await withRetry(
      async () => {
        const response = await this.httpClient.post<{
          jsonrpc: string;
          id: number;
          result?: string;
          error?: { code: number; message: string };
        }>(`${blockEngineUrl}/api/v1/bundles`, {
          jsonrpc: '2.0',
          id: 1,
          method: 'sendBundle',
          params: [serializedTxs],
        });

        if (response.error) {
          throw new JitoBundleError(
            'REJECTED',
            response.error.message
          );
        }

        return response.result!;
      },
      {
        maxAttempts: options.maxRetries ?? 3,
        initialDelayMs: 1000,
        retryableErrors: ['REJECTED', '429', '503'],
      }
    );

    return {
      bundleId: result,
      status: 'Pending',
    };
  }

  /**
   * Get bundle status
   */
  async getBundleStatus(bundleId: string, region?: string): Promise<BundleResult> {
    const blockEngineUrl = this.getBlockEngineUrl(region);

    const response = await this.httpClient.post<{
      jsonrpc: string;
      id: number;
      result?: {
        context: { slot: number };
        value: Array<{
          bundle_id: string;
          status: string;
          landed_slot?: number;
        }>;
      };
      error?: { code: number; message: string };
    }>(`${blockEngineUrl}/api/v1/bundles`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBundleStatuses',
      params: [[bundleId]],
    });

    if (response.error) {
      throw new JitoBundleError('REJECTED', response.error.message, bundleId);
    }

    const bundleStatus = response.result?.value[0];
    if (!bundleStatus) {
      return {
        bundleId,
        status: 'Pending',
      };
    }

    return {
      bundleId: bundleStatus.bundle_id,
      status: bundleStatus.status as BundleStatus,
      slot: bundleStatus.landed_slot,
    };
  }

  /**
   * Wait for bundle to be processed
   */
  async waitForBundle(
    bundleId: string,
    timeoutMs: number = 60000,
    pollIntervalMs: number = 2000
  ): Promise<BundleResult> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const status = await this.getBundleStatus(bundleId);

      switch (status.status) {
        case 'Landed':
        case 'Processed':
        case 'Finalized':
          return status;
        
        case 'Failed':
        case 'Invalid':
          throw new JitoBundleError(
            status.status === 'Failed' ? 'DROPPED' : 'INVALID',
            `Bundle ${bundleId} failed with status: ${status.status}`,
            bundleId
          );
        
        case 'Pending':
        default:
          await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
      }
    }

    throw new JitoBundleError(
      'EXPIRED',
      `Bundle ${bundleId} did not land within ${timeoutMs}ms`,
      bundleId
    );
  }

  /**
   * Submit bundle and wait for confirmation
   */
  async submitAndWait(
    transactions: (Transaction | VersionedTransaction)[],
    options: BundleSubmitOptions & { timeoutMs?: number } = {}
  ): Promise<BundleResult> {
    const { timeoutMs = 60000, ...submitOptions } = options;
    
    const submitResult = await this.submitBundle(transactions, submitOptions);
    return this.waitForBundle(submitResult.bundleId, timeoutMs);
  }

  /**
   * Send transaction via Jito with automatic tip
   */
  async sendWithTip(
    transaction: Transaction,
    signer: Keypair,
    tipLamports: number = 10000
  ): Promise<BundleResult> {
    // Add tip
    const txWithTip = this.addTipToTransaction(
      transaction,
      signer.publicKey,
      tipLamports
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = 
      await this.connection.getLatestBlockhash();
    
    txWithTip.recentBlockhash = blockhash;
    txWithTip.lastValidBlockHeight = lastValidBlockHeight;
    txWithTip.sign(signer);

    return this.submitAndWait([txWithTip]);
  }

  /**
   * Calculate recommended tip based on network conditions
   * Uses real priority fee data from the network
   */
  async getRecommendedTip(urgency: 'low' | 'medium' | 'high' = 'medium'): Promise<number> {
    try {
      // Get recent prioritization fees from the network
      const fees = await this.connection.getRecentPrioritizationFees();
      
      if (fees.length === 0) {
        // Fallback defaults
        return urgency === 'low' ? 1000 : urgency === 'medium' ? 10000 : 100000;
      }

      // Calculate percentile based on urgency
      const sortedFees = fees
        .map(f => f.prioritizationFee)
        .filter(f => f > 0)
        .sort((a, b) => a - b);

      if (sortedFees.length === 0) {
        return urgency === 'low' ? 1000 : urgency === 'medium' ? 10000 : 100000;
      }

      let percentile: number;
      switch (urgency) {
        case 'low':
          percentile = 0.25;
          break;
        case 'medium':
          percentile = 0.5;
          break;
        case 'high':
          percentile = 0.9;
          break;
      }

      const index = Math.floor(sortedFees.length * percentile);
      const baseFee = sortedFees[Math.min(index, sortedFees.length - 1)]!;

      // Jito tips need to be higher than just the priority fee
      // Multiply by a factor based on urgency
      const multiplier = urgency === 'low' ? 1.5 : urgency === 'medium' ? 2 : 3;
      
      return Math.max(
        Math.floor(baseFee * multiplier),
        urgency === 'low' ? 1000 : urgency === 'medium' ? 5000 : 25000
      );
    } catch {
      // Fallback if we can't get fees
      return urgency === 'low' ? 5000 : urgency === 'medium' ? 10000 : 50000;
    }
  }
}

/**
 * Create a Jito bundle client
 */
export function createJitoBundleClient(rpcEndpoint: string): JitoBundleClient {
  return new JitoBundleClient(rpcEndpoint);
}
