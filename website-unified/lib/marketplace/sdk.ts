/**
 * Marketplace SDK Client
 * Production-grade client for interacting with the marketplace services
 * 
 * @author nich
 * @license Apache-2.0
 */

import {
  MarketplaceService,
  SubscriptionManager,
  DiscoveryService,
  type RegisteredService,
  type ServiceRegistration,
  type DiscoveryFilters,
  type SubscriptionStatus,
  type ServiceCategory,
  type AnalyticsData,
  type AnalyticsPeriod,
} from '@nirholas/universal-crypto-mcp-marketplace';

import { ReputationService, type Dispute, type Badge } from '@nirholas/universal-crypto-mcp-marketplace/reputation';

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
// Singleton SDK Instance
// ============================================================================

let marketplaceInstance: MarketplaceService | null = null;
let subscriptionInstance: SubscriptionManager | null = null;
let discoveryInstance: DiscoveryService | null = null;
let reputationInstance: ReputationService | null = null;

/**
 * Get or create the marketplace service instance
 */
export function getMarketplaceService(config?: Partial<MarketplaceSDKConfig>): MarketplaceService {
  if (!marketplaceInstance) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    marketplaceInstance = new MarketplaceService({
      chain: finalConfig.chain,
      contractAddress: finalConfig.contractAddress,
      tokenAddress: finalConfig.tokenAddress,
      rpcUrl: finalConfig.rpcUrl,
      privateKey: finalConfig.privateKey,
    });
  }
  return marketplaceInstance;
}

/**
 * Get or create the subscription manager instance
 */
export function getSubscriptionManager(config?: Partial<MarketplaceSDKConfig>): SubscriptionManager {
  if (!subscriptionInstance) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    subscriptionInstance = new SubscriptionManager(
      {
        chain: finalConfig.chain,
        contractAddress: finalConfig.contractAddress,
        tokenAddress: finalConfig.tokenAddress,
        rpcUrl: finalConfig.rpcUrl,
      },
      {
        onSubscriptionCreated: (sub) => console.log('[SDK] Subscription created:', sub.id),
        onSubscriptionCancelled: (sub) => console.log('[SDK] Subscription cancelled:', sub.id),
        onSubscriptionExpired: (sub) => console.log('[SDK] Subscription expired:', sub.id),
      }
    );
  }
  return subscriptionInstance;
}

/**
 * Get or create the discovery service instance
 */
export function getDiscoveryService(): DiscoveryService {
  if (!discoveryInstance) {
    discoveryInstance = new DiscoveryService({
      onSearch: (filters, results) => console.log('[SDK] Search performed:', { filters, resultCount: results.length }),
      onServiceViewed: (serviceId) => console.log('[SDK] Service viewed:', serviceId),
    });
  }
  return discoveryInstance;
}

/**
 * Get or create the reputation service instance
 */
export function getReputationService(): ReputationService {
  if (!reputationInstance) {
    reputationInstance = new ReputationService({
      onReviewSubmitted: (review) => console.log('[SDK] Review submitted:', review.id),
      onBadgeAwarded: (serviceId, badge) => console.log('[SDK] Badge awarded:', { serviceId, badge }),
      onDisputeCreated: (dispute) => console.log('[SDK] Dispute created:', dispute.id),
      onDisputeResolved: (dispute) => console.log('[SDK] Dispute resolved:', dispute.id),
    });
  }
  return reputationInstance;
}

// ============================================================================
// Service Discovery API
// ============================================================================

export interface ServiceSearchParams {
  category?: ServiceCategory;
  minRating?: number;
  maxPrice?: string;
  verified?: boolean;
  hasSubscription?: boolean;
  search?: string;
  tags?: string[];
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: 'popularity' | 'price' | 'rating' | 'newest';
}

