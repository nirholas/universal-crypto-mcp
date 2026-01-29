/**
 * Aave Protocol MCP Server
 * 
 * Comprehensive lending and borrowing protocol integration with
 * health factor monitoring and liquidation alerts.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerAaveTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    // Create MCP server instance
    const server = new McpServer({
      name: "aave-mcp",
      version: "1.0.0",
      description: "Aave V3 protocol integration - lending, borrowing, and liquidations by nirholas"
    })

    // Register all Aave tools
    registerAaveTools(server)

    // Create stdio transport
    const transport = new StdioServerTransport()
    
    // Connect server to transport
    await server.connect(transport)

    Logger.info("✅ Aave Protocol MCP server running")
    Logger.info("💰 Available: Lending, borrowing, health factors, liquidations")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Aave MCP server:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down Aave MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down Aave MCP server...")
  process.exit(0)
})

main()
