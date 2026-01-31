/**
 * Shared Utilities Tests
 * 
 * Integration tests for the shared utilities package
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Rate Limiter
import {
  RateLimiter,
  SlidingWindowRateLimiter,
  RateLimiterRegistry,
  API_RATE_LIMITS,
} from '../rate-limiter/index.js';

// Retry & Circuit Breaker
import {
  retry,
  CircuitBreaker,
  CircuitState,
  ResilientExecutor,
} from '../retry/index.js';

// Errors
import {
  UCMCPError,
  ApiError,
  RateLimitError,
  TimeoutError,
  ValidationError,
  BlockchainError,
  AuthenticationError,
  GuardrailError,
} from '../errors/index.js';

// Logger
import {
  createLogger,
  redactSensitive,
} from '../logger/index.js';

// Timeout
import {
  withTimeout,
  waitFor,
  DEFAULT_TIMEOUTS,
} from '../timeout/index.js';

// Secrets
import {
  MemorySecretProvider,
  SecretsManager,
} from '../secrets/index.js';

// Feature Flags
import {
  FeatureFlagManager,
} from '../feature-flags/index.js';

// Guardrails
import {
  AgentGuardrails,
  ApprovalQueue,
} from '../guardrails/index.js';

// ============================================================================
// Rate Limiter Tests
// ============================================================================

describe('RateLimiter', () => {
  it('should allow requests within limit', async () => {
    const limiter = new RateLimiter({
      maxTokens: 10,
      refillRate: 10,
      refillInterval: 1000,
    });

    const result = await limiter.acquire();
    expect(result.allowed).toBe(true);
    expect(result.remainingTokens).toBe(9);
  });

  it('should block requests when exhausted', async () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillRate: 1,
      refillInterval: 60000,
      maxWaitTime: 10, // Very short wait time
    });

    await limiter.acquire(); // Use the only token
    const result = await limiter.acquire();
    
    expect(result.allowed).toBe(false);
    expect(result.remainingTokens).toBe(0);
  });
});

describe('SlidingWindowRateLimiter', () => {
  it('should track requests in sliding window', async () => {
    const limiter = new SlidingWindowRateLimiter({
      windowSizeMs: 1000,
      maxRequests: 5,
    });

    for (let i = 0; i < 5; i++) {
      const result = limiter.tryAcquire();
      expect(result.allowed).toBe(true);
    }

    const blocked = limiter.tryAcquire();
    expect(blocked.allowed).toBe(false);
  });
});

describe('RateLimiterRegistry', () => {
  it('should cache limiters by name', () => {
    const registry = new RateLimiterRegistry();
    
    const limiter1 = registry.get('test', { maxTokens: 10, refillRate: 5, refillInterval: 1000 });
    const limiter2 = registry.get('test');
    
    expect(limiter1).toBe(limiter2);
  });
});

// ============================================================================
// Retry Tests
// ============================================================================

describe('retry', () => {
  it('should succeed on first try', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    
    const result = await retry(fn, { maxRetries: 3, initialDelay: 100, maxDelay: 1000 });
    
    expect(result.success).toBe(true);
    expect(result.data).toBe('success');
    expect(result.attempts).toBe(1);
  });

  it('should retry on transient errors', async () => {
    // Create an error that matches retryable patterns
    const timeoutError = new Error('Connection timeout');
    const fn = vi.fn()
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValue('success');
    
    const result = await retry(fn, { maxRetries: 3, initialDelay: 10, maxDelay: 100 });
    
    expect(result.success).toBe(true);
    expect(result.data).toBe('success');
    expect(result.attempts).toBe(2);
  });

  it('should return failure after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('network timeout'));
    
    const result = await retry(fn, { maxRetries: 2, initialDelay: 10, maxDelay: 100 });
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.attempts).toBe(3); // initial + 2 retries
  });
});

describe('CircuitBreaker', () => {
  it('should be closed initially', () => {
    const cb = new CircuitBreaker({
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 10000,
    });
    
    expect(cb.getStats().state).toBe(CircuitState.CLOSED);
  });

  it('should execute function when closed', async () => {
    const cb = new CircuitBreaker({
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 10000,
    });
    
    const result = await cb.execute(() => Promise.resolve('test'));
    expect(result).toBe('test');
  });
});

// ============================================================================
// Error Tests
// ============================================================================

describe('UCMCPError', () => {
  it('should create error with code', () => {
    const error = new UCMCPError('Test error', 'TEST_CODE');
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.timestamp).toBeInstanceOf(Date);
  });

  it('should serialize to JSON', () => {
    const error = new UCMCPError('Test', 'TEST', { context: { key: 'value' } });
    const json = error.toJSON();
    
    expect(json.code).toBe('TEST');
    expect(json.context).toEqual({ key: 'value' });
  });
});

describe('ApiError', () => {
  it('should include status code', () => {
    const error = new ApiError('Not found', { statusCode: 404, endpoint: '/api/test' });
    
    expect(error.statusCode).toBe(404);
    expect(error.endpoint).toBe('/api/test');
  });
});

describe('RateLimitError', () => {
  it('should include retry after', () => {
    const error = new RateLimitError('Rate limited', { retryAfter: 1000 });
    
    expect(error.retryAfter).toBe(1000);
  });
});

describe('TimeoutError', () => {
  it('should include timeout ms', () => {
    const error = new TimeoutError('Timed out', { timeoutMs: 5000 });
    
    expect(error.timeoutMs).toBe(5000);
  });
});

describe('ValidationError', () => {
  it('should include field info', () => {
    const error = new ValidationError('Invalid', { field: 'email', value: 'bad' });
    
    expect(error.field).toBe('email');
  });
});

describe('BlockchainError', () => {
  it('should include chain info', () => {
    const error = new BlockchainError('Failed', { chainId: 1 });
    
    expect(error.chainId).toBe(1);
  });
});

describe('GuardrailError', () => {
  it('should include guardrail info', () => {
    const error = new GuardrailError('Blocked', { guardrail: 'spending_limit' });
    
    expect(error.guardrail).toBe('spending_limit');
  });
});

// ============================================================================
// Logger Tests
// ============================================================================

describe('Logger', () => {
  it('should create logger', () => {
    const logger = createLogger({ name: 'test' });
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should create child logger', () => {
    const logger = createLogger({ name: 'parent' });
    const child = logger.child({ module: 'child' });
    expect(child).toBeDefined();
  });
});

describe('redactSensitive', () => {
  it('should redact password fields', () => {
    const data = { password: 'secret123' };
    const result = redactSensitive(data);
    expect(result.password).toBe('[REDACTED]');
  });

  it('should redact apiKey fields', () => {
    const data = { apiKey: 'key123' };
    const result = redactSensitive(data);
    expect(result.apiKey).toBe('[REDACTED]');
  });

  it('should preserve non-sensitive fields', () => {
    const data = { username: 'john', password: 'secret' };
    const result = redactSensitive(data);
    expect(result.username).toBe('john');
    expect(result.password).toBe('[REDACTED]');
  });
});

// ============================================================================
// Timeout Tests
// ============================================================================

describe('withTimeout', () => {
  it('should resolve if within timeout', async () => {
    const promise = Promise.resolve('success');
    const result = await withTimeout(promise, { timeoutMs: 1000 });
    expect(result).toBe('success');
  });

  it('should reject if timeout exceeded', async () => {
    const promise = new Promise(resolve => setTimeout(() => resolve('late'), 1000));
    
    await expect(withTimeout(promise, { timeoutMs: 10 })).rejects.toThrow();
  });
});

describe('waitFor', () => {
  it('should wait until condition is true', async () => {
    let count = 0;
    const condition = async () => {
      count++;
      return count >= 3;
    };
    
    await waitFor(condition, { timeoutMs: 1000, pollInterval: 10 });
    expect(count).toBe(3);
  });
});

describe('DEFAULT_TIMEOUTS', () => {
  it('should have standard timeout values', () => {
    expect(DEFAULT_TIMEOUTS.HTTP_REQUEST).toBeGreaterThan(0);
    expect(DEFAULT_TIMEOUTS.TRANSACTION).toBeGreaterThan(0);
  });
});

// ============================================================================
// Secrets Tests
// ============================================================================

describe('MemorySecretProvider', () => {
  it('should store and retrieve secrets', async () => {
    const provider = new MemorySecretProvider({ API_KEY: 'test123' });
    
    expect(await provider.get('API_KEY')).toBe('test123');
    expect(await provider.has('API_KEY')).toBe(true);
    expect(await provider.has('MISSING')).toBe(false);
  });

  it('should set and delete secrets', async () => {
    const provider = new MemorySecretProvider();
    
    await provider.set('NEW_KEY', 'value');
    expect(await provider.get('NEW_KEY')).toBe('value');
    
    await provider.delete('NEW_KEY');
    expect(await provider.has('NEW_KEY')).toBe(false);
  });
});

describe('SecretsManager', () => {
  it('should get secrets from provider', async () => {
    const provider = new MemorySecretProvider({ SECRET: 'value' });
    const manager = new SecretsManager({ provider });
    
    const value = await manager.get('SECRET');
    expect(value).toBe('value');
  });

  it('should require mandatory secrets', async () => {
    const provider = new MemorySecretProvider({ PRESENT: 'yes' });
    const manager = new SecretsManager({ 
      provider,
      required: ['PRESENT', 'MISSING']
    });
    
    await expect(manager.validate()).rejects.toThrow();
  });
});

// ============================================================================
// Feature Flags Tests
// ============================================================================

describe('FeatureFlagManager', () => {
  it('should return default value for flag', () => {
    const manager = new FeatureFlagManager({
      flags: [
        { name: 'test-flag', defaultValue: true },
        { name: 'disabled-flag', defaultValue: false },
      ],
    });
    
    expect(manager.isEnabled('test-flag')).toBe(true);
    expect(manager.isEnabled('disabled-flag')).toBe(false);
    expect(manager.isEnabled('unknown-flag')).toBe(false);
  });

  it('should support overrides', () => {
    const manager = new FeatureFlagManager({
      flags: [{ name: 'test-flag', defaultValue: false }],
    });
    
    manager.setOverride('test-flag', true);
    expect(manager.isEnabled('test-flag')).toBe(true);
    
    manager.clearOverride('test-flag');
    expect(manager.isEnabled('test-flag')).toBe(false);
  });

  it('should support global kill switch', () => {
    const manager = new FeatureFlagManager({
      flags: [{ name: 'test-flag', defaultValue: true }],
      globalKillSwitch: true,
    });
    
    expect(manager.isEnabled('test-flag')).toBe(false);
  });
});

// ============================================================================
// Guardrails Tests
// ============================================================================

describe('ApprovalQueue', () => {
  let queue: ApprovalQueue;

  beforeEach(() => {
    queue = new ApprovalQueue();
  });

  it('should create approval request', () => {
    const request = queue.createRequest(
      'agent-1',
      { type: 'transfer', chain: 'ethereum' },
      { requiredApprovers: 1, expiresIn: 3600000 }
    );
    
    expect(request.id).toBeDefined();
    expect(request.agentId).toBe('agent-1');
    expect(request.action.type).toBe('transfer');
    expect(request.status).toBe('pending');
  });

  it('should approve request', () => {
    const request = queue.createRequest(
      'agent-1',
      { type: 'transfer', chain: 'ethereum' },
      { requiredApprovers: 1, expiresIn: 3600000 }
    );
    
    queue.addApproval(request.id, 'approver-1', 'Looks good');
    const updated = queue.getRequest(request.id);
    
    expect(updated?.status).toBe('approved');
    expect(updated?.approvals.length).toBe(1);
  });

  it('should reject request', () => {
    const request = queue.createRequest(
      'agent-1',
      { type: 'transfer', chain: 'ethereum' },
      { requiredApprovers: 1, expiresIn: 3600000 }
    );
    
    queue.reject(request.id, 'rejector-1', 'Not approved');
    const updated = queue.getRequest(request.id);
    
    expect(updated?.status).toBe('rejected');
  });

  it('should get pending requests', () => {
    queue.createRequest('agent-1', { type: 'transfer', chain: 'ethereum' }, { requiredApprovers: 1, expiresIn: 3600000 });
    queue.createRequest('agent-1', { type: 'swap', chain: 'ethereum' }, { requiredApprovers: 1, expiresIn: 3600000 });
    
    const pending = queue.getPendingRequests();
    expect(pending.length).toBe(2);
  });
});

describe('AgentGuardrails', () => {
  it('should allow actions within limits', async () => {
    const guardrails = new AgentGuardrails({
      agentId: 'test-agent',
      spendingLimits: [],
      approvalRules: [],
    });
    
    const result = await guardrails.check({
      type: 'transfer',
      chain: 'ethereum',
    });
    
    expect(result.allowed).toBe(true);
  });

  it('should block when kill switch is active', async () => {
    const guardrails = new AgentGuardrails({
      agentId: 'test-agent',
      spendingLimits: [],
      approvalRules: [],
    });
    
    guardrails.activateKillSwitch('Emergency');
    
    const result = await guardrails.check({
      type: 'transfer',
      chain: 'ethereum',
    });
    
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Kill switch');
  });
});
