/**
 * Retry and Circuit Breaker Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { retry, CircuitBreaker, ResilientExecutor } from '../retry/index.js';

describe('retry', () => {
  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    
    const result = await retry(fn, { maxRetries: 3 });
    
    expect(result.success).toBe(true);
    expect(result.data).toBe('success');
    expect(result.attempts).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');
    
    const result = await retry(fn, { 
      maxRetries: 3,
      initialDelay: 10,
      maxDelay: 100,
    });
    
    expect(result.success).toBe(true);
    expect(result.data).toBe('success');
    expect(result.attempts).toBe(3);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should fail after max retries', async () => {
    const error = new Error('persistent failure');
    const fn = vi.fn().mockRejectedValue(error);
    
    const result = await retry(fn, { 
      maxRetries: 3,
      initialDelay: 10,
      maxDelay: 100,
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
    expect(result.attempts).toBe(4); // Initial + 3 retries
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should call onRetry callback', async () => {
    const onRetry = vi.fn();
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    await retry(fn, { 
      maxRetries: 3,
      initialDelay: 10,
      onRetry,
    });
    
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(
      expect.any(Error),
      1,
      expect.any(Number)
    );
  });

  it('should apply exponential backoff', async () => {
    const delays: number[] = [];
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');
    
    await retry(fn, { 
      maxRetries: 3,
      initialDelay: 100,
      maxDelay: 10000,
      backoffMultiplier: 2,
      jitter: false,
      onRetry: (_, __, delay) => delays.push(delay),
    });
    
    expect(delays[0]).toBe(100); // First retry: initialDelay
    expect(delays[1]).toBe(200); // Second retry: initialDelay * 2
  });

  it('should respect maxDelay', async () => {
    const delays: number[] = [];
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    
    await retry(fn, { 
      maxRetries: 5,
      initialDelay: 1000,
      maxDelay: 2000,
      backoffMultiplier: 10,
      jitter: false,
      onRetry: (_, __, delay) => delays.push(delay),
    });
    
    // All delays after the first should be capped at maxDelay
    expect(delays.every(d => d <= 2000)).toBe(true);
  });
});

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 1000,
      halfOpenRequests: 1,
    });
  });

  it('should start in closed state', () => {
    expect(breaker.getState()).toBe('closed');
    expect(breaker.canExecute()).toBe(true);
  });

  it('should open after failure threshold', () => {
    breaker.recordFailure();
    breaker.recordFailure();
    breaker.recordFailure();
    
    expect(breaker.getState()).toBe('open');
    expect(breaker.canExecute()).toBe(false);
  });

  it('should reset failure count on success', () => {
    breaker.recordFailure();
    breaker.recordFailure();
    breaker.recordSuccess();
    
    expect(breaker.getState()).toBe('closed');
    expect(breaker.canExecute()).toBe(true);
    
    // Should need full threshold again
    breaker.recordFailure();
    breaker.recordFailure();
    expect(breaker.getState()).toBe('closed');
  });

  it('should transition to half-open after reset timeout', async () => {
    breaker.recordFailure();
    breaker.recordFailure();
    breaker.recordFailure();
    
    expect(breaker.getState()).toBe('open');
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(breaker.getState()).toBe('half-open');
    expect(breaker.canExecute()).toBe(true);
  });

  it('should close on success in half-open state', async () => {
    breaker.recordFailure();
    breaker.recordFailure();
    breaker.recordFailure();
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(breaker.getState()).toBe('half-open');
    
    breaker.recordSuccess();
    
    expect(breaker.getState()).toBe('closed');
  });

  it('should reopen on failure in half-open state', async () => {
    breaker.recordFailure();
    breaker.recordFailure();
    breaker.recordFailure();
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(breaker.getState()).toBe('half-open');
    
    breaker.recordFailure();
    
    expect(breaker.getState()).toBe('open');
  });

  it('should limit half-open requests', async () => {
    const limitedBreaker = new CircuitBreaker({
      failureThreshold: 1,
      resetTimeout: 100,
      halfOpenRequests: 2,
    });

    limitedBreaker.recordFailure();
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(limitedBreaker.canExecute()).toBe(true);
    expect(limitedBreaker.canExecute()).toBe(true);
    expect(limitedBreaker.canExecute()).toBe(false);
  });
});

describe('ResilientExecutor', () => {
  it('should execute function successfully', async () => {
    const executor = new ResilientExecutor({
      retry: { maxRetries: 3, initialDelay: 10 },
      circuitBreaker: { failureThreshold: 5, resetTimeout: 1000 },
    });

    const fn = vi.fn().mockResolvedValue('result');
    const result = await executor.execute(fn);
    
    expect(result).toBe('result');
  });

  it('should retry on failure', async () => {
    const executor = new ResilientExecutor({
      retry: { maxRetries: 3, initialDelay: 10 },
      circuitBreaker: { failureThreshold: 5, resetTimeout: 1000 },
    });

    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    const result = await executor.execute(fn);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect circuit breaker', async () => {
    const executor = new ResilientExecutor({
      retry: { maxRetries: 1, initialDelay: 10 },
      circuitBreaker: { failureThreshold: 2, resetTimeout: 10000 },
    });

    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    
    // Trigger failures to open circuit breaker
    await executor.execute(fn).catch(() => {});
    await executor.execute(fn).catch(() => {});
    
    // Circuit should now be open
    await expect(executor.execute(fn)).rejects.toThrow('Circuit breaker is open');
  });
});
