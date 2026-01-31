/**
 * Rate Limiter Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter, SlidingWindowRateLimiter, RateLimiterRegistry } from '../rate-limiter/index.js';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      maxTokens: 10,
      refillRate: 5,
      refillInterval: 1000,
      maxWaitTime: 5000,
    });
  });

  describe('tryAcquire', () => {
    it('should allow requests when tokens are available', () => {
      const result = limiter.tryAcquire('test', 1);
      expect(result.allowed).toBe(true);
      expect(result.remainingTokens).toBe(9);
    });

    it('should deny requests when tokens are exhausted', () => {
      // Exhaust all tokens
      for (let i = 0; i < 10; i++) {
        limiter.tryAcquire('test', 1);
      }

      const result = limiter.tryAcquire('test', 1);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
    });

    it('should handle multiple keys independently', () => {
      // Exhaust tokens for key1
      for (let i = 0; i < 10; i++) {
        limiter.tryAcquire('key1', 1);
      }

      // key2 should still have tokens
      const result = limiter.tryAcquire('key2', 1);
      expect(result.allowed).toBe(true);
    });

    it('should refill tokens over time', async () => {
      // Exhaust all tokens
      for (let i = 0; i < 10; i++) {
        limiter.tryAcquire('test', 1);
      }

      // Wait for refill
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should have 5 new tokens
      const result = limiter.tryAcquire('test', 1);
      expect(result.allowed).toBe(true);
    });
  });

  describe('acquire', () => {
    it('should wait and acquire token when available', async () => {
      const result = await limiter.acquire('test', 1);
      expect(result.allowed).toBe(true);
    });

    it('should timeout if wait exceeds maxWaitTime', async () => {
      // Create limiter with short maxWaitTime
      const shortLimiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 1,
        refillInterval: 10000, // Very slow refill
        maxWaitTime: 100, // Very short wait
      });

      // Exhaust tokens
      await shortLimiter.acquire('test', 1);

      // This should fail quickly
      const result = await shortLimiter.acquire('test', 1);
      expect(result.allowed).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should return current token count', () => {
      limiter.tryAcquire('test', 3);
      const status = limiter.getStatus('test');
      expect(status.tokens).toBe(7);
      expect(status.maxTokens).toBe(10);
      expect(status.refillRate).toBe(5);
    });
  });

  describe('reset', () => {
    it('should reset specific bucket', () => {
      limiter.tryAcquire('test', 5);
      limiter.reset('test');
      const status = limiter.getStatus('test');
      expect(status.tokens).toBe(10);
    });

    it('should reset all buckets', () => {
      limiter.tryAcquire('key1', 5);
      limiter.tryAcquire('key2', 5);
      limiter.resetAll();
      expect(limiter.getStatus('key1').tokens).toBe(10);
      expect(limiter.getStatus('key2').tokens).toBe(10);
    });
  });
});

describe('SlidingWindowRateLimiter', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter({
      maxRequests: 5,
      windowSizeMs: 1000,
    });
  });

  it('should allow requests within limit', () => {
    for (let i = 0; i < 5; i++) {
      const result = limiter.tryAcquire('test');
      expect(result.allowed).toBe(true);
    }
  });

  it('should deny requests over limit', () => {
    for (let i = 0; i < 5; i++) {
      limiter.tryAcquire('test');
    }

    const result = limiter.tryAcquire('test');
    expect(result.allowed).toBe(false);
  });

  it('should allow requests after window expires', async () => {
    for (let i = 0; i < 5; i++) {
      limiter.tryAcquire('test');
    }

    await new Promise(resolve => setTimeout(resolve, 1100));

    const result = limiter.tryAcquire('test');
    expect(result.allowed).toBe(true);
  });
});

describe('RateLimiterRegistry', () => {
  let registry: RateLimiterRegistry;

  beforeEach(() => {
    registry = new RateLimiterRegistry();
  });

  it('should create and cache limiters', () => {
    const limiter1 = registry.getLimiter('api1', {
      maxTokens: 10,
      refillRate: 5,
      refillInterval: 1000,
    });

    const limiter2 = registry.getLimiter('api1');

    expect(limiter1).toBe(limiter2);
  });

  it('should create different limiters for different names', () => {
    const limiter1 = registry.getLimiter('api1', {
      maxTokens: 10,
      refillRate: 5,
      refillInterval: 1000,
    });

    const limiter2 = registry.getLimiter('api2', {
      maxTokens: 20,
      refillRate: 10,
      refillInterval: 1000,
    });

    expect(limiter1).not.toBe(limiter2);
  });
});
