/**
 * Subscription Renewal API Route
 * POST /api/marketplace/subscriptions/[id]/renew - Renew subscription
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
import type { RequestContext } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Schema
// ============================================================================

const RenewSubscriptionSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await parseBody(request, RenewSubscriptionSchema);
  const walletAddress = request.headers.get('x-wallet-address');
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    // Find subscription
    const { subscriptions } = await db.findSubscriptions({ limit: 1000 });
    const subscription = subscriptions.find(s => s.id === id);
    
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
    
    // Calculate new dates based on current plan
    const now = new Date();
    const endDate = subscription.plan === 'annually'
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Update subscription
    const updatedSubscription = await db.updateSubscription(id, {
      status: 'active',
      startDate: now,
      endDate,
      nextBillingDate: endDate,
      autoRenew: true,
      txHash: body.txHash,
      usage: { used: 0, limit: subscription.usage?.limit || 1000, period: now.toISOString().slice(0, 7) },
    });
    
    // Get service for response
    const service = await db.findServiceById(subscription.serviceId);
    
    return createResponse({
      subscription: {
        id: updatedSubscription.id,
        serviceId: updatedSubscription.serviceId,
        serviceName: service?.name || 'Unknown Service',
        plan: updatedSubscription.plan,
        price: updatedSubscription.price,
        status: updatedSubscription.status,
        startDate: updatedSubscription.startDate instanceof Date 
          ? updatedSubscription.startDate.toISOString() 
          : updatedSubscription.startDate,
        endDate: updatedSubscription.endDate instanceof Date 
          ? updatedSubscription.endDate.toISOString() 
          : updatedSubscription.endDate,
        nextBillingDate: updatedSubscription.nextBillingDate instanceof Date 
          ? updatedSubscription.nextBillingDate.toISOString() 
          : updatedSubscription.nextBillingDate,
        autoRenew: updatedSubscription.autoRenew,
      },
      message: 'Subscription renewed successfully.',
      txHash: body.txHash,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Subscription renewal error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to renew subscription',
      500
    );
  }
}

export const POST = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 10 },
});
