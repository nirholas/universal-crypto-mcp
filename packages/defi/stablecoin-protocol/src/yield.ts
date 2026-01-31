/**
 * Yield Tracking and Projection for USDs
 */

import { USDsClient } from "./usds.js";

/**
 * Yield snapshot for tracking
 */
export interface YieldSnapshot {
  timestamp: number;
  balance: string;
  creditsPerToken: string;
}

/**
 * Yield projection result
 */
export interface YieldProjection {
  currentBalance: string;
  projectedBalance: string;
  projectedYield: string;
  apy: number;
  days: number;
}

/**
 * Historical yield data point
 */
export interface YieldDataPoint {
  date: string;
  balance: string;
  yieldEarned: string;
  cumulativeYield: string;
}

/**
 * Yield Tracker for USDs holdings
 */
export class USDsYieldTracker {
  private client: USDsClient;
  private snapshots: Map<string, YieldSnapshot[]> = new Map();

  constructor(client: USDsClient) {
    this.client = client;
  }

  /**
   * Take a snapshot of current balance for yield tracking
   */
  async takeSnapshot(address: `0x${string}`): Promise<YieldSnapshot> {
    const balance = await this.client.getBalance(address);
    const creditsPerToken = await this.client.getRebasingCreditsPerToken();

    const snapshot: YieldSnapshot = {
      timestamp: Date.now(),
      balance,
      creditsPerToken: creditsPerToken.toString(),
    };

    const existing = this.snapshots.get(address) || [];
    existing.push(snapshot);
    this.snapshots.set(address, existing);

    return snapshot;
  }

  /**
   * Get yield earned since a specific snapshot
   */
  async getYieldSinceSnapshot(
    address: `0x${string}`,
    snapshotIndex: number
  ): Promise<string> {
    const snapshots = this.snapshots.get(address);
    if (!snapshots || snapshotIndex >= snapshots.length) {
      throw new Error("Invalid snapshot index");
    }

    const snapshot = snapshots[snapshotIndex];
    const currentBalance = await this.client.getBalance(address);
    
    const yieldEarned =
      parseFloat(currentBalance) - parseFloat(snapshot.balance);
    return yieldEarned.toFixed(6);
  }

  /**
   * Get current APY from Sperax protocol
   * Calculates APY based on rebasing credits per token changes
   */
  async getCurrentAPY(): Promise<number> {
    const client = this.client.getPublicClient();
    
    // Get current rebasing rate
    const currentRate = await this.client.getRebasingCreditsPerToken();
    
    // Calculate APY from rebasing rate
    // The rebasing mechanism compounds continuously
    // Average rebasing occurs approximately every 24 hours
    const dailyRate = Number(currentRate) / 1e18;
    const annualRate = Math.pow(1 + dailyRate, 365) - 1;
    
    return annualRate * 100;
  }

  /**
   * Project future yield based on current balance and APY
   */
  async projectYield(
    balance: string,
    days: number
  ): Promise<YieldProjection> {
    const apy = await this.getCurrentAPY();
    const dailyRate = apy / 365 / 100;
    const projectedBalance = parseFloat(balance) * Math.pow(1 + dailyRate, days);
    const projectedYield = projectedBalance - parseFloat(balance);

    return {
      currentBalance: balance,
      projectedBalance: projectedBalance.toFixed(6),
      projectedYield: projectedYield.toFixed(6),
      apy,
      days,
    };
  }

  /**
   * Calculate compound yield for different time periods
   */
  async getYieldProjections(balance: string): Promise<{
    daily: YieldProjection;
    weekly: YieldProjection;
    monthly: YieldProjection;
    yearly: YieldProjection;
  }> {
    const [daily, weekly, monthly, yearly] = await Promise.all([
      this.projectYield(balance, 1),
      this.projectYield(balance, 7),
      this.projectYield(balance, 30),
      this.projectYield(balance, 365),
    ]);

    return { daily, weekly, monthly, yearly };
  }

  /**
   * Get all snapshots for an address
   */
  getSnapshots(address: `0x${string}`): YieldSnapshot[] {
    return this.snapshots.get(address) || [];
  }

  /**
   * Clear snapshots for an address
   */
  clearSnapshots(address: `0x${string}`): void {
    this.snapshots.delete(address);
  }
}
