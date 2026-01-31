/**
 * Marketplace Subscriptions API Route
 * /api/marketplace/subscriptions - Subscription management
 * 
 * Real implementation using the marketplace SDK
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
  parseQuery,
} from '@/lib/api';
import { APIException, BadRequestError, NotFoundError } from '@/lib/api/errors';
import type { RequestContext, Subscription } from '@/lib/api';
import {
  getWalletSubscriptions,
  createSubscription,
  getService,
  type CreateSubscriptionParams,
} from '@/lib/marketplace/sdk';

export const runtime = 'nodejs'; // Use Node.js runtime for SDK access

// ============================================================================
// Schemas
// ============================================================================

const CreateSubscriptionSchema = z.object({
  serviceId: z.string(),
  plan: z.enum(['monthly', 'annually']),
  paymentMethod: z.enum(['crypto', 'credits']),
  autoRenew: z.boolean().default(true),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional(),
});

const ListSubscriptionsQuerySchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  status: z.enum(['all', 'active', 'cancelled', 'expired']).optional().default('all'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform SDK subscription format to API response format
 */
function transformSubscription(sub: any): Subscription {
  return {
    id: sub.id,
    serviceId: sub.serviceId,
    serviceName: sub.serviceName || 'Unknown Service',
    plan: sub.plan,
    price: sub.price,
    startDate: sub.startDate instanceof Date ? sub.startDate.toISOString() : sub.startDate,
    endDate: sub.endDate instanceof Date ? sub.endDate.toISOString() : sub.endDate,
    nextBillingDate: sub.nextBillingDate instanceof Date ? sub.nextBillingDate.toISOString() : sub.nextBillingDate,
    status: sub.status,
    autoRenew: sub.autoRenew || false,
    usage: sub.usage || { used: 0, limit: 1000, period: new Date().toISOString().slice(0, 7) },
  };
}

// ============================================================================
// GET - List Subscriptions
// ============================================================================

async function listHandler(request: NextRequest, ctx: RequestContext) {
  const query = parseQuery(request, ListSubscriptionsQuerySchema);
  
  try {
    // Wallet address is required for fetching subscriptions
    if (!query.walletAddress) {
      throw new BadRequestError('walletAddress query parameter is required');
    }
    
    // Fetch real subscriptions from SDK
    const allSubscriptions = await getWalletSubscriptions(query.walletAddress as `0x${string}`);
    
    // Filter by status
    let subscriptions = allSubscriptions.map(transformSubscription);
    if (query.status !== 'all') {
      subscriptions = subscriptions.filter((s) => s.status === query.status);
    }
    
    // Calculate pagination
    const total = subscriptions.length;
    const limit = query.limit ?? 20;
    const page = query.page ?? 1;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedSubs = subscriptions.slice(startIndex, startIndex + limit);
    
    // Calculate summary
    const activeSubs = allSubscriptions.filter((s) => s.status === 'active');
    const monthlySpend = activeSubs.reduce((acc, s) => {
      const price = parseFloat(s.price?.replace(/[^0-9.]/g, '') || '0');
      return acc + (s.plan === 'monthly' ? price : price / 12);
    }, 0);
    
    return createResponse({
      subscriptions: paginatedSubs,
      summary: {
        total: allSubscriptions.length,
        active: activeSubs.length,
        monthlySpend: `$${monthlySpend.toFixed(2)}`,
        nextBillingTotal: `$${monthlySpend.toFixed(2)}`,
      },
    }, {
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error('[API] Subscriptions list error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to fetch subscriptions',
      500
    );
  }
}

// ============================================================================
// POST - Create Subscription
// ============================================================================

async function createHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, CreateSubscriptionSchema);
  
  try {
    // Verify service exists and has subscription pricing
    const service = await getService(body.serviceId);
    if (!service) {
      return createErrorResponse(
        ErrorCodes.NOT_FOUND,
        `Service not found: ${body.serviceId}`,
        404
      );
    }
    
    const pricing = service.pricing?.subscription;
    if (!pricing) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'This service does not offer subscription pricing',
        400
      );
    }
    
    // For crypto payments, txHash is required
    if (body.paymentMethod === 'crypto' && !body.txHash) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Transaction hash is required for crypto payments',
        400
      );
    }
    
    // Create subscription using SDK
    const params: CreateSubscriptionParams = {
      serviceId: body.serviceId,
      plan: body.plan,
      subscriberWallet: body.walletAddress as `0x${string}`,
      txHash: (body.txHash || `0x${'0'.repeat(64)}`) as `0x${string}`,
      autoRenew: body.autoRenew,
    };
    
    const subscription = await createSubscription(params);
    
    return createResponse({
      subscription: transformSubscription(subscription),
      message: 'Subscription created successfully.',
    }, {
      status: 201,
      meta: { requestId: ctx.requestId },
    });
  } catch (error) {
    console.error('[API] Subscription creation error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to create subscription',
      500
    );
  }
}

export const GET = withHandler(listHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});

export const POST = withHandler(createHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 20 },
});
