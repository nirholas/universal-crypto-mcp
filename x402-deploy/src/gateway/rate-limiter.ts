/**
 * Rate Limiter for x402-deploy
 * 
 * @module gateway/rate-limiter
 * @description Per-payer and per-route rate limiting with sliding window algorithm
 */

import type { RateLimitConfig, RateLimitState } from "./types";

/**
 * Storage interface for rate limit data
 * Can be implemented with Redis for distributed systems
 */
export interface RateLimitStore {
  get(key: string): Promise<RateLimitState | undefined>;
  set(key: string, state: RateLimitState, ttlSeconds: number): Promise<void>;
  increment(key: string): Promise<number>;
  delete(key: string): Promise<void>;
}

/**
 * In-memory rate limit store (for single-instance deployments)
 */
export class MemoryRateLimitStore implements RateLimitStore {
  private store: Map<string, { state: RateLimitState; expiresAt: number }> = new Map();

  async get(key: string): Promise<RateLimitState | undefined> {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.state;
  }

  async set(key: string, state: RateLimitState, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      state,
      expiresAt: Date.now() + (ttlSeconds * 1000),
    });
  }

  async increment(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      return 0;
    }
    entry.state.count++;
    return entry.state.count;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Rate limiter result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** When the rate limit resets (Unix timestamp) */
  resetAt: number;
  /** Retry-After header value in seconds */
  retryAfter?: number;
}

/**
 * Rate Limiter with sliding window algorithm
 */
export class RateLimiter {
  private config: Required<RateLimitConfig>;
  private store: RateLimitStore;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    this.config = {
      enabled: config.enabled ?? true,
      maxRequests: config.maxRequests ?? 100,
      windowSeconds: config.windowSeconds ?? 60,
      perPayer: config.perPayer ?? true,
      redisUrl: config.redisUrl ?? "",
    };

    this.store = store ?? new MemoryRateLimitStore();

    // Start cleanup interval for memory store
    if (this.store instanceof MemoryRateLimitStore) {
      this.cleanupInterval = setInterval(() => {
        (this.store as MemoryRateLimitStore).cleanup();
      }, 60000); // Clean up every minute
    }
  }

  /**
   * Generate rate limit key
   */
  private getKey(payer: string, route?: string): string {
    if (route) {
      return `ratelimit:${payer}:${route}`;
    }
    return `ratelimit:${payer}`;
  }

  /**
   * Check rate limit for a request
   */
  async checkLimit(payer: string, route?: string): Promise<RateLimitResult> {
    if (!this.config.enabled) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetAt: 0,
      };
    }

    const key = this.getKey(payer, this.config.perPayer ? route : undefined);
    const now = Date.now();
    const windowStart = now - (this.config.windowSeconds * 1000);

    let state = await this.store.get(key);

    // If no state or window expired, create new window
    if (!state || state.windowStart < windowStart) {
      state = {
        payer,
        count: 0,
        windowStart: now,
        exceeded: false,
      };
      await this.store.set(key, state, this.config.windowSeconds);
    }

    // Increment count
    const newCount = await this.store.increment(key);
    const remaining = Math.max(0, this.config.maxRequests - newCount);
    const resetAt = state.windowStart + (this.config.windowSeconds * 1000);
    const allowed = newCount <= this.config.maxRequests;

    if (!allowed) {
      state.exceeded = true;
      await this.store.set(key, state, this.config.windowSeconds);
      
      const retryAfter = Math.ceil((resetAt - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter,
      };
    }

    return {
      allowed: true,
      remaining,
      resetAt,
    };
  }

  /**
   * Record a request (increment counter)
   */
  async recordRequest(payer: string, route?: string): Promise<RateLimitResult> {
    return this.checkLimit(payer, route);
  }

  /**
   * Reset rate limit for a payer
   */
  async resetLimit(payer: string, route?: string): Promise<void> {
    const key = this.getKey(payer, route);
    await this.store.delete(key);
  }

  /**
   * Get current state for a payer
   */
  async getState(payer: string, route?: string): Promise<RateLimitState | undefined> {
    const key = this.getKey(payer, route);
    return this.store.get(key);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RateLimitConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      enabled: config.enabled ?? this.config.enabled,
      maxRequests: config.maxRequests ?? this.config.maxRequests,
      windowSeconds: config.windowSeconds ?? this.config.windowSeconds,
      perPayer: config.perPayer ?? this.config.perPayer,
      redisUrl: config.redisUrl ?? this.config.redisUrl,
    };
  }

  /**
   * Get rate limit headers for HTTP response
   */
  getHeaders(result: RateLimitResult): Record<string, string> {
    const headers: Record<string, string> = {
      "X-RateLimit-Limit": this.config.maxRequests.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
    };

    if (result.retryAfter) {
      headers["Retry-After"] = result.retryAfter.toString();
    }

    return headers;
  }

  /**
   * Check if rate limiting is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<RateLimitConfig> {
    return { ...this.config };
  }

  /**
   * Stop cleanup interval (for graceful shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }
}

/**
 * Create a rate limiter with configuration
 */
export function createRateLimiter(config: RateLimitConfig, store?: RateLimitStore): RateLimiter {
  return new RateLimiter(config, store);
}

/**
 * Rate limit middleware generator for Express
 */
export function rateLimitMiddleware(limiter: RateLimiter) {
  return async (req: any, res: any, next: any) => {
    // Extract payer from payment header or default to IP
    const payer = req.headers["x-payer-address"] || 
                  req.headers["x-forwarded-for"]?.split(",")[0] || 
                  req.ip || 
                  "anonymous";

    const result = await limiter.checkLimit(payer, req.path);

    // Add rate limit headers
    const headers = limiter.getHeaders(result);
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }

    if (!result.allowed) {
      res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: result.retryAfter,
        resetAt: new Date(result.resetAt).toISOString(),
      });
      return;
    }

    next();
  };
}
