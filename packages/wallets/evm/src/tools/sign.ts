/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * Sign tool - Message and typed data signing
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EVMWallet } from "../wallet.js";

/**
 * Register signing-related tools
 */
export function registerSignTools(server: McpServer, wallet: EVMWallet): void {
  // Sign a message
  server.tool(
    "evm_sign_message",
    "Sign a message with the wallet's private key (EIP-191 personal_sign)",
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

  // Sign typed data (EIP-712)
  server.tool(
    "evm_sign_typed_data",
    "Sign typed data (EIP-712) with the wallet's private key",
    {
      domain: z
        .record(z.unknown())
        .describe("Domain separator (name, version, chainId, verifyingContract)"),
      types: z
        .record(
          z.array(
            z.object({
              name: z.string(),
              type: z.string(),
            })
          )
        )
        .describe("Type definitions"),
      primaryType: z.string().describe("Primary type name"),
      message: z.record(z.unknown()).describe("Message data"),
    },
    async (args) => {
      try {
        const signature = await wallet.signTypedData({
          domain: args.domain,
          types: args.types,
          primaryType: args.primaryType,
          message: args.message,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
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
    "evm_get_address",
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
