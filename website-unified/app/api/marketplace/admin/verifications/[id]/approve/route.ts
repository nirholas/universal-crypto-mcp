/**
 * Admin Service Verification Action API Route
 * POST /api/marketplace/admin/verifications/[id]/approve - Approve service
 * POST /api/marketplace/admin/verifications/[id]/reject - Reject service
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
import type { RequestContext } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Approve Handler
// ============================================================================

async function approveHandler(
  request: NextRequest,
  ctx: RequestContext
) {
  const pathParts = request.nextUrl.pathname.split('/');
  const id = pathParts[pathParts.length - 2]; // -2 because path ends with /approve
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    const service = await db.findServiceById(id);
    
    if (!service) {
      throw new NotFoundError('Service', id);
    }
    
    // Update service to active and verified
    const updatedService = await db.updateService(id, {
      status: 'active',
      verified: true,
    });
    
    return createResponse({
      service: {
        id: updatedService.id,
        name: updatedService.name,
        status: updatedService.status,
        verified: updatedService.verified,
      },
      message: 'Service approved and verified successfully',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Admin service approval error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to approve service')
    );
  }
}

export const POST = withHandler(approveHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
