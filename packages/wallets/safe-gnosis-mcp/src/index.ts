#!/usr/bin/env node
/**
 * Safe (Gnosis) MCP Server
 * 
 * Multi-signature wallet management, transaction proposals,
 * and safe account analytics.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerSafeGnosisTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "safe-gnosis-mcp",
      version: "1.0.0",
      description: "Safe multi-sig wallet management by nirholas"
    })

    registerSafeGnosisTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Safe (Gnosis) MCP server running")
    Logger.info("🔐 Available: Safe info, transactions, balances")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Safe MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
