/**
 * DeFi Portfolio Tracker
 * 
 * Comprehensive portfolio tracking, performance analytics, and position management
 * across multiple DeFi protocols and chains.
 */

import type { Address } from "viem";
import type { PaymentToken, PaymentChain } from "@universal-crypto-mcp/payments-shared";

/**
 * Token position in portfolio
 */
export interface TokenPosition {
  token: Address;
  symbol: string;
  decimals: number;
  balance: bigint;
  balanceFormatted: string;
  priceUSD: number;
  valueUSD: number;
  chain: PaymentChain;
  lastUpdated: number;
}

/**
 * LP position
 */
export interface LPPosition {
  poolAddress: Address;
  protocol: string;
  token0: Address;
  token1: Address;
  token0Symbol: string;
  token1Symbol: string;
  lpTokenBalance: bigint;
  reserve0: bigint;
  reserve1: bigint;
  share: number; // Percentage of pool owned
  valueUSD: number;
  feesEarnedUSD?: number;
  impermanentLoss?: number;
  chain: PaymentChain;
}

/**
 * Lending position
 */
export interface LendingPosition {
  protocol: string;
  asset: Address;
  assetSymbol: string;
  supplied: bigint;
  borrowed: bigint;
  suppliedValueUSD: number;
  borrowedValueUSD: number;
  supplyAPY: number;
  borrowAPY: number;
  netAPY: number;
  healthFactor?: number;
  collateralFactor?: number;
  chain: PaymentChain;
}

/**
 * Staking position
 */
export interface StakingPosition {
  protocol: string;
  asset: Address;
  assetSymbol: string;
  staked: bigint;
  stakedValueUSD: number;
  rewards: bigint;
  rewardsValueUSD: number;
  apy: number;
  lockupEnd?: number;
  chain: PaymentChain;
}

/**
 * Complete portfolio
 */
export interface Portfolio {
  address: Address;
  tokens: TokenPosition[];
  lpPositions: LPPosition[];
  lendingPositions: LendingPosition[];
  stakingPositions: StakingPosition[];
  totalValueUSD: number;
  lastUpdated: number;
}

/**
 * Portfolio performance metrics
 */
export interface PortfolioPerformance {
  totalValueUSD: number;
  totalValueChange24h: number;
  totalValueChangePercent24h: number;
  totalGainsUSD: number;
  totalGainsPercent: number;
  topGainers: Array<{ symbol: string; gainPercent: number; gainUSD: number }>;
  topLosers: Array<{ symbol: string; lossPercent: number; lossUSD: number }>;
  allTimeHigh: number;
  allTimeLow: number;
  sharpeRatio?: number;
}

/**
 * Historical portfolio value
 */
export interface HistoricalValue {
  timestamp: number;
  valueUSD: number;
  breakdown: {
    tokens: number;
    lp: number;
    lending: number;
    staking: number;
  };
}

/**
 * DeFi Portfolio Tracker
 */
export class PortfolioTracker {
  private portfolios: Map<Address, Portfolio> = new Map();
  private historicalValues: Map<Address, HistoricalValue[]> = new Map();
  private priceCache: Map<string, number> = new Map();

  /**
   * Add or update portfolio
   */
  updatePortfolio(portfolio: Portfolio): void {
    this.portfolios.set(portfolio.address, portfolio);

    // Record historical value
    const historical = this.historicalValues.get(portfolio.address) || [];
    historical.push({
      timestamp: Date.now(),
      valueUSD: portfolio.totalValueUSD,
      breakdown: {
        tokens: portfolio.tokens.reduce((sum, t) => sum + t.valueUSD, 0),
        lp: portfolio.lpPositions.reduce((sum, lp) => sum + lp.valueUSD, 0),
        lending: portfolio.lendingPositions.reduce((sum, l) => sum + l.suppliedValueUSD - l.borrowedValueUSD, 0),
        staking: portfolio.stakingPositions.reduce((sum, s) => sum + s.stakedValueUSD + s.rewardsValueUSD, 0),
      },
    });

    // Keep only last 1000 entries
    if (historical.length > 1000) {
      historical.shift();
    }

    this.historicalValues.set(portfolio.address, historical);
  }

  /**
   * Get portfolio
   */
  getPortfolio(address: Address): Portfolio | undefined {
    return this.portfolios.get(address);
  }

  /**
   * Calculate portfolio performance
   */
  getPerformance(address: Address): PortfolioPerformance | null {
    const portfolio = this.portfolios.get(address);
    const historical = this.historicalValues.get(address);

    if (!portfolio || !historical || historical.length < 2) {
      return null;
    }

    const current = historical[historical.length - 1];
    const oneDayAgo = Date.now() - 86400000;

    // Find value 24h ago
    const historical24h = historical.find(h => h.timestamp >= oneDayAgo);
    const value24hAgo = historical24h?.valueUSD || historical[0].valueUSD;

    const totalValueChange24h = current.valueUSD - value24hAgo;
    const totalValueChangePercent24h = (totalValueChange24h / value24hAgo) * 100;

    // Calculate all-time high and low
    const allTimeHigh = Math.max(...historical.map(h => h.valueUSD));
    const allTimeLow = Math.min(...historical.map(h => h.valueUSD));

    // Calculate gains (simplified - would need cost basis in production)
    const initialValue = historical[0].valueUSD;
    const totalGainsUSD = current.valueUSD - initialValue;
    const totalGainsPercent = (totalGainsUSD / initialValue) * 100;

    // Find top gainers/losers (placeholder - need more data)
    const topGainers: Array<{ symbol: string; gainPercent: number; gainUSD: number }> = [];
    const topLosers: Array<{ symbol: string; lossPercent: number; lossUSD: number }> = [];

    // Calculate Sharpe ratio (simplified)
    const returns = this.calculateReturns(historical);
    const sharpeRatio = this.calculateSharpeRatio(returns);

    return {
      totalValueUSD: current.valueUSD,
      totalValueChange24h,
      totalValueChangePercent24h,
      totalGainsUSD,
      totalGainsPercent,
      topGainers,
      topLosers,
      allTimeHigh,
      allTimeLow,
      sharpeRatio,
    };
  }

