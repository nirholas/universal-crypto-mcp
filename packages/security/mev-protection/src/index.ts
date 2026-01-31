/**
 * MEV Protection & Sandwich Attack Detection MCP Server
 * 
 * Real-time mempool monitoring, MEV detection, and frontrunning protection
 * using Flashbots, EigenPhi API, and custom heuristics.
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
      name: "mev-protection-mcp",
      version: "1.0.0",
      description: "MEV protection, sandwich detection, and frontrunning alerts by nirholas"
    })

    // Register all MEV protection tools
    registerMEVTools(server)

    // Create stdio transport
    const transport = new StdioServerTransport()
    
    // Connect server to transport
    await server.connect(transport)

    Logger.info("✅ MEV Protection MCP server running")
    Logger.info("🛡️ Available: Sandwich detection, MEV analysis, private transactions")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting MEV Protection MCP server:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down MEV Protection MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down MEV Protection MCP server...")
  process.exit(0)
})

main()
