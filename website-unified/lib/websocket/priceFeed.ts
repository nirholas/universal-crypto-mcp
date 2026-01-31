/**
 * Price Feed Manager
 * 
 * Real-time cryptocurrency price streaming with batching,
 * deduplication, and multi-source aggregation
 */

import type {
  Price,
  PriceUpdate,
  PriceBatch,
  MarketOverview,
  PriceSource,
} from './types';

export interface PriceFeedConfig {
  // Update interval in ms
  updateInterval: number;
  // Maximum batch size
  maxBatchSize: number;
  // Price change threshold to trigger update (%)
  priceChangeThreshold: number;
  // Stale price timeout in ms
  stalePriceTimeout: number;
  // Enable deduplication
  enableDeduplication: boolean;
  // Sources to aggregate
  sources: PriceSource[];
}

export interface PriceSubscription {
  socketId: string;
  symbols: Set<string>;
  baseCurrency: string;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    changeThreshold?: number;
  };
  subscribedAt: number;
}

const DEFAULT_CONFIG: PriceFeedConfig = {
  updateInterval: 1000, // 1 second
  maxBatchSize: 100,
  priceChangeThreshold: 0.01, // 0.01%
  stalePriceTimeout: 60000, // 1 minute
  enableDeduplication: true,
  sources: ['aggregated'],
};

export class PriceFeedManager {
  private config: PriceFeedConfig;
  private prices: Map<string, Price> = new Map();
  private previousPrices: Map<string, number> = new Map();
  private subscriptions: Map<string, PriceSubscription> = new Map();
  private symbolSubscribers: Map<string, Set<string>> = new Map();
  private updateTimer: NodeJS.Timeout | null = null;
  private pendingUpdates: Map<string, PriceUpdate> = new Map();
  private marketOverview: MarketOverview | null = null;
  private onBroadcast: ((batch: PriceBatch) => void) | null = null;
  private onSymbolUpdate: ((symbol: string, price: Price) => void) | null = null;

  // Statistics
  private stats = {
    totalUpdates: 0,
    totalBroadcasts: 0,
    deduplicatedUpdates: 0,
    activeSymbols: 0,
  };

