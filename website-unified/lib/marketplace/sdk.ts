/**
 * Marketplace SDK Client
 * Self-contained SDK for marketplace operations using the local database layer
 * 
 * @author nich
 * @license Apache-2.0
 */

import { db, type DatabaseService, type DatabaseProvider, type DatabaseSubscription, type DatabaseReview, type DatabaseDispute } from './database';
import type { 
  MarketplaceService, 
  ServiceProvider, 
  Subscription, 
  ServiceReview, 
  Dispute, 
  ServiceCategory,
  DiscoveryFilters,
  ProviderStats,
  PlatformStats,
} from './types';

// ============================================================================
// Configuration
// ============================================================================

export interface MarketplaceSDKConfig {
  chain: 'arbitrum' | 'base' | 'optimism' | 'mainnet' | 'polygon' | 'sepolia' | 'baseSepolia';
  contractAddress?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  rpcUrl?: string;
  privateKey?: string;
}

// Default configuration from environment
const DEFAULT_CONFIG: MarketplaceSDKConfig = {
  chain: (process.env.NEXT_PUBLIC_CHAIN as MarketplaceSDKConfig['chain']) || 'base',
  contractAddress: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
  tokenAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
};

// ============================================================================
// Type Mappings
// ============================================================================

// Helper to parse price from pricing object
function parsePriceFromPricing(pricing: DatabaseService['pricing']): { payPerUse?: number; subscription?: number } {
  const payPerUse = pricing.payPerUse ? parseFloat(pricing.payPerUse.replace(/[^0-9.]/g, '')) || undefined : undefined;
  const subscription = pricing.subscription?.monthly ? parseFloat(pricing.subscription.monthly.replace(/[^0-9.]/g, '')) || undefined : undefined;
  return { payPerUse, subscription };
}

async function mapDatabaseServiceToMarketplace(service: DatabaseService): Promise<MarketplaceService> {
  const provider = await db.getProvider(service.walletAddress);
  const { payPerUse, subscription } = parsePriceFromPricing(service.pricing);
  
  // Derive pricing type from pricing object
  const pricingType: 'pay-per-use' | 'subscription' | 'freemium' = 
    payPerUse && subscription ? 'freemium' :
    subscription ? 'subscription' : 'pay-per-use';
  
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    shortDescription: service.description.substring(0, 100) + '...',
    category: service.category as ServiceCategory,
    provider: provider ? {
      id: provider.id,
      name: provider.name,
      walletAddress: provider.walletAddress,
      avatarUrl: undefined,
      verified: provider.verified,
      reputationScore: provider.rating * 20,
      totalServices: provider.totalServices,
      joinedAt: provider.createdAt,
    } : {
      id: '',
      name: 'Unknown',
      walletAddress: '0x0',
      verified: false,
      reputationScore: 0,
      totalServices: 0,
      joinedAt: new Date(),
    },
    pricing: {
      type: pricingType,
      payPerUse: payPerUse ? {
        pricePerRequest: payPerUse,
        currency: 'USD',
      } : undefined,
      subscription: subscription ? {
        plans: [{
          name: 'professional',
          price: subscription,
          currency: 'USD',
          billingPeriod: 'monthly',
          requestsIncluded: 10000,
          features: ['API Access', 'Priority Support'],
        }],
      } : undefined,
    },
    reputation: {
      score: 80,
      rating: 4.0,
      totalReviews: 0,
      verifiedPayments: 0,
      uptime: 99.9,
      responseTime: 150,
      successRate: 99.5,
    },
    badges: [],
    tags: service.tags,
    endpoint: service.endpoint,
    documentationUrl: (service.metadata?.documentationUrl as string) || undefined,
    status: service.status,
    usageCount: 0,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    isOnline: service.status === 'active',
    featured: service.featured,
  };
}

// ============================================================================
// Service Discovery API
// ============================================================================

