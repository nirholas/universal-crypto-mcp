/**
 * Jito Bundle Support
 * MEV protection via Jito bundles
 */

import {
  Connection,
  PublicKey,
  VersionedTransaction,
  Keypair,
  SystemProgram,
  TransactionMessage,
} from '@solana/web3.js';
import { TransactionResult, JitoSendOptions } from '../types.js';
import { logger } from '../utils/logger.js';
import { sleep } from '../utils/helpers.js';

// Jito Block Engine endpoints
const JITO_BLOCK_ENGINES = [
  'https://mainnet.block-engine.jito.wtf',
  'https://amsterdam.mainnet.block-engine.jito.wtf',
  'https://frankfurt.mainnet.block-engine.jito.wtf',
  'https://ny.mainnet.block-engine.jito.wtf',
  'https://tokyo.mainnet.block-engine.jito.wtf',
];

// Jito tip accounts (rotate through these)
const JITO_TIP_ACCOUNTS = [
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
  'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
];

interface JitoBundleResponse {
  jsonrpc: string;
  id: number;
  result?: string;
  error?: { code: number; message: string };
}

interface JitoBundleStatus {
  jsonrpc: string;
  id: number;
  result?: {
    context: { slot: number };
    value: Array<{
      bundle_id: string;
      transactions: string[];
      slot: number;
      confirmation_status: string;
      err?: unknown;
    }>;
  };
}

export class JitoBundleSender {
  private blockEngineUrl: string;
  private tipAccountIndex: number = 0;
  private blockEngineLatencies: Map<string, number> = new Map();

  constructor(
    private readonly connection: Connection,
    blockEngineUrl?: string
  ) {
    // Use provided URL or select based on region
    this.blockEngineUrl = blockEngineUrl || JITO_BLOCK_ENGINES[0];
    
    // Start latency measurement in background
    this.measureBlockEngineLatencies().catch(() => {});
    
    logger.info('Jito bundle sender initialized', { blockEngine: this.blockEngineUrl });
  }

