/**
 * Token bucket rate limiter options
 */
export interface RateLimiterOptions {
  /** Maximum tokens in the bucket */
  maxTokens: number;
  /** Tokens added per second */
  refillRate: number;
  /** Initial tokens (defaults to maxTokens) */
  initialTokens?: number;
}

/**
 * Token bucket rate limiter
 * 
 * Implements the token bucket algorithm for rate limiting.
 * Tokens are added to the bucket at a fixed rate, and each
 * request consumes one token.
 */
export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefillTime: number;

  /**
   * Create a new rate limiter
   * @param options - Rate limiter configuration
   */
  constructor(options: RateLimiterOptions) {
    this.maxTokens = options.maxTokens;
    this.refillRate = options.refillRate;
    this.tokens = options.initialTokens ?? options.maxTokens;
    this.lastRefillTime = Date.now();
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefillTime) / 1000; // Convert to seconds
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  /**
   * Try to acquire a token without waiting
   * @param tokens - Number of tokens to acquire (default: 1)
   * @returns True if tokens were acquired, false otherwise
   */
  tryAcquire(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  /**
   * Acquire a token, waiting if necessary
   * @param tokens - Number of tokens to acquire (default: 1)
   * @param timeoutMs - Maximum time to wait in milliseconds (default: 30000)
   * @throws Error if timeout is reached
   */
  async acquire(tokens: number = 1, timeoutMs: number = 30_000): Promise<void> {
    const startTime = Date.now();

    while (true) {
      if (this.tryAcquire(tokens)) {
        return;
      }

      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Rate limiter timeout: could not acquire ${tokens} tokens within ${timeoutMs}ms`);
      }

      // Calculate wait time until enough tokens are available
      const tokensNeeded = tokens - this.tokens;
      const waitTimeMs = Math.ceil((tokensNeeded / this.refillRate) * 1000);

      // Wait with a minimum of 10ms and maximum of 1000ms
      const actualWait = Math.max(10, Math.min(1000, waitTimeMs));
      await this.sleep(actualWait);
    }
  }

  /**
   * Get the current number of available tokens
   */
  getRemainingTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  /**
   * Get the time in milliseconds until a token will be available
   * @returns Time in ms, or 0 if tokens are available now
   */
  getTimeUntilAvailable(): number {
    this.refill();

    if (this.tokens >= 1) {
      return 0;
    }

    const tokensNeeded = 1 - this.tokens;
    return Math.ceil((tokensNeeded / this.refillRate) * 1000);
  }

  /**
   * Reset the rate limiter to its initial state
   */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefillTime = Date.now();
  }

  /**
   * Sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a rate limiter with requests per second configuration
 * @param requestsPerSecond - Maximum requests per second
 * @param burstSize - Maximum burst size (defaults to requestsPerSecond)
 */
export function createRateLimiter(
  requestsPerSecond: number,
  burstSize?: number
): RateLimiter {
  return new RateLimiter({
    maxTokens: burstSize ?? requestsPerSecond,
    refillRate: requestsPerSecond,
  });
}

/**
 * Rate limiter registry for managing multiple rate limiters
 */
export class RateLimiterRegistry {
  private limiters: Map<string, RateLimiter> = new Map();
  private defaultOptions: RateLimiterOptions;

  constructor(defaultOptions: RateLimiterOptions = { maxTokens: 10, refillRate: 10 }) {
    this.defaultOptions = defaultOptions;
  }

  /**
   * Get or create a rate limiter for a key
   */
  get(key: string, options?: RateLimiterOptions): RateLimiter {
    let limiter = this.limiters.get(key);

    if (!limiter) {
      limiter = new RateLimiter(options ?? this.defaultOptions);
      this.limiters.set(key, limiter);
    }

    return limiter;
  }

  /**
   * Remove a rate limiter
   */
  remove(key: string): boolean {
    return this.limiters.delete(key);
  }

  /**
   * Clear all rate limiters
   */
  clear(): void {
    this.limiters.clear();
  }
}
