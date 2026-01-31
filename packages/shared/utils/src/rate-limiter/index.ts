/**
 * Token Bucket Rate Limiter
 * 
 * Implements a token bucket algorithm for rate limiting API calls.
 * Supports multiple buckets per key (e.g., per API endpoint or per user).
 * 
 * @module rate-limiter
 * @author nich <nich@nichxbt.com>
 */

export interface RateLimiterConfig {
  /** Maximum number of tokens in the bucket */
  maxTokens: number;
  /** Number of tokens to refill per interval */
  refillRate: number;
  /** Refill interval in milliseconds */
  refillInterval: number;
  /** Optional: Maximum wait time for acquiring a token (ms) */
  maxWaitTime?: number;
}

export interface RateLimiterBucket {
  tokens: number;
  lastRefill: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingTokens: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Token Bucket Rate Limiter
 * 
 * @example
 * ```typescript
 * const limiter = new RateLimiter({
 *   maxTokens: 100,
 *   refillRate: 10,
 *   refillInterval: 1000 // 10 tokens per second
 * });
 * 
 * const result = await limiter.acquire('api-key');
 * if (result.allowed) {
 *   // Make API call
 * } else {
 *   // Wait or reject
 *   console.log(`Retry after ${result.retryAfter}ms`);
 * }
 * ```
 */
export class RateLimiter {
  private config: Required<RateLimiterConfig>;
  private buckets: Map<string, RateLimiterBucket> = new Map();

