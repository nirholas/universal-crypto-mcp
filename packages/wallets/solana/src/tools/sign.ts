/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * Sign tool - Message signing
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { SolanaWallet } from "../wallet.js";

/**
 * Register signing-related tools
 */
export function registerSignTools(server: McpServer, wallet: SolanaWallet): void {
  // Sign a message
  server.tool(
    "solana_sign_message",
    "Sign a message with the wallet's private key",
    {
      message: z.string().describe("Message to sign"),
    },
    async (args) => {
      try {
        const signature = await wallet.signMessage(args.message);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: args.message,
                  signature,
                  signer: wallet.address,
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

  // Get wallet address
  server.tool(
    "solana_get_address",
    "Get the wallet's address",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                address: wallet.address,
                chain: wallet.chain,
                network: wallet.getNetwork(),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get public key
  server.tool(
    "solana_get_public_key",
    "Get the wallet's public key",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                publicKey: wallet.getPublicKey().toBase58(),
                address: wallet.address,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
