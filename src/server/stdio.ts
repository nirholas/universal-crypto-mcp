/**
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import "dotenv/config"

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import Logger from "@/utils/logger"
import { startServer } from "./base"

// Start the server
export const startStdioServer = async () => {
  try {
    const server = await startServer()
    const transport = new StdioServerTransport()
    // using error level to show the message for stdio mode
    Logger.error("Universal Crypto MCP server running on stdio")

    transport.onclose = () => {
      Logger.error("Stdio server closed")
    }
    transport.onerror = (error) => {
      Logger.error("Stdio server error:", error)
    }

    await server.connect(transport)
    return server
  } catch (error) {
    Logger.error("Error starting stdio server:", error)
  }
}
