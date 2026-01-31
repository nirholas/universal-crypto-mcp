/**
 * Rugpull Detector MCP Server
 * 
 * Advanced token safety analysis and scam detection system.
 * Analyzes smart contracts, holder distribution, and liquidity locks.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerRugpullTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    // Create MCP server instance
    const server = new McpServer({
      name: "rugpull-detector-mcp",
      version: "1.0.0",
      description: "Rugpull Detector - AI-powered scam detection and token safety analysis by nirholas"
    })

    // Register all rugpull detection tools
    registerRugpullTools(server)

    // Create stdio transport
    const transport = new StdioServerTransport()
    
    // Connect server to transport
    await server.connect(transport)

    Logger.info("✅ Rugpull Detector MCP server running")
    Logger.info("🛡️  Protecting traders from scams and honeypots")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Rugpull Detector MCP server:", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down Rugpull Detector MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down Rugpull Detector MCP server...")
  process.exit(0)
})

main()
