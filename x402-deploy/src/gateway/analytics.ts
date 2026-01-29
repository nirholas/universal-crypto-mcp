/**
 * Analytics Engine for x402-deploy
 * 
 * @module gateway/analytics
 * @description Payment analytics and webhook notifications for the gateway
 */

import type { 
  AnalyticsConfig, 
  PaymentAnalytics, 
  PaymentRecord, 
  SettlementContext,
  WebhookPayload 
} from "./types";
import { parsePrice } from "./pricing-engine";
import crypto from "crypto";

/**
 * Analytics Engine for tracking payments and revenue
 */
export class AnalyticsEngine {
  private config: Required<AnalyticsConfig>;
  private payments: PaymentRecord[] = [];
  private uniquePayers: Set<string> = new Set();
  private revenueByRoute: Map<string, number> = new Map();
  private paymentCountByRoute: Map<string, number> = new Map();
  private totalRevenue: number = 0;
  private lastPaymentAt?: Date;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      webhookUrl: config.webhookUrl ?? "",
      webhookSecret: config.webhookSecret ?? "",
      verbose: config.verbose ?? false,
    };
  }

  /**
   * Record a payment
   */
  async recordPayment(context: SettlementContext): Promise<PaymentRecord> {
    if (!this.config.enabled) {
      return this.createPaymentRecord(context);
    }

    const record = this.createPaymentRecord(context);
    this.payments.push(record);
    this.uniquePayers.add(context.payer);
    this.lastPaymentAt = record.timestamp;

    // Update revenue tracking
    const { value } = parsePrice(context.amount);
    this.totalRevenue += value;

    const currentRouteRevenue = this.revenueByRoute.get(context.route) ?? 0;
    this.revenueByRoute.set(context.route, currentRouteRevenue + value);

    const currentRouteCount = this.paymentCountByRoute.get(context.route) ?? 0;
    this.paymentCountByRoute.set(context.route, currentRouteCount + 1);

    if (this.config.verbose) {
      console.log(`[x402-analytics] Payment recorded:`, {
        payer: context.payer,
        route: context.route,
        amount: context.amount,
        txHash: context.txHash,
      });
    }

    // Send webhook notification
    if (this.config.webhookUrl) {
      await this.sendWebhook("payment.received", record);
    }

    return record;
  }

  /**
   * Record a successful settlement
   */
  async recordSettlement(record: PaymentRecord): Promise<void> {
    record.settled = true;

    if (this.config.verbose) {
      console.log(`[x402-analytics] Payment settled:`, {
        id: record.id,
        txHash: record.txHash,
      });
    }

    if (this.config.webhookUrl) {
      await this.sendWebhook("payment.settled", record);
    }
  }

  /**
   * Record a failed payment
   */
  async recordFailure(context: SettlementContext, reason: string): Promise<void> {
    const record = this.createPaymentRecord(context);
    record.settled = false;

    if (this.config.verbose) {
      console.log(`[x402-analytics] Payment failed:`, {
        payer: context.payer,
        route: context.route,
        reason,
      });
    }

    if (this.config.webhookUrl) {
      await this.sendWebhook("payment.failed", record);
    }
  }

  /**
   * Create a payment record from settlement context
   */
  private createPaymentRecord(context: SettlementContext): PaymentRecord {
    return {
      id: crypto.randomUUID(),
      payer: context.payer,
      route: context.route,
      amount: context.amount,
      asset: context.asset,
      network: context.network,
      txHash: context.txHash,
      timestamp: new Date(),
      settled: false,
    };
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(event: WebhookPayload["event"], payment: PaymentRecord): Promise<void> {
    if (!this.config.webhookUrl) return;

    const payload: WebhookPayload = {
      event,
      payment,
      timestamp: new Date().toISOString(),
    };

    // Sign the payload if secret is configured
    if (this.config.webhookSecret) {
      payload.signature = this.signPayload(payload);
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": payload.signature ?? "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`[x402-analytics] Webhook failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`[x402-analytics] Webhook error:`, error);
    }
  }

  /**
   * Sign webhook payload with HMAC
   */
  private signPayload(payload: WebhookPayload): string {
    const hmac = crypto.createHmac("sha256", this.config.webhookSecret);
    hmac.update(JSON.stringify({ ...payload, signature: undefined }));
    return hmac.digest("hex");
  }

  /**
   * Verify webhook signature
   */
  static verifySignature(payload: WebhookPayload, secret: string): boolean {
    const { signature, ...rest } = payload;
    if (!signature) return false;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(JSON.stringify(rest));
    const expectedSignature = hmac.digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  }

  /**
   * Get analytics summary
   */
  getAnalytics(): PaymentAnalytics {
    const revenueByRoute: Record<string, string> = {};
    for (const [route, revenue] of this.revenueByRoute) {
      revenueByRoute[route] = `$${revenue.toFixed(6)}`;
    }

    const paymentCountByRoute: Record<string, number> = {};
    for (const [route, count] of this.paymentCountByRoute) {
      paymentCountByRoute[route] = count;
    }

    return {
      totalRevenue: `$${this.totalRevenue.toFixed(6)}`,
      revenueByRoute,
      uniquePayers: new Set(this.uniquePayers),
      paymentCountByRoute,
      totalPayments: this.payments.length,
      lastPaymentAt: this.lastPaymentAt,
    };
  }

  /**
   * Get payments for a specific route
   */
  getPaymentsByRoute(route: string): PaymentRecord[] {
    return this.payments.filter(p => p.route === route);
  }

  /**
   * Get payments for a specific payer
   */
  getPaymentsByPayer(payer: string): PaymentRecord[] {
    return this.payments.filter(p => p.payer === payer);
  }

  /**
   * Get recent payments
   */
  getRecentPayments(limit: number = 10): PaymentRecord[] {
    return [...this.payments]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get top routes by revenue
   */
  getTopRoutes(limit: number = 10): Array<{ route: string; revenue: string; count: number }> {
    const routes = [...this.revenueByRoute.entries()]
      .map(([route, revenue]) => ({
        route,
        revenue: `$${revenue.toFixed(6)}`,
        count: this.paymentCountByRoute.get(route) ?? 0,
      }))
      .sort((a, b) => {
        const aValue = parseFloat(a.revenue.slice(1));
        const bValue = parseFloat(b.revenue.slice(1));
        return bValue - aValue;
      });

    return routes.slice(0, limit);
  }

  /**
   * Get top payers by total spend
   */
  getTopPayers(limit: number = 10): Array<{ payer: string; totalSpent: string; paymentCount: number }> {
    const payerStats = new Map<string, { spent: number; count: number }>();

    for (const payment of this.payments) {
      const stats = payerStats.get(payment.payer) ?? { spent: 0, count: 0 };
      const { value } = parsePrice(payment.amount);
      stats.spent += value;
      stats.count++;
      payerStats.set(payment.payer, stats);
    }

    return [...payerStats.entries()]
      .map(([payer, stats]) => ({
        payer,
        totalSpent: `$${stats.spent.toFixed(6)}`,
        paymentCount: stats.count,
      }))
      .sort((a, b) => {
        const aValue = parseFloat(a.totalSpent.slice(1));
        const bValue = parseFloat(b.totalSpent.slice(1));
        return bValue - aValue;
      })
      .slice(0, limit);
  }

  /**
   * Get revenue over time (daily buckets)
   */
  getRevenueOverTime(days: number = 30): Array<{ date: string; revenue: string; count: number }> {
    const now = new Date();
    const buckets = new Map<string, { revenue: number; count: number }>();

    // Initialize buckets for the last N days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      buckets.set(dateStr, { revenue: 0, count: 0 });
    }

    // Fill buckets with payment data
    for (const payment of this.payments) {
      const dateStr = payment.timestamp.toISOString().split("T")[0];
      const bucket = buckets.get(dateStr);
      if (bucket) {
        const { value } = parsePrice(payment.amount);
        bucket.revenue += value;
        bucket.count++;
      }
    }

    return [...buckets.entries()]
      .map(([date, stats]) => ({
        date,
        revenue: `$${stats.revenue.toFixed(6)}`,
        count: stats.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Reset analytics (for testing)
   */
  reset(): void {
    this.payments = [];
    this.uniquePayers.clear();
    this.revenueByRoute.clear();
    this.paymentCountByRoute.clear();
    this.totalRevenue = 0;
    this.lastPaymentAt = undefined;
  }

  /**
   * Export all data (for backup/migration)
   */
  export(): {
    payments: PaymentRecord[];
    analytics: PaymentAnalytics;
  } {
    return {
      payments: [...this.payments],
      analytics: this.getAnalytics(),
    };
  }

  /**
   * Import data (for restore)
   */
  import(data: { payments: PaymentRecord[] }): void {
    this.reset();
    
    for (const payment of data.payments) {
      this.payments.push(payment);
      this.uniquePayers.add(payment.payer);
      
      const { value } = parsePrice(payment.amount);
      this.totalRevenue += value;

      const currentRouteRevenue = this.revenueByRoute.get(payment.route) ?? 0;
      this.revenueByRoute.set(payment.route, currentRouteRevenue + value);

      const currentRouteCount = this.paymentCountByRoute.get(payment.route) ?? 0;
      this.paymentCountByRoute.set(payment.route, currentRouteCount + 1);

      if (!this.lastPaymentAt || payment.timestamp > this.lastPaymentAt) {
        this.lastPaymentAt = payment.timestamp;
      }
    }
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = {
      ...this.config,
      enabled: config.enabled ?? this.config.enabled,
      webhookUrl: config.webhookUrl ?? this.config.webhookUrl,
      webhookSecret: config.webhookSecret ?? this.config.webhookSecret,
      verbose: config.verbose ?? this.config.verbose,
    };
  }
}

/**
 * Create an analytics engine with configuration
 */
export function createAnalyticsEngine(config?: AnalyticsConfig): AnalyticsEngine {
  return new AnalyticsEngine(config);
}
