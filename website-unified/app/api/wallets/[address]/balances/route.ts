/**
 * Wallet Balances API Route
 * GET /api/wallets/[address]/balances - Get detailed balances for a wallet
 * 
 * Fetches native token, ERC20, and NFT balances across multiple chains
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

const CHAIN_CONFIG: Record<string, {
  chainId: number;
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId: string;
}> = {
  ethereum: { chainId: 1, symbol: 'ETH', name: 'Ethereum', decimals: 18, coingeckoId: 'ethereum' },
  base: { chainId: 8453, symbol: 'ETH', name: 'Base', decimals: 18, coingeckoId: 'ethereum' },
  arbitrum: { chainId: 42161, symbol: 'ETH', name: 'Arbitrum', decimals: 18, coingeckoId: 'ethereum' },
  polygon: { chainId: 137, symbol: 'MATIC', name: 'Polygon', decimals: 18, coingeckoId: 'matic-network' },
  optimism: { chainId: 10, symbol: 'ETH', name: 'Optimism', decimals: 18, coingeckoId: 'ethereum' },
  bsc: { chainId: 56, symbol: 'BNB', name: 'BNB Chain', decimals: 18, coingeckoId: 'binancecoin' },
  avalanche: { chainId: 43114, symbol: 'AVAX', name: 'Avalanche', decimals: 18, coingeckoId: 'avalanche-2' },
};

const DEFILLAMA_API = 'https://coins.llama.fi';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Popular tokens to check balances for
const POPULAR_TOKENS: Record<string, Array<{ address: string; symbol: string; decimals: number }>> = {
  ethereum: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6 },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', decimals: 18 },
    { address: '0x6B175474E89094C44Da98b954EesC52dcc942e3B', symbol: 'DAI', decimals: 18 },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', decimals: 18 },
  ],
  base: [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6 },
    { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', decimals: 18 },
  ],
  arbitrum: [
    { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6 },
    { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', decimals: 18 },
    { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', decimals: 18 },
  ],
  polygon: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', decimals: 6 },
    { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH', decimals: 18 },
  ],
};

// ============================================================================
// Query Schema
// ============================================================================

const QuerySchema = z.object({
  chains: z.string().optional().default('ethereum'),
  includeNfts: z.coerce.boolean().optional().default(false),
  includeDefi: z.coerce.boolean().optional().default(true),
});

// ============================================================================
// Types
// ============================================================================

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: number;
  price: number;
  valueUsd: number;
  priceChange24h: number;
  logoUri: string | null;
  chain: string;
  chainId: number;
  isNative: boolean;
}

interface ChainBalance {
  chain: string;
  chainId: number;
  nativeBalance: TokenBalance;
  tokens: TokenBalance[];
  totalValueUsd: number;
}

interface WalletBalances {
  address: string;
  totalValueUsd: number;
  chains: ChainBalance[];
  lastUpdated: string;
}

// ============================================================================
// RPC Helpers
// ============================================================================

async function rpcCall(
  rpcUrl: string,
  method: string,
  params: any[]
): Promise<any> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.result;
}

async function getNativeBalance(
  address: string,
  chain: string
): Promise<bigint> {
  try {
    const rpcUrl = RPC_ENDPOINTS[chain];
    if (!rpcUrl) return 0n;

    const result = await rpcCall(rpcUrl, 'eth_getBalance', [address, 'latest']);
    return BigInt(result);
  } catch (error) {
    console.error(`Failed to get native balance on ${chain}:`, error);
    return 0n;
  }
}

async function getTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  chain: string
): Promise<bigint> {
  try {
    const rpcUrl = RPC_ENDPOINTS[chain];
    if (!rpcUrl) return 0n;

    // ERC20 balanceOf(address) function selector
    const data = `0x70a08231000000000000000000000000${walletAddress.slice(2)}`;
    
    const result = await rpcCall(rpcUrl, 'eth_call', [
      { to: tokenAddress, data },
      'latest',
    ]);

    return BigInt(result);
  } catch (error) {
    console.error(`Failed to get token balance:`, error);
    return 0n;
  }
}

function formatBalance(balance: bigint, decimals: number): number {
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  return parseFloat(`${integerPart}.${fractionalStr}`);
}

// ============================================================================
// Price Fetchers
// ============================================================================

async function getNativeTokenPrices(): Promise<Map<string, { price: number; change24h: number }>> {
  const prices = new Map<string, { price: number; change24h: number }>();
  
  try {
    const ids = ['ethereum', 'matic-network', 'binancecoin', 'avalanche-2'].join(',');
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      for (const [id, values] of Object.entries(data)) {
        const v = values as any;
        prices.set(id, {
          price: v.usd || 0,
          change24h: v.usd_24h_change || 0,
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch native prices:', error);
  }

  return prices;
}

async function getTokenPrices(
  chain: string,
  addresses: string[]
): Promise<Map<string, { price: number; change24h: number }>> {
  const prices = new Map<string, { price: number; change24h: number }>();
  
  if (addresses.length === 0) return prices;

  try {
    const coins = addresses.map(a => `${chain}:${a}`).join(',');
    const response = await fetch(
      `${DEFILLAMA_API}/prices/current/${coins}`,
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      for (const [key, value] of Object.entries(data.coins || {})) {
        const addr = key.split(':')[1]?.toLowerCase();
        const v = value as any;
        if (addr) {
          prices.set(addr, {
            price: v.price || 0,
            change24h: 0, // DefiLlama doesn't provide 24h change in this endpoint
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
  }

  return prices;
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);

    // Validate address
    if (!/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid wallet address format',
          },
        },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Parse query
    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams));
    const query = parseResult.success ? parseResult.data : { chains: 'ethereum', includeNfts: false, includeDefi: true };
    
    const requestedChains = query.chains.split(',').map(c => c.trim());

    // Fetch native token prices first
    const nativePrices = await getNativeTokenPrices();

    // Process each chain
    const chainBalances: ChainBalance[] = [];

    for (const chain of requestedChains) {
      const config = CHAIN_CONFIG[chain];
      if (!config) continue;

      // Get native balance
      const nativeBalanceRaw = await getNativeBalance(normalizedAddress, chain);
      const nativeBalanceFormatted = formatBalance(nativeBalanceRaw, config.decimals);
      const nativePriceData = nativePrices.get(config.coingeckoId) || { price: 0, change24h: 0 };

      const nativeBalance: TokenBalance = {
        address: '0x0000000000000000000000000000000000000000',
        symbol: config.symbol,
        name: config.name,
        decimals: config.decimals,
        balance: nativeBalanceRaw.toString(),
        balanceFormatted: nativeBalanceFormatted,
        price: nativePriceData.price,
        valueUsd: nativeBalanceFormatted * nativePriceData.price,
        priceChange24h: nativePriceData.change24h,
        logoUri: null,
        chain,
        chainId: config.chainId,
        isNative: true,
      };

      // Get token balances
      const chainTokens = POPULAR_TOKENS[chain] || [];
      const tokenAddresses = chainTokens.map(t => t.address);
      const tokenPrices = await getTokenPrices(chain, tokenAddresses);

      const tokens: TokenBalance[] = [];

      for (const token of chainTokens) {
        const balanceRaw = await getTokenBalance(normalizedAddress, token.address, chain);
        
        // Skip zero balances
        if (balanceRaw === 0n) continue;

        const balanceFormatted = formatBalance(balanceRaw, token.decimals);
        const priceData = tokenPrices.get(token.address.toLowerCase()) || { price: 0, change24h: 0 };

        tokens.push({
          address: token.address,
          symbol: token.symbol,
          name: token.symbol,
          decimals: token.decimals,
          balance: balanceRaw.toString(),
          balanceFormatted,
          price: priceData.price,
          valueUsd: balanceFormatted * priceData.price,
          priceChange24h: priceData.change24h,
          logoUri: null,
          chain,
          chainId: config.chainId,
          isNative: false,
        });
      }

      const totalValue = nativeBalance.valueUsd + tokens.reduce((sum, t) => sum + t.valueUsd, 0);

      chainBalances.push({
        chain,
        chainId: config.chainId,
        nativeBalance,
        tokens,
        totalValueUsd: totalValue,
      });
    }

    const totalValueUsd = chainBalances.reduce((sum, cb) => sum + cb.totalValueUsd, 0);

    const result: WalletBalances = {
      address: normalizedAddress,
      totalValueUsd,
      chains: chainBalances,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        chainsQueried: requestedChains,
      },
    });
  } catch (error) {
    console.error('Wallet balances API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch wallet balances',
        },
      },
      { status: 500 }
    );
  }
}
