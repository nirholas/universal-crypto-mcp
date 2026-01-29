/**
 * BSC Meme Coin Trading Bot MCP Server
 * 
 * Full-featured automated trading bot for meme coins on Binance Smart Chain.
 * Trades on PancakeSwap with advanced strategies, risk management, and profit taking.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerTradingTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    // Create MCP server instance
    const server = new McpServer({
      name: "bsc-meme-trading-bot",
      version: "1.0.0",
      description: "Automated meme coin trading on Binance Smart Chain via PancakeSwap by nirholas"
    })

    // Register all trading tools
    registerTradingTools(server)

    // Create stdio transport
    const transport = new StdioServerTransport()
    
    // Connect server to transport
    await server.connect(transport)

    Logger.info("✅ BSC Meme Trading Bot MCP server running")
    Logger.info("🚀 Trading on PancakeSwap V2/V3")
    Logger.info("⚡ Auto-buy, sell, and profit taking enabled")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting BSC Meme Trading Bot:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down BSC Meme Trading Bot...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down BSC Meme Trading Bot...")
  process.exit(0)
})

main()
