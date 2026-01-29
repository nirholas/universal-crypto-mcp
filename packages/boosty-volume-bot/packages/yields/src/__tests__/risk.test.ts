/**
 * Tests for risk calculation utilities
 */

import { calculateRiskScore, RiskAssessment } from '../utils/risk';
import { YieldPool } from '../types';

describe('Risk Utilities', () => {
  const createMockPool = (overrides: Partial<YieldPool> = {}): YieldPool => ({
    pool: 'test-pool',
    chain: 'ethereum',
    project: 'aave',
    symbol: 'USDC',
    tvlUsd: 100_000_000,
    apyBase: 3.0,
    apyReward: 2.0,
    apy: 5.0,
    rewardTokens: null,
    underlyingTokens: null,
    ilRisk: 'no',
    exposure: 'single',
    stablecoin: true,
    poolMeta: null,
    mu: null,
    sigma: null,
    count: null,
    outlier: false,
    audits: '2',
    audit_links: ['https://audit.example.com'],
    url: 'https://aave.com',
    ...overrides,
  });

  describe('calculateRiskScore', () => {
    it('should return low risk for stablecoin pools with high TVL', () => {
      const pool = createMockPool({
        stablecoin: true,
        tvlUsd: 1_000_000_000,
        chain: 'ethereum',
        project: 'aave',
        audits: '3',
      });

      const result = calculateRiskScore(pool);

      expect(result.overallRisk).toBeLessThanOrEqual(3);
      expect(result.factors.ilRisk).toBe(1);
    });

    it('should return higher risk for volatile LP pools', () => {
      const pool = createMockPool({
        stablecoin: false,
        ilRisk: 'yes',
        exposure: 'multi',
        symbol: 'ETH-SHIB',
        tvlUsd: 500_000,
      });

      const result = calculateRiskScore(pool);

      expect(result.overallRisk).toBeGreaterThan(4);
      expect(result.factors.ilRisk).toBeGreaterThan(5);
    });

    it('should include warnings for high APY', () => {
      const pool = createMockPool({
        apy: 150,
      });

      const result = calculateRiskScore(pool);

      expect(result.warnings.some(w => w.includes('high APY'))).toBe(true);
    });

    it('should include warnings for low TVL', () => {
      const pool = createMockPool({
        tvlUsd: 50_000,
      });

      const result = calculateRiskScore(pool);

      expect(result.warnings.some(w => w.includes('TVL'))).toBe(true);
    });

    it('should include warnings for outlier pools', () => {
      const pool = createMockPool({
        outlier: true,
      });

      const result = calculateRiskScore(pool);

      expect(result.warnings.some(w => w.includes('outlier'))).toBe(true);
    });

    it('should return audit links when available', () => {
      const pool = createMockPool({
        audit_links: ['https://audit1.com', 'https://audit2.com'],
      });

      const result = calculateRiskScore(pool);

      expect(result.audits).toContain('https://audit1.com');
      expect(result.audits).toContain('https://audit2.com');
    });

    it('should calculate higher chain risk for less established chains', () => {
      const ethereumPool = createMockPool({ chain: 'ethereum' });
      const fantomPool = createMockPool({ chain: 'fantom' });

      const ethResult = calculateRiskScore(ethereumPool);
      const ftmResult = calculateRiskScore(fantomPool);

      expect(ethResult.factors.chainRisk).toBeLessThan(ftmResult.factors.chainRisk);
    });

    it('should calculate protocol risk based on TVL', () => {
      const highTvlPool = createMockPool({ tvlUsd: 500_000_000 });
      const lowTvlPool = createMockPool({ tvlUsd: 500_000 });

      const highTvlResult = calculateRiskScore(highTvlPool);
      const lowTvlResult = calculateRiskScore(lowTvlPool);

      expect(highTvlResult.factors.protocolRisk).toBeLessThan(lowTvlResult.factors.protocolRisk);
    });
  });
});
