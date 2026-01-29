/**
 * Payment Analytics and Reporting
 * 
 * Professional analytics for tracking payment performance, spending patterns,
 * and generating detailed reports for AI agents.
 */

import type { PaymentToken, PaymentChain } from "@universal-crypto-mcp/payments-shared";

/**
 * Time-series payment data point
 */
export interface PaymentDataPoint {
  timestamp: number;
  amount: string;
  token: PaymentToken;
  chain: PaymentChain;
  recipient: string;
  purpose: string;
  txHash: string;
  gasUsed?: string;
  gasCostUSD?: string;
}

/**
 * Aggregated payment statistics
 */
export interface PaymentStatistics {
  totalTransactions: number;
  totalVolumeUSD: string;
  averageTransactionUSD: string;
  medianTransactionUSD: string;
  totalGasCostUSD: string;
  byToken: Record<PaymentToken, {
    count: number;
    volume: string;
  }>;
  byChain: Record<PaymentChain, {
    count: number;
    volume: string;
  }>;
  byRecipient: Record<string, {
    count: number;
    volume: string;
    lastPayment: number;
  }>;
  byPurpose: Record<string, {
    count: number;
    volume: string;
  }>;
}

/**
 * Spending trend analysis
 */
export interface SpendingTrend {
  period: string; // "hourly" | "daily" | "weekly" | "monthly"
  data: Array<{
    timestamp: number;
    volumeUSD: string;
    transactionCount: number;
    averageSize: string;
  }>;
  percentageChange: number;
  trend: "increasing" | "decreasing" | "stable";
}

/**
 * Budget tracking
 */
export interface BudgetTracking {
  period: "hourly" | "daily" | "weekly" | "monthly";
  limit: string;
  spent: string;
  remaining: string;
  percentageUsed: number;
  projectedEndDate?: number;
  isOverBudget: boolean;
}

/**
 * Payment Analytics Engine
 */
export class PaymentAnalytics {
  private payments: PaymentDataPoint[] = [];
  private priceCache: Map<string, number> = new Map(); // token -> USD price

  /**
   * Record a payment for analytics
   */
  recordPayment(payment: PaymentDataPoint): void {
    this.payments.push(payment);
  }

