/**
 * Subscription Manager
 * 
 * Manages subscription lifecycle, recurring payments, and tier changes
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { v4 as uuidv4 } from 'uuid';
import { getX402Client } from './x402Client';
import type {
  Subscription,
  SubscriptionParams,
  SubscriptionStatus,
  SubscriptionTier,
  PaymentResult,
  UsageData,
  Address,
  ChainId,
  Token,
} from './types';
import { getToken, parseTokenAmount, formatTokenAmount } from './config';

// ============================================
// Types
// ============================================

interface SubscriptionStore {
  subscriptions: Map<string, Subscription>;
  tiers: Map<string, SubscriptionTier>;
}

interface RecurringPaymentResult {
  success: boolean;
  paymentResult?: PaymentResult;
  subscription: Subscription;
  error?: string;
}

// ============================================
// In-Memory Store (Replace with Database)
// ============================================

const store: SubscriptionStore = {
  subscriptions: new Map(),
  tiers: new Map([
    ['free', {
      id: 'free',
      name: 'Free',
      description: 'Basic access with limited API calls',
      price: '0',
      priceUsd: '0',
      period: 'monthly',
      features: ['100 API calls/day', 'Basic support', 'Community access'],
      limits: { apiCalls: 3000 },
    }],
    ['starter', {
      id: 'starter',
      name: 'Starter',
      description: 'For individuals and small projects',
      price: '9.99',
      priceUsd: '9.99',
      period: 'monthly',
      features: ['10,000 API calls/day', 'Email support', 'Basic analytics'],
      limits: { apiCalls: 300000 },
    }],
    ['pro', {
      id: 'pro',
      name: 'Professional',
      description: 'For growing businesses',
      price: '49.99',
      priceUsd: '49.99',
      period: 'monthly',
      features: ['100,000 API calls/day', 'Priority support', 'Advanced analytics', 'Custom webhooks'],
      limits: { apiCalls: 3000000 },
    }],
    ['enterprise', {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: '199.99',
      priceUsd: '199.99',
      period: 'monthly',
      features: ['Unlimited API calls', '24/7 support', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager'],
      limits: { apiCalls: -1 }, // Unlimited
    }],
  ]),
};

// ============================================
// Subscription Manager Class
// ============================================

export class SubscriptionManager {
  private x402Client = getX402Client();

  /**
   * Create a new subscription
   */
  async create(
    userId: string,
    serviceId: string,
    params: SubscriptionParams
  ): Promise<Subscription> {
    // Get tier
    const tier = store.tiers.get(params.tierId);
    if (!tier) {
      throw new Error(`Tier ${params.tierId} not found`);
    }

    // Get token
    const token = getToken(params.token, params.chainId);
    if (!token) {
      throw new Error(`Token ${params.token} not supported on chain ${params.chainId}`);
    }

    // Calculate billing period
    const now = Math.floor(Date.now() / 1000);
    const periodSeconds = this.getPeriodSeconds(tier.period);

    // Create subscription
    const subscription: Subscription = {
      id: uuidv4(),
      userId,
      serviceId,
      tier,
      status: 'active',
      token,
      chainId: params.chainId,
      currentPeriodStart: now,
      currentPeriodEnd: now + periodSeconds,
      autoRenew: params.autoRenew,
      nextPaymentAmount: tier.price,
      nextPaymentDate: now + periodSeconds,
      createdAt: now,
      updatedAt: now,
    };

    // Store subscription
    store.subscriptions.set(subscription.id, subscription);

    return subscription;
  }

  /**
   * Process recurring payment for subscription
   */
  async processRecurring(subscriptionId: string): Promise<RecurringPaymentResult> {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Check if subscription is active
    if (subscription.status !== 'active' && subscription.status !== 'past_due') {
      return {
        success: false,
        subscription,
        error: `Cannot process payment for ${subscription.status} subscription`,
      };
    }

    // Check if renewal is needed
    const now = Math.floor(Date.now() / 1000);
    if (now < subscription.currentPeriodEnd && subscription.status !== 'past_due') {
      return {
        success: true,
        subscription,
        error: 'No payment needed yet',
      };
    }

    // In production, this would:
    // 1. Create payment request
    // 2. Execute payment using stored payment method
    // 3. Update subscription status

    // For now, simulate successful payment
    const periodSeconds = this.getPeriodSeconds(subscription.tier.period);
    
    subscription.currentPeriodStart = now;
    subscription.currentPeriodEnd = now + periodSeconds;
    subscription.nextPaymentDate = now + periodSeconds;
    subscription.status = 'active';
    subscription.updatedAt = now;
    subscription.lastPaymentId = uuidv4();

    store.subscriptions.set(subscriptionId, subscription);

    return {
      success: true,
      subscription,
    };
  }

  /**
   * Cancel subscription
   */
  async cancel(subscriptionId: string, immediately: boolean = false): Promise<void> {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const now = Math.floor(Date.now() / 1000);

    if (immediately) {
      subscription.status = 'cancelled';
      subscription.currentPeriodEnd = now;
    } else {
      // Cancel at end of period
      subscription.autoRenew = false;
    }

    subscription.cancelledAt = now;
    subscription.updatedAt = now;

    store.subscriptions.set(subscriptionId, subscription);
  }

  /**
   * Change subscription tier
   */
  async changeTier(
    subscriptionId: string,
    newTierId: string,
    prorate: boolean = true
  ): Promise<Subscription> {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const newTier = store.tiers.get(newTierId);
    if (!newTier) {
      throw new Error(`Tier ${newTierId} not found`);
    }

    const now = Math.floor(Date.now() / 1000);
    const oldTier = subscription.tier;

    // Calculate proration if upgrading
    if (prorate) {
      const remainingTime = subscription.currentPeriodEnd - now;
      const periodSeconds = this.getPeriodSeconds(oldTier.period);
      const remainingRatio = remainingTime / periodSeconds;

      const oldPrice = parseFloat(oldTier.price);
      const newPrice = parseFloat(newTier.price);

      if (newPrice > oldPrice) {
        // Upgrade - charge difference
        const credit = oldPrice * remainingRatio;
        const charge = newPrice * remainingRatio;
        const proratedCharge = (charge - credit).toFixed(2);
        
        // In production, process prorated charge here
        console.log(`Prorated charge: $${proratedCharge}`);
      }
      // Downgrade - credit is applied to future invoices
    }

    // Update subscription
    subscription.tier = newTier;
    subscription.nextPaymentAmount = newTier.price;
    subscription.updatedAt = now;

    store.subscriptions.set(subscriptionId, subscription);

    return subscription;
  }

  /**
   * Get usage data for subscription
   */
  async getUsage(subscriptionId: string): Promise<UsageData> {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // In production, fetch from usage tracking database
    const mockUsage = {
      apiCalls: Math.floor(Math.random() * 10000),
      storage: Math.floor(Math.random() * 1000),
      bandwidth: Math.floor(Math.random() * 5000),
    };

    const limits = subscription.tier.limits;
    const overage = {
      apiCalls: Math.max(0, mockUsage.apiCalls - (limits.apiCalls || 0)),
      storage: Math.max(0, mockUsage.storage - (limits.storage || 0)),
      bandwidth: Math.max(0, mockUsage.bandwidth - (limits.bandwidth || 0)),
    };

    // Calculate overage charges (simplified)
    const overageRate = 0.001; // $0.001 per API call overage
    const overageCharges = (overage.apiCalls * overageRate).toFixed(2);

    return {
      subscriptionId,
      period: {
        start: subscription.currentPeriodStart,
        end: subscription.currentPeriodEnd,
      },
      usage: mockUsage,
      limits,
      overage,
      overageCharges,
    };
  }

  /**
   * Get subscription by ID
   */
  async getById(subscriptionId: string): Promise<Subscription | undefined> {
    return store.subscriptions.get(subscriptionId);
  }

  /**
   * Get subscriptions by user
   */
  async getByUser(userId: string): Promise<Subscription[]> {
    return Array.from(store.subscriptions.values()).filter(
      (s) => s.userId === userId
    );
  }

  /**
   * Get subscriptions by service
   */
  async getByService(serviceId: string): Promise<Subscription[]> {
    return Array.from(store.subscriptions.values()).filter(
      (s) => s.serviceId === serviceId
    );
  }

  /**
   * Get all available tiers
   */
  getTiers(): SubscriptionTier[] {
    return Array.from(store.tiers.values());
  }

  /**
   * Get tier by ID
   */
  getTier(tierId: string): SubscriptionTier | undefined {
    return store.tiers.get(tierId);
  }

  /**
   * Pause subscription
   */
  async pause(subscriptionId: string): Promise<Subscription> {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    subscription.status = 'paused';
    subscription.updatedAt = Math.floor(Date.now() / 1000);

    store.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  /**
   * Resume paused subscription
   */
  async resume(subscriptionId: string): Promise<Subscription> {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    if (subscription.status !== 'paused') {
      throw new Error('Subscription is not paused');
    }

    const now = Math.floor(Date.now() / 1000);
    subscription.status = 'active';
    subscription.updatedAt = now;

    // Extend period by pause duration
    // In production, track pause start time

    store.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  /**
   * Get subscriptions due for renewal
   */
  async getDueForRenewal(beforeTimestamp?: number): Promise<Subscription[]> {
    const threshold = beforeTimestamp || Math.floor(Date.now() / 1000) + 86400; // 24 hours
    
    return Array.from(store.subscriptions.values()).filter(
      (s) => 
        s.status === 'active' && 
        s.autoRenew && 
        s.nextPaymentDate <= threshold
    );
  }

  /**
   * Get period duration in seconds
   */
  private getPeriodSeconds(period: string): number {
    const periods: Record<string, number> = {
      hourly: 3600,
      daily: 86400,
      weekly: 604800,
      monthly: 2592000, // 30 days
      yearly: 31536000, // 365 days
    };
    return periods[period] || periods.monthly;
  }
}

// ============================================
// Singleton Instance
// ============================================

let subscriptionManagerInstance: SubscriptionManager | null = null;

export function getSubscriptionManager(): SubscriptionManager {
  if (!subscriptionManagerInstance) {
    subscriptionManagerInstance = new SubscriptionManager();
  }
  return subscriptionManagerInstance;
}

export default SubscriptionManager;
