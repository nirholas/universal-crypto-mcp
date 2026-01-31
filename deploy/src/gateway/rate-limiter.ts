/**
 * Enterprise Rate Limiting with Redis and x402 bypass
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import Logger from './logger.js';

// ============================================================================
// Types
// ============================================================================

export interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  max: number;                // Max requests per window
  keyPrefix?: string;         // Redis key prefix
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  requestPropertyName?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export interface TierConfig {
  name: string;
  windowMs: number;
  max: number;
  priority: number;
}

export const RATE_LIMIT_TIERS: Record<string, TierConfig> = {
  // Free tier - very limited
  free: {
    name: 'Free',
    windowMs: 60 * 1000,  // 1 minute
    max: 10,              // 10 requests/minute
    priority: 0,
  },
  // Basic paid tier
  basic: {
    name: 'Basic',
    windowMs: 60 * 1000,
    max: 100,             // 100 requests/minute
    priority: 1,
  },
  // Pro tier
  pro: {
    name: 'Pro',
    windowMs: 60 * 1000,
    max: 1000,            // 1000 requests/minute
    priority: 2,
  },
  // Enterprise tier
  enterprise: {
    name: 'Enterprise',
    windowMs: 60 * 1000,
    max: 10000,           // 10000 requests/minute
    priority: 3,
  },
  // x402 payments bypass most limits
  x402: {
    name: 'x402 Payment',
    windowMs: 60 * 1000,
    max: 100000,          // Effectively unlimited
    priority: 10,
  },
};

// ============================================================================
// In-Memory Store (fallback)
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class InMemoryStore {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now >= record.resetTime) {
      // New window
      const newRecord = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store.set(key, newRecord);
      return newRecord;
    }

    // Increment existing
    record.count++;
    return record;
  }

  async get(key: string): Promise<RateLimitRecord | null> {
    return this.store.get(key) || null;
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now >= record.resetTime) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// ============================================================================
// Redis Store
// ============================================================================

class RedisStore {
  private redis: Redis;
  private keyPrefix: string;

  constructor(redis: Redis, keyPrefix = 'ratelimit:') {
    this.redis = redis;
    this.keyPrefix = keyPrefix;
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const fullKey = this.keyPrefix + key;

    const now = Date.now();

    // Use Redis MULTI for atomic operation
    const result = await this.redis
      .multi()
      .incr(fullKey)
      .pttl(fullKey)
      .exec();

    if (!result) {
      throw new Error('Redis transaction failed');
    }

    const count = result[0][1] as number;
    let ttl = result[1][1] as number;

    // Set expiry if new key
    if (ttl === -1) {
      await this.redis.pexpire(fullKey, windowMs);
      ttl = windowMs;
    }

    return {
      count,
      resetTime: now + (ttl > 0 ? ttl : windowMs),
    };
  }

  async get(key: string): Promise<RateLimitRecord | null> {
    const fullKey = this.keyPrefix + key;
    const [count, ttl] = await Promise.all([
      this.redis.get(fullKey),
      this.redis.pttl(fullKey),
    ]);

    if (!count) return null;

    return {
      count: parseInt(count),
      resetTime: Date.now() + (ttl > 0 ? ttl : 0),
    };
  }

  async reset(key: string): Promise<void> {
    await this.redis.del(this.keyPrefix + key);
  }
}

// ============================================================================
// Rate Limiter Middleware
// ============================================================================

export class RateLimiter {
  private store: InMemoryStore | RedisStore;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig, redis?: Redis) {
    this.config = {
      keyPrefix: 'ratelimit:',
      standardHeaders: true,
      legacyHeaders: false,
      ...config,
    };

    if (redis) {
      this.store = new RedisStore(redis, this.config.keyPrefix);
      Logger.info('Rate limiter using Redis store');
    } else {
      this.store = new InMemoryStore();
      Logger.info('Rate limiter using in-memory store');
    }
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const key = this.getKey(req);
      const tier = this.getTier(req);
      const tierConfig = RATE_LIMIT_TIERS[tier];

      try {
        const result = await this.store.increment(key, tierConfig.windowMs);

        // Set headers
        if (this.config.standardHeaders) {
          res.setHeader('RateLimit-Limit', tierConfig.max.toString());
          res.setHeader('RateLimit-Remaining', Math.max(0, tierConfig.max - result.count).toString());
          res.setHeader('RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
          res.setHeader('RateLimit-Policy', `${tierConfig.max};w=${tierConfig.windowMs / 1000}`);
        }

        if (this.config.legacyHeaders) {
          res.setHeader('X-RateLimit-Limit', tierConfig.max.toString());
          res.setHeader('X-RateLimit-Remaining', Math.max(0, tierConfig.max - result.count).toString());
          res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
        }

        // Check if limit exceeded
        if (result.count > tierConfig.max) {
          Logger.warn(`Rate limit exceeded for ${key} (tier: ${tier})`);
          
          res.status(429).json({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Maximum ${tierConfig.max} requests per ${tierConfig.windowMs / 1000} seconds.`,
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
            tier: tierConfig.name,
            upgrade: tier === 'free' ? {
              message: 'Upgrade to paid tier or use x402 payments for higher limits',
              options: [
                { tier: 'basic', limit: RATE_LIMIT_TIERS.basic.max },
                { tier: 'pro', limit: RATE_LIMIT_TIERS.pro.max },
                { tier: 'x402', message: 'Pay per request for unlimited access' },
              ],
            } : undefined,
          });
          return;
        }

        next();
      } catch (error) {
        Logger.error('Rate limiter error:', error as Error);
        // Fail open - allow request on error
        next();
      }
    };
  }

  /**
   * Get rate limit key for request
   */
  private getKey(req: Request): string {
    // Use API key if present
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
      return `apikey:${this.hashKey(apiKey)}`;
    }

    // Use x402 payer address if present
    const payerAddress = req.headers['x-payment-address'] as string;
    if (payerAddress) {
      return `x402:${payerAddress.toLowerCase()}`;
    }

    // Fall back to IP
    const ip = req.ip || 
               req.headers['x-forwarded-for']?.toString().split(',')[0] || 
               req.socket.remoteAddress ||
               'unknown';
    return `ip:${ip}`;
  }

  /**
   * Determine tier for request
   */
  private getTier(req: Request): string {
    // x402 payment proof = highest tier
    if (req.headers['x-payment-proof']) {
      return 'x402';
    }

    // Check API key tier
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
      return this.getApiKeyTier(apiKey);
    }

    // Default to free tier
    return 'free';
  }

  /**
   * Get tier for API key (would lookup in database)
   */
  private getApiKeyTier(apiKey: string): string {
    // In production, lookup tier from database
    // For now, use key prefix convention
    if (apiKey.startsWith('ent_')) return 'enterprise';
    if (apiKey.startsWith('pro_')) return 'pro';
    if (apiKey.startsWith('basic_')) return 'basic';
    return 'free';
  }

  /**
   * Hash API key for storage
   */
  private hashKey(key: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);
  }
}

