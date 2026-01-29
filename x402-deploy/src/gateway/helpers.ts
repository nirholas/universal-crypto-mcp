/**
 * Helper functions for integrating x402 middleware with existing gateway components
 */

import type { X402Config } from "../types/config.js";
import type { PricingConfig, SettlementContext, Network } from "./types.js";
import { PricingEngine, createPricingEngine } from "./pricing-engine.js";
import { RateLimiter, createRateLimiter } from "./rate-limiter.js";
import { AnalyticsEngine, createAnalyticsEngine } from "./analytics.js";

export interface PricingMatch {
  route: string;
  price: string;
  currency: string;
  description?: string;
  rateLimit?: {
    requests: number;
    window: string;
  };
}

// Global instances for the gateway (singleton pattern)
let globalPricingEngine: PricingEngine | null = null;
let globalRateLimiter: RateLimiter | null = null;
let globalAnalytics: AnalyticsEngine | null = null;

/**
 * Initialize gateway with X402Config
 */
export function initializeGateway(config: X402Config) {
  const pricingConfig = convertToPricingConfig(config);
  globalPricingEngine = createPricingEngine(pricingConfig);
  
  globalRateLimiter = createRateLimiter({
    enabled: true,
    maxRequests: config.pricing?.routes ? 1000 : 100,
    windowSeconds: 3600,
    perPayer: true,
  });
  
  globalAnalytics = createAnalyticsEngine({
    enabled: config.analytics?.enabled ?? true,
    webhookUrl: config.dashboard?.webhooks?.[0]?.url,
    webhookSecret: config.dashboard?.webhooks?.[0]?.secret,
    verbose: false,
  });
  
  return {
    pricingEngine: globalPricingEngine,
    rateLimiter: globalRateLimiter,
    analytics: globalAnalytics,
  };
}

/**
 * Convert X402Config to PricingConfig format
 */
export function convertToPricingConfig(config: X402Config): PricingConfig {
  const pricingConfig: PricingConfig = {};
  
  if (config.pricing?.routes) {
    for (const [route, pricing] of Object.entries(config.pricing.routes)) {
      if (typeof pricing === "string") {
        pricingConfig[route] = pricing;
      } else if (typeof pricing === "object" && pricing && "price" in pricing) {
        pricingConfig[route] = pricing.price as string;
      }
    }
  }
  
  return pricingConfig;
}

/**
 * Get pricing for a specific route using PricingEngine
 */
export function getPriceForRoute(
  route: string,
  config: X402Config
): PricingMatch | null {
  if (!globalPricingEngine) {
    initializeGateway(config);
  }
  
  const price = globalPricingEngine!.getPrice(route);
  if (!price) return null;
  
  const routes = config.pricing?.routes || {};
  const routeConfig = routes[route];
  
  return {
    route,
    price: price,
    currency: "USD",
    description: typeof routeConfig === "object" ? routeConfig.description : undefined,
    rateLimit: typeof routeConfig === "object" ? routeConfig.rateLimit : undefined,
  };
}

export interface RateLimitOptions {
  payerAddress: string;
  route: string;
  config: X402Config;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  window: string;
  retryAfter?: number;
}

/**
 * Check rate limit using RateLimiter
 */
export async function checkRateLimit(
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { payerAddress, route, config } = options;
  
  if (!globalRateLimiter) {
    initializeGateway(config);
  }
  
  const result = await globalRateLimiter!.checkLimit(payerAddress, route);
  
  return {
    allowed: result.allowed,
    remaining: result.remaining,
    limit: globalRateLimiter!["config"].maxRequests,
    window: `${globalRateLimiter!["config"].windowSeconds}s`,
    retryAfter: result.retryAfter,
  };
}

export interface RequestTrack {
  route: string;
  payer: string;
  amount: string;
  config: X402Config;
  duration: number;
  timestamp?: number;
  txHash?: string;
  network?: string;
}

/**
 * Track request using AnalyticsEngine
 */
export async function trackRequest(track: RequestTrack): Promise<void> {
  if (!globalAnalytics) {
    initializeGateway(track.config);
  }
  
  const context: SettlementContext = {
    payer: track.payer,
    route: track.route,
    amount: track.amount,
    asset: "USDC",
    network: (track.network || track.config.payment.network) as Network,
    txHash: track.txHash,
    request: {
      method: track.route.split(" ")[0],
      path: track.route.split(" ")[1],
    },
  };
  
  await globalAnalytics!.recordPayment(context);
}
