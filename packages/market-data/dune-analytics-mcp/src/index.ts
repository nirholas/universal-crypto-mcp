/**
 * Dune Analytics MCP Server
 * 
 * On-chain analytics integration with query execution,
 * results retrieval, and popular query discovery.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerDuneAnalyticsTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "dune-analytics-mcp",
      version: "1.0.0",
      description: "Dune Analytics - on-chain queries and dashboards by nirholas"
    })

    registerDuneAnalyticsTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Dune Analytics MCP server running")
    Logger.info("📊 Available: Query execution, results, popular queries")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Dune Analytics MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
