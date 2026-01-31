/**
 * BEFORE MIGRATION: x402-only API
 *
 * This example shows a typical x402 payment-gated API before
 * migrating to the AI Service Marketplace.
 *
 * Run: pnpm demo:before
 */

import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// ============================================================================
// Configuration (x402 only)
// ============================================================================

const config = {
  port: 3001,
  walletAddress: "0x40252CFDF8B20Ed757D61ff157719F33Ec332402" as `0x${string}`,
  pricing: {
    "GET /api/weather": "$0.001",
    "GET /api/forecast": "$0.005",
    "GET /api/alerts": "$0.002",
  },
};

// ============================================================================
// Simple x402 Payment Middleware (Simplified for demo)
// ============================================================================

interface PaymentInfo {
  amount: string;
  txHash: string;
  payer: string;
}

function parsePaymentHeader(header: string | undefined): PaymentInfo | null {
  if (!header) return null;
  try {
    return JSON.parse(Buffer.from(header, "base64").toString());
  } catch {
    return null;
  }
}

function x402Middleware(pricing: Record<string, string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const routeKey = `${req.method} ${req.path}`;
    const price = pricing[routeKey];

    // Skip if route is not priced
    if (!price) {
      return next();
    }

    // Check for payment
    const paymentHeader = req.header("X-Payment");
    const payment = parsePaymentHeader(paymentHeader);

    if (!payment) {
      // Return 402 Payment Required
      res.status(402).json({
        error: "Payment Required",
        price,
        payTo: config.walletAddress,
        acceptedTokens: ["USDC"],
        network: "arbitrum",
      });
      return;
    }

    // In production: verify payment on-chain
    // For demo, we accept any payment header
    console.log(`Payment received: ${payment.amount} from ${payment.payer}`);
    next();
  };
}

// ============================================================================
// Weather API Endpoints
// ============================================================================

// Free health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "1.0.0" });
});

// Apply x402 middleware
app.use(x402Middleware(config.pricing));

// Paid: Get current weather
app.get("/api/weather", (req: Request, res: Response) => {
  const city = req.query.city || "San Francisco";
  
  res.json({
    city,
    temperature: Math.round(15 + Math.random() * 15),
    humidity: Math.round(40 + Math.random() * 40),
    conditions: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
    windSpeed: Math.round(5 + Math.random() * 20),
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
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    BEFORE MIGRATION: x402 Only                    ║
╠══════════════════════════════════════════════════════════════════╣
║  Weather API running at http://localhost:${config.port}                    ║
║                                                                    ║
║  Pricing:                                                          ║
║    GET /api/weather  - $0.001 per request                         ║
║    GET /api/forecast - $0.005 per request                         ║
║    GET /api/alerts   - $0.002 per request                         ║
║                                                                    ║
║  Problems with x402 only:                                          ║
║    ❌ No service discovery - AI agents can't find you             ║
║    ❌ No subscriptions - users pay per request                    ║
║    ❌ No analytics - no visibility into usage                     ║
║    ❌ No reputation - no way to build trust                       ║
║                                                                    ║
║  Test with:                                                        ║
║    curl http://localhost:${config.port}/api/weather?city=NYC              ║
║    (Will return 402 - Payment Required)                            ║
╚══════════════════════════════════════════════════════════════════╝
  `);
});

export { app };
