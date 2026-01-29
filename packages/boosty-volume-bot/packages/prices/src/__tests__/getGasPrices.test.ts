/**
 * Test suite for getGasPrices tool
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getGasPrices } from '../tools/getGasPrices.js';

const SUPPORTED_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'polygon',
  'optimism',
  'avalanche',
];

// Mock the gas fetcher
vi.mock('../apis/gas.js', () => ({
  gasFetcher: {
    getGasPrice: vi.fn(),
    getAllGasPrices: vi.fn(),
    getSupportedChains: vi.fn(() => SUPPORTED_CHAINS),
  },
}));

import { gasFetcher } from '../apis/gas.js';

describe('getGasPrices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-setup the mock for getSupportedChains
    vi.mocked(gasFetcher.getSupportedChains).mockReturnValue(SUPPORTED_CHAINS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return gas prices for a specific chain', async () => {
    const mockGasPrice = {
      chain: 'Ethereum',
      chainId: 1,
      low: 20,
      medium: 25,
      high: 30,
      baseFee: 18.5,
      timestamp: '2024-01-01T00:00:00.000Z',
      unit: 'gwei',
    };

    vi.mocked(gasFetcher.getGasPrice).mockResolvedValue(mockGasPrice);

    const result = await getGasPrices({ chain: 'ethereum' });

    expect(result.gasPrices).toHaveLength(1);
    expect(result.gasPrices[0]).toEqual(mockGasPrice);
    expect(result.supportedChains).toContain('ethereum');
    expect(gasFetcher.getGasPrice).toHaveBeenCalledWith('ethereum');
  });

  it('should return gas prices for all chains when no chain specified', async () => {
    const mockGasPrices = [
      {
        chain: 'Ethereum',
        chainId: 1,
        low: 20,
        medium: 25,
        high: 30,
        timestamp: '2024-01-01T00:00:00.000Z',
        unit: 'gwei',
      },
      {
        chain: 'Arbitrum One',
        chainId: 42161,
        low: 0.1,
        medium: 0.1,
        high: 0.1,
        timestamp: '2024-01-01T00:00:00.000Z',
        unit: 'gwei',
      },
    ];

    vi.mocked(gasFetcher.getAllGasPrices).mockResolvedValue(mockGasPrices);

    const result = await getGasPrices({});

    expect(result.gasPrices).toHaveLength(2);
    expect(gasFetcher.getAllGasPrices).toHaveBeenCalled();
    expect(gasFetcher.getGasPrice).not.toHaveBeenCalled();
  });

  it('should work with null/undefined input', async () => {
    vi.mocked(gasFetcher.getAllGasPrices).mockResolvedValue([]);

    const result1 = await getGasPrices(null);
    const result2 = await getGasPrices(undefined);

    expect(result1.gasPrices).toEqual([]);
    expect(result2.gasPrices).toEqual([]);
  });

  it('should throw error for unsupported chain', async () => {
    await expect(getGasPrices({ chain: 'unsupported' })).rejects.toThrow(
      /Unsupported chain/
    );
  });

  it('should include supported chains in response', async () => {
    vi.mocked(gasFetcher.getAllGasPrices).mockResolvedValue([]);

    const result = await getGasPrices({});

    expect(Array.isArray(result.supportedChains)).toBe(true);
    expect(result.supportedChains.length).toBeGreaterThan(0);
    expect(result.supportedChains).toEqual(expect.arrayContaining(['ethereum']));
    expect(result.supportedChains).toEqual(expect.arrayContaining(['arbitrum']));
  });

  it('should include timestamp in response', async () => {
    vi.mocked(gasFetcher.getAllGasPrices).mockResolvedValue([]);

    const result = await getGasPrices({});

    expect(result.timestamp).toBeDefined();
    expect(() => new Date(result.timestamp)).not.toThrow();
  });
});
