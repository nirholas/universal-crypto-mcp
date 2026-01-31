/**
 * Unified Payments Adapter
 *
 * Integrates payment-related MCP servers with proper attribution
 *
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerLightningTools } from "./lightning/src/index.js";

/**
 * Unified Payments Server
 * Combines Bitcoin Lightning and other payment solutions
 */
export class UnifiedPayments {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Register all integrated payment tools
   */
  registerAll() {
    // Bitcoin Lightning via Alby (Wave 3)
    registerLightningTools(this.server);

    console.log("[Unified Payments] Registered tools:");
    console.log("  - lightning_balance");
    console.log("  - lightning_send");
    console.log("  - lightning_invoice");
    console.log("  - lightning_decode");
    console.log("  - lightning_transactions");
    console.log("  - lightning_lnurl_pay");
  }
}

/**
 * Register unified payment tools with MCP server
 */
export function registerUnifiedPayments(server: McpServer) {
  const unified = new UnifiedPayments(server);
  unified.registerAll();
}

export { registerLightningTools };
