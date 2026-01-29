/**
 * Token-2022 Operations
 * SPL Token-2022 program interactions with extension support
 */

import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  createInitializeInterestBearingMintInstruction,
  createInitializePermanentDelegateInstruction,
  createInitializeNonTransferableMintInstruction,
  createTransferCheckedWithFeeInstruction,
  getTransferFeeConfig,
  calculateEpochFee,
  getMint,
  getAccount,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { TokenMintInfo, Token2022Extensions, CreateTokenParams } from '../types.js';
import { logger } from '../utils/logger.js';

/**
 * Get Token-2022 mint information with extensions
 */
export async function getToken2022Mint(
  connection: Connection,
  mint: PublicKey
): Promise<{ mint: TokenMintInfo; extensions: Token2022Extensions } | null> {
  try {
    const mintInfo = await getMint(connection, mint, 'confirmed', TOKEN_2022_PROGRAM_ID);
    
    const extensions: Token2022Extensions = {};
    
    // Check for transfer fee extension
    const feeConfig = getTransferFeeConfig(mintInfo);
    if (feeConfig) {
      extensions.transferFeeConfig = {
        transferFeeBasisPoints: feeConfig.newerTransferFee.transferFeeBasisPoints,
        maximumFee: feeConfig.newerTransferFee.maximumFee,
        withheldAmount: feeConfig.withheldAmount,
      };
    }
    
    return {
      mint: {
        address: mint,
        supply: mintInfo.supply,
        decimals: mintInfo.decimals,
        mintAuthority: mintInfo.mintAuthority,
        freezeAuthority: mintInfo.freezeAuthority,
        isInitialized: mintInfo.isInitialized,
      },
      extensions,
    };
  } catch (error) {
    logger.debug('Failed to get Token-2022 mint', { mint: mint.toBase58(), error: (error as Error).message });
    return null;
  }
}

/**
 * Get all token accounts for a wallet (Token-2022)
 */
export async function getToken2022AccountsByOwner(
  connection: Connection,
  owner: PublicKey
): Promise<Array<{ pubkey: PublicKey; mint: PublicKey; amount: bigint; decimals: number }>> {
  const accounts = await connection.getTokenAccountsByOwner(
    owner,
    { programId: TOKEN_2022_PROGRAM_ID }
  );
  
  const tokenAccounts: Array<{ pubkey: PublicKey; mint: PublicKey; amount: bigint; decimals: number }> = [];
  
  for (const { pubkey } of accounts.value) {
    try {
      const account = await getAccount(connection, pubkey, 'confirmed', TOKEN_2022_PROGRAM_ID);
      const mintInfo = await getMint(connection, account.mint, 'confirmed', TOKEN_2022_PROGRAM_ID);
      
      tokenAccounts.push({
        pubkey,
        mint: account.mint,
        amount: account.amount,
        decimals: mintInfo.decimals,
      });
    } catch (error) {
      logger.debug('Failed to parse Token-2022 account', { address: pubkey.toBase58() });
    }
  }
  
  return tokenAccounts;
}

/**
 * Calculate mint size with extensions
 */
export function calculateToken2022MintSize(extensions: ExtensionType[]): number {
  return getMintLen(extensions);
}

/**
 * Create instructions to initialize a Token-2022 mint with extensions
 */
export async function createToken2022MintInstructions(
  connection: Connection,
  payer: PublicKey,
  mintKeypair: Keypair,
  params: CreateTokenParams
): Promise<TransactionInstruction[]> {
  const instructions: TransactionInstruction[] = [];
  const extensions: ExtensionType[] = [];
  
  // Determine required extensions
  if (params.extensions?.transferFeeConfig) {
    extensions.push(ExtensionType.TransferFeeConfig);
  }
  if (params.extensions?.interestBearingConfig) {
    extensions.push(ExtensionType.InterestBearingConfig);
  }
  if (params.extensions?.permanentDelegate) {
    extensions.push(ExtensionType.PermanentDelegate);
  }
  if (params.extensions?.nonTransferable) {
    extensions.push(ExtensionType.NonTransferable);
  }
  
  // Calculate space needed
  const mintLen = getMintLen(extensions);
  const rentExemption = await connection.getMinimumBalanceForRentExemption(mintLen);
  
  // Create account
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports: rentExemption,
      programId: TOKEN_2022_PROGRAM_ID,
    })
  );
  
  // Initialize extensions (must be done before initializing mint)
  if (params.extensions?.transferFeeConfig) {
    instructions.push(
      createInitializeTransferFeeConfigInstruction(
        mintKeypair.publicKey,
        params.mintAuthority,
        params.mintAuthority, // withdraw authority
        params.extensions.transferFeeConfig.transferFeeBasisPoints,
        params.extensions.transferFeeConfig.maximumFee,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }
  
  if (params.extensions?.interestBearingConfig) {
    instructions.push(
      createInitializeInterestBearingMintInstruction(
        mintKeypair.publicKey,
        params.mintAuthority,
        params.extensions.interestBearingConfig.currentRate,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }
  
  if (params.extensions?.permanentDelegate) {
    instructions.push(
      createInitializePermanentDelegateInstruction(
        mintKeypair.publicKey,
        params.extensions.permanentDelegate,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }
  
  if (params.extensions?.nonTransferable) {
    instructions.push(
      createInitializeNonTransferableMintInstruction(
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }
  
  // Initialize mint
  instructions.push(
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      params.decimals,
      params.mintAuthority,
      params.freezeAuthority ?? null,
      TOKEN_2022_PROGRAM_ID
    )
  );
  
  return instructions;
}

/**
 * Create transfer instruction with fee (Token-2022)
 */
export async function createTransferWithFeeInstruction(
  connection: Connection,
  source: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: bigint,
  decimals: number
): Promise<TransactionInstruction> {
  // Get current epoch for fee calculation
  const epochInfo = await connection.getEpochInfo();
  
  // Get mint info with transfer fee config
  const mintInfo = await getMint(connection, mint, 'confirmed', TOKEN_2022_PROGRAM_ID);
  const feeConfig = getTransferFeeConfig(mintInfo);
  
  if (!feeConfig) {
    throw new Error('Mint does not have transfer fee extension');
  }
  
  // Calculate fee
  const fee = calculateEpochFee(feeConfig, BigInt(epochInfo.epoch), amount);
  
  return createTransferCheckedWithFeeInstruction(
    source,
    mint,
    destination,
    owner,
    amount,
    decimals,
    fee,
    [],
    TOKEN_2022_PROGRAM_ID
  );
}

/**
 * Get ATA for Token-2022
 */
export function getToken2022ATA(mint: PublicKey, owner: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(
    mint,
    owner,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

/**
 * Create ATA instruction for Token-2022
 */
export function createToken2022ATAInstruction(
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
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

/**
 * Check if a mint is Token-2022
 */
export async function isToken2022Mint(
  connection: Connection,
  mint: PublicKey
): Promise<boolean> {
  try {
    const accountInfo = await connection.getAccountInfo(mint);
    if (!accountInfo) return false;
    return accountInfo.owner.equals(TOKEN_2022_PROGRAM_ID);
  } catch {
    return false;
  }
}

/**
 * Get the correct token program for a mint
 */
export async function getTokenProgramForMint(
  connection: Connection,
  mint: PublicKey
): Promise<PublicKey> {
  const is2022 = await isToken2022Mint(connection, mint);
  return is2022 ? TOKEN_2022_PROGRAM_ID : (await import('@solana/spl-token')).TOKEN_PROGRAM_ID;
}
