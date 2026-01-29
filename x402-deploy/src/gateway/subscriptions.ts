/**
 * Subscription Model
 * Support monthly/yearly subscriptions for API access
 */

import { parseUnits, formatUnits } from "viem";
import type { Request, Response, NextFunction } from "express";

export interface Subscription {
  id: string;
  payer: `0x${string}`;
  plan: SubscriptionPlan;
  price: bigint;
  startDate: Date;
  endDate: Date;
  active: boolean;
  autoRenew: boolean;
  txHash?: `0x${string}`;
  network?: string;
  metadata?: Record<string, unknown>;
}

export type SubscriptionPlan = "monthly" | "yearly" | "trial";

export interface SubscriptionPricing {
  monthly: bigint;
  yearly: bigint;
  trial: bigint;
  trialDays: number;
}

export interface CreateSubscriptionOptions {
  payer: `0x${string}`;
  plan: SubscriptionPlan;
  txHash: `0x${string}`;
  network?: string;
  autoRenew?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionStats {
  totalActive: number;
  totalExpired: number;
  monthlyRevenue: bigint;
  yearlyRevenue: bigint;
  churnRate: number;
}

/**
 * Default pricing (in USDC, 6 decimals)
 * $10/month or $100/year (16% discount)
 */
const DEFAULT_PRICING: SubscriptionPricing = {
  monthly: parseUnits("10", 6), // $10
  yearly: parseUnits("100", 6), // $100 (save $20)
  trial: 0n, // Free trial
  trialDays: 7,
};

/**
 * Subscription manager for handling subscription lifecycle
 */
export class SubscriptionManager {
  private subscriptions: Map<string, Subscription> = new Map();
  private pricing: SubscriptionPricing;
  private onSubscriptionCreated?: (sub: Subscription) => void;
  private onSubscriptionExpired?: (sub: Subscription) => void;
  private onSubscriptionRenewed?: (sub: Subscription) => void;

