/**
 * Wallet Balance API Route
 * GET /api/wallets/balance - Get wallet balances
 * 
 * Production implementation using real blockchain RPC calls
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  createErrorResponse,
  parseQuery,
  setCacheHeaders,
} from '@/lib/api';
import { BadRequestError, APIException } from '@/lib/api/errors';
import type { Balance, TokenBalance, NFTBalance, RequestContext } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Configuration
// ============================================================================

const RPC_ENDPOINTS: Record<string, string> = {
  ethereum: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
  base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  arbitrum: process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
  optimism: process.env.OP_RPC_URL || 'https://mainnet.optimism.io',
  bsc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
  avalanche: process.env.AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
};

const CHAIN_CONFIG: Record<string, { chainId: number; symbol: string; coinGeckoId: string; decimals: number }> = {
  ethereum: { chainId: 1, symbol: 'ETH', coinGeckoId: 'ethereum', decimals: 18 },
  polygon: { chainId: 137, symbol: 'MATIC', coinGeckoId: 'matic-network', decimals: 18 },
  arbitrum: { chainId: 42161, symbol: 'ETH', coinGeckoId: 'ethereum', decimals: 18 },
  optimism: { chainId: 10, symbol: 'ETH', coinGeckoId: 'ethereum', decimals: 18 },
  base: { chainId: 8453, symbol: 'ETH', coinGeckoId: 'ethereum', decimals: 18 },
  bsc: { chainId: 56, symbol: 'BNB', coinGeckoId: 'binancecoin', decimals: 18 },
  avalanche: { chainId: 43114, symbol: 'AVAX', coinGeckoId: 'avalanche-2', decimals: 18 },
};

// Common token addresses by chain
const COMMON_TOKENS: Record<string, Array<{ address: string; symbol: string; name: string; decimals: number; coinGeckoId: string }>> = {
  ethereum: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6, coinGeckoId: 'usd-coin' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether', decimals: 6, coinGeckoId: 'tether' },
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, coinGeckoId: 'weth' },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'Chainlink', decimals: 18, coinGeckoId: 'chainlink' },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', decimals: 18, coinGeckoId: 'uniswap' },
  ],
  base: [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', name: 'USD Coin', decimals: 6, coinGeckoId: 'usd-coin' },
    { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, coinGeckoId: 'weth' },
  ],
  arbitrum: [
    { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', name: 'USD Coin', decimals: 6, coinGeckoId: 'usd-coin' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT', name: 'Tether', decimals: 6, coinGeckoId: 'tether' },
    { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, coinGeckoId: 'weth' },
    { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', name: 'Arbitrum', decimals: 18, coinGeckoId: 'arbitrum' },
  ],
  polygon: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', name: 'USD Coin', decimals: 6, coinGeckoId: 'usd-coin' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', name: 'Tether', decimals: 6, coinGeckoId: 'tether' },
    { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, coinGeckoId: 'weth' },
  ],
};

// ============================================================================
// Query Schema
// ============================================================================

const BalanceQuerySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  chains: z.string().optional(),
  tokens: z.string().optional(),
  includeNfts: z.enum(['true', 'false']).optional(),
});

type BalanceQuery = z.infer<typeof BalanceQuerySchema>;

function parseBalanceParams(query: BalanceQuery) {
  return {
    address: query.address,
    chains: query.chains?.split(',') || ['ethereum'],
    tokens: query.tokens?.split(',') || [],
    includeNfts: query.includeNfts === 'true',
  };
}

// ============================================================================
// RPC Helpers
// ============================================================================

async function jsonRpcCall(chain: string, method: string, params: unknown[]): Promise<unknown> {
  const rpcUrl = RPC_ENDPOINTS[chain] || RPC_ENDPOINTS.ethereum;

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || 'RPC error');
  }

  return data.result;
}

async function getTokenBalance(
  chain: string,
  walletAddress: string,
  tokenAddress: string,
  decimals: number
): Promise<{ balance: bigint; formatted: string }> {
  // ERC20 balanceOf(address) selector: 0x70a08231
  const data = `0x70a08231${walletAddress.slice(2).padStart(64, '0')}`;
  
  try {
    const result = await jsonRpcCall(chain, 'eth_call', [{ to: tokenAddress, data }, 'latest']);
    const balance = BigInt(result as string);
    const formatted = (Number(balance) / Math.pow(10, decimals)).toFixed(6);
    return { balance, formatted };
  } catch (error) {
    return { balance: BigInt(0), formatted: '0' };
  }
}

async function fetchPrices(coinIds: string[]): Promise<Record<string, number>> {
  if (coinIds.length === 0) return {};
  
  try {
    const uniqueIds = [...new Set(coinIds)];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds.join(',')}&vs_currencies=usd`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!response.ok) {
      console.warn('CoinGecko price fetch failed:', response.status);
      return {};
    }
    
    const data = await response.json();
    const prices: Record<string, number> = {};
    for (const id of uniqueIds) {
      prices[id] = data[id]?.usd || 0;
    }
    return prices;
  } catch (error) {
    console.warn('Price fetch error:', error);
    return {};
  }
}

// ============================================================================
// Balance Fetching
// ============================================================================

async function fetchNativeBalance(chain: string, address: string, usdPrice: number): Promise<Balance> {
  const config = CHAIN_CONFIG[chain];
  if (!config) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  try {
    const result = await jsonRpcCall(chain, 'eth_getBalance', [address, 'latest']);
    const balanceWei = BigInt(result as string);
    const balanceFormatted = Number(balanceWei) / Math.pow(10, config.decimals);
    
    return {
      chain,
      chainId: config.chainId,
      native: {
        symbol: config.symbol,
        balance: balanceWei.toString(),
        balanceFormatted: balanceFormatted.toFixed(6),
        usdValue: balanceFormatted * usdPrice,
      },
    };
  } catch (error) {
    console.error(`Error fetching ${chain} balance:`, error);
    return {
      chain,
      chainId: config.chainId,
      native: {
        symbol: config.symbol,
        balance: '0',
        balanceFormatted: '0',
        usdValue: 0,
      },
    };
  }
}

async function fetchTokenBalances(
  chain: string,
  address: string,
  prices: Record<string, number>
): Promise<TokenBalance[]> {
  const tokens = COMMON_TOKENS[chain] || [];
  const config = CHAIN_CONFIG[chain];
  
  if (!config || tokens.length === 0) return [];

  const balancePromises = tokens.map(async (token) => {
    const { balance, formatted } = await getTokenBalance(chain, address, token.address, token.decimals);
    
    // Skip tokens with zero balance
    if (balance === BigInt(0)) return null;
    
    const usdPrice = prices[token.coinGeckoId] || 0;
    const usdValue = parseFloat(formatted) * usdPrice;

    const tokenBalance: TokenBalance = {
      chain,
      chainId: config.chainId,
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: balance.toString(),
      balanceFormatted: formatted,
      usdValue,
      logoUri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`,
    };

    return tokenBalance;
  });

  const results = await Promise.all(balancePromises);
  return results.filter((t): t is TokenBalance => t !== null);
}

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest, context: RequestContext) {
  const rawQuery = parseQuery(request, BalanceQuerySchema);
  const query = parseBalanceParams(rawQuery);
  
  // Validate chains
  const validChains = Object.keys(CHAIN_CONFIG);
  const requestedChains = query.chains.filter((c) => validChains.includes(c));
  
  if (requestedChains.length === 0) {
    throw new BadRequestError(`No valid chains specified. Valid chains: ${validChains.join(', ')}`);
  }

  try {
    // Collect all coin IDs needed for pricing
    const coinIds: string[] = [];
    for (const chain of requestedChains) {
      const config = CHAIN_CONFIG[chain];
      if (config) coinIds.push(config.coinGeckoId);
      const tokens = COMMON_TOKENS[chain] || [];
      for (const token of tokens) {
        coinIds.push(token.coinGeckoId);
      }
    }

    // Fetch all prices in one request
    const prices = await fetchPrices(coinIds);

    // Fetch native balances for all chains in parallel
    const nativePromises = requestedChains.map((chain) => {
      const config = CHAIN_CONFIG[chain];
      const price = prices[config?.coinGeckoId || ''] || 0;
      return fetchNativeBalance(chain, query.address, price);
    });

    // Fetch token balances for all chains in parallel
    const tokenPromises = requestedChains.map((chain) => 
      fetchTokenBalances(chain, query.address, prices)
    );

    const [native, tokenResults] = await Promise.all([
      Promise.all(nativePromises),
      Promise.all(tokenPromises),
    ]);

    const tokens = tokenResults.flat();
    
    // NFT support placeholder - would integrate with Alchemy/Moralis NFT API
    const nfts: NFTBalance[] = [];
    if (query.includeNfts) {
      // TODO: Integrate with NFT indexer API (Alchemy, Moralis, or SimpleHash)
      console.log('NFT fetching requires external API integration');
    }
    
    // Calculate totals
    const totalNativeUsd = native.reduce((sum, b) => sum + b.native.usdValue, 0);
    const totalTokensUsd = tokens.reduce((sum, t) => sum + t.usdValue, 0);
    const totalNftsUsd = 0; // NFT valuation requires floor price data
    
    const response = createResponse({
      address: query.address,
      native,
      tokens,
      nfts,
      total: {
        usd: totalNativeUsd + totalTokensUsd + totalNftsUsd,
        breakdown: {
          native: totalNativeUsd,
          tokens: totalTokensUsd,
          nfts: totalNftsUsd,
        },
      },
      timestamp: new Date().toISOString(),
    });
    
    // Cache for 30 seconds
    setCacheHeaders(response, { maxAge: 30, staleWhileRevalidate: 60, private: true });
    
    return response;
  } catch (error) {
    console.error('[API] Wallet balance error:', error);
    return createErrorResponse(error);
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 60, keyPrefix: 'wallet-balance' },
});
