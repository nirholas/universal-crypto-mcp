/**
 * Gateway Types for x402-deploy
 * 
 * @module gateway/types
 * @description Core type definitions for the x402 gateway wrapper system
 */

// Local type definitions (previously from @x402/core/types)
export type Network = 
  | "eip155:1"        // Ethereum Mainnet
  | "eip155:42161"    // Arbitrum One
  | "eip155:8453"     // Base
  | "eip155:84532"    // Base Sepolia (testnet)
  | "eip155:137"      // Polygon
  | "eip155:10"       // Optimism
  | "eip155:56"       // BSC
  | "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"  // Solana Mainnet
  | "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"  // Solana Devnet
  | string;

export interface Price {
  amount: string;
  currency: string;
  decimals?: number;
}

/**
 * Payment configuration for the gateway
 */
export interface PaymentConfig {
  /** Wallet address to receive payments */
  wallet: `0x${string}`;
  /** Network identifier (e.g., 'eip155:42161' for Arbitrum) */
  network: Network;
  /** Optional facilitator URL for payment processing */
  facilitator?: string;
  /** Optional list of accepted assets */
  acceptedAssets?: string[];
}

/**
 * Pricing configuration - maps tool/route names to prices
 */
export type PricingConfig = Record<string, string>;

/**
 * Discovery document configuration
 */
export interface DiscoveryConfig {
  /** Instructions for AI agents on how to use the service */
  instructions?: string;
  /** Service name */
  name?: string;
  /** Service description */
  description?: string;
  /** Service version */
  version?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Main gateway configuration
 */
export interface GatewayConfig {
  /** Payment configuration */
  payment: PaymentConfig;
  /** Tool/route pricing */
  pricing: PricingConfig;
  /** Discovery document options */
  discovery?: DiscoveryConfig;
  /** Rate limiting options */
  rateLimit?: RateLimitConfig;
  /** Analytics options */
  analytics?: AnalyticsConfig;
}

/**
 * MCP-specific gateway configuration
 */
export interface McpGatewayConfig extends GatewayConfig {
  /** MCP server options */
  mcp?: {
    /** Custom session ID generator */
    sessionIdGenerator?: () => string;
    /** Enable stateless mode (no sessions) */
    stateless?: boolean;
  };
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Enable rate limiting */
  enabled?: boolean;
  /** Requests per window */
  maxRequests?: number;
  /** Window duration in seconds */
  windowSeconds?: number;
  /** Per-payer limits */
  perPayer?: boolean;
  /** Redis connection URL for distributed rate limiting */
  redisUrl?: string;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Enable analytics tracking */
  enabled?: boolean;
  /** Webhook URL for payment notifications */
  webhookUrl?: string;
  /** Secret for webhook signatures */
  webhookSecret?: string;
  /** Enable detailed logging */
  verbose?: boolean;
}

/**
 * Payment analytics data
 */
export interface PaymentAnalytics {
  /** Total revenue in USD */
  totalRevenue: string;
  /** Revenue by route/tool */
  revenueByRoute: Record<string, string>;
  /** Unique payer addresses */
  uniquePayers: Set<string>;
  /** Payment count by route */
  paymentCountByRoute: Record<string, number>;
  /** Total payment count */
  totalPayments: number;
  /** Last payment timestamp */
  lastPaymentAt?: Date;
}

/**
 * Individual payment record
 */
export interface PaymentRecord {
  /** Payment ID */
  id: string;
  /** Payer address */
  payer: string;
  /** Route/tool that was paid for */
  route: string;
  /** Amount paid */
  amount: string;
  /** Asset used for payment */
  asset: string;
  /** Network */
  network: Network;
  /** Transaction hash (if available) */
  txHash?: string;
  /** Timestamp */
  timestamp: Date;
  /** Settlement status */
  settled: boolean;
}

/**
 * Rate limit state for a payer
 */
export interface RateLimitState {
  /** Payer address */
  payer: string;
  /** Request count in current window */
  count: number;
  /** Window start timestamp */
  windowStart: number;
  /** Whether limit is exceeded */
  exceeded: boolean;
}

/**
 * Pricing tier for volume discounts
 */
export interface PricingTier {
  /** Minimum request count */
  minRequests: number;
  /** Maximum request count (undefined = unlimited) */
  maxRequests?: number;
  /** Price for this tier */
  price: string;
}

/**
 * Dynamic pricing configuration for a route
 */
export interface DynamicPricing {
  /** Base price */
  basePrice: string;
  /** Volume-based tiers */
  tiers?: PricingTier[];
  /** Load-based pricing multiplier (1.0 = no change) */
  loadMultiplier?: number;
  /** Time-based pricing (e.g., higher during peak hours) */
  timePricing?: {
    peakHours: number[];
    peakMultiplier: number;
  };
}

/**
 * x402 discovery document structure
 */
export interface X402Discovery {
  /** Protocol version */
  version: string;
  /** Service name */
  name: string;
  /** Service description */
  description?: string;
  /** Instructions for AI agents */
  instructions?: string;
  /** Payment configuration */
  payment: {
    wallet: string;
    network: string;
    facilitator?: string;
    acceptedAssets?: string[];
  };
  /** Available endpoints with pricing */
  endpoints: Record<string, {
    price: string;
    description?: string;
    method?: string;
  }>;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Hook context for after-settlement callbacks
 */
export interface SettlementContext {
  /** Payer address */
  payer: string;
  /** Route/tool that was paid for */
  route: string;
  /** Amount paid */
  amount: string;
  /** Asset used */
  asset: string;
  /** Network */
  network: Network;
  /** Transaction hash */
  txHash?: string;
  /** Request details */
  request?: {
    method: string;
    path: string;
    body?: unknown;
  };
  /** Response status code */
  responseStatus?: number;
}

/**
 * Webhook payload for payment notifications
 */
export interface WebhookPayload {
  /** Event type */
  event: "payment.received" | "payment.settled" | "payment.failed";
  /** Payment data */
  payment: PaymentRecord;
  /** Timestamp */
  timestamp: string;
  /** Signature for verification */
  signature?: string;
}
