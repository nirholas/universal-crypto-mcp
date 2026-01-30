/**
 * Yearn Finance MCP Server
 * 
 * Yield aggregation integration with vault strategies,
 * APY tracking, and deposit management.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerYearnTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "yearn-mcp",
      version: "1.0.0",
      description: "Yearn Finance yield aggregation - vaults, strategies, APY by nirholas"
    })

    registerYearnTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Yearn Finance MCP server running")
    Logger.info("🏦 Available: Vaults, strategies, APY, deposits")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Yearn MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
