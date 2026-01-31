/**
 * Tool Pricing Configuration
 * 
 * Defines pricing for each MCP tool in USDC smallest units (6 decimals)
 * 1 USDC = 1,000,000 units
 * 
 * Pricing tiers:
 * - Free: 0
 * - Micro ($0.0001): 100
 * - Small ($0.001): 1000
 * - Medium ($0.01): 10000
 * - Large ($0.10): 100000
 * - Premium ($1.00): 1000000
 */

export interface ToolPricing {
  /** Price in USDC smallest unit (6 decimals) */
  priceUSDC: string
  /** Human-readable description */
  description: string
  /** Rate limit per minute */
  rateLimit: number
  /** Tool category */
  category: "read" | "write" | "premium" | "free"
}

export const TOOL_PRICING: Record<string, ToolPricing> = {
  // ═══════════════════════════════════════════════════════════════
  // FREE TIER - Basic read operations
  // ═══════════════════════════════════════════════════════════════
  "get_block": {
    priceUSDC: "0",
    description: "Get block information",
    rateLimit: 100,
    category: "free",
  },
  "get_chain_id": {
    priceUSDC: "0",
    description: "Get chain ID",
    rateLimit: 200,
    category: "free",
  },
  "get_gas_price": {
    priceUSDC: "0",
    description: "Get current gas price",
    rateLimit: 100,
    category: "free",
  },
  "health": {
    priceUSDC: "0",
    description: "Health check",
    rateLimit: 1000,
    category: "free",
  },
  "x402_networks": {
    priceUSDC: "0",
    description: "List supported networks",
    rateLimit: 100,
    category: "free",
  },

  // ═══════════════════════════════════════════════════════════════
  // MICRO TIER ($0.0001) - High-volume reads
  // ═══════════════════════════════════════════════════════════════
  "get_balance": {
    priceUSDC: "100",
    description: "Get wallet balance",
    rateLimit: 60,
    category: "read",
  },
  "get_token_balance": {
    priceUSDC: "100",
    description: "Get ERC-20 token balance",
    rateLimit: 60,
    category: "read",
  },
  "get_transaction": {
    priceUSDC: "100",
    description: "Get transaction details",
    rateLimit: 60,
    category: "read",
  },
  "get_transaction_receipt": {
    priceUSDC: "100",
    description: "Get transaction receipt",
    rateLimit: 60,
    category: "read",
  },
  "get_token_info": {
    priceUSDC: "100",
    description: "Get token metadata",
    rateLimit: 60,
    category: "read",
  },
  "resolve_ens": {
    priceUSDC: "100",
    description: "Resolve ENS name",
    rateLimit: 60,
    category: "read",
  },

  // ═══════════════════════════════════════════════════════════════
  // SMALL TIER ($0.001) - Market data & analytics
  // ═══════════════════════════════════════════════════════════════
  "get_token_price": {
    priceUSDC: "1000",
    description: "Get token price",
    rateLimit: 30,
    category: "read",
  },
  "get_market_data": {
    priceUSDC: "1000",
    description: "Get market data",
    rateLimit: 30,
    category: "read",
  },
  "get_trending_tokens": {
    priceUSDC: "1000",
    description: "Get trending tokens",
    rateLimit: 20,
    category: "read",
  },
  "get_crypto_news": {
    priceUSDC: "1000",
    description: "Get crypto news",
    rateLimit: 20,
    category: "read",
  },
  "get_fear_greed_index": {
    priceUSDC: "1000",
    description: "Get fear & greed index",
    rateLimit: 30,
    category: "read",
  },
  "get_dex_pairs": {
    priceUSDC: "1000",
    description: "Get DEX trading pairs",
    rateLimit: 30,
    category: "read",
  },
  "get_pool_info": {
    priceUSDC: "1000",
    description: "Get liquidity pool info",
    rateLimit: 30,
    category: "read",
  },
  "get_yield_opportunities": {
    priceUSDC: "1000",
    description: "Get yield farming opportunities",
    rateLimit: 20,
    category: "read",
  },

  // ═══════════════════════════════════════════════════════════════
  // MEDIUM TIER ($0.01) - Quote & simulation
  // ═══════════════════════════════════════════════════════════════
  "get_swap_quote": {
    priceUSDC: "10000",
    description: "Get DEX swap quote",
    rateLimit: 20,
    category: "read",
  },
  "get_bridge_quote": {
    priceUSDC: "10000",
    description: "Get cross-chain bridge quote",
    rateLimit: 20,
    category: "read",
  },
  "simulate_transaction": {
    priceUSDC: "10000",
    description: "Simulate transaction",
    rateLimit: 10,
    category: "read",
  },
  "analyze_token": {
    priceUSDC: "10000",
    description: "Deep token analysis",
    rateLimit: 10,
    category: "read",
  },
  "get_portfolio_value": {
    priceUSDC: "10000",
    description: "Calculate portfolio value",
    rateLimit: 10,
    category: "read",
  },
  "get_historical_prices": {
    priceUSDC: "10000",
    description: "Get historical price data",
    rateLimit: 10,
    category: "read",
  },
  "get_token_holders": {
    priceUSDC: "10000",
    description: "Get token holder list",
    rateLimit: 10,
    category: "read",
  },

  // ═══════════════════════════════════════════════════════════════
  // LARGE TIER ($0.10) - Write operations
  // ═══════════════════════════════════════════════════════════════
  "send_transaction": {
    priceUSDC: "100000",
    description: "Send transaction",
    rateLimit: 5,
    category: "write",
  },
  "swap_tokens": {
    priceUSDC: "100000",
    description: "Execute token swap",
    rateLimit: 5,
    category: "write",
  },
  "approve_token": {
    priceUSDC: "100000",
    description: "Approve token spending",
    rateLimit: 5,
    category: "write",
  },
  "transfer_token": {
    priceUSDC: "100000",
    description: "Transfer tokens",
    rateLimit: 5,
    category: "write",
  },
  "bridge_tokens": {
    priceUSDC: "100000",
    description: "Bridge tokens cross-chain",
    rateLimit: 3,
    category: "write",
  },
  "stake_tokens": {
    priceUSDC: "100000",
    description: "Stake tokens",
    rateLimit: 3,
    category: "write",
  },
  "unstake_tokens": {
    priceUSDC: "100000",
    description: "Unstake tokens",
    rateLimit: 3,
    category: "write",
  },

  // ═══════════════════════════════════════════════════════════════
  // PREMIUM TIER ($1.00) - Advanced operations
  // ═══════════════════════════════════════════════════════════════
  "deploy_contract": {
    priceUSDC: "1000000",
    description: "Deploy smart contract",
    rateLimit: 1,
    category: "premium",
  },
  "generate_wallet": {
    priceUSDC: "1000000",
    description: "Generate new wallet",
    rateLimit: 2,
    category: "premium",
  },
  "batch_transfer": {
    priceUSDC: "1000000",
    description: "Batch token transfer",
    rateLimit: 1,
    category: "premium",
  },
  "execute_flashloan": {
    priceUSDC: "1000000",
    description: "Execute flashloan",
    rateLimit: 1,
    category: "premium",
  },

  // ═══════════════════════════════════════════════════════════════
  // DEFAULT - Catch-all for unlisted tools
  // ═══════════════════════════════════════════════════════════════
  "_default": {
    priceUSDC: "1000", // $0.001 default
    description: "MCP tool access",
    rateLimit: 30,
    category: "read",
  },
}

/**
 * Get pricing for a tool, falling back to default
 */
export function getToolPricing(toolName: string): ToolPricing {
  return TOOL_PRICING[toolName] || TOOL_PRICING._default
}

/**
 * Format price from smallest unit to human-readable
 */
export function formatPrice(priceInSmallestUnit: string): string {
  const value = parseInt(priceInSmallestUnit, 10)
  if (value === 0) return "FREE"
  if (value < 1000) return `$${(value / 1_000_000).toFixed(6)}`
  if (value < 10000) return `$${(value / 1_000_000).toFixed(4)}`
  if (value < 100000) return `$${(value / 1_000_000).toFixed(3)}`
  return `$${(value / 1_000_000).toFixed(2)}`
}

/**
 * Get total price for multiple tool calls
 */
export function calculateBatchPrice(tools: string[]): string {
  let total = 0
  for (const tool of tools) {
    const pricing = getToolPricing(tool)
    total += parseInt(pricing.priceUSDC, 10)
  }
  return total.toString()
}