  /**
   * Get historical values
   */
  getHistoricalValues(
    address: Address,
    period: "24h" | "7d" | "30d" | "all" = "all"
  ): HistoricalValue[] {
    const historical = this.historicalValues.get(address) || [];

    const cutoffTime = this.getPeriodCutoff(period);

    return historical.filter(h => h.timestamp >= cutoffTime);
  }

  /**
   * Calculate portfolio diversification score
   */
  calculateDiversificationScore(address: Address): number {
    const portfolio = this.portfolios.get(address);
    if (!portfolio) return 0;

    const totalValue = portfolio.totalValueUSD;
    if (totalValue === 0) return 0;

    // Calculate Herfindahl-Hirschman Index (HHI)
    const positions = [
      ...portfolio.tokens.map(t => t.valueUSD),
      ...portfolio.lpPositions.map(lp => lp.valueUSD),
      ...portfolio.lendingPositions.map(l => l.suppliedValueUSD),
      ...portfolio.stakingPositions.map(s => s.stakedValueUSD),
    ];

    const hhi = positions.reduce((sum, value) => {
      const share = value / totalValue;
      return sum + share * share;
    }, 0);

    // Convert HHI to score (0-100, higher is more diversified)
    // HHI ranges from 1/n (perfectly diversified) to 1 (single asset)
    const maxDiversification = 1 / positions.length;
    const score = ((1 - hhi) / (1 - maxDiversification)) * 100;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate portfolio yield
   */
  calculateTotalYield(address: Address): {
    totalYieldUSD: number;
    totalYieldPercent: number;
    breakdown: {
      lending: number;
      staking: number;
      lp: number;
    };
  } {
    const portfolio = this.portfolios.get(address);
    if (!portfolio) {
      return {
        totalYieldUSD: 0,
        totalYieldPercent: 0,
        breakdown: { lending: 0, staking: 0, lp: 0 },
      };
    }

    // Calculate lending yield
    const lendingYield = portfolio.lendingPositions.reduce((sum, pos) => {
      const netValue = pos.suppliedValueUSD - pos.borrowedValueUSD;
      return sum + (netValue * pos.netAPY) / 100;
    }, 0);

    // Calculate staking yield
    const stakingYield = portfolio.stakingPositions.reduce((sum, pos) => {
      return sum + (pos.stakedValueUSD * pos.apy) / 100;
    }, 0);

    // Calculate LP yield (simplified - would need fee data)
    const lpYield = 0; // Placeholder

    const totalYieldUSD = lendingYield + stakingYield + lpYield;
    const totalYieldPercent = (totalYieldUSD / portfolio.totalValueUSD) * 100;

    return {
      totalYieldUSD,
      totalYieldPercent,
      breakdown: {
        lending: lendingYield,
        staking: stakingYield,
        lp: lpYield,
      },
    };
  }

  /**
   * Get portfolio allocation breakdown
   */
  getAllocationBreakdown(address: Address): {
    tokens: number;
    lp: number;
    lending: number;
    staking: number;
  } | null {
    const portfolio = this.portfolios.get(address);
    if (!portfolio) return null;

    const total = portfolio.totalValueUSD;
    if (total === 0) return { tokens: 0, lp: 0, lending: 0, staking: 0 };

    return {
      tokens: (portfolio.tokens.reduce((sum, t) => sum + t.valueUSD, 0) / total) * 100,
      lp: (portfolio.lpPositions.reduce((sum, lp) => sum + lp.valueUSD, 0) / total) * 100,
      lending: (portfolio.lendingPositions.reduce((sum, l) => sum + l.suppliedValueUSD, 0) / total) * 100,
      staking: (portfolio.stakingPositions.reduce((sum, s) => sum + s.stakedValueUSD, 0) / total) * 100,
    };
  }

  /**
   * Export portfolio to JSON
   */
  exportPortfolio(address: Address): string | null {
    const portfolio = this.portfolios.get(address);
    if (!portfolio) return null;

    return JSON.stringify(portfolio, null, 2);
  }

  /**
   * Helper: Calculate returns from historical values
   */
  private calculateReturns(historical: HistoricalValue[]): number[] {
    const returns: number[] = [];

    for (let i = 1; i < historical.length; i++) {
      const returnValue = (historical[i].valueUSD - historical[i - 1].valueUSD) / historical[i - 1].valueUSD;
      returns.push(returnValue);
    }

    return returns;
  }

  /**
   * Helper: Calculate Sharpe ratio
   */
  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    // Assuming 0% risk-free rate for simplicity
    return avgReturn / stdDev;
  }

  /**
   * Helper: Get period cutoff timestamp
   */
  private getPeriodCutoff(period: "24h" | "7d" | "30d" | "all"): number {
    const now = Date.now();

    switch (period) {
      case "24h":
        return now - 86400000;
      case "7d":
        return now - 604800000;
      case "30d":
        return now - 2592000000;
      case "all":
      default:
        return 0;
    }
  }
}
