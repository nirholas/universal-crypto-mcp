/**
 * Complete x402 Marketplace & Discovery Integration Example
 * 
 * This example demonstrates how to integrate all the marketplace
 * and discovery features from Agent 13 & 14 into your x402 API.
 * 
 * Features included:
 * - Marketplace API endpoints
 * - Discovery document serving
 * - OpenAPI specification
 * - AI instructions (llms.txt)
 * - x402scan registration
 */

import express from "express";
import { createMarketplaceRouter } from "../src/marketplace/index.js";
import {
  discoveryMiddleware,
  generateOpenAPISpec,
  generateLlmsTxt,
  X402ScanClient,
  createRegistrationFromConfig,
  type OpenAPIConfig,
} from "../src/discovery/index.js";
import type { X402Config } from "../src/types/config.js";

// Example configuration
const config: X402Config & OpenAPIConfig = {
  name: "My Trading API",
  version: "1.0.0",
  description: "Real-time crypto trading signals with x402 payments",
  url: "https://api.example.com",
  payment: {
    wallet: "0x1234567890123456789012345678901234567890",
    network: "eip155:8453", // Base
    facilitator: "https://x402.org/facilitator",
  },
  pricing: {
    model: "per-call",
    default: "$0.001",
    routes: {
      "GET /api/signals": "$0.002",
      "POST /api/analyze": {
        price: "$0.005",
        description: "Analyze market data with AI",
      },
      "GET /api/portfolio": "$0.001",
    },
  },
  discovery: {
    instructions:
      "This API provides real-time crypto trading signals. Use the x-payment header with your payment proof to access protected endpoints.",
    ownershipProofs: ["dns-txt", "well-known"],
  },
};

/**
 * Create the Express app with all integrations
 */
function createApp() {
  const app = express();
  
  // Parse JSON bodies
  app.use(express.json());

  // 1. Add discovery middleware - serves /.well-known/x402
  app.use(discoveryMiddleware({ config }));

  // 2. Serve OpenAPI specification
  app.get("/openapi.json", (req, res) => {
    const spec = generateOpenAPISpec(config);
    res.json(spec);
  });

  // 3. Serve AI instructions (llms.txt)
  app.get("/llms.txt", (req, res) => {
    const llmsTxt = generateLlmsTxt(config);
    res.type("text/plain").send(llmsTxt);
  });

  // 4. Add marketplace endpoints
  app.use("/marketplace", createMarketplaceRouter());

  // 5. Your actual API endpoints
  app.get("/api/signals", (req, res) => {
    // This would be protected by x402 payment middleware
    res.json({
      signals: [
        { pair: "BTC/USD", action: "BUY", confidence: 0.85 },
        { pair: "ETH/USD", action: "HOLD", confidence: 0.72 },
      ],
    });
  });

  app.post("/api/analyze", (req, res) => {
    const { data } = req.body;
    // AI analysis logic here
    res.json({
      analysis: "Market is bullish",
      confidence: 0.78,
    });
  });

  app.get("/api/portfolio", (req, res) => {
    res.json({
      positions: [
        { asset: "BTC", amount: 0.5, value: 25000 },
        { asset: "ETH", amount: 10, value: 18000 },
      ],
    });
  });

  return app;
}

/**
 * Register with x402scan on startup
 */
async function registerWithX402Scan(config: X402Config) {
  const client = new X402ScanClient();
  
  try {
    const registration = createRegistrationFromConfig(
      config,
      config.url || "https://api.example.com"
    );
    
    const result = await client.register(registration);
    
    console.log("✅ Registered with x402scan!");
    console.log(`   View at: ${result.url}`);
    console.log(`   ID: ${result.id}`);
    
    return result;
  } catch (error) {
    console.error("❌ Failed to register with x402scan:", error);
    throw error;
  }
}

/**
 * Main startup function
 */
async function main() {
  const app = createApp();
  const port = process.env.PORT || 3000;

  // Register with x402scan before starting
  try {
    await registerWithX402Scan(config);
  } catch (error) {
    console.warn("⚠️ Continuing without x402scan registration");
  }

  // Start the server
  app.listen(port, () => {
    console.log(`\n🚀 x402 API Server running on port ${port}\n`);
    console.log("📚 Available endpoints:");
    console.log(`   ${config.url || `http://localhost:${port}`}/.well-known/x402`);
    console.log(`   ${config.url || `http://localhost:${port}`}/openapi.json`);
    console.log(`   ${config.url || `http://localhost:${port}`}/llms.txt`);
    console.log(`   ${config.url || `http://localhost:${port}`}/marketplace`);
    console.log(`   ${config.url || `http://localhost:${port}`}/api/signals`);
    console.log(`   ${config.url || `http://localhost:${port}`}/api/analyze`);
    console.log(`   ${config.url || `http://localhost:${port}`}/api/portfolio\n`);
  });
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { createApp, registerWithX402Scan, config };
