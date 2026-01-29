# Agent 2: Payment Gateway & Middleware

## Role
You are the **Gateway Agent** responsible for building the core x402 payment middleware that wraps any API or MCP server with monetization.

## Repository Context
```
Repository: nirholas/universal-crypto-mcp
Working Directory: /workspaces/universal-crypto-mcp/x402-deploy
Your Files: src/gateway/**/*
```

## Current State
Basic gateway structure exists with placeholder implementations:
- `middleware.ts` - Basic middleware skeleton
- `mcp-wrapper.ts` - MCP server wrapper
- `express-wrapper.ts` - Express wrapper
- `pricing-engine.ts` - Pricing logic
- `rate-limiter.ts` - Rate limiting
- `analytics.ts` - Usage tracking

## Your Mission
Build a **production-ready x402 payment gateway** that:
1. Intercepts all requests
2. Validates x402 payment headers
3. Forwards to upstream API
4. Tracks usage and earnings

---

## Task 1: Core Middleware

**File: `src/gateway/middleware.ts`**

```typescript
import type { Request, Response, NextFunction } from "express";
import { verifyPayment, PaymentVerification } from "./payment-verifier.js";
import { getPriceForRoute } from "./pricing-engine.js";
import { trackRequest } from "./analytics.js";
import { checkRateLimit } from "./rate-limiter.js";
import type { X402Config, RoutePricing } from "../types/config.js";

export interface X402MiddlewareOptions {
  config: X402Config;
  facilitatorUrl?: string;
  testMode?: boolean;
  onPaymentVerified?: (payment: PaymentVerification) => void;
  onPaymentFailed?: (error: Error, req: Request) => void;
}

export interface X402Headers {
  "x-payment": string;
  "x-payment-response"?: string;
}

/**
 * Main x402 payment middleware
 * Handles HTTP 402 Payment Required flow
 */
export function x402Middleware(options: X402MiddlewareOptions) {
  const { config, facilitatorUrl, testMode, onPaymentVerified, onPaymentFailed } = options;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const route = `${req.method} ${req.path}`;
    
    try {
      // Step 1: Get pricing for this route
      const pricing = getPriceForRoute(route, config);
      
      // If no pricing configured, pass through (free endpoint)
      if (!pricing) {
        return next();
      }

      // Step 2: Check for x-payment header
      const paymentHeader = req.headers["x-payment"] as string;
      
      if (!paymentHeader) {
        // No payment provided - return 402 with payment requirements
        return send402Response(res, pricing, config);
      }

      // Step 3: Verify the payment
      const verification = await verifyPayment({
        paymentHeader,
        expectedPrice: pricing.price,
        expectedPayTo: config.payment.wallet,
        network: config.payment.network,
        facilitatorUrl: facilitatorUrl || config.payment.facilitator,
        testMode,
      });

      if (!verification.valid) {
        onPaymentFailed?.(new Error(verification.error || "Payment invalid"), req);
        return res.status(402).json({
          error: "payment_invalid",
          message: verification.error,
          required: buildPaymentRequirements(pricing, config),
        });
      }

      // Step 4: Check rate limits for this payer
      const rateLimitResult = await checkRateLimit({
        payerAddress: verification.payer,
        route,
        config,
      });

      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          error: "rate_limit_exceeded",
          message: `Rate limit: ${rateLimitResult.limit} requests per ${rateLimitResult.window}`,
          retryAfter: rateLimitResult.retryAfter,
        });
      }

      // Step 5: Payment verified - track and continue
      onPaymentVerified?.(verification);
      
      // Add payment info to request for downstream use
      (req as any).x402 = {
        payer: verification.payer,
        amount: verification.amount,
        txHash: verification.txHash,
        timestamp: Date.now(),
      };

      // Track the request
      await trackRequest({
        route,
        payer: verification.payer,
        amount: pricing.price,
        config,
        duration: Date.now() - startTime,
      });

      // Add response header with payment confirmation
      res.setHeader("x-payment-response", JSON.stringify({
        status: "accepted",
        txHash: verification.txHash,
        balance: verification.remainingBalance,
      }));

      next();
    } catch (error) {
      console.error("x402 middleware error:", error);
      onPaymentFailed?.(error as Error, req);
      
      res.status(500).json({
        error: "payment_processing_error",
        message: "Failed to process payment",
      });
    }
  };
}

/**
 * Send HTTP 402 Payment Required response
 */
function send402Response(
  res: Response,
  pricing: RoutePricing,
  config: X402Config
) {
  const requirements = buildPaymentRequirements(pricing, config);
  
  res.status(402).json({
    error: "payment_required",
    message: "This endpoint requires payment",
    ...requirements,
  });
}

/**
 * Build payment requirements object for 402 response
 */
function buildPaymentRequirements(pricing: RoutePricing, config: X402Config) {
  return {
    accepts: {
      scheme: "exact",
      network: config.payment.network,
      maxAmountRequired: pricing.price,
      resource: pricing.route || "*",
      description: pricing.description || `API access: ${pricing.price}`,
      mimeType: "application/json",
      payTo: config.payment.wallet,
      maxTimeoutSeconds: 60,
      asset: `eip155:${getChainId(config.payment.network)}/erc20:${getTokenAddress(config.payment.network, config.payment.token)}`,
      extra: {
        name: config.name,
        version: config.version,
      },
    },
    x402Version: 1,
  };
}

function getChainId(network: string): number {
  const chains: Record<string, number> = {
    "eip155:1": 1,
    "eip155:8453": 8453,
    "eip155:84532": 84532,
    "eip155:42161": 42161,
    "eip155:137": 137,
  };
  return chains[network] || 84532;
}

function getTokenAddress(network: string, token: string): string {
  // USDC addresses by network
  const usdc: Record<string, string> = {
    "eip155:1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "eip155:8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "eip155:84532": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "eip155:42161": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    "eip155:137": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  };
  return usdc[network] || usdc["eip155:84532"];
}

/**
 * Create middleware that allows certain routes to be free
 */
export function x402WithFreeRoutes(
  options: X402MiddlewareOptions,
  freeRoutes: string[]
) {
  const middleware = x402Middleware(options);
  
  return (req: Request, res: Response, next: NextFunction) => {
    const route = `${req.method} ${req.path}`;
    
    // Check if this route is free
    for (const freeRoute of freeRoutes) {
      if (matchRoute(route, freeRoute)) {
        return next();
      }
    }
    
    return middleware(req, res, next);
  };
}

function matchRoute(actual: string, pattern: string): boolean {
  // Convert pattern to regex
  const regex = new RegExp(
    "^" + pattern.replace(/\*/g, ".*").replace(/\//g, "\\/") + "$"
  );
  return regex.test(actual);
}
```

