/**
 * MEV Bot MCP Server
 * 
 * Advanced MEV detection and arbitrage opportunity scanner.
 * Monitors mempool, detects sandwich attacks, and finds profitable trades.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerMEVTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    // Create MCP server instance
    const server = new McpServer({
      name: "mev-bot-mcp",
      version: "1.0.0",
      description: "MEV Bot - Detect arbitrage opportunities and sandwich attacks by nirholas"
    })

    // Register all MEV tools
    registerMEVTools(server)

    // Create stdio transport
    const transport = new StdioServerTransport()
    
    // Connect server to transport
    await server.connect(transport)

    Logger.info("✅ MEV Bot MCP server running")
    Logger.info("🤖 Scanning for arbitrage opportunities and MEV strategies")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting MEV Bot MCP server:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down MEV Bot MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down MEV Bot MCP server...")
  process.exit(0)
})

main()
