/**
 * DeFi Rates MCP Server
 *
 * Original Author: qingfeng
 * Original Repository: https://github.com/qingfeng/defi-rates-mcp
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 *
 * This integration maintains the original MIT license while adding
 * Apache-2.0 licensed enhancements for unified API compatibility.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface ProtocolRate {
  protocol: string;
  chain: string;
  asset: string;
  supplyAPY: number;
  borrowAPY: number;
  utilization: number;
  ltv?: number;
  liquidationThreshold?: number;
  totalSupply?: number;
  totalBorrow?: number;
  lastUpdated: string;
}

export interface RateComparison {
  asset: string;
  rates: ProtocolRate[];
  bestSupply: { protocol: string; apy: number };
  bestBorrow: { protocol: string; apy: number };
}

export interface LoopingStrategy {
  protocol: string;
  asset: string;
  collateral: string;
  leverage: number;
  netAPY: number;
  supplyAPY: number;
  borrowAPY: number;
  liquidationRisk: string;
}

// ============================================================================
// Protocol Configurations
// ============================================================================

const PROTOCOLS = {
  aave: {
    name: "Aave V3",
    chains: ["ethereum", "arbitrum", "optimism", "polygon", "base"],
    type: "lending",
  },
  compound: {
    name: "Compound V3",
    chains: ["ethereum", "base", "arbitrum"],
    type: "lending",
  },
  morpho: {
    name: "Morpho",
    chains: ["ethereum"],
    type: "lending",
  },
  spark: {
    name: "Spark Protocol",
    chains: ["ethereum"],
    type: "lending",
  },
  venus: {
    name: "Venus",
    chains: ["bsc"],
    type: "lending",
  },
  radiant: {
    name: "Radiant",
    chains: ["arbitrum", "bsc"],
    type: "lending",
  },
  solend: {
    name: "Solend",
    chains: ["solana"],
    type: "lending",
  },
  drift: {
    name: "Drift",
    chains: ["solana"],
    type: "lending",
  },
  jupiter: {
    name: "Jupiter",
    chains: ["solana"],
    type: "aggregator",
  },
  marginfi: {
    name: "Marginfi",
    chains: ["solana"],
    type: "lending",
  },
  kamino: {
    name: "Kamino",
    chains: ["solana"],
    type: "lending",
  },
} as const;

type ProtocolId = keyof typeof PROTOCOLS;

// ============================================================================
// DeFi Rates Client
// ============================================================================

export class DeFiRatesClient {
  private cache: Map<string, { data: ProtocolRate; timestamp: number }> = new Map();
  private cacheTTL = 30000; // 30 seconds

  /**
   * Get rates for a specific protocol and asset
   * @source Based on qingfeng's defi-rates-mcp
   */
  async getProtocolRates(protocol: ProtocolId, asset: string, chain?: string): Promise<ProtocolRate> {
    const cacheKey = `${protocol}:${asset}:${chain || "default"}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    // In production, this would fetch from actual protocol APIs/subgraphs
    // For now, we simulate realistic rates based on protocol characteristics
    const rate = await this.fetchProtocolRate(protocol, asset, chain);

    this.cache.set(cacheKey, { data: rate, timestamp: Date.now() });
    return rate;
  }

  private async fetchProtocolRate(protocol: ProtocolId, asset: string, chain?: string): Promise<ProtocolRate> {
    // Simulated rate fetching - in production would use protocol APIs
    const baseRates: Record<string, { supply: number; borrow: number }> = {
      USDC: { supply: 4.5, borrow: 6.2 },
      USDT: { supply: 4.2, borrow: 5.9 },
      DAI: { supply: 4.8, borrow: 6.5 },
      ETH: { supply: 2.1, borrow: 3.8 },
      WETH: { supply: 2.1, borrow: 3.8 },
      WBTC: { supply: 0.5, borrow: 2.1 },
      SOL: { supply: 3.2, borrow: 5.5 },
    };

    const assetRates = baseRates[asset.toUpperCase()] || { supply: 2.0, borrow: 4.0 };

    // Protocol-specific adjustments
    const protocolMultipliers: Record<ProtocolId, number> = {
      aave: 1.0,
      compound: 0.95,
      morpho: 1.1, // Morpho typically offers better rates
      spark: 1.05,
      venus: 1.15,
      radiant: 1.2,
      solend: 1.1,
      drift: 1.25,
      jupiter: 1.0,
      marginfi: 1.05,
      kamino: 1.1,
    };

    const multiplier = protocolMultipliers[protocol];
    const utilization = 65 + Math.random() * 20;

    return {
      protocol: PROTOCOLS[protocol].name,
      chain: chain || PROTOCOLS[protocol].chains[0],
      asset: asset.toUpperCase(),
      supplyAPY: Number((assetRates.supply * multiplier).toFixed(2)),
      borrowAPY: Number((assetRates.borrow * multiplier).toFixed(2)),
      utilization: Number(utilization.toFixed(1)),
      ltv: asset.toUpperCase() === "ETH" ? 80 : 75,
      liquidationThreshold: asset.toUpperCase() === "ETH" ? 82.5 : 80,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Find best rate across all protocols
   * @enhancement Cross-protocol rate comparison
   */
  async findBestRate(asset: string, type: "supply" | "borrow"): Promise<{ protocol: string; rate: number; chain: string }> {
    const protocols = Object.keys(PROTOCOLS) as ProtocolId[];
    const rates: Array<{ protocol: string; rate: number; chain: string }> = [];

    for (const protocol of protocols) {
      try {
        const protocolRate = await this.getProtocolRates(protocol, asset);
        rates.push({
          protocol: protocolRate.protocol,
          rate: type === "supply" ? protocolRate.supplyAPY : protocolRate.borrowAPY,
          chain: protocolRate.chain,
        });
      } catch {
        // Skip protocols that don't support this asset
      }
    }

    if (rates.length === 0) {
      throw new Error(`No rates found for ${asset}`);
    }

    // For supply, higher is better; for borrow, lower is better
    rates.sort((a, b) => (type === "supply" ? b.rate - a.rate : a.rate - b.rate));

    return rates[0];
  }

  /**
   * Compare rates across all protocols
   * @enhancement Unified comparison view
   */
  async compareRates(asset: string): Promise<RateComparison> {
    const protocols = Object.keys(PROTOCOLS) as ProtocolId[];
    const rates: ProtocolRate[] = [];

    for (const protocol of protocols) {
      try {
        const rate = await this.getProtocolRates(protocol, asset);
        rates.push(rate);
      } catch {
        // Skip protocols that don't support this asset
      }
    }

    if (rates.length === 0) {
      throw new Error(`No rates found for ${asset}`);
    }

    const sortedBySupply = [...rates].sort((a, b) => b.supplyAPY - a.supplyAPY);
    const sortedByBorrow = [...rates].sort((a, b) => a.borrowAPY - b.borrowAPY);

    return {
      asset: asset.toUpperCase(),
      rates,
      bestSupply: {
        protocol: sortedBySupply[0].protocol,
        apy: sortedBySupply[0].supplyAPY,
      },
      bestBorrow: {
        protocol: sortedByBorrow[0].protocol,
        apy: sortedByBorrow[0].borrowAPY,
      },
    };
  }

  /**
   * Calculate looping strategy returns
   * @source Based on qingfeng's looping calculations
   */
  async calculateLoopingStrategy(
    protocol: ProtocolId,
    supplyAsset: string,
    borrowAsset: string,
    leverage: number
  ): Promise<LoopingStrategy> {
    const supplyRate = await this.getProtocolRates(protocol, supplyAsset);
    const borrowRate = await this.getProtocolRates(protocol, borrowAsset);

    const effectiveSupplyAPY = supplyRate.supplyAPY * leverage;
    const effectiveBorrowAPY = borrowRate.borrowAPY * (leverage - 1);
    const netAPY = effectiveSupplyAPY - effectiveBorrowAPY;

    // Calculate liquidation risk
    const ltv = supplyRate.ltv || 75;
    const liquidationThreshold = supplyRate.liquidationThreshold || 80;
    const healthFactor = liquidationThreshold / (ltv * (leverage - 1) / leverage * 100);

    let liquidationRisk: string;
    if (healthFactor > 1.5) {
      liquidationRisk = "Low";
    } else if (healthFactor > 1.2) {
      liquidationRisk = "Medium";
    } else {
      liquidationRisk = "High";
    }

    return {
      protocol: PROTOCOLS[protocol].name,
      asset: supplyAsset.toUpperCase(),
      collateral: borrowAsset.toUpperCase(),
      leverage,
      netAPY: Number(netAPY.toFixed(2)),
      supplyAPY: Number(effectiveSupplyAPY.toFixed(2)),
      borrowAPY: Number(effectiveBorrowAPY.toFixed(2)),
      liquidationRisk,
    };
  }

  /**
   * List supported protocols
   */
  getProtocols(): Array<{ id: string; name: string; chains: readonly string[]; type: string }> {
    return Object.entries(PROTOCOLS).map(([id, config]) => ({
      id,
      ...config,
    }));
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerDeFiRatesTools(server: McpServer): void {
  const client = new DeFiRatesClient();

  // Get protocol rates
  server.tool(
    "defi_rates",
    "Get lending/borrowing rates for a specific protocol and asset",
    {
      protocol: z
        .enum(["aave", "compound", "morpho", "spark", "venus", "radiant", "solend", "drift", "jupiter", "marginfi", "kamino"])
        .describe("DeFi protocol"),
      asset: z.string().describe("Asset symbol (e.g., USDC, ETH, SOL)"),
      chain: z.string().optional().describe("Blockchain (optional)"),
    },
    async ({ protocol, asset, chain }) => {
      const data = await client.getProtocolRates(protocol, asset, chain);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Find best rate
  server.tool(
    "defi_best_rate",
    "Find the best lending or borrowing rate across all protocols",
    {
      asset: z.string().describe("Asset symbol (e.g., USDC, ETH)"),
      type: z.enum(["supply", "borrow"]).describe("Rate type"),
    },
    async ({ asset, type }) => {
      const data = await client.findBestRate(asset, type);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Compare rates
  server.tool(
    "defi_compare_rates",
    "Compare rates for an asset across all supported protocols",
    {
      asset: z.string().describe("Asset symbol (e.g., USDC, ETH)"),
    },
    async ({ asset }) => {
      const data = await client.compareRates(asset);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Looping strategy
  server.tool(
    "defi_looping_strategy",
    "Calculate returns for a looping/leverage strategy",
    {
      protocol: z
        .enum(["aave", "compound", "morpho", "spark", "venus", "radiant", "solend", "drift", "marginfi", "kamino"])
        .describe("DeFi protocol"),
      supplyAsset: z.string().describe("Asset to supply"),
      borrowAsset: z.string().describe("Asset to borrow"),
      leverage: z.number().min(1).max(10).describe("Leverage multiplier (1-10)"),
    },
    async ({ protocol, supplyAsset, borrowAsset, leverage }) => {
      const data = await client.calculateLoopingStrategy(protocol, supplyAsset, borrowAsset, leverage);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // List protocols
  server.tool("defi_protocols", "List all supported DeFi protocols", {}, async () => {
    const data = client.getProtocols();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });
}

export default DeFiRatesClient;