  constructor(config: RateLimiterConfig) {
    this.config = {
      maxTokens: config.maxTokens,
      refillRate: config.refillRate,
      refillInterval: config.refillInterval,
      maxWaitTime: config.maxWaitTime ?? 30000,
    };
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillBucket(bucket: RateLimiterBucket): void {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    const intervalsElapsed = Math.floor(elapsed / this.config.refillInterval);
    
    if (intervalsElapsed > 0) {
      const tokensToAdd = intervalsElapsed * this.config.refillRate;
      bucket.tokens = Math.min(this.config.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  /**
   * Get or create a bucket for the given key
   */
  private getBucket(key: string): RateLimiterBucket {
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = {
        tokens: this.config.maxTokens,
        lastRefill: Date.now(),
      };
      this.buckets.set(key, bucket);
    }
    return bucket;
  }

  /**
   * Try to acquire a token immediately (non-blocking)
   */
  tryAcquire(key: string = 'default', tokens: number = 1): RateLimitResult {
    const bucket = this.getBucket(key);
    this.refillBucket(bucket);

    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return {
        allowed: true,
        remainingTokens: bucket.tokens,
        resetTime: bucket.lastRefill + this.config.refillInterval,
      };
    }

    const tokensNeeded = tokens - bucket.tokens;
    const intervalsNeeded = Math.ceil(tokensNeeded / this.config.refillRate);
    const retryAfter = intervalsNeeded * this.config.refillInterval;

    return {
      allowed: false,
      remainingTokens: bucket.tokens,
      resetTime: bucket.lastRefill + this.config.refillInterval,
      retryAfter,
    };
  }

  /**
   * Acquire a token, waiting if necessary
   */
  async acquire(key: string = 'default', tokens: number = 1): Promise<RateLimitResult> {
    const startTime = Date.now();

    while (true) {
      const result = this.tryAcquire(key, tokens);
      
      if (result.allowed) {
        return result;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed + (result.retryAfter ?? 0) > this.config.maxWaitTime) {
        return result;
      }

      // Wait for the retry period
      await this.sleep(Math.min(result.retryAfter ?? 100, this.config.maxWaitTime - elapsed));
    }
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string = 'default'): { tokens: number; maxTokens: number; refillRate: number } {
    const bucket = this.getBucket(key);
    this.refillBucket(bucket);
    return {
      tokens: bucket.tokens,
      maxTokens: this.config.maxTokens,
      refillRate: this.config.refillRate,
    };
  }

  /**
   * Reset a specific bucket
   */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  /**
   * Reset all buckets
   */
  resetAll(): void {
    this.buckets.clear();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Sliding Window Rate Limiter
 * 
 * More accurate than token bucket for strict rate limits.
 * Tracks individual request timestamps.
 */
export class SlidingWindowRateLimiter {
  private windows: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowSize: number;

  constructor(config: { maxRequests: number; windowSizeMs: number }) {
    this.maxRequests = config.maxRequests;
    this.windowSize = config.windowSizeMs;
  }

  /**
   * Check if request is allowed and record it
   */
  tryAcquire(key: string = 'default'): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    
    let timestamps = this.windows.get(key) ?? [];
    
    // Remove expired timestamps
    timestamps = timestamps.filter(t => t > windowStart);
    
    if (timestamps.length < this.maxRequests) {
      timestamps.push(now);
      this.windows.set(key, timestamps);
      
      return {
        allowed: true,
        remainingTokens: this.maxRequests - timestamps.length,
        resetTime: timestamps[0] + this.windowSize,
      };
    }

    const oldestTimestamp = timestamps[0];
    const retryAfter = oldestTimestamp + this.windowSize - now;

    return {
      allowed: false,
      remainingTokens: 0,
      resetTime: oldestTimestamp + this.windowSize,
      retryAfter,
    };
  }

  /**
   * Acquire with waiting
   */
  async acquire(key: string = 'default', maxWaitTime: number = 30000): Promise<RateLimitResult> {
    const startTime = Date.now();

    while (true) {
      const result = this.tryAcquire(key);
      
      if (result.allowed) {
        return result;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed + (result.retryAfter ?? 0) > maxWaitTime) {
        return result;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(result.retryAfter ?? 100, maxWaitTime - elapsed)));
    }
  }

  reset(key: string): void {
    this.windows.delete(key);
  }

  resetAll(): void {
    this.windows.clear();
  }
}

/**
 * Pre-configured rate limiters for common APIs
 */
export const API_RATE_LIMITS = {
  // CoinGecko: 10-50 calls/minute depending on plan
  coingecko: { maxTokens: 10, refillRate: 10, refillInterval: 60000 },
  coingeckoPro: { maxTokens: 500, refillRate: 500, refillInterval: 60000 },
  
  // Etherscan: 5 calls/second for free tier
  etherscan: { maxTokens: 5, refillRate: 5, refillInterval: 1000 },
  etherscanPro: { maxTokens: 10, refillRate: 10, refillInterval: 1000 },
  
  // Dune: 40 calls/minute
  dune: { maxTokens: 40, refillRate: 40, refillInterval: 60000 },
  
  // Generic exchanges (conservative)
  exchange: { maxTokens: 10, refillRate: 10, refillInterval: 1000 },
  exchangePublic: { maxTokens: 20, refillRate: 20, refillInterval: 1000 },
  
  // Bitget: 10 requests/second
  bitget: { maxTokens: 10, refillRate: 10, refillInterval: 1000 },
  
  // Gate.io: 300 requests/minute for public API
  gateio: { maxTokens: 300, refillRate: 300, refillInterval: 60000 },
  
  // CryptoCompare: 100,000 calls/month for free
  cryptocompare: { maxTokens: 50, refillRate: 50, refillInterval: 60000 },
} as const;

/**
 * Create a rate limiter for a specific API
 */
export function createApiRateLimiter(
  api: keyof typeof API_RATE_LIMITS | RateLimiterConfig
): RateLimiter {
  const config = typeof api === 'string' ? API_RATE_LIMITS[api] : api;
  return new RateLimiter(config);
}

/**
 * Rate limiter registry for managing multiple limiters
 */
export class RateLimiterRegistry {
  private limiters: Map<string, RateLimiter> = new Map();

  /**
   * Get or create a rate limiter for an API
   */
  get(name: string, config?: RateLimiterConfig): RateLimiter {
    let limiter = this.limiters.get(name);
    if (!limiter) {
      const defaultConfig = (API_RATE_LIMITS as Record<string, RateLimiterConfig>)[name] 
        ?? config 
        ?? API_RATE_LIMITS.exchange;
      limiter = new RateLimiter(defaultConfig);
      this.limiters.set(name, limiter);
    }
    return limiter;
  }

  /**
   * Acquire a token from a named limiter
   */
  async acquire(name: string, key?: string): Promise<RateLimitResult> {
    return this.get(name).acquire(key);
  }

  /**
   * Try to acquire without waiting
   */
  tryAcquire(name: string, key?: string): RateLimitResult {
    return this.get(name).tryAcquire(key);
  }
}

// Global registry instance
export const rateLimiters = new RateLimiterRegistry();
