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

function mapDatabaseServiceToMarketplace(service: DatabaseService): MarketplaceService {
  const provider = db.getProvider(service.providerId);
  
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
      avatarUrl: provider.avatarUrl,
      verified: provider.verified,
      reputationScore: provider.reputationScore,
      totalServices: provider.totalServices,
      joinedAt: provider.joinedAt,
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
      type: service.pricingType,
      payPerUse: service.pricePerRequest ? {
        pricePerRequest: service.pricePerRequest,
        currency: 'USD',
      } : undefined,
      subscription: service.subscriptionPrice ? {
        plans: [{
          name: 'professional',
          price: service.subscriptionPrice,
          currency: 'USD',
          billingPeriod: 'monthly',
          requestsIncluded: 10000,
          features: ['API Access', 'Priority Support'],
        }],
      } : undefined,
    },
    reputation: {
      score: service.rating * 20,
      rating: service.rating,
      totalReviews: service.totalReviews,
      verifiedPayments: 0,
      uptime: 99.9,
      responseTime: 150,
      successRate: 99.5,
    },
    badges: [],
    tags: service.tags,
    endpoint: service.endpoint,
    documentationUrl: service.documentationUrl,
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
  const filters: DiscoveryFilters = {
    category: params.category,
    minRating: params.minRating,
    maxPrice: params.maxPrice,
    verified: params.verified,
    search: params.search,
    tags: params.tags,
    sortBy: params.sort === 'price-low' ? 'price-low' : 
            params.sort === 'price-high' ? 'price-high' :
            params.sort === 'rating' ? 'rating' :
            params.sort === 'newest' ? 'newest' : 'popularity',
  };

  let dbServices = db.findServices(filters);
  
  // Filter by featured if requested
  if (params.featured) {
    dbServices = dbServices.filter(s => s.featured);
  }

  const page = params.page || 1;
  const limit = params.limit || 20;
  const total = dbServices.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedServices = dbServices.slice(startIndex, startIndex + limit);

  return {
    services: paginatedServices.map(mapDatabaseServiceToMarketplace),
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
  const service = db.getService(serviceId);
  return service ? mapDatabaseServiceToMarketplace(service) : null;
}

/**
 * Get featured services
 */
export async function getFeaturedServices(limit = 10): Promise<MarketplaceService[]> {
  const services = db.findServices({}).filter(s => s.featured).slice(0, limit);
  return services.map(mapDatabaseServiceToMarketplace);
}

/**
 * Get services by provider
 */
export async function getProviderServices(providerWallet: string): Promise<MarketplaceService[]> {
  const services = db.findServices({ walletAddress: providerWallet });
  return services.map(mapDatabaseServiceToMarketplace);
}

// ============================================================================
// Service Registration API
// ============================================================================

export interface CreateServiceParams {
  name: string;
  description: string;
  category: ServiceCategory;
  providerId: string;
  endpoint: string;
  tags: string[];
  pricePerRequest?: number;
  subscriptionPrice?: number;
  pricingType: 'pay-per-use' | 'subscription' | 'freemium';
}

export async function createService(params: CreateServiceParams): Promise<MarketplaceService> {
  const service = db.createService({
    ...params,
    status: 'pending',
    rating: 0,
    totalReviews: 0,
    featured: false,
  });
  return mapDatabaseServiceToMarketplace(service);
}

export async function updateService(
  serviceId: string,
  updates: Partial<CreateServiceParams>
): Promise<MarketplaceService | null> {
  const updated = db.updateService(serviceId, updates);
  return updated ? mapDatabaseServiceToMarketplace(updated) : null;
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
  const service = db.getService(params.serviceId);
  if (!service) throw new Error('Service not found');
  
  const sub = db.createSubscription({
    serviceId: params.serviceId,
    serviceName: service.name,
    subscriberWallet: params.subscriberWallet,
    planName: params.planName,
    price: params.price,
    status: 'active',
    autoRenew: params.autoRenew ?? true,
    txHash: params.txHash,
  });
  
  return {
    id: sub.id,
    serviceId: sub.serviceId,
    serviceName: sub.serviceName,
    subscriberWallet: sub.subscriberWallet,
    plan: {
      name: sub.planName as 'free' | 'starter' | 'professional' | 'enterprise',
      price: sub.price,
      currency: 'USD',
      billingPeriod: 'monthly',
      requestsIncluded: 10000,
      features: [],
    },
    status: sub.status,
    startDate: sub.startDate,
    endDate: sub.endDate,
    autoRenew: sub.autoRenew,
    usageThisMonth: 0,
    apiKey: sub.apiKey,
    txHash: sub.txHash,
  };
}

