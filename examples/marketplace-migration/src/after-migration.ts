/**
 * AFTER MIGRATION: x402 + AI Service Marketplace
 *
 * This example shows the same Weather API after migrating to the
 * AI Service Marketplace. New features:
 * - Service discovery for AI agents
 * - Subscription support
 * - Analytics tracking
 * - Reputation building
 *
 * Run: pnpm demo:after
 */

import express, { Request, Response, NextFunction } from "express";
import {
  MarketplaceService,
  SubscriptionManager,
  AnalyticsService,
  analyticsMiddleware,
} from "@nirholas/universal-crypto-mcp-marketplace";

const app = express();
app.use(express.json());

// ============================================================================
// Configuration (x402 + Marketplace)
// ============================================================================

const config = {
  port: 3002,
  chain: "arbitrum" as const,
  walletAddress: "0x40252CFDF8B20Ed757D61ff157719F33Ec332402" as `0x${string}`,
  privateKey: process.env.PRIVATE_KEY || "0x40252CFDF8B20Ed757D61ff157719F33Ec332402000000000000000000000001",
  marketplaceContract: "0x0000000000000000000000000000000000000001" as `0x${string}`,
  pricing: {
    "GET /api/weather": "$0.001",
    "GET /api/forecast": "$0.005",
    "GET /api/alerts": "$0.002",
  },
};

// ============================================================================
// Initialize Marketplace Services
// ============================================================================

const marketplace = new MarketplaceService({
  chain: config.chain,
  privateKey: config.privateKey,
});

const subscriptions = new SubscriptionManager({
  chain: config.chain,
  contractAddress: config.marketplaceContract,
});

const analytics = new AnalyticsService();

let serviceId: string;

// ============================================================================
// Register Service in Marketplace (Step 2 from migration guide)
// ============================================================================

async function registerService() {
  const service = await marketplace.registerService({
    name: "Weather API Pro",
    description: "Real-time weather data with 7-day forecasts and severe weather alerts. High accuracy, low latency.",
    category: "weather",
    endpoint: `http://localhost:${config.port}`,
    pricing: {
      payPerUse: "$0.001",
      subscription: {
        monthly: "$9.99",
        annually: "$99.99",
      },
    },
    walletAddress: config.walletAddress,
    tags: ["weather", "forecast", "alerts", "real-time"],
  });

  serviceId = service.id;
  console.log(`✅ Service registered in marketplace: ${serviceId}`);
  return service;
}

// ============================================================================
// Subscription Verification Middleware (Step 3 from migration guide)
// ============================================================================

interface AuthenticatedRequest extends Request {
  accessType?: "subscription" | "pay-per-use" | "free";
  walletAddress?: `0x${string}`;
}

async function verifyAccess(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const walletAddress = req.header("X-Wallet-Address") as `0x${string}` | undefined;

  // Check subscription first
  if (walletAddress && serviceId) {
    try {
      const isActive = await subscriptions.isActive(serviceId, walletAddress);
      if (isActive) {
        req.accessType = "subscription";
        req.walletAddress = walletAddress;
        console.log(`📋 Subscription access for ${walletAddress}`);
        return next();
      }
    } catch (error) {
      console.error("Subscription check error:", error);
    }
  }

  // Fall back to x402 payment check
  const paymentHeader = req.header("X-Payment");
  if (paymentHeader) {
    req.accessType = "pay-per-use";
    req.walletAddress = walletAddress;
    console.log(`💰 Pay-per-use payment from ${walletAddress || "unknown"}`);
    return next();
  }

  // No valid access - return 402
  const routeKey = `${req.method} ${req.path}`;
  const price = config.pricing[routeKey as keyof typeof config.pricing];

  res.status(402).json({
    error: "Payment Required",
    message: "Subscribe for unlimited access or pay per request",
    pricing: {
      payPerUse: price || "$0.001",
      subscription: {
        monthly: "$9.99",
        annually: "$99.99",
      },
    },
    payTo: config.walletAddress,
    subscribeUrl: `https://marketplace.example.com/services/${serviceId}`,
    acceptedTokens: ["USDC"],
    network: config.chain,
  });
}

// ============================================================================
// Analytics Tracking Middleware (Step 4 from migration guide)
// ============================================================================

function trackUsage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", async () => {
    if (serviceId) {
      await analytics.trackUsage({
        serviceId,
        endpoint: req.path,
        accessType: req.accessType || "pay-per-use",
        responseTime: Date.now() - start,
        statusCode: res.statusCode,
        userWallet: req.walletAddress,
      });
    }
  });

  next();
}

