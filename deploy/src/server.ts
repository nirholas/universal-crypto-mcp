/**
 * Universal Crypto MCP - Enterprise Gateway Server
 * 
 * Unified x402 payment gateway for all MCP servers and APIs
 * 
 * @author nich (@nichxbt)
 * @license Apache-2.0
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "./config.js";
import { x402Middleware, X402Config, RateLimiter, MemoryRateLimitStore } from "./gateway/index.js";
import { prometheusMetrics, healthCheck } from "./monitoring/index.js";
import { registerAllTools } from "./tools/index.js";

// Types
interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
  createdAt: number;
  payer?: string;
}

// Session management
const sessions = new Map<string, SessionInfo>();

// Initialize rate limiter
const rateLimiter = new RateLimiter(
  {
    enabled: true,
    maxRequests: config.rateLimit.maxRequests,
    windowSeconds: config.rateLimit.windowSeconds,
    perPayer: true,
  },
  new MemoryRateLimitStore()
);

// Create MCP Server
function createMcpServer(): Server {
  const server = new Server(
    {
      name: config.server.name,
      version: config.server.version,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Register all tools from packages
  registerAllTools(server);

  return server;
}

// Create Express app
function createApp(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // MCP needs flexibility
  }));
  app.use(cors({
    origin: config.server.corsOrigins,
    credentials: true,
  }));
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });

  // Prometheus metrics endpoint
  app.get("/metrics", prometheusMetrics);

  // Health check endpoint (free)
  app.get("/health", healthCheck);
  app.get("/healthz", healthCheck);
  app.get("/ready", healthCheck);

  // x402 Discovery document (free)
  app.get("/.well-known/x402", (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    res.json(generateDiscoveryDocument(origin));
  });

  // OpenAPI spec (free)
  app.get("/openapi.json", (req, res) => {
    res.json(generateOpenApiSpec());
  });

  // Pricing info (free)
  app.get("/pricing", (req, res) => {
    res.json(config.pricing);
  });

  // Create MCP server instance
  const mcpServer = createMcpServer();

  // Apply x402 middleware to /mcp endpoint
  app.use("/mcp", createX402Middleware());

  // MCP protocol handler
  app.all("/mcp", async (req, res) => {
    try {
      const sessionId = req.headers["mcp-session-id"] as string;
      let sessionInfo = sessions.get(sessionId);

      if (!sessionInfo) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => crypto.randomUUID(),
        });
        await mcpServer.connect(transport);
        sessionInfo = {
          transport,
          lastActivity: Date.now(),
          createdAt: Date.now(),
          payer: (req as any).x402?.payer,
        };
        sessions.set(transport.sessionId, sessionInfo);
        
        console.log(`[MCP] New session created: ${transport.sessionId}`);
      } else {
        sessionInfo.lastActivity = Date.now();
      }

      await sessionInfo.transport.handleRequest(req, res);
    } catch (error) {
      console.error("[MCP] Handler error:", error);
      res.status(500).json({ error: "MCP protocol error" });
    }
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Error]", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

// Create x402 middleware
function createX402Middleware() {
  const x402Config: X402Config = {
    name: config.server.name,
    version: config.server.version,
    description: config.server.description,
    payment: {
      wallet: config.payment.wallet,
      network: config.payment.network,
      token: config.payment.token,
      facilitator: config.payment.facilitator,
    },
    pricing: config.pricing,
    rateLimit: config.rateLimit,
  };

  return x402Middleware({
    config: x402Config,
    testMode: config.server.testMode,
    onPaymentVerified: (payment) => {
      console.log(`[x402] Payment verified: ${payment.payer} paid ${payment.amount}`);
    },
    onPaymentFailed: (error, req) => {
      console.error(`[x402] Payment failed: ${error.message}`);
    },
  });
}

// Generate x402 discovery document
function generateDiscoveryDocument(origin: string) {
  return {
    name: config.server.name,
    version: config.server.version,
    description: config.server.description,
    url: origin,
    mcp_endpoint: `${origin}/mcp`,
    payment: {
      wallet: config.payment.wallet,
      network: config.payment.network,
      token: config.payment.token,
      facilitator: config.payment.facilitator,
      chains: ["base", "base-sepolia", "ethereum", "arbitrum", "polygon"],
    },
    pricing: config.pricing,
    capabilities: {
      mcp: true,
      streaming: true,
      tools: true,
      resources: true,
    },
    rate_limits: {
      free_tier: null,
      paid_tier: {
        requests_per_minute: config.rateLimit.maxRequests,
        window_seconds: config.rateLimit.windowSeconds,
      },
    },
    documentation: `${origin}/docs`,
    openapi: `${origin}/openapi.json`,
    support: {
      email: "support@universal-crypto-mcp.dev",
      twitter: "@nichxbt",
    },
  };
}

// Generate OpenAPI spec
function generateOpenApiSpec() {
  return {
    openapi: "3.0.0",
    info: {
      title: config.server.name,
      version: config.server.version,
      description: config.server.description,
      contact: {
        name: "nich",
        url: "https://x.com/nichxbt",
      },
    },
    servers: [
      {
        url: "/",
        description: "x402-enabled API Gateway",
      },
    ],
    paths: {
      "/mcp": {
        post: {
          summary: "MCP Protocol Endpoint",
          description: "Model Context Protocol endpoint - requires x402 payment",
          security: [{ x402: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
          responses: {
            "200": { description: "Successful response" },
            "402": { 
              description: "Payment required",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaymentRequired" },
                },
              },
            },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
      "/health": {
        get: {
          summary: "Health Check",
          responses: { "200": { description: "Server is healthy" } },
        },
      },
      "/pricing": {
        get: {
          summary: "Get Pricing Information",
          responses: { "200": { description: "Pricing details" } },
        },
      },
      "/.well-known/x402": {
        get: {
          summary: "x402 Discovery Document",
          responses: { "200": { description: "Discovery document" } },
        },
      },
    },
    components: {
      securitySchemes: {
        x402: {
          type: "apiKey",
          in: "header",
          name: "x-payment",
          description: "x402 payment header",
        },
      },
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

// Session cleanup
function startSessionCleanup() {
  const maxAge = 30 * 60 * 1000; // 30 minutes
  
  setInterval(() => {
    const now = Date.now();
    for (const [sessionId, sessionInfo] of sessions.entries()) {
      if (now - sessionInfo.lastActivity > maxAge) {
        console.log(`[MCP] Cleaning up stale session: ${sessionId}`);
        sessions.delete(sessionId);
      }
    }
  }, 60 * 1000);
}

// Main entry point
async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Universal Crypto MCP - Enterprise Gateway");
  console.log("  x402 Payment-Enabled API Platform");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  Name: ${config.server.name}`);
  console.log(`  Version: ${config.server.version}`);
  console.log(`  Network: ${config.payment.network}`);
  console.log(`  Wallet: ${config.payment.wallet.slice(0, 10)}...`);
  console.log(`  Test Mode: ${config.server.testMode}`);
  console.log("═══════════════════════════════════════════════════════════");

  const app = createApp();
  const port = config.server.port;

  startSessionCleanup();

  app.listen(port, () => {
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Metrics: http://localhost:${port}/metrics`);
    console.log(`💰 Pricing: http://localhost:${port}/pricing`);
    console.log(`📋 Discovery: http://localhost:${port}/.well-known/x402`);
    console.log(`🔌 MCP Endpoint: http://localhost:${port}/mcp`);
    console.log("\n✅ Ready to accept x402 payments!");
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
