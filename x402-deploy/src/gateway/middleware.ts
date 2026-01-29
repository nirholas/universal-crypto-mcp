import type { Request, Response, NextFunction } from "express";
import { verifyPayment, PaymentVerification } from "./payment-verifier.js";
import { getPriceForRoute, checkRateLimit, trackRequest } from "./helpers.js";
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
        facilitatorUrl: facilitatorUrl || config.payment.facilitator || "https://facilitator.x402.dev",
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
        txHash: verification.txHash,
        network: config.payment.network,
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
