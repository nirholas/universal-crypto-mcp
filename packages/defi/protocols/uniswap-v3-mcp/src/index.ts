/**
 * Uniswap V3 MCP Server
 * 
 * Advanced DEX integration providing pool analytics, position management,
 * and optimal swap routing for Uniswap V3 protocol.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerUniswapV3Tools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    // Create MCP server instance
    const server = new McpServer({
      name: "uniswap-v3-mcp",
      version: "1.0.0",
      description: "Uniswap V3 protocol integration - DEX trading, pools, and positions by nirholas"
    })

    // Register all Uniswap V3 tools
    registerUniswapV3Tools(server)

    // Create stdio transport
    const transport = new StdioServerTransport()
    
    // Connect server to transport
    await server.connect(transport)

    Logger.info("✅ Uniswap V3 MCP server running")
    Logger.info("📊 Available: Pool analytics, swap quotes, position management")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Uniswap V3 MCP server:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down Uniswap V3 MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down Uniswap V3 MCP server...")
  process.exit(0)
})

main()
