/**
 * Axie Infinity MCP Server
 * 
 * Gaming NFT integration with Axie stats, marketplace,
 * breeding mechanics, and Ronin blockchain support.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerAxieInfinityTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "axie-infinity-mcp",
      version: "1.0.0",
      description: "Axie Infinity gaming NFTs - marketplace, breeding, Ronin by nirholas"
    })

    registerAxieInfinityTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Axie Infinity MCP server running")
    Logger.info("🎮 Available: Axies, marketplace, breeding, Ronin")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Axie Infinity MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
