/**
 * Event Monitoring and Notifications
 * 
 * Real-time blockchain event monitoring with customizable alerts
 * and notification handlers for DeFi operations.
 */

import {
  createPublicClient,
  http,
  type PublicClient,
  type Address,
  type Log,
  type WatchEventParameters,
} from "viem";

/**
 * Event subscription configuration
 */
export interface EventSubscription {
  id: string;
  eventName: string;
  contractAddress?: Address;
  filters?: Record<string, any>;
  callback: (log: Log) => void | Promise<void>;
  active: boolean;
}

/**
 * Price alert configuration
 */
export interface PriceAlert {
  id: string;
  pair: string;
  targetPrice: number;
  condition: "above" | "below" | "crosses";
  callback: (price: number) => void | Promise<void>;
  active: boolean;
  triggered: boolean;
}

/**
 * Transaction status
 */
export type TransactionStatus = "pending" | "confirmed" | "failed" | "dropped";

/**
 * Transaction notification
 */
export interface TransactionNotification {
  txHash: string;
  status: TransactionStatus;
  confirmations: number;
  timestamp: number;
  gasUsed?: bigint;
  effectiveGasPrice?: bigint;
}

/**
 * Event Monitor - Real-time blockchain event tracking
 */
export class EventMonitor {
  private publicClient: PublicClient;
  private subscriptions: Map<string, EventSubscription> = new Map();
  private priceAlerts: Map<string, PriceAlert> = new Map();
  private watchedTransactions: Map<string, {
    startTime: number;
    callbacks: Array<(notification: TransactionNotification) => void>;
  }> = new Map();
  private unwatchFunctions: Map<string, () => void> = new Map();

  constructor(chainId: number, rpcUrl?: string) {
    const chains: Record<number, any> = {
      1: require("viem/chains").mainnet,
      42161: require("viem/chains").arbitrum,
      10: require("viem/chains").optimism,
      8453: require("viem/chains").base,
      137: require("viem/chains").polygon,
      56: require("viem/chains").bsc,
    };

    const chain = chains[chainId];
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    this.publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }

  /**
   * Subscribe to ERC20 Transfer events
   */
  async watchTransfers(
    tokenAddress: Address,
    callback: (from: Address, to: Address, amount: bigint) => void
  ): Promise<string> {
    const id = `transfer_${tokenAddress}_${Date.now()}`;

    const transferEvent = {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    } as const;

    const unwatch = this.publicClient.watchEvent({
      address: tokenAddress,
      event: transferEvent,
      onLogs: (logs) => {
        logs.forEach((log) => {
          if (log.args.from && log.args.to && log.args.value !== undefined) {
            callback(log.args.from, log.args.to, log.args.value);
          }
        });
      },
    });

    this.unwatchFunctions.set(id, unwatch);

    return id;
  }

  /**
   * Subscribe to Swap events from DEX
   */
  async watchSwaps(
    poolAddress: Address,
    callback: (sender: Address, amount0In: bigint, amount1In: bigint, amount0Out: bigint, amount1Out: bigint) => void
  ): Promise<string> {
    const id = `swap_${poolAddress}_${Date.now()}`;

    const swapEvent = {
      anonymous: false,
      inputs: [
        { indexed: true, name: "sender", type: "address" },
        { indexed: false, name: "amount0In", type: "uint256" },
        { indexed: false, name: "amount1In", type: "uint256" },
        { indexed: false, name: "amount0Out", type: "uint256" },
        { indexed: false, name: "amount1Out", type: "uint256" },
        { indexed: true, name: "to", type: "address" },
      ],
      name: "Swap",
      type: "event",
    } as const;

    const unwatch = this.publicClient.watchEvent({
      address: poolAddress,
      event: swapEvent,
      onLogs: (logs) => {
        logs.forEach((log) => {
          if (log.args.sender && log.args.amount0In !== undefined && log.args.amount1In !== undefined && 
              log.args.amount0Out !== undefined && log.args.amount1Out !== undefined) {
            callback(
              log.args.sender,
              log.args.amount0In,
              log.args.amount1In,
              log.args.amount0Out,
              log.args.amount1Out
            );
          }
        });
      },
    });

    this.unwatchFunctions.set(id, unwatch);

    return id;
  }

  /**
   * Watch for price changes
   */
  async createPriceAlert(
    pair: string,
    targetPrice: number,
    condition: "above" | "below" | "crosses",
    callback: (price: number) => void
  ): Promise<string> {
    const id = `price_${pair}_${Date.now()}`;

    const alert: PriceAlert = {
      id,
      pair,
      targetPrice,
      condition,
      callback,
      active: true,
      triggered: false,
    };

    this.priceAlerts.set(id, alert);

    return id;
  }

  /**
   * Check price alerts (should be called periodically)
   */
  async checkPriceAlerts(currentPrices: Record<string, number>): Promise<void> {
    for (const [id, alert] of this.priceAlerts.entries()) {
      if (!alert.active || alert.triggered) continue;

      const currentPrice = currentPrices[alert.pair];
      if (currentPrice === undefined) continue;

      let shouldTrigger = false;

      switch (alert.condition) {
        case "above":
          shouldTrigger = currentPrice > alert.targetPrice;
          break;
        case "below":
          shouldTrigger = currentPrice < alert.targetPrice;
          break;
        case "crosses":
          // This requires tracking previous price - simplified for now
          shouldTrigger = Math.abs(currentPrice - alert.targetPrice) < alert.targetPrice * 0.01;
          break;
      }

      if (shouldTrigger) {
        alert.triggered = true;
        await alert.callback(currentPrice);
      }
    }
  }

