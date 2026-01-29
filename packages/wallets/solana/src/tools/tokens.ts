/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * Token tools - SPL token operations
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import type { SolanaWallet } from "../wallet.js";

/**
 * Register token-related tools
 */
export function registerTokenTools(server: McpServer, wallet: SolanaWallet): void {
  // Get associated token account
  server.tool(
    "solana_get_token_account",
    "Get the associated token account address for a mint",
    {
      mint: z.string().describe("Token mint address"),
      owner: z.string().optional().describe("Owner address (defaults to wallet)"),
    },
    async (args) => {
      try {
        const mintPubkey = new PublicKey(args.mint);
        const ownerPubkey = args.owner
          ? new PublicKey(args.owner)
          : wallet.getPublicKey();

        const ata = await getAssociatedTokenAddress(mintPubkey, ownerPubkey);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  mint: args.mint,
                  owner: ownerPubkey.toBase58(),
                  tokenAccount: ata.toBase58(),
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

  // Create associated token account
  server.tool(
    "solana_create_token_account",
    "Create an associated token account for a mint",
    {
      mint: z.string().describe("Token mint address"),
      owner: z.string().optional().describe("Owner address (defaults to wallet)"),
    },
    async (args) => {
      try {
        const mintPubkey = new PublicKey(args.mint);
        const ownerPubkey = args.owner
          ? new PublicKey(args.owner)
          : wallet.getPublicKey();

        const ata = await getAssociatedTokenAddress(mintPubkey, ownerPubkey);

        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.getPublicKey(), // payer
            ata, // associated token account
            ownerPubkey, // owner
            mintPubkey // mint
          )
        );

        const signature = await sendAndConfirmTransaction(
          wallet.getConnection(),
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
                  tokenAccount: ata.toBase58(),
                  mint: args.mint,
                  owner: ownerPubkey.toBase58(),
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
