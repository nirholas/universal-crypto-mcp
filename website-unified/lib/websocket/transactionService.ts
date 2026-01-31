/**
 * Transaction Service
 * 
 * Integrates transaction monitoring with WebSocket server
 * for real-time transaction and wallet updates
 */

import type { WalletUpdate, Block } from './types';
import { TransactionMonitor, createTransactionMonitor, type TrackedTransaction } from './transactionMonitor';
import { WebSocketServerInstance } from './server';

export interface TransactionServiceConfig {
  // Enable automatic transaction status checking
  autoStatusCheck: boolean;
  // Enable mempool monitoring
  mempoolMonitoring: boolean;
  // Chains to monitor
  chains: string[];
}

const DEFAULT_CONFIG: TransactionServiceConfig = {
  autoStatusCheck: true,
  mempoolMonitoring: true,
  chains: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base'],
};

export class TransactionService {
  private config: TransactionServiceConfig;
  private monitor: TransactionMonitor;
  private wsServer: WebSocketServerInstance | null = null;
  private isRunning = false;

  constructor(config: Partial<TransactionServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.monitor = createTransactionMonitor();

    // Set up handlers
    this.setupHandlers();
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Initialize with WebSocket server
   */
  initialize(wsServer: WebSocketServerInstance): void {
    this.wsServer = wsServer;

    // Register transaction-related handlers
    const router = wsServer.getRouter();

    // Track a transaction
    router.register('tx:track', async (message, connection) => {
      const { hash, chain, from, to, value, metadata } = message.payload as {
        hash: string;
        chain: string;
        from: string;
        to: string;
        value: string;
        metadata?: Record<string, unknown>;
      };

      const tx = this.monitor.trackTransaction(hash, chain, from, to, value, metadata);

      // Auto-subscribe the sender to this wallet
      this.monitor.subscribeToWallet(connection.id, [from]);

      return { tracked: true, transaction: tx };
    });

    // Get transaction status
    router.register('tx:status', async (message) => {
      const { hash } = message.payload as { hash: string };
      const tx = this.monitor.getTransaction(hash);

      if (!tx) {
        throw new Error(`Transaction not found: ${hash}`);
      }

      return tx;
    });

    // Subscribe to wallet
    router.register('wallet:subscribe', async (message, connection) => {
      const { addresses, chains, events } = message.payload as {
        addresses: string[];
        chains?: string[];
        events?: Array<'all' | 'transactions' | 'balances' | 'approvals'>;
      };

      this.monitor.subscribeToWallet(connection.id, addresses, { chains, events });

      // Get current pending transactions
      const pending = addresses.flatMap((addr) =>
        this.monitor.getPendingTransactions(addr)
      );

      return {
        subscribed: addresses,
        pendingTransactions: pending,
      };
    });

    // Unsubscribe from wallet
    router.register('wallet:unsubscribe', async (message, connection) => {
      const { addresses } = message.payload as { addresses?: string[] };
      this.monitor.unsubscribeFromWallet(connection.id, addresses);
      return { unsubscribed: addresses || 'all' };
    });

    // Get wallet transactions
    router.register('wallet:transactions', async (message) => {
      const { address, status } = message.payload as {
        address: string;
        status?: 'pending' | 'confirmed' | 'failed' | 'all';
      };

      let transactions = this.monitor.getWalletTransactions(address);

      if (status && status !== 'all') {
        transactions = transactions.filter((tx) => tx.status === status);
      }

      return transactions;
    });

    // Get pending transactions
    router.register('tx:pending', async (message) => {
      const { address } = message.payload as { address?: string };
      return this.monitor.getPendingTransactions(address);
    });

    // Get latest block
    router.register('block:latest', async (message) => {
      const { chain } = message.payload as { chain: string };
      const block = this.monitor.getLatestBlock(chain);

      if (!block) {
        throw new Error(`No block data for chain: ${chain}`);
      }

      return block;
    });

    console.log('[TxService] Initialized with WebSocket server');
  }

  /**
   * Setup event handlers
   */
  private setupHandlers(): void {
    // Transaction status change
    this.monitor.onStatusChange((tx, oldStatus) => {
      this.broadcastTransactionUpdate(tx, oldStatus);
    });

    // Wallet update
    this.monitor.onWalletUpdateHandler((update) => {
      this.broadcastWalletUpdate(update);
    });

    // New block
    this.monitor.onNewBlockHandler((block) => {
      this.broadcastBlock(block);
    });
  }

  /**
   * Start the service
   */
  start(): void {
    if (this.isRunning) return;

    if (this.config.autoStatusCheck) {
      this.monitor.start();
    }

    this.isRunning = true;
    console.log('[TxService] Started');
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (!this.isRunning) return;

    this.monitor.stop();
    this.isRunning = false;
    console.log('[TxService] Stopped');
  }

  // ============================================================================
  // Broadcasting
  // ============================================================================

  /**
   * Broadcast transaction update
   */
  private broadcastTransactionUpdate(
    tx: TrackedTransaction,
    oldStatus: string
  ): void {
    if (!this.wsServer) return;

    const message = {
      type: 'tx:update',
      success: true,
      data: {
        hash: tx.hash,
        chain: tx.chain,
        status: tx.status,
        previousStatus: oldStatus,
        confirmations: tx.confirmations,
        requiredConfirmations: tx.requiredConfirmations,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasUsed: tx.gasUsed,
        effectiveGasPrice: tx.effectiveGasPrice,
        error: tx.error,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    // Broadcast to transaction channel
    this.wsServer.broadcastToChannel(`tx:${tx.hash}`, message);

    // Also broadcast to wallet channels
    this.wsServer.broadcastToChannel(`wallet:${tx.from}`, message);
    if (tx.to !== tx.from) {
      this.wsServer.broadcastToChannel(`wallet:${tx.to}`, message);
    }
  }

  /**
   * Broadcast wallet update
   */
  private broadcastWalletUpdate(update: WalletUpdate): void {
    if (!this.wsServer) return;

    this.wsServer.broadcastToChannel(`wallet:${update.address}`, {
      type: 'wallet:update',
      success: true,
      data: update,
      timestamp: Date.now(),
    });
  }

  /**
   * Broadcast new block
   */
  private broadcastBlock(block: Block): void {
    if (!this.wsServer) return;

    this.wsServer.broadcastToChannel(`blocks:${block.chain}`, {
      type: 'block:new',
      success: true,
      data: block,
      timestamp: Date.now(),
    });
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Track a transaction programmatically
   */
  trackTransaction(
    hash: string,
    chain: string,
    from: string,
    to: string,
    value: string,
    metadata?: Record<string, unknown>
  ): TrackedTransaction {
    return this.monitor.trackTransaction(hash, chain, from, to, value, metadata);
  }

  /**
   * Update transaction status programmatically
   */
  updateTransactionStatus(
    hash: string,
    status: 'pending' | 'confirming' | 'confirmed' | 'failed' | 'dropped',
    data?: {
      confirmations?: number;
      gasUsed?: string;
      effectiveGasPrice?: string;
      error?: string;
    }
  ): void {
    this.monitor.updateStatus(hash, status, data);
  }

  /**
   * Process balance change
   */
  processBalanceChange(
    address: string,
    chain: string,
    token: string,
    previousBalance: string,
    newBalance: string,
    change: string
  ): void {
    this.monitor.processBalanceChange({
      address,
      chain,
      token,
      previousBalance,
      newBalance,
      change,
      timestamp: Date.now(),
    });
  }

  /**
   * Process new block
   */
  processNewBlock(block: Block): void {
    this.monitor.processNewBlock(block);
  }

  /**
   * Get monitor instance
   */
  getMonitor(): TransactionMonitor {
    return this.monitor;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      service: {
        isRunning: this.isRunning,
        chainsMonitored: this.config.chains.length,
      },
      monitor: this.monitor.getStats(),
    };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stop();
    this.monitor.cleanup();
  }
}

// Export singleton
export const transactionService = new TransactionService();

// Export factory
export function createTransactionService(
  config?: Partial<TransactionServiceConfig>
): TransactionService {
  return new TransactionService(config);
}
