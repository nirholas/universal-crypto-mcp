/**
 * Tests for DeFiLlama API client
 */

import { DefiLlamaClient } from '../apis/defillama';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('DefiLlamaClient', () => {
  let client: DefiLlamaClient;

  beforeEach(() => {
    client = new DefiLlamaClient();
    client.clearCache();
    mockFetch.mockClear();
  });

  describe('getYields', () => {
    it('should fetch and return yield pools', async () => {
      const mockPools = [
        {
          pool: 'pool-1',
          chain: 'ethereum',
          project: 'aave',
          symbol: 'USDC',
          tvlUsd: 1000000,
          apy: 5.5,
          stablecoin: true,
        },
        {
          pool: 'pool-2',
          chain: 'arbitrum',
          project: 'gmx',
          symbol: 'ETH-USDC',
          tvlUsd: 500000,
          apy: 15.2,
          stablecoin: false,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPools }),
      });

      const result = await client.getYields();

      expect(mockFetch).toHaveBeenCalledWith('https://yields.llama.fi/pools');
      expect(result).toHaveLength(2);
      expect(result[0].pool).toBe('pool-1');
    });

    it('should use cache on subsequent calls', async () => {
      const mockPools = [{ pool: 'pool-1', chain: 'ethereum' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPools }),
      });

      await client.getYields();
      await client.getYields();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(client.getYields()).rejects.toThrow('DeFiLlama API error');
    });
  });

  describe('getPool', () => {
    it('should find pool by ID', async () => {
      const mockPools = [
        { pool: 'pool-1', chain: 'ethereum' },
        { pool: 'pool-2', chain: 'arbitrum' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPools }),
      });

      const result = await client.getPool('pool-2');

      expect(result).not.toBeNull();
      expect(result?.pool).toBe('pool-2');
    });

    it('should return null for non-existent pool', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const result = await client.getPool('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getHistory', () => {
    it('should fetch pool history', async () => {
      const mockHistory = [
        { timestamp: '2024-01-01', apy: 5.0, tvlUsd: 1000000 },
        { timestamp: '2024-01-02', apy: 5.5, tvlUsd: 1100000 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockHistory }),
      });

      const result = await client.getHistory('pool-1');

      expect(mockFetch).toHaveBeenCalledWith('https://yields.llama.fi/chart/pool-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('getStablecoinPools', () => {
    it('should filter stablecoin pools', async () => {
      const mockPools = [
        { pool: 'pool-1', stablecoin: true },
        { pool: 'pool-2', stablecoin: false },
        { pool: 'pool-3', stablecoin: true },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPools }),
      });

      const result = await client.getStablecoinPools();

      expect(result).toHaveLength(2);
      expect(result.every(p => p.stablecoin)).toBe(true);
    });
  });
});
