/**
 * ENS Domains MCP Server
 * 
 * Ethereum Name Service integration for name resolution,
 * reverse lookups, avatars, and text records.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerENSDomainsTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "ens-domains-mcp",
      version: "1.0.0",
      description: "ENS name resolution and identity by nirholas"
    })

    registerENSDomainsTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ ENS Domains MCP server running")
    Logger.info("🔗 Available: Resolve, reverse lookup, avatar, text records")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting ENS Domains MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
