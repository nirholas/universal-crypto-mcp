/**
 * Billing Cycle Handler
 * 
 * Manages billing cycles, proration, grace periods, and retry logic
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { getSubscriptionManager } from './subscriptionManager';
import type { Subscription, BillingPeriod, PaymentResult } from './types';

// ============================================
// Types
// ============================================

interface BillingCycleConfig {
  gracePeriodDays: number;
  maxRetryAttempts: number;
  retryIntervalHours: number[];
  notifyBeforeDays: number;
}

interface ProrationResult {
  credit: string;
  charge: string;
  netAmount: string;
  daysRemaining: number;
  totalDays: number;
}

interface RetryAttempt {
  subscriptionId: string;
  attempt: number;
  scheduledAt: number;
  executedAt?: number;
  success: boolean;
  error?: string;
}

interface BillingEvent {
  id: string;
  subscriptionId: string;
  type: 'renewal' | 'upgrade' | 'downgrade' | 'cancellation' | 'payment_failed' | 'payment_success';
  timestamp: number;
  details: Record<string, unknown>;
}

// ============================================
// Default Configuration
// ============================================

const DEFAULT_CONFIG: BillingCycleConfig = {
  gracePeriodDays: 3,
  maxRetryAttempts: 3,
  retryIntervalHours: [24, 48, 72], // Retry after 24h, 48h, 72h
  notifyBeforeDays: 3,
};

// ============================================
// In-Memory Store (Replace with Database)
// ============================================

const retryQueue: Map<string, RetryAttempt[]> = new Map();
const billingEvents: BillingEvent[] = [];

// ============================================
// Billing Cycle Handler Class
// ============================================

export class BillingCycleHandler {
  private config: BillingCycleConfig;
  private subscriptionManager = getSubscriptionManager();

  constructor(config: Partial<BillingCycleConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate next billing date
   */
  calculateNextBillingDate(
    currentPeriodEnd: number,
    period: BillingPeriod
  ): number {
    const periodSeconds = this.getPeriodSeconds(period);
    return currentPeriodEnd + periodSeconds;
  }

  /**
   * Calculate proration for tier change
   */
  calculateProration(
    subscription: Subscription,
    newPrice: number
  ): ProrationResult {
    const now = Math.floor(Date.now() / 1000);
    const periodSeconds = this.getPeriodSeconds(subscription.tier.period);
    
    const daysRemaining = Math.max(0, 
      Math.ceil((subscription.currentPeriodEnd - now) / 86400)
    );
    const totalDays = Math.ceil(periodSeconds / 86400);
    const ratio = daysRemaining / totalDays;

    const currentPrice = parseFloat(subscription.tier.price);
    const credit = currentPrice * ratio;
    const charge = newPrice * ratio;
    const netAmount = charge - credit;

    return {
      credit: credit.toFixed(2),
      charge: charge.toFixed(2),
      netAmount: netAmount.toFixed(2),
      daysRemaining,
      totalDays,
    };
  }

  /**
   * Check if subscription is in grace period
   */
  isInGracePeriod(subscription: Subscription): boolean {
    if (subscription.status !== 'past_due') return false;

    const now = Math.floor(Date.now() / 1000);
    const gracePeriodEnd = subscription.currentPeriodEnd + 
      (this.config.gracePeriodDays * 86400);

    return now < gracePeriodEnd;
  }

  /**
   * Get grace period end date
   */
  getGracePeriodEnd(subscription: Subscription): number {
    return subscription.currentPeriodEnd + (this.config.gracePeriodDays * 86400);
  }

  /**
   * Handle failed payment with retry logic
   */
  async handleFailedPayment(
    subscriptionId: string,
    error: string
  ): Promise<void> {
    const subscription = await this.subscriptionManager.getById(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Get or create retry queue for subscription
    let retries = retryQueue.get(subscriptionId) || [];
    const attemptNumber = retries.length + 1;

    // Check if max retries exceeded
    if (attemptNumber > this.config.maxRetryAttempts) {
      // Mark subscription as expired
      await this.handleMaxRetriesExceeded(subscription);
      return;
    }

    // Schedule retry
    const retryDelayHours = this.config.retryIntervalHours[attemptNumber - 1] || 72;
    const now = Math.floor(Date.now() / 1000);

    const attempt: RetryAttempt = {
      subscriptionId,
      attempt: attemptNumber,
      scheduledAt: now + (retryDelayHours * 3600),
      success: false,
      error,
    };

    retries.push(attempt);
    retryQueue.set(subscriptionId, retries);

    // Log event
    this.logEvent(subscriptionId, 'payment_failed', { error, attempt: attemptNumber });

    // In production, schedule a job to retry at scheduledAt
  }

  /**
   * Process scheduled retry
   */
  async processRetry(subscriptionId: string): Promise<boolean> {
    const retries = retryQueue.get(subscriptionId) || [];
    const pendingRetry = retries.find((r) => !r.executedAt);

    if (!pendingRetry) {
      return false;
    }

    pendingRetry.executedAt = Math.floor(Date.now() / 1000);

    try {
      const result = await this.subscriptionManager.processRecurring(subscriptionId);
      
      if (result.success) {
        pendingRetry.success = true;
        retryQueue.delete(subscriptionId); // Clear retry queue on success
        this.logEvent(subscriptionId, 'payment_success', { attempt: pendingRetry.attempt });
        return true;
      } else {
        await this.handleFailedPayment(subscriptionId, result.error || 'Payment failed');
        return false;
      }
    } catch (error) {
      await this.handleFailedPayment(
        subscriptionId, 
        error instanceof Error ? error.message : 'Unknown error'
      );
      return false;
    }
  }

  /**
   * Handle max retries exceeded - expire subscription
   */
  private async handleMaxRetriesExceeded(subscription: Subscription): Promise<void> {
    // Cancel subscription
    await this.subscriptionManager.cancel(subscription.id, true);

    // Log event
    this.logEvent(subscription.id, 'cancellation', {
      reason: 'max_retries_exceeded',
      attempts: this.config.maxRetryAttempts,
    });

    // In production, notify user about cancellation
  }

  /**
   * Process cancellation
   */
  async processCancellation(
    subscriptionId: string,
    immediately: boolean = false
  ): Promise<{ refundAmount?: string; effectiveDate: number }> {
    const subscription = await this.subscriptionManager.getById(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const now = Math.floor(Date.now() / 1000);
    let refundAmount: string | undefined;
    let effectiveDate: number;

    if (immediately) {
      // Calculate partial refund
      const proration = this.calculateProration(subscription, 0);
      refundAmount = proration.credit;
      effectiveDate = now;
    } else {
      // Cancel at end of period
      effectiveDate = subscription.currentPeriodEnd;
    }

    await this.subscriptionManager.cancel(subscriptionId, immediately);

    this.logEvent(subscriptionId, 'cancellation', {
      immediately,
      refundAmount,
      effectiveDate,
    });

    return { refundAmount, effectiveDate };
  }

  /**
   * Get subscriptions needing renewal notification
   */
  async getUpcomingRenewals(): Promise<Subscription[]> {
    const notifyBefore = this.config.notifyBeforeDays * 86400;
    const now = Math.floor(Date.now() / 1000);
    const threshold = now + notifyBefore;

    return this.subscriptionManager.getDueForRenewal(threshold);
  }

  /**
   * Run billing cycle for all due subscriptions
   */
  async runBillingCycle(): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: { subscriptionId: string; error: string }[];
  }> {
    const dueSubscriptions = await this.subscriptionManager.getDueForRenewal();
    
    let successful = 0;
    let failed = 0;
    const errors: { subscriptionId: string; error: string }[] = [];

    for (const subscription of dueSubscriptions) {
      try {
        const result = await this.subscriptionManager.processRecurring(subscription.id);
        
        if (result.success) {
          successful++;
          this.logEvent(subscription.id, 'renewal', { 
            amount: subscription.tier.price,
            period: subscription.tier.period,
          });
        } else {
          failed++;
          await this.handleFailedPayment(subscription.id, result.error || 'Payment failed');
          errors.push({ subscriptionId: subscription.id, error: result.error || 'Payment failed' });
        }
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await this.handleFailedPayment(subscription.id, errorMessage);
        errors.push({ subscriptionId: subscription.id, error: errorMessage });
      }
    }

    return {
      processed: dueSubscriptions.length,
      successful,
      failed,
      errors,
    };
  }

  /**
   * Log billing event
   */
  private logEvent(
    subscriptionId: string,
    type: BillingEvent['type'],
    details: Record<string, unknown>
  ): void {
    const event: BillingEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subscriptionId,
      type,
      timestamp: Math.floor(Date.now() / 1000),
      details,
    };

    billingEvents.push(event);

    // Keep only last 10000 events in memory
    if (billingEvents.length > 10000) {
      billingEvents.shift();
    }
  }

  /**
   * Get billing events for subscription
   */
  getBillingEvents(subscriptionId: string, limit: number = 50): BillingEvent[] {
    return billingEvents
      .filter((e) => e.subscriptionId === subscriptionId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get period duration in seconds
   */
  private getPeriodSeconds(period: BillingPeriod): number {
    const periods: Record<string, number> = {
      hourly: 3600,
      daily: 86400,
      weekly: 604800,
      monthly: 2592000,
      yearly: 31536000,
    };
    return periods[period] || periods.monthly;
  }
}

// ============================================
// Singleton Instance
// ============================================

let billingCycleHandlerInstance: BillingCycleHandler | null = null;

export function getBillingCycleHandler(
  config?: Partial<BillingCycleConfig>
): BillingCycleHandler {
  if (!billingCycleHandlerInstance || config) {
    billingCycleHandlerInstance = new BillingCycleHandler(config);
  }
  return billingCycleHandlerInstance;
}

export default BillingCycleHandler;
