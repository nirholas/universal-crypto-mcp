/**
 * DeFiLlama Yields API Client
 * 
 * Production-grade API client with:
 * - Automatic retries with exponential backoff
 * - Rate limiting to respect API limits
 * - Intelligent caching with TTL
 * - Comprehensive error handling
 * - Request deduplication
 */

import { YieldPool, YieldHistoryPoint } from '../types';

const BASE_URL = 'https://yields.llama.fi';

// Configuration
const CONFIG = {
  maxRetries: 3,
  initialRetryDelay: 1000,
  maxRetryDelay: 10000,
  requestTimeout: 30000,
  rateLimitPerSecond: 5,
  cache: {
    poolsTTL: 5 * 60 * 1000,      // 5 minutes
    poolDetailsTTL: 5 * 60 * 1000, // 5 minutes
    historyTTL: 15 * 60 * 1000,    // 15 minutes
  },
};

// Cache implementation with TTL and size limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: T, ttlMs: number): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Rate limiter using token bucket algorithm
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;

  constructor(requestsPerSecond: number) {
    this.maxTokens = requestsPerSecond;
    this.tokens = requestsPerSecond;
    this.refillRate = requestsPerSecond;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate * 1000;
      await this.sleep(waitTime);
      this.refill();
    }
    
    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Request deduplication
class RequestDeduplicator {
  private pending = new Map<string, Promise<unknown>>();

  async dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, promise);
    return promise;
  }
}

// Custom error classes
export class DefiLlamaAPIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'DefiLlamaAPIError';
  }
}

export class DefiLlamaRateLimitError extends DefiLlamaAPIError {
  constructor(endpoint: string) {
    super('Rate limit exceeded', 429, endpoint, true);
    this.name = 'DefiLlamaRateLimitError';
  }
}

export class DefiLlamaTimeoutError extends DefiLlamaAPIError {
  constructor(endpoint: string) {
    super('Request timeout', undefined, endpoint, true);
    this.name = 'DefiLlamaTimeoutError';
  }
}

export class DefiLlamaClient {
  private static instance: DefiLlamaClient;
  private readonly cache: LRUCache<unknown>;
  private readonly rateLimiter: RateLimiter;
  private readonly deduplicator: RequestDeduplicator;

  constructor() {
    this.cache = new LRUCache(1000);
    this.rateLimiter = new RateLimiter(CONFIG.rateLimitPerSecond);
    this.deduplicator = new RequestDeduplicator();
  }

  static getInstance(): DefiLlamaClient {
    if (!DefiLlamaClient.instance) {
      DefiLlamaClient.instance = new DefiLlamaClient();
    }
    return DefiLlamaClient.instance;
  }

  /**
   * Make an HTTP request with retries and error handling
   */
  private async request<T>(endpoint: string, options: { ttl: number }): Promise<T> {
    const cacheKey = `defillama:${endpoint}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey) as T | null;
    if (cached !== null) {
      return cached;
    }

    // Deduplicate concurrent requests
    return this.deduplicator.dedupe(cacheKey, async () => {
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < CONFIG.maxRetries; attempt++) {
        try {
          // Rate limiting
          await this.rateLimiter.acquire();
          
          // Make request with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);
          
          const response = await fetch(`${BASE_URL}${endpoint}`, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'boosty-mcp-yields/0.1.0',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (response.status === 429) {
            throw new DefiLlamaRateLimitError(endpoint);
          }
          
          if (!response.ok) {
            const retryable = response.status >= 500 || response.status === 429;
            throw new DefiLlamaAPIError(
              `API error: ${response.status} ${response.statusText}`,
              response.status,
              endpoint,
              retryable
            );
          }
          
          const rawData = await response.json() as Record<string, unknown>;
          const result = (rawData.data ?? rawData) as T;
          
          // Cache successful response
          this.cache.set(cacheKey, result, options.ttl);
          
          return result;
        } catch (error) {
          lastError = error as Error;
          
          // Handle abort/timeout
          if (error instanceof Error && error.name === 'AbortError') {
            lastError = new DefiLlamaTimeoutError(endpoint);
          }
          
          // Check if retryable
          const isRetryable = 
            lastError instanceof DefiLlamaAPIError && lastError.retryable ||
            lastError instanceof DefiLlamaTimeoutError;
          
          if (!isRetryable || attempt === CONFIG.maxRetries - 1) {
            throw lastError;
          }
          
          // Exponential backoff
          const delay = Math.min(
            CONFIG.initialRetryDelay * Math.pow(2, attempt),
            CONFIG.maxRetryDelay
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw lastError || new Error('Unknown error');
    });
  }

  /**
   * Get all yield pools
   * Cache: 5 minutes
   */
  async getYields(): Promise<YieldPool[]> {
    const data = await this.request<YieldPool[]>('/pools', {
      ttl: CONFIG.cache.poolsTTL,
    });
    return Array.isArray(data) ? data : [];
  }

  /**
   * Get a specific pool by ID
   * Cache: 5 minutes
   */
  async getPool(poolId: string): Promise<YieldPool | null> {
    if (!poolId || typeof poolId !== 'string') {
      throw new DefiLlamaAPIError('Invalid poolId provided');
    }

    const pools = await this.getYields();
    const pool = pools.find(p => p.pool === poolId);
    return pool || null;
  }

  /**
   * Get yield history for a pool
   * Cache: 15 minutes
   */
  async getHistory(poolId: string): Promise<YieldHistoryPoint[]> {
    if (!poolId || typeof poolId !== 'string') {
      throw new DefiLlamaAPIError('Invalid poolId provided');
    }

    const data = await this.request<YieldHistoryPoint[]>(`/chart/${poolId}`, {
      ttl: CONFIG.cache.historyTTL,
    });
    return Array.isArray(data) ? data : [];
  }

  /**
   * Get pools filtered by chain
   */
  async getPoolsByChain(chain: string): Promise<YieldPool[]> {
    const pools = await this.getYields();
    return pools.filter(p => p.chain.toLowerCase() === chain.toLowerCase());
  }

  /**
   * Get pools filtered by protocol/project
   */
  async getPoolsByProtocol(protocol: string): Promise<YieldPool[]> {
    const pools = await this.getYields();
    return pools.filter(p => p.project.toLowerCase() === protocol.toLowerCase());
  }

  /**
   * Get stablecoin pools
   */
  async getStablecoinPools(): Promise<YieldPool[]> {
    const pools = await this.getYields();
    return pools.filter(p => p.stablecoin === true);
  }

  /**
   * Search pools by token symbol
   */
  async searchByToken(tokenSymbol: string): Promise<YieldPool[]> {
    const pools = await this.getYields();
    const upperSymbol = tokenSymbol.toUpperCase();
    
    return pools.filter(p => {
      // Check symbol
      if (p.symbol.toUpperCase().includes(upperSymbol)) {
        return true;
      }
      // Check underlying tokens
      if (p.underlyingTokens?.some(t => t.toUpperCase().includes(upperSymbol))) {
        return true;
      }
      return false;
    });
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number } {
    return { size: this.cache.size() };
  }
}

export const defiLlamaClient = DefiLlamaClient.getInstance();
