/**
 * x402 payment gate for the MCP gateway.
 *
 * Free of module-level singletons so the ordering of verify, settle and release
 * can be tested with injected collaborators.
 *
 * @license Apache-2.0
 */
import type { Request, Response, NextFunction } from "express"

import Logger from "@/utils/logger"
import { TOOL_PRICING, type ToolPricing } from "./pricing"
import type { RateLimiter } from "./rate-limiter"
import type { PaymentVerifier } from "./payment-verifier"
import type { UsageTracker } from "./usage-tracker"
import { ReplayGuard, authorizationKey } from "./replay-guard"

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

export interface PaymentGateConfig {
  payTo: string
  network: string
  verifier: Pick<PaymentVerifier, "verify" | "settle">
  rateLimiter: Pick<RateLimiter, "check">
  usageTracker: Pick<UsageTracker, "record">
}

/**
 * Format price from smallest unit to human-readable
 */
export function formatPrice(priceInSmallestUnit: string): string {
  const value = parseInt(priceInSmallestUnit, 10)
  return (value / 1_000_000).toFixed(4) // USDC has 6 decimals
}

/**
 * Extract tool name from MCP JSON-RPC request
 */
export function extractToolName(req: Request): string | null {
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

export function createPaymentGate(gate: PaymentGateConfig) {
  const { payTo, network, verifier, rateLimiter, usageTracker } = gate
  const replayGuard = new ReplayGuard()

  /**
   * Build x402 payment requirements for a tool
   */
  function buildPaymentRequirements(toolName: string, pricing: ToolPricing) {
    return {
      accepts: [
        {
          scheme: "exact",
          network,
          price: pricing.priceUSDC,
          payTo,
          token: USDC_BASE,
          maxTimeoutSeconds: 300,
        },
      ],
      description: pricing.description || `Access to ${toolName}`,
      resource: `/mcp/tool/${toolName}`,
      mimeType: "application/json",
    }
  }

  /**
   * x402 Payment Middleware
   */
  return async function x402Middleware(req: Request, res: Response, next: NextFunction) {
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
        network,
        payTo,
      })
    }

    // Verify payment
    try {
      const paymentData = JSON.parse(Buffer.from(paymentSignature, "base64").toString())
      const verification = await verifier.verify(paymentData, {
        expectedAmount: pricing.priceUSDC,
        expectedPayTo: payTo,
        expectedNetwork: network,
      })

      if (!verification.valid) {
        return res.status(402).json({
          error: "Payment Invalid",
          message: verification.reason || "Payment verification failed",
        })
      }

      // Rate limiting check (even with valid payment)
      const payer: string | undefined = paymentData.payload?.from ?? paymentData.from
      const clientId = payer || req.ip || "anonymous"
      const rateLimitResult = await rateLimiter.check(clientId, toolName)

      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          error: "Rate Limited",
          message: `Rate limit exceeded. Retry after ${rateLimitResult.retryAfter}s`,
          retryAfter: rateLimitResult.retryAfter,
        })
      }

      // Claim the authorization so it cannot buy a second call, then settle it.
      // The tool is released only after the facilitator confirms settlement.
      const claimKey = authorizationKey(paymentData)
      if (!replayGuard.claim(claimKey)) {
        return res.status(402).json({
          error: "Payment Already Used",
          message: "This payment authorization has already been used. Sign a new payment.",
        })
      }

      const requirements = {
        expectedAmount: pricing.priceUSDC,
        expectedPayTo: payTo,
        expectedNetwork: network,
      }
      let settlement
      try {
        settlement = await verifier.settle(paymentData, requirements)
      } catch (error) {
        replayGuard.release(claimKey)
        throw error
      }
      if (!settlement.valid) {
        replayGuard.release(claimKey)
        return res.status(402).json({
          error: "Payment Settlement Failed",
          message: settlement.reason || "The facilitator could not settle this payment",
        })
      }
      const transactionHash = settlement.transactionHash ?? verification.transactionHash

      // Track usage
      await usageTracker.record({
        tool: toolName,
        payer,
        amount: pricing.priceUSDC,
        network,
        timestamp: Date.now(),
        transactionHash,
      })

      // Attach payment info to request for downstream use
      ;(req as any).x402 = {
        payer,
        amount: pricing.priceUSDC,
        transactionHash,
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
}