export interface ServiceSearchResult {
  services: RegisteredService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: {
    categories: Array<{ name: ServiceCategory; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
    ratings: Array<{ rating: number; count: number }>;
  };
}

/**
 * Search for services with advanced filtering and pagination
 */
export async function searchServices(params: ServiceSearchParams): Promise<ServiceSearchResult> {
  const discovery = getDiscoveryService();
  const marketplace = getMarketplaceService();

  const filters: DiscoveryFilters = {
    category: params.category,
    minRating: params.minRating,
    maxPrice: params.maxPrice,
    verified: params.verified,
    hasSubscription: params.hasSubscription,
    search: params.search,
    tags: params.tags,
  };

  // Get all matching services
  let services = await discovery.search(filters);

  // Sort services
  switch (params.sort) {
    case 'price':
      services = services.sort((a, b) => {
        const priceA = parseFloat(a.pricing.payPerUse?.replace(/[^0-9.]/g, '') || '0');
        const priceB = parseFloat(b.pricing.payPerUse?.replace(/[^0-9.]/g, '') || '0');
        return priceA - priceB;
      });
      break;
    case 'rating':
      services = services.sort((a, b) => b.reputation.rating - a.reputation.rating);
      break;
    case 'newest':
      services = services.sort((a, b) => 
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
      );
      break;
    case 'popularity':
    default:
      services = services.sort((a, b) => b.stats.totalRequests - a.stats.totalRequests);
  }

  // Filter by featured if requested
  if (params.featured) {
    services = services.filter((s) => s.reputation.badges.includes('featured'));
  }

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const total = services.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedServices = services.slice(startIndex, startIndex + limit);

  // Calculate facets
  const allServices = await discovery.search({});
  const facets = {
    categories: calculateCategoryFacets(allServices),
    priceRanges: calculatePriceRangeFacets(allServices),
    ratings: calculateRatingFacets(allServices),
  };

  return {
    services: paginatedServices,
    total,
    page,
    limit,
    totalPages,
    facets,
  };
}

/**
 * Get a single service by ID
 */
export async function getService(
  serviceId: string,
  viewerWallet?: `0x${string}`
): Promise<RegisteredService | null> {
  const discovery = getDiscoveryService();
  const service = await discovery.getService(serviceId, viewerWallet);
  return service || null;
}

/**
 * Get featured services
 */
export async function getFeaturedServices(limit = 10): Promise<RegisteredService[]> {
  const discovery = getDiscoveryService();
  return discovery.getFeatured(limit);
}

/**
 * Get trending services
 */
export async function getTrendingServices(limit = 10) {
  const discovery = getDiscoveryService();
  return discovery.getTrending(limit);
}

/**
 * Get service recommendations for a user
 */
export async function getRecommendations(walletAddress: `0x${string}`, limit = 5) {
  const discovery = getDiscoveryService();
  return discovery.getRecommendations(walletAddress, limit);
}

// ============================================================================
// Service Registration API
// ============================================================================

/**
 * Register a new service in the marketplace
 */
export async function registerService(registration: ServiceRegistration): Promise<RegisteredService> {
  const marketplace = getMarketplaceService();
  const service = await marketplace.registerService(registration);
  
  // Also add to discovery index
  const discovery = getDiscoveryService();
  await discovery.registerService(service);
  
  return service;
}

/**
 * Update an existing service
 */
export async function updateService(
  serviceId: string,
  updates: Partial<ServiceRegistration>
): Promise<RegisteredService> {
  const marketplace = getMarketplaceService();
  const updated = await marketplace.updateService(serviceId, updates);
  
  // Update discovery index
  const discovery = getDiscoveryService();
  await discovery.registerService(updated);
  
  return updated;
}

/**
 * Get services owned by a provider
 */
export async function getProviderServices(providerWallet: `0x${string}`): Promise<RegisteredService[]> {
  const discovery = getDiscoveryService();
  const allServices = await discovery.search({});
  return allServices.filter((s) => s.walletAddress.toLowerCase() === providerWallet.toLowerCase());
}

// ============================================================================
// Subscription API
// ============================================================================

export interface CreateSubscriptionParams {
  serviceId: string;
  plan: 'monthly' | 'annually';
  subscriberWallet: `0x${string}`;
  txHash: `0x${string}`;
  autoRenew?: boolean;
}

/**
 * Create a new subscription
 */
export async function createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionStatus> {
  const subscriptions = getSubscriptionManager();
  const marketplace = getMarketplaceService();
  
  // Get service to determine price
  const service = await marketplace.getService(params.serviceId);
  if (!service) {
    throw new Error(`Service not found: ${params.serviceId}`);
  }
  
  const price = params.plan === 'monthly'
    ? service.pricing.subscription?.monthly || '$0'
    : service.pricing.subscription?.annually || '$0';
  
  return subscriptions.createSubscription({
    serviceId: params.serviceId,
    subscriberWallet: params.subscriberWallet,
    plan: params.plan,
    txHash: params.txHash,
    price,
    autoRenew: params.autoRenew,
  });
}

/**
 * Check if a user has an active subscription
 */
export async function isSubscriptionActive(
  serviceId: string,
  walletAddress: `0x${string}`
): Promise<boolean> {
  const subscriptions = getSubscriptionManager();
  return subscriptions.isActive(serviceId, walletAddress);
}

/**
 * Get subscription details
 */
export async function getSubscription(
  serviceId: string,
  walletAddress: `0x${string}`
): Promise<SubscriptionStatus | null> {
  const subscriptions = getSubscriptionManager();
  const sub = await subscriptions.getSubscription(serviceId, walletAddress);
  return sub || null;
}

/**
 * Get all subscriptions for a wallet
 */
export async function getWalletSubscriptions(
  walletAddress: `0x${string}`
): Promise<SubscriptionStatus[]> {
  const subscriptions = getSubscriptionManager();
  return subscriptions.getWalletSubscriptions(walletAddress);
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<SubscriptionStatus> {
  const subscriptions = getSubscriptionManager();
  return subscriptions.cancelSubscription(subscriptionId);
}

/**
 * Renew a subscription
 */
export async function renewSubscription(
  subscriptionId: string,
  txHash: `0x${string}`
): Promise<SubscriptionStatus> {
  const subscriptions = getSubscriptionManager();
  return subscriptions.renewSubscription(subscriptionId, txHash);
}

// ============================================================================
// Analytics API
// ============================================================================

/**
 * Get analytics for a service
 */
export async function getServiceAnalytics(
  serviceId: string,
  period: AnalyticsPeriod = 'month'
): Promise<AnalyticsData> {
  const marketplace = getMarketplaceService();
  return marketplace.getAnalytics(serviceId, period);
}

/**
 * Track API usage
 */
export async function trackUsage(data: {
  serviceId: string;
  endpoint: string;
  accessType: 'pay-per-use' | 'subscription' | 'credits' | 'free';
  responseTime: number;
  statusCode: number;
  userWallet?: `0x${string}`;
}): Promise<void> {
  const marketplace = getMarketplaceService();
  await marketplace.trackUsage(data);
}

// ============================================================================
// Reputation & Reviews API
// ============================================================================

export interface SubmitReviewParams {
  serviceId: string;
  reviewerWallet: `0x${string}`;
  rating: number;
  title?: string;
  comment: string;
  txHash?: `0x${string}`;
}

/**
 * Submit a review for a service
 */
export async function submitReview(params: SubmitReviewParams) {
  const reputation = getReputationService();
  return reputation.submitReview({
    serviceId: params.serviceId,
    reviewerWallet: params.reviewerWallet,
    rating: params.rating,
    comment: params.comment,
    txHash: params.txHash,
  });
}

/**
 * Get reviews for a service
 */
export async function getServiceReviews(serviceId: string, limit?: number) {
  const reputation = getReputationService();
  return reputation.getReviews(serviceId, limit);
}

/**
 * Get reputation for a service
 */
export async function getServiceReputation(serviceId: string) {
  const reputation = getReputationService();
  return reputation.getReputation(serviceId);
}

/**
 * Create a dispute
 */
export async function createDispute(
  serviceId: string,
  disputerWallet: `0x${string}`,
  reason: string
): Promise<Dispute> {
  const reputation = getReputationService();
  return reputation.createDispute(serviceId, disputerWallet, reason);
}

/**
 * Get disputes for a service
 */
export async function getServiceDisputes(serviceId: string): Promise<Dispute[]> {
  const reputation = getReputationService();
  return reputation.getDisputes(serviceId);
}

// ============================================================================
// Utility Functions
// ============================================================================

function calculateCategoryFacets(services: RegisteredService[]): Array<{ name: ServiceCategory; count: number }> {
  const counts = new Map<ServiceCategory, number>();
  for (const service of services) {
    counts.set(service.category, (counts.get(service.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function calculatePriceRangeFacets(services: RegisteredService[]): Array<{ range: string; count: number }> {
  const ranges = { free: 0, low: 0, medium: 0, high: 0 };
  
  for (const service of services) {
    const price = parseFloat(service.pricing.payPerUse?.replace(/[^0-9.]/g, '') || '0');
    if (price === 0) ranges.free++;
    else if (price < 0.01) ranges.low++;
    else if (price < 0.1) ranges.medium++;
    else ranges.high++;
  }
  
  return [
    { range: 'free', count: ranges.free },
    { range: 'low', count: ranges.low },
    { range: 'medium', count: ranges.medium },
    { range: 'high', count: ranges.high },
  ];
}

function calculateRatingFacets(services: RegisteredService[]): Array<{ rating: number; count: number }> {
  const counts = [0, 0, 0, 0, 0];
  for (const service of services) {
    const rating = Math.floor(service.reputation.rating);
    if (rating >= 1 && rating <= 5) {
      counts[rating - 1]++;
    }
  }
  return counts.map((count, index) => ({ rating: index + 1, count })).reverse();
}

// ============================================================================
// Export types
// ============================================================================

export type {
  RegisteredService,
  ServiceRegistration,
  DiscoveryFilters,
  SubscriptionStatus,
  ServiceCategory,
  AnalyticsData,
  AnalyticsPeriod,
  Dispute,
  Badge,
};
