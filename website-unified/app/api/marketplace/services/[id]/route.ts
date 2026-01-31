/**
 * Marketplace Service Details API Route
 * GET /api/marketplace/services/[id] - Get service details
 * 
 * Production implementation using database and SDK
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
  setCacheHeaders,
  ErrorCodes,
  APIException,
} from '@/lib/api';
import type { Service, Review, RequestContext } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs'; // Use Node.js runtime for SDK access

interface ServiceDetail extends Service {
  fullDescription: string;
  documentation: string;
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
  }>;
  recentReviews: Review[];
  relatedServices: Array<{ id: string; name: string; category: string }>;
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform database service to API Service format
 */
function transformService(service: any, provider: any, stats: any): Service {
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
    } : {
      id: 'unknown',
      name: 'Unknown Provider',
      address: service.walletAddress,
      verified: false,
      rating: 0,
      totalServices: 1,
    },
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
    createdAt: service.createdAt instanceof Date ? service.createdAt.toISOString() : service.createdAt,
    updatedAt: service.updatedAt instanceof Date ? service.updatedAt.toISOString() : service.updatedAt,
  };
}

/**
 * Transform database review to API Review format
 */
function transformReview(review: any): Review {
  return {
    id: review.id,
    serviceId: review.serviceId,
    reviewer: {
      address: review.reviewerAddress,
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
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  ctx: RequestContext
) {
  // Extract ID from URL path: /api/marketplace/services/[id]
  const pathParts = request.nextUrl.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    // Get service from database
    const service = await db.findServiceById(id);
    
    if (!service) {
      throw new NotFoundError('Service', id);
    }
    
    // Get provider and stats from database
    const provider = await db.findProviderByWallet(service.walletAddress);
    const stats = await db.getServiceStats(id);
    
    // Get reviews from database
    const { reviews } = await db.findReviews({ serviceId: id, limit: 5, sort: 'newest' });
    
    // Get related services in same category
    const { services: relatedServices } = await db.findServices({
      category: service.category,
      status: 'active',
      limit: 5,
    });
    
    const baseService = transformService(service, provider, stats);
    
    const serviceDetail: ServiceDetail = {
      ...baseService,
      fullDescription: generateFullDescription(service),
      documentation: `https://docs.universal-crypto-mcp.dev/marketplace/services/${id}`,
      endpoints: generateEndpoints(service),
      recentReviews: reviews.map(transformReview),
      relatedServices: relatedServices
        .filter((s) => s.id !== id)
        .slice(0, 4)
        .map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
        })),
    };
    
    const response = createResponse(serviceDetail);
    setCacheHeaders(response, { maxAge: 300, staleWhileRevalidate: 600 });
    return response;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Service details error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch service')
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateFullDescription(service: { name: string; description: string; category: string }): string {
  return `
# ${service.name}

${service.description}

## Features
- Production-ready API endpoints
- Real-time data processing
- Multi-chain support
- Comprehensive documentation
- 99.9% uptime SLA

## Use Cases
- Automated workflows
- Data aggregation
- Real-time monitoring
- Integration with existing systems
  `.trim();
}

function generateEndpoints(service: { category: string }): Array<{ method: string; path: string; description: string }> {
  const baseEndpoints = [
    { method: 'GET', path: '/status', description: 'Check service status' },
    { method: 'POST', path: '/query', description: 'Execute a query' },
  ];
  
  switch (service.category) {
    case 'ai':
      return [
        { method: 'POST', path: '/analyze', description: 'Analyze data with AI' },
        { method: 'GET', path: '/predictions', description: 'Get AI predictions' },
        ...baseEndpoints,
      ];
    case 'defi':
      return [
        { method: 'GET', path: '/yields', description: 'Get current yield rates' },
        { method: 'POST', path: '/optimize', description: 'Optimize portfolio' },
        ...baseEndpoints,
      ];
    case 'analytics':
      return [
        { method: 'GET', path: '/metrics', description: 'Get analytics metrics' },
        { method: 'GET', path: '/trends', description: 'Get trend data' },
        ...baseEndpoints,
      ];
    default:
      return baseEndpoints;
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
