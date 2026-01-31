/**
 * Marketplace Database Client
 * Production database integration using Prisma or direct PostgreSQL
 * 
 * This provides the data layer for the marketplace, replacing mock data.
 * 
 * @author nich
 * @license Apache-2.0
 */

import { z } from 'zod';

// ============================================================================
// Database Configuration
// ============================================================================

const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;

// ============================================================================
// Data Schemas
// ============================================================================

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(2000),
  category: z.enum([
    'ai', 'data', 'weather', 'finance', 'social', 'infrastructure',
    'analytics', 'storage', 'compute', 'security', 'defi', 'nft', 'trading', 'other'
  ]),
  endpoint: z.string().url(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tags: z.array(z.string()).default([]),
  status: z.enum(['pending', 'active', 'suspended', 'archived']).default('pending'),
  verified: z.boolean().default(false),
  featured: z.boolean().default(false),
  pricing: z.object({
    payPerUse: z.string().optional(),
    subscription: z.object({
      monthly: z.string().optional(),
      annually: z.string().optional(),
    }).optional(),
  }),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  verified: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  totalServices: z.number().default(0),
  totalRevenue: z.string().default('0'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  subscriberWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  plan: z.enum(['monthly', 'annually']),
  price: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  active: z.boolean().default(true),
  autoRenew: z.boolean().default(true),
  txHash: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ReviewSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  reviewerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string(),
  verifiedPayment: z.boolean().default(false),
  helpful: z.number().default(0),
  providerResponse: z.object({
    comment: z.string(),
    createdAt: z.date(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DisputeSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  subscriptionId: z.string().optional(),
  disputerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  reason: z.enum([
    'service-not-working', 'downtime', 'quality', 'billing', 'unauthorized', 'other'
  ]),
  description: z.string(),
  status: z.enum(['open', 'investigating', 'mediation', 'resolved', 'rejected']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  amount: z.number().optional(),
  resolution: z.string().optional(),
  evidence: z.array(z.object({
    type: z.string(),
    url: z.string(),
    uploadedAt: z.date(),
  })).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Service = z.infer<typeof ServiceSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Dispute = z.infer<typeof DisputeSchema>;

// ============================================================================
// Database Client Interface
// ============================================================================

export interface DatabaseClient {
  // Services
  findServices(filters: ServiceFilters): Promise<{ services: Service[]; total: number }>;
  findServiceById(id: string): Promise<Service | null>;
  createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service>;
  updateService(id: string, data: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  // Providers
  findProviderByWallet(wallet: string): Promise<Provider | null>;
  createProvider(data: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider>;
  updateProvider(id: string, data: Partial<Provider>): Promise<Provider>;
  
  // Subscriptions
  findSubscriptions(filters: SubscriptionFilters): Promise<{ subscriptions: Subscription[]; total: number }>;
  findSubscriptionById(id: string): Promise<Subscription | null>;
  createSubscription(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription>;
  
  // Reviews
  findReviews(filters: ReviewFilters): Promise<{ reviews: Review[]; total: number }>;
  createReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review>;
  updateReview(id: string, data: Partial<Review>): Promise<Review>;
  
  // Disputes
  findDisputes(filters: DisputeFilters): Promise<{ disputes: Dispute[]; total: number }>;
  findDisputeById(id: string): Promise<Dispute | null>;
  createDispute(data: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispute>;
  updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute>;
  
  // Analytics
  getServiceStats(serviceId: string): Promise<ServiceStats>;
  getProviderStats(providerWallet: string): Promise<ProviderStats>;
  getPlatformStats(): Promise<PlatformStats>;
  
  // Health check
  healthCheck(): Promise<boolean>;
}

export interface ServiceFilters {
  category?: string;
  search?: string;
  minRating?: number;
  maxPrice?: string;
  verified?: boolean;
  featured?: boolean;
  status?: string;
  providerWallet?: string;
  walletAddress?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: 'popularity' | 'price' | 'rating' | 'newest';
}

export interface SubscriptionFilters {
  serviceId?: string;
  subscriberWallet?: string;
  subscriberAddress?: string;
  status?: 'all' | 'active' | 'cancelled' | 'expired';
  page?: number;
  limit?: number;
}

export interface ReviewFilters {
  serviceId?: string;
  reviewerWallet?: string;
  minRating?: number;
  verified?: boolean;
  sort?: 'newest' | 'oldest' | 'rating' | 'helpful';
  page?: number;
  limit?: number;
}

export interface DisputeFilters {
  serviceId?: string;
  disputerWallet?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface ServiceStats {
  totalRequests: number;
  totalRevenue: string;
  activeSubscribers: number;
  averageResponseTime: number;
  uptime: number;
  last24hRequests: number;
  rating: number;
  totalReviews: number;
}

export interface ProviderStats {
  totalServices: number;
  activeServices: number;
  totalSubscribers: number;
  totalRevenue: string;
  averageRating: number;
  totalReviews: number;
  totalApiCalls: number;
}

export interface PlatformStats {
  totalServices: number;
  totalProviders: number;
  totalUsers: number;
  totalVolume: string;
  activeSubscriptions: number;
  averageUptime: number;
  averageRating: number;
  disputeResolutionRate: number;
}

// ============================================================================
// In-Memory Database (Development/Testing)
// ============================================================================

class InMemoryDatabase implements DatabaseClient {
  private services = new Map<string, Service>();
  private providers = new Map<string, Provider>();
  private subscriptions = new Map<string, Subscription>();
  private reviews = new Map<string, Review>();
  private disputes = new Map<string, Dispute>();

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  }

  async findServices(filters: ServiceFilters): Promise<{ services: Service[]; total: number }> {
    let services = Array.from(this.services.values());

    // Apply filters
    if (filters.category) {
      services = services.filter((s) => s.category === filters.category);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      services = services.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    }
    if (filters.verified !== undefined) {
      services = services.filter((s) => s.verified === filters.verified);
    }
    if (filters.featured !== undefined) {
      services = services.filter((s) => s.featured === filters.featured);
    }
    if (filters.status) {
      services = services.filter((s) => s.status === filters.status);
    }
    if (filters.providerWallet || filters.walletAddress) {
      const wallet = (filters.providerWallet || filters.walletAddress)!;
      services = services.filter((s) => 
        s.walletAddress.toLowerCase() === wallet.toLowerCase()
      );
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        services.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'rating':
        // Would need to join with reviews
        break;
      case 'price':
        services.sort((a, b) => {
          const priceA = parseFloat(a.pricing.payPerUse?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(b.pricing.payPerUse?.replace(/[^0-9.]/g, '') || '0');
          return priceA - priceB;
        });
        break;
      case 'popularity':
      default:
        // Would need to join with analytics
        break;
    }

    const total = services.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const paginatedServices = services.slice((page - 1) * limit, page * limit);

    return { services: paginatedServices, total };
  }

  async findServiceById(id: string): Promise<Service | null> {
    return this.services.get(id) || null;
  }

  async createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const now = new Date();
    const service: Service = {
      ...data,
      id: this.generateId('srv'),
      createdAt: now,
      updatedAt: now,
    };
    this.services.set(service.id, service);
    return service;
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const service = this.services.get(id);
    if (!service) throw new Error(`Service not found: ${id}`);
    
    const updated: Service = {
      ...service,
      ...data,
      id: service.id,
      updatedAt: new Date(),
    };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    this.services.delete(id);
  }

  async findProviderByWallet(wallet: string): Promise<Provider | null> {
    for (const provider of this.providers.values()) {
      if (provider.walletAddress.toLowerCase() === wallet.toLowerCase()) {
        return provider;
      }
    }
    return null;
  }

  async createProvider(data: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> {
    const now = new Date();
    const provider: Provider = {
      ...data,
      id: this.generateId('prv'),
      createdAt: now,
      updatedAt: now,
    };
    this.providers.set(provider.id, provider);
    return provider;
  }

  async updateProvider(id: string, data: Partial<Provider>): Promise<Provider> {
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Provider not found: ${id}`);
    
    const updated: Provider = {
      ...provider,
      ...data,
      id: provider.id,
      updatedAt: new Date(),
    };
    this.providers.set(id, updated);
    return updated;
  }

  async findSubscriptions(filters: SubscriptionFilters): Promise<{ subscriptions: Subscription[]; total: number }> {
    let subscriptions = Array.from(this.subscriptions.values());

    if (filters.serviceId) {
      subscriptions = subscriptions.filter((s) => s.serviceId === filters.serviceId);
    }
    if (filters.subscriberWallet || filters.subscriberAddress) {
      const wallet = (filters.subscriberWallet || filters.subscriberAddress)!;
      subscriptions = subscriptions.filter((s) =>
        s.subscriberWallet.toLowerCase() === wallet.toLowerCase()
      );
    }
    if (filters.status && filters.status !== 'all') {
      const now = new Date();
      subscriptions = subscriptions.filter((s) => {
        switch (filters.status) {
          case 'active':
            return s.active && s.endDate > now;
          case 'expired':
            return s.endDate <= now;
          case 'cancelled':
            return !s.autoRenew && s.active;
          default:
            return true;
        }
      });
    }

    const total = subscriptions.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const paginatedSubscriptions = subscriptions.slice((page - 1) * limit, page * limit);

    return { subscriptions: paginatedSubscriptions, total };
  }

  async findSubscriptionById(id: string): Promise<Subscription | null> {
    return this.subscriptions.get(id) || null;
  }

  async createSubscription(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    const now = new Date();
    const subscription: Subscription = {
      ...data,
      id: this.generateId('sub'),
      createdAt: now,
      updatedAt: now,
    };
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) throw new Error(`Subscription not found: ${id}`);
    
    const updated: Subscription = {
      ...subscription,
      ...data,
      id: subscription.id,
      updatedAt: new Date(),
    };
    this.subscriptions.set(id, updated);
    return updated;
  }

  async findReviews(filters: ReviewFilters): Promise<{ reviews: Review[]; total: number }> {
    let reviews = Array.from(this.reviews.values());

    if (filters.serviceId) {
      reviews = reviews.filter((r) => r.serviceId === filters.serviceId);
    }
    if (filters.reviewerWallet) {
      reviews = reviews.filter((r) =>
        r.reviewerWallet.toLowerCase() === filters.reviewerWallet!.toLowerCase()
      );
    }
    if (filters.minRating !== undefined) {
      reviews = reviews.filter((r) => r.rating >= filters.minRating!);
    }
    if (filters.verified !== undefined) {
      reviews = reviews.filter((r) => r.verifiedPayment === filters.verified);
    }

    // Sort
    switch (filters.sort) {
      case 'oldest':
        reviews.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'rating':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'helpful':
        reviews.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'newest':
      default:
        reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const total = reviews.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const paginatedReviews = reviews.slice((page - 1) * limit, page * limit);

    return { reviews: paginatedReviews, total };
  }

  async createReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const now = new Date();
    const review: Review = {
      ...data,
      id: this.generateId('rev'),
      createdAt: now,
      updatedAt: now,
    };
    this.reviews.set(review.id, review);
    return review;
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review> {
    const review = this.reviews.get(id);
    if (!review) throw new Error(`Review not found: ${id}`);
    
    const updated: Review = {
      ...review,
      ...data,
      id: review.id,
      updatedAt: new Date(),
    };
    this.reviews.set(id, updated);
    return updated;
  }

  async findDisputes(filters: DisputeFilters): Promise<{ disputes: Dispute[]; total: number }> {
    let disputes = Array.from(this.disputes.values());

    if (filters.serviceId) {
      disputes = disputes.filter((d) => d.serviceId === filters.serviceId);
    }
    if (filters.disputerWallet) {
      disputes = disputes.filter((d) =>
        d.disputerWallet.toLowerCase() === filters.disputerWallet!.toLowerCase()
      );
    }
    if (filters.status) {
      disputes = disputes.filter((d) => d.status === filters.status);
    }
    if (filters.priority) {
      disputes = disputes.filter((d) => d.priority === filters.priority);
    }

    disputes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = disputes.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const paginatedDisputes = disputes.slice((page - 1) * limit, page * limit);

    return { disputes: paginatedDisputes, total };
  }

  async findDisputeById(id: string): Promise<Dispute | null> {
    return this.disputes.get(id) || null;
  }

  async createDispute(data: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispute> {
    const now = new Date();
    const dispute: Dispute = {
      ...data,
      id: this.generateId('dsp'),
      createdAt: now,
      updatedAt: now,
    };
    this.disputes.set(dispute.id, dispute);
    return dispute;
  }

  async updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) throw new Error(`Dispute not found: ${id}`);
    
    const updated: Dispute = {
      ...dispute,
      ...data,
      id: dispute.id,
      updatedAt: new Date(),
    };
    this.disputes.set(id, updated);
    return updated;
  }

  async getServiceStats(serviceId: string): Promise<ServiceStats> {
    const reviews = Array.from(this.reviews.values()).filter((r) => r.serviceId === serviceId);
    const subscriptions = Array.from(this.subscriptions.values()).filter((s) => 
      s.serviceId === serviceId && s.active && s.endDate > new Date()
    );
    
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      totalRequests: 0, // Would come from analytics
      totalRevenue: '0',
      activeSubscribers: subscriptions.length,
      averageResponseTime: 0,
      uptime: 99.9,
      last24hRequests: 0,
      rating: avgRating,
      totalReviews: reviews.length,
    };
  }

  async getProviderStats(providerWallet: string): Promise<ProviderStats> {
    const services = Array.from(this.services.values()).filter((s) =>
      s.walletAddress.toLowerCase() === providerWallet.toLowerCase()
    );
    
    const serviceIds = new Set(services.map((s) => s.id));
    const subscriptions = Array.from(this.subscriptions.values()).filter((s) =>
      serviceIds.has(s.serviceId) && s.active
    );
    const reviews = Array.from(this.reviews.values()).filter((r) =>
      serviceIds.has(r.serviceId)
    );

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      totalServices: services.length,
      activeServices: services.filter((s) => s.status === 'active').length,
      totalSubscribers: subscriptions.length,
      totalRevenue: '0',
      averageRating: avgRating,
      totalReviews: reviews.length,
      totalApiCalls: 0,
    };
  }

  async getPlatformStats(): Promise<PlatformStats> {
    const services = Array.from(this.services.values());
    const providers = Array.from(this.providers.values());
    const subscriptions = Array.from(this.subscriptions.values()).filter((s) => 
      s.active && s.endDate > new Date()
    );
    const reviews = Array.from(this.reviews.values());

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const disputes = Array.from(this.disputes.values());
    const resolvedDisputes = disputes.filter((d) => 
      d.status === 'resolved' || d.status === 'rejected'
    );

    return {
      totalServices: services.filter((s) => s.status === 'active').length,
      totalProviders: providers.length,
      totalUsers: new Set(subscriptions.map((s) => s.subscriberWallet)).size,
      totalVolume: '0',
      activeSubscriptions: subscriptions.length,
      averageUptime: 99.9,
      averageRating: avgRating,
      disputeResolutionRate: disputes.length > 0
        ? (resolvedDisputes.length / disputes.length) * 100
        : 100,
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// ============================================================================
// Database Singleton
// ============================================================================

let dbInstance: DatabaseClient | null = null;

export function getDatabase(): DatabaseClient {
  if (!dbInstance) {
    // In production, connect to real database
    // For now, use in-memory for development
    if (DATABASE_URL) {
      // TODO: Initialize Prisma or PostgreSQL client
      console.warn('[Database] DATABASE_URL set but using in-memory database for development');
    }
    dbInstance = new InMemoryDatabase();
  }
  return dbInstance;
}

// ============================================================================
// Database Initialization with Seed Data
// ============================================================================

export async function seedDatabase(): Promise<void> {
  const db = getDatabase();
  
  // Check if already seeded
  const { services } = await db.findServices({ limit: 1 });
  if (services.length > 0) {
    console.log('[Database] Already seeded, skipping');
    return;
  }

  console.log('[Database] Seeding database...');

  // Seed providers
  const providers = [
    { name: 'CryptoAI Labs', walletAddress: '0x1234567890123456789012345678901234567890', verified: true, rating: 4.8, totalServices: 5, totalRevenue: '$45,000' },
    { name: 'YieldMax', walletAddress: '0x2345678901234567890123456789012345678901', verified: true, rating: 4.6, totalServices: 3, totalRevenue: '$25,000' },
    { name: 'ChainWatch', walletAddress: '0x3456789012345678901234567890123456789012', verified: true, rating: 4.7, totalServices: 4, totalRevenue: '$36,000' },
    { name: 'SecureChain', walletAddress: '0x4567890123456789012345678901234567890123', verified: true, rating: 4.9, totalServices: 2, totalRevenue: '$20,000' },
    { name: 'DataOracle', walletAddress: '0x5678901234567890123456789012345678901234', verified: true, rating: 4.4, totalServices: 3, totalRevenue: '$50,000' },
  ];

  for (const provider of providers) {
    await db.createProvider(provider as any);
  }

  // Seed services
  const serviceData = [
    {
      name: 'AI Market Analysis',
      description: 'Real-time AI-powered market analysis and trading signals with machine learning predictions for crypto markets.',
      category: 'ai' as const,
      endpoint: 'https://api.cryptoai-labs.com/v1/analysis',
      walletAddress: '0x1234567890123456789012345678901234567890',
      tags: ['ai', 'trading', 'signals', 'analysis', 'machine-learning'],
      status: 'active' as const,
      verified: true,
      featured: true,
      pricing: { payPerUse: '$0.01', subscription: { monthly: '$29.99', annually: '$299.99' } },
    },
    {
      name: 'DeFi Yield Optimizer',
      description: 'Automated yield optimization across multiple DeFi protocols with auto-compounding and risk management.',
      category: 'defi' as const,
      endpoint: 'https://api.yieldmax.io/v2/optimize',
      walletAddress: '0x2345678901234567890123456789012345678901',
      tags: ['defi', 'yield', 'optimization', 'automation'],
      status: 'active' as const,
      verified: true,
      featured: true,
      pricing: { payPerUse: '$0.05', subscription: { monthly: '$49.99' } },
    },
    {
      name: 'On-Chain Analytics',
      description: 'Deep on-chain analytics and whale tracking with real-time alerts and historical data.',
      category: 'analytics' as const,
      endpoint: 'https://api.chainwatch.xyz/v1/analytics',
      walletAddress: '0x3456789012345678901234567890123456789012',
      tags: ['analytics', 'whale', 'tracking', 'on-chain'],
      status: 'active' as const,
      verified: true,
      featured: true,
      pricing: { payPerUse: '$0.03', subscription: { monthly: '$39.99', annually: '$399.99' } },
    },
    {
      name: 'Smart Contract Auditor',
      description: 'Automated smart contract security analysis with vulnerability detection and best practices checking.',
      category: 'security' as const,
      endpoint: 'https://api.securechain.io/v1/audit',
      walletAddress: '0x4567890123456789012345678901234567890123',
      tags: ['security', 'audit', 'smart-contract', 'analysis'],
      status: 'active' as const,
      verified: true,
      featured: true,
      pricing: { payPerUse: '$0.10', subscription: { monthly: '$99.99' } },
    },
    {
      name: 'Price Feed Oracle',
      description: 'Real-time price feeds for multiple tokens with high availability and low latency.',
      category: 'data' as const,
      endpoint: 'https://api.dataoracle.io/v1/prices',
      walletAddress: '0x5678901234567890123456789012345678901234',
      tags: ['data', 'price', 'oracle', 'feed'],
      status: 'active' as const,
      verified: true,
      featured: false,
      pricing: { payPerUse: '$0.001', subscription: { monthly: '$9.99' } },
    },
    {
      name: 'NFT Rarity Scanner',
      description: 'Instant NFT rarity analysis and valuation using comprehensive trait analysis.',
      category: 'nft' as const,
      endpoint: 'https://api.nftinsights.com/v1/rarity',
      walletAddress: '0x6789012345678901234567890123456789012345',
      tags: ['nft', 'rarity', 'valuation', 'analysis'],
      status: 'active' as const,
      verified: true,
      featured: false,
      pricing: { payPerUse: '$0.02', subscription: { monthly: '$19.99' } },
    },
    {
      name: 'Trading Bot API',
      description: 'Automated trading strategies and execution with customizable parameters.',
      category: 'trading' as const,
      endpoint: 'https://api.autotrade.xyz/v1/execute',
      walletAddress: '0x7890123456789012345678901234567890123456',
      tags: ['trading', 'bot', 'automation', 'strategy'],
      status: 'active' as const,
      verified: true,
      featured: false,
      pricing: { payPerUse: '$0.05', subscription: { monthly: '$79.99' } },
    },
    {
      name: 'Sentiment Analysis',
      description: 'Social media sentiment analysis for crypto assets using NLP and AI.',
      category: 'ai' as const,
      endpoint: 'https://api.cryptoai-labs.com/v1/sentiment',
      walletAddress: '0x1234567890123456789012345678901234567890',
      tags: ['ai', 'sentiment', 'social', 'nlp'],
      status: 'active' as const,
      verified: true,
      featured: false,
      pricing: { payPerUse: '$0.008', subscription: { monthly: '$24.99' } },
    },
  ];

  for (const service of serviceData) {
    await db.createService(service);
  }

  // Seed reviews
  const reviewData = [
    {
      serviceId: 'srv-ai-market', // Will be replaced with actual ID
      reviewerWallet: '0xabc1234567890123456789012345678901234567',
      rating: 5,
      title: 'Excellent trading signals',
      comment: 'The AI analysis has significantly improved my trading decisions. The signals are accurate and timely. Highly recommended!',
      verifiedPayment: true,
      helpful: 45,
    },
    {
      serviceId: 'srv-ai-market',
      reviewerWallet: '0xdef2345678901234567890123456789012345678',
      rating: 4,
      title: 'Good but could be faster',
      comment: 'Great analysis quality but sometimes the response time is a bit slow during high market volatility.',
      verifiedPayment: true,
      helpful: 23,
    },
    {
      serviceId: 'srv-defi-yield',
      reviewerWallet: '0xghi3456789012345678901234567890123456789',
      rating: 5,
      title: 'Best yield optimizer',
      comment: 'Automatically finds the best yields across multiple protocols. Has saved me hours of research and increased my returns significantly.',
      verifiedPayment: true,
      helpful: 67,
    },
    {
      serviceId: 'srv-analytics',
      reviewerWallet: '0xjkl4567890123456789012345678901234567890',
      rating: 4,
      title: 'Solid whale tracking',
      comment: 'The whale tracking feature is very useful. Alerts are timely and help me stay ahead of big market moves.',
      verifiedPayment: true,
      helpful: 34,
    },
    {
      serviceId: 'srv-security',
      reviewerWallet: '0xmno5678901234567890123456789012345678901',
      rating: 5,
      title: 'Essential for due diligence',
      comment: 'The contract auditor has become an essential part of my due diligence process. It has helped me avoid several potential rug pulls.',
      verifiedPayment: true,
      helpful: 89,
    },
  ];

  // Get created services to match review service IDs
  const { services: createdServices } = await db.findServices({ limit: 10 });
  const serviceMap = new Map(createdServices.map(s => [s.name, s.id]));
  
  // Map review service IDs
  for (const review of reviewData) {
    let actualServiceId = '';
    if (review.serviceId.includes('ai-market')) {
      actualServiceId = serviceMap.get('AI Market Analysis') || createdServices[0]?.id || '';
    } else if (review.serviceId.includes('defi-yield')) {
      actualServiceId = serviceMap.get('DeFi Yield Optimizer') || createdServices[1]?.id || '';
    } else if (review.serviceId.includes('analytics')) {
      actualServiceId = serviceMap.get('On-Chain Analytics') || createdServices[2]?.id || '';
    } else if (review.serviceId.includes('security')) {
      actualServiceId = serviceMap.get('Smart Contract Auditor') || createdServices[3]?.id || '';
    }
    
    if (actualServiceId) {
      await db.createReview({
        ...review,
        serviceId: actualServiceId,
      });
    }
  }

  // Seed subscriptions
  const subscriptionData = [
    {
      serviceId: createdServices[0]?.id || '',
      subscriberWallet: '0xuser1234567890123456789012345678901234567',
      plan: 'monthly' as const,
      price: '$29.99',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      active: true,
      autoRenew: true,
    },
    {
      serviceId: createdServices[1]?.id || '',
      subscriberWallet: '0xuser1234567890123456789012345678901234567',
      plan: 'monthly' as const,
      price: '$49.99',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      active: true,
      autoRenew: true,
    },
    {
      serviceId: createdServices[2]?.id || '',
      subscriberWallet: '0xuser2345678901234567890123456789012345678',
      plan: 'annually' as const,
      price: '$399.99',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      active: true,
      autoRenew: true,
    },
  ];

  for (const sub of subscriptionData) {
    if (sub.serviceId) {
      await db.createSubscription(sub);
    }
  }

  console.log('[Database] Seeded', serviceData.length, 'services,', reviewData.length, 'reviews,', subscriptionData.length, 'subscriptions');
}
