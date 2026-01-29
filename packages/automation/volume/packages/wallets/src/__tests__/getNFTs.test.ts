/**
 * getNFTs tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNFTsSchema, getNFTsDefinition } from '../tools/getNFTs';

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
    getNFTs: vi.fn().mockResolvedValue([]),
  },
}));

describe('getNFTs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod Schema validation', () => {
    it('should validate a valid address', () => {
      const result = getNFTsSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid address', () => {
      const result = getNFTsSchema.safeParse({
        address: 'invalid',
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid chain values', () => {
      const chains = ['ethereum', 'arbitrum', 'base', 'polygon'];
      for (const chain of chains) {
        const result = getNFTsSchema.safeParse({
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          chain,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should default to ethereum chain', () => {
      const result = getNFTsSchema.parse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.chain).toBe('ethereum');
    });

    it('should default limit to 50', () => {
      const result = getNFTsSchema.parse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.limit).toBe(50);
    });

    it('should reject limit over 100', () => {
      const result = getNFTsSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        limit: 150,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(getNFTsDefinition.name).toBe('getNFTs');
    });

    it('should have a description', () => {
      expect(getNFTsDefinition.description).toBeDefined();
      expect(typeof getNFTsDefinition.description).toBe('string');
    });

    it('should have inputSchema with address property', () => {
      expect(getNFTsDefinition.inputSchema.properties.address).toBeDefined();
    });
  });
});
