/**
 * Price Feed Service
 * 
 * Integrates price feeds with WebSocket server for real-time streaming
 * with multi-source aggregation and caching
 */

import type { Price, PriceBatch, PriceUpdate, PriceSource } from './types';
import { PriceFeedManager, createPriceFeedManager } from './priceFeed';
import { WebSocketServerInstance } from './server';

export interface PriceSourceConfig {
  name: PriceSource;
  url: string;
  apiKey?: string;
  updateInterval: number;
  symbols: string[];
  priority: number;
  enabled: boolean;
}

export interface PriceFeedServiceConfig {
  // Sources to use
  sources: PriceSourceConfig[];
  // Cache TTL in ms
  cacheTTL: number;
  // Aggregation strategy
  aggregation: 'first' | 'average' | 'median' | 'weighted';
  // Fallback to cache on error
  fallbackToCache: boolean;
  // Rate limiting per source
  rateLimitPerSecond: number;
}

const DEFAULT_CONFIG: PriceFeedServiceConfig = {
  sources: [],
  cacheTTL: 5000,
  aggregation: 'median',
  fallbackToCache: true,
  rateLimitPerSecond: 10,
};

// Price cache entry
interface PriceCacheEntry {
  price: Price;
  source: PriceSource;
  fetchedAt: number;
  expiresAt: number;
}

export class PriceFeedService {
  private config: PriceFeedServiceConfig;
  private feedManager: PriceFeedManager;
  private wsServer: WebSocketServerInstance | null = null;
  private cache: Map<string, PriceCacheEntry> = new Map();
  private sourcePrices: Map<string, Map<PriceSource, Price>> = new Map();
  private fetchTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastFetch: Map<string, number> = new Map();
  private isRunning = false;

  constructor(config: Partial<PriceFeedServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.feedManager = createPriceFeedManager();

    // Set up broadcast handler
    this.feedManager.onBroadcastHandler((batch) => {
      this.broadcastPrices(batch);
    });
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Initialize with WebSocket server
   */
  initialize(wsServer: WebSocketServerInstance): void {
    this.wsServer = wsServer;

    // Register price-related handlers
    const router = wsServer.getRouter();

    router.register('prices:subscribe', async (message, connection) => {
      const { symbols, baseCurrency, filters } = message.payload as {
        symbols: string[];
        baseCurrency?: string;
        filters?: { minPrice?: number; maxPrice?: number; changeThreshold?: number };
      };

      this.feedManager.subscribe(connection.id, symbols, { baseCurrency, filters });

      // Send current prices immediately
      const currentPrices = this.feedManager.getPrices(symbols);
      return {
        subscribed: symbols,
        currentPrices: Array.from(currentPrices.values()),
      };
    });

    router.register('prices:unsubscribe', async (message, connection) => {
      const { symbols } = message.payload as { symbols?: string[] };
      this.feedManager.unsubscribe(connection.id, symbols);
      return { unsubscribed: symbols || 'all' };
    });

    router.register('prices:get', async (message) => {
      const { symbols } = message.payload as { symbols?: string[] };
      
      if (symbols) {
        const prices = this.feedManager.getPrices(symbols);
        return Array.from(prices.values());
      }
      
      return this.feedManager.getAllPrices();
    });

    router.register('prices:overview', async () => {
      return this.feedManager.getMarketOverview();
    });

    router.register('prices:gainers', async (message) => {
      const { limit } = message.payload as { limit?: number };
      return this.feedManager.getTopGainers(limit);
    });

    router.register('prices:losers', async (message) => {
      const { limit } = message.payload as { limit?: number };
      return this.feedManager.getTopLosers(limit);
    });

    console.log('[PriceService] Initialized with WebSocket server');
  }

  /**
   * Start the service
   */
  start(): void {
    if (this.isRunning) return;

    this.feedManager.start();
    this.startSourceFetching();
    this.isRunning = true;

    console.log('[PriceService] Started');
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (!this.isRunning) return;

    this.feedManager.stop();
    this.stopSourceFetching();
    this.isRunning = false;

    console.log('[PriceService] Stopped');
  }

  // ============================================================================
  // Source Fetching
  // ============================================================================

  /**
   * Start fetching from all sources
   */
  private startSourceFetching(): void {
    for (const source of this.config.sources) {
      if (!source.enabled) continue;

      const timer = setInterval(() => {
        this.fetchFromSource(source);
      }, source.updateInterval);

      this.fetchTimers.set(source.name, timer);

      // Initial fetch
      this.fetchFromSource(source);
    }
  }

  /**
   * Stop source fetching
   */
  private stopSourceFetching(): void {
    for (const timer of this.fetchTimers.values()) {
      clearInterval(timer);
    }
    this.fetchTimers.clear();
  }

  /**
   * Fetch prices from a source
   */
  private async fetchFromSource(source: PriceSourceConfig): Promise<void> {
    // Rate limiting
    const now = Date.now();
    const lastTime = this.lastFetch.get(source.name) || 0;
    const minInterval = 1000 / this.config.rateLimitPerSecond;

    if (now - lastTime < minInterval) {
      return;
    }

    this.lastFetch.set(source.name, now);

    try {
      const prices = await this.fetchPricesFromAPI(source);

      for (const price of prices) {
        // Store by source
        let symbolSources = this.sourcePrices.get(price.symbol);
        if (!symbolSources) {
          symbolSources = new Map();
          this.sourcePrices.set(price.symbol, symbolSources);
        }
        symbolSources.set(source.name, price);

        // Aggregate and update
        const aggregatedPrice = this.aggregatePrice(price.symbol);
        if (aggregatedPrice) {
          this.feedManager.updatePrice(price.symbol, aggregatedPrice);

          // Update cache
          this.cache.set(price.symbol, {
            price: { ...aggregatedPrice, symbol: price.symbol },
            source: source.name,
            fetchedAt: now,
            expiresAt: now + this.config.cacheTTL,
          });
        }
      }
    } catch (error) {
      console.error(`[PriceService] Error fetching from ${source.name}:`, error);

      // Fall back to cache
      if (this.config.fallbackToCache) {
        this.useCachedPrices(source.symbols);
      }
    }
  }

  /**
   * Fetch prices from API (mock implementation)
   */
  private async fetchPricesFromAPI(source: PriceSourceConfig): Promise<Price[]> {
    // This would be implemented to call actual APIs
    // For now, return mock data for demonstration
    
    const mockPrices: Price[] = source.symbols.map((symbol) => ({
      symbol,
      price: this.getMockPrice(symbol),
      currency: 'USD',
      timestamp: Date.now(),
      change24h: Math.random() * 200 - 100,
      change24hPercent: Math.random() * 10 - 5,
      volume24h: Math.random() * 1000000000,
      marketCap: Math.random() * 10000000000,
      high24h: 0,
      low24h: 0,
      source: source.name,
    }));

    return mockPrices;
  }

  /**
   * Get mock price for demo
   */
  private getMockPrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      BTC: 45000,
      ETH: 2500,
      SOL: 100,
      AVAX: 35,
      MATIC: 0.85,
      DOT: 7,
      LINK: 15,
      UNI: 6,
      AAVE: 90,
    };