---

## Task 2: Payment Verifier

**File: `src/gateway/payment-verifier.ts`**

```typescript
import { createPublicClient, http, parseUnits, formatUnits } from "viem";
import { base, baseSepolia, arbitrum, mainnet, polygon } from "viem/chains";

export interface VerifyPaymentOptions {
  paymentHeader: string;
  expectedPrice: string;
  expectedPayTo: string;
  network: string;
  facilitatorUrl: string;
  testMode?: boolean;
}

export interface PaymentVerification {
  valid: boolean;
  payer: string;
  amount: string;
  txHash?: string;
  remainingBalance?: string;
  error?: string;
}

/**
 * Verify an x402 payment header
 */
export async function verifyPayment(
  options: VerifyPaymentOptions
): Promise<PaymentVerification> {
  const { paymentHeader, expectedPrice, expectedPayTo, network, facilitatorUrl, testMode } = options;

  try {
    // Parse the payment header
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());

    // In test mode, accept any valid-looking payment
    if (testMode) {
      return {
        valid: true,
        payer: payment.payer || "0xTestPayer",
        amount: expectedPrice,
        txHash: "0xtest_" + Date.now().toString(16),
      };
    }

    // Verify with facilitator
    const response = await fetch(`${facilitatorUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment,
        expectedPrice: parsePrice(expectedPrice),
        expectedPayTo,
        network,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        payer: payment.payer || "unknown",
        amount: "0",
        error: error.message || "Facilitator verification failed",
      };
    }

    const result = await response.json();

    return {
      valid: result.valid,
      payer: result.payer,
      amount: result.amount,
      txHash: result.txHash,
      remainingBalance: result.remainingBalance,
    };
  } catch (error) {
    return {
      valid: false,
      payer: "unknown",
      amount: "0",
      error: `Payment verification failed: ${error}`,
    };
  }
}

