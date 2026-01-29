/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * Transfer tool - Send SOL and SPL tokens
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { SolanaWallet } from "../wallet.js";

/**
 * Register transfer-related tools
 */
export function registerTransferTools(server: McpServer, wallet: SolanaWallet): void {
  // Transfer SOL
  server.tool(
    "solana_transfer",
    "Transfer SOL to an address",
    {
      to: z.string().describe("Recipient address"),
      amount: z.string().describe("Amount to transfer in SOL (e.g., '0.1')"),
    },
    async (args) => {
      try {
        const result = await wallet.transfer(args.to, args.amount);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  transaction: result,
                  message: `Sent ${args.amount} SOL to ${args.to}`,
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

  // Transfer SPL tokens
  server.tool(
    "solana_transfer_token",
    "Transfer SPL tokens to an address",
    {
      mint: z.string().describe("Token mint address"),
      to: z.string().describe("Recipient address"),
      amount: z.string().describe("Amount to transfer (in human-readable format)"),
    },
    async (args) => {
      try {
        const result = await wallet.transferToken(args.mint, args.to, args.amount);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  transaction: result,
                  message: `Sent ${args.amount} tokens to ${args.to}`,
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

  // Request airdrop (devnet/testnet only)
  server.tool(
    "solana_request_airdrop",
    "Request SOL airdrop (devnet/testnet only)",
    {
      amount: z.number().optional().default(1).describe("Amount of SOL to request"),
    },
    async (args) => {
      try {
        const result = await wallet.requestAirdrop(args.amount);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  transaction: result,
                  message: `Airdropped ${args.amount} SOL`,
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
