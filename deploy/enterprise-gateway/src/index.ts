/**
 * Enterprise Gateway - Main Server
 * Unified x402 payment gateway for all Universal Crypto MCP servers
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { 
  ddosProtection, 
  adaptiveRateLimiter, 
  costTracker 
} from "./middleware/rate-limiter.js";

import { 
  x402PaymentMiddleware, 
  x402DiscoveryMiddleware,
  generatePaymentRequirement
} from "./middleware/x402-payment.js";

import { 
  SERVER_PRICING, 
  WALLET_ADDRESS, 
  NETWORK,
  getAllToolPrices,
  getToolPrice 
} from "./config/pricing.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Payment", "X-Wallet-Address"]
}));

app.use(express.json({ limit: "10mb" }));

// DDoS protection
app.use(ddosProtection);

// Cost tracking for analytics
app.use(costTracker);

// ============ FREE ENDPOINTS ============

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    name: "Universal Crypto MCP Gateway",
    version: "1.0.0",
    author: "nirholas",
    description: "Enterprise x402 payment gateway for crypto AI tools",
    docs: "https://github.com/nirholas/universal-crypto-mcp",
    endpoints: {
      discovery: "/.well-known/x402",
      pricing: "/api/v1/pricing",
      servers: "/api/v1/servers",
      tools: "/api/v1/tools/:toolName"
    }
  });
});

// x402 Discovery
app.get("/.well-known/x402", x402DiscoveryMiddleware);

// Pricing endpoint
app.get("/api/v1/pricing", (req, res) => {
  res.json({
    payTo: WALLET_ADDRESS,
    network: NETWORK,
    currency: "USD",
    servers: SERVER_PRICING
  });
});

// List all servers
app.get("/api/v1/servers", (req, res) => {
  const servers = Object.entries(SERVER_PRICING).map(([id, server]) => ({
    id,
    name: server.name,
    category: server.category,
    toolCount: Object.keys(server.tools).length
  }));
  
  res.json({ servers, total: servers.length });
});

// Get server details
app.get("/api/v1/servers/:serverId", (req, res) => {
  const { serverId } = req.params;
  const server = SERVER_PRICING[serverId];
  
  if (!server) {
    return res.status(404).json({ error: "Server not found" });
  }
  
  res.json({
    id: serverId,
    ...server
  });
});

// ============ PAID ENDPOINTS ============

// Apply rate limiting
app.use("/api/v1/tools", adaptiveRateLimiter);

// Apply x402 payment verification
app.use("/api/v1/tools", x402PaymentMiddleware({ requirePayment: true }));

// List all tools (free preview)
app.get("/api/v1/tools", (req, res) => {
  const tools = getAllToolPrices();
  res.json({ 
    tools,
    total: Object.keys(tools).length,
    payTo: WALLET_ADDRESS,
    network: NETWORK
  });
});

// Execute a tool (requires payment)
app.post("/api/v1/tools/:toolName", async (req, res) => {
  const { toolName } = req.params;
  const { params, serverId } = req.body;
  
  // Find the tool
  let foundServer: string | null = null;
  let foundTool: any = null;
  
  if (serverId && SERVER_PRICING[serverId]?.tools[toolName]) {
    foundServer = serverId;
    foundTool = SERVER_PRICING[serverId].tools[toolName];
  } else {
    for (const [sId, server] of Object.entries(SERVER_PRICING)) {
      if (server.tools[toolName]) {
        foundServer = sId;
        foundTool = server.tools[toolName];
        break;
      }
    }
  }
  
  if (!foundTool) {
    return res.status(404).json({ 
      error: "Tool not found",
      availableServers: Object.keys(SERVER_PRICING)
    });
  }
  
  // Payment already verified by middleware
  // Execute the tool (placeholder - would call actual MCP server)
  try {
    res.json({
      success: true,
      tool: toolName,
      server: foundServer,
      price: foundTool.price,
      result: {
        message: `Tool ${toolName} executed successfully`,
        params,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Tool execution failed",
      details: error.message
    });
  }
});

// Get payment requirement for a tool
app.get("/api/v1/tools/:toolName/payment", (req, res) => {
  const { toolName } = req.params;
  const serverId = req.query.server as string;
  
  const price = getToolPrice(toolName, serverId);
  const requirement = generatePaymentRequirement(toolName, serverId);
  
  res.json({
    tool: toolName,
    price,
    requirement
  });
});

// ============ MCP PROTOCOL ENDPOINTS ============

// MCP tool invocation with payment
app.post("/mcp/invoke", adaptiveRateLimiter, x402PaymentMiddleware({ requirePayment: true }), async (req, res) => {
  const { method, params } = req.body;
  
  if (method === "tools/call") {
    const { name, arguments: args } = params;
    
    // Execute tool
    res.json({
      jsonrpc: "2.0",
      id: req.body.id || 1,
      result: {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            tool: name,
            params: args,
            timestamp: new Date().toISOString()
          })
        }]
      }
    });
  } else if (method === "tools/list") {
    // Return all available tools
    const tools = Object.entries(SERVER_PRICING).flatMap(([serverId, server]) =>
      Object.entries(server.tools).map(([toolName, tier]) => ({
        name: toolName,
        description: tier.description,
        price: tier.price,
        server: serverId,
        inputSchema: { type: "object", properties: {} }
      }))
    );
    
    res.json({
      jsonrpc: "2.0",
      id: req.body.id || 1,
      result: { tools }
    });
  } else {
    res.status(400).json({
      jsonrpc: "2.0",
      id: req.body.id || 1,
      error: { code: -32601, message: "Method not found" }
    });
  }
});

// ============ ERROR HANDLING ============

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    code: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    availableEndpoints: [
      "/",
      "/health",
      "/.well-known/x402",
      "/api/v1/pricing",
      "/api/v1/servers",
      "/api/v1/tools"
    ]
  });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          Universal Crypto MCP Gateway                        ║
║          Enterprise x402 Payment Gateway                     ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}                              ║
║  💰 Payments to: ${WALLET_ADDRESS.slice(0, 10)}...${WALLET_ADDRESS.slice(-8)}  ║
║  🔗 Network: ${NETWORK}                                    ║
║  📊 Servers: ${Object.keys(SERVER_PRICING).length} MCP servers loaded                        ║
║  🛠️  Tools: ${Object.values(SERVER_PRICING).reduce((acc, s) => acc + Object.keys(s.tools).length, 0)} tools available                             ║
╠══════════════════════════════════════════════════════════════╣
║  👤 Created by nirholas - x.com/nichxbt                      ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
