/**
 * Usage Metering
 * 
 * Tracks API usage, calculates overages, and manages usage alerts
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { getSubscriptionManager } from './subscriptionManager';
import type { UsageData, UsageEvent, Subscription } from './types';

// ============================================
// Types
// ============================================

interface UsageMeteringConfig {
  alertThresholds: number[]; // Percentage thresholds for alerts (e.g., [50, 75, 90, 100])
  overageRates: Record<string, number>; // Per-unit overage rates
  aggregationInterval: number; // Seconds
}

interface UsageAlert {
  id: string;
  subscriptionId: string;
  type: 'threshold' | 'overage' | 'limit_reached';
  resource: string;
  threshold: number;
  currentUsage: number;
  limit: number;
  timestamp: number;
  notified: boolean;
}

interface UsageAggregation {
  subscriptionId: string;
  period: {
    start: number;
    end: number;
  };
  totals: Record<string, number>;
  breakdown: {
    hourly: Record<string, Record<string, number>>;
    daily: Record<string, Record<string, number>>;
  };
}

// ============================================
// Default Configuration
// ============================================

const DEFAULT_CONFIG: UsageMeteringConfig = {
  alertThresholds: [50, 75, 90, 100],
  overageRates: {
    apiCalls: 0.0001, // $0.0001 per API call
    storage: 0.02,    // $0.02 per MB
    bandwidth: 0.01,  // $0.01 per MB
  },
  aggregationInterval: 3600, // 1 hour
};

// ============================================
// In-Memory Store (Replace with Database)
// ============================================

const usageEvents: UsageEvent[] = [];
const usageAlerts: UsageAlert[] = [];
const aggregations: Map<string, UsageAggregation> = new Map();

// ============================================
// Usage Metering Class
// ============================================

export class UsageMetering {
  private config: UsageMeteringConfig;
  private subscriptionManager = getSubscriptionManager();

  constructor(config: Partial<UsageMeteringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Record a usage event
   */
  async recordUsage(event: UsageEvent): Promise<void> {
    usageEvents.push(event);

    // Update aggregation
    await this.updateAggregation(event);

    // Check for alerts
    await this.checkAlerts(event.subscriptionId);
  }

  /**
   * Record API call usage
   */
  async recordApiCall(
    subscriptionId: string,
    endpoint?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.recordUsage({
      subscriptionId,
      type: 'apiCalls',
      quantity: 1,
      timestamp: Math.floor(Date.now() / 1000),
      metadata: { endpoint, ...metadata },
    });
  }

  /**
   * Record storage usage
   */
  async recordStorage(
    subscriptionId: string,
    bytes: number,
    operation: 'upload' | 'delete'
  ): Promise<void> {
    const mbytes = bytes / (1024 * 1024);
    await this.recordUsage({
      subscriptionId,
      type: 'storage',
      quantity: operation === 'delete' ? -mbytes : mbytes,
      timestamp: Math.floor(Date.now() / 1000),
      metadata: { operation },
    });
  }

  /**
   * Record bandwidth usage
   */
  async recordBandwidth(
    subscriptionId: string,
    bytes: number,
    direction: 'ingress' | 'egress'
  ): Promise<void> {
    const mbytes = bytes / (1024 * 1024);
    await this.recordUsage({
      subscriptionId,
      type: 'bandwidth',
      quantity: mbytes,
      timestamp: Math.floor(Date.now() / 1000),
      metadata: { direction },
    });
  }

  /**
   * Get current usage for subscription
   */
  async getCurrentUsage(subscriptionId: string): Promise<UsageData> {
    const subscription = await this.subscriptionManager.getById(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Get aggregated usage for current period
    const usage = this.getAggregatedUsage(
      subscriptionId,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    const limits = subscription.tier.limits;
    const overage: Record<string, number> = {};
    let overageCharges = 0;

    // Calculate overage for each resource
    for (const [resource, used] of Object.entries(usage)) {
      const limit = limits[resource];
      if (limit !== undefined && limit !== -1) {
        const over = Math.max(0, used - limit);
        overage[resource] = over;
        
        const rate = this.config.overageRates[resource] || 0;
        overageCharges += over * rate;
      } else {
        overage[resource] = 0;
      }
    }

    return {
      subscriptionId,
      period: {
        start: subscription.currentPeriodStart,
        end: subscription.currentPeriodEnd,
      },
      usage,
      limits,
      overage,
      overageCharges: overageCharges.toFixed(2),
    };
  }

  /**
   * Get usage percentage for a resource
   */
  async getUsagePercentage(
    subscriptionId: string,
    resource: string
  ): Promise<number> {
    const usageData = await this.getCurrentUsage(subscriptionId);
    const used = usageData.usage[resource] || 0;
    const limit = usageData.limits[resource];

    if (!limit || limit === -1) return 0; // Unlimited
    return Math.min(100, (used / limit) * 100);
  }

  /**
   * Check if usage is within limits
   */
  async checkLimits(
    subscriptionId: string,
    resource: string,
    requestedQuantity: number
  ): Promise<{ allowed: boolean; remaining: number; overage?: number }> {
    const usageData = await this.getCurrentUsage(subscriptionId);
    const used = usageData.usage[resource] || 0;
    const limit = usageData.limits[resource];

    if (!limit || limit === -1) {
      return { allowed: true, remaining: Infinity };
    }

    const remaining = Math.max(0, limit - used);
    const wouldExceed = used + requestedQuantity > limit;

    if (wouldExceed) {
      const overage = used + requestedQuantity - limit;
      return { allowed: true, remaining, overage }; // Allow with overage tracking
    }

    return { allowed: true, remaining };
  }

  /**
   * Get aggregated usage for period
   */
  private getAggregatedUsage(
    subscriptionId: string,
    startTime: number,
    endTime: number
  ): Record<string, number> {
    const filtered = usageEvents.filter(
      (e) =>
        e.subscriptionId === subscriptionId &&
        e.timestamp >= startTime &&
        e.timestamp <= endTime
    );

    const totals: Record<string, number> = {
      apiCalls: 0,
      storage: 0,
      bandwidth: 0,
    };

    for (const event of filtered) {
      totals[event.type] = (totals[event.type] || 0) + event.quantity;
    }

    return totals;
  }

  /**
   * Update usage aggregation
   */
  private async updateAggregation(event: UsageEvent): Promise<void> {
    const subscription = await this.subscriptionManager.getById(event.subscriptionId);
    if (!subscription) return;

    const key = `${event.subscriptionId}:${subscription.currentPeriodStart}`;
    let agg = aggregations.get(key);

    if (!agg) {
      agg = {
        subscriptionId: event.subscriptionId,
        period: {
          start: subscription.currentPeriodStart,
          end: subscription.currentPeriodEnd,
        },
        totals: {},
        breakdown: {
          hourly: {},
          daily: {},
        },
      };
      aggregations.set(key, agg);
    }

    // Update totals
    agg.totals[event.type] = (agg.totals[event.type] || 0) + event.quantity;

    // Update hourly breakdown
    const hourKey = new Date(event.timestamp * 1000).toISOString().slice(0, 13);
    if (!agg.breakdown.hourly[hourKey]) {
      agg.breakdown.hourly[hourKey] = {};
    }
    agg.breakdown.hourly[hourKey][event.type] = 
      (agg.breakdown.hourly[hourKey][event.type] || 0) + event.quantity;

    // Update daily breakdown
    const dayKey = new Date(event.timestamp * 1000).toISOString().slice(0, 10);
    if (!agg.breakdown.daily[dayKey]) {
      agg.breakdown.daily[dayKey] = {};
    }
    agg.breakdown.daily[dayKey][event.type] = 
      (agg.breakdown.daily[dayKey][event.type] || 0) + event.quantity;
  }

  /**
   * Check and create alerts
   */
  private async checkAlerts(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionManager.getById(subscriptionId);
    if (!subscription) return;

    const usageData = await this.getCurrentUsage(subscriptionId);

    for (const [resource, used] of Object.entries(usageData.usage)) {
      const limit = usageData.limits[resource];
      if (!limit || limit === -1) continue;

      const percentage = (used / limit) * 100;

      // Check each threshold
      for (const threshold of this.config.alertThresholds) {
        if (percentage >= threshold) {
          // Check if alert already exists
          const existingAlert = usageAlerts.find(
            (a) =>
              a.subscriptionId === subscriptionId &&
              a.resource === resource &&
              a.threshold === threshold &&
              a.timestamp > subscription.currentPeriodStart
          );

          if (!existingAlert) {
            const alert: UsageAlert = {
              id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              subscriptionId,
              type: percentage >= 100 ? 'limit_reached' : 'threshold',
              resource,
              threshold,
              currentUsage: used,
              limit,
              timestamp: Math.floor(Date.now() / 1000),
              notified: false,
            };

            usageAlerts.push(alert);
          }
        }
      }

      // Check for overage alert
      if (usageData.overage[resource] > 0) {
        const existingOverageAlert = usageAlerts.find(
          (a) =>
            a.subscriptionId === subscriptionId &&
            a.resource === resource &&
            a.type === 'overage' &&
            a.timestamp > subscription.currentPeriodStart
        );

        if (!existingOverageAlert) {
          const alert: UsageAlert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            subscriptionId,
            type: 'overage',
            resource,
            threshold: 100,
            currentUsage: used,
            limit,
            timestamp: Math.floor(Date.now() / 1000),
            notified: false,
          };

          usageAlerts.push(alert);
        }
      }
    }
  }

  /**
   * Get pending alerts
   */
  async getPendingAlerts(subscriptionId?: string): Promise<UsageAlert[]> {
    let alerts = usageAlerts.filter((a) => !a.notified);
    
    if (subscriptionId) {
      alerts = alerts.filter((a) => a.subscriptionId === subscriptionId);
    }

    return alerts;
  }

  /**
   * Mark alert as notified
   */
  markAlertNotified(alertId: string): void {
    const alert = usageAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.notified = true;
    }
  }

  /**
   * Reset usage for new billing period
   */
  async resetUsage(subscriptionId: string): Promise<void> {
    // In production, archive old usage data
    // Here we just clear events for the subscription
    const subscription = await this.subscriptionManager.getById(subscriptionId);
    if (!subscription) return;

    // Remove old aggregation
    const oldKey = `${subscriptionId}:${subscription.currentPeriodStart}`;
    aggregations.delete(oldKey);
  }

  /**
   * Get usage breakdown
   */
  async getUsageBreakdown(
    subscriptionId: string,
    granularity: 'hourly' | 'daily' = 'daily'
  ): Promise<Record<string, Record<string, number>>> {
    const subscription = await this.subscriptionManager.getById(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const key = `${subscriptionId}:${subscription.currentPeriodStart}`;
    const agg = aggregations.get(key);

    if (!agg) {
      return {};
    }

    return granularity === 'hourly' ? agg.breakdown.hourly : agg.breakdown.daily;
  }

  /**
   * Estimate overage charges
   */
  async estimateOverageCharges(subscriptionId: string): Promise<string> {
    const usageData = await this.getCurrentUsage(subscriptionId);
    return usageData.overageCharges;
  }
}

// ============================================
// Singleton Instance
// ============================================

let usageMeteringInstance: UsageMetering | null = null;

export function getUsageMetering(
  config?: Partial<UsageMeteringConfig>
): UsageMetering {
  if (!usageMeteringInstance || config) {
    usageMeteringInstance = new UsageMetering(config);
  }
  return usageMeteringInstance;
}

export default UsageMetering;
