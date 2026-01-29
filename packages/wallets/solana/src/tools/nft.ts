/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * NFT tools - Metaplex NFT operations
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import type { SolanaWallet } from "../wallet.js";

/**
 * Register NFT-related tools
 */
export function registerNFTTools(server: McpServer, wallet: SolanaWallet): void {
  // Get NFT info
  server.tool(
    "solana_get_nft",
    "Get information about an NFT by its mint address",
    {
      mint: z.string().describe("NFT mint address"),
    },
    async (args) => {
      try {
        const mintPubkey = new PublicKey(args.mint);
        const connection = wallet.getConnection();

        // Get the token account holding this NFT
        const ata = await getAssociatedTokenAddress(
          mintPubkey,
          wallet.getPublicKey()
        );

        let isOwned = false;
        try {
          const account = await getAccount(connection, ata);
          isOwned = account.amount === 1n;
        } catch {
          // Account doesn't exist
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  nft: {
                    mint: args.mint,
                    tokenAccount: ata.toBase58(),
                    isOwned,
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

  // Transfer NFT
  server.tool(
    "solana_transfer_nft",
    "Transfer an NFT to another address",
    {
      mint: z.string().describe("NFT mint address"),
      to: z.string().describe("Recipient address"),
    },
    async (args) => {
      try {
        const mintPubkey = new PublicKey(args.mint);
        const toPubkey = new PublicKey(args.to);
        const connection = wallet.getConnection();

        const fromAta = await getAssociatedTokenAddress(
          mintPubkey,
          wallet.getPublicKey()
        );
        const toAta = await getAssociatedTokenAddress(mintPubkey, toPubkey);

        const transaction = new Transaction().add(
          createTransferInstruction(
            fromAta,
            toAta,
            wallet.getPublicKey(),
            1 // NFT amount is always 1
          )
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [wallet.getKeypair()],
          { commitment: "confirmed" }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  transaction: { hash: signature, status: "confirmed" },
                  message: `Transferred NFT ${args.mint} to ${args.to}`,
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
