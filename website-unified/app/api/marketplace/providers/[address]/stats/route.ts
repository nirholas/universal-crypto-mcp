/**
 * Provider Stats API Route
 * GET /api/marketplace/providers/[address]/stats - Get provider statistics
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
  setCacheHeaders,
  ErrorCodes,
  APIException,
} from '@/lib/api';
import type { RequestContext } from '@/lib/api';
import { getDatabase, seedDatabase } from '@/lib/marketplace/database';

export const runtime = 'nodejs';

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  ctx: RequestContext
) {
  const pathParts = request.nextUrl.pathname.split('/');
  const address = pathParts[pathParts.length - 2]; // /providers/[address]/stats
  const db = getDatabase();
  
  // Ensure database is seeded
  await seedDatabase();
  
  try {
    // Find provider by wallet address
    const provider = await db.findProviderByWallet(address);
    
    if (!provider) {
      throw new NotFoundError('Provider', address);
    }
    
    // Get provider's services
    const { services } = await db.findServices({
      walletAddress: address,
      limit: 100,
    });
    
    // Get all subscriptions for provider's services
    const allSubscriptions = await Promise.all(
      services.map(async (service) => {
        const { subscriptions } = await db.findSubscriptions({
          serviceId: service.id,
          limit: 1000,
        });
        return subscriptions;
      })
    );
    const flatSubscriptions = allSubscriptions.flat();
    
    // Get all reviews for provider's services
    const allReviews = await Promise.all(
      services.map(async (service) => {
        const { reviews } = await db.findReviews({
          serviceId: service.id,
          limit: 1000,
        });
        return reviews;
      })
    );
    const flatReviews = allReviews.flat();
    
    // Calculate stats
    const activeServices = services.filter(s => s.status === 'active');
    const activeSubscriptions = flatSubscriptions.filter(s => s.active);
    
    // Calculate revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyRevenue = activeSubscriptions
      .filter(s => new Date(s.startDate) >= startOfMonth)
      .reduce((acc, sub) => {
        const price = parseFloat(sub.price?.replace(/[^0-9.]/g, '') || '0');
        return acc + price;
      }, 0);
    
    const totalRevenue = flatSubscriptions.reduce((acc, sub) => {
      const price = parseFloat(sub.price?.replace(/[^0-9.]/g, '') || '0');
      return acc + price;
    }, 0);
    
    // Calculate API calls from service stats
    let totalApiCalls = 0;
    for (const service of services) {
      const stats = await db.getServiceStats(service.id);
      totalApiCalls += stats.totalRequests;
    }
    
    // Calculate average rating
    const averageRating = flatReviews.length > 0
      ? flatReviews.reduce((sum, r) => sum + r.rating, 0) / flatReviews.length
      : 0;
    
    const stats = {
      totalServices: services.length,
      activeServices: activeServices.length,
      totalSubscribers: new Set(flatSubscriptions.map(s => s.subscriberWallet)).size,
      activeSubscriptions: activeSubscriptions.length,
      totalApiCalls,
      revenueThisMonth: monthlyRevenue,
      revenueAllTime: totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: flatReviews.length,
      
      // Provider info
      provider: {
        id: provider.id,
        name: provider.name,
        walletAddress: provider.walletAddress,
        verified: provider.verified,
        createdAt: provider.createdAt instanceof Date 
          ? provider.createdAt.toISOString() 
          : provider.createdAt,
      },
      
      // Services breakdown
      servicesByCategory: services.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      // Rating distribution
      ratingDistribution: {
        5: flatReviews.filter(r => r.rating === 5).length,
        4: flatReviews.filter(r => r.rating === 4).length,
        3: flatReviews.filter(r => r.rating === 3).length,
        2: flatReviews.filter(r => r.rating === 2).length,
        1: flatReviews.filter(r => r.rating === 1).length,
      },
    };
    
    const response = createResponse(stats);
    setCacheHeaders(response, { maxAge: 60, staleWhileRevalidate: 300 });
    return response;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[API] Provider stats error:', error);
    return createErrorResponse(
      new APIException(ErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Failed to fetch provider stats')
    );
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});
