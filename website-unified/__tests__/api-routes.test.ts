/**
 * API Routes Integration Tests
 * 
 * Tests for verifying all API routes work correctly
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('DeFi API Routes', () => {
  describe('GET /api/defi/tokens', () => {
    it('should return token list for ethereum', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/tokens?chain=ethereum`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('symbol');
      expect(data[0]).toHaveProperty('address');
      expect(data[0]).toHaveProperty('decimals');
    });

    it('should return token list for arbitrum', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/tokens?chain=arbitrum`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /api/defi/quote', () => {
    it('should return a swap quote', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          toToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          amount: '1000000000000000000', // 1 ETH
        }),
      });
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('fromAmount');
      expect(data).toHaveProperty('toAmount');
      expect(data).toHaveProperty('rate');
    });

    it('should return error for missing parameters', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromToken: '0x...' }),
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/defi/pools', () => {
    it('should return liquidity pools', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/pools`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter by chain', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/pools?chain=ethereum`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      data.forEach((pool: any) => {
        expect(pool.chain.toLowerCase()).toBe('ethereum');
      });
    });
  });

  describe('GET /api/defi/farms', () => {
    it('should return yield farms', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/farms`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should sort by APY', async () => {
      const response = await fetch(`${BASE_URL}/api/defi/farms?sortBy=apy`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      if (data.length > 1) {
        expect(data[0].apy).toBeGreaterThanOrEqual(data[1].apy);
      }
    });
  });
});

describe('Market API Routes', () => {
  describe('GET /api/market/prices', () => {
    it('should return token prices', async () => {
      const response = await fetch(`${BASE_URL}/api/market/prices`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should include price change data', async () => {
      const response = await fetch(`${BASE_URL}/api/market/prices?per_page=10`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('current_price');
        expect(data[0]).toHaveProperty('price_change_percentage_24h');
      }
    });
  });

  describe('GET /api/market/global', () => {
    it('should return global market data', async () => {
      const response = await fetch(`${BASE_URL}/api/market/global`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('total_market_cap');
      expect(data).toHaveProperty('total_volume');
    });
  });

  describe('GET /api/market/fear-greed', () => {
    it('should return fear/greed index', async () => {
      const response = await fetch(`${BASE_URL}/api/market/fear-greed`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('value');
      expect(data).toHaveProperty('classification');
      expect(data.value).toBeGreaterThanOrEqual(0);
      expect(data.value).toBeLessThanOrEqual(100);
    });
  });

  describe('GET /api/market/whales', () => {
    it('should return whale transactions', async () => {
      const response = await fetch(`${BASE_URL}/api/market/whales`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter by min amount', async () => {
      const response = await fetch(`${BASE_URL}/api/market/whales?minAmount=1000000`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      data.forEach((tx: any) => {
        expect(tx.amountUsd).toBeGreaterThanOrEqual(1000000);
      });
    });
  });
});

describe('Credits API Routes', () => {
  describe('GET /api/credits/balance', () => {
    it('should return credit balance', async () => {
      const response = await fetch(`${BASE_URL}/api/credits/balance`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('available');
      expect(data).toHaveProperty('pending');
      expect(data).toHaveProperty('spent');
      expect(data).toHaveProperty('currency');
    });
  });

  describe('GET /api/credits/transactions', () => {
    it('should return transactions', async () => {
      const response = await fetch(`${BASE_URL}/api/credits/transactions`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter by type', async () => {
      const response = await fetch(`${BASE_URL}/api/credits/transactions?type=usage`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      data.forEach((tx: any) => {
        expect(tx.type).toBe('usage');
      });
    });
  });

  describe('GET /api/credits/packages', () => {
    it('should return credit packages', async () => {
      const response = await fetch(`${BASE_URL}/api/credits/packages`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('credits');
      expect(data[0]).toHaveProperty('price');
    });
  });

  describe('GET /api/credits/usage', () => {
    it('should return usage stats', async () => {
      const response = await fetch(`${BASE_URL}/api/credits/usage`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('totalRequests');
      expect(data).toHaveProperty('totalCreditsUsed');
      expect(data).toHaveProperty('byService');
      expect(data).toHaveProperty('byDay');
    });
  });
});

describe('Agents API Routes', () => {
  describe('GET /api/agents', () => {
    it('should return agent list', async () => {
      const response = await fetch(`${BASE_URL}/api/agents`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
