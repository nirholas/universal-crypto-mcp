/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * Balance tool - Get native and token balances
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EVMWallet } from "../wallet.js";

/**
 * Register balance-related tools
 */
export function registerBalanceTools(server: McpServer, wallet: EVMWallet): void {
  // Get native token balance
  server.tool(
    "evm_get_balance",
    "Get the native token balance (ETH, MATIC, etc.) for an address",
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

  // Get ERC20 token balance
  server.tool(
    "evm_get_token_balance",
    "Get the balance of an ERC20 token",
    {
      token: z.string().describe("Token contract address"),
      address: z
        .string()
        .optional()
        .describe("Address to check (defaults to wallet address)"),
    },
    async (args) => {
      try {
        const balance = await wallet.getTokenBalance(args.token);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  token: args.token,
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
    "evm_get_token_info",
    "Get information about an ERC20 token (name, symbol, decimals)",
    {
      token: z.string().describe("Token contract address"),
    },
    async (args) => {
      try {
        const info = await wallet.getTokenInfo(args.token);

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
