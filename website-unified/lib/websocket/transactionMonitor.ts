/**
 * Transaction Monitor
 * 
 * Real-time transaction tracking with status updates,
 * confirmation monitoring, and wallet activity streaming
 */

import type {
  TransactionStatus,
  BalanceChange,
  WalletUpdate,
  Block,
} from './types';

export interface TransactionMonitorConfig {
  // Confirmation thresholds by chain
  confirmationThresholds: Record<string, number>;
  // Status check interval
  statusCheckInterval: number;
  // Maximum pending transactions per wallet
  maxPendingPerWallet: number;
  // Transaction timeout
  txTimeout: number;
  // Enable mempool monitoring
  mempoolMonitoring: boolean;
}

export interface TrackedTransaction {
  hash: string;
  chain: string;
  from: string;
  to: string;
  value: string;
  status: TransactionStatus['status'];
  confirmations: number;
  requiredConfirmations: number;
  submittedAt: number;
  confirmedAt?: number;
  failedAt?: number;
  gasUsed?: string;
  effectiveGasPrice?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface WalletSubscription {
  socketId: string;
  addresses: Set<string>;
  chains: Set<string>;
  events: Set<'all' | 'transactions' | 'balances' | 'approvals'>;
  subscribedAt: number;
}

const DEFAULT_CONFIG: TransactionMonitorConfig = {
  confirmationThresholds: {
    ethereum: 12,
    polygon: 128,
    arbitrum: 1,
    optimism: 1,
    base: 1,
    bsc: 15,
    avalanche: 1,
    solana: 32,
  },
  statusCheckInterval: 2000,
  maxPendingPerWallet: 100,
  txTimeout: 3600000, // 1 hour
  mempoolMonitoring: true,
};

export class TransactionMonitor {
  private config: TransactionMonitorConfig;
  private transactions: Map<string, TrackedTransaction> = new Map();
  private walletTransactions: Map<string, Set<string>> = new Map(); // wallet -> tx hashes
  private subscriptions: Map<string, WalletSubscription> = new Map();
  private addressSubscribers: Map<string, Set<string>> = new Map(); // address -> socketIds
  private statusCheckTimer: NodeJS.Timeout | null = null;
  private latestBlocks: Map<string, Block> = new Map();

  // Event handlers
  private onTxStatusChange: ((tx: TrackedTransaction, oldStatus: TransactionStatus['status']) => void) | null = null;
  private onWalletUpdate: ((update: WalletUpdate) => void) | null = null;
  private onNewBlock: ((block: Block) => void) | null = null;

  // Stats
  private stats = {
    totalTracked: 0,
    pendingTransactions: 0,
    confirmedTransactions: 0,
    failedTransactions: 0,
    activeWallets: 0,
  };

  constructor(config: Partial<TransactionMonitorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Start the transaction monitor
   */
  start(): void {
    if (this.statusCheckTimer) return;

    this.statusCheckTimer = setInterval(() => {
      this.checkPendingTransactions();
    }, this.config.statusCheckInterval);

    console.log('[TxMonitor] Started');
  }

  /**
   * Stop the transaction monitor
   */
  stop(): void {
    if (this.statusCheckTimer) {
      clearInterval(this.statusCheckTimer);
      this.statusCheckTimer = null;
    }
    console.log('[TxMonitor] Stopped');
  }

  // ============================================================================
  // Transaction Tracking
  // ============================================================================

  /**
   * Track a new transaction
   */
  trackTransaction(
    hash: string,
    chain: string,
    from: string,
    to: string,
    value: string,
    metadata?: Record<string, unknown>
  ): TrackedTransaction {
    const normalizedHash = hash.toLowerCase();
    const normalizedFrom = from.toLowerCase();
    const normalizedTo = to.toLowerCase();

    const tx: TrackedTransaction = {
      hash: normalizedHash,
      chain: chain.toLowerCase(),
      from: normalizedFrom,
      to: normalizedTo,
      value,
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: this.config.confirmationThresholds[chain.toLowerCase()] || 12,
      submittedAt: Date.now(),
      metadata,
    };

    this.transactions.set(normalizedHash, tx);

    // Index by wallet
    this.indexByWallet(normalizedFrom, normalizedHash);
    this.indexByWallet(normalizedTo, normalizedHash);

    this.stats.totalTracked++;
    this.stats.pendingTransactions++;
    this.updateActiveWallets();

    console.log(`[TxMonitor] Tracking: ${hash.substring(0, 10)}... on ${chain}`);

    return tx;
  }

  /**
   * Update transaction status
   */
  updateStatus(
    hash: string,
    status: TransactionStatus['status'],
    data: {
      confirmations?: number;
      gasUsed?: string;
      effectiveGasPrice?: string;
      error?: string;
      blockNumber?: number;
      blockHash?: string;
    } = {}
  ): void {
    const normalizedHash = hash.toLowerCase();
    const tx = this.transactions.get(normalizedHash);
    if (!tx) return;

    const oldStatus = tx.status;
    tx.status = status;

    if (data.confirmations !== undefined) {
      tx.confirmations = data.confirmations;
    }
    if (data.gasUsed) tx.gasUsed = data.gasUsed;
    if (data.effectiveGasPrice) tx.effectiveGasPrice = data.effectiveGasPrice;
    if (data.error) tx.error = data.error;

    // Handle status transitions
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      tx.confirmedAt = Date.now();
      this.stats.confirmedTransactions++;
      this.stats.pendingTransactions--;
    } else if (status === 'failed' && oldStatus !== 'failed') {
      tx.failedAt = Date.now();
      this.stats.failedTransactions++;
      this.stats.pendingTransactions--;
    }

    // Notify subscribers
    if (oldStatus !== status && this.onTxStatusChange) {
      this.onTxStatusChange(tx, oldStatus);
    }

    // Notify wallet subscribers
    this.notifyWalletSubscribers(tx);
  }

