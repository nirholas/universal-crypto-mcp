/**
 * Caching utilities with TTL and LRU support
 * @module utils/cache
 */

export interface CacheOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
  /** Maximum number of entries (LRU) */
  maxSize?: number;
  /** Callback when entry is evicted */
  onEvict?: (key: string, value: any) => void;
}

interface CacheEntry<T> {
  value: T;
  expires: number;
  lastAccessed: number;
}

/**
 * In-memory cache with TTL and LRU eviction
 * 
 * @example
 * ```typescript
 * const cache = new Cache<string>({ ttl: 60000, maxSize: 100 });
 * 
 * cache.set('key', 'value');
 * const value = cache.get('key');
 * ```
 */
export class Cache<T = any> {
  private store = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 3600000, // 1 hour default
      maxSize: options.maxSize ?? 1000,
      onEvict: options.onEvict ?? (() => {}),
    };
  }
  
  /**
   * Set a value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    // Evict if at max size
    if (this.store.size >= this.options.maxSize) {
      this.evictLRU();
    }
    
    const expires = Date.now() + (ttl ?? this.options.ttl);
    this.store.set(key, {
      value,
      expires,
      lastAccessed: Date.now(),
    });
  }
  
  /**
   * Get a value from cache
   */
  get(key: string): T | undefined {
    const entry = this.store.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Check if expired
    if (Date.now() > entry.expires) {
      this.delete(key);
      return undefined;
    }
    
    // Update last accessed
    entry.lastAccessed = Date.now();
    
    return entry.value;
  }
  
  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a key
   */
  delete(key: string): boolean {
    const entry = this.store.get(key);
    if (entry) {
      this.options.onEvict(key, entry.value);
    }
    return this.store.delete(key);
  }
  
  /**
   * Clear all entries
   */
  clear(): void {
    this.store.forEach((entry, key) => {
      this.options.onEvict(key, entry.value);
    });
    this.store.clear();
  }
  
  /**
   * Get cache size
   */
  size(): number {
    return this.store.size;
  }
  
  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }
  
  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    this.store.forEach((entry, key) => {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
  
  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let removed = 0;
    const now = Date.now();
    
    this.store.forEach((entry, key) => {
      if (now > entry.expires) {
        this.delete(key);
        removed++;
      }
    });
    
    return removed;
  }
  
  /**
   * Get cache statistics
   */
  stats() {
    const now = Date.now();
    let expired = 0;
    
    this.store.forEach(entry => {
      if (now > entry.expires) expired++;
    });
    
    return {
      size: this.store.size,
      maxSize: this.options.maxSize,
      expired,
      ttl: this.options.ttl,
    };
  }
}

/**
 * Memoize a function with caching
 * 
 * @example
 * ```typescript
 * const expensive = memoize(async (id: string) => {
 *   return await fetchData(id);
 * }, { ttl: 60000 });
 * 
 * const result = await expensive('123'); // Cached for 60s
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: CacheOptions & { keyFn?: (...args: Parameters<T>) => string } = {}
): T {
  const cache = new Cache<ReturnType<T>>(options);
  const keyFn = options.keyFn ?? ((...args) => JSON.stringify(args));
  
  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, value);
        return value;
      });
    }
    
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Create a cache instance
 */
export function createCache<T = any>(options: CacheOptions = {}): Cache<T> {
  return new Cache<T>(options);
}