  constructor(options?: {
    pricing?: Partial<SubscriptionPricing>;
    onSubscriptionCreated?: (sub: Subscription) => void;
    onSubscriptionExpired?: (sub: Subscription) => void;
    onSubscriptionRenewed?: (sub: Subscription) => void;
  }) {
    this.pricing = { ...DEFAULT_PRICING, ...options?.pricing };
    this.onSubscriptionCreated = options?.onSubscriptionCreated;
    this.onSubscriptionExpired = options?.onSubscriptionExpired;
    this.onSubscriptionRenewed = options?.onSubscriptionRenewed;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(options: CreateSubscriptionOptions): Promise<Subscription> {
    const { payer, plan, txHash, network, autoRenew = false, metadata } = options;

    const now = new Date();
    const endDate = this.calculateEndDate(now, plan);

    const subscription: Subscription = {
      id: `sub_${Date.now()}_${payer.slice(2, 8)}`,
      payer,
      plan,
      price: this.getPrice(plan),
      startDate: now,
      endDate,
      active: true,
      autoRenew,
      txHash,
      network,
      metadata,
    };

    this.subscriptions.set(subscription.id, subscription);
    
    // Also index by payer address for quick lookup
    this.subscriptions.set(`payer_${payer.toLowerCase()}`, subscription);

    this.onSubscriptionCreated?.(subscription);

    return subscription;
  }

  /**
   * Get price for a subscription plan
   */
  getPrice(plan: SubscriptionPlan): bigint {
    return this.pricing[plan];
  }

  /**
   * Get all pricing info
   */
  getPricing(): SubscriptionPricing {
    return { ...this.pricing };
  }

  /**
   * Calculate subscription end date based on plan
   */
  private calculateEndDate(startDate: Date, plan: SubscriptionPlan): Date {
    const endDate = new Date(startDate);

    switch (plan) {
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case "trial":
        endDate.setDate(endDate.getDate() + this.pricing.trialDays);
        break;
    }

    return endDate;
  }

  /**
   * Check if a payer has an active subscription
   */
  isSubscriptionActive(payer: `0x${string}`): boolean {
    const now = new Date();

    // Check indexed payer subscription first
    const indexed = this.subscriptions.get(`payer_${payer.toLowerCase()}`);
    if (indexed && indexed.active && indexed.endDate > now) {
      return true;
    }

    // Fall back to searching all subscriptions
    for (const sub of this.subscriptions.values()) {
      if (
        sub.payer.toLowerCase() === payer.toLowerCase() &&
        sub.active &&
        sub.endDate > now
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get subscription by ID
   */
  getSubscription(id: string): Subscription | undefined {
    return this.subscriptions.get(id);
  }

  /**
   * Get active subscription for a payer
   */
  getActiveSubscription(payer: `0x${string}`): Subscription | undefined {
    const now = new Date();

    for (const sub of this.subscriptions.values()) {
      if (
        sub.payer.toLowerCase() === payer.toLowerCase() &&
        sub.active &&
        sub.endDate > now
      ) {
        return sub;
      }
    }

    return undefined;
  }

  /**
   * Get all subscriptions for a payer
   */
  getPayerSubscriptions(payer: `0x${string}`): Subscription[] {
    const subs: Subscription[] = [];

    for (const sub of this.subscriptions.values()) {
      if (sub.payer.toLowerCase() === payer.toLowerCase() && !sub.id.startsWith("payer_")) {
        subs.push(sub);
      }
    }

    return subs.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  /**
   * Renew a subscription
   */
  async renewSubscription(
    subscriptionId: string,
    txHash: `0x${string}`
  ): Promise<Subscription> {
    const existing = this.subscriptions.get(subscriptionId);

    if (!existing) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Calculate new end date from current end date or now
    const startFrom = existing.endDate > new Date() ? existing.endDate : new Date();
    const newEndDate = this.calculateEndDate(startFrom, existing.plan);

    existing.endDate = newEndDate;
    existing.active = true;
    existing.txHash = txHash;

    this.onSubscriptionRenewed?.(existing);

    return existing;
  }

  /**
   * Cancel a subscription
   */
  cancelSubscription(subscriptionId: string): boolean {
    const sub = this.subscriptions.get(subscriptionId);

    if (!sub) {
      return false;
    }

    sub.autoRenew = false;
    // Don't deactivate immediately, let it expire naturally
    return true;
  }

  /**
   * Immediately deactivate a subscription
   */
  deactivateSubscription(subscriptionId: string): boolean {
    const sub = this.subscriptions.get(subscriptionId);

    if (!sub) {
      return false;
    }

    sub.active = false;
    sub.autoRenew = false;
    this.onSubscriptionExpired?.(sub);
    return true;
  }

  /**
   * Get days remaining in subscription
   */
  getDaysRemaining(payer: `0x${string}`): number {
    const sub = this.getActiveSubscription(payer);

    if (!sub) {
      return 0;
    }

    const now = new Date();
    const diff = sub.endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  /**
   * Check for expiring subscriptions and trigger callbacks
   */
  async checkExpirations(): Promise<Subscription[]> {
    const now = new Date();
    const expired: Subscription[] = [];

    for (const sub of this.subscriptions.values()) {
      if (sub.active && sub.endDate <= now && !sub.id.startsWith("payer_")) {
        sub.active = false;
        expired.push(sub);
        this.onSubscriptionExpired?.(sub);
      }
    }

    return expired;
  }

  /**
   * Get subscription statistics
   */
  getStats(): SubscriptionStats {
    let totalActive = 0;
    let totalExpired = 0;
    let monthlyRevenue = 0n;
    let yearlyRevenue = 0n;

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let activeThirtyDaysAgo = 0;
    let canceledLast30Days = 0;

    for (const sub of this.subscriptions.values()) {
      if (sub.id.startsWith("payer_")) continue;

      if (sub.active && sub.endDate > now) {
        totalActive++;
        if (sub.plan === "monthly") {
          monthlyRevenue += sub.price;
        } else if (sub.plan === "yearly") {
          yearlyRevenue += sub.price;
        }
      } else {
        totalExpired++;
      }

      // Calculate churn
      if (sub.startDate <= thirtyDaysAgo && (sub.active || sub.endDate > thirtyDaysAgo)) {
        activeThirtyDaysAgo++;
      }

      if (!sub.active && sub.endDate > thirtyDaysAgo && sub.endDate <= now) {
        canceledLast30Days++;
      }
    }

    const churnRate = activeThirtyDaysAgo > 0 
      ? (canceledLast30Days / activeThirtyDaysAgo) * 100 
      : 0;

    return {
      totalActive,
      totalExpired,
      monthlyRevenue,
      yearlyRevenue,
      churnRate,
    };
  }

  /**
   * Export subscriptions for persistence
   */
  exportSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => !sub.id.startsWith("payer_")
    );
  }

  /**
   * Import subscriptions from persistence
   */
  importSubscriptions(subscriptions: Subscription[]): void {
    for (const sub of subscriptions) {
      // Convert date strings back to Date objects if needed
      sub.startDate = new Date(sub.startDate);
      sub.endDate = new Date(sub.endDate);

      this.subscriptions.set(sub.id, sub);
      this.subscriptions.set(`payer_${sub.payer.toLowerCase()}`, sub);
    }
  }
}

/**
 * Express middleware for subscription-based access
 */
export function subscriptionMiddleware(manager: SubscriptionManager) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const payer = req.headers["x-payer-address"] as `0x${string}` | undefined;

    if (payer && manager.isSubscriptionActive(payer)) {
      // Subscription valid, skip per-call payment
      const subscription = manager.getActiveSubscription(payer);
      
      (req as any).subscription = subscription;
      (req as any).hasActiveSubscription = true;

      // Add subscription info to response headers
      res.setHeader("X-Subscription-Active", "true");
      res.setHeader("X-Subscription-Days-Remaining", manager.getDaysRemaining(payer).toString());

      return next();
    }

    // No active subscription, continue to per-call payment
    (req as any).hasActiveSubscription = false;
    next();
  };
}

/**
 * Express middleware that requires a subscription (no per-call fallback)
 */
export function requireSubscriptionMiddleware(manager: SubscriptionManager) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const payer = req.headers["x-payer-address"] as `0x${string}` | undefined;

    if (!payer) {
      return res.status(400).json({
        error: "missing_payer",
        message: "x-payer-address header is required",
      });
    }

    if (!manager.isSubscriptionActive(payer)) {
      const pricing = manager.getPricing();

      return res.status(402).json({
        error: "subscription_required",
        message: "An active subscription is required to access this endpoint",
        pricing: {
          monthly: formatUnits(pricing.monthly, 6),
          yearly: formatUnits(pricing.yearly, 6),
          trial: pricing.trial > 0n ? formatUnits(pricing.trial, 6) : "free",
          trialDays: pricing.trialDays,
        },
      });
    }

    const subscription = manager.getActiveSubscription(payer);
    (req as any).subscription = subscription;
    (req as any).hasActiveSubscription = true;

    res.setHeader("X-Subscription-Active", "true");
    res.setHeader("X-Subscription-Days-Remaining", manager.getDaysRemaining(payer).toString());

    next();
  };
}
