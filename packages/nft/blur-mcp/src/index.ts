/**
 * Blur MCP Server
 * 
 * Pro NFT trading integration with bidding, sweeping,
 * analytics, and BLUR token information.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerBlurTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "blur-mcp",
      version: "1.0.0",
      description: "Blur NFT marketplace - pro trading, bidding, analytics by nirholas"
    })

    registerBlurTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Blur MCP server running")
    Logger.info("🟡 Available: Collection bids, floor depth, BLUR token")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Blur MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
