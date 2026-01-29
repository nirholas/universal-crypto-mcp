/**
 * Utility Functions Tests
 */

import { describe, it, expect } from 'vitest';
import {
  isValidPublicKey,
  shortenAddress,
  lamportsToSol,
  solToLamports,
  formatTokenAmount,
  parseTokenAmount,
  chunkArray,
  sleep,
} from '../utils/helpers.js';

describe('Utility Functions', () => {
  describe('isValidPublicKey', () => {
    it('should return true for valid public key', () => {
      expect(isValidPublicKey('So11111111111111111111111111111111111111112')).toBe(true);
    });

    it('should return false for invalid public key', () => {
      expect(isValidPublicKey('invalid')).toBe(false);
      expect(isValidPublicKey('')).toBe(false);
      expect(isValidPublicKey('0x1234')).toBe(false);
    });
  });

  describe('shortenAddress', () => {
    it('should shorten address with default chars', () => {
      const address = 'So11111111111111111111111111111111111111112';
      expect(shortenAddress(address)).toBe('So11...1112');
    });

    it('should shorten address with custom chars', () => {
      const address = 'So11111111111111111111111111111111111111112';
      expect(shortenAddress(address, 6)).toBe('So1111...111112');
    });
  });

  describe('lamportsToSol', () => {
    it('should convert lamports to SOL', () => {
      expect(lamportsToSol(1_000_000_000)).toBe(1);
      expect(lamportsToSol(500_000_000)).toBe(0.5);
      expect(lamportsToSol(BigInt(2_000_000_000))).toBe(2);
    });
  });

  describe('solToLamports', () => {
    it('should convert SOL to lamports', () => {
      expect(solToLamports(1)).toBe(BigInt(1_000_000_000));
      expect(solToLamports(0.5)).toBe(BigInt(500_000_000));
      expect(solToLamports(2.5)).toBe(BigInt(2_500_000_000));
    });
  });

  describe('formatTokenAmount', () => {
    it('should format token amount', () => {
      expect(formatTokenAmount(BigInt(1000000), 6)).toBe('1');
      expect(formatTokenAmount(BigInt(1500000), 6)).toBe('1.5');
      expect(formatTokenAmount(BigInt(1000000000), 9)).toBe('1');
    });
  });

  describe('parseTokenAmount', () => {
    it('should parse token amount', () => {
      expect(parseTokenAmount('1', 6)).toBe(BigInt(1000000));
      expect(parseTokenAmount('1.5', 6)).toBe(BigInt(1500000));
      expect(parseTokenAmount('100', 9)).toBe(BigInt(100000000000));
    });
  });

  describe('chunkArray', () => {
    it('should chunk array', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const chunks = chunkArray(arr, 3);
      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty array', () => {
      expect(chunkArray([], 3)).toEqual([]);
    });
  });

  describe('sleep', () => {
    it('should sleep for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(95);
    });
  });
});
