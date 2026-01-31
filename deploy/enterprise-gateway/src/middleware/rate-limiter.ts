/**
 * Enterprise Rate Limiting
 * Multi-tier rate limiting with Redis backing for distributed deployments
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 */

import { Request, Response, NextFunction } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

// Rate limit tiers
export interface RateLimitTier {
  windowMs: number;
  max: number;
  message: string;
}

export const RATE_LIMIT_TIERS: Record<string, RateLimitTier> = {
  // Free tier - very limited
  free: {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: "Free tier limit exceeded. Pay with x402 for unlimited access."
  },
  // Paid requests - higher limits
  paid: {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Rate limit exceeded. Please slow down."
  },
  // Premium tier - highest limits
  premium: {
    windowMs: 60 * 1000,
    max: 10000,
    message: "Premium rate limit exceeded."
  }
};

// Track paid requests (in-memory for single instance, use Redis for distributed)
const paidRequests = new Map<string, { count: number; resetAt: number }>();

export function isPaidRequest(req: Request): boolean {
  // Check for x402 payment header
  return !!req.headers["x-payment"] || !!req.headers["x-payment-response"];
}

export function getClientId(req: Request): string {
  // Use wallet address if available, otherwise IP
  const wallet = req.headers["x-wallet-address"] as string;
  if (wallet) return `wallet:${wallet.toLowerCase()}`;
  
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `ip:${ip}`;
}

// Create rate limiter for free tier
export const freeTierLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: RATE_LIMIT_TIERS.free.windowMs,
  max: RATE_LIMIT_TIERS.free.max,
  message: { error: RATE_LIMIT_TIERS.free.message, code: 429 },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientId,
  skip: isPaidRequest // Skip rate limit for paid requests
});

// Create rate limiter for paid tier
export const paidTierLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: RATE_LIMIT_TIERS.paid.windowMs,
  max: RATE_LIMIT_TIERS.paid.max,
  message: { error: RATE_LIMIT_TIERS.paid.message, code: 429 },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientId
});

// Combined middleware that applies appropriate rate limit
export function adaptiveRateLimiter(req: Request, res: Response, next: NextFunction) {
  if (isPaidRequest(req)) {
    return paidTierLimiter(req, res, next);
  }
  return freeTierLimiter(req, res, next);
}

// DDoS protection - very strict global limit
export const ddosProtection: RateLimitRequestHandler = rateLimit({
  windowMs: 1000, // 1 second
  max: 100, // 100 requests per second per IP
  message: { error: "Too many requests", code: 429 },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware to track request costs
export function costTracker(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const clientId = getClientId(req);
    const isPaid = isPaidRequest(req);
    
    // Log for analytics
    console.log(JSON.stringify({
      type: "request",
      clientId,
      path: req.path,
      method: req.method,
      status: res.statusCode,
      duration,
      paid: isPaid,
      timestamp: new Date().toISOString()
    }));
  });
  
  next();
}
