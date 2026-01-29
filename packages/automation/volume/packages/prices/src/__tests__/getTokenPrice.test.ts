/**
 * Test suite for getTokenPrice tool
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTokenPrice } from '../tools/getTokenPrice.js';

// Mock the coingecko client
vi.mock('../apis/coingecko.js', () => ({
  coingeckoClient: {
    getPrice: vi.fn(),
  },
}));

import { coingeckoClient } from '../apis/coingecko.js';

describe('getTokenPrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return price data for a valid token', async () => {
    const mockPriceData = {
      price: 50000,
      change24h: 2.5678,
      marketCap: 1000000000000,
      volume24h: 50000000000,
      lastUpdated: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(coingeckoClient.getPrice).mockResolvedValue(mockPriceData);

    const result = await getTokenPrice({ symbol: 'BTC', currency: 'usd' });

    expect(result).toEqual({
      symbol: 'BTC',
      price: 50000,
      change24h: 2.57, // Rounded to 2 decimal places
      marketCap: 1000000000000,
      volume24h: 50000000000,
      currency: 'USD',
      lastUpdated: '2024-01-01T00:00:00.000Z',
    });

    expect(coingeckoClient.getPrice).toHaveBeenCalledWith('BTC', 'usd');
  });

  it('should use default currency when not specified', async () => {
    const mockPriceData = {
      price: 3000,
      change24h: -1.2,
      marketCap: 350000000000,
      volume24h: 15000000000,
      lastUpdated: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(coingeckoClient.getPrice).mockResolvedValue(mockPriceData);

    const result = await getTokenPrice({ symbol: 'ETH' });

    expect(result.currency).toBe('USD');
    expect(coingeckoClient.getPrice).toHaveBeenCalledWith('ETH', 'usd');
  });

  it('should normalize symbol to uppercase', async () => {
    const mockPriceData = {
      price: 100,
      change24h: 5,
      marketCap: 1000000,
      volume24h: 100000,
      lastUpdated: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(coingeckoClient.getPrice).mockResolvedValue(mockPriceData);

    const result = await getTokenPrice({ symbol: 'sol' });

    expect(result.symbol).toBe('SOL');
  });

  it('should throw error for missing symbol', async () => {
    await expect(getTokenPrice({})).rejects.toThrow('Symbol is required');
  });

  it('should throw error for empty symbol', async () => {
    await expect(getTokenPrice({ symbol: '   ' })).rejects.toThrow('Symbol cannot be empty');
  });

  it('should throw error for invalid input type', async () => {
    await expect(getTokenPrice('BTC')).rejects.toThrow('Input must be an object');
    await expect(getTokenPrice(null)).rejects.toThrow('Input must be an object');
  });

  it('should handle API errors', async () => {
    vi.mocked(coingeckoClient.getPrice).mockRejectedValue(
      new Error('Token not found: INVALID')
    );

    await expect(getTokenPrice({ symbol: 'INVALID' })).rejects.toThrow('Token not found');
  });
});
