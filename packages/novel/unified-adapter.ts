/**
 * Unified Novel/NFT Adapter
 *
 * Integrates NFT and creative MCP servers with proper attribution
 *
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerVerbwireTools } from "./verbwire/src/index.js";

/**
 * Unified Novel/NFT Server
 * Combines NFT minting, smart contracts, and creative tools
 */
export class UnifiedNovel {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Register all integrated novel/NFT tools
   */
  registerAll() {
    // Verbwire - NFT Minting & Smart Contracts (Wave 3)
    registerVerbwireTools(this.server);

    console.log("[Unified Novel] Registered tools:");
    console.log("  - verbwire_mint_nft");
    console.log("  - verbwire_mint_batch");
    console.log("  - verbwire_deploy_contract");
    console.log("  - verbwire_upload_ipfs");
    console.log("  - verbwire_upload_metadata");
    console.log("  - verbwire_get_nfts");
    console.log("  - verbwire_get_collection");
  }
}

/**
 * Register unified novel/NFT tools with MCP server
 */
export function registerUnifiedNovel(server: McpServer) {
  const unified = new UnifiedNovel(server);
  unified.registerAll();
}

export { registerVerbwireTools };