/**
 * Verify payment directly on-chain (without facilitator)
 */
export async function verifyPaymentOnChain(
  options: VerifyPaymentOptions
): Promise<PaymentVerification> {
  const { paymentHeader, expectedPrice, expectedPayTo, network } = options;

  try {
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());
    const chain = getChain(network);
    
    const client = createPublicClient({
      chain,
      transport: http(),
    });

    // Get transaction receipt
    const receipt = await client.getTransactionReceipt({
      hash: payment.txHash as `0x${string}`,
    });

    if (receipt.status !== "success") {
      return {
        valid: false,
        payer: payment.payer,
        amount: "0",
        error: "Transaction failed",
      };
    }

    // Verify the transfer event
    // This would parse ERC20 Transfer events and verify amount/recipient
    // Implementation depends on specific token contract

    return {
      valid: true,
      payer: payment.payer,
      amount: formatUnits(BigInt(payment.amount), 6), // USDC has 6 decimals
      txHash: payment.txHash,
    };
  } catch (error) {
    return {
      valid: false,
      payer: "unknown",
      amount: "0",
      error: `On-chain verification failed: ${error}`,
    };
  }
}

function parsePrice(price: string): bigint {
  // Parse "$0.01" format to wei
  const numericPrice = parseFloat(price.replace("$", ""));
  return parseUnits(numericPrice.toString(), 6); // USDC decimals
}

function getChain(network: string) {
  const chains: Record<string, any> = {
    "eip155:1": mainnet,
    "eip155:8453": base,
    "eip155:84532": baseSepolia,
    "eip155:42161": arbitrum,
    "eip155:137": polygon,
  };
  return chains[network] || baseSepolia;
}
```

---

## Task 3: Pricing Engine

**File: `src/gateway/pricing-engine.ts`**

```typescript
import type { X402Config, RoutePricing } from "../types/config.js";

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

/**
 * Get pricing for a specific route
 */
export function getPriceForRoute(
  route: string,
  config: X402Config
): PricingMatch | null {
  const routes = config.pricing?.routes || {};
  
  // First, try exact match
  if (routes[route]) {
    return normalizePricing(route, routes[route]);
  }

  // Then try pattern matching
  for (const [pattern, pricing] of Object.entries(routes)) {
    if (matchRoutePattern(route, pattern)) {
      return normalizePricing(route, pricing);
    }
  }

  // Fall back to default pricing
  if (config.pricing?.default) {
    return normalizePricing(route, config.pricing.default);
  }

  // No pricing = free endpoint
  return null;
}

/**
 * Match a route against a pattern
 * Supports wildcards: GET /api/* matches GET /api/users
 */
