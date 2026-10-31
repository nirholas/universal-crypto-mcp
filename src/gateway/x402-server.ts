/**
 * x402 Payment Gateway Server
 * 
 * Enterprise-grade MCP server wrapper with:
 * - Per-tool x402 payment gates
 * - Rate limiting (Redis-backed)
 * - Usage analytics
 * - Multi-chain payment support
 * 
 * @author nich
 * @license Apache-2.0
 */
import "dotenv/config"

import cors from "cors"
import express from "express"

import Logger from "@/utils/logger"
import { TOOL_PRICING } from "./pricing"
import { RateLimiter } from "./rate-limiter"
import { PaymentVerifier } from "./payment-verifier"
import { createPaymentGate, formatPrice } from "./payment-gate"
import { UsageTracker } from "./usage-tracker"

// Environment configuration
const PORT = parseInt(process.env.PORT || "3402", 10)
const PAY_TO_ADDRESS = process.env.X402_PAY_TO || "0x40252CFDF8B20Ed757D61ff157719F33Ec332402"
const NETWORK = process.env.X402_NETWORK || "eip155:8453" // Base mainnet
const REDIS_URL = process.env.REDIS_URL || undefined
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || "https://x402.org/facilitator"

// Initialize services
const rateLimiter = new RateLimiter(REDIS_URL)
const paymentVerifier = new PaymentVerifier(FACILITATOR_URL)
const usageTracker = new UsageTracker()
const x402Middleware = createPaymentGate({
  payTo: PAY_TO_ADDRESS,
  network: NETWORK,
  verifier: paymentVerifier,
  rateLimiter,
  usageTracker,
})

/**
 * Start the x402 Gateway Server
 */
export async function startX402Server() {
  const app = express()

  // Middleware
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Payment", "X-API-Key", "mcp-session-id"],
    exposedHeaders: ["X-Payment-Required", "X-Payment-Response"],
  }))
  app.use(express.json({ limit: "10mb" }))

  // x402 Payment gate
  app.use(x402Middleware)

  // Health check
  app.get("/health", (_req, res) => {
    res.json({
      status: "healthy",
      name: "Universal Crypto MCP (x402)",
      version: "1.0.0",
      network: NETWORK,
      payTo: PAY_TO_ADDRESS,
      timestamp: new Date().toISOString(),
    })
  })

  // Pricing info
  app.get("/pricing", (_req, res) => {
    const pricing = Object.entries(TOOL_PRICING).map(([tool, config]) => ({
      tool,
      priceUSDC: config.priceUSDC,
      priceFormatted: `$${formatPrice(config.priceUSDC)}`,
      description: config.description,
      rateLimit: config.rateLimit,
      category: config.category,
    }))
    res.json({
      network: NETWORK,
      payTo: PAY_TO_ADDRESS,
      facilitator: FACILITATOR_URL,
      tools: pricing,
    })
  })

  // Usage stats (for dashboard)
  app.get("/stats", async (_req, res) => {
    const stats = await usageTracker.getStats()
    res.json(stats)
  })

  // Import and mount the actual MCP server
  const { startHTTPServer } = await import("@/server/http")
  
  // Forward MCP requests to the actual server
  app.use("/mcp", async (req, res, next) => {
    // The actual MCP handling is done by the base server
    // This wrapper just adds the payment gate
    next()
  })

  // Start server
  const server = app.listen(PORT, "0.0.0.0", () => {
    Logger.info(`🚀 x402 Gateway Server started`, {
      port: PORT,
      network: NETWORK,
      payTo: PAY_TO_ADDRESS,
      facilitator: FACILITATOR_URL,
    })
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  x402 Universal Crypto MCP Gateway                           ║
╠══════════════════════════════════════════════════════════════╣
║  🌐 Server:      http://localhost:${PORT}                       ║
║  💰 Pay To:      ${PAY_TO_ADDRESS.slice(0, 10)}...${PAY_TO_ADDRESS.slice(-8)}          ║
║  ⛓️  Network:     ${NETWORK.padEnd(20)}                    ║
║  📊 Pricing:     http://localhost:${PORT}/pricing               ║
║  🏥 Health:      http://localhost:${PORT}/health                ║
╚══════════════════════════════════════════════════════════════╝
    `)
  })

  return { app, server }
}

// Direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  startX402Server().catch((error) => {
    Logger.error("Failed to start x402 server", { error })
    process.exit(1)
  })
}
