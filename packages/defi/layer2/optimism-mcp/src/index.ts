#!/usr/bin/env node
/**
 * Optimism MCP Server
 * 
 * Layer 2 integration with bridging, sequencer status,
 * and Superchain ecosystem information.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerOptimismTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "optimism-mcp",
      version: "1.0.0",
      description: "Optimism L2 integration - bridging, gas, Superchain by nirholas"
    })

    registerOptimismTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Optimism MCP server running")
    Logger.info("🔴 Available: Network status, bridging, OP token, Superchain")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Optimism MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
