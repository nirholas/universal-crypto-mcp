/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * Transfer tool - Send native tokens and ERC20 tokens
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EVMWallet } from "../wallet.js";

/**
 * Register transfer-related tools
 */
export function registerTransferTools(server: McpServer, wallet: EVMWallet): void {
  // Transfer native tokens
  server.tool(
    "evm_transfer",
    "Transfer native tokens (ETH, MATIC, etc.) to an address",
    {
      to: z.string().describe("Recipient address"),
      amount: z.string().describe("Amount to transfer (in human-readable format, e.g., '0.1')"),
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
                  message: `Sent ${args.amount} to ${args.to}`,
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

  // Transfer ERC20 tokens
  server.tool(
    "evm_transfer_token",
    "Transfer ERC20 tokens to an address",
    {
      token: z.string().describe("Token contract address"),
      to: z.string().describe("Recipient address"),
      amount: z.string().describe("Amount to transfer (in human-readable format)"),
    },
    async (args) => {
      try {
        const result = await wallet.transferToken(args.token, args.to, args.amount);

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

  // Estimate gas for transfer
  server.tool(
    "evm_estimate_transfer",
    "Estimate gas cost for a transfer",
    {
      to: z.string().describe("Recipient address"),
      amount: z.string().describe("Amount to transfer"),
    },
    async (args) => {
      try {
        const estimate = await wallet.estimateGas({
          to: args.to,
          value: args.amount,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  estimate,
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
