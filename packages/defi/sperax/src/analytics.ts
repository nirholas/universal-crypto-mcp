/**
 * USDs Analytics and Historical Data
 * 
 * Track yield performance, APY history, and user statistics.
 */

import type { PublicClient } from "viem";
import { USDsYieldTracker } from "./yield.js";

/**
 * Historical APY data point
 */
export interface APYDataPoint {
  timestamp: number;
  apy: number;
  blockNumber: bigint;
}

/**
 * Yield performance metrics
 */
export interface YieldMetrics {
  currentAPY: number;
  averageAPY7d: number;
  averageAPY30d: number;
  totalYieldEarned: string;
  yieldRate24h: number;
}

/**
 * User statistics
 */
export interface UserStats {
  totalDeposited: string;
  currentBalance: string;
  totalYieldEarned: string;
  holdingPeriodDays: number;
  averageAPY: number;
  projectedYearlyYield: string;
}

/**
 * USDs Analytics Client
 */
export class USDsAnalytics {
  private yieldTracker: USDsYieldTracker;
  private apyHistory: APYDataPoint[] = [];

  constructor(publicClient: PublicClient, rpcUrl?: string) {
    this.yieldTracker = new USDsYieldTracker(publicClient, rpcUrl);
  }

  /**
   * Record current APY snapshot
   */
  async recordAPYSnapshot(): Promise<APYDataPoint> {
    const [apy, blockNumber] = await Promise.all([
      this.yieldTracker.getCurrentAPY(),
      this.yieldTracker["publicClient"].getBlockNumber(),
    ]);

    const dataPoint: APYDataPoint = {
      timestamp: Date.now(),
      apy,
      blockNumber,
    };

    this.apyHistory.push(dataPoint);
    
    // Keep only last 90 days
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    this.apyHistory = this.apyHistory.filter(
      (point) => point.timestamp > ninetyDaysAgo
    );

    return dataPoint;
  }

  /**
   * Get average APY over period
   */
  getAverageAPY(periodDays: number): number {
    const cutoffTime = Date.now() - periodDays * 24 * 60 * 60 * 1000;
    const relevantData = this.apyHistory.filter(
      (point) => point.timestamp >= cutoffTime
    );

    if (relevantData.length === 0) {
      return 0;
    }

    const sum = relevantData.reduce((acc, point) => acc + point.apy, 0);
    return sum / relevantData.length;
  }

  /**
   * Get yield metrics
   */
  async getYieldMetrics(): Promise<YieldMetrics> {
    const currentAPY = await this.yieldTracker.getCurrentAPY();
    const averageAPY7d = this.getAverageAPY(7);
    const averageAPY30d = this.getAverageAPY(30);

    // Calculate 24h yield rate
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const yesterdayData = this.apyHistory.find(
      (point) => Math.abs(point.timestamp - oneDayAgo) < 60 * 60 * 1000
    );
    const yieldRate24h = yesterdayData
      ? ((currentAPY - yesterdayData.apy) / yesterdayData.apy) * 100
      : 0;

    return {
      currentAPY,
      averageAPY7d,
      averageAPY30d,
      totalYieldEarned: "0", // Would need to track user's total yield
      yieldRate24h,
    };
  }

  /**
   * Calculate user statistics
   */
  async getUserStats(
    userAddress: `0x${string}`,
    initialBalance: string,
    depositTimestamp: number
  ): Promise<UserStats> {
    const currentBalance = await this.yieldTracker.getBalance(userAddress);
    const holdingPeriodDays = Math.floor(
      (Date.now() - depositTimestamp) / (24 * 60 * 60 * 1000)
    );

    const initialBalanceNum = parseFloat(initialBalance);
    const currentBalanceNum = parseFloat(currentBalance);
    const totalYieldEarned = (currentBalanceNum - initialBalanceNum).toFixed(6);

    // Calculate average APY during holding period
    const avgAPY =
      holdingPeriodDays > 0 ? this.getAverageAPY(holdingPeriodDays) : 0;

    // Project yearly yield at current APY
    const currentAPY = await this.yieldTracker.getCurrentAPY();
    const projectedYearlyYield = (currentBalanceNum * (currentAPY / 100)).toFixed(
      6
    );

    return {
      totalDeposited: initialBalance,
      currentBalance,
      totalYieldEarned,
      holdingPeriodDays,
      averageAPY: avgAPY,
      projectedYearlyYield,
    };
  }

  /**
   * Get APY history
   */
  getAPYHistory(periodDays?: number): APYDataPoint[] {
    if (!periodDays) {
      return [...this.apyHistory];
    }

    const cutoffTime = Date.now() - periodDays * 24 * 60 * 60 * 1000;
    return this.apyHistory.filter((point) => point.timestamp >= cutoffTime);
  }

  /**
   * Get highest APY in period
   */
  getHighestAPY(periodDays: number): APYDataPoint | null {
    const history = this.getAPYHistory(periodDays);
    
    if (history.length === 0) {
      return null;
    }

    return history.reduce((highest, current) =>
      current.apy > highest.apy ? current : highest
    );
  }

  /**
   * Get lowest APY in period
   */
  getLowestAPY(periodDays: number): APYDataPoint | null {
    const history = this.getAPYHistory(periodDays);
    
    if (history.length === 0) {
      return null;
    }

    return history.reduce((lowest, current) =>
      current.apy < lowest.apy ? current : lowest
    );
  }

  /**
   * Calculate compound interest projection
   */
  calculateCompoundProjection(
    principal: number,
    apy: number,
    years: number,
    compoundFrequency: number = 365
  ): number {
    // A = P(1 + r/n)^(nt)
    const rate = apy / 100;
    const amount =
      principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * years);
    
    return amount;
  }

  /**
   * Export analytics data as JSON
   */
  exportData(): {
    apyHistory: APYDataPoint[];
    currentMetrics: {
      latestAPY: number;
      averageAPY7d: number;
      averageAPY30d: number;
      dataPoints: number;
    };
  } {
    return {
      apyHistory: this.apyHistory,
      currentMetrics: {
        latestAPY:
          this.apyHistory.length > 0
            ? this.apyHistory[this.apyHistory.length - 1].apy
            : 0,
        averageAPY7d: this.getAverageAPY(7),
        averageAPY30d: this.getAverageAPY(30),
        dataPoints: this.apyHistory.length,
      },
    };
  }
}
