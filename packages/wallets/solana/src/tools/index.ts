/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * MCP tools exports
 * 
 * @author nich
 * @license Apache-2.0
 */

export * from "./balance.js";
export * from "./transfer.js";
export * from "./sign.js";
export * from "./tokens.js";
export * from "./nft.js";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SolanaWallet } from "../wallet.js";
import { registerBalanceTools } from "./balance.js";
import { registerTransferTools } from "./transfer.js";
import { registerSignTools } from "./sign.js";
import { registerTokenTools } from "./tokens.js";
import { registerNFTTools } from "./nft.js";

/**
 * Register all Solana wallet tools with an MCP server
 */
export function registerAllSolanaTools(server: McpServer, wallet: SolanaWallet): void {
  registerBalanceTools(server, wallet);
  registerTransferTools(server, wallet);
  registerSignTools(server, wallet);
  registerTokenTools(server, wallet);
  registerNFTTools(server, wallet);
}
