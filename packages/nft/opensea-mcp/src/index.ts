/**
 * OpenSea MCP Server
 * 
 * NFT marketplace integration with collection analytics,
 * floor prices, listings, and trading support.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerOpenSeaTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "opensea-mcp",
      version: "1.0.0",
      description: "OpenSea NFT marketplace - collections, floor prices, listings by nirholas"
    })

    registerOpenSeaTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ OpenSea MCP server running")
    Logger.info("🖼️ Available: Collections, NFTs, floor prices, Seaport")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting OpenSea MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