// ============================================================================
// Weather API Endpoints (Same as before)
// ============================================================================

// Free health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "2.0.0", marketplace: true });
});

// x402 discovery document (enhanced with marketplace info)
app.get("/.well-known/x402", async (_req: Request, res: Response) => {
  const analyticsData = serviceId 
    ? await marketplace.getAnalytics(serviceId, "month")
    : null;

  res.json({
    name: "Weather API Pro",
    version: "2.0.0",
    description: "Real-time weather data with forecasts and alerts",
    payment: {
      address: config.walletAddress,
      network: config.chain,
      tokens: ["USDC"],
    },
    pricing: config.pricing,
    subscription: {
      monthly: "$9.99",
      annually: "$99.99",
    },
    marketplace: {
      serviceId,
      discoverable: true,
    },
    stats: analyticsData ? {
      requests: analyticsData.requests,
      avgResponseTime: analyticsData.averageResponseTime,
    } : undefined,
  });
});

// Apply middleware to all API routes
app.use("/api", trackUsage);
app.use("/api", verifyAccess);

// Paid: Get current weather
app.get("/api/weather", (req: AuthenticatedRequest, res: Response) => {
  const city = req.query.city || "San Francisco";
  
  res.json({
    city,
    temperature: Math.round(15 + Math.random() * 15),
    humidity: Math.round(40 + Math.random() * 40),
    conditions: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
    windSpeed: Math.round(5 + Math.random() * 20),
    accessType: req.accessType,
    timestamp: new Date().toISOString(),
  });
});

// Paid: Get 7-day forecast
app.get("/api/forecast", (req: AuthenticatedRequest, res: Response) => {
  const city = req.query.city || "San Francisco";
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      high: Math.round(18 + Math.random() * 12),
      low: Math.round(8 + Math.random() * 8),
      conditions: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
      precipitation: Math.round(Math.random() * 100),
    });
  }

  res.json({
    city,
    forecast: days,
    accessType: req.accessType,
    timestamp: new Date().toISOString(),
  });
});

// Paid: Get weather alerts
app.get("/api/alerts", (req: AuthenticatedRequest, res: Response) => {
  const city = req.query.city || "San Francisco";
  
  res.json({
    city,
    alerts: [
      {
        type: "HEAT_ADVISORY",
        severity: "moderate",
        message: "High temperatures expected this afternoon",
        expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    accessType: req.accessType,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Analytics Endpoint (New with marketplace)
// ============================================================================

app.get("/api/analytics", async (_req: Request, res: Response) => {
  if (!serviceId) {
    res.status(503).json({ error: "Service not registered" });
    return;
  }

  const data = await marketplace.getAnalytics(serviceId, "month");
  res.json(data);
});

// ============================================================================
// Start Server
// ============================================================================

async function start() {
  await registerService();

  // Create a test subscription for demo
  await subscriptions.createSubscription({
    serviceId,
    subscriberWallet: "0xDEMO000000000000000000000000000000000001" as `0x${string}`,
    plan: "monthly",
    txHash: "0x40252CFDF8B20Ed757D61ff157719F33Ec332402000000000000000000000001" as `0x${string}`,
    price: "$9.99",
  });

  app.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              AFTER MIGRATION: x402 + Marketplace                  ║
╠══════════════════════════════════════════════════════════════════╣
║  Weather API Pro running at http://localhost:${config.port}                ║
║  Service ID: ${serviceId.padEnd(42)}       ║
║                                                                    ║
║  New Features:                                                     ║
║    ✅ Registered in AI Service Marketplace                        ║
║    ✅ Subscription support ($9.99/mo, $99.99/yr)                  ║
║    ✅ Analytics tracking enabled                                   ║
║    ✅ Discoverable by AI agents                                    ║
║                                                                    ║
║  Pricing:                                                          ║
║    GET /api/weather  - $0.001 per request OR subscription         ║
║    GET /api/forecast - $0.005 per request OR subscription         ║
║    GET /api/alerts   - $0.002 per request OR subscription         ║
║                                                                    ║
║  Test subscription access:                                         ║
║    curl -H "X-Wallet-Address: 0xDEMO000000000000000000000000000000000001" \\
║         http://localhost:${config.port}/api/weather?city=NYC              ║
║                                                                    ║
║  View analytics:                                                   ║
║    curl http://localhost:${config.port}/api/analytics                     ║
║                                                                    ║
║  x402 discovery:                                                   ║
║    curl http://localhost:${config.port}/.well-known/x402                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);

export { app };
