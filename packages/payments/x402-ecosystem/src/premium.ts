/**
 * Premium Tiers for x402 services
 *
 * Subscription-based access levels for MCP tools.
 */

import { z } from "zod";
import type { PaymentToken, PaymentChain } from "@universal-crypto-mcp/payments-shared";

/**
 * Premium tier definition
 */
export interface PremiumTier {
  id: string;
  name: string;
  description: string;
  price: string;
  token: PaymentToken;
  chain: PaymentChain;
  duration: number; // seconds
  features: string[];
  limits: {
    requestsPerDay: number;
    requestsPerMinute: number;
    maxPayloadSize: number; // bytes
  };
}

/**
 * Subscription status
 */
export interface SubscriptionStatus {
  tier: PremiumTier;
  startedAt: number;
  expiresAt: number;
  isActive: boolean;
  remainingRequests: number;
}

/**
 * Default premium tiers
 */
export const DEFAULT_TIERS: PremiumTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic access with limited requests",
    price: "0",
    token: "USDC",
    chain: "base",
    duration: 0,
    features: ["Basic API access", "Community support"],
    limits: {
      requestsPerDay: 100,
      requestsPerMinute: 10,
      maxPayloadSize: 1024 * 10, // 10KB
    },
  },
  {
    id: "starter",
    name: "Starter",
    description: "For individual developers and small projects",
    price: "9.99",
    token: "USDC",
    chain: "base",
    duration: 30 * 24 * 60 * 60, // 30 days
    features: [
      "1,000 requests/day",
      "Priority support",
      "Advanced analytics",
    ],
    limits: {
      requestsPerDay: 1000,
      requestsPerMinute: 60,
      maxPayloadSize: 1024 * 100, // 100KB
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional traders and teams",
    price: "49.99",
    token: "USDC",
    chain: "base",
    duration: 30 * 24 * 60 * 60, // 30 days
    features: [
      "10,000 requests/day",
      "Real-time data",
      "Dedicated support",
      "Custom webhooks",
    ],
    limits: {
      requestsPerDay: 10000,
      requestsPerMinute: 300,
      maxPayloadSize: 1024 * 1024, // 1MB
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For institutions and high-volume users",
    price: "299.99",
    token: "USDC",
    chain: "base",
    duration: 30 * 24 * 60 * 60, // 30 days
    features: [
      "Unlimited requests",
      "Dedicated infrastructure",
      "SLA guarantee",
      "Custom integrations",
      "On-call support",
    ],
    limits: {
      requestsPerDay: -1, // unlimited
      requestsPerMinute: -1, // unlimited
      maxPayloadSize: 1024 * 1024 * 10, // 10MB
    },
  },
];

/**
 * Premium tier manager
 */
export class PremiumManager {
  private tiers: Map<string, PremiumTier> = new Map();
  private subscriptions: Map<string, SubscriptionStatus> = new Map();
  private requestCounts: Map<string, { daily: number; minute: number; lastReset: number }> = new Map();

  constructor(customTiers?: PremiumTier[]) {
    const tiersToUse = customTiers || DEFAULT_TIERS;
    tiersToUse.forEach((tier) => {
      this.tiers.set(tier.id, tier);
    });
  }

  /**
   * Get all available tiers
   */
  getTiers(): PremiumTier[] {
    return Array.from(this.tiers.values());
  }

  /**
   * Get a specific tier
   */
  getTier(tierId: string): PremiumTier | undefined {
    return this.tiers.get(tierId);
  }

  /**
   * Subscribe a user to a tier
   */
  subscribe(userId: string, tierId: string): SubscriptionStatus | null {
    const tier = this.tiers.get(tierId);
    if (!tier) {
      return null;
    }

    const now = Date.now();
    const status: SubscriptionStatus = {
      tier,
      startedAt: now,
      expiresAt: tier.duration > 0 ? now + tier.duration * 1000 : 0,
      isActive: true,
      remainingRequests: tier.limits.requestsPerDay,
    };

    this.subscriptions.set(userId, status);
    return status;
  }

  /**
   * Get subscription status for a user
   */
  getSubscription(userId: string): SubscriptionStatus | null {
    const status = this.subscriptions.get(userId);
    if (!status) {
      return null;
    }

    // Check if expired
    if (status.tier.duration > 0 && Date.now() > status.expiresAt) {
      status.isActive = false;
    }

    return status;
  }

  /**
   * Check if a user can make a request
   */
  canMakeRequest(userId: string): { allowed: boolean; reason?: string } {
    const status = this.getSubscription(userId);

    if (!status) {
      // Default to free tier
      return this.checkFreeTierLimits(userId);
    }

    if (!status.isActive) {
      return {
        allowed: false,
        reason: "Subscription expired",
      };
    }

    const limits = status.tier.limits;

    // Check unlimited
    if (limits.requestsPerDay === -1) {
      return { allowed: true };
    }

    // Check rate limits
    const counts = this.getRequestCounts(userId);
    
    if (counts.daily >= limits.requestsPerDay) {
      return {
        allowed: false,
        reason: "Daily request limit exceeded",
      };
    }

    if (limits.requestsPerMinute > 0 && counts.minute >= limits.requestsPerMinute) {
      return {
        allowed: false,
        reason: "Rate limit exceeded",
      };
    }

    return { allowed: true };
  }

  /**
   * Record a request for rate limiting
   */
  recordRequest(userId: string): void {
    const now = Date.now();
    const counts = this.requestCounts.get(userId) || {
      daily: 0,
      minute: 0,
      lastReset: now,
    };

    // Reset minute counter if needed
    if (now - counts.lastReset > 60000) {
      counts.minute = 0;
      counts.lastReset = now;
    }

    counts.daily++;
    counts.minute++;
    this.requestCounts.set(userId, counts);
  }

  /**
   * Cancel a subscription
   */
  cancelSubscription(userId: string): boolean {
    return this.subscriptions.delete(userId);
  }

  private checkFreeTierLimits(userId: string): { allowed: boolean; reason?: string } {
    const freeTier = this.tiers.get("free");
    if (!freeTier) {
      return { allowed: true };
    }

    const counts = this.getRequestCounts(userId);
    
    if (counts.daily >= freeTier.limits.requestsPerDay) {
      return {
        allowed: false,
        reason: "Free tier daily limit exceeded. Upgrade for more requests.",
      };
    }

    return { allowed: true };
  }

  private getRequestCounts(userId: string): { daily: number; minute: number; lastReset: number } {
    return this.requestCounts.get(userId) || { daily: 0, minute: 0, lastReset: Date.now() };
  }
}
