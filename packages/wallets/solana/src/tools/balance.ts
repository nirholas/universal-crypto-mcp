/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * Balance tool - Get SOL and SPL token balances
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { SolanaWallet } from "../wallet.js";

/**
 * Register balance-related tools
 */
export function registerBalanceTools(server: McpServer, wallet: SolanaWallet): void {
  // Get SOL balance
  server.tool(
    "solana_get_balance",
    "Get the SOL balance for an address",
    {
      address: z
        .string()
        .optional()
        .describe("Address to check (defaults to wallet address)"),
    },
    async (args) => {
      try {
        const balance = args.address
          ? await wallet.getBalanceOf(args.address)
          : await wallet.getBalance();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  address: args.address ?? wallet.address,
                  network: wallet.getNetwork(),
                  balance,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get SPL token balance
  server.tool(
    "solana_get_token_balance",
    "Get the balance of an SPL token",
    {
      mint: z.string().describe("Token mint address"),
      address: z
        .string()
        .optional()
        .describe("Address to check (defaults to wallet address)"),
    },
    async (args) => {
      try {
        const balance = await wallet.getTokenBalance(args.mint);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  mint: args.mint,
                  address: args.address ?? wallet.address,
                  balance,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get token info
  server.tool(
    "solana_get_token_info",
    "Get information about an SPL token",
    {
      mint: z.string().describe("Token mint address"),
    },
    async (args) => {
      try {
        const info = await wallet.getTokenInfo(args.mint);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  token: info,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
