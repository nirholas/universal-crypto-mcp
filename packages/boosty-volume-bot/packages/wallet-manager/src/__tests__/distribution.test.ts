/**
 * Distribution Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDistribution,
  MAX_INSTRUCTIONS_PER_TX,
} from '../distribution/index.js';

describe('calculateDistribution', () => {
  describe('even distribution', () => {
    it('distributes evenly', () => {
      const amounts = calculateDistribution(BigInt(1000), 4, 'even');
      
      expect(amounts).toHaveLength(4);
      expect(amounts.every(a => a === BigInt(250))).toBe(true);
    });

    it('handles remainder', () => {
      const amounts = calculateDistribution(BigInt(1000), 3, 'even');
      
      expect(amounts).toHaveLength(3);
      // 1000 / 3 = 333 remainder 1
      // First wallet gets the extra 1
      expect(amounts[0]).toBe(BigInt(334));
      expect(amounts[1]).toBe(BigInt(333));
      expect(amounts[2]).toBe(BigInt(333));
      
      // Total should equal original
      const total = amounts.reduce((a, b) => a + b, BigInt(0));
      expect(total).toBe(BigInt(1000));
    });

    it('handles single wallet', () => {
      const amounts = calculateDistribution(BigInt(1000), 1, 'even');
      
      expect(amounts).toHaveLength(1);
      expect(amounts[0]).toBe(BigInt(1000));
    });

    it('handles large amounts', () => {
      const total = BigInt('1000000000000'); // 1 trillion
      const amounts = calculateDistribution(total, 100, 'even');
      
      expect(amounts).toHaveLength(100);
      const sum = amounts.reduce((a, b) => a + b, BigInt(0));
      expect(sum).toBe(total);
    });
  });

  describe('weighted distribution', () => {
    it('distributes by weights', () => {
      const amounts = calculateDistribution(
        BigInt(1000),
        4,
        'weighted',
        [0.5, 0.25, 0.15, 0.1]
      );
      
      expect(amounts).toHaveLength(4);
      expect(amounts[0]).toBeGreaterThan(amounts[1]);
      expect(amounts[1]).toBeGreaterThan(amounts[2]);
      expect(amounts[2]).toBeGreaterThan(amounts[3]);
      
      // Total should equal original
      const total = amounts.reduce((a, b) => a + b, BigInt(0));
      expect(total).toBe(BigInt(1000));
    });

    it('normalizes weights', () => {
      // Weights that don't sum to 1
      const amounts = calculateDistribution(
        BigInt(1000),
        3,
        'weighted',
        [2, 2, 1]
      );
      
      expect(amounts).toHaveLength(3);
      expect(amounts[0]).toBe(amounts[1]); // Equal weights
      expect(amounts[0]).toBeGreaterThan(amounts[2]);
      
      const total = amounts.reduce((a, b) => a + b, BigInt(0));
      expect(total).toBe(BigInt(1000));
    });

    it('throws for mismatched weight count', () => {
      expect(() => 
        calculateDistribution(BigInt(1000), 4, 'weighted', [0.5, 0.5])
      ).toThrow();
    });

    it('throws for zero total weight', () => {
      expect(() => 
        calculateDistribution(BigInt(1000), 3, 'weighted', [0, 0, 0])
      ).toThrow();
    });
  });

  describe('random distribution', () => {
    it('distributes randomly', () => {
      const amounts = calculateDistribution(BigInt(1000), 5, 'random');
      
      expect(amounts).toHaveLength(5);
      
      // Total should equal original
      const total = amounts.reduce((a, b) => a + b, BigInt(0));
      expect(total).toBe(BigInt(1000));
      
      // Not all amounts should be equal (extremely unlikely)
      const allEqual = amounts.every(a => a === amounts[0]);
      expect(allEqual).toBe(false);
    });

    it('produces different distributions each time', () => {
      const amounts1 = calculateDistribution(BigInt(1000), 5, 'random');
      const amounts2 = calculateDistribution(BigInt(1000), 5, 'random');
      
      // Very unlikely to be exactly the same
      const same = amounts1.every((a, i) => a === amounts2[i]);
      expect(same).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for zero wallets', () => {
      const amounts = calculateDistribution(BigInt(1000), 0, 'even');
      expect(amounts).toHaveLength(0);
    });

    it('handles very small amounts', () => {
      const amounts = calculateDistribution(BigInt(3), 10, 'even');
      
      expect(amounts).toHaveLength(10);
      const total = amounts.reduce((a, b) => a + b, BigInt(0));
      expect(total).toBe(BigInt(3));
      
      // First 3 wallets get 1, rest get 0
      const nonZero = amounts.filter(a => a > BigInt(0)).length;
      expect(nonZero).toBe(3);
    });
  });
});

describe('Constants', () => {
  it('has reasonable max instructions per tx', () => {
    expect(MAX_INSTRUCTIONS_PER_TX).toBeGreaterThan(0);
    expect(MAX_INSTRUCTIONS_PER_TX).toBeLessThanOrEqual(30);
  });
});