  /**
   * Bulk import payment history
   */
  importPayments(payments: PaymentDataPoint[]): void {
    this.payments.push(...payments);
    // Sort by timestamp
    this.payments.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Update price cache for USD conversions
   */
  updatePrice(token: PaymentToken, priceUSD: number): void {
    this.priceCache.set(token, priceUSD);
  }

  /**
   * Get comprehensive payment statistics
   */
  getStatistics(
    startTime?: number,
    endTime?: number
  ): PaymentStatistics {
    const filtered = this.filterByTimeRange(startTime, endTime);

    if (filtered.length === 0) {
      return this.getEmptyStatistics();
    }

    // Calculate totals
    const amounts = filtered.map(p => this.toUSD(parseFloat(p.amount), p.token));
    const totalVolumeUSD = amounts.reduce((sum, amt) => sum + amt, 0);
    const averageTransactionUSD = totalVolumeUSD / filtered.length;
    const medianTransactionUSD = this.calculateMedian(amounts);

    // Aggregate by token
    const byToken: Record<string, { count: number; volume: string }> = {};
    filtered.forEach(p => {
      if (!byToken[p.token]) {
        byToken[p.token] = { count: 0, volume: "0" };
      }
      byToken[p.token].count++;
      const vol = parseFloat(byToken[p.token].volume) + this.toUSD(parseFloat(p.amount), p.token);
      byToken[p.token].volume = vol.toFixed(2);
    });

    // Aggregate by chain
    const byChain: Record<string, { count: number; volume: string }> = {};
    filtered.forEach(p => {
      if (!byChain[p.chain]) {
        byChain[p.chain] = { count: 0, volume: "0" };
      }
      byChain[p.chain].count++;
      const vol = parseFloat(byChain[p.chain].volume) + this.toUSD(parseFloat(p.amount), p.token);
      byChain[p.chain].volume = vol.toFixed(2);
    });

    // Aggregate by recipient
    const byRecipient: Record<string, { count: number; volume: string; lastPayment: number }> = {};
    filtered.forEach(p => {
      if (!byRecipient[p.recipient]) {
        byRecipient[p.recipient] = { count: 0, volume: "0", lastPayment: 0 };
      }
      byRecipient[p.recipient].count++;
      const vol = parseFloat(byRecipient[p.recipient].volume) + this.toUSD(parseFloat(p.amount), p.token);
      byRecipient[p.recipient].volume = vol.toFixed(2);
      byRecipient[p.recipient].lastPayment = Math.max(byRecipient[p.recipient].lastPayment, p.timestamp);
    });

    // Aggregate by purpose
    const byPurpose: Record<string, { count: number; volume: string }> = {};
    filtered.forEach(p => {
      if (!byPurpose[p.purpose]) {
        byPurpose[p.purpose] = { count: 0, volume: "0" };
      }
      byPurpose[p.purpose].count++;
      const vol = parseFloat(byPurpose[p.purpose].volume) + this.toUSD(parseFloat(p.amount), p.token);
      byPurpose[p.purpose].volume = vol.toFixed(2);
    });

    // Calculate total gas costs
    const totalGasCostUSD = filtered
      .filter(p => p.gasCostUSD)
      .reduce((sum, p) => sum + parseFloat(p.gasCostUSD!), 0);

    return {
      totalTransactions: filtered.length,
      totalVolumeUSD: totalVolumeUSD.toFixed(2),
      averageTransactionUSD: averageTransactionUSD.toFixed(2),
      medianTransactionUSD: medianTransactionUSD.toFixed(2),
      totalGasCostUSD: totalGasCostUSD.toFixed(2),
      byToken: byToken as any,
      byChain: byChain as any,
      byRecipient,
      byPurpose,
    };
  }

  /**
   * Analyze spending trends over time
   */
  getSpendingTrend(
    period: "hourly" | "daily" | "weekly" | "monthly",
    bucketCount: number = 30
  ): SpendingTrend {
    if (this.payments.length === 0) {
      return {
        period,
        data: [],
        percentageChange: 0,
        trend: "stable",
      };
    }

    const bucketSizeMs = this.getPeriodMs(period);
    const now = Date.now();
    const startTime = now - (bucketSizeMs * bucketCount);

    const buckets: Array<{
      timestamp: number;
      volumeUSD: string;
      transactionCount: number;
      averageSize: string;
    }> = [];

    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = startTime + (i * bucketSizeMs);
      const bucketEnd = bucketStart + bucketSizeMs;

      const bucketPayments = this.payments.filter(
        p => p.timestamp >= bucketStart && p.timestamp < bucketEnd
      );

      const volumeUSD = bucketPayments.reduce(
        (sum, p) => sum + this.toUSD(parseFloat(p.amount), p.token),
        0
      );

      buckets.push({
        timestamp: bucketStart,
        volumeUSD: volumeUSD.toFixed(2),
        transactionCount: bucketPayments.length,
        averageSize: bucketPayments.length > 0 ? (volumeUSD / bucketPayments.length).toFixed(2) : "0",
      });
    }

    // Calculate trend
    const recentVolume = buckets.slice(-7).reduce((sum, b) => sum + parseFloat(b.volumeUSD), 0);
    const olderVolume = buckets.slice(-14, -7).reduce((sum, b) => sum + parseFloat(b.volumeUSD), 0);
    const percentageChange = olderVolume > 0 ? ((recentVolume - olderVolume) / olderVolume) * 100 : 0;

    let trend: "increasing" | "decreasing" | "stable" = "stable";
    if (percentageChange > 10) trend = "increasing";
    if (percentageChange < -10) trend = "decreasing";

    return {
      period,
      data: buckets,
      percentageChange,
      trend,
    };
  }

