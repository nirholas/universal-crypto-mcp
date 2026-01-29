/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * NFT tools - ERC721/ERC1155 operations
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EVMWallet } from "../wallet.js";

// ERC721 ABI
const ERC721_ABI = [
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Register NFT-related tools
 */
export function registerNFTTools(server: McpServer, wallet: EVMWallet): void {
  // Get NFT info
  server.tool(
    "evm_get_nft",
    "Get information about an NFT (ERC721)",
    {
      collection: z.string().describe("NFT collection/contract address"),
      tokenId: z.string().describe("NFT token ID"),
    },
    async (args) => {
      try {
        const publicClient = wallet.getPublicClient();

        const [owner, tokenURI, name, symbol] = await Promise.all([
          publicClient.readContract({
            address: args.collection as `0x${string}`,
            abi: ERC721_ABI,
            functionName: "ownerOf",
            args: [BigInt(args.tokenId)],
          }),
          publicClient.readContract({
            address: args.collection as `0x${string}`,
            abi: ERC721_ABI,
            functionName: "tokenURI",
            args: [BigInt(args.tokenId)],
          }).catch(() => null),
          publicClient.readContract({
            address: args.collection as `0x${string}`,
            abi: ERC721_ABI,
            functionName: "name",
          }).catch(() => null),
          publicClient.readContract({
            address: args.collection as `0x${string}`,
            abi: ERC721_ABI,
            functionName: "symbol",
          }).catch(() => null),
        ]);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  nft: {
                    collection: args.collection,
                    tokenId: args.tokenId,
                    owner,
                    tokenURI,
                    name,
                    symbol,
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

  // Get NFT balance
  server.tool(
    "evm_nft_balance",
    "Get the number of NFTs owned in a collection",
    {
      collection: z.string().describe("NFT collection/contract address"),
      address: z.string().optional().describe("Address to check (defaults to wallet)"),
    },
    async (args) => {
      try {
        const publicClient = wallet.getPublicClient();
        const address = args.address ?? wallet.address;

        const balance = await publicClient.readContract({
          address: args.collection as `0x${string}`,
          abi: ERC721_ABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  collection: args.collection,
                  address,
                  balance: balance.toString(),
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

  // Transfer NFT
  server.tool(
    "evm_transfer_nft",
    "Transfer an NFT (ERC721) to another address",
    {
      collection: z.string().describe("NFT collection/contract address"),
      tokenId: z.string().describe("NFT token ID"),
      to: z.string().describe("Recipient address"),
      safe: z.boolean().optional().default(true).describe("Use safeTransferFrom"),
    },
    async (args) => {
      try {
        const walletClient = wallet.getWalletClient();

        const hash = await walletClient.writeContract({
          address: args.collection as `0x${string}`,
          abi: ERC721_ABI,
          functionName: args.safe ? "safeTransferFrom" : "transferFrom",
          args: [
            wallet.address as `0x${string}`,
            args.to as `0x${string}`,
            BigInt(args.tokenId),
          ],
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  transaction: { hash, status: "pending" },
                  message: `Transferred NFT #${args.tokenId} to ${args.to}`,
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
