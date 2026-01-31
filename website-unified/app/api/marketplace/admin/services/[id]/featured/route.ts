/**
 * Admin Service Featured Toggle API Route
 * PUT /api/marketplace/admin/services/[id]/featured - Toggle featured status
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

const SetFeaturedSchema = z.object({
  featured: z.boolean(),
});

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await parseBody(request, SetFeaturedSchema);
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    const service = await db.findServiceById(id);
    
    if (!service) {
      throw new NotFoundError('Service', id);
    }
    
    // Update service featured status
    const updatedService = await db.updateService(id, {
      featured: body.featured,
    });
    
    return createResponse({
      service: {
        id: updatedService.id,
        name: updatedService.name,
        featured: updatedService.featured,
      },
      message: body.featured ? 'Service marked as featured' : 'Service removed from featured',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Admin set featured error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Failed to update featured status',
      500
    );
  }
}

export const PUT = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
