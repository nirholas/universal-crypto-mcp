/**
 * Lido Staking MCP Server
 * 
 * Liquid staking integration with stETH/wstETH management,
 * APR tracking, and withdrawal queue monitoring.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerLidoTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "lido-mcp",
      version: "1.0.0",
      description: "Lido liquid staking - stETH, wstETH, APR, and withdrawals by nirholas"
    })

    registerLidoTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Lido Staking MCP server running")
    Logger.info("🥩 Available: Staking APR, stETH/wstETH, withdrawals")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Lido MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
