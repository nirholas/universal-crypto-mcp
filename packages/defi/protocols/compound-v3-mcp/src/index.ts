#!/usr/bin/env node
/**
 * Compound V3 MCP Server
 * 
 * Comprehensive lending market integration with supply/borrow
 * functionality and interest rate monitoring.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerCompoundV3Tools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "compound-v3-mcp",
      version: "1.0.0",
      description: "Compound V3 lending markets - supply, borrow, and interest rates by nirholas"
    })

    registerCompoundV3Tools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Compound V3 MCP server running")
    Logger.info("💰 Available: Markets, positions, interest rates, liquidations")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Compound V3 MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => {
  Logger.info("Shutting down Compound V3 MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down Compound V3 MCP server...")
  process.exit(0)
})

main()
