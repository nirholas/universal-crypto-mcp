/**
 * getDeFiPositions tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDeFiPositionsSchema, getDeFiPositionsDefinition } from '../tools/getDeFiPositions';

// Mock the lib modules
vi.mock('../lib', () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockResolvedValue({ data: {} }),
  })),
  Cache: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  })),
}));

// Mock the API clients
vi.mock('../apis/debank', () => ({
  getDeBankClient: vi.fn().mockReturnValue({
    isConfigured: vi.fn().mockReturnValue(false),
    getDeFiPositions: vi.fn().mockResolvedValue([]),
  }),
}));

describe('getDeFiPositions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod Schema validation', () => {
    it('should validate a valid address', () => {
      const result = getDeFiPositionsSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid address', () => {
      const result = getDeFiPositionsSchema.safeParse({
        address: 'not-valid',
      });
      expect(result.success).toBe(false);
    });

    it('should require address field', () => {
      const result = getDeFiPositionsSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(getDeFiPositionsDefinition.name).toBe('getDeFiPositions');
    });

    it('should have a description', () => {
      expect(getDeFiPositionsDefinition.description).toBeDefined();
      expect(typeof getDeFiPositionsDefinition.description).toBe('string');
    });

    it('should have inputSchema with address property', () => {
      expect(getDeFiPositionsDefinition.inputSchema.properties.address).toBeDefined();
    });

    it('should have address as required', () => {
      expect(getDeFiPositionsDefinition.inputSchema.required).toContain('address');
    });
  });
});
