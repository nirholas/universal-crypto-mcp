/**
 * Test suite for comparePrices tool
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { comparePrices } from '../tools/comparePrices.js';

// Mock the coingecko client
vi.mock('../apis/coingecko.js', () => ({
  coingeckoClient: {
    getPrices: vi.fn(),
  },
}));

import { coingeckoClient } from '../apis/coingecko.js';

describe('comparePrices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should compare prices for multiple tokens', async () => {
    const mockPrices = new Map([
      [
        'BTC',
        {
          price: 50000,
          change24h: 2.5,
          marketCap: 1000000000000,
          volume24h: 50000000000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
      [
        'ETH',
        {
          price: 3000,
          change24h: -1.5,
          marketCap: 350000000000,
          volume24h: 15000000000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
    ]);

    vi.mocked(coingeckoClient.getPrices).mockResolvedValue(mockPrices);

    const result = await comparePrices({
      symbols: ['BTC', 'ETH'],
      currency: 'usd',
    });

    expect(result.tokens).toHaveLength(2);
    expect(result.currency).toBe('USD');
    expect(result.summary.count).toBe(2);
  });

  it('should rank tokens by market cap', async () => {
    const mockPrices = new Map([
      [
        'SMALL',
        {
          price: 1,
          change24h: 0,
          marketCap: 1000000,
          volume24h: 100000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
      [
        'BIG',
        {
          price: 100,
          change24h: 0,
          marketCap: 1000000000000,
          volume24h: 50000000000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
    ]);

    vi.mocked(coingeckoClient.getPrices).mockResolvedValue(mockPrices);

    const result = await comparePrices({ symbols: ['SMALL', 'BIG'] });

    const bigToken = result.tokens.find((t) => t.symbol === 'BIG');
    const smallToken = result.tokens.find((t) => t.symbol === 'SMALL');

    expect(bigToken?.rank).toBe(1);
    expect(smallToken?.rank).toBe(2);
  });

  it('should identify best and worst performers', async () => {
    const mockPrices = new Map([
      [
        'WINNER',
        {
          price: 100,
          change24h: 25,
          marketCap: 1000000,
          volume24h: 100000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
      [
        'LOSER',
        {
          price: 50,
          change24h: -15,
          marketCap: 500000,
          volume24h: 50000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
    ]);

    vi.mocked(coingeckoClient.getPrices).mockResolvedValue(mockPrices);

    const result = await comparePrices({ symbols: ['WINNER', 'LOSER'] });

    expect(result.summary.bestPerformer?.symbol).toBe('WINNER');
    expect(result.summary.worstPerformer?.symbol).toBe('LOSER');
  });

  it('should throw error for empty symbols array', async () => {
    await expect(comparePrices({ symbols: [] })).rejects.toThrow(
      'Symbols array cannot be empty'
    );
  });

  it('should throw error for too many symbols', async () => {
    const tooMany = Array.from({ length: 30 }, (_, i) => `TOKEN${i}`);
    await expect(comparePrices({ symbols: tooMany })).rejects.toThrow(
      'Cannot compare more than 25 tokens'
    );
  });

  it('should throw error for missing symbols', async () => {
    await expect(comparePrices({})).rejects.toThrow('Symbols array is required');
  });

  it('should deduplicate symbols', async () => {
    const mockPrices = new Map([
      [
        'BTC',
        {
          price: 50000,
          change24h: 2.5,
          marketCap: 1000000000000,
          volume24h: 50000000000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
    ]);

    vi.mocked(coingeckoClient.getPrices).mockResolvedValue(mockPrices);

    const result = await comparePrices({ symbols: ['BTC', 'btc', 'BTC'] });

    // Should only call API once for deduplicated symbol
    expect(coingeckoClient.getPrices).toHaveBeenCalledTimes(1);
    const callArgs = vi.mocked(coingeckoClient.getPrices).mock.calls[0];
    expect(callArgs[0]).toHaveLength(1);
  });

  it('should calculate summary statistics correctly', async () => {
    const mockPrices = new Map([
      [
        'A',
        {
          price: 100,
          change24h: 10,
          marketCap: 1000000,
          volume24h: 100000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
      [
        'B',
        {
          price: 200,
          change24h: -10,
          marketCap: 2000000,
          volume24h: 200000,
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      ],
    ]);

    vi.mocked(coingeckoClient.getPrices).mockResolvedValue(mockPrices);

    const result = await comparePrices({ symbols: ['A', 'B'] });

    expect(result.summary.totalMarketCap).toBe(3000000);
    expect(result.summary.averageChange24h).toBe(0); // (10 + -10) / 2
  });
});
