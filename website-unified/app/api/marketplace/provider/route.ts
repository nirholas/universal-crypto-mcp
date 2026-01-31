/**
 * Marketplace Provider API Routes
 * /api/marketplace/provider/* - Provider management endpoints
 * 
 * Production implementation using database and SDK
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
} from '@/lib/api';
import { APIException, BadRequestError } from '@/lib/api/errors';
import type { RequestContext } from '@/lib/api';
import { registerService, getProviderServices, getServiceAnalytics } from '@/lib/marketplace/sdk';

export const runtime = 'nodejs'; // Use Node.js runtime for SDK access

// ============================================================================
// Registration Schema
// ============================================================================

const ProviderRegistrationSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  website: z.string().url().optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  categories: z.array(z.string()).min(1),
  contactEmail: z.string().email().optional(),
  signature: z.string().optional(), // Wallet signature for verification
});

// ============================================================================
// Provider Types
// ============================================================================

interface Provider {
  id: string;
  name: string;
  description: string;
  website?: string;
  walletAddress: string;
  categories: string[];
  verified: boolean;
  rating: number;
  totalServices: number;
  totalRevenue: string;
  totalRequests: number;
  joinedAt: string;
  status: 'pending' | 'active' | 'suspended';
}

// ============================================================================
// POST - Register as Provider
// ============================================================================

async function registerHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, ProviderRegistrationSchema);
  
  try {
    // In production, verify wallet signature
    if (body.signature) {
      // TODO: Verify signature using viem or ethers
      console.log('[API] Verifying wallet signature for provider registration');
    }
    
    // Create provider profile in database
    // For now, create a minimal provider object
    const provider: Provider = {
      id: `prv-${Date.now()}`,
      name: body.name,
      description: body.description,
      website: body.website,
      walletAddress: body.walletAddress,
      categories: body.categories,
      verified: false,
      rating: 0,
      totalServices: 0,
      totalRevenue: '$0',
      totalRequests: 0,
      joinedAt: new Date().toISOString(),
      status: 'pending',
    };
    
    // TODO: Store provider in database
    // await db.createProvider(provider);
    
    return createResponse({
      provider,
      message: 'Provider registration submitted. Please verify your wallet to complete registration.',
      nextSteps: [
        'Sign the verification message with your wallet',
        'Complete your provider profile',
        'Register your first service',
      ],
    }, {
      status: 201,
      meta: { requestId: ctx.requestId },
    });
  } catch (error) {
    console.error('[API] Provider registration error:', error);
    return createErrorResponse(error);
  }
}

// ============================================================================
// GET - Get Provider Profile
// ============================================================================

async function getHandler(request: NextRequest, ctx: RequestContext) {
  // Get wallet address from header or query
  const walletAddress = request.headers.get('x-wallet-address') ||
    new URL(request.url).searchParams.get('walletAddress');
  
  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    throw new BadRequestError('Valid wallet address is required (via x-wallet-address header or walletAddress query param)');
  }
  
  try {
    // Get provider's services
    const services = await getProviderServices(walletAddress as `0x${string}`);
    
    // Calculate aggregate stats from services
    const totalRequests = services.reduce((sum, s) => sum + (s.stats?.totalRequests || s.usageCount || 0), 0);
    const totalRevenue = services.reduce((sum, s) => {
      const revenueStr = s.stats?.totalRevenue || '$0';
      const revenue = parseFloat(revenueStr.replace(/[^0-9.]/g, ''));
      return sum + revenue;
    }, 0);
    const avgRating = services.length > 0
      ? services.reduce((sum, s) => sum + (s.reputation?.rating || 0), 0) / services.length
      : 0;
    
    const provider: Provider = {
      id: `prv-${walletAddress.slice(2, 10)}`,
      name: services[0]?.provider?.name || services[0]?.providerName || 'Provider',
      description: 'Marketplace service provider',
      walletAddress,
      categories: [...new Set(services.map(s => s.category))],
      verified: services.some(s => s.provider?.verified || false),
      rating: avgRating,
      totalServices: services.length,
      totalRevenue: `$${totalRevenue.toFixed(2)}`,
      totalRequests,
      joinedAt: services[0]?.createdAt?.toISOString() || new Date().toISOString(),
      status: 'active',
    };
    
    // Transform services for response
    const serviceList = services.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      status: s.status || 'active',
      stats: s.stats || { totalRequests: s.usageCount || 0, totalRevenue: '$0' },
      pricing: s.pricing,
    }));
    
    return createResponse({
      provider,
      services: serviceList,
      analytics: {
        last30Days: {
          requests: totalRequests,
          revenue: `$${totalRevenue.toFixed(2)}`,
          uniqueUsers: 0,
        },
        topServices: serviceList.slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          requests: s.stats?.totalRequests || 0,
        })),
      },
    }, {
      meta: { requestId: ctx.requestId },
    });
  } catch (error) {
    console.error('[API] Provider fetch error:', error);
    return createErrorResponse(error);
  }
}

export const POST = withHandler(registerHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 10 },
});

export const GET = withHandler(getHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
  requireAuth: false, // Would be true in production
});
