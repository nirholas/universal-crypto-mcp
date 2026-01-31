/**
 * Marketplace Reviews API Route
 * /api/marketplace/reviews - Review management
 * 
 * Production implementation using database and SDK
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
  ErrorCodes,
  APIException,
} from '@/lib/api';
import type { RequestContext, Review } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';
import { submitReview } from '@/lib/marketplace/sdk';

export const runtime = 'nodejs'; // Use Node.js runtime for database access

// ============================================================================
// Schemas
// ============================================================================

const ListReviewsQuerySchema = z.object({
  serviceId: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  verified: z.coerce.boolean().default(false),
  sort: z.enum(['newest', 'oldest', 'rating', 'helpful']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const CreateReviewSchema = z.object({
  serviceId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(2000),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional(),
});

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform database review to API Review format
 */
function transformReview(review: any): Review {
  return {
    id: review.id,
    serviceId: review.serviceId,
    reviewer: {
      address: review.reviewerWallet,
      ens: review.reviewerEns,
    },
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    verifiedPayment: review.verifiedPayment,
    helpful: review.helpful,
    createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt,
    response: review.response,
  };
}

// ============================================================================
// GET - List Reviews
// ============================================================================

async function listHandler(request: NextRequest, ctx: RequestContext) {
  const query = parseQuery(request, ListReviewsQuerySchema);
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const verified = Boolean(query.verified);
  const sort = query.sort ?? 'newest';
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    // Build filters
    const filters: Parameters<typeof db.findReviews>[0] = {
      serviceId: query.serviceId,
      minRating: query.rating,
      verified,
      sort,
      page,
      limit,
    };
    
    const { reviews, total } = await db.findReviews(filters);
    
    // Transform to API format
    const transformedReviews = reviews.map(transformReview);
    
    // Get all reviews for stats calculation
    const allReviewsResult = await db.findReviews({ 
      serviceId: query.serviceId,
      limit: 1000 
    });
    const allReviews = allReviewsResult.reviews;
    
    // Calculate stats
    const stats = {
      total: allReviews.length,
      average: allReviews.length > 0 
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
        : 0,
      distribution: {
        5: allReviews.filter((r) => r.rating === 5).length,
        4: allReviews.filter((r) => r.rating === 4).length,
        3: allReviews.filter((r) => r.rating === 3).length,
        2: allReviews.filter((r) => r.rating === 2).length,
        1: allReviews.filter((r) => r.rating === 1).length,
      },
      verified: allReviews.filter((r) => r.verifiedPayment).length,
    };
    
    const totalPages = Math.ceil(total / limit);
    
    return createResponse({
      reviews: transformedReviews,
      stats,
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
    console.error('[API] Reviews list error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch reviews')
    );
  }
}

// ============================================================================
// POST - Create Review
// ============================================================================

async function createHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, CreateReviewSchema);
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    // Verify service exists
    const service = await db.findServiceById(body.serviceId);
    if (!service) {
      return createErrorResponse(
        new APIException(ErrorCodes.NOT_FOUND, `Service not found: ${body.serviceId}`)
      );
    }
    
    // Check if user has already reviewed this service
    const { reviews: existingReviews } = await db.findReviews({
      serviceId: body.serviceId,
      limit: 1000,
    });
    
    const hasExistingReview = existingReviews.some(
      (r) => r.reviewerWallet.toLowerCase() === body.walletAddress.toLowerCase()
    );
    
    if (hasExistingReview) {
      return createErrorResponse(
        new APIException(ErrorCodes.VALIDATION_ERROR, 'You have already reviewed this service')
      );
    }
    
    // Check if user has a subscription or payment for this service (verified payment)
    const { subscriptions } = await db.findSubscriptions({
      subscriberAddress: body.walletAddress as `0x${string}`,
      serviceId: body.serviceId,
    });
    const verifiedPayment = subscriptions.length > 0;
    
    // Create review in database
    const review = await db.createReview({
      serviceId: body.serviceId,
      reviewerWallet: body.walletAddress,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      verifiedPayment,
      helpful: 0,
    });
    
    // Also submit to SDK for reputation tracking
    try {
      await submitReview({
        serviceId: body.serviceId,
        reviewerWallet: body.walletAddress as `0x${string}`,
        rating: body.rating,
        title: body.title,
        comment: body.comment,
      });
    } catch (sdkError) {
      // Log but don't fail - database record is primary
      console.warn('[API] SDK review submission failed:', sdkError);
    }
    
    return createResponse({
      review: transformReview(review),
      message: 'Review submitted successfully.',
    }, {
      status: 201,
      meta: { requestId: ctx.requestId },
    });
  } catch (error) {
    console.error('[API] Review creation error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to create review')
    );
  }
}

export const GET = withHandler(listHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});

export const POST = withHandler(createHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 10 },
});
