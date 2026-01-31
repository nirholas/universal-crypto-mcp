/**
 * STANDALONE DEMO: AI Service Marketplace Migration
 *
 * This is a standalone demo that runs without workspace dependencies.
 * It demonstrates the marketplace migration concepts.
 *
 * Run: npx tsx examples/marketplace-migration/src/standalone-demo.ts
 */

import * as http from "http";

// ============================================================================
// Simplified Marketplace Classes (Inline for Demo)
// ============================================================================

interface ServicePricing {
  payPerUse?: string;
  subscription?: { monthly?: string; annually?: string };
}

interface RegisteredService {
  id: string;
  name: string;
  description: string;
  category: string;
  endpoint: string;
  pricing: ServicePricing;
  walletAddress: string;
  status: string;
  stats: { totalRequests: number; totalRevenue: string };
}

class MarketplaceService {
  private services: Map<string, RegisteredService> = new Map();
  private usageData: Map<string, any[]> = new Map();

  async registerService(data: any): Promise<RegisteredService> {
    const id = `svc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const service: RegisteredService = {
      id,
      ...data,
      status: "active",
      stats: { totalRequests: 0, totalRevenue: "0" },
    };
    this.services.set(id, service);
    return service;
  }

  async trackUsage(data: any): Promise<void> {
    const usage = this.usageData.get(data.serviceId) || [];
    usage.push({ ...data, timestamp: new Date() });
    this.usageData.set(data.serviceId, usage);

    const service = this.services.get(data.serviceId);
    if (service) {
      service.stats.totalRequests++;
    }
  }

  async getAnalytics(serviceId: string): Promise<any> {
    const service = this.services.get(serviceId);
    const usage = this.usageData.get(serviceId) || [];
    return {
      requests: usage.length,
      revenue: service?.stats.totalRevenue || "0",
      averageResponseTime: usage.length > 0
        ? Math.round(usage.reduce((sum, u) => sum + u.responseTime, 0) / usage.length)
        : 0,
    };
  }
}

class SubscriptionManager {
  private subscriptions: Map<string, any> = new Map();

  async isActive(serviceId: string, wallet: string): Promise<boolean> {
    const key = `${serviceId}:${wallet.toLowerCase()}`;
    const sub = this.subscriptions.get(key);
    if (!sub) return false;
    return sub.active && new Date(sub.endDate) > new Date();
  }

  async createSubscription(data: any): Promise<any> {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    const sub = {
      id: `sub_${Date.now().toString(36)}`,
      ...data,
      startDate: new Date(),
      endDate,
      active: true,
    };
    const key = `${data.serviceId}:${data.subscriberWallet.toLowerCase()}`;
    this.subscriptions.set(key, sub);
    return sub;
  }
}

// ============================================================================
// Configuration
// ============================================================================

const config = {
  port: 3002,
  walletAddress: "0x40252CFDF8B20Ed757D61ff157719F33Ec332402",
  pricing: {
    "/api/weather": "$0.001",
    "/api/forecast": "$0.005",
    "/api/alerts": "$0.002",
  },
};

// ============================================================================
// Initialize Services
// ============================================================================

const marketplace = new MarketplaceService();
const subscriptions = new SubscriptionManager();
let serviceId: string;

// ============================================================================
// HTTP Server
// ============================================================================

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${config.port}`);
  const path = url.pathname;
  const method = req.method || "GET";
  const start = Date.now();

  // Helper to send JSON
  const sendJson = (data: any, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
  };

  // Get headers
  const getHeader = (name: string) => {
    const value = req.headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : value;
  };

  // Track usage after response
  const trackUsage = (accessType: string, statusCode: number) => {
    if (serviceId && path.startsWith("/api/")) {
      marketplace.trackUsage({
        serviceId,
        endpoint: path,
        accessType,
        responseTime: Date.now() - start,
        statusCode,
      });
    }
  };

