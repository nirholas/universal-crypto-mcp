/**
 * x402 Payment Middleware
 * @description Wraps MCP tools with optional x402 payment gating
 * 
 * @example
 * ```typescript
 * import { withX402 } from "./x402/middleware.js"
 * 
 * server.tool(
 *   "premium_analysis",
 *   "AI market analysis (0.01 USDC)",
 *   { symbol: z.string() },
 *   withX402(
 *     async ({ symbol }) => {
 *       // Your tool logic
 *       return { content: [{ type: "text", text: result }] }
 *     },
 *     { price: "0.01", token: "USDC", chain: "base" }
 *   )
 * )
 * ```
 */

export interface X402PaymentConfig {
  /** Price in token units (e.g., "0.01" for 1 cent) */
  price: string
  /** Token symbol: USDC, USDs, etc. */
  token: string
  /** Chain: base, arbitrum, ethereum */
  chain?: string
  /** Recipient address (defaults to env TOOL_PAYMENT_ADDRESS) */
  recipient?: string
  /** Enable free tier for certain conditions */
  freeTier?: (args: any) => boolean
}

type ToolHandler<T> = (args: T) => Promise<{ content: Array<{ type: string; text: string }> }>

/**
 * Wrap a tool handler with x402 payment verification
 */
export function withX402<T>(
  handler: ToolHandler<T>,
  config: X402PaymentConfig
): ToolHandler<T> {
  return async (args: T) => {
    // Check free tier
    if (config.freeTier && config.freeTier(args)) {
      return handler(args)
    }

    // Check if x402 is enabled
    const x402Enabled = process.env.X402_ENABLED === "true"
    if (!x402Enabled) {
      // Passthrough if x402 not configured
      return handler(args)
    }

    // Get payment proof from context (MCP meta or environment)
    const paymentProof = process.env.X402_PAYMENT_PROOF || (args as any)?._x402PaymentProof
    const facilitatorUrl = process.env.X402_FACILITATOR_URL || "https://facilitator.x402.dev"
    
    if (!paymentProof) {
      throw new Error(
        `Payment required: ${config.price} ${config.token}. ` +
        `Use x402 protocol to make payment. Facilitator: ${facilitatorUrl}`
      )
    }

    try {
      // Verify payment with facilitator
      const verifyResponse = await fetch(`${facilitatorUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: paymentProof,
          expectedPrice: config.price,
          expectedToken: config.token,
          toolId: config.toolId,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error(`Payment verification failed: ${verifyResponse.statusText}`)
      }

      const verification = await verifyResponse.json()
      
      if (!verification.valid) {
        throw new Error(`Payment invalid: ${verification.error || "Unknown error"}`)
      }

      console.log(`[x402] Payment verified: ${verification.payer} paid ${verification.amount} ${config.token}`)
      
      // Execute the handler with payment info attached
      const result = await handler(args)
      
      // Attach payment metadata to result if it's an object
      if (typeof result === "object" && result !== null) {
        (result as any)._x402Payment = {
          payer: verification.payer,
          amount: verification.amount,
          txHash: verification.txHash,
        }
      }
      
      return result
    } catch (error) {
      throw new Error(
        `x402 payment error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
}

/**
 * Create pricing info for tool description
 */
export function pricingInfo(config: X402PaymentConfig): string {
  return `💰 ${config.price} ${config.token} per call`
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(address: string): Promise<boolean> {
  const subscriptionContractAddress = process.env.X402_SUBSCRIPTION_CONTRACT
  const rpcUrl = process.env.X402_RPC_URL || process.env.ETH_RPC_URL
  
  if (!subscriptionContractAddress || !rpcUrl) {
    // If not configured, assume no subscription system
    return false
  }

  try {
    // Query subscription contract
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [
          {
            to: subscriptionContractAddress,
            data: 
              "0x" + 
              // getSubscription(address) selector
              "a0f4c3c5" + 
              // Pad address to 32 bytes
              address.slice(2).padStart(64, "0"),
          },
          "latest",
        ],
      }),
    })

    const result = await response.json()
    
    if (!result.result || result.result === "0x") {
      return false
    }

    // Parse result: (uint8 tier, uint256 expiresAt, uint256 usageCount)
    const data = result.result.slice(2)
    const tier = parseInt(data.slice(0, 64), 16)
    const expiresAt = parseInt(data.slice(64, 128), 16)
    
    // Check if subscription is active (tier > 0 and not expired)
    const now = Math.floor(Date.now() / 1000)
    return tier > 0 && expiresAt > now
  } catch (error) {
    console.error("[x402] Subscription check error:", error)
    return false
  }
}

export default withX402
