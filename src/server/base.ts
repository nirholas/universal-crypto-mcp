/**
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { registerEVM } from "@/evm.js"
import { registerX402 } from "@/x402/index.js"
import { initializeX402 } from "@/x402/integration/index.js"
import { registerToolMarketplace } from "@/modules/tool-marketplace/index.js"
import { registerAIPredictions } from "@/modules/ai-predictions/index.js"
import { registerUnlockTools } from "@/modules/token-unlocks/index.js"
import Logger from "@/utils/logger.js"

// Create and start the MCP server
export const startServer = async () => {
  try {
    // Create a new MCP server instance
    const server = new McpServer({
      name: "Universal Crypto MCP",
      version: "1.1.0",
      description: "Universal MCP server for all EVM-compatible networks with x402 payment protocol"
    })

    // Initialize x402 payment integration first
    // This must happen before registering tools
    Logger.info("Initializing x402 payment integration...")
    await initializeX402()
    
    // Register all resources, tools, and prompts
    registerEVM(server)
    
    // Register x402 payment protocol tools
    // Enables AI agents to make/receive cryptocurrency payments
    registerX402(server)
    
    // Register tool marketplace module
    // Decentralized marketplace for paid AI tools using x402
    registerToolMarketplace(server)
    
    // Register AI Predictions module
    // ML-powered crypto predictions monetized via x402
    registerAIPredictions(server)
    
    // Register Token Unlock & Vesting Schedule Tracker
    // Track token unlocks, vesting schedules, and market impact analysis
    registerUnlockTools(server)
    
    Logger.info("✅ All modules initialized with x402 integration")
    
    return server
  } catch (error) {
    Logger.error("Failed to initialize server:", error)
    process.exit(1)
  }
}
