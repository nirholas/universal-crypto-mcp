#!/usr/bin/env node
/**
 * WalletConnect MCP Server
 * 
 * Session management and dApp connectivity for wallet
 * interactions via the WalletConnect protocol.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerWalletConnectTools } from "./tools/index.js"
import { Logger } from "./utils/logger.js"

async function main() {
  try {
    const server = new McpServer({
      name: "walletconnect-mcp",
      version: "1.0.0",
      description: "WalletConnect session management by nirholas"
    })

    registerWalletConnectTools(server)

    const transport = new StdioServerTransport()
    await server.connect(transport)

    Logger.info("✅ WalletConnect MCP server running")
    Logger.info("🔗 Available: Wallets, sessions, connection management")
    Logger.info("👤 Created by nirholas - x.com/nichxbt")

  } catch (error) {
    Logger.error("Fatal error starting WalletConnect MCP server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

main()