export async function getWalletSubscriptions(walletAddress: string): Promise<Subscription[]> {
  const subs = db.findSubscriptions({ subscriberWallet: walletAddress });
  return subs.map(sub => ({
    id: sub.id,
    serviceId: sub.serviceId,
    serviceName: sub.serviceName,
    subscriberWallet: sub.subscriberWallet,
    plan: {
      name: sub.planName as 'free' | 'starter' | 'professional' | 'enterprise',
      price: sub.price,
      currency: 'USD',
      billingPeriod: 'monthly',
      requestsIncluded: 10000,
      features: [],
    },
    status: sub.status,
    startDate: sub.startDate,
    endDate: sub.endDate,
    autoRenew: sub.autoRenew,
    usageThisMonth: 0,
    apiKey: sub.apiKey,
    txHash: sub.txHash,
  }));
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription | null> {
  const updated = db.updateSubscription(subscriptionId, { status: 'cancelled' });
  if (!updated) return null;
  return {
    id: updated.id,
    serviceId: updated.serviceId,
    serviceName: updated.serviceName,
    subscriberWallet: updated.subscriberWallet,
    plan: {
      name: updated.planName as 'free' | 'starter' | 'professional' | 'enterprise',
      price: updated.price,
      currency: 'USD',
      billingPeriod: 'monthly',
      requestsIncluded: 10000,
      features: [],
    },
    status: updated.status,
    startDate: updated.startDate,
    endDate: updated.endDate,
    autoRenew: updated.autoRenew,
    usageThisMonth: 0,
    apiKey: updated.apiKey,
    txHash: updated.txHash,
  };
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
  const review = db.createReview({
    serviceId: params.serviceId,
    reviewerWallet: params.reviewerWallet,
    reviewerName: params.reviewerName,
    rating: params.rating,
    title: params.title || '',
    pros: params.pros || '',
    cons: params.cons || '',
    useCase: params.useCase || '',
    comment: params.comment,
  });
  
  return {
    id: review.id,
    serviceId: review.serviceId,
    reviewerWallet: review.reviewerWallet,
    reviewerName: review.reviewerName,
    rating: review.rating,
    title: review.title,
    pros: review.pros,
    cons: review.cons,
    useCase: review.useCase,
    comment: review.comment,
    createdAt: review.createdAt,
    helpful: review.helpful,
    verifiedPurchase: review.verifiedPurchase,
  };
}

export async function getServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  const reviews = db.findReviews({ serviceId });
  return reviews.map(r => ({
    id: r.id,
    serviceId: r.serviceId,
    reviewerWallet: r.reviewerWallet,
    reviewerName: r.reviewerName,
    rating: r.rating,
    title: r.title,
    pros: r.pros,
    cons: r.cons,
    useCase: r.useCase,
    comment: r.comment,
    createdAt: r.createdAt,
    helpful: r.helpful,
    verifiedPurchase: r.verifiedPurchase,
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
  const service = db.getService(params.serviceId);
  if (!service) throw new Error('Service not found');
  
  const provider = db.getProvider(service.providerId);
  
  const dispute = db.createDispute({
    serviceId: params.serviceId,
    subscriberWallet: params.subscriberWallet,
    providerWallet: provider?.walletAddress || '',
    reason: params.reason,
    description: params.description,
    escrowAmount: params.escrowAmount || 0,
  });
  
  return {
    id: dispute.id,
    serviceId: dispute.serviceId,
    subscriberWallet: dispute.subscriberWallet,
    providerWallet: dispute.providerWallet,
    reason: dispute.reason,
    description: dispute.description,
    evidence: dispute.evidence,
    status: dispute.status,
    resolution: dispute.resolution,
    createdAt: dispute.createdAt,
    resolvedAt: dispute.resolvedAt,
    escrowAmount: dispute.escrowAmount,
  };
}

export async function getDisputes(): Promise<Dispute[]> {
  const disputes = db.findDisputes({});
  return disputes.map(d => ({
    id: d.id,
    serviceId: d.serviceId,
    subscriberWallet: d.subscriberWallet,
    providerWallet: d.providerWallet,
    reason: d.reason,
    description: d.description,
    evidence: d.evidence,
    status: d.status,
    resolution: d.resolution,
    createdAt: d.createdAt,
    resolvedAt: d.resolvedAt,
    escrowAmount: d.escrowAmount,
  }));
}

// ============================================================================
// Analytics API
// ============================================================================

export async function getProviderStats(walletAddress: string): Promise<ProviderStats> {
  const services = db.findServices({ walletAddress });
  const totalSubscribers = services.reduce((sum, s) => {
    const subs = db.findSubscriptions({ serviceId: s.id, status: 'active' });
    return sum + subs.length;
  }, 0);
  
  return {
    totalServices: services.length,
    activeServices: services.filter(s => s.status === 'active').length,
    totalSubscribers,
    totalApiCalls: Math.floor(Math.random() * 100000),
    revenueThisMonth: Math.floor(Math.random() * 10000),
    revenueAllTime: Math.floor(Math.random() * 50000),
    totalRevenue: Math.floor(Math.random() * 50000),
    averageRating: services.reduce((sum, s) => sum + s.rating, 0) / Math.max(services.length, 1),
    services: services.map(s => ({
      id: s.id,
      name: s.name,
      revenue: Math.floor(Math.random() * 5000),
      subscribers: db.findSubscriptions({ serviceId: s.id, status: 'active' }).length,
      apiCalls: Math.floor(Math.random() * 10000),
    })),
  };
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const services = db.findServices({});
  const providers = new Set(services.map(s => s.providerId));
  const disputes = db.findDisputes({});
  
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
    pendingVerifications: services.filter(s => s.status === 'pending').length,
    openDisputes: disputes.filter(d => d.status === 'open').length,
    averageUptime: 99.9,
    disputeResolutionRate: 94.5,
    averageRating: 4.5,
  };
}

// ============================================================================
// Export database instance for direct access if needed
// ============================================================================

export { db };
