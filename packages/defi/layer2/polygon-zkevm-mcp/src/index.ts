/**
 * Polygon zkEVM MCP Server
 * 
 * Zero-knowledge rollup integration with bridging,
 * proof verification, and batch monitoring.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerPolygonZkEvmTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "polygon-zkevm-mcp",
      version: "1.0.0",
      description: "Polygon zkEVM integration - ZK proofs, bridging, batches by nirholas"
    })

    registerPolygonZkEvmTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ Polygon zkEVM MCP server running")
    Logger.info("🟣 Available: Network status, bridging, batches, ecosystem")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting Polygon zkEVM MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
