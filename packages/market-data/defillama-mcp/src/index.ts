/**
 * DeFiLlama MCP Server
 * 
 * TVL aggregator integration with protocol data,
 * chain statistics, and yield opportunities.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerDefiLlamaTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "defillama-mcp",
      version: "1.0.0",
      description: "DeFiLlama TVL aggregator - protocols, chains, yields by nirholas"
    })

    registerDefiLlamaTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ DeFiLlama MCP server running")
    Logger.info("📊 Available: Protocol TVL, chain stats, yields")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting DeFiLlama MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
