/**
 * In-memory cache with TTL support
 * Production-ready caching layer
 */

export interface CacheConfig {
  defaultTTL?: number; // TTL in seconds
  maxSize?: number;
  cleanupInterval?: number;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class Cache {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number;
  private maxSize: number;
  private cleanupTimer?: ReturnType<typeof setInterval>;

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = (config.defaultTTL || 60) * 1000; // Convert to ms
    this.maxSize = config.maxSize || 1000;

    // Periodic cleanup of expired entries
    if (config.cleanupInterval !== 0) {
      const interval = (config.cleanupInterval || 60) * 1000;
      this.cleanupTimer = setInterval(() => this.cleanup(), interval);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    // Evict oldest entries if at capacity
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  has(key: string): boolean {
    const value = this.get(key);
    return value !== null;
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

export function createCache(config?: CacheConfig): Cache {
  return new Cache(config);
}
