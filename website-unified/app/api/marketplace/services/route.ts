/**
 * Marketplace Services API Route
 * GET /api/marketplace/services - Discover marketplace services
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
  parseQuery,
  setCacheHeaders,
  type RequestContext,
} from '@/lib/api';
import type { SearchFacets, ServiceCategory } from '@/lib/api';
import {
  searchServices,
  getFeaturedServices,
  getTrendingServices,
  type ServiceSearchParams,
} from '@/lib/marketplace/sdk';

export const runtime = 'nodejs'; // Use Node.js runtime for SDK access

// ============================================================================
// Query Schema
// ============================================================================

const ServicesQuerySchema = z.object({
  category: z.string().optional(),
  priceRange: z.enum(['free', 'low', 'medium', 'high']).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  verified: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  sort: z.enum(['popularity', 'price', 'rating', 'newest']).optional(),
});

type ServicesQuery = z.infer<typeof ServicesQuerySchema>;

function parseServicesParams(query: ServicesQuery) {
  return {
    ...query,
    verified: query.verified === 'true',
    featured: query.featured === 'true',
    page: query.page || 1,
    limit: query.limit || 20,
    sort: query.sort || 'popularity' as const,
  };
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform SDK service format to API response format
 */
function transformService(service: any) {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    category: service.category,
    provider: {
      id: service.providerWallet || service.walletAddress || 'unknown',
      name: service.providerName || 'Unknown Provider',
      address: service.walletAddress || '0x0000000000000000000000000000000000000000',
      verified: service.reputation?.badges?.includes('verified') || false,
      rating: service.reputation?.rating || 0,
      totalServices: 1,
    },
    pricing: service.pricing,
    stats: service.stats || {
      totalRequests: 0,
      totalRevenue: '$0',
      activeSubscribers: 0,
      averageResponseTime: 0,
      uptime: 100,
      last24hRequests: 0,
    },
    reputation: service.reputation || {
      rating: 0,
      totalReviews: 0,
      verifiedPayments: 0,
      badges: [],
      responseRate: 0,
    },
    tags: service.tags || [],
    featured: service.reputation?.badges?.includes('featured') || false,
    verified: service.reputation?.badges?.includes('verified') || false,
    createdAt: service.registeredAt?.toISOString() || new Date().toISOString(),
    updatedAt: service.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest, context: RequestContext) {
  const rawQuery = parseQuery(request, ServicesQuerySchema);
  const query = parseServicesParams(rawQuery);
  
  try {
    // Build search parameters from query - use SDK's ServiceSearchParams type
    const searchParams: ServiceSearchParams = {
      category: query.category as any, // SDK uses marketplace types
      minRating: query.rating,
      search: query.search,
      tags: query.tag ? [query.tag] : undefined,
      verified: query.verified,
      featured: query.featured,
      page: query.page,
      limit: query.limit,
      // Map 'price' to 'price-low' as the SDK uses more specific sort options
      sort: query.sort === 'price' ? 'price-low' : query.sort === 'popularity' ? 'popularity' : query.sort === 'rating' ? 'rating' : query.sort === 'newest' ? 'newest' : 'popularity',
    };
    
    // Map price range to maxPrice (numeric)
    if (query.priceRange) {
      switch (query.priceRange) {
        case 'free':
          searchParams.maxPrice = 0;
          break;
        case 'low':
          searchParams.maxPrice = 0.01;
          break;
        case 'medium':
          searchParams.maxPrice = 0.10;
          break;
        case 'high':
          // No max price filter for high tier
          break;
      }
    }
    
    // Execute real search using SDK
    const result = await searchServices(searchParams);
    
    // Transform services to API format
    const services = result.services.map(transformService);
    
    // Calculate facets from returned services
    const categoryCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();
    
    for (const service of services) {
      // Count categories
      const cat = service.category;
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
      
      // Count tags
      for (const tag of service.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    
    // Build facets response from service data
    const facets: SearchFacets = {
      categories: Array.from(categoryCounts.entries()).map(([category, count]) => ({
        name: category as ServiceCategory,
        count,
      })),
      priceRanges: [
        { range: 'free', count: services.filter(s => !s.pricing || s.pricing.payPerUse === undefined).length },
        { range: 'low', count: services.filter(s => s.pricing?.payPerUse !== undefined).length },
      ],
      ratings: [
        { rating: 5, count: services.filter(s => s.reputation.rating >= 4.5).length },
        { rating: 4, count: services.filter(s => s.reputation.rating >= 3.5 && s.reputation.rating < 4.5).length },
        { rating: 3, count: services.filter(s => s.reputation.rating >= 2.5 && s.reputation.rating < 3.5).length },
      ],
      tags: Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([tag, count]) => ({ tag, count })),
    };
    
    const response = createResponse({
      services,
      facets,
    }, {
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrevious: result.page > 1,
      },
    });
    
    // Cache for 1 minute
    setCacheHeaders(response, { maxAge: 60, staleWhileRevalidate: 120 });
    
    return response;
  } catch (error) {
    console.error('[API] Marketplace services error:', error);
    return createErrorResponse(error);
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
