/**
 * Arbitrum MCP Server
 * 
 * Layer 2 integration with bridging, gas estimation,
 * and transaction tracking for Arbitrum One & Nova.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerArbitrumTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "arbitrum-mcp",
      version: "1.0.0",
      description: "Arbitrum L2 integration - bridging, gas, transactions by nirholas"
    })

    registerArbitrumTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Arbitrum MCP server running")
    Logger.info("🔷 Available: Network status, bridging, gas comparison")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Arbitrum MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
