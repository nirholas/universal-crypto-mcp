#!/usr/bin/env node
/**
 * Curve Finance MCP Server
 * 
 * Comprehensive stableswap DEX integration with pool analytics,
 * optimal swap routing, and gauge reward tracking.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerCurveTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "curve-mcp",
      version: "1.0.0",
      description: "Curve Finance stableswap integration - pools, swaps, and gauge rewards by nirholas"
    })

    registerCurveTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Curve Finance MCP server running")
    Logger.info("🔄 Available: Stableswap pools, optimal routing, gauge rewards")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Curve MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => {
  Logger.info("Shutting down Curve MCP server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  Logger.info("Shutting down Curve MCP server...")
  process.exit(0)
})

main()
