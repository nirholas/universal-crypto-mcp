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
import type { Request, Response, NextFunction } from "express"
import { createHash } from "crypto"

import Logger from "@/utils/logger"
import { TOOL_PRICING, type ToolPricing } from "./pricing"
import { RateLimiter } from "./rate-limiter"
import { PaymentVerifier } from "./payment-verifier"
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

/**
 * Build x402 payment requirements for a tool
 */
function buildPaymentRequirements(toolName: string, pricing: ToolPricing) {
  return {
    accepts: [
      {
        scheme: "exact",
        network: NETWORK,
        price: pricing.priceUSDC,
        payTo: PAY_TO_ADDRESS,
        token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
        maxTimeoutSeconds: 300,
      }
    ],
    description: pricing.description || `Access to ${toolName}`,
    resource: `/mcp/tool/${toolName}`,
    mimeType: "application/json",
  }
}

/**
 * x402 Payment Middleware
 */
async function x402Middleware(req: Request, res: Response, next: NextFunction) {
  // Skip payment for health/info endpoints
  if (req.path === "/health" || req.path === "/" || req.path === "/pricing") {
    return next()
  }

  // Extract tool name from MCP request
  const toolName = extractToolName(req)
  if (!toolName) {
    return next() // Not a tool call, pass through
  }

  // Get pricing for this tool
  const pricing = TOOL_PRICING[toolName] || TOOL_PRICING._default
  
  // Free tier check
  if (pricing.priceUSDC === "0") {
    return next()
  }

  // Check for payment signature
  const paymentSignature = req.headers["x-payment"] as string | undefined

  if (!paymentSignature) {
    // Return 402 Payment Required
    res.status(402)
    res.setHeader("Content-Type", "application/json")
    res.setHeader(
      "X-Payment-Required",
      Buffer.from(JSON.stringify(buildPaymentRequirements(toolName, pricing))).toString("base64")
    )
    return res.json({
      error: "Payment Required",
      message: `This tool requires payment of $${formatPrice(pricing.priceUSDC)} USDC`,
      tool: toolName,
      price: pricing.priceUSDC,
      network: NETWORK,
      payTo: PAY_TO_ADDRESS,
    })
  }

  // Verify payment
  try {
    const paymentData = JSON.parse(Buffer.from(paymentSignature, "base64").toString())
    const verification = await paymentVerifier.verify(paymentData, {
      expectedAmount: pricing.priceUSDC,
      expectedPayTo: PAY_TO_ADDRESS,
      expectedNetwork: NETWORK,
    })

    if (!verification.valid) {
      return res.status(402).json({
        error: "Payment Invalid",
        message: verification.reason || "Payment verification failed",
      })
    }

    // Rate limiting check (even with valid payment)
    const clientId = paymentData.from || req.ip || "anonymous"
    const rateLimitResult = await rateLimiter.check(clientId, toolName)
    
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        error: "Rate Limited",
        message: `Rate limit exceeded. Retry after ${rateLimitResult.retryAfter}s`,
        retryAfter: rateLimitResult.retryAfter,
      })
    }

    // Track usage
    await usageTracker.record({
      tool: toolName,
      payer: paymentData.from,
      amount: pricing.priceUSDC,
      network: NETWORK,
      timestamp: Date.now(),
      transactionHash: verification.transactionHash,
    })

    // Attach payment info to request for downstream use
    ;(req as any).x402 = {
      payer: paymentData.from,
      amount: pricing.priceUSDC,
      transactionHash: verification.transactionHash,
    }

    next()
  } catch (error) {
    Logger.error("Payment verification error", { error })
    return res.status(400).json({
      error: "Payment Error",
      message: "Invalid payment signature format",
    })
  }
}

/**
 * Extract tool name from MCP JSON-RPC request
 */
function extractToolName(req: Request): string | null {
  try {
    const body = req.body
    if (body?.method === "tools/call" && body?.params?.name) {
      return body.params.name
    }
    // Check URL path for REST-style calls
    const match = req.path.match(/\/tool\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return match[1]
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

/**
 * Format price from smallest unit to human-readable
 */
function formatPrice(priceInSmallestUnit: string): string {
  const value = parseInt(priceInSmallestUnit, 10)
  return (value / 1_000_000).toFixed(4) // USDC has 6 decimals
}

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
