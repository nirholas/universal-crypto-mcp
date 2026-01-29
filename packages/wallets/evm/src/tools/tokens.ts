/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * Token tools - ERC20 token operations
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { formatUnits } from "viem";
import type { EVMWallet } from "../wallet.js";

// ERC20 approve ABI
const ERC20_APPROVE_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Register token-related tools
 */
export function registerTokenTools(server: McpServer, wallet: EVMWallet): void {
  // Approve token spending
  server.tool(
    "evm_approve_token",
    "Approve a spender to use tokens on your behalf",
    {
      token: z.string().describe("Token contract address"),
      spender: z.string().describe("Spender address"),
      amount: z.string().describe("Amount to approve (use 'unlimited' for max)"),
    },
    async (args) => {
      try {
        const tokenInfo = await wallet.getTokenInfo(args.token);
        
        // Calculate amount (unlimited = max uint256)
        let rawAmount: bigint;
        if (args.amount.toLowerCase() === "unlimited" || args.amount === "max") {
          rawAmount = 2n ** 256n - 1n;
        } else {
          rawAmount = BigInt(
            Math.floor(parseFloat(args.amount) * 10 ** tokenInfo.decimals)
          );
        }

        const walletClient = wallet.getWalletClient();
        const hash = await walletClient.writeContract({
          address: args.token as `0x${string}`,
          abi: ERC20_APPROVE_ABI,
          functionName: "approve",
          args: [args.spender as `0x${string}`, rawAmount],
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  transaction: { hash, status: "pending" },
                  message: `Approved ${args.spender} to spend ${args.amount} ${tokenInfo.symbol}`,
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

  // Check token allowance
  server.tool(
    "evm_token_allowance",
    "Check how much a spender is allowed to use",
    {
      token: z.string().describe("Token contract address"),
      owner: z.string().optional().describe("Token owner (defaults to wallet)"),
      spender: z.string().describe("Spender address"),
    },
    async (args) => {
      try {
        const tokenInfo = await wallet.getTokenInfo(args.token);
        const publicClient = wallet.getPublicClient();

        const allowance = await publicClient.readContract({
          address: args.token as `0x${string}`,
          abi: ERC20_APPROVE_ABI,
          functionName: "allowance",
          args: [
            (args.owner ?? wallet.address) as `0x${string}`,
            args.spender as `0x${string}`,
          ],
        });

        const formattedAllowance = formatUnits(allowance, tokenInfo.decimals);
        const isUnlimited = allowance >= 2n ** 255n;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  token: tokenInfo,
                  owner: args.owner ?? wallet.address,
                  spender: args.spender,
                  allowance: {
                    raw: allowance.toString(),
                    formatted: isUnlimited ? "unlimited" : formattedAllowance,
                    isUnlimited,
                  },
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
