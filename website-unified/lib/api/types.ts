/**
 * API Response Types
 * Universal Crypto MCP - API Layer
 * 
 * @author nich
 * @license Apache-2.0
 */

import { z } from 'zod';

// ============================================================================
// Rate Limit Types
// ============================================================================

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  retryAfter?: number; // Seconds until reset
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// ============================================================================
// API Response Types
// ============================================================================

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
  path?: string;
}

export interface APIResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  rateLimit?: RateLimitInfo;
  executionTime?: number;
  requestId?: string;
  timestamp?: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  errors?: APIError[];
  meta?: APIResponseMeta;
}

// ============================================================================
// Tool Execution Types
// ============================================================================

export interface ExecutionMetadata {
  toolId: string;
  startTime: number;
  endTime: number;
  executionTime: number;
  cached: boolean;
  retries: number;
  chain?: string;
}

export interface ToolExecutionRequest {
  toolId: string;
  parameters: Record<string, unknown>;
  options?: {
    timeout?: number;
    streaming?: boolean;
    cache?: boolean;
  };
}

export interface ToolExecutionResponse<T = unknown> {
  success: boolean;
  result?: T;
  error?: string;
  executionTime: number;
  metadata: ExecutionMetadata;
}

export const ToolExecutionRequestSchema = z.object({
  toolId: z.string().min(1).max(100),
  parameters: z.record(z.unknown()),
  options: z.object({
    timeout: z.number().int().min(1000).max(60000).optional(),
    streaming: z.boolean().optional(),
    cache: z.boolean().optional(),
  }).optional(),
});

// ============================================================================
// Tool Types
// ============================================================================

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  version: string;
  author?: string;
  tags: string[];
  premium: boolean;
  deprecated: boolean;
}

export interface ToolDetail extends Tool {
  fullDescription: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  examples: ToolExample[];
  changelog: ToolChangelog[];
  documentation?: string;
  rateLimit?: {
    requests: number;
    window: number;
  };
}

export interface ToolExample {
  name: string;
  description: string;
  input: Record<string, unknown>;
  output: unknown;
}

export interface ToolChangelog {
  version: string;
  date: string;
  changes: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// ============================================================================
// Marketplace Types
// ============================================================================

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  provider: ProviderInfo;
  pricing: ServicePricing;
  stats: ServiceStats;
  reputation: ServiceReputation;
  tags: string[];
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  address: string;
  verified: boolean;
  rating: number;
  totalServices: number;
}

export interface ServicePricing {
  payPerUse?: string;
  subscription?: {
    monthly?: string;
    annually?: string;
  };
  credits?: {
    price: string;
    amount: number;
  };
  freeTier?: {
    requests: number;
    period: 'day' | 'week' | 'month';
  };
}

export interface ServiceStats {
  totalRequests: number;
  totalRevenue: string;
  activeSubscribers: number;
  averageResponseTime: number;
  uptime: number;
  last24hRequests: number;
}

export interface ServiceReputation {
  rating: number;
  totalReviews: number;
  verifiedPayments: number;
  badges: string[];
  responseRate: number;
}

export type ServiceCategory =
  | 'ai'
  | 'data'
  | 'weather'
  | 'finance'
  | 'social'
  | 'infrastructure'
  | 'analytics'
  | 'storage'
  | 'compute'
  | 'security'
  | 'defi'
  | 'nft'
  | 'trading'
  | 'other';

export interface SearchFacets {
  categories: Array<{ name: ServiceCategory; count: number }>;
  priceRanges: Array<{ range: string; count: number }>;
  ratings: Array<{ rating: number; count: number }>;
  tags: Array<{ tag: string; count: number }>;
}

// ============================================================================
// Wallet Types
// ============================================================================

export interface Balance {
  chain: string;
  chainId: number;
  native: {
    symbol: string;
    balance: string;
    balanceFormatted: string;
    usdValue: number;
  };
}

export interface TokenBalance {
  chain: string;
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  usdValue: number;
  logoUri?: string;
}

export interface NFTBalance {
  chain: string;
  chainId: number;
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUri?: string;
  collection: {
    name: string;
    verified: boolean;
  };
  floorPrice?: {
    amount: string;
    currency: string;
  };
}

export interface TransactionInfo {
  hash: string;
  chain: string;
  chainId: number;
  from: string;
  to: string;
  value: string;
  data?: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  timestamp?: number;
  gasUsed?: string;
  gasPrice?: string;
  nonce: number;
  type: 'transfer' | 'swap' | 'approve' | 'contract' | 'unknown';
}

export interface TransactionBuildRequest {
  chain: string;
  from: string;
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface TransactionBuildResponse {
  transaction: {
    to: string;
    value: string;
    data: string;
    chainId: number;
    gasLimit: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    nonce: number;
  };
  estimatedGas: {
    usd: number;
    native: string;
  };
  warnings: string[];
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  chain?: string;
  ens?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface PortfolioSummary {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  change7d: number;
  change7dPercent: number;
  change30d: number;
  change30dPercent: number;
  topAssets: Array<{
    symbol: string;
    name: string;
    value: number;
    percentage: number;
  }>;
  chainDistribution: Array<{
    chain: string;
    value: number;
    percentage: number;
  }>;
}

export interface PortfolioHistory {
  timestamps: number[];
  values: number[];
  period: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
}

export interface MarketOverview {
  totalMarketCap: number;
  totalMarketCapChange24h: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
  trending: TrendingToken[];
  gainers: TokenMarketData[];
  losers: TokenMarketData[];
}

export interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  priceUsd: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logoUri?: string;
}

export interface TokenMarketData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply?: number;
  ath: number;
  athDate: string;
  atl: number;
  atlDate: string;
  logoUri?: string;
}

export interface DeFiPosition {
  protocol: string;
  protocolLogo?: string;
  chain: string;
  type: 'lending' | 'borrowing' | 'staking' | 'liquidity' | 'farming' | 'vault';
  assets: Array<{
    symbol: string;
    amount: string;
    usdValue: number;
  }>;
  apy?: number;
  rewards?: Array<{
    symbol: string;
    amount: string;
    usdValue: number;
  }>;
  healthFactor?: number;
  liquidationPrice?: number;
}

export interface TaxSummary {
  year: number;
  shortTermGains: number;
  longTermGains: number;
  totalGains: number;
  totalLosses: number;
  netGainLoss: number;
  transactionCount: number;
  taxableEvents: number;
}

export interface TaxTransaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'swap' | 'transfer' | 'airdrop' | 'staking' | 'income';
  asset: string;
  amount: string;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  term: 'short' | 'long';
  txHash: string;
  chain: string;
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface Subscription {
  id: string;
  serviceId: string;
  serviceName: string;
  plan: 'monthly' | 'annually';
  price: string;
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  autoRenew: boolean;
  usage: {
    used: number;
    limit: number;
    period: string;
  };
}

export interface SubscriptionUsage {
  subscriptionId: string;
  period: string;
  requests: number;
  limit: number;
  overage: number;
  overageCharges: string;
  dailyUsage: Array<{
    date: string;
    requests: number;
  }>;
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: string;
  serviceId: string;
  reviewer: {
    address: string;
    ens?: string;
  };
  rating: number;
  title: string;
  comment: string;
  verifiedPayment: boolean;
  helpful: number;
  createdAt: string;
  response?: {
    comment: string;
    createdAt: string;
  };
}

// ============================================================================
// Request Context Types
// ============================================================================

export interface RequestContext {
  requestId: string;
  ip: string;
  userAgent: string;
  userId?: string;
  walletAddress?: string;
  timestamp: number;
  path: string;
  method: string;
}
