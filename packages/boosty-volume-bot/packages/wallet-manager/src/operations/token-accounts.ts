/**
 * Token account operations
 * Manages SPL token accounts for wallets
 */

import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
} from '@solana/spl-token';
import type {
  TokenAccount,
  WalletErrorCode,
} from '../types.js';
import { WalletManagerError } from '../types.js';

/**
 * Get all token accounts for a wallet
 * @param connection - Solana connection
 * @param address - Wallet address
 * @returns Array of token accounts
 */
export async function getTokenAccounts(
  connection: Connection,
  address: string
): Promise<TokenAccount[]> {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(address);
  } catch {
    throw new WalletManagerError(
      'WALLET_NOT_FOUND' as WalletErrorCode,
      'Invalid wallet address'
    );
  }

  // Get all token accounts
  const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  // Get rent-exempt minimum
  const rentExemptMinimum = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );

  const accounts: TokenAccount[] = [];

  for (const { account, pubkey } of tokenAccounts.value) {
    const accountData = AccountLayout.decode(account.data);

    accounts.push({
      address: pubkey.toString(),
      mint: new PublicKey(accountData.mint).toString(),
      owner: new PublicKey(accountData.owner).toString(),
      amount: BigInt(accountData.amount.toString()),
      decimals: 0, // Would need to fetch from mint
      isDelegate: accountData.delegateOption === 1,
      rentExemptReserve: BigInt(rentExemptMinimum),
    });
  }

  return accounts;
}

/**
 * Get empty token accounts that can be closed to recover rent
 * @param connection - Solana connection
 * @param address - Wallet address
 * @returns Array of empty token accounts
 */
export async function getEmptyTokenAccounts(
  connection: Connection,
  address: string
): Promise<TokenAccount[]> {
  const accounts = await getTokenAccounts(connection, address);
  return accounts.filter(acc => acc.amount === BigInt(0));
}

/**
 * Get the associated token address for a wallet and mint
 * @param walletAddress - Wallet address
 * @param mintAddress - Token mint address
 * @returns The associated token address
 */
export async function getAssociatedTokenAccountAddress(
  walletAddress: string,
  mintAddress: string
): Promise<string> {
  const wallet = new PublicKey(walletAddress);
  const mint = new PublicKey(mintAddress);

  const ata = await getAssociatedTokenAddress(mint, wallet);
  return ata.toString();
}

/**
 * Check if a token account exists
 * @param connection - Solana connection
 * @param tokenAccountAddress - Token account address
 * @returns True if the account exists
 */
export async function tokenAccountExists(
  connection: Connection,
  tokenAccountAddress: string
): Promise<boolean> {
  try {
    const pubkey = new PublicKey(tokenAccountAddress);
    const account = await connection.getAccountInfo(pubkey);
    return account !== null;
  } catch {
    return false;
  }
}

/**
 * Create instructions to create an associated token account
 * @param payerAddress - Address paying for the account
 * @param walletAddress - Wallet that will own the token account
 * @param mintAddress - Token mint address
 * @returns The create ATA instruction
 */
export async function createTokenAccountInstruction(
  payerAddress: string,
  walletAddress: string,
  mintAddress: string
): Promise<{
  instruction: ReturnType<typeof createAssociatedTokenAccountInstruction>;
  tokenAccountAddress: string;
}> {
  const payer = new PublicKey(payerAddress);
  const wallet = new PublicKey(walletAddress);
  const mint = new PublicKey(mintAddress);

  const ata = await getAssociatedTokenAddress(mint, wallet);

  const instruction = createAssociatedTokenAccountInstruction(
    payer,
    ata,
    wallet,
    mint
  );

  return {
    instruction,
    tokenAccountAddress: ata.toString(),
  };
}

/**
 * Create instructions to close an empty token account
 * @param tokenAccountAddress - Token account to close
 * @param ownerAddress - Owner of the token account
 * @param destinationAddress - Where to send the rent
 * @returns The close account instruction
 */
export function createCloseTokenAccountInstruction(
  tokenAccountAddress: string,
  ownerAddress: string,
  destinationAddress: string
): ReturnType<typeof createCloseAccountInstruction> {
  const tokenAccount = new PublicKey(tokenAccountAddress);
  const owner = new PublicKey(ownerAddress);
  const destination = new PublicKey(destinationAddress);

  return createCloseAccountInstruction(
    tokenAccount,
    destination,
    owner
  );
}

/**
 * Build a transaction to close all empty token accounts
 * @param connection - Solana connection
 * @param walletAddress - Wallet address
 * @returns Transaction and list of accounts to close
 */
export async function buildCloseEmptyAccountsTransaction(
  connection: Connection,
  walletAddress: string
): Promise<{
  transaction: Transaction;
  accountsToClose: string[];
  rentToRecover: bigint;
}> {
  const emptyAccounts = await getEmptyTokenAccounts(connection, walletAddress);

  if (emptyAccounts.length === 0) {
    throw new WalletManagerError(
      'TRANSACTION_FAILED' as WalletErrorCode,
      'No empty token accounts to close'
    );
  }

  const transaction = new Transaction();
  const owner = new PublicKey(walletAddress);
  let rentToRecover = BigInt(0);

  // Add close instructions for each empty account
  for (const account of emptyAccounts) {
    const instruction = createCloseAccountInstruction(
      new PublicKey(account.address),
      owner, // Rent goes back to owner
      owner
    );
    transaction.add(instruction);
    rentToRecover += account.rentExemptReserve;
  }

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = owner;

  return {
    transaction,
    accountsToClose: emptyAccounts.map(a => a.address),
    rentToRecover,
  };
}

/**
 * Estimate the rent that can be recovered by closing empty accounts
 * @param connection - Solana connection
 * @param walletAddress - Wallet address
 * @returns Estimated rent recovery in lamports
 */
export async function estimateRentRecovery(
  connection: Connection,
  walletAddress: string
): Promise<{
  accountCount: number;
  totalRent: bigint;
  totalRentSol: number;
}> {
  const emptyAccounts = await getEmptyTokenAccounts(connection, walletAddress);

  const totalRent = emptyAccounts.reduce(
    (sum, acc) => sum + acc.rentExemptReserve,
    BigInt(0)
  );

  return {
    accountCount: emptyAccounts.length,
    totalRent,
    totalRentSol: Number(totalRent) / LAMPORTS_PER_SOL,
  };
}

/**
 * Get token account info for a specific mint
 * @param connection - Solana connection
 * @param walletAddress - Wallet address
 * @param mintAddress - Token mint address
 * @returns Token account info or null
 */
export async function getTokenAccountForMint(
  connection: Connection,
  walletAddress: string,
  mintAddress: string
): Promise<TokenAccount | null> {
  const accounts = await getTokenAccounts(connection, walletAddress);
  return accounts.find(acc => acc.mint === mintAddress) || null;
}
