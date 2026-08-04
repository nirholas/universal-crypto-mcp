/**
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: packageVersion } = require("../../package.json") as { version: string }

import { registerEVM } from "@/evm.js"
import { registerX402 } from "@/x402/index.js"
import { initializeX402 } from "@/x402/integration/index.js"
import { registerToolMarketplace } from "@/modules/tool-marketplace/index.js"
import { registerAIPredictions } from "@/modules/ai-predictions/index.js"
import { registerUnlockTools } from "@/modules/token-unlocks/index.js"
import Logger from "@/utils/logger.js"
import { withDedupedTools } from "@/utils/dedupe-tools.js"

// Create and start the MCP server
export const startServer = async () => {
  try {
    // Create a new MCP server instance
    const mcpServer = new McpServer({
      name: "Universal Crypto MCP",
      // Bundled in from package.json at build time, so serverInfo can never
      // drift from the published version again (1.1.1 shipped reporting 1.1.0).
      version: packageVersion,
      description: "Universal MCP server for all EVM-compatible networks with x402 payment protocol"
    })

    // Registration is deduped across every module group below, not just within
    // registerEVM: names are also claimed twice across the EVM and top-level
    // module trees (governance, utils). A duplicate throws inside McpServer and
    // took the whole startup with it, so the first claim wins and the rest are
    // logged.
    const server = withDedupedTools(mcpServer, (name) =>
      Logger.warn(`Tool "${name}" was registered twice; keeping the first registration`)
    )

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