  /**
   * Track transaction status
   */
  async watchTransaction(
    txHash: `0x${string}`,
    callback: (notification: TransactionNotification) => void,
    requiredConfirmations: number = 1
  ): Promise<void> {
    this.watchedTransactions.set(txHash, {
      startTime: Date.now(),
      callbacks: [callback],
    });

    // Poll for transaction receipt
    const checkStatus = async () => {
      try {
        const receipt = await this.publicClient.getTransactionReceipt({ hash: txHash });

        if (receipt) {
          const currentBlock = await this.publicClient.getBlockNumber();
          const confirmations = Number(currentBlock - receipt.blockNumber);

          const notification: TransactionNotification = {
            txHash,
            status: receipt.status === "success" ? "confirmed" : "failed",
            confirmations,
            timestamp: Date.now(),
            gasUsed: receipt.gasUsed,
            effectiveGasPrice: receipt.effectiveGasPrice,
          };

          const watched = this.watchedTransactions.get(txHash);
          if (watched) {
            watched.callbacks.forEach(cb => cb(notification));

            // Clean up if enough confirmations
            if (confirmations >= requiredConfirmations) {
              this.watchedTransactions.delete(txHash);
            }
          }
        } else {
          // Check if transaction is dropped (after 5 minutes)
          const watched = this.watchedTransactions.get(txHash);
          if (watched && Date.now() - watched.startTime > 300000) {
            const notification: TransactionNotification = {
              txHash,
              status: "dropped",
              confirmations: 0,
              timestamp: Date.now(),
            };

            watched.callbacks.forEach(cb => cb(notification));
            this.watchedTransactions.delete(txHash);
          } else {
            // Check again in 5 seconds
            setTimeout(checkStatus, 5000);
          }
        }
      } catch (error) {
        // Retry on error
        setTimeout(checkStatus, 5000);
      }
    };

    checkStatus();
  }

  /**
   * Subscribe to new blocks
   */
  async watchBlocks(
    callback: (blockNumber: bigint, timestamp: bigint) => void
  ): Promise<string> {
    const id = `blocks_${Date.now()}`;

    const unwatch = this.publicClient.watchBlocks({
      onBlock: async (block) => {
        callback(block.number!, block.timestamp);
      },
    });

    this.unwatchFunctions.set(id, unwatch);

    return id;
  }

  /**
   * Watch for large transactions (whale watching)
   */
  async watchLargeTransfers(
    tokenAddress: Address,
    minAmount: bigint,
    callback: (from: Address, to: Address, amount: bigint) => void
  ): Promise<string> {
    return this.watchTransfers(tokenAddress, (from, to, amount) => {
      if (amount >= minAmount) {
        callback(from, to, amount);
      }
    });
  }

  /**
   * Unsubscribe from event
   */
  unsubscribe(id: string): void {
    const unwatch = this.unwatchFunctions.get(id);
    if (unwatch) {
      unwatch();
      this.unwatchFunctions.delete(id);
    }

    this.priceAlerts.delete(id);
  }

  /**
   * Unsubscribe from all events
   */
  unsubscribeAll(): void {
    this.unwatchFunctions.forEach((unwatch) => unwatch());
    this.unwatchFunctions.clear();
    this.priceAlerts.clear();
  }

  /**
   * Get active subscriptions
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.unwatchFunctions.keys());
  }

  /**
   * Get active price alerts
   */
  getActivePriceAlerts(): PriceAlert[] {
    return Array.from(this.priceAlerts.values()).filter(alert => alert.active);
  }
}

/**
 * Event aggregator for multiple chains
 */
export class MultiChainEventMonitor {
  private monitors: Map<number, EventMonitor> = new Map();

  /**
   * Add chain to monitor
   */
  addChain(chainId: number, rpcUrl?: string): void {
    if (!this.monitors.has(chainId)) {
      this.monitors.set(chainId, new EventMonitor(chainId, rpcUrl));
    }
  }

  /**
   * Get monitor for specific chain
   */
  getMonitor(chainId: number): EventMonitor | undefined {
    return this.monitors.get(chainId);
  }

  /**
   * Watch transfers across multiple chains
   */
  async watchTransfersAcrossChains(
    chainTokenMap: Map<number, Address>,
    callback: (chainId: number, from: Address, to: Address, amount: bigint) => void
  ): Promise<Map<number, string>> {
    const subscriptionIds = new Map<number, string>();

    for (const [chainId, tokenAddress] of chainTokenMap.entries()) {
      const monitor = this.monitors.get(chainId);
      if (monitor) {
        const id = await monitor.watchTransfers(tokenAddress, (from, to, amount) => {
          callback(chainId, from, to, amount);
        });
        subscriptionIds.set(chainId, id);
      }
    }

    return subscriptionIds;
  }

  /**
   * Clean up all monitors
   */
  cleanup(): void {
    this.monitors.forEach(monitor => monitor.unsubscribeAll());
    this.monitors.clear();
  }
}

/**
 * Create event monitor for specific chain
 */
export function createEventMonitor(chainId: number, rpcUrl?: string): EventMonitor {
  return new EventMonitor(chainId, rpcUrl);
}
