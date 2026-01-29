/**
 * SPL Token Operations
 * Standard SPL Token program interactions
 */

import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createMintToInstruction,
  createTransferInstruction,
  createBurnInstruction,
  createCloseAccountInstruction,
  createApproveInstruction,
  createRevokeInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  getAccount,
  getMint,
  createAssociatedTokenAccountInstruction,
  TokenAccountNotFoundError,
  getAssociatedTokenAddressSync,
  MINT_SIZE,
} from '@solana/spl-token';
import {
  TokenAccountInfo,
  TokenMintInfo,
  CreateTokenParams,
  TransferTokenParams,
} from '../types.js';
import { logger } from '../utils/logger.js';

/**
 * Get token account information
 */
export async function getTokenAccount(
  connection: Connection,
  address: PublicKey
): Promise<TokenAccountInfo | null> {
  try {
    const account = await getAccount(connection, address);
    
    // Get mint info for decimals
    const mintInfo = await getMint(connection, account.mint);
    
    return {
      address,
      mint: account.mint,
      owner: account.owner,
      amount: account.amount,
      decimals: mintInfo.decimals,
      isNative: account.isNative,
      delegatedAmount: account.delegatedAmount,
      delegate: account.delegate || undefined,
      closeAuthority: account.closeAuthority || undefined,
      state: account.isFrozen ? 'frozen' : 'initialized',
    };
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) {
      return null;
    }
    throw error;
  }
}

/**
 * Get token mint information
 */
export async function getTokenMint(
  connection: Connection,
  mint: PublicKey
): Promise<TokenMintInfo | null> {
  try {
    const mintInfo = await getMint(connection, mint);
    
    return {
      address: mint,
      supply: mintInfo.supply,
      decimals: mintInfo.decimals,
      mintAuthority: mintInfo.mintAuthority,
      freezeAuthority: mintInfo.freezeAuthority,
      isInitialized: mintInfo.isInitialized,
    };
  } catch (error) {
    logger.debug('Failed to get mint info', { mint: mint.toBase58(), error: (error as Error).message });
    return null;
  }
}

/**
 * Get all token accounts for a wallet
 */
export async function getTokenAccountsByOwner(
  connection: Connection,
  owner: PublicKey,
  programId: PublicKey = TOKEN_PROGRAM_ID
): Promise<TokenAccountInfo[]> {
  const accounts = await connection.getTokenAccountsByOwner(owner, { programId });
  
  const tokenAccounts: TokenAccountInfo[] = [];
  
  for (const { pubkey } of accounts.value) {
    try {
      const tokenAccount = await getTokenAccount(connection, pubkey);
      if (tokenAccount) {
        tokenAccounts.push(tokenAccount);
      }
    } catch (error) {
      logger.debug('Failed to parse token account', { address: pubkey.toBase58() });
    }
  }
  
  return tokenAccounts;
}

/**
 * Get Associated Token Address
 */
export function getATA(mint: PublicKey, owner: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(mint, owner, true);
}

/**
 * Create instructions to initialize a new token mint
 */
export async function createInitializeMintInstructions(
  connection: Connection,
  payer: PublicKey,
  mintKeypair: Keypair,
  params: CreateTokenParams
): Promise<TransactionInstruction[]> {
  const instructions: TransactionInstruction[] = [];
  
  // Get minimum rent for mint account
  const rentExemption = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
  
  // Create account instruction
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: rentExemption,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  
  // Initialize mint instruction
  instructions.push(
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      params.decimals,
      params.mintAuthority,
      params.freezeAuthority ?? null,
      TOKEN_PROGRAM_ID
    )
  );
  
  return instructions;
}

/**
 * Create instruction to create an Associated Token Account
 */
export function createATAInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey
): TransactionInstruction {
  return createAssociatedTokenAccountInstruction(
    payer,
    associatedToken,
    owner,
    mint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to mint tokens
 */
export function createMintInstruction(
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: bigint
): TransactionInstruction {
  return createMintToInstruction(
    mint,
    destination,
    authority,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to transfer tokens
 */
export function createTokenTransferInstruction(
  params: TransferTokenParams
): TransactionInstruction {
  return createTransferInstruction(
    params.source,
    params.destination,
    params.owner,
    params.amount,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to burn tokens
 */
export function createBurnTokenInstruction(
  account: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  amount: bigint
): TransactionInstruction {
  return createBurnInstruction(
    account,
    mint,
    owner,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to close a token account
 */
export function createCloseTokenAccountInstruction(
  account: PublicKey,
  destination: PublicKey,
  owner: PublicKey
): TransactionInstruction {
  return createCloseAccountInstruction(
    account,
    destination,
    owner,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to approve a delegate
 */
export function createApproveTokenInstruction(
  account: PublicKey,
  delegate: PublicKey,
  owner: PublicKey,
  amount: bigint
): TransactionInstruction {
  return createApproveInstruction(
    account,
    delegate,
    owner,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to revoke delegate
 */
export function createRevokeTokenInstruction(
  account: PublicKey,
  owner: PublicKey
): TransactionInstruction {
  return createRevokeInstruction(
    account,
    owner,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create instruction to set new authority
 */
export function createSetMintAuthorityInstruction(
  mint: PublicKey,
  currentAuthority: PublicKey,
  newAuthority: PublicKey | null,
  authorityType: 'mint' | 'freeze'
): TransactionInstruction {
  return createSetAuthorityInstruction(
    mint,
    currentAuthority,
    authorityType === 'mint' ? AuthorityType.MintTokens : AuthorityType.FreezeAccount,
    newAuthority,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Check if an ATA exists
 */
export async function ataExists(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<boolean> {
  const ata = getATA(mint, owner);
  const account = await connection.getAccountInfo(ata);
  return account !== null;
}

/**
 * Get or create ATA instructions
 */
export async function getOrCreateATAInstructions(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey
): Promise<{ address: PublicKey; instructions: TransactionInstruction[] }> {
  const ata = getATA(mint, owner);
  const exists = await ataExists(connection, mint, owner);
  
  if (exists) {
    return { address: ata, instructions: [] };
  }
  
  return {
    address: ata,
    instructions: [createATAInstruction(payer, ata, owner, mint)],
  };
}

/**
 * Calculate token amount with decimals
 */
export function toTokenAmount(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

/**
 * Format token amount from raw
 */
export function fromTokenAmount(amount: bigint, decimals: number): number {
  return Number(amount) / Math.pow(10, decimals);
}