// ============================================================================
// Specialized Rate Limiters
// ============================================================================

/**
 * Create rate limiter for specific endpoint
 */
export function createEndpointLimiter(
  endpoint: string,
  config: Partial<RateLimitConfig>,
  redis?: Redis
): RateLimiter {
  return new RateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    keyPrefix: `ratelimit:${endpoint}:`,
    ...config,
  }, redis);
}

/**
 * Create slow-down middleware (increases delay as limit approaches)
 */
export function slowDown(options: {
  windowMs?: number;
  delayAfter?: number;
  delayMs?: number;
  maxDelayMs?: number;
}) {
  const {
    windowMs = 60 * 1000,
    delayAfter = 5,
    delayMs = 500,
    maxDelayMs = 20000,
  } = options;

  const store = new InMemoryStore();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.ip || 'unknown';
    const result = await store.increment(key, windowMs);

    if (result.count > delayAfter) {
      const delay = Math.min(
        (result.count - delayAfter) * delayMs,
        maxDelayMs
      );
      
      Logger.debug(`Slow down: delaying ${key} by ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    next();
  };
}

/**
 * Create concurrent request limiter
 */
export function concurrencyLimiter(options: {
  max?: number;
  keyGenerator?: (req: Request) => string;
}) {
  const { max = 10, keyGenerator } = options;
  const activeRequests: Map<string, number> = new Map();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = keyGenerator?.(req) || req.ip || 'unknown';
    const current = activeRequests.get(key) || 0;

    if (current >= max) {
      res.status(429).json({
        error: 'Too Many Concurrent Requests',
        message: `Maximum ${max} concurrent requests allowed`,
        current,
      });
      return;
    }

    activeRequests.set(key, current + 1);

    res.on('finish', () => {
      const count = activeRequests.get(key) || 1;
      if (count <= 1) {
        activeRequests.delete(key);
      } else {
        activeRequests.set(key, count - 1);
      }
    });

    next();
  };
}

// ============================================================================
// Export convenience middleware
// ============================================================================

export function rateLimitMiddleware(redis?: Redis) {
  const limiter = new RateLimiter({
    windowMs: 60 * 1000,
    max: 100,
  }, redis);

  return limiter.middleware();
}

export default RateLimiter;