  /**
   * Track budget usage
   */
  trackBudget(
    period: "hourly" | "daily" | "weekly" | "monthly",
    limitUSD: string
  ): BudgetTracking {
    const periodMs = this.getPeriodMs(period);
    const now = Date.now();
    const periodStart = now - periodMs;

    const periodPayments = this.payments.filter(p => p.timestamp >= periodStart);
    const spent = periodPayments.reduce(
      (sum, p) => sum + this.toUSD(parseFloat(p.amount), p.token),
      0
    );

    const limit = parseFloat(limitUSD);
    const remaining = Math.max(0, limit - spent);
    const percentageUsed = (spent / limit) * 100;

    // Project when budget will be exhausted
    let projectedEndDate: number | undefined;
    if (spent > 0) {
      const spendRate = spent / (now - periodStart); // USD per ms
      const timeToExhaust = remaining / spendRate;
      projectedEndDate = now + timeToExhaust;
    }

    return {
      period,
      limit: limitUSD,
      spent: spent.toFixed(2),
      remaining: remaining.toFixed(2),
      percentageUsed: Math.min(100, percentageUsed),
      projectedEndDate,
      isOverBudget: spent > limit,
    };
  }

  /**
   * Get top recipients by volume
   */
  getTopRecipients(limit: number = 10): Array<{
    address: string;
    transactionCount: number;
    totalVolumeUSD: string;
    averageTransactionUSD: string;
    lastPayment: number;
  }> {
    const recipientMap = new Map<string, {
      count: number;
      volume: number;
      lastPayment: number;
    }>();

    this.payments.forEach(p => {
      const existing = recipientMap.get(p.recipient) || { count: 0, volume: 0, lastPayment: 0 };
      existing.count++;
      existing.volume += this.toUSD(parseFloat(p.amount), p.token);
      existing.lastPayment = Math.max(existing.lastPayment, p.timestamp);
      recipientMap.set(p.recipient, existing);
    });

    return Array.from(recipientMap.entries())
      .map(([address, data]) => ({
        address,
        transactionCount: data.count,
        totalVolumeUSD: data.volume.toFixed(2),
        averageTransactionUSD: (data.volume / data.count).toFixed(2),
        lastPayment: data.lastPayment,
      }))
      .sort((a, b) => parseFloat(b.totalVolumeUSD) - parseFloat(a.totalVolumeUSD))
      .slice(0, limit);
  }

  /**
   * Export analytics report
   */
  exportReport(format: "json" | "csv" = "json"): string {
    const stats = this.getStatistics();
    const trend = this.getSpendingTrend("daily");
    const topRecipients = this.getTopRecipients();

    const report = {
      generatedAt: Date.now(),
      summary: stats,
      trend,
      topRecipients,
      rawPayments: this.payments,
    };

    if (format === "json") {
      return JSON.stringify(report, null, 2);
    }

    // CSV format
    const csvLines = [
      "Timestamp,Amount,Token,Chain,Recipient,Purpose,TxHash",
      ...this.payments.map(p =>
        `${p.timestamp},${p.amount},${p.token},${p.chain},${p.recipient},${p.purpose},${p.txHash}`
      ),
    ];

    return csvLines.join("\n");
  }

  /**
   * Helper: Filter payments by time range
   */
  private filterByTimeRange(startTime?: number, endTime?: number): PaymentDataPoint[] {
    return this.payments.filter(p => {
      if (startTime && p.timestamp < startTime) return false;
      if (endTime && p.timestamp > endTime) return false;
      return true;
    });
  }

  /**
   * Helper: Convert token amount to USD
   */
  private toUSD(amount: number, token: PaymentToken): number {
    const price = this.priceCache.get(token) || 1; // Default to 1:1 if no price
    return amount * price;
  }

  /**
   * Helper: Calculate median
   */
  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Helper: Get period duration in milliseconds
   */
  private getPeriodMs(period: "hourly" | "daily" | "weekly" | "monthly"): number {
    const hour = 3600000;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;

    return {
      hourly: hour,
      daily: day,
      weekly: week,
      monthly: month,
    }[period];
  }

  /**
   * Helper: Get empty statistics structure
   */
  private getEmptyStatistics(): PaymentStatistics {
    return {
      totalTransactions: 0,
      totalVolumeUSD: "0",
      averageTransactionUSD: "0",
      medianTransactionUSD: "0",
      totalGasCostUSD: "0",
      byToken: {} as any,
      byChain: {} as any,
      byRecipient: {},
      byPurpose: {},
    };
  }
}
