#!/usr/bin/env node
/**
 * GMX V2 MCP Server
 * 
 * Perpetual trading integration on Arbitrum with position
 * management, funding rates, and liquidation monitoring.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerGmxV2Tools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "gmx-v2-mcp",
      version: "1.0.0",
      description: "GMX V2 perpetual trading - positions, funding rates, liquidations by nirholas"
    })

    registerGmxV2Tools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ GMX V2 MCP server running")
    Logger.info("📈 Available: Markets, positions, funding rates, liquidations")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting GMX V2 MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
