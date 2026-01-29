/**
 * Basic MCP Server Example
 *
 * A minimal example showing how to create an MCP server with crypto tools.
 *
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Tool implementations (simplified for example)
const tools = {
  get_price: {
    description: "Get the current price of a cryptocurrency",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "The cryptocurrency symbol (e.g., BTC, ETH)",
        },
      },
      required: ["symbol"],
    },
    handler: async (params: { symbol: string }) => {
      try {
        const symbol = params.symbol.toLowerCase();
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`
        );
        
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data[symbol]) {
          return {
            content: [
              {
                type: "text",
                text: `Price not found for ${symbol}. Try using the CoinGecko ID (e.g., 'bitcoin', 'ethereum', 'solana')`,
              },
            ],
          };
        }

        const price = data[symbol].usd;
        const change24h = data[symbol].usd_24h_change || 0;
        const changeSymbol = change24h >= 0 ? "+" : "";

        return {
          content: [
            {
              type: "text",
              text: `${symbol.toUpperCase()} is currently $${price.toLocaleString()} (${changeSymbol}${change24h.toFixed(2)}% 24h)`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching price: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    },
  },

  get_trending: {
    description: "Get trending cryptocurrencies",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of trending coins to return",
          default: 5,
        },
      },
    },
    handler: async (params: { limit?: number }) => {
      try {
        const limit = params.limit || 5;
        const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
        
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }
        
        const data = await response.json();
        const trending = data.coins.slice(0, limit);

        const text = trending
          .map((item: any, i: number) => {
            const coin = item.item;
            const priceChange = coin.data?.price_change_percentage_24h?.usd || 0;
            const changeSymbol = priceChange >= 0 ? "+" : "";
            return `${i + 1}. ${coin.name} (${coin.symbol}) ${changeSymbol}${priceChange.toFixed(2)}%`;
          })
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `🔥 Trending Coins:\n\n${text}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching trending coins: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    },
  },

  get_market_overview: {
    description: "Get an overview of the crypto market",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/global");
        
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }
        
        const result = await response.json();
        const data = result.data;

        const marketCap = (data.total_market_cap.usd / 1e12).toFixed(2);
        const volume = (data.total_volume.usd / 1e9).toFixed(1);
        const btcDom = data.market_cap_percentage.btc.toFixed(1);
        const ethDom = data.market_cap_percentage.eth.toFixed(1);
        const activeCoins = data.active_cryptocurrencies.toLocaleString();
        const markets = data.markets.toLocaleString();
        const marketCapChange = data.market_cap_change_percentage_24h_usd.toFixed(2);
        const changeSymbol = parseFloat(marketCapChange) >= 0 ? "+" : "";

        return {
          content: [
            {
              type: "text",
              text: `📊 Crypto Market Overview

💰 Total Market Cap: $${marketCap}T (${changeSymbol}${marketCapChange}% 24h)
📈 24h Volume: $${volume}B

🪙 BTC Dominance: ${btcDom}%
💎 ETH Dominance: ${ethDom}%

🔢 Active Cryptocurrencies: ${activeCoins}
🏛️ Markets: ${markets}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching market overview: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    },
  },
};

async function main() {
  // Create MCP server
  const server = new McpServer({
    name: "basic-crypto-mcp",
    version: "1.0.0",
  });

  // Register tools
  for (const [name, tool] of Object.entries(tools)) {
    server.tool(name, tool.description, tool.inputSchema, tool.handler);
  }

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("✅ Basic Crypto MCP server running");
  console.error("📌 Available tools: get_price, get_trending, get_market_overview");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
