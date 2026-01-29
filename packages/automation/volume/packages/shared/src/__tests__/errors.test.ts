import { describe, it, expect } from 'vitest';
import {
  MCPError,
  RateLimitError,
  APIError,
  ValidationError,
  NetworkError,
  ChainNotSupportedError,
  TokenNotFoundError,
  isMCPError,
  wrapError,
} from '../errors.js';

describe('MCPError', () => {
  it('should create error with message and code', () => {
    const error = new MCPError('Test error', 'TEST_CODE');
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('MCPError');
  });

  it('should include optional properties', () => {
    const cause = new Error('Original');
    const error = new MCPError('Test error', 'TEST_CODE', {
      statusCode: 500,
      details: { key: 'value' },
      cause,
    });
    
    expect(error.statusCode).toBe(500);
    expect(error.details).toEqual({ key: 'value' });
    expect(error.cause).toBe(cause);
  });

  it('should serialize to JSON', () => {
    const error = new MCPError('Test error', 'TEST_CODE', {
      statusCode: 500,
      details: { key: 'value' },
    });
    
    const json = error.toJSON();
    
    expect(json.name).toBe('MCPError');
    expect(json.message).toBe('Test error');
    expect(json.code).toBe('TEST_CODE');
    expect(json.statusCode).toBe(500);
    expect(json.details).toEqual({ key: 'value' });
  });
});

describe('RateLimitError', () => {
  it('should have correct defaults', () => {
    const error = new RateLimitError();
    
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(error.statusCode).toBe(429);
    expect(error.name).toBe('RateLimitError');
  });

  it('should include retry after info', () => {
    const error = new RateLimitError('Too many requests', {
      retryAfterMs: 5000,
    });
    
    expect(error.retryAfterMs).toBe(5000);
    
    const json = error.toJSON();
    expect(json.retryAfterMs).toBe(5000);
  });
});

describe('APIError', () => {
  it('should include endpoint and method', () => {
    const error = new APIError('Request failed', {
      statusCode: 404,
      endpoint: '/api/v1/tokens',
      method: 'GET',
    });
    
    expect(error.name).toBe('APIError');
    expect(error.code).toBe('API_ERROR');
    expect(error.endpoint).toBe('/api/v1/tokens');
    expect(error.method).toBe('GET');
    expect(error.statusCode).toBe(404);
  });

  it('should serialize endpoint and method to JSON', () => {
    const error = new APIError('Request failed', {
      endpoint: '/api/v1/tokens',
      method: 'POST',
    });
    
    const json = error.toJSON();
    expect(json.endpoint).toBe('/api/v1/tokens');
    expect(json.method).toBe('POST');
  });
});

describe('ValidationError', () => {
  it('should include field and value', () => {
    const error = new ValidationError('Invalid address', {
      field: 'address',
      value: 'invalid',
    });
    
    expect(error.name).toBe('ValidationError');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.field).toBe('address');
    expect(error.value).toBe('invalid');
  });
});

describe('NetworkError', () => {
  it('should indicate timeout', () => {
    const error = new NetworkError('Request timed out', {
      endpoint: 'https://api.example.com',
      isTimeout: true,
    });
    
    expect(error.name).toBe('NetworkError');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.statusCode).toBe(503);
    expect(error.isTimeout).toBe(true);
    expect(error.endpoint).toBe('https://api.example.com');
  });

  it('should default isTimeout to false', () => {
    const error = new NetworkError('Connection refused');
    expect(error.isTimeout).toBe(false);
  });
});

describe('ChainNotSupportedError', () => {
  it('should include chain info', () => {
    const error = new ChainNotSupportedError('fantom', ['ethereum', 'arbitrum']);
    
    expect(error.name).toBe('ChainNotSupportedError');
    expect(error.code).toBe('CHAIN_NOT_SUPPORTED');
    expect(error.chain).toBe('fantom');
    expect(error.supportedChains).toEqual(['ethereum', 'arbitrum']);
    expect(error.message).toBe('Chain "fantom" is not supported');
  });
});

describe('TokenNotFoundError', () => {
  it('should include token and chain info', () => {
    const error = new TokenNotFoundError('0x123...', 'ethereum');
    
    expect(error.name).toBe('TokenNotFoundError');
    expect(error.code).toBe('TOKEN_NOT_FOUND');
    expect(error.tokenAddress).toBe('0x123...');
    expect(error.chain).toBe('ethereum');
  });
});

describe('isMCPError', () => {
  it('should return true for MCP errors', () => {
    expect(isMCPError(new MCPError('test'))).toBe(true);
    expect(isMCPError(new RateLimitError())).toBe(true);
    expect(isMCPError(new APIError('test'))).toBe(true);
    expect(isMCPError(new ValidationError('test'))).toBe(true);
    expect(isMCPError(new NetworkError('test'))).toBe(true);
  });

  it('should return false for non-MCP errors', () => {
    expect(isMCPError(new Error('test'))).toBe(false);
    expect(isMCPError('string')).toBe(false);
    expect(isMCPError(null)).toBe(false);
    expect(isMCPError(undefined)).toBe(false);
  });
});

describe('wrapError', () => {
  it('should return MCP errors unchanged', () => {
    const original = new MCPError('original');
    expect(wrapError(original)).toBe(original);
  });

  it('should wrap standard errors', () => {
    const original = new Error('standard error');
    const wrapped = wrapError(original);
    
    expect(wrapped).toBeInstanceOf(MCPError);
    expect(wrapped.message).toBe('standard error');
    expect(wrapped.cause).toBe(original);
  });

  it('should wrap string errors', () => {
    const wrapped = wrapError('string error');
    
    expect(wrapped).toBeInstanceOf(MCPError);
    expect(wrapped.message).toBe('string error');
  });

  it('should use default message for unknown types', () => {
    const wrapped = wrapError({ weird: 'object' });
    
    expect(wrapped).toBeInstanceOf(MCPError);
    expect(wrapped.message).toBe('An unexpected error occurred');
  });

  it('should use custom default message', () => {
    const wrapped = wrapError(null, 'Custom default');
    
    expect(wrapped.message).toBe('Custom default');
  });
});