  try {
    // Health check
    if (path === "/health") {
      sendJson({ status: "ok", version: "2.0.0", marketplace: true });
      return;
    }

    // x402 discovery document
    if (path === "/.well-known/x402") {
      const analytics = serviceId ? await marketplace.getAnalytics(serviceId) : null;
      sendJson({
        name: "Weather API Pro",
        version: "2.0.0",
        description: "Real-time weather data with forecasts and alerts",
        payment: { address: config.walletAddress, network: "arbitrum", tokens: ["USDC"] },
        pricing: config.pricing,
        subscription: { monthly: "$9.99", annually: "$99.99" },
        marketplace: { serviceId, discoverable: true },
        stats: analytics,
      });
      return;
    }

    // API routes require payment
    if (path.startsWith("/api/")) {
      const walletAddress = getHeader("X-Wallet-Address");
      const paymentHeader = getHeader("X-Payment");

      // Check subscription
      if (walletAddress && serviceId) {
        const isActive = await subscriptions.isActive(serviceId, walletAddress);
        if (isActive) {
          console.log(`📋 Subscription access for ${walletAddress}`);
          
          // Handle specific endpoints
          if (path === "/api/weather") {
            const city = url.searchParams.get("city") || "San Francisco";
            trackUsage("subscription", 200);
            sendJson({
              city,
              temperature: Math.round(15 + Math.random() * 15),
              humidity: Math.round(40 + Math.random() * 40),
              conditions: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
              windSpeed: Math.round(5 + Math.random() * 20),
              accessType: "subscription",
              timestamp: new Date().toISOString(),
            });
            return;
          }

          if (path === "/api/forecast") {
            const city = url.searchParams.get("city") || "San Francisco";
            const days = [];
            for (let i = 0; i < 7; i++) {
              const date = new Date();
              date.setDate(date.getDate() + i);
              days.push({
                date: date.toISOString().split("T")[0],
                high: Math.round(18 + Math.random() * 12),
                low: Math.round(8 + Math.random() * 8),
                conditions: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
              });
            }
            trackUsage("subscription", 200);
            sendJson({ city, forecast: days, accessType: "subscription", timestamp: new Date().toISOString() });
            return;
          }

          if (path === "/api/alerts") {
            const city = url.searchParams.get("city") || "San Francisco";
            trackUsage("subscription", 200);
            sendJson({
              city,
              alerts: [{ type: "HEAT_ADVISORY", severity: "moderate", message: "High temperatures expected" }],
              accessType: "subscription",
              timestamp: new Date().toISOString(),
            });
            return;
          }

          if (path === "/api/analytics") {
            const data = await marketplace.getAnalytics(serviceId);
            sendJson(data);
            return;
          }
        }
      }

      // Check pay-per-use payment
      if (paymentHeader) {
        console.log(`💰 Pay-per-use payment received`);
        // Handle same as subscription but with "pay-per-use" access type
        if (path === "/api/weather") {
          const city = url.searchParams.get("city") || "San Francisco";
          trackUsage("pay-per-use", 200);
          sendJson({
            city,
            temperature: Math.round(15 + Math.random() * 15),
            conditions: ["Sunny", "Cloudy"][Math.floor(Math.random() * 2)],
            accessType: "pay-per-use",
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      // No valid payment - return 402
      trackUsage("none", 402);
      sendJson({
        error: "Payment Required",
        message: "Subscribe for unlimited access or pay per request",
        pricing: {
          payPerUse: config.pricing[path as keyof typeof config.pricing] || "$0.001",
          subscription: { monthly: "$9.99", annually: "$99.99" },
        },
        payTo: config.walletAddress,
        subscribeUrl: `https://marketplace.example.com/services/${serviceId}`,
        acceptedTokens: ["USDC"],
        network: "arbitrum",
      }, 402);
      return;
    }

    // 404 for unknown routes
    sendJson({ error: "Not Found" }, 404);
  } catch (error) {
    console.error("Error:", error);
    sendJson({ error: "Internal Server Error" }, 500);
  }
});

// ============================================================================
// Start Server
// ============================================================================

async function start() {
  // Register service
  const service = await marketplace.registerService({
    name: "Weather API Pro",
    description: "Real-time weather data with forecasts and alerts",
    category: "weather",
    endpoint: `http://localhost:${config.port}`,
    pricing: { payPerUse: "$0.001", subscription: { monthly: "$9.99", annually: "$99.99" } },
    walletAddress: config.walletAddress,
    tags: ["weather", "forecast", "alerts"],
  });
  serviceId = service.id;
  console.log(`✅ Service registered: ${serviceId}`);

  // Create demo subscription
  await subscriptions.createSubscription({
    serviceId,
    subscriberWallet: "0xDEMO000000000000000000000000000000000001",
    plan: "monthly",
    price: "$9.99",
  });
  console.log("✅ Demo subscription created");

  server.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║          STANDALONE DEMO: AI Service Marketplace                  ║
╠══════════════════════════════════════════════════════════════════╣
║  Weather API Pro running at http://localhost:${config.port}                ║
║  Service ID: ${serviceId.padEnd(42)}       ║
║                                                                    ║
║  Test Commands:                                                    ║
║                                                                    ║
║  1. Without payment (returns 402):                                 ║
║     curl http://localhost:${config.port}/api/weather                      ║
║                                                                    ║
║  2. With subscription:                                             ║
║     curl -H "X-Wallet-Address: 0xDEMO000000000000000000000000000000000001" \\
║          http://localhost:${config.port}/api/weather?city=NYC             ║
║                                                                    ║
║  3. View analytics:                                                ║
║     curl -H "X-Wallet-Address: 0xDEMO000000000000000000000000000000000001" \\
║          http://localhost:${config.port}/api/analytics                    ║
║                                                                    ║
║  4. x402 discovery:                                                ║
║     curl http://localhost:${config.port}/.well-known/x402                 ║
║                                                                    ║
║  Press Ctrl+C to stop                                              ║
╚══════════════════════════════════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);
