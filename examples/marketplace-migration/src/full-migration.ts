/**
 * FULL MIGRATION EXAMPLE: Using MigrationHelper
 *
 * This example demonstrates using the MigrationHelper class for
 * an automated migration from x402 to the AI Service Marketplace.
 *
 * Run: pnpm demo:full
 */

import express, { Request, Response, NextFunction } from "express";
import { createMigrationHelper } from "@nirholas/universal-crypto-mcp-marketplace";

const app = express();
app.use(express.json());

// ============================================================================
// Your Existing x402 Configuration
// ============================================================================

const existingX402Config = {
  pricing: {
    "GET /api/weather": "$0.001",
    "GET /api/forecast": "$0.005",
    "GET /api/alerts": "$0.002",
  },
  wallet: "0x40252CFDF8B20Ed757D61ff157719F33Ec332402" as `0x${string}`,
};

// ============================================================================
// Migration Setup
// ============================================================================

const migration = createMigrationHelper({
  chain: "arbitrum",
  privateKey: process.env.PRIVATE_KEY || "0x40252CFDF8B20Ed757D61ff157719F33Ec332402000000000000000000000001",
  existingConfig: existingX402Config,
});

let serviceId: string;
let verifyAccess: (req: Request, res: Response, next: NextFunction) => Promise<void>;
let trackAnalytics: (req: Request, res: Response, next: NextFunction) => void;

// ============================================================================
// Run Migration
// ============================================================================

async function runMigration() {
  console.log("🚀 Starting migration to AI Service Marketplace...\n");

  // Step 1: Migrate service to marketplace
  const result = await migration.migrate({
    name: "Weather API Pro",
    description: "Real-time weather data with 7-day forecasts and severe weather alerts",
    category: "weather",
    endpoint: "http://localhost:3003",
    addSubscription: {
      monthly: "$9.99",
      annually: "$99.99",
    },
    tags: ["weather", "forecast", "alerts", "real-time"],
  });

  serviceId = result.service.id;

  console.log("✅ Migration completed!");
  console.log(`   Service ID: ${serviceId}`);
  console.log(`   Status: ${result.service.status}`);
  console.log("");

  // Step 2: Get middleware from migration helper
  const middleware = migration.createMiddleware(serviceId);
  verifyAccess = middleware.verifyAccess as any;
  trackAnalytics = middleware.trackAnalytics as any;

  // Step 3: Create demo subscription
  await result.subscriptions.createSubscription({
    serviceId,
    subscriberWallet: "0xDEMO000000000000000000000000000000000001" as `0x${string}`,
    plan: "monthly",
    txHash: "0x40252CFDF8B20Ed757D61ff157719F33Ec332402000000000000000000000001" as `0x${string}`,
    price: "$9.99",
  });

  console.log("✅ Test subscription created for demo wallet");
  console.log("");

  // Generate migration code for reference
  console.log("📝 Generated migration code:");
  console.log("─".repeat(60));
  const code = migration.generateMigrationCode({
    name: "Weather API Pro",
    description: "Real-time weather data with 7-day forecasts",
    category: "weather",
    addSubscription: { monthly: "$9.99", annually: "$99.99" },
  });
  console.log(code.slice(0, 500) + "\n... (truncated)\n");
  console.log("─".repeat(60));

  return result;
}

// ============================================================================
// Weather API Endpoints
// ============================================================================

// Free health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "3.0.0", migrated: true });
});

// x402 discovery document
app.get("/.well-known/x402", async (_req: Request, res: Response) => {
  const marketplace = migration.getMarketplace();
  const analyticsData = serviceId && marketplace
    ? await marketplace.getAnalytics(serviceId, "month")
    : null;

  res.json({
    name: "Weather API Pro",
    version: "3.0.0",
    migrated: true,
    marketplace: {
      serviceId,
      discoverable: true,
    },
    pricing: existingX402Config.pricing,
    subscription: {
      monthly: "$9.99",
      annually: "$99.99",
    },
    stats: analyticsData ? {
      requests: analyticsData.requests,
      revenue: analyticsData.revenue,
    } : undefined,
  });
});

// Middleware applied after server starts
app.use("/api", (req, res, next) => {
  if (trackAnalytics) {
    trackAnalytics(req, res, next);
  } else {
    next();
  }
});

app.use("/api", async (req, res, next) => {
  if (verifyAccess) {
    await verifyAccess(req, res, next);
  } else {
    next();
  }
});

// Paid: Get current weather
app.get("/api/weather", (req: Request, res: Response) => {
  const city = req.query.city || "San Francisco";
  
  res.json({
    city,
    temperature: Math.round(15 + Math.random() * 15),
    humidity: Math.round(40 + Math.random() * 40),
    conditions: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
    windSpeed: Math.round(5 + Math.random() * 20),
    accessType: (req as any).accessType || "pay-per-use",
    timestamp: new Date().toISOString(),
  });
});

// Paid: Get 7-day forecast
app.get("/api/forecast", (req: Request, res: Response) => {
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
    accessType: (req as any).accessType || "pay-per-use",
    timestamp: new Date().toISOString(),
  });
});

// Paid: Get weather alerts
app.get("/api/alerts", (req: Request, res: Response) => {
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
    accessType: (req as any).accessType || "pay-per-use",
    timestamp: new Date().toISOString(),
  });
});

// Analytics endpoint
app.get("/api/analytics", async (_req: Request, res: Response) => {
  const marketplace = migration.getMarketplace();
  if (!marketplace || !serviceId) {
    res.status(503).json({ error: "Service not ready" });
    return;
  }

  const data = await marketplace.getAnalytics(serviceId, "month");
  res.json(data);
});

// Subscription stats
app.get("/api/subscriptions", async (_req: Request, res: Response) => {
  const subscriptions = migration.getSubscriptions();
  if (!subscriptions || !serviceId) {
    res.status(503).json({ error: "Service not ready" });
    return;
  }

  const stats = await subscriptions.getSubscriptionStats(serviceId);
  res.json(stats);
});

// ============================================================================
// Start Server
// ============================================================================

async function start() {
  await runMigration();

  const port = 3003;
  app.listen(port, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║            FULL MIGRATION: Using MigrationHelper                  ║
╠══════════════════════════════════════════════════════════════════╣
║  Weather API Pro running at http://localhost:${port}                    ║
║  Service ID: ${serviceId.padEnd(42)}       ║
║                                                                    ║
║  Migration Benefits:                                               ║
║    ✅ Minimal code changes                                         ║
║    ✅ Automatic service registration                               ║
║    ✅ Built-in middleware for subscriptions                        ║
║    ✅ Analytics tracking enabled                                   ║
║    ✅ Backward compatible with x402                                ║
║                                                                    ║
║  Test Commands:                                                    ║
║                                                                    ║
║  1. Without payment (returns 402):                                 ║
║     curl http://localhost:${port}/api/weather                             ║
║                                                                    ║
║  2. With subscription:                                             ║
║     curl -H "X-Wallet-Address: 0xDEMO000000000000000000000000000000000001" \\
║          http://localhost:${port}/api/weather?city=NYC                    ║
║                                                                    ║
║  3. View analytics:                                                ║
║     curl http://localhost:${port}/api/analytics                           ║
║                                                                    ║
║  4. View subscription stats:                                       ║
║     curl http://localhost:${port}/api/subscriptions                       ║
║                                                                    ║
║  5. x402 discovery document:                                       ║
║     curl http://localhost:${port}/.well-known/x402                        ║
╚══════════════════════════════════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);

export { app };
