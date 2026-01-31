/**
 * Enterprise Rate Limiter
 * 
 * Redis-backed rate limiting with:
 * - Sliding window algorithm
 * - Per-client, per-tool limits
 * - Fallback to in-memory when Redis unavailable
 * - Automatic cleanup
 */

interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter: number
  limit: number
}

interface RateLimitEntry {
  count: number
  windowStart: number
}

export class RateLimiter {
  private redisUrl?: string
  private redis?: any // ioredis client
  private memoryStore: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval?: NodeJS.Timeout

  constructor(redisUrl?: string) {
    this.redisUrl = redisUrl
    
    if (redisUrl) {
      this.initRedis(redisUrl)
    } else {
      // In-memory fallback with cleanup
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
    }
  }

  private async initRedis(url: string) {
    try {
      const Redis = (await import("ioredis")).default
      this.redis = new Redis(url, {
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        lazyConnect: true,
      })
      
      this.redis.on("error", (err: Error) => {
        console.error("Redis error:", err.message)
        // Fallback to memory on error
        this.redis = undefined
      })

      await this.redis.connect()
      console.log("✅ Rate limiter connected to Redis")
    } catch (error) {
      console.warn("⚠️ Redis unavailable, using in-memory rate limiting")
      this.redis = undefined
    }
  }

  /**
   * Check if a request is allowed
   */
  async check(
    clientId: string,
    toolName: string,
    limit: number = 60,
    windowMs: number = 60000
  ): Promise<RateLimitResult> {
    const key = `ratelimit:${clientId}:${toolName}`
    const now = Date.now()
    const windowStart = now - windowMs

    if (this.redis) {
      return this.checkRedis(key, limit, windowMs, now)
    } else {
      return this.checkMemory(key, limit, windowMs, now, windowStart)
    }
  }

  private async checkRedis(
    key: string,
    limit: number,
    windowMs: number,
    now: number
  ): Promise<RateLimitResult> {
    try {
      // Use Redis sorted set for sliding window
      const multi = this.redis.multi()
      
      // Remove old entries
      multi.zremrangebyscore(key, 0, now - windowMs)
      
      // Count current entries
      multi.zcard(key)
      
      // Add new entry
      multi.zadd(key, now, `${now}:${Math.random()}`)
      
      // Set expiry
      multi.expire(key, Math.ceil(windowMs / 1000) + 1)

      const results = await multi.exec()
      const count = results[1][1] as number

      const allowed = count < limit
      const remaining = Math.max(0, limit - count - 1)
      const retryAfter = allowed ? 0 : Math.ceil(windowMs / 1000)

      return { allowed, remaining, retryAfter, limit }
    } catch (error) {
      // Fallback to allowing on Redis error
      console.error("Redis rate limit error:", error)
      return { allowed: true, remaining: limit, retryAfter: 0, limit }
    }
  }

  private checkMemory(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
    windowStart: number
  ): RateLimitResult {
    const entry = this.memoryStore.get(key)

    if (!entry || entry.windowStart < windowStart) {
      // New window
      this.memoryStore.set(key, { count: 1, windowStart: now })
      return { allowed: true, remaining: limit - 1, retryAfter: 0, limit }
    }

    if (entry.count >= limit) {
      const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000)
      return { allowed: false, remaining: 0, retryAfter, limit }
    }

    entry.count++
    const remaining = Math.max(0, limit - entry.count)
    return { allowed: true, remaining, retryAfter: 0, limit }
  }

  /**
   * Get current usage for a client
   */
  async getUsage(clientId: string, toolName: string): Promise<number> {
    const key = `ratelimit:${clientId}:${toolName}`
    
    if (this.redis) {
      try {
        const now = Date.now()
        await this.redis.zremrangebyscore(key, 0, now - 60000)
        return await this.redis.zcard(key)
      } catch {
        return 0
      }
    }

    return this.memoryStore.get(key)?.count || 0
  }

  /**
   * Reset rate limit for a client (admin use)
   */
  async reset(clientId: string, toolName?: string): Promise<void> {
    if (toolName) {
      const key = `ratelimit:${clientId}:${toolName}`
      if (this.redis) {
        await this.redis.del(key)
      } else {
        this.memoryStore.delete(key)
      }
    } else {
      // Reset all limits for client
      const pattern = `ratelimit:${clientId}:*`
      if (this.redis) {
        const keys = await this.redis.keys(pattern)
        if (keys.length > 0) {
          await this.redis.del(...keys)
        }
      } else {
        for (const key of this.memoryStore.keys()) {
          if (key.startsWith(`ratelimit:${clientId}:`)) {
            this.memoryStore.delete(key)
          }
        }
      }
    }
  }

  /**
   * Cleanup old entries from memory store
   */
  private cleanup() {
    const now = Date.now()
    const windowMs = 60000

    for (const [key, entry] of this.memoryStore.entries()) {
      if (entry.windowStart < now - windowMs) {
        this.memoryStore.delete(key)
      }
    }
  }

  /**
   * Close connections
   */
  async close() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    if (this.redis) {
      await this.redis.quit()
    }
  }
}

/**
 * Create a global rate limiter instance
 */
let globalRateLimiter: RateLimiter | null = null

export function getGlobalRateLimiter(redisUrl?: string): RateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter(redisUrl)
  }
  return globalRateLimiter
}
