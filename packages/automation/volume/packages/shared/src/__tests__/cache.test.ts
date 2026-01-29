import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SimpleCache, createCacheKey } from '../cache.js';

describe('SimpleCache', () => {
  let cache: SimpleCache<string>;

  beforeEach(() => {
    cache = new SimpleCache<string>(1000); // 1 second TTL
  });

  describe('get/set', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should return undefined for expired entries', async () => {
      cache = new SimpleCache<string>(50); // 50ms TTL
      cache.set('key1', 'value1');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should respect custom TTL per entry', async () => {
      cache.set('short', 'value', 50);
      cache.set('long', 'value', 500);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(cache.get('short')).toBeUndefined();
      expect(cache.get('long')).toBe('value');
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should return false for expired keys', async () => {
      cache = new SimpleCache<string>(50);
      cache.set('key1', 'value1');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should remove existing keys', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should return false for non-existent keys', () => {
      expect(cache.delete('nonexistent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.size).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      cache = new SimpleCache<string>(50);
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      await new Promise(resolve => setTimeout(resolve, 100));

      const removed = cache.cleanup();
      expect(removed).toBe(2);
      expect(cache.size).toBe(0);
    });
  });

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      cache.set('key1', 'cached');
      const factory = vi.fn(() => 'new');
      
      const result = await cache.getOrSet('key1', factory);
      
      expect(result).toBe('cached');
      expect(factory).not.toHaveBeenCalled();
    });

    it('should call factory and cache result if not exists', async () => {
      const factory = vi.fn(() => 'new');
      
      const result = await cache.getOrSet('key1', factory);
      
      expect(result).toBe('new');
      expect(factory).toHaveBeenCalled();
      expect(cache.get('key1')).toBe('new');
    });

    it('should handle async factory functions', async () => {
      const factory = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async-value';
      });
      
      const result = await cache.getOrSet('key1', factory);
      
      expect(result).toBe('async-value');
    });
  });

  describe('getTtl', () => {
    it('should return remaining TTL', () => {
      cache.set('key1', 'value1', 1000);
      const ttl = cache.getTtl('key1');
      
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(1000);
    });

    it('should return -1 for non-existent keys', () => {
      expect(cache.getTtl('nonexistent')).toBe(-1);
    });
  });

  describe('max size', () => {
    it('should evict oldest entries when max size is reached', () => {
      cache = new SimpleCache<string>(60000, 2);
      
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
      expect(cache.has('key3')).toBe(true);
    });
  });
});

describe('createCacheKey', () => {
  it('should join parts with colon', () => {
    expect(createCacheKey('a', 'b', 'c')).toBe('a:b:c');
  });

  it('should handle different types', () => {
    expect(createCacheKey('str', 123, true)).toBe('str:123:true');
  });

  it('should filter out undefined and null', () => {
    expect(createCacheKey('a', undefined, 'b', null, 'c')).toBe('a:b:c');
  });
});