  /**
   * Get transaction by hash
   */
  getTransaction(hash: string): TrackedTransaction | undefined {
    return this.transactions.get(hash.toLowerCase());
  }

  /**
   * Get transactions for a wallet
   */
  getWalletTransactions(address: string): TrackedTransaction[] {
    const hashes = this.walletTransactions.get(address.toLowerCase());
    if (!hashes) return [];

    return Array.from(hashes)
      .map((h) => this.transactions.get(h))
      .filter((tx): tx is TrackedTransaction => tx !== undefined);
  }

  /**
   * Get pending transactions
   */
  getPendingTransactions(address?: string): TrackedTransaction[] {
    let transactions = Array.from(this.transactions.values());

    if (address) {
      const normalizedAddress = address.toLowerCase();
      transactions = transactions.filter(
        (tx) => tx.from === normalizedAddress || tx.to === normalizedAddress
      );
    }

    return transactions.filter((tx) => tx.status === 'pending');
  }

  // ============================================================================
  // Wallet Subscriptions
  // ============================================================================

  /**
   * Subscribe to wallet updates
   */
  subscribeToWallet(
    socketId: string,
    addresses: string[],
    options: {
      chains?: string[];
      events?: Array<'all' | 'transactions' | 'balances' | 'approvals'>;
    } = {}
  ): void {
    const normalizedAddresses = addresses.map((a) => a.toLowerCase());

    // Get or create subscription
    let subscription = this.subscriptions.get(socketId);
    if (!subscription) {
      subscription = {
        socketId,
        addresses: new Set(),
        chains: new Set(options.chains?.map((c) => c.toLowerCase()) || ['ethereum']),
        events: new Set(options.events || ['all']),
        subscribedAt: Date.now(),
      };
      this.subscriptions.set(socketId, subscription);
    }

    // Add addresses
    for (const address of normalizedAddresses) {
      subscription.addresses.add(address);

      // Add to address subscribers
      let subscribers = this.addressSubscribers.get(address);
      if (!subscribers) {
        subscribers = new Set();
        this.addressSubscribers.set(address, subscribers);
      }
      subscribers.add(socketId);
    }

    this.updateActiveWallets();
    console.log(`[TxMonitor] ${socketId} subscribed to wallets: ${normalizedAddresses.join(', ')}`);
  }

  /**
   * Unsubscribe from wallet updates
   */
  unsubscribeFromWallet(socketId: string, addresses?: string[]): void {
    const subscription = this.subscriptions.get(socketId);
    if (!subscription) return;

    const addressesToRemove = addresses
      ? addresses.map((a) => a.toLowerCase())
      : Array.from(subscription.addresses);

    for (const address of addressesToRemove) {
      subscription.addresses.delete(address);

      const subscribers = this.addressSubscribers.get(address);
      if (subscribers) {
        subscribers.delete(socketId);
        if (subscribers.size === 0) {
          this.addressSubscribers.delete(address);
        }
      }
    }

    if (subscription.addresses.size === 0) {
      this.subscriptions.delete(socketId);
    }

    this.updateActiveWallets();
  }

  /**
   * Remove subscriber completely
   */
  removeSubscriber(socketId: string): void {
    this.unsubscribeFromWallet(socketId);
  }

  // ============================================================================
  // Balance Updates
  // ============================================================================

  /**
   * Process balance change
   */
  processBalanceChange(change: BalanceChange): void {
    const normalizedAddress = change.address.toLowerCase();

    // Create wallet update
    const update: WalletUpdate = {
      address: normalizedAddress,
      chain: change.chain,
      type: 'balance',
      data: change,
      timestamp: Date.now(),
    };

    // Notify subscribers
    if (this.onWalletUpdate) {
      this.onWalletUpdate(update);
    }

    this.notifyAddressSubscribers(normalizedAddress, update);
  }

  /**
   * Process approval event
   */
  processApproval(
    address: string,
    chain: string,
    spender: string,
    token: string,
    amount: string
  ): void {
    const normalizedAddress = address.toLowerCase();

    const update: WalletUpdate = {
      address: normalizedAddress,
      chain,
      type: 'approval',
      data: {
        spender,
        token,
        amount,
      },
      timestamp: Date.now(),
    };

    if (this.onWalletUpdate) {
      this.onWalletUpdate(update);
    }

    this.notifyAddressSubscribers(normalizedAddress, update);
  }

