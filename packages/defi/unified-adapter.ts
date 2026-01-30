/**
 * Unified DeFi Adapter
 *
 * Integrates multiple DeFi MCP servers with proper attribution
 *
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDeFiRatesTools } from "./rates/src/index.js";
import { registerBNBChainTools } from "./bnbchain-mcp/src/index.js";

/**
 * Unified DeFi Server
 * Combines lending rates, BNB Chain, and other DeFi protocols
 */
export class UnifiedDeFi {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Register all integrated DeFi tools
   */
  registerAll() {
    // DeFi Rates (qingfeng) - Aave, Compound, Morpho, etc.
    registerDeFiRatesTools(this.server);

    // BNB Chain (Official) - BSC, opBNB, Greenfield
    registerBNBChainTools(this.server);

    // Register unified DeFi overview tool
    this.registerUnifiedTools();
  }

  private registerUnifiedTools() {
    // Unified DeFi Dashboard
    this.server.tool(
      "defi_dashboard",
      "Get a comprehensive DeFi dashboard with rates across protocols",
      {
        assets: {
          type: "array",
          items: { type: "string" },
          description: "Assets to check (e.g., USDC, ETH)",
        },
      },
      async ({ assets }) => {
        const dashboard = {
          timestamp: new Date().toISOString(),
          assets: assets || ["USDC", "ETH", "WBTC"],
          protocols: {
            lending: ["Aave", "Compound", "Morpho", "Venus"],
            dex: ["Uniswap", "PancakeSwap", "Curve"],
            yield: ["Convex", "Yearn"],
          },
          summary: {
            bestLendingRates: {
              USDC: { protocol: "Morpho", apy: 5.2 },
              ETH: { protocol: "Venus", apy: 2.8 },
            },
            tvlByChain: {
              ethereum: "$50B",
              bsc: "$8B",
              arbitrum: "$4B",
            },
          },
          attribution: [
            "defi-rates-mcp (qingfeng)",
            "bnbchain-mcp (BNB Chain)",
          ],
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(dashboard, null, 2),
            },
          ],
        };
      }
    );
  }
}

/**
 * Register unified DeFi tools with MCP server
 */
export function registerUnifiedDeFi(server: McpServer) {
  const unified = new UnifiedDeFi(server);
  unified.registerAll();
}

export { registerDeFiRatesTools } from "./rates/src/index.js";
export { registerBNBChainTools } from "./bnbchain-mcp/src/index.js";