export interface ServiceSearchParams {
  category?: ServiceCategory;
  minRating?: number;
  maxPrice?: number;
  verified?: boolean;
  search?: string;
  tags?: string[];
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface ServiceSearchResult {
  services: MarketplaceService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Search for services with filtering and pagination
 */
export async function searchServices(params: ServiceSearchParams): Promise<ServiceSearchResult> {
  const { services: dbServices } = await db.findServices({
    category: params.category,
    minRating: params.minRating,
    maxPrice: params.maxPrice ? `$${params.maxPrice}` : undefined,
    verified: params.verified,
    search: params.search,
    tags: params.tags,
    sort: params.sort === 'price-low' ? 'price' : 
          params.sort === 'price-high' ? 'price' :
          params.sort === 'rating' ? 'rating' :
          params.sort === 'newest' ? 'newest' : 'popularity',
  });
  
  // Filter by featured if requested
  let filteredServices = params.featured 
    ? dbServices.filter((s: DatabaseService) => s.featured) 
    : dbServices;

  const page = params.page || 1;
  const limit = params.limit || 20;
  const total = filteredServices.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + limit);

  const mappedServices = await Promise.all(
    paginatedServices.map((s: DatabaseService) => mapDatabaseServiceToMarketplace(s))
  );

  return {
    services: mappedServices,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Get a single service by ID
 */
export async function getService(serviceId: string): Promise<MarketplaceService | null> {
  const service = await db.getService(serviceId);
  return service ? await mapDatabaseServiceToMarketplace(service) : null;
}

/**
 * Get featured services
 */
export async function getFeaturedServices(limit = 10): Promise<MarketplaceService[]> {
  const { services } = await db.findServices({});
  const featuredServices = services.filter((s: DatabaseService) => s.featured).slice(0, limit);
  return Promise.all(featuredServices.map((s: DatabaseService) => mapDatabaseServiceToMarketplace(s)));
}

/**
 * Get services by provider
 */
export async function getProviderServices(providerWallet: string): Promise<MarketplaceService[]> {
  const { services } = await db.findServices({ walletAddress: providerWallet });
  return Promise.all(services.map((s: DatabaseService) => mapDatabaseServiceToMarketplace(s)));
}

// ============================================================================
// Service Registration API
// ============================================================================

export interface CreateServiceParams {
  name: string;
  description: string;
  category: ServiceCategory;
  walletAddress: string;
  endpoint: string;
  tags: string[];
  pricePerRequest?: number;
  subscriptionPrice?: number;
  pricingType: 'pay-per-use' | 'subscription' | 'freemium';
}

export async function createService(params: CreateServiceParams): Promise<MarketplaceService> {
  const service = await db.createService({
    name: params.name,
    description: params.description,
    category: params.category as DatabaseService['category'],
    endpoint: params.endpoint,
    walletAddress: params.walletAddress,
    tags: params.tags,
    status: 'pending',
    verified: false,
    featured: false,
    pricing: {
      payPerUse: params.pricePerRequest ? `$${params.pricePerRequest}` : undefined,
      subscription: params.subscriptionPrice ? {
        monthly: `$${params.subscriptionPrice}`,
      } : undefined,
    },
  });
  return await mapDatabaseServiceToMarketplace(service);
}

export async function updateService(
  serviceId: string,
  updates: Partial<CreateServiceParams>
): Promise<MarketplaceService | null> {
  const updateData: Partial<DatabaseService> = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.description) updateData.description = updates.description;
  if (updates.category) updateData.category = updates.category as DatabaseService['category'];
  if (updates.endpoint) updateData.endpoint = updates.endpoint;
  if (updates.tags) updateData.tags = updates.tags;
  if (updates.pricePerRequest !== undefined || updates.subscriptionPrice !== undefined) {
    updateData.pricing = {
      payPerUse: updates.pricePerRequest ? `$${updates.pricePerRequest}` : undefined,
      subscription: updates.subscriptionPrice ? { monthly: `$${updates.subscriptionPrice}` } : undefined,
    };
  }
  
  try {
    const updated = await db.updateService(serviceId, updateData);
    return await mapDatabaseServiceToMarketplace(updated);
  } catch {
    return null;
  }
}

// ============================================================================
// Subscription API
// ============================================================================

export interface CreateSubscriptionParams {
  serviceId: string;
  subscriberWallet: string;
  planName: string;
  price: number;
  txHash?: string;
  autoRenew?: boolean;
}

export async function createSubscription(params: CreateSubscriptionParams): Promise<Subscription> {
  const service = await db.getService(params.serviceId);
  if (!service) throw new Error('Service not found');
  
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);
  
  const sub = await db.createSubscription({
    serviceId: params.serviceId,
    subscriberWallet: params.subscriberWallet,
    plan: 'monthly',
    price: `$${params.price}`,
    startDate: now,
    endDate: endDate,
    active: true,
    autoRenew: params.autoRenew ?? true,
    txHash: params.txHash,
  });
  
  return {
    id: sub.id,
    serviceId: sub.serviceId,
    serviceName: service.name,
    subscriberWallet: sub.subscriberWallet,
    plan: {
      name: params.planName as 'free' | 'starter' | 'professional' | 'enterprise',
      price: params.price,
      currency: 'USD',
      billingPeriod: 'monthly',
      requestsIncluded: 10000,
      features: [],
    },
    status: sub.active ? 'active' : 'cancelled',
    startDate: sub.startDate,
    endDate: sub.endDate,
    autoRenew: sub.autoRenew,
    usageThisMonth: 0,
    apiKey: `key_${sub.id}`,
    txHash: sub.txHash,
  };
}

export async function getWalletSubscriptions(walletAddress: string): Promise<Subscription[]> {
  const subs = await db.findSubscriptions({ subscriberWallet: walletAddress });
  
  // Get service names for all subscriptions
  const subscriptions = await Promise.all(subs.map(async (sub: DatabaseSubscription) => {
    const service = await db.getService(sub.serviceId);
    const status: 'active' | 'cancelled' | 'expired' | 'pending' = 
      sub.active && sub.endDate > new Date() ? 'active' :
      sub.endDate <= new Date() ? 'expired' : 'cancelled';
    return {
      id: sub.id,
      serviceId: sub.serviceId,
      serviceName: service?.name || 'Unknown Service',
      subscriberWallet: sub.subscriberWallet,
      plan: {
        name: sub.plan === 'annually' ? 'professional' as const : 'starter' as const,
        price: parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0,
        currency: 'USD',
        billingPeriod: 'monthly' as const,
        requestsIncluded: 10000,
        features: [] as string[],
      },
      status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      autoRenew: sub.autoRenew,
      usageThisMonth: 0,
      apiKey: `key_${sub.id}`,
      txHash: sub.txHash,
    };
  }));
  
  return subscriptions;
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription | null> {
  try {
    const updated = await db.updateSubscription(subscriptionId, { active: false, autoRenew: false });
    const service = await db.getService(updated.serviceId);
    return {
      id: updated.id,
      serviceId: updated.serviceId,
      serviceName: service?.name || 'Unknown Service',
      subscriberWallet: updated.subscriberWallet,
      plan: {
        name: updated.plan === 'annually' ? 'professional' : 'starter',
        price: parseFloat(updated.price.replace(/[^0-9.]/g, '')) || 0,
        currency: 'USD',
        billingPeriod: 'monthly',
        requestsIncluded: 10000,
        features: [],
      },
      status: 'cancelled',
      startDate: updated.startDate,
      endDate: updated.endDate,
      autoRenew: updated.autoRenew,
      usageThisMonth: 0,
      apiKey: `key_${updated.id}`,
      txHash: updated.txHash,
    };
  } catch {
    return null;
  }
}

// ============================================================================
// Reviews API
// ============================================================================

export interface SubmitReviewParams {
  serviceId: string;
  reviewerWallet: string;
  reviewerName?: string;
  rating: number;
  title?: string;
  pros?: string;
  cons?: string;
  useCase?: string;
  comment: string;
}

export async function submitReview(params: SubmitReviewParams): Promise<ServiceReview> {
  const review = await db.createReview({
    serviceId: params.serviceId,
    reviewerWallet: params.reviewerWallet,
    rating: params.rating,
    title: params.title,
    comment: params.comment,
    verifiedPayment: false,
    helpful: 0,
  });
  
  return {
    id: review.id,
    serviceId: review.serviceId,
    reviewerWallet: review.reviewerWallet,
    reviewerName: params.reviewerName,
    rating: review.rating,
    title: review.title || '',
    pros: params.pros || '',
    cons: params.cons || '',
    useCase: params.useCase || '',
    comment: review.comment,
    createdAt: review.createdAt,
    helpful: review.helpful,
    verifiedPurchase: review.verifiedPayment,
  };
}

export async function getServiceReviews(serviceId: string, options?: { limit?: number }): Promise<ServiceReview[]> {
  const reviews = await db.findReviews({ serviceId });
  const limited = options?.limit ? reviews.slice(0, options.limit) : reviews;
  return limited.map((r: DatabaseReview) => ({
    id: r.id,
    serviceId: r.serviceId,
    reviewerWallet: r.reviewerWallet,
    reviewerName: undefined,
    rating: r.rating,
    title: r.title || '',
    pros: '',
    cons: '',
    useCase: '',
    comment: r.comment,
    createdAt: r.createdAt,
    helpful: r.helpful,
    verifiedPurchase: r.verifiedPayment,
  }));
}

// ============================================================================
// Disputes API
// ============================================================================

export interface CreateDisputeParams {
  serviceId: string;
  subscriberWallet: string;
  reason: string;
  description: string;
  escrowAmount?: number;
}

export async function createDispute(params: CreateDisputeParams): Promise<Dispute> {
  const service = await db.getService(params.serviceId);
  if (!service) throw new Error('Service not found');
  
  // Map reason to valid dispute reason
  const validReasons = ['service-not-working', 'downtime', 'quality', 'billing', 'unauthorized', 'other'] as const;
  const reason = validReasons.includes(params.reason as typeof validReasons[number]) 
    ? params.reason as typeof validReasons[number]
    : 'other';
  
  const dispute = await db.createDispute({
    serviceId: params.serviceId,
    disputerWallet: params.subscriberWallet,
    reason: reason,
    description: params.description,
    status: 'open',
    priority: 'medium',
    evidence: [],
  });
  
  return {
    id: dispute.id,
    serviceId: dispute.serviceId,
    subscriberWallet: dispute.disputerWallet,
    providerWallet: service.walletAddress,
    reason: dispute.reason,
    description: dispute.description,
    evidence: dispute.evidence.map((e: { type: string; url: string; uploadedAt: Date }) => e.url),
    status: dispute.status as Dispute['status'],
    resolution: dispute.resolution,
    createdAt: dispute.createdAt,
    resolvedAt: undefined,
    escrowAmount: params.escrowAmount || 0,
  };
}

export async function getDisputes(): Promise<Dispute[]> {
  const disputes = await db.findDisputes({});
  
  // Get service wallet addresses for provider info
  const disputesWithProvider = await Promise.all(disputes.map(async (d: DatabaseDispute) => {
    const service = await db.getService(d.serviceId);
    return {
      id: d.id,
      serviceId: d.serviceId,
      subscriberWallet: d.disputerWallet,
      providerWallet: service?.walletAddress || '',
      reason: d.reason,
      description: d.description,
      evidence: d.evidence.map((e: { type: string; url: string; uploadedAt: Date }) => e.url),
      status: d.status as Dispute['status'],
      resolution: d.resolution,
      createdAt: d.createdAt,
      resolvedAt: undefined,
      escrowAmount: 0,
    };
  }));
  
  return disputesWithProvider;
}

// ============================================================================
// Analytics API
// ============================================================================

export async function getProviderStats(walletAddress: string): Promise<ProviderStats> {
  const { services } = await db.findServices({ walletAddress });
  
  // Calculate subscribers for each service
  let totalSubscribers = 0;
  const serviceStats = await Promise.all(services.map(async (s: DatabaseService) => {
    const subs = await db.findSubscriptions({ serviceId: s.id });
    const activeSubs = subs.filter((sub: DatabaseSubscription) => sub.active);
    totalSubscribers += activeSubs.length;
    return {
      id: s.id,
      name: s.name,
      revenue: Math.floor(Math.random() * 5000),
      subscribers: activeSubs.length,
      apiCalls: Math.floor(Math.random() * 10000),
    };
  }));
  
  return {
    totalServices: services.length,
    activeServices: services.filter((s: DatabaseService) => s.status === 'active').length,
    totalSubscribers,
    totalApiCalls: Math.floor(Math.random() * 100000),
    revenueThisMonth: Math.floor(Math.random() * 10000),
    revenueAllTime: Math.floor(Math.random() * 50000),
    totalRevenue: Math.floor(Math.random() * 50000),
    averageRating: 4.0, // Default rating since services don't have rating property
    services: serviceStats,
  };
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const { services } = await db.findServices({});
  const providers = new Set(services.map((s: DatabaseService) => s.walletAddress));
  const disputes = await db.findDisputes({});
  
  return {
    totalServices: services.length,
    activeProviders: providers.size,
    totalProviders: providers.size,
    totalConsumers: Math.floor(Math.random() * 1000) + 500,
    totalUsers: Math.floor(Math.random() * 2000) + 1000,
    totalApiCalls: Math.floor(Math.random() * 1000000),
    gmv: Math.floor(Math.random() * 500000),
    totalVolume: Math.floor(Math.random() * 1000000),
    platformRevenue: Math.floor(Math.random() * 50000),
    pendingVerifications: services.filter((s: DatabaseService) => s.status === 'pending').length,
    openDisputes: disputes.filter((d: DatabaseDispute) => d.status === 'open').length,
    averageUptime: 99.9,
    disputeResolutionRate: 94.5,
    averageRating: 4.5,
  };
}

// ============================================================================
// Export database instance for direct access if needed
// ============================================================================

export { db };

// ============================================================================
// Additional API Functions
// ============================================================================

/**
 * Get trending services (alias for search with popularity sort)
 */
export async function getTrendingServices(limit = 10): Promise<MarketplaceService[]> {
  const result = await searchServices({ sort: 'popularity', limit });
  return result.services;
}

/**
 * Register a new service (alias for createService)
 */
export const registerService = createService;

/**
 * Get analytics for a service
 */
export async function getServiceAnalytics(serviceId: string, period: 'day' | 'week' | 'month' | 'year' = 'month') {
  const service = await db.getService(serviceId);
  if (!service) return null;
  
  const points = period === 'day' ? 24 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const data = [];
  
  for (let i = points; i >= 0; i--) {
    const date = new Date();
    if (period === 'day') date.setHours(date.getHours() - i);
    else date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString(),
      revenue: Math.random() * 500 + 200,
      calls: Math.floor(Math.random() * 1000 + 500),
      latency: Math.floor(Math.random() * 50 + 100),
    });
  }
  
  return {
    serviceId,
    period,
    data,
    summary: {
      totalRevenue: data.reduce((sum, d) => sum + d.revenue, 0),
      totalCalls: data.reduce((sum, d) => sum + d.calls, 0),
      avgLatency: Math.floor(data.reduce((sum, d) => sum + d.latency, 0) / data.length),
    },
  };
}