  // ============================================================================
  // Block Updates
  // ============================================================================

  /**
   * Process new block
   */
  processNewBlock(block: Block): void {
    this.latestBlocks.set(block.chain, block);

    if (this.onNewBlock) {
      this.onNewBlock(block);
    }

    // Update confirmations for pending transactions on this chain
    for (const tx of this.transactions.values()) {
      if (tx.chain === block.chain && tx.status === 'pending') {
        // This would need actual block number from when tx was included
        // For now, just increment if we're simulating
        if (tx.confirmations > 0) {
          tx.confirmations++;

          if (tx.confirmations >= tx.requiredConfirmations) {
            this.updateStatus(tx.hash, 'confirmed', {
              confirmations: tx.confirmations,
            });
          }
        }
      }
    }
  }

  /**
   * Get latest block for chain
   */
  getLatestBlock(chain: string): Block | undefined {
    return this.latestBlocks.get(chain.toLowerCase());
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Index transaction by wallet
   */
  private indexByWallet(address: string, txHash: string): void {
    let txs = this.walletTransactions.get(address);
    if (!txs) {
      txs = new Set();
      this.walletTransactions.set(address, txs);
    }

    // Enforce max pending limit
    if (txs.size >= this.config.maxPendingPerWallet) {
      // Remove oldest
      const oldest = Array.from(txs)[0];
      txs.delete(oldest);
    }

    txs.add(txHash);
  }

  /**
   * Check pending transactions
   */
  private checkPendingTransactions(): void {
    const now = Date.now();

    for (const tx of this.transactions.values()) {
      if (tx.status !== 'pending') continue;

      // Check timeout
      if (now - tx.submittedAt > this.config.txTimeout) {
        this.updateStatus(tx.hash, 'failed', {
          error: 'Transaction timed out',
        });
        continue;
      }

      // Here you would actually check the blockchain for status
      // For now, this is a placeholder
    }
  }

  /**
   * Notify wallet subscribers about transaction
   */
  private notifyWalletSubscribers(tx: TrackedTransaction): void {
    const update: WalletUpdate = {
      address: tx.from,
      chain: tx.chain,
      type: 'transaction',
      data: {
        hash: tx.hash,
        status: tx.status,
        confirmations: tx.confirmations,
        requiredConfirmations: tx.requiredConfirmations,
      },
      timestamp: Date.now(),
    };

    // Notify from address subscribers
    this.notifyAddressSubscribers(tx.from, update);

    // Notify to address subscribers
    if (tx.to !== tx.from) {
      this.notifyAddressSubscribers(tx.to, {
        ...update,
        address: tx.to,
      });
    }
  }

  /**
   * Notify address subscribers
   */
  private notifyAddressSubscribers(address: string, update: WalletUpdate): void {
    const subscribers = this.addressSubscribers.get(address);
    if (!subscribers) return;

    // This would broadcast to specific sockets
    // For now, just call the general handler
    if (this.onWalletUpdate) {
      this.onWalletUpdate(update);
    }
  }

  /**
   * Update active wallets stat
   */
  private updateActiveWallets(): void {
    this.stats.activeWallets = this.addressSubscribers.size;
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Set transaction status change handler
   */
  onStatusChange(
    handler: (tx: TrackedTransaction, oldStatus: TransactionStatus['status']) => void
  ): void {
    this.onTxStatusChange = handler;
  }

  /**
   * Set wallet update handler
   */
  onWalletUpdateHandler(handler: (update: WalletUpdate) => void): void {
    this.onWalletUpdate = handler;
  }

  /**
   * Set new block handler
   */
  onNewBlockHandler(handler: (block: Block) => void): void {
    this.onNewBlock = handler;
  }

  // ============================================================================
  // Stats & Cleanup
  // ============================================================================

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      subscriptions: this.subscriptions.size,
      trackedAddresses: this.addressSubscribers.size,
      chainsMonitored: this.latestBlocks.size,
    };
  }

  /**
   * Cleanup old transactions
   */
  cleanupOldTransactions(maxAge: number = 86400000): number {
    const now = Date.now();
    let removed = 0;

    for (const [hash, tx] of this.transactions) {
      const age = now - (tx.confirmedAt || tx.failedAt || tx.submittedAt);
      if (age > maxAge && tx.status !== 'pending') {
        this.transactions.delete(hash);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Full cleanup
   */
  cleanup(): void {
    this.stop();
    this.transactions.clear();
    this.walletTransactions.clear();
    this.subscriptions.clear();
    this.addressSubscribers.clear();
    this.latestBlocks.clear();
  }
}

// Export singleton
export const transactionMonitor = new TransactionMonitor();

// Export factory
export function createTransactionMonitor(
  config?: Partial<TransactionMonitorConfig>
): TransactionMonitor {
  return new TransactionMonitor(config);
}
