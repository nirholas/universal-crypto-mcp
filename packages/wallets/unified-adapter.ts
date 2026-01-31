/**
 * Unified Wallets Adapter
 *
 * Integrates wallet-related MCP servers with proper attribution
 *
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerArmorTools } from "./armor/src/index.js";

/**
 * Unified Wallets Server
 * Combines multi-chain wallet management tools
 */
export class UnifiedWallets {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Register all integrated wallet tools
   */
  registerAll() {
    // ArmorWallet - Multi-chain DeFi (Wave 3)
    registerArmorTools(this.server);

    console.log("[Unified Wallets] Registered tools:");
    console.log("  - armor_balances");
    console.log("  - armor_swap_quote");
    console.log("  - armor_swap");
    console.log("  - armor_bridge_quote");
    console.log("  - armor_bridge");
    console.log("  - armor_staking_positions");
    console.log("  - armor_stake");
    console.log("  - armor_gas_price");
  }
}

/**
 * Register unified wallet tools with MCP server
 */
export function registerUnifiedWallets(server: McpServer) {
  const unified = new UnifiedWallets(server);
  unified.registerAll();
}

export { registerArmorTools };
