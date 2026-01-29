/**
 * getWalletPortfolio tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWalletPortfolioSchema, getWalletPortfolioDefinition } from '../tools/getWalletPortfolio';

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
    getTokenBalances: vi.fn().mockResolvedValue([
      {
        contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        balance: '1000000000',
        metadata: { symbol: 'USDC', decimals: 6, name: 'USD Coin' },
      },
    ]),
    getETHBalance: vi.fn().mockResolvedValue('1000000000000000000'),
  },
}));

vi.mock('../apis/defillama', () => ({
  defiLlamaClient: {
    isConfigured: vi.fn().mockReturnValue(false),
  },
}));

describe('getWalletPortfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod Schema validation', () => {
    it('should validate a valid address', () => {
      const result = getWalletPortfolioSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid address', () => {
      const result = getWalletPortfolioSchema.safeParse({
        address: 'not-an-address',
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid chain values', () => {
      const result = getWalletPortfolioSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        chain: 'ethereum',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid chain values', () => {
      const result = getWalletPortfolioSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        chain: 'invalid-chain',
      });
      expect(result.success).toBe(false);
    });

    it('should default to ethereum chain', () => {
      const result = getWalletPortfolioSchema.parse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.chain).toBe('ethereum');
    });
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(getWalletPortfolioDefinition.name).toBe('getWalletPortfolio');
    });

    it('should have a description', () => {
      expect(getWalletPortfolioDefinition.description).toBeDefined();
      expect(typeof getWalletPortfolioDefinition.description).toBe('string');
    });

    it('should have inputSchema with address property', () => {
      expect(getWalletPortfolioDefinition.inputSchema.properties.address).toBeDefined();
    });

    it('should have address as required', () => {
      expect(getWalletPortfolioDefinition.inputSchema.required).toContain('address');
    });
  });
});