  /**
   * Measure latency to all block engines and select fastest
   */
  private async measureBlockEngineLatencies(): Promise<void> {
    const results = await Promise.all(
      JITO_BLOCK_ENGINES.map(async (url) => {
        const start = Date.now();
        try {
          const response = await fetch(`${url}/api/v1/bundles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTipAccounts', params: [] }),
            signal: AbortSignal.timeout(5000),
          });
          if (response.ok) {
            return { url, latency: Date.now() - start };
          }
        } catch {
          // Ignore errors
        }
        return { url, latency: Infinity };
      })
    );

    for (const { url, latency } of results) {
      this.blockEngineLatencies.set(url, latency);
    }

    // Select fastest
    const fastest = results.reduce((best, current) => 
      current.latency < best.latency ? current : best
    );
    
    if (fastest.latency < Infinity) {
      this.blockEngineUrl = fastest.url;
      logger.info('Selected fastest block engine', { 
        url: fastest.url, 
        latencyMs: fastest.latency 
      });
    }
  }

  /**
   * Get block engine latencies
   */
  getBlockEngineLatencies(): Record<string, number> {
    return Object.fromEntries(this.blockEngineLatencies);
  }

  /**
   * Get next tip account (rotates through accounts)
   */
  private getNextTipAccount(): PublicKey {
    const account = JITO_TIP_ACCOUNTS[this.tipAccountIndex];
    this.tipAccountIndex = (this.tipAccountIndex + 1) % JITO_TIP_ACCOUNTS.length;
    return new PublicKey(account);
  }

  /**
   * Get all tip accounts
   */
  getTipAccounts(): PublicKey[] {
    return JITO_TIP_ACCOUNTS.map(a => new PublicKey(a));
  }

  /**
   * Create a tip instruction
   */
  createTipInstruction(
    payer: PublicKey,
    tipLamports: number,
    tipAccount?: PublicKey
  ): import('@solana/web3.js').TransactionInstruction {
    const recipient = tipAccount || this.getNextTipAccount();
    
    return SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipient,
      lamports: tipLamports,
    });
  }

  /**
   * Add tip to an existing transaction
   */
  async addTipToTransaction(
    transaction: VersionedTransaction,
    payer: Keypair,
    tipLamports: number
  ): Promise<VersionedTransaction> {
    // Deserialize the transaction message
    const message = transaction.message;
    
    // Get existing instructions
    const decompiledMessage = TransactionMessage.decompile(message);
    
    // Add tip instruction
    const tipIx = this.createTipInstruction(payer.publicKey, tipLamports);
    decompiledMessage.instructions.push(tipIx);
    
    // Recompile
    const { blockhash } = await this.connection.getLatestBlockhash();
    decompiledMessage.recentBlockhash = blockhash;
    
    const newMessage = decompiledMessage.compileToV0Message();
    const newTransaction = new VersionedTransaction(newMessage);
    newTransaction.sign([payer]);
    
    return newTransaction;
  }

  /**
   * Send a single transaction via Jito
   */
  async sendTransaction(
    transaction: VersionedTransaction,
    options: JitoSendOptions
  ): Promise<TransactionResult> {
    const serialized = Buffer.from(transaction.serialize()).toString('base64');
    
    try {
      const response = await fetch(`${this.blockEngineUrl}/api/v1/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sendTransaction',
          params: [serialized, { encoding: 'base64' }],
        }),
      });

      const data = await response.json() as JitoBundleResponse;
      
      if (data.error) {
        throw new Error(`Jito error: ${data.error.message}`);
      }

      const signature = data.result!;
      
      logger.info('Transaction sent via Jito', {
        signature: signature.slice(0, 16) + '...',
        tip: options.tipLamports,
      });

      // Wait for confirmation
      const result = await this.waitForConfirmation(signature);
      return result;
    } catch (error) {
      logger.error('Jito transaction failed', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Send a bundle of transactions via Jito
   */
  async sendBundle(
    transactions: VersionedTransaction[],
    options: JitoSendOptions
  ): Promise<TransactionResult[]> {
    if (transactions.length === 0) {
      throw new Error('Bundle must contain at least one transaction');
    }

    if (transactions.length > 5) {
      throw new Error('Jito bundles can contain at most 5 transactions');
    }

    const serializedTransactions = transactions.map(tx => 
      Buffer.from(tx.serialize()).toString('base64')
    );

    try {
      const response = await fetch(`${this.blockEngineUrl}/api/v1/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sendBundle',
          params: [serializedTransactions],
        }),
      });

      const data = await response.json() as JitoBundleResponse;
      
      if (data.error) {
        throw new Error(`Jito bundle error: ${data.error.message}`);
      }

      const bundleId = data.result!;
      
      logger.info('Bundle sent via Jito', {
        bundleId,
        transactionCount: transactions.length,
        tip: options.tipLamports,
      });

      // Wait for bundle confirmation
      const results = await this.waitForBundleConfirmation(bundleId, transactions.length);
      return results;
    } catch (error) {
      logger.error('Jito bundle failed', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(
    signature: string,
    timeoutMs: number = 60000
  ): Promise<TransactionResult> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const status = await this.connection.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      });

      if (status.value) {
        if (status.value.err) {
          return {
            signature,
            slot: status.value.slot || 0,
            confirmationStatus: status.value.confirmationStatus || 'processed',
            error: JSON.stringify(status.value.err),
            fee: 0,
          };
        }

        if (status.value.confirmationStatus === 'confirmed' || 
            status.value.confirmationStatus === 'finalized') {
          return {
            signature,
            slot: status.value.slot || 0,
            confirmationStatus: status.value.confirmationStatus,
            fee: 5000,
          };
        }
      }

      await sleep(1000);
    }

    return {
      signature,
      slot: 0,
      confirmationStatus: 'processed',
      error: 'Confirmation timeout',
      fee: 0,
    };
  }

  /**
   * Wait for bundle confirmation
   */
  private async waitForBundleConfirmation(
    bundleId: string,
    transactionCount: number,
    timeoutMs: number = 60000
  ): Promise<TransactionResult[]> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await fetch(`${this.blockEngineUrl}/api/v1/bundles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBundleStatuses',
            params: [[bundleId]],
          }),
        });

        const data = await response.json() as JitoBundleStatus;
        
        if (data.result?.value?.[0]) {
          const bundleStatus = data.result.value[0];
          
          if (bundleStatus.confirmation_status === 'confirmed' ||
              bundleStatus.confirmation_status === 'finalized') {
            
            return bundleStatus.transactions.map((sig, index) => ({
              signature: sig,
              slot: bundleStatus.slot,
              confirmationStatus: bundleStatus.confirmation_status as import('@solana/web3.js').TransactionConfirmationStatus,
              error: bundleStatus.err ? JSON.stringify(bundleStatus.err) : undefined,
              fee: 5000,
            }));
          }
        }
      } catch (error) {
        logger.debug('Bundle status check failed', { error: (error as Error).message });
      }

      await sleep(2000);
    }

    // Timeout - return empty results
    return Array(transactionCount).fill(null).map((_, i) => ({
      signature: '',
      slot: 0,
      confirmationStatus: 'processed' as import('@solana/web3.js').TransactionConfirmationStatus,
      error: 'Bundle confirmation timeout',
      fee: 0,
    }));
  }

  /**
   * Get bundle tip account
   */
  getTipAccount(): PublicKey {
    return this.getNextTipAccount();
  }

  /**
   * Get recommended tip amount based on priority
   */
  static getRecommendedTip(priority: 'low' | 'medium' | 'high' | 'turbo'): number {
    const tips = {
      low: 1_000, // 0.000001 SOL
      medium: 10_000, // 0.00001 SOL
      high: 100_000, // 0.0001 SOL
      turbo: 1_000_000, // 0.001 SOL
    };
    return tips[priority];
  }
}

/**
 * Create a Jito bundle sender
 */
export function createJitoBundleSender(
  connection: Connection,
  blockEngineUrl?: string
): JitoBundleSender {
  return new JitoBundleSender(connection, blockEngineUrl);
}
