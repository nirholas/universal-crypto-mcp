/**
 * Tests for yield tools
 */

import { getTopYields } from '../../tools/getTopYields';
import { getPoolDetails } from '../../tools/getPoolDetails';
import { getYieldHistory } from '../../tools/getYieldHistory';
import { compareYields } from '../../tools/compareYields';
import { getStablecoinYields } from '../../tools/getStablecoinYields';
import { getLPYields } from '../../tools/getLPYields';
import { estimateReturns } from '../../tools/estimateReturns';
import { getRiskAssessment } from '../../tools/getRiskAssessment';
import { defiLlamaClient } from '../../apis/defillama';

// Mock the DeFiLlama client
jest.mock('../../apis/defillama', () => ({
  defiLlamaClient: {
    getYields: jest.fn(),
    getPool: jest.fn(),
    getHistory: jest.fn(),
    getStablecoinPools: jest.fn(),
  },
}));

const mockDefiLlamaClient = defiLlamaClient as jest.Mocked<typeof defiLlamaClient>;

describe('Yield Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPools = [
    {
      pool: 'pool-1',
      chain: 'ethereum',
      project: 'aave',
      symbol: 'USDC',
      tvlUsd: 100_000_000,
      apy: 5.5,
      apyBase: 3.0,
      apyReward: 2.5,
      stablecoin: true,
      ilRisk: 'no',
      exposure: 'single',
      outlier: false,
      audits: '2',
      audit_links: [],
      url: 'https://aave.com',
    },
    {
      pool: 'pool-2',
      chain: 'arbitrum',
      project: 'gmx',
      symbol: 'ETH-USDC',
      tvlUsd: 50_000_000,
      apy: 25.3,
      apyBase: 10.0,
      apyReward: 15.3,
      stablecoin: false,
      ilRisk: 'yes',
      exposure: 'multi',
      outlier: false,
      audits: '1',
      audit_links: [],
      url: 'https://gmx.io',
    },
    {
      pool: 'pool-3',
      chain: 'ethereum',
      project: 'compound',
      symbol: 'DAI',
      tvlUsd: 200_000_000,
      apy: 4.2,
      apyBase: 4.2,
      apyReward: 0,
      stablecoin: true,
      ilRisk: 'no',
      exposure: 'single',
      outlier: false,
      audits: '3',
      audit_links: [],
      url: 'https://compound.finance',
    },
  ];

  describe('getTopYields', () => {
    it('should return top yields sorted by APY', async () => {
      mockDefiLlamaClient.getYields.mockResolvedValue(mockPools as any);

      const result = await getTopYields({});

      expect(result).toHaveLength(3);
      expect(result[0].apy).toBeGreaterThanOrEqual(result[1].apy);
    });

    it('should filter by chain', async () => {
      mockDefiLlamaClient.getYields.mockResolvedValue(mockPools as any);

      const result = await getTopYields({ chain: 'ethereum' });

      expect(result.every(p => p.chain === 'ethereum')).toBe(true);
    });

    it('should filter by stablecoin only', async () => {
      mockDefiLlamaClient.getYields.mockResolvedValue(mockPools as any);

      const result = await getTopYields({ stablecoinOnly: true });

      expect(result.length).toBe(2);
    });

    it('should filter by minimum TVL', async () => {
      mockDefiLlamaClient.getYields.mockResolvedValue(mockPools as any);

      const result = await getTopYields({ minTvl: 100_000_000 });

      expect(result.every(p => p.tvl >= 100_000_000)).toBe(true);
    });

    it('should limit results', async () => {
      mockDefiLlamaClient.getYields.mockResolvedValue(mockPools as any);

      const result = await getTopYields({ limit: 2 });

      expect(result).toHaveLength(2);
    });
  });

  describe('getPoolDetails', () => {
    it('should return pool details', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(mockPools[0] as any);

      const result = await getPoolDetails({ poolId: 'pool-1' });

      expect(result.pool).toBe('pool-1');
      expect(result.protocol).toBe('aave');
      expect(result.apy).toBe(5.5);
    });

    it('should throw error for missing pool', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(null);

      await expect(getPoolDetails({ poolId: 'non-existent' }))
        .rejects.toThrow('Pool not found');
    });

    it('should throw error for missing poolId', async () => {
      await expect(getPoolDetails({ poolId: '' }))
        .rejects.toThrow('poolId is required');
    });
  });

  describe('getYieldHistory', () => {
    const mockHistory = [
      { timestamp: '2024-01-01T00:00:00Z', apy: 5.0, tvlUsd: 100000000 },
      { timestamp: '2024-01-02T00:00:00Z', apy: 5.2, tvlUsd: 101000000 },
    ];

    it('should return yield history', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(mockPools[0] as any);
      mockDefiLlamaClient.getHistory.mockResolvedValue(mockHistory as any);

      const result = await getYieldHistory({ poolId: 'pool-1', days: 30 });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error for missing pool', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(null);

      await expect(getYieldHistory({ poolId: 'non-existent' }))
        .rejects.toThrow('Pool not found');
    });
  });

  describe('compareYields', () => {
    it('should compare multiple pools', async () => {
      mockDefiLlamaClient.getPool
        .mockResolvedValueOnce(mockPools[0] as any)
        .mockResolvedValueOnce(mockPools[1] as any);

      const result = await compareYields({ poolIds: ['pool-1', 'pool-2'] });

      expect(result).toHaveLength(2);
      expect(result[0].poolId).toBe('pool-1');
      expect(result[1].poolId).toBe('pool-2');
      expect(result[0]).toHaveProperty('recommendation');
    });

    it('should throw error for empty pool list', async () => {
      await expect(compareYields({ poolIds: [] }))
        .rejects.toThrow('poolIds array is required');
    });

    it('should throw error for too many pools', async () => {
      const manyPools = Array(11).fill('pool-1');
      await expect(compareYields({ poolIds: manyPools }))
        .rejects.toThrow('Maximum 10 pools');
    });
  });

  describe('getStablecoinYields', () => {
    it('should return stablecoin yields', async () => {
      mockDefiLlamaClient.getStablecoinPools.mockResolvedValue(
        mockPools.filter(p => p.stablecoin) as any
      );

      const result = await getStablecoinYields({});

      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by specific stablecoin', async () => {
      mockDefiLlamaClient.getStablecoinPools.mockResolvedValue(
        mockPools.filter(p => p.stablecoin) as any
      );

      const result = await getStablecoinYields({ stablecoin: 'USDC' });

      expect(result.every(p => p.stablecoin.includes('USDC'))).toBe(true);
    });
  });

  describe('getLPYields', () => {
    it('should find LP pools for token pair', async () => {
      mockDefiLlamaClient.getYields.mockResolvedValue(mockPools as any);

      const result = await getLPYields({ token0: 'ETH', token1: 'USDC' });

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].pool).toBe('pool-2');
    });

    it('should throw error for missing tokens', async () => {
      await expect(getLPYields({ token0: '', token1: 'USDC' }))
        .rejects.toThrow('Both token0 and token1 are required');
    });
  });

  describe('estimateReturns', () => {
    it('should calculate estimated returns', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(mockPools[0] as any);

      const result = await estimateReturns({
        poolId: 'pool-1',
        amount: 10000,
        days: 365,
      });

      expect(result.principal).toBe(10000);
      expect(result.apy).toBe(5.5);
      expect(result.finalValue).toBeGreaterThan(result.principal);
      expect(result.estimatedReturn).toBeGreaterThan(0);
    });

    it('should throw error for invalid amount', async () => {
      await expect(estimateReturns({ poolId: 'pool-1', amount: -100, days: 30 }))
        .rejects.toThrow('amount must be a positive number');
    });

    it('should throw error for invalid days', async () => {
      await expect(estimateReturns({ poolId: 'pool-1', amount: 1000, days: 0 }))
        .rejects.toThrow('days must be a positive number');
    });
  });

  describe('getRiskAssessment', () => {
    it('should return risk assessment', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(mockPools[0] as any);

      const result = await getRiskAssessment({ poolId: 'pool-1' });

      expect(result.overallRisk).toBeGreaterThanOrEqual(1);
      expect(result.overallRisk).toBeLessThanOrEqual(10);
      expect(result.factors).toHaveProperty('ilRisk');
      expect(result.factors).toHaveProperty('smartContractRisk');
      expect(result.factors).toHaveProperty('protocolRisk');
      expect(result.factors).toHaveProperty('chainRisk');
    });

    it('should throw error for missing pool', async () => {
      mockDefiLlamaClient.getPool.mockResolvedValue(null);

      await expect(getRiskAssessment({ poolId: 'non-existent' }))
        .rejects.toThrow('Pool not found');
    });
  });
});