function matchRoutePattern(route: string, pattern: string): boolean {
  // Handle method + path patterns like "GET /api/*"
  const [patternMethod, patternPath] = pattern.split(" ");
  const [routeMethod, routePath] = route.split(" ");

  // Check method (or wildcard)
  if (patternMethod !== "*" && patternMethod !== routeMethod) {
    return false;
  }

  // Convert glob pattern to regex
  const regexPattern = patternPath
    .replace(/\//g, "\\/")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*");

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(routePath);
}

/**
 * Normalize pricing to consistent format
 */
function normalizePricing(
  route: string,
  pricing: string | RoutePricing
): PricingMatch {
  if (typeof pricing === "string") {
    return {
      route,
      price: pricing,
      currency: "USD",
    };
  }

  return {
    route,
    price: pricing.price,
    currency: pricing.currency || "USD",
    description: pricing.description,
    rateLimit: pricing.rateLimit,
  };
}

/**
 * Calculate dynamic pricing based on factors
 */
export function calculateDynamicPrice(
  basePrice: string,
  factors: {
    demandMultiplier?: number;
    timeOfDay?: number;
    userTier?: string;
  }
): string {
  let price = parseFloat(basePrice.replace("$", ""));

  // Apply demand multiplier (surge pricing)
  if (factors.demandMultiplier) {
    price *= factors.demandMultiplier;
  }

  // Apply time-of-day discount (off-peak)
  if (factors.timeOfDay !== undefined) {
    const hour = factors.timeOfDay;
    if (hour >= 0 && hour < 6) {
      price *= 0.5; // 50% off at night
    }
  }

  // Apply user tier discount
  if (factors.userTier === "premium") {
    price *= 0.8; // 20% off for premium
  } else if (factors.userTier === "enterprise") {
    price *= 0.6; // 40% off for enterprise
  }

  return `$${price.toFixed(6)}`;
}

/**
 * Get all configured routes with pricing
 */
export function getAllPricing(config: X402Config): PricingMatch[] {
  const routes = config.pricing?.routes || {};
  return Object.entries(routes).map(([route, pricing]) =>
    normalizePricing(route, pricing)
  );
}

/**
 * Validate pricing configuration
 */
export function validatePricing(config: X402Config): string[] {
  const errors: string[] = [];
  const routes = config.pricing?.routes || {};

  for (const [route, pricing] of Object.entries(routes)) {
    const price = typeof pricing === "string" ? pricing : pricing.price;
    
    if (!price.match(/^\$?\d+\.?\d*$/)) {
      errors.push(`Invalid price format for route "${route}": ${price}`);
    }

    const numericPrice = parseFloat(price.replace("$", ""));
    if (numericPrice < 0) {
      errors.push(`Negative price for route "${route}": ${price}`);
    }
    if (numericPrice > 1000) {
      errors.push(`Unusually high price for route "${route}": ${price}`);
    }
  }

  return errors;
}
```

---

## Task 4: MCP Server Wrapper

**File: `src/gateway/mcp-wrapper.ts`**

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { x402Middleware } from "./middleware.js";
import { generateDiscoveryDocument } from "../discovery/document.js";
import type { X402Config } from "../types/config.js";

export interface WrapMcpOptions {
  config: X402Config;
  server: Server;
  testMode?: boolean;
}

/**
 * Wrap an MCP server with x402 payment gateway
 */
export function wrapMcpServer(options: WrapMcpOptions): express.Application {
  const { config, server, testMode } = options;
  const app = express();

  // Parse JSON bodies
  app.use(express.json());

  // Health check endpoint (always free)
  app.get("/health", (req, res) => {
    res.json({ status: "ok", version: config.version });
  });

  // Discovery document (always free)
  app.get("/.well-known/x402", (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    res.json(generateDiscoveryDocument(origin, config));
  });

  // OpenAPI spec (always free)
  app.get("/openapi.json", (req, res) => {
    res.json(generateOpenApiSpec(config));
  });

  // Apply x402 middleware to /mcp endpoint
  app.use("/mcp", x402Middleware({ config, testMode }));

  // MCP protocol handler
  const transports = new Map<string, StreamableHTTPServerTransport>();

  app.all("/mcp", async (req, res) => {
    try {
      const sessionId = req.headers["mcp-session-id"] as string;
      let transport = transports.get(sessionId);

      if (!transport) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => crypto.randomUUID(),
        });
        await server.connect(transport);
        transports.set(transport.sessionId, transport);
      }

      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("MCP handler error:", error);
      res.status(500).json({ error: "MCP protocol error" });
    }
  });

  // Cleanup stale sessions periodically
  setInterval(() => {
    const maxAge = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    // Implementation for session cleanup
  }, 60 * 1000);

  return app;
}

/**
 * Generate OpenAPI spec for the wrapped MCP server
 */
function generateOpenApiSpec(config: X402Config) {
  return {
    openapi: "3.0.0",
    info: {
      title: config.name,
      version: config.version,
      description: `${config.name} - Monetized with x402`,
    },
    servers: [
      {
        url: "/",
        description: "x402-enabled API",
      },
    ],
    paths: {
      "/mcp": {
        post: {
          summary: "MCP Protocol Endpoint",
          description: "Model Context Protocol endpoint (requires x402 payment)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful response",
            },
            "402": {
              description: "Payment required",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PaymentRequired",
                  },
                },
              },
            },
          },
        },
      },
      "/health": {
        get: {
          summary: "Health Check",
          responses: {
            "200": {
              description: "Server is healthy",
            },
          },
        },
      },
      "/.well-known/x402": {
        get: {
          summary: "x402 Discovery Document",
          responses: {
            "200": {
              description: "Discovery document",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        PaymentRequired: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            accepts: {
              type: "object",
              properties: {
                scheme: { type: "string" },
                network: { type: "string" },
                maxAmountRequired: { type: "string" },
                payTo: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
}
```

---

## Task 5: Rate Limiter

**File: `src/gateway/rate-limiter.ts`**

```typescript
import type { X402Config } from "../types/config.js";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (replace with Redis for production)
const rateLimits = new Map<string, RateLimitEntry>();

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
 * Check rate limit for a payer
 */
export async function checkRateLimit(
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { payerAddress, route, config } = options;
  
  // Get rate limit config for this route
  const routeConfig = getRouteLimitConfig(route, config);
  const { requests: limit, windowMs } = routeConfig;
  
  const key = `${payerAddress}:${route}`;
  const now = Date.now();
  
  let entry = rateLimits.get(key);
  
  // Reset if window has passed
  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
  }
  
  // Check limit
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      window: formatWindow(windowMs),
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  
  // Increment count
  entry.count++;
  rateLimits.set(key, entry);
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    limit,
    window: formatWindow(windowMs),
  };
}

/**
 * Get rate limit config for a route
 */
function getRouteLimitConfig(
  route: string,
  config: X402Config
): { requests: number; windowMs: number } {
  // Check for route-specific limits
  const pricing = config.pricing?.routes?.[route];
  if (typeof pricing === "object" && pricing.rateLimit) {
    return {
      requests: pricing.rateLimit.requests,
      windowMs: parseWindow(pricing.rateLimit.window),
    };
  }
  
  // Default limits
  return {
    requests: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
  };
}

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*(s|m|h|d)$/);
  if (!match) return 60 * 60 * 1000;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  
  return value * (multipliers[unit] || 60 * 60 * 1000);
}

function formatWindow(ms: number): string {
  if (ms < 60 * 1000) return `${ms / 1000}s`;
  if (ms < 60 * 60 * 1000) return `${ms / 60 / 1000}m`;
  if (ms < 24 * 60 * 60 * 1000) return `${ms / 60 / 60 / 1000}h`;
  return `${ms / 24 / 60 / 60 / 1000}d`;
}

/**
 * Clear rate limits for a payer (e.g., after upgrade)
 */
export function clearRateLimits(payerAddress: string) {
  for (const key of rateLimits.keys()) {
    if (key.startsWith(payerAddress)) {
      rateLimits.delete(key);
    }
  }
}

/**
 * Get current rate limit status for a payer
 */
export function getRateLimitStatus(
  payerAddress: string,
  route: string
): RateLimitEntry | null {
  return rateLimits.get(`${payerAddress}:${route}`) || null;
}
```

---

## Task 6: Analytics Tracker

**File: `src/gateway/analytics.ts`**

```typescript
import type { X402Config } from "../types/config.js";

export interface RequestTrack {
  route: string;
  payer: string;
  amount: string;
  config: X402Config;
  duration: number;
  timestamp?: number;
}

export interface AnalyticsData {
  totalRequests: number;
  totalRevenue: number;
  uniquePayers: number;
  requestsByRoute: Record<string, number>;
  revenueByRoute: Record<string, number>;
  requestsByHour: number[];
}

// In-memory analytics (replace with proper storage for production)
const analytics: RequestTrack[] = [];

/**
 * Track a paid request
 */
export async function trackRequest(track: RequestTrack): Promise<void> {
  analytics.push({
    ...track,
    timestamp: Date.now(),
  });
  
  // Emit webhook if configured
  if (track.config.dashboard?.webhooks?.length) {
    await emitWebhooks(track);
  }
}

/**
 * Get analytics summary
 */
export function getAnalytics(
  timeRange: { start: number; end: number }
): AnalyticsData {
  const filtered = analytics.filter(
    (a) => a.timestamp! >= timeRange.start && a.timestamp! <= timeRange.end
  );
  
  const uniquePayers = new Set(filtered.map((a) => a.payer));
  const requestsByRoute: Record<string, number> = {};
  const revenueByRoute: Record<string, number> = {};
  const requestsByHour = new Array(24).fill(0);
  
  let totalRevenue = 0;
  
  for (const track of filtered) {
    const amount = parseFloat(track.amount.replace("$", ""));
    totalRevenue += amount;
    
    requestsByRoute[track.route] = (requestsByRoute[track.route] || 0) + 1;
    revenueByRoute[track.route] = (revenueByRoute[track.route] || 0) + amount;
    
    const hour = new Date(track.timestamp!).getHours();
    requestsByHour[hour]++;
  }
  
  return {
    totalRequests: filtered.length,
    totalRevenue,
    uniquePayers: uniquePayers.size,
    requestsByRoute,
    revenueByRoute,
    requestsByHour,
  };
}

/**
 * Get top payers
 */
export function getTopPayers(limit: number = 10) {
  const payerTotals = new Map<string, number>();
  
  for (const track of analytics) {
    const amount = parseFloat(track.amount.replace("$", ""));
    payerTotals.set(
      track.payer,
      (payerTotals.get(track.payer) || 0) + amount
    );
  }
  
  return Array.from(payerTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([payer, total]) => ({ payer, total }));
}

/**
 * Emit analytics to configured webhooks
 */
async function emitWebhooks(track: RequestTrack): Promise<void> {
  const webhooks = track.config.dashboard?.webhooks || [];
  
  for (const webhook of webhooks) {
    try {
      await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhook.secret && {
            "x-webhook-signature": await signWebhook(track, webhook.secret),
          }),
        },
        body: JSON.stringify({
          event: "payment.received",
          data: {
            route: track.route,
            payer: track.payer,
            amount: track.amount,
            timestamp: track.timestamp,
          },
        }),
      });
    } catch (error) {
      console.error(`Webhook failed: ${webhook.url}`, error);
    }
  }
}

async function signWebhook(data: any, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(JSON.stringify(data))
  );
  return Buffer.from(signature).toString("hex");
}
```

---

## Deliverables Checklist

- [ ] Complete `middleware.ts` with full x402 flow
- [ ] `payment-verifier.ts` with facilitator + on-chain verification
- [ ] `pricing-engine.ts` with pattern matching
- [ ] `mcp-wrapper.ts` for MCP servers
- [ ] `express-wrapper.ts` for Express APIs
- [ ] `rate-limiter.ts` with configurable limits
- [ ] `analytics.ts` with webhook support
- [ ] `index.ts` exporting all gateway functions

## Dependencies
```json
{
  "dependencies": {
    "viem": "^2.0.0",
    "express": "^4.18.0",
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
```
