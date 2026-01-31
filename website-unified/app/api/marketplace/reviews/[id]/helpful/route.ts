/**
 * Review Helpful API Route
 * POST /api/marketplace/reviews/[id]/helpful - Mark review as helpful
 * 
 * Production implementation using database
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import {
  withHandler,
  createResponse,
  createErrorResponse,
  NotFoundError,
  ErrorCodes,
} from '@/lib/api';
import type { RequestContext } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    // Find review
    const { reviews } = await db.findReviews({ limit: 1000 });
    const review = reviews.find(r => r.id === id);
    
    if (!review) {
      throw new NotFoundError('Review', id);
    }
    
    // Increment helpful count
    const updatedReview = await db.updateReview(id, {
      helpful: (review.helpful || 0) + 1,
    });
    
    return createResponse({
      review: {
        id: updatedReview.id,
        helpful: updatedReview.helpful,
      },
      message: 'Review marked as helpful.',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Review helpful error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to mark review as helpful',
      500
    );
  }
}

export const POST = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