    const base = basePrices[symbol] || 1;
    const variance = base * 0.001 * (Math.random() - 0.5);
    return base + variance;
  }

  /**
   * Aggregate price from multiple sources
   */
  private aggregatePrice(symbol: string): Omit<Price, 'symbol'> | null {
    const sources = this.sourcePrices.get(symbol);
    if (!sources || sources.size === 0) return null;

    const prices = Array.from(sources.values());

    switch (this.config.aggregation) {
      case 'first':
        return prices[0];

      case 'average': {
        const avg = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
        return { ...prices[0], price: avg };
      }

      case 'median': {
        const sorted = [...prices].sort((a, b) => a.price - b.price);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
          ? (sorted[mid - 1].price + sorted[mid].price) / 2
          : sorted[mid].price;
        return { ...prices[0], price: median };
      }

      case 'weighted': {
        // Weight by source priority
        const sourceConfigs = new Map(
          this.config.sources.map((s) => [s.name, s])
        );
        
        let totalWeight = 0;
        let weightedSum = 0;

        for (const price of prices) {
          const config = sourceConfigs.get(price.source as PriceSource);
          const weight = config ? 1 / (config.priority || 1) : 1;
          totalWeight += weight;
          weightedSum += price.price * weight;
        }

        return { ...prices[0], price: weightedSum / totalWeight };
      }

      default:
        return prices[0];
    }
  }

  /**
   * Use cached prices as fallback
   */
  private useCachedPrices(symbols: string[]): void {
    const now = Date.now();

    for (const symbol of symbols) {
      const cached = this.cache.get(symbol.toUpperCase());
      if (cached && cached.expiresAt > now) {
        this.feedManager.updatePrice(symbol, cached.price);
      }
    }
  }

  // ============================================================================
  // Broadcasting
  // ============================================================================

  /**
   * Broadcast price updates
   */
  private broadcastPrices(batch: PriceBatch): void {
    if (!this.wsServer) return;

    this.wsServer.broadcastToChannel('prices', {
      type: 'prices:update',
      success: true,
      data: batch,
      timestamp: Date.now(),
    });
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Manually update a price
   */
  updatePrice(symbol: string, price: Omit<Price, 'symbol'>): void {
    this.feedManager.updatePrice(symbol, price);
  }

  /**
   * Get current price
   */
  getPrice(symbol: string): Price | undefined {
    return this.feedManager.getPrice(symbol);
  }

  /**
   * Get feed manager
   */
  getFeedManager(): PriceFeedManager {
    return this.feedManager;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      service: {
        isRunning: this.isRunning,
        cachedSymbols: this.cache.size,
        sourcesActive: this.fetchTimers.size,
      },
      feed: this.feedManager.getStats(),
    };
  }

  /**
   * Add a price source
   */
  addSource(source: PriceSourceConfig): void {
    this.config.sources.push(source);

    if (this.isRunning && source.enabled) {
      const timer = setInterval(() => {
        this.fetchFromSource(source);
      }, source.updateInterval);

      this.fetchTimers.set(source.name, timer);
      this.fetchFromSource(source);
    }
  }

  /**
   * Remove a price source
   */
  removeSource(name: PriceSource): void {
    const timer = this.fetchTimers.get(name);
    if (timer) {
      clearInterval(timer);
      this.fetchTimers.delete(name);
    }

    this.config.sources = this.config.sources.filter((s) => s.name !== name);
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stop();
    this.feedManager.cleanup();
    this.cache.clear();
    this.sourcePrices.clear();
  }
}

// Export singleton
export const priceFeedService = new PriceFeedService();

// Export factory
export function createPriceFeedService(
  config?: Partial<PriceFeedServiceConfig>
): PriceFeedService {
  return new PriceFeedService(config);
}
