/**
 * Admin Service Rejection API Route
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
// Schema
// ============================================================================

const RejectServiceSchema = z.object({
  reason: z.string().min(10).max(1000),
});

// ============================================================================
// Reject Handler
// ============================================================================

async function rejectHandler(
  request: NextRequest,
  ctx: RequestContext
) {
  const pathParts = request.nextUrl.pathname.split('/');
  const id = pathParts[pathParts.length - 2]; // -2 because path ends with /reject
  const body = await parseBody(request, RejectServiceSchema);
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    const service = await db.findServiceById(id);
    
    if (!service) {
      throw new NotFoundError('Service', id);
    }
    
    // Update service to suspended status with rejection reason
    const updatedService = await db.updateService(id, {
      status: 'suspended',
      verified: false,
      metadata: {
        ...service.metadata,
        rejectionReason: body.reason,
        rejectedAt: new Date().toISOString(),
      },
    });
    
    return createResponse({
      service: {
        id: updatedService.id,
        name: updatedService.name,
        status: updatedService.status,
      },
      message: 'Service rejected',
      reason: body.reason,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Admin service rejection error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to reject service')
    );
  }
}

export const POST = withHandler(rejectHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
