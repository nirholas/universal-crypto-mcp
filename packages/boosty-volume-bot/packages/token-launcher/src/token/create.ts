/**
 * Token Creation Module
 * Create SPL tokens with optional metadata
 */

import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import type {
  CreateTokenParams,
  CreateTokenWithMetadataParams,
  CreateTokenResult,
} from '../types.js';
import { TokenLaunchError, TokenLaunchErrorCode } from '../types.js';
import { logger } from '../utils/logger.js';

/**
 * Build instructions for creating a new SPL token
 */
export async function buildCreateTokenInstructions(
  connection: Connection,
  params: CreateTokenParams,
  payer: PublicKey,
  mintKeypair: Keypair
): Promise<{
  instructions: any[];
  signers: Keypair[];
}> {
  const { decimals, totalSupply, revokeMintAuthority, revokeFreezeAuthority } = params;
  
  const instructions: any[] = [];
  const signers: Keypair[] = [mintKeypair];
  
  // Get rent for mint account
  const mintRent = await getMinimumBalanceForRentExemptMint(connection);
  
  // Create mint account
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  
  // Initialize mint
  instructions.push(
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer, // mint authority
      revokeFreezeAuthority ? null : payer // freeze authority
    )
  );
  
  // Create ATA for payer to receive tokens
  const payerAta = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer);
  
  instructions.push(
    createAssociatedTokenAccountInstruction(
      payer,
      payerAta,
      payer,
      mintKeypair.publicKey
    )
  );
  
  // Mint total supply to payer
  const supplyBigInt = BigInt(totalSupply);
  const adjustedSupply = supplyBigInt * BigInt(10 ** decimals);
  
  instructions.push(
    createMintToInstruction(
      mintKeypair.publicKey,
      payerAta,
      payer,
      adjustedSupply
    )
  );
  
  // Optionally revoke mint authority
  if (revokeMintAuthority) {
    instructions.push(
      createSetAuthorityInstruction(
        mintKeypair.publicKey,
        payer,
        AuthorityType.MintTokens,
        null
      )
    );
  }
  
  return { instructions, signers };
}

/**
 * Create a new SPL token
 */
export async function createToken(
  connection: Connection,
  params: CreateTokenParams,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
): Promise<CreateTokenResult> {
  const mintKeypair = Keypair.generate();
  
  logger.info('Creating token', {
    name: params.name,
    symbol: params.symbol,
    decimals: params.decimals,
    totalSupply: params.totalSupply,
    mint: mintKeypair.publicKey.toBase58(),
  });
  
  try {
    // Build instructions (we need the payer pubkey from the signed tx)
    // For now, we'll use a placeholder approach
    const tempPayer = Keypair.generate().publicKey;
    
    const { instructions, signers } = await buildCreateTokenInstructions(
      connection,
      params,
      tempPayer,
      mintKeypair
    );
    
    // Add compute budget
    const computeInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50_000 }),
    ];
    
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
    const message = new TransactionMessage({
      payerKey: tempPayer,
      recentBlockhash: blockhash,
      instructions: [...computeInstructions, ...instructions],
    }).compileToV0Message();
    
    const transaction = new VersionedTransaction(message);
    
    // Sign with mint keypair
    transaction.sign(signers);
    
    // Sign with payer (via callback)
    const signedTx = await signTransaction(transaction);
    
    // Send transaction
    const signature = await connection.sendTransaction(signedTx);
    
    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
    
    logger.info('Token created successfully', {
      mint: mintKeypair.publicKey.toBase58(),
      signature,
    });
    
    return {
      success: true,
      mint: mintKeypair.publicKey.toBase58(),
      mintAuthority: params.revokeMintAuthority ? undefined : tempPayer.toBase58(),
      freezeAuthority: params.revokeFreezeAuthority ? undefined : tempPayer.toBase58(),
      signature,
      totalSupply: params.totalSupply,
      decimals: params.decimals,
    };
  } catch (error) {
    logger.error('Token creation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw new TokenLaunchError(
      TokenLaunchErrorCode.TRANSACTION_FAILED,
      `Token creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { mint: mintKeypair.publicKey.toBase58() }
    );
  }
}

/**
 * Create token with metadata (Metaplex)
 */
export async function createTokenWithMetadata(
  connection: Connection,
  params: CreateTokenWithMetadataParams,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>,
  uploadMetadata: (metadata: Record<string, unknown>) => Promise<string>
): Promise<CreateTokenResult> {
  const mintKeypair = Keypair.generate();
  
  logger.info('Creating token with metadata', {
    name: params.name,
    symbol: params.symbol,
    mint: mintKeypair.publicKey.toBase58(),
  });
  
  try {
    // Build metadata JSON
    const metadataJson = {
      name: params.name,
      symbol: params.symbol,
      description: params.description || '',
      image: params.image || '',
      external_url: params.externalUrl || '',
      attributes: params.attributes || [],
      properties: {
        files: params.image ? [{ uri: params.image, type: 'image/png' }] : [],
        category: 'fungible',
      },
    };
    
    // Upload metadata to IPFS/Arweave
    const metadataUri = await uploadMetadata(metadataJson);
    
    logger.info('Metadata uploaded', { uri: metadataUri });
    
    // Create token with metadata program
    // This requires Metaplex integration
    // For now, create basic token
    const result = await createToken(connection, params, signTransaction);
    
    return {
      ...result,
      metadataAddress: undefined, // TODO: Add when Metaplex integrated
    };
  } catch (error) {
    logger.error('Token with metadata creation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw error;
  }
}
