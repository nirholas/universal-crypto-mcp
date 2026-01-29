/**
 * Balance operations for Solana wallets
 * Fetches SOL and SPL token balances with real token metadata
 */

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
} from '@solana/spl-token';
import type {
  WalletBalance,
  TokenBalance,
  WalletErrorCode,
} from '../types.js';
import { WalletManagerError } from '../types.js';

/**
 * Token metadata with additional fields
 */
interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
}

/**
 * Token metadata cache (populated from Jupiter token list)
 */
const tokenMetadataCache = new Map<string, TokenMetadata>();

/**
 * Flag to track if token list has been loaded
 */
let tokenListLoaded = false;

/**
 * Jupiter token list URL (strict list for verified tokens)
 */
const JUPITER_TOKEN_LIST_URL = 'https://token.jup.ag/strict';

/**
 * Load token list from Jupiter API
 * This fetches real token metadata including symbols, names, and decimals
 */
export async function loadTokenList(): Promise<void> {
  if (tokenListLoaded) return;
  
  try {
    const response = await fetch(JUPITER_TOKEN_LIST_URL, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch Jupiter token list: ${response.status}`);
      return;
    }
    
    const tokens = await response.json() as Array<{
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      logoURI?: string;
      extensions?: { coingeckoId?: string };
    }>;
    
    for (const token of tokens) {
      tokenMetadataCache.set(token.address, {
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI,
        coingeckoId: token.extensions?.coingeckoId,
      });
    }
    
    tokenListLoaded = true;
    console.log(`Loaded ${tokens.length} tokens from Jupiter token list`);
  } catch (error) {
    console.warn('Failed to load Jupiter token list:', error);
  }
}

/**
 * Get the balance of a wallet (SOL + all tokens)
 * @param connection - Solana connection
 * @param address - Wallet address
 * @param solPrice - Current SOL price in USD (optional)
 * @returns Complete wallet balance
 */
export async function getWalletBalance(
  connection: Connection,
  address: string,
  solPrice?: number
): Promise<WalletBalance> {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(address);
  } catch {
    throw new WalletManagerError(
      'WALLET_NOT_FOUND' as WalletErrorCode,
      'Invalid wallet address'
    );
  }

  // Get SOL balance
  const lamports = await connection.getBalance(publicKey);
  const sol = BigInt(lamports);
  const solAmount = lamports / LAMPORTS_PER_SOL;
  const solUsd = solPrice ? solAmount * solPrice : 0;

  // Get all token accounts
  const tokens = await getAllTokenBalances(connection, address);

  // Calculate total USD value
  const tokenValueUsd = tokens.reduce((sum, t) => sum + (t.usdValue || 0), 0);
  const totalValueUsd = solUsd + tokenValueUsd;

  return {
    sol,
    solUsd,
    tokens,
    totalValueUsd,
    lastUpdated: new Date(),
  };
}

/**
 * Get balances for multiple wallets
 * @param connection - Solana connection
 * @param addresses - Array of wallet addresses
 * @param solPrice - Current SOL price in USD (optional)
 * @returns Map of address to balance
 */
export async function getWalletBalances(
  connection: Connection,
  addresses: string[],
  solPrice?: number
): Promise<Map<string, WalletBalance>> {
  const balances = new Map<string, WalletBalance>();

  // Batch fetch SOL balances
  const publicKeys = addresses.map(addr => {
    try {
      return new PublicKey(addr);
    } catch {
      return null;
    }
  });

  const validAddresses: string[] = [];
  const validPublicKeys: PublicKey[] = [];

  publicKeys.forEach((pk, i) => {
    const addr = addresses[i];
    if (pk && addr) {
      validAddresses.push(addr);
      validPublicKeys.push(pk);
    }
  });

  // Use getMultipleAccountsInfo for batch fetching
  const accountInfos = await connection.getMultipleAccountsInfo(validPublicKeys);

  // Process each account
  const promises = validAddresses.map(async (address, i) => {
    const accountInfo = accountInfos[i];
    const lamports = accountInfo?.lamports ?? 0;
    const sol = BigInt(lamports);
    const solAmount = lamports / LAMPORTS_PER_SOL;
    const solUsd = solPrice ? solAmount * solPrice : 0;

    // Get token balances (this could be optimized further with batch RPC)
    const tokens = await getAllTokenBalances(connection, address);

    const tokenValueUsd = tokens.reduce((sum, t) => sum + (t.usdValue || 0), 0);
    const totalValueUsd = solUsd + tokenValueUsd;

    const balance: WalletBalance = {
      sol,
      solUsd,
      tokens,
      totalValueUsd,
      lastUpdated: new Date(),
    };

    balances.set(address, balance);
  });

  await Promise.all(promises);

  return balances;
}

/**
 * Get all token balances for a wallet
 * @param connection - Solana connection
 * @param address - Wallet address
 * @returns Array of token balances
 */
export async function getAllTokenBalances(
  connection: Connection,
  address: string
): Promise<TokenBalance[]> {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(address);
  } catch {
    return [];
  }

  // Get all token accounts for this owner
  const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  const balances: TokenBalance[] = [];

  for (const { account, pubkey } of tokenAccounts.value) {
    const accountData = AccountLayout.decode(account.data);
    const mint = new PublicKey(accountData.mint).toString();
    const amount = BigInt(accountData.amount.toString());

    // Skip zero balances
    if (amount === BigInt(0)) {
      continue;
    }

    // Get token metadata (from cache or fetch)
    const metadata = await getTokenMetadata(connection, mint);

    const balance: TokenBalance = {
      mint,
      symbol: metadata.symbol,
      name: metadata.name,
      amount,
      decimals: metadata.decimals,
      uiAmount: Number(amount) / Math.pow(10, metadata.decimals),
      tokenAccount: pubkey.toString(),
    };

    balances.push(balance);
  }

  return balances;
}

/**
 * Get a specific token balance
 * @param connection - Solana connection
 * @param address - Wallet address
 * @param tokenMint - Token mint address
 * @returns Token balance or null if not found
 */
export async function getTokenBalance(
  connection: Connection,
  address: string,
  tokenMint: string
): Promise<TokenBalance | null> {
  const balances = await getAllTokenBalances(connection, address);
  return balances.find(b => b.mint === tokenMint) || null;
}

/**
 * Get token metadata - first from cache, then from on-chain
 * @param connection - Solana connection
 * @param mint - Token mint address
 * @returns Token metadata
 */
async function getTokenMetadata(
  connection: Connection,
  mint: string
): Promise<TokenMetadata> {
  // Check cache first (includes Jupiter token list data)
  if (tokenMetadataCache.has(mint)) {
    return tokenMetadataCache.get(mint)!;
  }

  // Load token list if not already loaded
  if (!tokenListLoaded) {
    await loadTokenList();
    
    // Check cache again after loading
    if (tokenMetadataCache.has(mint)) {
      return tokenMetadataCache.get(mint)!;
    }
  }

  try {
    // Fetch mint info to get decimals from on-chain
    const mintPubkey = new PublicKey(mint);
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);

    let decimals = 9; // Default for SPL tokens

    if (mintInfo.value?.data && 'parsed' in mintInfo.value.data) {
      decimals = mintInfo.value.data.parsed.info.decimals ?? 9;
    }

    // For unknown tokens, use shortened address as symbol
    const metadata: TokenMetadata = {
      symbol: shortenAddress(mint),
      name: `Unknown Token (${shortenAddress(mint)})`,
      decimals,
    };

    tokenMetadataCache.set(mint, metadata);
    return metadata;
  } catch {
    // Return defaults on error
    const metadata: TokenMetadata = {
      symbol: shortenAddress(mint),
      name: `Token ${shortenAddress(mint)}`,
      decimals: 9,
    };
    return metadata;
  }
}

/**
 * Shorten an address for display
 */
function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Set token metadata manually (useful for known tokens)
 * @param mint - Token mint address
 * @param metadata - Token metadata
 */
export function setTokenMetadata(
  mint: string,
  metadata: { symbol: string; name: string; decimals: number }
): void {
  tokenMetadataCache.set(mint, metadata);
}

/**
 * Clear the token metadata cache
 */
export function clearTokenMetadataCache(): void {
  tokenMetadataCache.clear();
}
