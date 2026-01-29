import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter, createRateLimiter, RateLimiterRegistry } from '../rate-limiter.js';

describe('RateLimiter', () => {
  describe('tryAcquire', () => {
    it('should acquire tokens when available', () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 10 });
      
      expect(limiter.tryAcquire()).toBe(true);
      expect(limiter.getRemainingTokens()).toBe(9);
    });

    it('should fail to acquire when no tokens available', () => {
      const limiter = new RateLimiter({ maxTokens: 1, refillRate: 1, initialTokens: 0 });
      
      expect(limiter.tryAcquire()).toBe(false);
    });

    it('should acquire multiple tokens at once', () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 10 });
      
      expect(limiter.tryAcquire(5)).toBe(true);
      expect(limiter.getRemainingTokens()).toBe(5);
    });

    it('should fail when not enough tokens for multi-token acquire', () => {
      const limiter = new RateLimiter({ maxTokens: 3, refillRate: 1, initialTokens: 2 });
      
      expect(limiter.tryAcquire(5)).toBe(false);
      expect(limiter.getRemainingTokens()).toBe(2);
    });
  });

  describe('acquire', () => {
    it('should resolve immediately when tokens available', async () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 10 });
      
      await limiter.acquire();
      expect(limiter.getRemainingTokens()).toBe(9);
    });

    it('should wait for token refill', async () => {
      const limiter = new RateLimiter({ maxTokens: 1, refillRate: 100, initialTokens: 0 });
      
      const startTime = Date.now();
      await limiter.acquire(1, 5000);
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeGreaterThan(5);
      expect(elapsed).toBeLessThan(100);
    });

    it('should throw on timeout', async () => {
      const limiter = new RateLimiter({ maxTokens: 1, refillRate: 0.1, initialTokens: 0 });
      
      await expect(limiter.acquire(1, 50)).rejects.toThrow('timeout');
    });
  });

  describe('refill', () => {
    it('should refill tokens over time', async () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 100, initialTokens: 0 });
      
      // Wait 50ms - should add ~5 tokens at 100 tokens/second
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const tokens = limiter.getRemainingTokens();
      expect(tokens).toBeGreaterThanOrEqual(3);
      expect(tokens).toBeLessThanOrEqual(7);
    });

    it('should not exceed max tokens', async () => {
      const limiter = new RateLimiter({ maxTokens: 5, refillRate: 100 });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(limiter.getRemainingTokens()).toBe(5);
    });
  });

  describe('getTimeUntilAvailable', () => {
    it('should return 0 when tokens available', () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 10 });
      
      expect(limiter.getTimeUntilAvailable()).toBe(0);
    });

    it('should return estimated wait time when no tokens', () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 10, initialTokens: 0 });
      
      const waitTime = limiter.getTimeUntilAvailable();
      expect(waitTime).toBeGreaterThan(0);
      expect(waitTime).toBeLessThanOrEqual(100);
    });
  });

  describe('reset', () => {
    it('should restore to initial state', () => {
      const limiter = new RateLimiter({ maxTokens: 10, refillRate: 10 });
      
      limiter.tryAcquire(5);
      limiter.reset();
      
      expect(limiter.getRemainingTokens()).toBe(10);
    });
  });
});

describe('createRateLimiter', () => {
  it('should create limiter with given RPS', () => {
    const limiter = createRateLimiter(5);
    
    expect(limiter.getRemainingTokens()).toBe(5);
  });

  it('should allow custom burst size', () => {
    const limiter = createRateLimiter(5, 10);
    
    expect(limiter.getRemainingTokens()).toBe(10);
  });
});

describe('RateLimiterRegistry', () => {
  let registry: RateLimiterRegistry;

  beforeEach(() => {
    registry = new RateLimiterRegistry({ maxTokens: 10, refillRate: 10 });
  });

  it('should create new limiters on first access', () => {
    const limiter = registry.get('api1');
    
    expect(limiter).toBeInstanceOf(RateLimiter);
    expect(limiter.getRemainingTokens()).toBe(10);
  });

  it('should return same limiter for same key', () => {
    const limiter1 = registry.get('api1');
    limiter1.tryAcquire(3);
    
    const limiter2 = registry.get('api1');
    expect(limiter2.getRemainingTokens()).toBe(7);
  });

  it('should use custom options when provided', () => {
    const limiter = registry.get('api1', { maxTokens: 5, refillRate: 5 });
    
    expect(limiter.getRemainingTokens()).toBe(5);
  });

  it('should remove limiters', () => {
    registry.get('api1');
    expect(registry.remove('api1')).toBe(true);
    expect(registry.remove('api1')).toBe(false);
  });

  it('should clear all limiters', () => {
    registry.get('api1');
    registry.get('api2');
    registry.clear();
    
    // New limiter should be created with full tokens
    const limiter = registry.get('api1');
    expect(limiter.getRemainingTokens()).toBe(10);
  });
});
