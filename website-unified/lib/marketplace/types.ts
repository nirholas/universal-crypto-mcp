/**
 * Marketplace Types for AI Service Marketplace
 */

export type ServiceCategory =
  | 'ai-models'
  | 'data-apis'
  | 'trading-signals'
  | 'analytics'
  | 'machine-learning'
  | 'nlp'
  | 'computer-vision'
  | 'speech'
  | 'translation'
  | 'blockchain-data'
  | 'market-data'
  | 'weather'
  | 'geolocation'
  | 'sentiment'
  | 'other';

export type ServiceStatus = 'active' | 'paused' | 'pending' | 'suspended' | 'archived';

export type PricingType = 'pay-per-use' | 'subscription' | 'freemium';

export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface ServicePricing {
  type: PricingType;
  payPerUse?: {
    pricePerRequest: number;
    currency: string;
  };
  subscription?: {
    plans: SubscriptionTier[];
  };
}

export interface SubscriptionTier {
  name: SubscriptionPlan;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  requestsIncluded: number;
  features: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  walletAddress: string;
  avatarUrl?: string;
  verified: boolean;
  reputationScore: number;
  totalServices: number;
  joinedAt: Date;
}

export interface ServiceReputation {
  score: number; // 0-100
  rating: number; // 0-5 stars
  totalReviews: number;
  verifiedPayments: number;
  uptime: number; // percentage
  responseTime: number; // ms average
  successRate: number; // percentage
}

export interface ServiceBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface MarketplaceService {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ServiceCategory;
  provider: ServiceProvider;
  pricing: ServicePricing;
  reputation: ServiceReputation;
  badges: ServiceBadge[];
  tags: string[];
  endpoint: string;
  documentationUrl?: string;
  status: ServiceStatus;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
  featured: boolean;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  reviewerWallet: string;
  reviewerName?: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  useCase: string;
  comment: string;
  createdAt: Date;
  helpful: number;
  verifiedPurchase: boolean;
  providerResponse?: {
    comment: string;
    respondedAt: Date;
  };
  attachments?: string[];
}

export interface Subscription {
  id: string;
  serviceId: string;
  serviceName: string;
  subscriberWallet: string;
  plan: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  usageThisMonth: number;
  apiKey: string;
  txHash?: string;
}

export interface DiscoveryFilters {
  search?: string;
  category?: ServiceCategory;
  minRating?: number;
  maxPrice?: number;
  pricingType?: PricingType;
  verified?: boolean;
  onlineOnly?: boolean;
  tags?: string[];
  sortBy?: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ProviderStats {
  totalServices: number;
  activeServices: number;
  totalSubscribers: number;
  totalApiCalls: number;
  revenueThisMonth: number;
  revenueAllTime: number;
  totalRevenue: number;
  averageRating: number;
  services?: Array<{
    id: string;
    name: string;
    revenue: number;
    subscribers: number;
    apiCalls: number;
  }>;
}

export interface ProviderAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  revenue: { date: string; amount: number }[];
  apiCalls: { date: string; count: number }[];
  newSubscribers: { date: string; count: number }[];
  topConsumers: { wallet: string; calls: number; revenue: number }[];
  geographicData: { country: string; requests: number }[];
}

export interface Dispute {
  id: string;
  serviceId: string;
  subscriberWallet: string;
  providerWallet: string;
  reason: string;
  description: string;
  evidence: string[];
  status: 'open' | 'in-review' | 'resolved' | 'escalated';
  resolution?: string;
  mediatorWallet?: string;
  createdAt: Date;
  resolvedAt?: Date;
  escrowAmount: number;
}

export interface PlatformStats {
  totalServices: number;
  activeProviders: number;
  totalProviders: number;
  totalConsumers: number;
  totalUsers: number;
  totalApiCalls: number;
  gmv: number;
  totalVolume: number;
  platformRevenue: number;
  pendingVerifications: number;
  openDisputes: number;
  averageUptime: number;
  disputeResolutionRate: number;
  averageRating: number;
}

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: 'ai-models', label: 'AI Models', icon: '🤖' },
  { value: 'data-apis', label: 'Data APIs', icon: '📊' },
  { value: 'trading-signals', label: 'Trading Signals', icon: '📈' },
  { value: 'analytics', label: 'Analytics', icon: '📉' },
  { value: 'machine-learning', label: 'Machine Learning', icon: '🧠' },
  { value: 'nlp', label: 'Natural Language Processing', icon: '💬' },
  { value: 'computer-vision', label: 'Computer Vision', icon: '👁️' },
  { value: 'speech', label: 'Speech & Audio', icon: '🎙️' },
  { value: 'translation', label: 'Translation', icon: '🌐' },
  { value: 'blockchain-data', label: 'Blockchain Data', icon: '⛓️' },
  { value: 'market-data', label: 'Market Data', icon: '💹' },
  { value: 'weather', label: 'Weather', icon: '🌤️' },
  { value: 'geolocation', label: 'Geolocation', icon: '📍' },
  { value: 'sentiment', label: 'Sentiment Analysis', icon: '😊' },
  { value: 'other', label: 'Other', icon: '📦' },
];
