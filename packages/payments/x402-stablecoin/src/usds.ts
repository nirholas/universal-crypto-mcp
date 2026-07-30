/**
 * USDs integration for x402 payments
 *
 * Wraps Sperax USDs for yield-bearing payments.
 */

import { USDsClient, USDsYieldTracker } from "@universal-crypto-mcp/defi-stablecoin-protocol";

/**
 * USDs configuration for payments
 */
export interface USDsPaymentConfig {
  privateKey?: `0x${string}`;
  rpcUrl?: string;
  enableYieldTracking?: boolean;
}

/**
 * USDs Payment Client
 *
 * Wraps USDs for x402 payments with optional yield tracking.
 */
export class USDsPaymentClient {
  private client: USDsClient;
  private yieldTracker?: USDsYieldTracker;

  constructor(config: USDsPaymentConfig = {}) {
    this.client = new USDsClient({
      privateKey: config.privateKey,
      rpcUrl: config.rpcUrl,
    });

    if (config.enableYieldTracking) {
      this.yieldTracker = new USDsYieldTracker(this.client);
    }
  }

  /**
   * Get USDs balance
   */
  async getBalance(address: `0x${string}`): Promise<string> {
    return this.client.getBalance(address);
  }

  /**
   * Transfer USDs for payment
   */
  async pay(
    to: `0x${string}`,
    amount: string
  ): Promise<`0x${string}`> {
    return this.client.transfer(to, amount);
  }

  /**
   * Approve USDs spending
   */
  async approve(
    spender: `0x${string}`,
    amount: string
  ): Promise<`0x${string}`> {
    return this.client.approve(spender, amount);
  }

  /**
   * Take a yield snapshot (if yield tracking enabled)
   */
  async takeYieldSnapshot(address: `0x${string}`): Promise<void> {
    if (this.yieldTracker) {
      await this.yieldTracker.takeSnapshot(address);
    }
  }

  /**
   * Get yield projections
   */
  async getYieldProjections(balance: string): Promise<{
    daily: { projectedYield: string; apy: number };
    weekly: { projectedYield: string; apy: number };
    monthly: { projectedYield: string; apy: number };
    yearly: { projectedYield: string; apy: number };
  } | null> {
    if (!this.yieldTracker) {
      return null;
    }

    const projections = await this.yieldTracker.getYieldProjections(balance);
    return {
      daily: {
        projectedYield: projections.daily.projectedYield,
        apy: projections.daily.apy,
      },
      weekly: {
        projectedYield: projections.weekly.projectedYield,
        apy: projections.weekly.apy,
      },
      monthly: {
        projectedYield: projections.monthly.projectedYield,
        apy: projections.monthly.apy,
      },
      yearly: {
        projectedYield: projections.yearly.projectedYield,
        apy: projections.yearly.apy,
      },
    };
  }

  /**
   * Get underlying USDs client
   */
  getClient(): USDsClient {
    return this.client;
  }

  /**
   * Get yield tracker (if enabled)
   */
  getYieldTracker(): USDsYieldTracker | undefined {
    return this.yieldTracker;
  }
}

/**
 * Convert USDC amount to equivalent USDs value
 * (1:1 peg, but USDs earns yield)
 */
export function usdcToUSDs(usdcAmount: string): string {
  // USDs is pegged 1:1 to USD, same as USDC
  return usdcAmount;
}

/**
 * Calculate yield advantage of holding USDs vs USDC
 */
export function calculateYieldAdvantage(
  amount: string,
  days: number,
  usdsApy: number
): { usdsValue: string; advantage: string } {
  const principal = parseFloat(amount);
  const dailyRate = usdsApy / 365 / 100;
  const usdsValue = principal * Math.pow(1 + dailyRate, days);
  const advantage = usdsValue - principal;

  return {
    usdsValue: usdsValue.toFixed(6),
    advantage: advantage.toFixed(6),
  };
}
