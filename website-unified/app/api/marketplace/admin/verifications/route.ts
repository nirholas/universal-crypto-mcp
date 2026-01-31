/**
 * Admin Service Verifications API Route
 * GET /api/marketplace/admin/verifications - List pending service verifications
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

const ListVerificationsQuerySchema = z.object({
  status: z.enum(['pending', 'active', 'suspended', 'archived']).default('pending'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest, ctx: RequestContext) {
  const query = parseQuery(request, ListVerificationsQuerySchema);
  const page = query.page ?? 1;
  const limit = query.limit ?? 50;
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    // Use service status directly
    const serviceStatus = query.status;
    
    const { services, total } = await db.findServices({
      status: serviceStatus,
      page,
      limit,
    });
    
    // Enrich services with provider info
    const enrichedServices = await Promise.all(
      services.map(async (service) => {
        const provider = await db.findProviderByWallet(service.walletAddress);
        const stats = await db.getServiceStats(service.id);
        
        return {
          id: service.id,
          name: service.name,
          description: service.description,
          category: service.category,
          endpoint: service.endpoint,
          status: service.status,
          verified: service.verified,
          provider: provider ? {
            id: provider.id,
            name: provider.name,
            walletAddress: provider.walletAddress,
            verified: provider.verified,
            rating: provider.rating,
            totalServices: provider.totalServices,
          } : null,
          pricing: service.pricing,
          tags: service.tags,
          stats: {
            rating: stats.rating,
            totalReviews: stats.totalReviews,
          },
          createdAt: service.createdAt instanceof Date 
            ? service.createdAt.toISOString() 
            : service.createdAt,
          updatedAt: service.updatedAt instanceof Date 
            ? service.updatedAt.toISOString() 
            : service.updatedAt,
        };
      })
    );
    
    const totalPages = Math.ceil(total / limit);
    
    return createResponse({
      services: enrichedServices,
      total,
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
    console.error('[API] Admin verifications list error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch verifications')
    );
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});
