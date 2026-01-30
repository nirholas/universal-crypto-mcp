/**
 * CoinGecko Pro MCP Server
 * 
 * Enhanced market data integration with price feeds,
 * market caps, trending coins, and detailed analytics.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerCoinGeckoProTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "coingecko-pro-mcp",
      version: "1.0.0",
      description: "CoinGecko Pro market data - prices, trending, analytics by nirholas"
    })

    registerCoinGeckoProTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ CoinGecko Pro MCP server running")
    Logger.info("📈 Available: Prices, top coins, trending, details")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting CoinGecko Pro MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
