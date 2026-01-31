/**
 * Marketplace Subscription Detail API Route
 * /api/marketplace/subscriptions/[id] - Single subscription management
 * 
 * Production implementation using database
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  createErrorResponse,
  parseBody,
  NotFoundError,
  ErrorCodes,
} from '@/lib/api';
import type { RequestContext, Subscription, SubscriptionUsage } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Schemas
// ============================================================================

const UpdateSubscriptionSchema = z.object({
  autoRenew: z.boolean().optional(),
  action: z.enum(['cancel', 'resume', 'upgrade']).optional(),
  newPlan: z.enum(['monthly', 'annually']).optional(),
});

// ============================================================================
// Helper Functions
// ============================================================================

async function findSubscription(db: ReturnType<typeof getDatabase>, id: string) {
  const { subscriptions } = await db.findSubscriptions({ limit: 1000 });
  return subscriptions.find(s => s.id === id);
}

// ============================================================================
// GET - Get Subscription Details
// ============================================================================

async function getHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    const subscription = await findSubscription(db, id);
    
    if (!subscription) {
      throw new NotFoundError('Subscription', id);
    }
    
    // Get service details
    const service = await db.findServiceById(subscription.serviceId);
    
    // Build usage data
    const usage: SubscriptionUsage = {
      subscriptionId: subscription.id,
      period: new Date().toISOString().slice(0, 7),
      requests: subscription.usage?.used || 0,
      limit: subscription.usage?.limit || 1000,
      overage: Math.max(0, (subscription.usage?.used || 0) - (subscription.usage?.limit || 1000)),
      overageCharges: '$0.00',
      dailyUsage: generateDailyUsage(subscription.usage?.used || 0),
    };
    
    return createResponse({
      subscription: {
        id: subscription.id,
        serviceId: subscription.serviceId,
        serviceName: service?.name || 'Unknown Service',
        plan: subscription.plan,
        price: subscription.price,
        startDate: subscription.startDate instanceof Date 
          ? subscription.startDate.toISOString() 
          : subscription.startDate,
        endDate: subscription.endDate instanceof Date 
          ? subscription.endDate.toISOString() 
          : subscription.endDate,
        nextBillingDate: subscription.nextBillingDate instanceof Date 
          ? subscription.nextBillingDate.toISOString() 
          : subscription.nextBillingDate,
        status: subscription.status,
        autoRenew: subscription.autoRenew,
        usage: subscription.usage,
      },
      usage,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Subscription get error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to fetch subscription',
      500
    );
  }
}

function generateDailyUsage(totalUsed: number): Array<{ date: string; requests: number }> {
  const days = [];
  const now = new Date();
  const dayOfMonth = now.getDate();
  const avgPerDay = Math.floor(totalUsed / dayOfMonth);
  
  for (let i = 1; i <= dayOfMonth; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), i);
    const variance = Math.floor(Math.random() * avgPerDay * 0.4) - (avgPerDay * 0.2);
    days.push({
      date: date.toISOString().split('T')[0],
      requests: Math.max(0, avgPerDay + variance),
    });
  }
  
  return days;
}

// ============================================================================
// PUT - Update Subscription
// ============================================================================

async function updateHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    const subscription = await findSubscription(db, id);
    
    if (!subscription) {
      throw new NotFoundError('Subscription', id);
    }
    
    const body = await parseBody(request, UpdateSubscriptionSchema);
    
    let message = 'Subscription updated.';
    let updates: Partial<typeof subscription> = {};
    
    if (body.action === 'cancel') {
      updates = { status: 'cancelled', autoRenew: false };
      message = 'Subscription cancelled. You will have access until the end of your billing period.';
    } else if (body.action === 'resume') {
      updates = { status: 'active', autoRenew: true };
      message = 'Subscription resumed successfully.';
    } else if (body.action === 'upgrade' && body.newPlan) {
      const pricing = body.newPlan === 'annually' ? '$299.99' : '$29.99';
      updates = { plan: body.newPlan, price: pricing };
      message = `Subscription upgraded to ${body.newPlan} plan.`;
    } else if (body.autoRenew !== undefined) {
      updates = { autoRenew: body.autoRenew };
      message = `Auto-renewal ${body.autoRenew ? 'enabled' : 'disabled'}.`;
    }
    
    const updatedSubscription = await db.updateSubscription(id, updates);
    
    return createResponse({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        plan: updatedSubscription.plan,
        price: updatedSubscription.price,
        autoRenew: updatedSubscription.autoRenew,
      },
      message,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Subscription update error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to update subscription',
      500
    );
  }
}

// ============================================================================
// DELETE - Cancel Subscription
// ============================================================================

async function deleteHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const walletAddress = request.headers.get('x-wallet-address');
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    const subscription = await findSubscription(db, id);
    
    if (!subscription) {
      throw new NotFoundError('Subscription', id);
    }
    
    // Verify ownership if wallet address provided
    if (walletAddress && 
        subscription.subscriberAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return createErrorResponse(
        ErrorCodes.FORBIDDEN,
        'You do not own this subscription',
        403
      );
    }
    
    const updatedSubscription = await db.updateSubscription(id, {
      status: 'cancelled',
      autoRenew: false,
    });
    
    return createResponse({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        autoRenew: updatedSubscription.autoRenew,
      },
      message: 'Subscription cancelled. You will have access until the end of your billing period.',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Subscription cancel error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to cancel subscription',
      500
    );
  }
}

export const GET = withHandler(getHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});

export const PUT = withHandler(updateHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});

export const DELETE = withHandler(deleteHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 10 },
});
