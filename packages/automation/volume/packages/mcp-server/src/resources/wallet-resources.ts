/**
 * Wallet Resources
 * MCP resource providers for wallet data
 * Integrated with Solana RPC and Helius API
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

// Solana RPC endpoint
const SOLANA_RPC = process.env.HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  : process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// In-memory wallet storage (in production, use database)
const walletStore = new Map<string, {
  address: string;
  tag?: string;
  createdAt: Date;
}>();

export const walletResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: 'wallets://list',
    name: 'Wallet List',
    description: 'List of all wallets with balances',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'wallets://{walletId}',
    name: 'Wallet Details',
    description: 'Detailed information about a specific wallet',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'wallets://{walletId}/transactions',
    name: 'Wallet Transactions',
    description: 'Recent transactions for a wallet',
    mimeType: 'application/json',
  },
];

export async function getWalletListResource(): Promise<Resource & { content: string }> {
  logger.debug('Fetching wallet list resource');
  
  const wallets = Array.from(walletStore.entries()).map(([id, wallet]) => ({
    id,
    address: wallet.address,
    tag: wallet.tag,
    createdAt: wallet.createdAt.toISOString(),
  }));
  
  // Fetch SOL balances for all wallets
  const walletsWithBalances = await Promise.all(
    wallets.map(async (wallet) => {
      try {
        const balance = await fetchSolBalance(wallet.address);
        return { ...wallet, balanceSOL: balance };
      } catch {
        return { ...wallet, balanceSOL: 0 };
      }
    })
  );
  
  return {
    uri: 'wallets://list',
    name: 'Wallet List',
    mimeType: 'application/json',
    content: JSON.stringify({ wallets: walletsWithBalances, total: wallets.length }, null, 2),
  };
}

export async function getWalletResource(walletId: string): Promise<Resource & { content: string }> {
  logger.debug({ walletId }, 'Fetching wallet resource');
  
  const wallet = walletStore.get(walletId);
  if (!wallet) {
    return {
      uri: `wallets://${walletId}`,
      name: `Wallet ${walletId}`,
      mimeType: 'application/json',
      content: JSON.stringify({ error: 'Wallet not found' }, null, 2),
    };
  }
  
  // Fetch balance and token accounts
  const [solBalance, tokenAccounts] = await Promise.all([
    fetchSolBalance(wallet.address),
    fetchTokenAccounts(wallet.address),
  ]);
  
  return {
    uri: `wallets://${walletId}`,
    name: `Wallet ${walletId}`,
    mimeType: 'application/json',
    content: JSON.stringify({
      id: walletId,
      address: wallet.address,
      tag: wallet.tag,
      balanceSOL: solBalance,
      tokens: tokenAccounts,
      createdAt: wallet.createdAt.toISOString(),
    }, null, 2),
  };
}

export async function getWalletTransactionsResource(walletId: string): Promise<Resource & { content: string }> {
  logger.debug({ walletId }, 'Fetching wallet transactions resource');
  
  const wallet = walletStore.get(walletId);
  if (!wallet) {
    return {
      uri: `wallets://${walletId}/transactions`,
      name: `Transactions for ${walletId}`,
      mimeType: 'application/json',
      content: JSON.stringify({ error: 'Wallet not found' }, null, 2),
    };
  }
  
  // Fetch recent transactions
  const transactions = await fetchRecentTransactions(wallet.address);
  
  return {
    uri: `wallets://${walletId}/transactions`,
    name: `Transactions for ${walletId}`,
    mimeType: 'application/json',
    content: JSON.stringify({ transactions }, null, 2),
  };
}

// Helper to register a wallet
export function registerWallet(id: string, address: string, tag?: string) {
  walletStore.set(id, { address, tag, createdAt: new Date() });
}

// Fetch SOL balance via RPC
async function fetchSolBalance(address: string): Promise<number> {
  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return 0;

    const data = await response.json() as { result?: { value?: number } };
    return (data.result?.value || 0) / 1e9; // Convert lamports to SOL
  } catch (error) {
    logger.error({ error, address }, 'Failed to fetch SOL balance');
    return 0;
  }
}

// Fetch token accounts via RPC
async function fetchTokenAccounts(address: string): Promise<Array<{ mint: string; amount: string }>> {
  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const data = await response.json() as {
      result?: {
        value?: Array<{
          account: {
            data: {
              parsed: {
                info: { mint: string; tokenAmount: { uiAmountString: string } };
              };
            };
          };
        }>;
      };
    };

    return (data.result?.value || []).map((acc) => ({
      mint: acc.account.data.parsed.info.mint,
      amount: acc.account.data.parsed.info.tokenAmount.uiAmountString,
    }));
  } catch (error) {
    logger.error({ error, address }, 'Failed to fetch token accounts');
    return [];
  }
}

// Fetch recent transactions via RPC
async function fetchRecentTransactions(address: string): Promise<Array<{ signature: string; slot: number; blockTime: number | null }>> {
  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [address, { limit: 20 }],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const data = await response.json() as {
      result?: Array<{ signature: string; slot: number; blockTime: number | null }>;
    };

    return data.result || [];
  } catch (error) {
    logger.error({ error, address }, 'Failed to fetch transactions');
    return [];
  }
}
