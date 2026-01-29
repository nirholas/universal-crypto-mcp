import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_CHAINS,
  CHAIN_IDS,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_SYMBOL,
  API_ENDPOINTS,
  RPC_ENDPOINTS,
  BLOCK_EXPLORERS,
  TIMEOUTS,
  CACHE_TTL,
  RATE_LIMITS,
} from '../constants.js';
import type { Chain } from '../types.js';

describe('Constants', () => {
  describe('SUPPORTED_CHAINS', () => {
    it('should include all expected chains', () => {
      expect(SUPPORTED_CHAINS).toContain('ethereum');
      expect(SUPPORTED_CHAINS).toContain('arbitrum');
      expect(SUPPORTED_CHAINS).toContain('base');
      expect(SUPPORTED_CHAINS).toContain('optimism');
      expect(SUPPORTED_CHAINS).toContain('polygon');
      expect(SUPPORTED_CHAINS).toContain('avalanche');
      expect(SUPPORTED_CHAINS).toContain('bsc');
      expect(SUPPORTED_CHAINS).toContain('solana');
    });

    it('should have 8 supported chains', () => {
      expect(SUPPORTED_CHAINS).toHaveLength(8);
    });
  });

  describe('CHAIN_IDS', () => {
    it('should have correct chain IDs', () => {
      expect(CHAIN_IDS.ethereum).toBe(1);
      expect(CHAIN_IDS.arbitrum).toBe(42161);
      expect(CHAIN_IDS.base).toBe(8453);
      expect(CHAIN_IDS.polygon).toBe(137);
    });
  });

  describe('NATIVE_TOKEN_ADDRESS', () => {
    it('should have addresses for all chains', () => {
      for (const chain of SUPPORTED_CHAINS) {
        expect(NATIVE_TOKEN_ADDRESS[chain]).toBeDefined();
        expect(typeof NATIVE_TOKEN_ADDRESS[chain]).toBe('string');
      }
    });

    it('should have different address for Solana', () => {
      expect(NATIVE_TOKEN_ADDRESS.solana).not.toBe(NATIVE_TOKEN_ADDRESS.ethereum);
    });
  });

  describe('NATIVE_TOKEN_SYMBOL', () => {
    it('should have symbols for all chains', () => {
      for (const chain of SUPPORTED_CHAINS) {
        expect(NATIVE_TOKEN_SYMBOL[chain]).toBeDefined();
      }
    });

    it('should have correct symbols', () => {
      expect(NATIVE_TOKEN_SYMBOL.ethereum).toBe('ETH');
      expect(NATIVE_TOKEN_SYMBOL.polygon).toBe('POL'); // Polygon rebranded to POL
      expect(NATIVE_TOKEN_SYMBOL.solana).toBe('SOL');
      expect(NATIVE_TOKEN_SYMBOL.avalanche).toBe('AVAX');
      expect(NATIVE_TOKEN_SYMBOL.bsc).toBe('BNB');
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have valid HTTPS URLs', () => {
      const endpoints = Object.values(API_ENDPOINTS);
      for (const url of endpoints) {
        expect(url).toMatch(/^https:\/\//);
      }
    });

    it('should include major DeFi APIs', () => {
      expect(API_ENDPOINTS.COINGECKO).toBeDefined();
      expect(API_ENDPOINTS.DEFILLAMA).toBeDefined();
      expect(API_ENDPOINTS.DEFILLAMA_YIELDS).toBeDefined();
    });
  });

  describe('RPC_ENDPOINTS', () => {
    it('should have endpoints for all chains', () => {
      for (const chain of SUPPORTED_CHAINS) {
        expect(RPC_ENDPOINTS[chain]).toBeDefined();
        expect(RPC_ENDPOINTS[chain]).toMatch(/^https:\/\//);
      }
    });
  });

  describe('BLOCK_EXPLORERS', () => {
    it('should have explorers for all chains', () => {
      for (const chain of SUPPORTED_CHAINS) {
        expect(BLOCK_EXPLORERS[chain]).toBeDefined();
        expect(BLOCK_EXPLORERS[chain]).toMatch(/^https:\/\//);
      }
    });
  });

  describe('TIMEOUTS', () => {
    it('should have reasonable values', () => {
      expect(TIMEOUTS.DEFAULT).toBeGreaterThan(0);
      expect(TIMEOUTS.SHORT).toBeLessThan(TIMEOUTS.DEFAULT);
      expect(TIMEOUTS.LONG).toBeGreaterThan(TIMEOUTS.DEFAULT);
    });
  });

  describe('CACHE_TTL', () => {
    it('should have all expected cache durations', () => {
      expect(CACHE_TTL.PRICE).toBeDefined();
      expect(CACHE_TTL.GAS).toBeDefined();
      expect(CACHE_TTL.WALLET_BALANCE).toBeDefined();
      expect(CACHE_TTL.YIELDS).toBeDefined();
    });

    it('should have gas TTL shorter than price TTL', () => {
      expect(CACHE_TTL.GAS).toBeLessThan(CACHE_TTL.PRICE);
    });
  });

  describe('RATE_LIMITS', () => {
    it('should have positive values', () => {
      expect(RATE_LIMITS.DEFAULT_RPS).toBeGreaterThan(0);
      expect(RATE_LIMITS.COINGECKO_RPS).toBeGreaterThan(0);
      expect(RATE_LIMITS.DEFILLAMA_RPS).toBeGreaterThan(0);
    });
  });
});