  constructor(config: Partial<PriceFeedConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Start the price feed manager
   */
  start(): void {
    if (this.updateTimer) return;

    this.updateTimer = setInterval(() => {
      this.processPendingUpdates();
    }, this.config.updateInterval);

    console.log(`[PriceFeed] Started with ${this.config.updateInterval}ms interval`);
  }

  /**
   * Stop the price feed manager
   */
  stop(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    console.log('[PriceFeed] Stopped');
  }

  // ============================================================================
  // Price Updates
  // ============================================================================

  /**
   * Update price for a symbol
   */
  updatePrice(symbol: string, price: Omit<Price, 'symbol'>): void {
    const normalizedSymbol = symbol.toUpperCase();
    const previousPrice = this.prices.get(normalizedSymbol);
    const prevValue = previousPrice?.price ?? 0;

    const newPrice: Price = {
      symbol: normalizedSymbol,
      ...price,
    };

    // Check if update is significant enough
    if (this.config.enableDeduplication && previousPrice) {
      const changePercent = Math.abs((price.price - prevValue) / prevValue) * 100;
      if (changePercent < this.config.priceChangeThreshold) {
        this.stats.deduplicatedUpdates++;
        return;
      }
    }

    // Store current price
    this.prices.set(normalizedSymbol, newPrice);
    this.previousPrices.set(normalizedSymbol, prevValue);

    // Create update event
    const update: PriceUpdate = {
      symbol: normalizedSymbol,
      price: newPrice,
      previousPrice: prevValue,
      change: price.price - prevValue,
      changePercent: prevValue > 0 ? ((price.price - prevValue) / prevValue) * 100 : 0,
      timestamp: Date.now(),
    };

    // Queue for batch broadcast
    this.pendingUpdates.set(normalizedSymbol, update);
    this.stats.totalUpdates++;

    // Notify symbol subscribers
    if (this.onSymbolUpdate) {
      this.onSymbolUpdate(normalizedSymbol, newPrice);
    }
  }

  /**
   * Batch update multiple prices
   */
  updatePrices(prices: Array<{ symbol: string } & Omit<Price, 'symbol'>>): void {
    for (const price of prices) {
      this.updatePrice(price.symbol, price);
    }
  }

  /**
   * Process pending updates and broadcast
   */
  private processPendingUpdates(): void {
    if (this.pendingUpdates.size === 0) return;

    // Group updates by subscriber
    const subscriberBatches = new Map<string, PriceUpdate[]>();

    for (const [symbol, update] of this.pendingUpdates) {
      const subscribers = this.symbolSubscribers.get(symbol);
      if (!subscribers) continue;

      for (const socketId of subscribers) {
        const subscription = this.subscriptions.get(socketId);
        if (!subscription) continue;

        // Apply filters
        if (subscription.filters) {
          if (
            subscription.filters.minPrice &&
            update.price.price < subscription.filters.minPrice
          ) continue;
          if (
            subscription.filters.maxPrice &&
            update.price.price > subscription.filters.maxPrice
          ) continue;
          if (
            subscription.filters.changeThreshold &&
            Math.abs(update.changePercent) < subscription.filters.changeThreshold
          ) continue;
        }

        let batch = subscriberBatches.get(socketId);
        if (!batch) {
          batch = [];
          subscriberBatches.set(socketId, batch);
        }
        batch.push(update);
      }
    }

    // Create batches for global broadcast
    const allUpdates = Array.from(this.pendingUpdates.values());
    if (allUpdates.length > 0 && this.onBroadcast) {
      const batch: PriceBatch = {
        updates: allUpdates.slice(0, this.config.maxBatchSize),
        timestamp: Date.now(),
        count: Math.min(allUpdates.length, this.config.maxBatchSize),
        source: 'aggregated',
      };
      this.onBroadcast(batch);
      this.stats.totalBroadcasts++;
    }

    // Clear pending updates
    this.pendingUpdates.clear();
    this.stats.activeSymbols = this.prices.size;
  }

  // ============================================================================
  // Subscriptions
  // ============================================================================

  /**
   * Subscribe to price updates
   */
  subscribe(
    socketId: string,
    symbols: string[],
    options: {
      baseCurrency?: string;
      filters?: PriceSubscription['filters'];
    } = {}
  ): void {
    const normalizedSymbols = symbols.map((s) => s.toUpperCase());
    
    // Get or create subscription
    let subscription = this.subscriptions.get(socketId);
    if (!subscription) {
      subscription = {
        socketId,
        symbols: new Set(),
        baseCurrency: options.baseCurrency || 'USD',
        filters: options.filters,
        subscribedAt: Date.now(),
      };
      this.subscriptions.set(socketId, subscription);
    }

    // Add symbols
    for (const symbol of normalizedSymbols) {
      subscription.symbols.add(symbol);

      // Add to symbol subscribers
      let subscribers = this.symbolSubscribers.get(symbol);
      if (!subscribers) {
        subscribers = new Set();
        this.symbolSubscribers.set(symbol, subscribers);
      }
      subscribers.add(socketId);
    }

    console.log(`[PriceFeed] ${socketId} subscribed to: ${normalizedSymbols.join(', ')}`);
  }

  /**
   * Unsubscribe from price updates
   */
  unsubscribe(socketId: string, symbols?: string[]): void {
    const subscription = this.subscriptions.get(socketId);
    if (!subscription) return;

    const symbolsToRemove = symbols
      ? symbols.map((s) => s.toUpperCase())
      : Array.from(subscription.symbols);

    for (const symbol of symbolsToRemove) {
      subscription.symbols.delete(symbol);

      const subscribers = this.symbolSubscribers.get(symbol);
      if (subscribers) {
        subscribers.delete(socketId);
        if (subscribers.size === 0) {
          this.symbolSubscribers.delete(symbol);
        }
      }
    }

    // Remove subscription if no symbols left
    if (subscription.symbols.size === 0) {
      this.subscriptions.delete(socketId);
    }

    console.log(`[PriceFeed] ${socketId} unsubscribed from: ${symbolsToRemove.join(', ')}`);
  }

  /**
   * Remove all subscriptions for a socket
   */
  removeSubscriber(socketId: string): void {
    this.unsubscribe(socketId);
  }

  // ============================================================================
  // Price Queries
  // ============================================================================

  /**
   * Get current price for a symbol
   */
  getPrice(symbol: string): Price | undefined {
    return this.prices.get(symbol.toUpperCase());
  }

  /**
   * Get prices for multiple symbols
   */
  getPrices(symbols: string[]): Map<string, Price> {
    const result = new Map<string, Price>();
    for (const symbol of symbols) {
      const price = this.prices.get(symbol.toUpperCase());
      if (price) {
        result.set(symbol.toUpperCase(), price);
      }
    }
    return result;
  }

  /**
   * Get all current prices
   */
  getAllPrices(): Price[] {
    return Array.from(this.prices.values());
  }

  /**
   * Get top gainers
   */
  getTopGainers(limit: number = 10): Price[] {
    return Array.from(this.prices.values())
      .filter((p) => (p.change24hPercent ?? p.changePercent24h) !== undefined && (p.change24hPercent ?? p.changePercent24h ?? 0) > 0)
      .sort((a, b) => (b.change24hPercent ?? b.changePercent24h ?? 0) - (a.change24hPercent ?? a.changePercent24h ?? 0))
      .slice(0, limit);
  }

  /**
   * Get top losers
   */
  getTopLosers(limit: number = 10): Price[] {
    return Array.from(this.prices.values())
      .filter((p) => (p.change24hPercent ?? p.changePercent24h) !== undefined && (p.change24hPercent ?? p.changePercent24h ?? 0) < 0)
      .sort((a, b) => (a.change24hPercent ?? a.changePercent24h ?? 0) - (b.change24hPercent ?? b.changePercent24h ?? 0))
      .slice(0, limit);
  }

  /**
   * Get market overview
   */
  getMarketOverview(): MarketOverview {
    const prices = Array.from(this.prices.values());
    const totalMarketCap = prices.reduce((sum, p) => sum + (p.marketCap ?? 0), 0);
    const totalVolume = prices.reduce((sum, p) => sum + (p.volume24h ?? 0), 0);
    
    const gainers = prices.filter((p) => (p.change24hPercent ?? p.changePercent24h ?? 0) > 0).length;
    const losers = prices.filter((p) => (p.change24hPercent ?? p.changePercent24h ?? 0) < 0).length;

    const btc = this.prices.get('BTC');
    const eth = this.prices.get('ETH');

    return {
      totalMarketCap,
      totalVolume24h: totalVolume,
      btcDominance: btc ? (btc.marketCap ?? 0) / totalMarketCap * 100 : 0,
      ethDominance: eth ? (eth.marketCap ?? 0) / totalMarketCap * 100 : 0,
      activeCoins: prices.length,
      gainers,
      losers,
      unchanged: prices.length - gainers - losers,
      lastUpdated: Date.now(),
    };
  }

  // ============================================================================
  // Stale Price Handling
  // ============================================================================

  /**
   * Get stale prices
   */
  getStalePrices(): Price[] {
    const now = Date.now();
    return Array.from(this.prices.values()).filter(
      (p) => now - p.timestamp > this.config.stalePriceTimeout
    );
  }

  /**
   * Remove stale prices
   */
  removeStale(): number {
    const stale = this.getStalePrices();
    for (const price of stale) {
      this.prices.delete(price.symbol);
      this.previousPrices.delete(price.symbol);
    }
    return stale.length;
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Set broadcast handler
   */
  onBroadcastHandler(handler: (batch: PriceBatch) => void): void {
    this.onBroadcast = handler;
  }

  /**
   * Set symbol update handler
   */
  onSymbolUpdateHandler(handler: (symbol: string, price: Price) => void): void {
    this.onSymbolUpdate = handler;
  }

  // ============================================================================
  // Statistics
  // ============================================================================

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      totalSubscriptions: this.subscriptions.size,
      uniqueSymbols: this.symbolSubscribers.size,
      pendingUpdates: this.pendingUpdates.size,
      pricesTracked: this.prices.size,
    };
  }

  /**
   * Update config
   */
  updateConfig(config: Partial<PriceFeedConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stop();
    this.prices.clear();
    this.previousPrices.clear();
    this.subscriptions.clear();
    this.symbolSubscribers.clear();
    this.pendingUpdates.clear();
  }
}

// Export singleton
export const priceFeedManager = new PriceFeedManager();

// Export factory
export function createPriceFeedManager(config?: Partial<PriceFeedConfig>): PriceFeedManager {
  return new PriceFeedManager(config);
}
