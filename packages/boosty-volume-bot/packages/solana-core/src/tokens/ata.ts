/**
 * Associated Token Account Management
 */

import {
  Connection,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { logger } from '../utils/logger.js';

/**
 * Get ATA address
 */
export function getAssociatedTokenAccount(
  mint: PublicKey,
  owner: PublicKey,
  programId: PublicKey = TOKEN_PROGRAM_ID
): PublicKey {
  return getAssociatedTokenAddressSync(
    mint,
    owner,
    true, // allowOwnerOffCurve
    programId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

/**
 * Check if ATA exists
 */
export async function checkATAExists(
  connection: Connection,
  ata: PublicKey
): Promise<boolean> {
  const account = await connection.getAccountInfo(ata);
  return account !== null;
}

/**
 * Create ATA instruction
 */
export function createATAInstruction(
  payer: PublicKey,
  ata: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId: PublicKey = TOKEN_PROGRAM_ID
): TransactionInstruction {
  return createAssociatedTokenAccountInstruction(
    payer,
    ata,
    owner,
    mint,
    programId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

/**
 * Get or create ATA
 * Returns the ATA address and instructions needed (if any)
 */
export async function getOrCreateATA(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
  programId: PublicKey = TOKEN_PROGRAM_ID
): Promise<{ ata: PublicKey; instructions: TransactionInstruction[] }> {
  const ata = getAssociatedTokenAccount(mint, owner, programId);
  const exists = await checkATAExists(connection, ata);
  
  if (exists) {
    return { ata, instructions: [] };
  }
  
  logger.debug('Creating ATA', {
    mint: mint.toBase58().slice(0, 8) + '...',
    owner: owner.toBase58().slice(0, 8) + '...',
  });
  
  return {
    ata,
    instructions: [createATAInstruction(payer, ata, owner, mint, programId)],
  };
}

/**
 * Get ATAs for multiple mints
 */
export async function getATAsForMints(
  connection: Connection,
  mints: PublicKey[],
  owner: PublicKey,
  payer: PublicKey,
  programId: PublicKey = TOKEN_PROGRAM_ID
): Promise<{ atas: Map<string, PublicKey>; instructions: TransactionInstruction[] }> {
  const atas = new Map<string, PublicKey>();
  const instructions: TransactionInstruction[] = [];
  
  for (const mint of mints) {
    const result = await getOrCreateATA(connection, mint, owner, payer, programId);
    atas.set(mint.toBase58(), result.ata);
    instructions.push(...result.instructions);
  }
  
  return { atas, instructions };
}

/**
 * Determine token program from account owner
 */
export async function determineTokenProgram(
  connection: Connection,
  mint: PublicKey
): Promise<PublicKey> {
  const accountInfo = await connection.getAccountInfo(mint);
  
  if (!accountInfo) {
    throw new Error(`Mint account not found: ${mint.toBase58()}`);
  }
  
  if (accountInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    return TOKEN_2022_PROGRAM_ID;
  }
  
  return TOKEN_PROGRAM_ID;
}

/**
 * Get all ATAs for an owner
 */
export async function getAllATAs(
  connection: Connection,
  owner: PublicKey,
  includeToken2022: boolean = true
): Promise<Array<{ address: PublicKey; mint: PublicKey; program: PublicKey }>> {
  const results: Array<{ address: PublicKey; mint: PublicKey; program: PublicKey }> = [];
  
  // Get standard SPL Token accounts
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    owner,
    { programId: TOKEN_PROGRAM_ID }
  );
  
  for (const { pubkey, account } of tokenAccounts.value) {
    // Parse mint from account data (first 32 bytes)
    const mint = new PublicKey(account.data.slice(0, 32));
    results.push({ address: pubkey, mint, program: TOKEN_PROGRAM_ID });
  }
  
  // Get Token-2022 accounts
  if (includeToken2022) {
    const token2022Accounts = await connection.getTokenAccountsByOwner(
      owner,
      { programId: TOKEN_2022_PROGRAM_ID }
    );
    
    for (const { pubkey, account } of token2022Accounts.value) {
      const mint = new PublicKey(account.data.slice(0, 32));
      results.push({ address: pubkey, mint, program: TOKEN_2022_PROGRAM_ID });
    }
  }
  
  return results;
}
