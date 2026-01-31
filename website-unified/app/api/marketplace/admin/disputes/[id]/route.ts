/**
 * Admin Dispute Resolution API Route
 * PUT /api/marketplace/admin/disputes/[id] - Resolve a dispute
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
// Schemas
// ============================================================================

const ResolveDisputeSchema = z.object({
  resolution: z.string().min(10).max(2000),
  action: z.enum(['resolve', 'dismiss']),
});

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await parseBody(request, ResolveDisputeSchema);
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    // Find the dispute
    const { disputes } = await db.findDisputes({ limit: 1000 });
    const dispute = disputes.find(d => d.id === id);
    
    if (!dispute) {
      throw new NotFoundError('Dispute', id);
    }
    
    // Update dispute status
    const newStatus = body.action === 'resolve' ? 'resolved' : 'dismissed';
    const updatedDispute = await db.updateDispute(id, {
      status: newStatus,
      resolution: body.resolution,
    });
    
    // If resolved and dispute was about a review, optionally remove the review
    // This would be handled by business logic in production
    
    return createResponse({
      dispute: {
        id: updatedDispute.id,
        status: updatedDispute.status,
        resolution: updatedDispute.resolution,
        updatedAt: updatedDispute.updatedAt instanceof Date 
          ? updatedDispute.updatedAt.toISOString() 
          : updatedDispute.updatedAt,
      },
      message: `Dispute ${body.action === 'resolve' ? 'resolved' : 'dismissed'} successfully`,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Admin dispute resolution error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to resolve dispute',
      500
    );
  }
}

export const PUT = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
