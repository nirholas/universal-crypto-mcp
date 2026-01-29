/**
 * getTokenBalances tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTokenBalancesSchema, getTokenBalancesDefinition } from '../tools/getTokenBalances';

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
vi.mock('../apis/alchemy', () => ({
  alchemyClient: {
    getTokenBalances: vi.fn().mockResolvedValue([]),
    getETHBalance: vi.fn().mockResolvedValue('1000000000000000000'),
  },
}));

describe('getTokenBalances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod Schema validation', () => {
    it('should validate a valid address', () => {
      const result = getTokenBalancesSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid address', () => {
      const result = getTokenBalancesSchema.safeParse({
        address: 'not-valid',
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid chain values', () => {
      const chains = ['ethereum', 'arbitrum', 'base', 'polygon'];
      for (const chain of chains) {
        const result = getTokenBalancesSchema.safeParse({
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          chain,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should default to ethereum chain', () => {
      const result = getTokenBalancesSchema.parse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.chain).toBe('ethereum');
    });

    it('should default includeSpam to false', () => {
      const result = getTokenBalancesSchema.parse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.includeSpam).toBe(false);
    });
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(getTokenBalancesDefinition.name).toBe('getTokenBalances');
    });

    it('should have a description', () => {
      expect(getTokenBalancesDefinition.description).toBeDefined();
      expect(typeof getTokenBalancesDefinition.description).toBe('string');
    });

    it('should have inputSchema with address property', () => {
      expect(getTokenBalancesDefinition.inputSchema.properties.address).toBeDefined();
    });

    it('should have address as required', () => {
      expect(getTokenBalancesDefinition.inputSchema.required).toContain('address');
    });
  });
});
