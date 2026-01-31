/**
 * Marketplace Provider Services API Route
 * /api/marketplace/provider/services - Manage provider's services
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
  parseQuery,
  ErrorCodes,
  APIException,
} from '@/lib/api';
import type { RequestContext, Service } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Schemas
// ============================================================================

const CreateServiceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(['ai', 'data', 'weather', 'finance', 'social', 'infrastructure', 'analytics', 'storage', 'compute', 'security', 'defi', 'nft', 'trading', 'other']),
  endpoint: z.string().url(),
  pricing: z.object({
    payPerUse: z.string().optional(),
    subscription: z.object({
      monthly: z.string().optional(),
      annually: z.string().optional(),
    }).optional(),
  }),
  tags: z.array(z.string()).max(10).optional(),
});

const ListServicesQuerySchema = z.object({
  status: z.enum(['all', 'active', 'pending', 'suspended']).optional().default('all'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ============================================================================
// GET - List Provider's Services
// ============================================================================

async function listHandler(request: NextRequest, ctx: RequestContext) {
  const query = parseQuery(request, ListServicesQuerySchema);
  const walletAddress = request.headers.get('x-wallet-address');
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    if (!walletAddress) {
      return createErrorResponse(
        new APIException(ErrorCodes.UNAUTHORIZED, 'Wallet address required')
      );
    }
    
    // Get provider's services from database
    const { services, total } = await db.findServices({
      walletAddress,
      status: query.status === 'all' ? undefined : query.status,
      page: query.page,
      limit: query.limit,
    });
    
    // Enrich with stats
    const enrichedServices = await Promise.all(
      services.map(async (service) => {
        const stats = await db.getServiceStats(service.id);
        const provider = await db.findProviderByWallet(service.walletAddress);
        
        return {
          id: service.id,
          name: service.name,
          description: service.description,
          category: service.category,
          provider: provider ? {
            id: provider.id,
            name: provider.name,
            address: provider.walletAddress,
            verified: provider.verified,
            rating: provider.rating,
            totalServices: provider.totalServices,
          } : null,
          pricing: service.pricing,
          stats: {
            totalRequests: stats.totalRequests,
            totalRevenue: stats.totalRevenue,
            activeSubscribers: stats.activeSubscribers,
            averageResponseTime: stats.averageResponseTime,
            uptime: stats.uptime,
            last24hRequests: stats.last24hRequests,
          },
          reputation: {
            rating: stats.rating,
            totalReviews: stats.totalReviews,
            verifiedPayments: 0,
            badges: service.verified ? ['verified'] : [],
            responseRate: 98,
          },
          tags: service.tags,
          featured: service.featured,
          verified: service.verified,
          createdAt: service.createdAt instanceof Date 
            ? service.createdAt.toISOString() 
            : service.createdAt,
          updatedAt: service.updatedAt instanceof Date 
            ? service.updatedAt.toISOString() 
            : service.updatedAt,
        };
      })
    );
    
    const limit = query.limit ?? 20;
    const page = query.page ?? 1;
    const totalPages = Math.ceil(total / limit);
    
    return createResponse({
      services: enrichedServices,
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
    console.error('[API] Provider services list error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch services')
    );
  }
}

// ============================================================================
// POST - Create New Service
// ============================================================================

async function createHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, CreateServiceSchema);
  const walletAddress = request.headers.get('x-wallet-address');
  const db = getDatabase();
  
  await seedDatabase();
  
  try {
    if (!walletAddress) {
      return createErrorResponse(
        new APIException(ErrorCodes.UNAUTHORIZED, 'Wallet address required')
      );
    }
    
    // Get or create provider
    let provider = await db.findProviderByWallet(walletAddress);
    if (!provider) {
      provider = await db.createProvider({
        name: `Provider ${walletAddress.slice(0, 8)}`,
        walletAddress,
        verified: false,
        rating: 0,
        totalServices: 0,
        totalRevenue: '$0',
      });
    }
    
    // Create service (pending verification)
    const service = await db.createService({
      name: body.name,
      description: body.description,
      category: body.category,
      endpoint: body.endpoint,
      walletAddress,
      tags: body.tags || [],
      status: 'pending',
      verified: false,
      featured: false,
      pricing: body.pricing,
    });
    
    // Update provider service count
    await db.updateProvider(provider.id, {
      totalServices: provider.totalServices + 1,
    });
    
    return createResponse({
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        category: service.category,
        status: service.status,
        createdAt: service.createdAt instanceof Date 
          ? service.createdAt.toISOString() 
          : service.createdAt,
      },
      message: 'Service created and submitted for review.',
    }, {
      status: 201,
      meta: { requestId: ctx.requestId },
    });
  } catch (error) {
    console.error('[API] Service creation error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to create service')
    );
  }
}

export const GET = withHandler(listHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
  requireAuth: false,
});

export const POST = withHandler(createHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 20 },
  requireAuth: false,
});
