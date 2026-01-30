/**
 * Base Chain MCP Server
 * 
 * Coinbase L2 integration with native Coinbase features,
 * bridging, and ecosystem information.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerBaseChainTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "base-chain-mcp",
      version: "1.0.0",
      description: "Base Chain (Coinbase L2) - bridging, dApps, integrations by nirholas"
    })

    registerBaseChainTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Base Chain MCP server running")
    Logger.info("🔵 Available: Network status, Coinbase integrations, dApps")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Base Chain MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
