/**
 * Enterprise Pricing Configuration
 * All MCP servers and APIs with x402 payment tiers
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 */

export interface PricingTier {
  price: string;
  description: string;
}

export interface ServerPricing {
  name: string;
  category: string;
  tools: Record<string, PricingTier>;
}

export const WALLET_ADDRESS = process.env.X402_WALLET || "0x40252CFDF8B20Ed757D61ff157719F33Ec332402";
export const NETWORK = process.env.X402_NETWORK || "eip155:8453"; // Base
export const FACILITATOR = process.env.X402_FACILITATOR || "https://facilitator.x402.dev";

// Pricing in USD - converted to USDC at runtime
export const SERVER_PRICING: Record<string, ServerPricing> = {
  // ============ DeFi Protocols ============
  "aave-mcp": {
    name: "Aave V3 MCP",
    category: "defi",
    tools: {
      "aave_get_reserves": { price: "$0.001", description: "Get reserve data" },
      "aave_get_user_data": { price: "$0.002", description: "Get user position" },
      "aave_supply": { price: "$0.01", description: "Supply assets" },
      "aave_borrow": { price: "$0.01", description: "Borrow assets" },
      "aave_repay": { price: "$0.01", description: "Repay debt" },
      "aave_withdraw": { price: "$0.01", description: "Withdraw assets" }
    }
  },
  "uniswap-v3-mcp": {
    name: "Uniswap V3 MCP",
    category: "defi",
    tools: {
      "uniswap_get_pool": { price: "$0.001", description: "Get pool info" },
      "uniswap_get_quote": { price: "$0.002", description: "Get swap quote" },
      "uniswap_swap": { price: "$0.02", description: "Execute swap" },
      "uniswap_add_liquidity": { price: "$0.02", description: "Add liquidity" },
      "uniswap_remove_liquidity": { price: "$0.02", description: "Remove liquidity" }
    }
  },
  "curve-mcp": {
    name: "Curve Finance MCP",
    category: "defi",
    tools: {
      "curve_get_pools": { price: "$0.001", description: "List pools" },
      "curve_get_pool_info": { price: "$0.001", description: "Pool details" },
      "curve_get_virtual_price": { price: "$0.001", description: "Virtual price" },
      "curve_get_gauge_rewards": { price: "$0.002", description: "Gauge rewards" }
    }
  },
  "compound-v3-mcp": {
    name: "Compound V3 MCP",
    category: "defi",
    tools: {
      "compound_get_markets": { price: "$0.001", description: "Get markets" },
      "compound_get_account": { price: "$0.002", description: "Account position" },
      "compound_supply": { price: "$0.01", description: "Supply collateral" },
      "compound_borrow": { price: "$0.01", description: "Borrow base asset" }
    }
  },
  "lido-mcp": {
    name: "Lido Staking MCP",
    category: "defi",
    tools: {
      "lido_get_stats": { price: "$0.001", description: "Protocol stats" },
      "lido_get_apr": { price: "$0.001", description: "Current APR" },
      "lido_stake": { price: "$0.01", description: "Stake ETH" },
      "lido_get_withdrawals": { price: "$0.002", description: "Withdrawal queue" }
    }
  },
  "gmx-v2-mcp": {
    name: "GMX V2 Perpetuals MCP",
    category: "defi",
    tools: {
      "gmx_get_markets": { price: "$0.001", description: "Get markets" },
      "gmx_get_position": { price: "$0.002", description: "Get position" },
      "gmx_get_funding_rates": { price: "$0.001", description: "Funding rates" },
      "gmx_open_position": { price: "$0.02", description: "Open position" }
    }
  },
  "yearn-mcp": {
    name: "Yearn Vaults MCP",
    category: "defi",
    tools: {
      "yearn_get_vaults": { price: "$0.001", description: "List vaults" },
      "yearn_get_vault_apy": { price: "$0.001", description: "Vault APY" },
      "yearn_deposit": { price: "$0.01", description: "Deposit to vault" },
      "yearn_withdraw": { price: "$0.01", description: "Withdraw from vault" }
    }
  },

  // ============ Layer 2 ============
  "arbitrum-mcp": {
    name: "Arbitrum MCP",
    category: "layer2",
    tools: {
      "arbitrum_get_gas": { price: "$0.0005", description: "Gas comparison" },
      "arbitrum_bridge_status": { price: "$0.001", description: "Bridge status" },
      "arbitrum_get_sequencer": { price: "$0.0005", description: "Sequencer info" },
      "arbitrum_estimate_bridge": { price: "$0.001", description: "Bridge estimate" }
    }
  },
  "optimism-mcp": {
    name: "Optimism MCP",
    category: "layer2",
    tools: {
      "optimism_get_gas": { price: "$0.0005", description: "Gas comparison" },
      "optimism_bridge_status": { price: "$0.001", description: "Bridge status" },
      "optimism_get_op_rewards": { price: "$0.001", description: "OP rewards" },
      "optimism_superchain_info": { price: "$0.001", description: "Superchain info" }
    }
  },
  "polygon-zkevm-mcp": {
    name: "Polygon zkEVM MCP",
    category: "layer2",
    tools: {
      "polygon_zkevm_get_batches": { price: "$0.001", description: "ZK batches" },
      "polygon_zkevm_bridge_status": { price: "$0.001", description: "Bridge status" },
      "polygon_zkevm_get_proof": { price: "$0.002", description: "ZK proof" },
      "polygon_zkevm_get_gas": { price: "$0.0005", description: "Gas comparison" }
    }
  },
  "base-chain-mcp": {
    name: "Base Chain MCP",
    category: "layer2",
    tools: {
      "base_get_gas": { price: "$0.0005", description: "Gas comparison" },
      "base_bridge_status": { price: "$0.001", description: "Bridge status" },
      "base_get_ecosystem": { price: "$0.001", description: "Ecosystem info" },
      "base_estimate_bridge": { price: "$0.001", description: "Bridge estimate" }
    }
  },

  // ============ NFT & Gaming ============
  "opensea-mcp": {
    name: "OpenSea MCP",
    category: "nft",
    tools: {
      "opensea_get_collection": { price: "$0.002", description: "Collection info" },
      "opensea_get_floor_price": { price: "$0.001", description: "Floor price" },
      "opensea_get_listings": { price: "$0.002", description: "Get listings" },
      "opensea_get_offers": { price: "$0.002", description: "Get offers" }
    }
  },
  "blur-mcp": {
    name: "Blur MCP",
    category: "nft",
    tools: {
      "blur_get_collection": { price: "$0.002", description: "Collection stats" },
      "blur_get_bids": { price: "$0.002", description: "Collection bids" },
      "blur_get_listings": { price: "$0.002", description: "Active listings" },
      "blur_get_blur_rewards": { price: "$0.001", description: "BLUR rewards" }
    }
  },
  "axie-infinity-mcp": {
    name: "Axie Infinity MCP",
    category: "nft",
    tools: {
      "axie_get_axie": { price: "$0.002", description: "Axie details" },
      "axie_get_marketplace": { price: "$0.002", description: "Marketplace listings" },
      "axie_get_breeding_cost": { price: "$0.001", description: "Breeding cost" },
      "axie_get_ronin_balance": { price: "$0.001", description: "Ronin balance" }
    }
  },

  // ============ Market Data ============
  "dune-analytics-mcp": {
    name: "Dune Analytics MCP",
    category: "market-data",
    tools: {
      "dune_execute_query": { price: "$0.05", description: "Execute query" },
      "dune_get_results": { price: "$0.01", description: "Get results" },
      "dune_get_popular": { price: "$0.005", description: "Popular queries" },
      "dune_cancel_query": { price: "$0.001", description: "Cancel query" }
    }
  },
  "defillama-mcp": {
    name: "DeFiLlama MCP",
    category: "market-data",
    tools: {
      "defillama_get_protocol": { price: "$0.001", description: "Protocol TVL" },
      "defillama_get_top_protocols": { price: "$0.002", description: "Top protocols" },
      "defillama_get_chain_tvl": { price: "$0.001", description: "Chain TVL" },
      "defillama_get_yields": { price: "$0.002", description: "Yield opportunities" }
    }
  },
  "coingecko-pro-mcp": {
    name: "CoinGecko Pro MCP",
    category: "market-data",
    tools: {
      "coingecko_get_price": { price: "$0.001", description: "Get prices" },
      "coingecko_get_top_coins": { price: "$0.002", description: "Top coins" },
      "coingecko_get_trending": { price: "$0.001", description: "Trending coins" },
      "coingecko_get_coin_details": { price: "$0.002", description: "Coin details" }
    }
  },

  // ============ Wallet & Identity ============
  "ens-domains-mcp": {
    name: "ENS Domains MCP",
    category: "wallets",
    tools: {
      "ens_resolve_name": { price: "$0.001", description: "Resolve ENS" },
      "ens_reverse_lookup": { price: "$0.001", description: "Reverse lookup" },
      "ens_get_avatar": { price: "$0.001", description: "Get avatar" },
      "ens_get_text_records": { price: "$0.002", description: "Text records" }
    }
  },
  "walletconnect-mcp": {
    name: "WalletConnect MCP",
    category: "wallets",
    tools: {
      "walletconnect_list_wallets": { price: "$0.001", description: "List wallets" },
      "walletconnect_create_session": { price: "$0.005", description: "Create session" },
      "walletconnect_get_session": { price: "$0.001", description: "Get session" },
      "walletconnect_disconnect": { price: "$0.001", description: "Disconnect" }
    }
  },
  "safe-gnosis-mcp": {
    name: "Safe (Gnosis) MCP",
    category: "wallets",
    tools: {
      "safe_get_info": { price: "$0.002", description: "Safe info" },
      "safe_get_pending_transactions": { price: "$0.002", description: "Pending txs" },
      "safe_get_history": { price: "$0.002", description: "Tx history" },
      "safe_get_balances": { price: "$0.002", description: "Token balances" }
    }
  }
};

// Get all tool prices as a flat map
export function getAllToolPrices(): Record<string, string> {
  const prices: Record<string, string> = {};
  for (const [serverId, server] of Object.entries(SERVER_PRICING)) {
    for (const [toolId, tier] of Object.entries(server.tools)) {
      prices[`${serverId}:${toolId}`] = tier.price;
      prices[toolId] = tier.price; // Also index by tool name alone
    }
  }
  return prices;
}

// Get price for a specific tool
export function getToolPrice(toolName: string, serverId?: string): string {
  if (serverId && SERVER_PRICING[serverId]?.tools[toolName]) {
    return SERVER_PRICING[serverId].tools[toolName].price;
  }
  
  // Search all servers for the tool
  for (const server of Object.values(SERVER_PRICING)) {
    if (server.tools[toolName]) {
      return server.tools[toolName].price;
    }
  }
  
  return "$0.001"; // Default price
}

// Parse price string to number (in USD)
export function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace("$", ""));
}

// Convert USD to token units (USDC has 6 decimals)
export function usdToTokenUnits(usdAmount: number, decimals: number = 6): bigint {
  return BigInt(Math.round(usdAmount * Math.pow(10, decimals)));
}

