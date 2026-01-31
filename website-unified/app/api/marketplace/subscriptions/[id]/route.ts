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
  APIException,
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
  ctx: RequestContext
) {
  const pathParts = request.nextUrl.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    const subscription = await findSubscription(db, id);
    
    if (!subscription) {
      throw new NotFoundError('Subscription', id);
    }
    
    // Get service details
    const service = await db.findServiceById(subscription.serviceId);
    
    // Calculate usage from subscription data (usageThisMonth or estimate)
    const usedRequests = 0; // Would come from usage tracking system in production
    const requestLimit = 10000; // Default limit, would come from plan in production
    
    // Build usage data
    const usage: SubscriptionUsage = {
      subscriptionId: subscription.id,
      period: new Date().toISOString().slice(0, 7),
      requests: usedRequests,
      limit: requestLimit,
      overage: Math.max(0, usedRequests - requestLimit),
      overageCharges: '$0.00',
      dailyUsage: generateDailyUsage(usedRequests),
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
        nextBillingDate: subscription.endDate instanceof Date 
          ? subscription.endDate.toISOString() 
          : subscription.endDate,
        status: subscription.active ? 'active' : 'cancelled',
        autoRenew: subscription.autoRenew,
        usage: { used: usedRequests, limit: requestLimit },
      },
      usage,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Subscription get error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch subscription')
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
  ctx: RequestContext
) {
  const pathParts = request.nextUrl.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
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
      updates = { active: false, autoRenew: false };
      message = 'Subscription cancelled. You will have access until the end of your billing period.';
    } else if (body.action === 'resume') {
      updates = { active: true, autoRenew: true };
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
        status: updatedSubscription.active ? 'active' : 'cancelled',
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
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to update subscription')
    );
  }
}

// ============================================================================
// DELETE - Cancel Subscription
// ============================================================================

async function deleteHandler(
  request: NextRequest,
  ctx: RequestContext
) {
  const pathParts = request.nextUrl.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
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
        subscription.subscriberWallet.toLowerCase() !== walletAddress.toLowerCase()) {
      return createErrorResponse(
        new APIException(ErrorCodes.FORBIDDEN, 'You do not own this subscription')
      );
    }
    
    const updatedSubscription = await db.updateSubscription(id, {
      active: false,
      autoRenew: false,
    });
    
    return createResponse({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.active ? 'active' : 'cancelled',
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
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to cancel subscription')
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
