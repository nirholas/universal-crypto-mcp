/**
 * Cache entry with value and expiration
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Simple in-memory cache with TTL support
 */
export class SimpleCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>>;
  private defaultTtlMs: number;
  private maxSize: number;

  /**
   * Create a new cache instance
   * @param defaultTtlMs - Default time-to-live in milliseconds
   * @param maxSize - Maximum number of entries (0 = unlimited)
   */
  constructor(defaultTtlMs: number = 60_000, maxSize: number = 1000) {
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
    this.maxSize = maxSize;
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or undefined if not found/expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Time-to-live in milliseconds (optional, uses default if not provided)
   */
  set(key: string, value: T, ttlMs?: number): void {
    // Enforce max size by removing oldest entries
    if (this.maxSize > 0 && this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Check if a key exists in the cache (and is not expired)
   * @param key - Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   * @param key - Cache key
   * @returns True if the key was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of entries in the cache (including expired)
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get all valid (non-expired) keys
   */
  keys(): string[] {
    const now = Date.now();
    const validKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiresAt) {
        validKeys.push(key);
      }
    }

    return validKeys;
  }

  /**
   * Remove expired entries from the cache
   * @returns Number of entries removed
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get or set a value using a factory function
   * @param key - Cache key
   * @param factory - Function to create the value if not cached
   * @param ttlMs - Time-to-live in milliseconds
   * @returns The cached or newly created value
   */
  async getOrSet(key: string, factory: () => T | Promise<T>, ttlMs?: number): Promise<T> {
    const existing = this.get(key);

    if (existing !== undefined) {
      return existing;
    }

    const value = await factory();
    this.set(key, value, ttlMs);
    return value;
  }

  /**
   * Get remaining TTL for a key in milliseconds
   * @param key - Cache key
   * @returns Remaining TTL in ms, or -1 if key doesn't exist/expired
   */
  getTtl(key: string): number {
    const entry = this.cache.get(key);

    if (!entry) {
      return -1;
    }

    const remaining = entry.expiresAt - Date.now();
    if (remaining <= 0) {
      this.cache.delete(key);
      return -1;
    }

    return remaining;
  }

  /**
   * Evict the oldest entry
   */
  private evictOldest(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey !== undefined) {
      this.cache.delete(firstKey);
    }
  }
}

/**
 * Create a cache key from multiple parts
 */
export function createCacheKey(...parts: (string | number | boolean | undefined | null)[]): string {
  return parts
    .filter((p) => p !== undefined && p !== null)
    .map((p) => String(p))
    .join(':');
}

/**
 * Cache options for factory function
 */
export interface CacheOptions {
  /** Default TTL in milliseconds */
  ttlMs?: number;
  /** Maximum cache size */
  maxSize?: number;
}

/**
 * Factory function to create a cache instance
 * @param options - Cache configuration options
 */
export function createCache<T = unknown>(options: CacheOptions = {}): SimpleCache<T> {
  return new SimpleCache<T>(options.ttlMs ?? 60_000, options.maxSize ?? 1000);
}
