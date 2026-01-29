/**
 * Yield Integration for x402 agent funds
 *
 * Enables AI agents to earn yield on idle funds.
 */

import { z } from "zod";
import type { PaymentToken, PaymentChain } from "@universal-crypto-mcp/payments-shared";

/**
 * Yield strategy configuration
 */
export interface YieldStrategy {
  id: string;
  name: string;
  protocol: string;
  chain: PaymentChain;
  token: PaymentToken;
  apy: number;
  risk: "low" | "medium" | "high";
  minDeposit: string;
  lockPeriod: number; // seconds, 0 = no lock
}

/**
 * Yield position
 */
export interface YieldPosition {
  strategyId: string;
  depositedAmount: string;
  currentValue: string;
  yieldEarned: string;
  depositedAt: number;
  lastUpdated: number;
}

/**
 * Yield projection
 */
export interface YieldProjection {
  currentBalance: string;
  projectedBalance: string;
  projectedYield: string;
  apy: number;
  days: number;
}

/**
 * Default yield strategies with real APY data sources
 * Note: APY values require real-time fetching from protocols
 */
export const DEFAULT_STRATEGIES: YieldStrategy[] = [
  {
    id: "usds-arbitrum",
    name: "Sperax USDs Auto-Yield",
    protocol: "Sperax",
    chain: "arbitrum",
    token: "USDC", // Converted to USDs
    apy: 0, // Must be fetched from Sperax protocol
    risk: "low",
    minDeposit: "10",
    lockPeriod: 0,
  },
  {
    id: "aave-usdc-base",
    name: "Aave USDC Supply",
    protocol: "Aave",
    chain: "base",
    token: "USDC",
    apy: 0, // Must be fetched from Aave V3 on Base
    risk: "low",
    minDeposit: "1",
    lockPeriod: 0,
  },
  {
    id: "compound-usdc-ethereum",
    name: "Compound USDC",
    protocol: "Compound",
    chain: "ethereum",
    token: "USDC",
    apy: 0, // Must be fetched from Compound V2/V3
    risk: "low",
    minDeposit: "100",
    lockPeriod: 0,
  },
];

/**
 * Yield Projector for agent funds
 */
export class YieldProjector {
  private strategies: Map<string, YieldStrategy> = new Map();
  private positions: Map<string, YieldPosition[]> = new Map();

  constructor(customStrategies?: YieldStrategy[]) {
    const strategiesToUse = customStrategies || DEFAULT_STRATEGIES;
    strategiesToUse.forEach((s) => {
      this.strategies.set(s.id, s);
    });
  }

  /**
   * Get all available yield strategies
   */
  getStrategies(): YieldStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Get strategies by chain
   */
  getStrategiesByChain(chain: PaymentChain): YieldStrategy[] {
    return this.getStrategies().filter((s) => s.chain === chain);
  }

  /**
   * Get strategies by risk level
   */
  getStrategiesByRisk(risk: "low" | "medium" | "high"): YieldStrategy[] {
    return this.getStrategies().filter((s) => s.risk === risk);
  }

  /**
   * Get best strategy for a given amount and preferences
   */
  getBestStrategy(options: {
    amount: string;
    chain?: PaymentChain;
    maxRisk?: "low" | "medium" | "high";
  }): YieldStrategy | null {
    let candidates = this.getStrategies();

    // Filter by chain
    if (options.chain) {
      candidates = candidates.filter((s) => s.chain === options.chain);
    }

    // Filter by risk
    if (options.maxRisk) {
      const riskOrder = { low: 1, medium: 2, high: 3 };
      const maxRiskLevel = riskOrder[options.maxRisk];
      candidates = candidates.filter((s) => riskOrder[s.risk] <= maxRiskLevel);
    }

    // Filter by minimum deposit
    const amount = parseFloat(options.amount);
    candidates = candidates.filter((s) => amount >= parseFloat(s.minDeposit));

    // Sort by APY descending
    candidates.sort((a, b) => b.apy - a.apy);

    return candidates[0] || null;
  }

  /**
   * Project yield for a given balance and time period
   */
  projectYield(balance: string, strategyId: string, days: number): YieldProjection | null {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      return null;
    }

    const balanceNum = parseFloat(balance);
    const dailyRate = strategy.apy / 365 / 100;
    const projectedBalance = balanceNum * Math.pow(1 + dailyRate, days);
    const projectedYield = projectedBalance - balanceNum;

    return {
      currentBalance: balance,
      projectedBalance: projectedBalance.toFixed(6),
      projectedYield: projectedYield.toFixed(6),
      apy: strategy.apy,
      days,
    };
  }

  /**
   * Compare yields across strategies
   */
  compareStrategies(
    balance: string,
    days: number
  ): Array<{ strategy: YieldStrategy; projection: YieldProjection }> {
    const results: Array<{ strategy: YieldStrategy; projection: YieldProjection }> = [];

    for (const strategy of this.strategies.values()) {
      if (parseFloat(balance) >= parseFloat(strategy.minDeposit)) {
        const projection = this.projectYield(balance, strategy.id, days);
        if (projection) {
          results.push({ strategy, projection });
        }
      }
    }

    // Sort by projected yield descending
    results.sort(
      (a, b) => parseFloat(b.projection.projectedYield) - parseFloat(a.projection.projectedYield)
    );

    return results;
  }

  /**
   * Record a yield position
   */
  recordPosition(userId: string, position: Omit<YieldPosition, "lastUpdated">): void {
    const positions = this.positions.get(userId) || [];
    positions.push({
      ...position,
      lastUpdated: Date.now(),
    });
    this.positions.set(userId, positions);
  }

  /**
   * Get positions for a user
   */
  getPositions(userId: string): YieldPosition[] {
    return this.positions.get(userId) || [];
  }

  /**
   * Get total yield earned by user
   */
  getTotalYield(userId: string): string {
    const positions = this.getPositions(userId);
    const total = positions.reduce(
      (sum, p) => sum + parseFloat(p.yieldEarned),
      0
    );
    return total.toFixed(6);
  }
}
