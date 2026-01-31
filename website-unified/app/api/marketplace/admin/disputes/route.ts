/**
 * Admin Disputes API Route
 * GET /api/marketplace/admin/disputes - List disputes
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
  parseQuery,
  ErrorCodes,
  APIException,
} from '@/lib/api';
import type { RequestContext } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Schemas
// ============================================================================

const ListDisputesQuerySchema = z.object({
  status: z.enum(['open', 'investigating', 'mediation', 'resolved', 'rejected']).optional(),
  serviceId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest, ctx: RequestContext) {
  const query = parseQuery(request, ListDisputesQuerySchema);
  const page = query.page ?? 1;
  const limit = query.limit ?? 50;
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    const { disputes, total } = await db.findDisputes({
      status: query.status,
      serviceId: query.serviceId,
      page,
      limit,
    });
    
    // Enrich disputes with service info
    const enrichedDisputes = await Promise.all(
      disputes.map(async (dispute) => {
        const service = await db.findServiceById(dispute.serviceId);
        
        return {
          id: dispute.id,
          serviceId: dispute.serviceId,
          serviceName: service?.name || 'Unknown Service',
          disputerWallet: dispute.disputerWallet,
          reason: dispute.reason,
          evidence: dispute.evidence,
          status: dispute.status,
          resolution: dispute.resolution,
          createdAt: dispute.createdAt instanceof Date 
            ? dispute.createdAt.toISOString() 
            : dispute.createdAt,
          updatedAt: dispute.updatedAt instanceof Date 
            ? dispute.updatedAt.toISOString() 
            : dispute.updatedAt,
        };
      })
    );
    
    const totalPages = Math.ceil(total / limit);
    
    return createResponse({
      disputes: enrichedDisputes,
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
    console.error('[API] Admin disputes list error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch disputes')
    );
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});
