/**
 * MCP Tool: getWalletPortfolio
 * Get complete portfolio overview for a wallet with real price data
 */

import { z } from 'zod';
import { alchemyClient } from '../apis/alchemy';
import { defiLlamaClient } from '../apis/defillama';
import { HttpClient, Cache, type Chain } from '../lib';

export const getWalletPortfolioSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chain: z.enum(['ethereum', 'arbitrum', 'base', 'polygon']).default('ethereum'),
});

export type GetWalletPortfolioInput = z.infer<typeof getWalletPortfolioSchema>;

export interface PortfolioToken {
  symbol: string;
  name: string;
  balance: string;
  valueUsd: number;
  price: number;
  percentage: number;
  contractAddress?: string;
}

export interface GetWalletPortfolioOutput {
  address: string;
  chain: string;
  totalValueUsd: number;
  tokens: PortfolioToken[];
  nftCount: number;
  defiPositionsCount: number;
  lastUpdated: string;
}

export const getWalletPortfolioDefinition = {
  name: 'getWalletPortfolio',
  description:
    'Get a complete portfolio overview for a wallet address including token holdings, total value, and summary of NFTs and DeFi positions',
  inputSchema: {
    type: 'object' as const,
    properties: {
      address: {
        type: 'string',
        description: 'Wallet address (0x...)',
      },
      chain: {
        type: 'string',
        description: 'Blockchain network (ethereum, arbitrum, base, polygon)',
        default: 'ethereum',
        enum: ['ethereum', 'arbitrum', 'base', 'polygon'],
      },
    },
    required: ['address'],
  },
};

// Native token addresses per chain
const NATIVE_TOKENS: Record<string, { symbol: string; name: string; coingeckoId: string }> = {
  ethereum: { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
  arbitrum: { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
  base: { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
  polygon: { symbol: 'MATIC', name: 'Polygon', coingeckoId: 'matic-network' },
  optimism: { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
};

// Price cache
const priceCache = new Cache({ defaultTTL: 60 }); // 1 minute cache
const httpClient = new HttpClient({ timeout: 15000 });

// Common token contract to CoinGecko ID mapping
const TOKEN_COINGECKO_IDS: Record<string, string> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai', // DAI
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'weth', // WETH
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'matic-network', // MATIC
  '0x514910771af9ca656af840dff83e8264ecf986ca': 'chainlink', // LINK
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap', // UNI
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'aave', // AAVE
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': 'staked-ether', // stETH
};

async function fetchTokenPrices(tokenIds: string[]): Promise<Record<string, number>> {
  if (tokenIds.length === 0) return {};

  const cacheKey = `prices:${tokenIds.sort().join(',')}`;
  const cached = priceCache.get<Record<string, number>>(cacheKey);
  if (cached) return cached;

  try {
    const response = await httpClient.get<Record<string, { usd: number }>>(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: tokenIds.join(','),
          vs_currencies: 'usd',
        },
      }
    );

    const prices: Record<string, number> = {};
    for (const [id, data] of Object.entries(response.data)) {
      prices[id] = data.usd;
    }

    priceCache.set(cacheKey, prices);
    return prices;
  } catch (error) {
    console.error('Failed to fetch prices from CoinGecko:', error);
    return {};
  }
}

async function getTokenPriceByContract(contractAddress: string, chain: string): Promise<number> {
  const normalizedAddress = contractAddress.toLowerCase();
  const coingeckoId = TOKEN_COINGECKO_IDS[normalizedAddress];
  
  if (coingeckoId) {
    const prices = await fetchTokenPrices([coingeckoId]);
    return prices[coingeckoId] || 0;
  }

  // Try to fetch by contract address for Ethereum mainnet
  if (chain === 'ethereum') {
    const cacheKey = `price:contract:${normalizedAddress}`;
    const cached = priceCache.get<number>(cacheKey);
    if (cached !== null) return cached;

    try {
      const response = await httpClient.get<Record<string, { usd: number }>>(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum`,
        {
          params: {
            contract_addresses: normalizedAddress,
            vs_currencies: 'usd',
          },
        }
      );

      const price = response.data[normalizedAddress]?.usd || 0;
      priceCache.set(cacheKey, price);
      return price;
    } catch {
      return 0;
    }
  }

  return 0;
}

export async function getWalletPortfolio(
  input: GetWalletPortfolioInput
): Promise<GetWalletPortfolioOutput> {
  const { address, chain } = getWalletPortfolioSchema.parse(input);

  // Fetch data in parallel
  const [tokenBalances, nfts, ethBalance, defiPositions] = await Promise.all([
    alchemyClient.getTokenBalances(address, chain as Chain),
    alchemyClient.getNFTs(address, chain as Chain),
    alchemyClient.getETHBalance(address, chain as Chain),
    defiLlamaClient.getPositions(address).catch(() => []),
  ]);

  // Get native token info and price
  const nativeToken = NATIVE_TOKENS[chain];
  const nativePrices = await fetchTokenPrices([nativeToken.coingeckoId]);
  const nativePrice = nativePrices[nativeToken.coingeckoId] || 0;

  // Calculate native balance
  const ethBalanceNum = parseInt(ethBalance, 16) / 1e18;
  const nativeValueUsd = ethBalanceNum * nativePrice;

  // Build portfolio tokens list
  const tokens: PortfolioToken[] = [];
  let totalValueUsd = nativeValueUsd;

  // Add native token
  if (ethBalanceNum > 0.0001) { // Filter dust
    tokens.push({
      symbol: nativeToken.symbol,
      name: nativeToken.name,
      balance: ethBalanceNum.toFixed(6),
      valueUsd: Math.round(nativeValueUsd * 100) / 100,
      price: nativePrice,
      percentage: 0, // Will calculate after
    });
  }

  // Process ERC20 tokens
  for (const token of tokenBalances.slice(0, 30)) {
    if (token.metadata) {
      const balance = parseInt(token.balance, 16) / Math.pow(10, token.metadata.decimals);
      
      // Skip dust amounts
      if (balance < 0.0001) continue;

      // Get token price
      const price = await getTokenPriceByContract(token.contractAddress, chain);
      const valueUsd = balance * price;
      
      // Only include tokens with value > $0.01 or significant balance
      if (valueUsd > 0.01 || balance > 1) {
        totalValueUsd += valueUsd;
        tokens.push({
          symbol: token.metadata.symbol || 'UNKNOWN',
          name: token.metadata.name || 'Unknown Token',
          balance: balance.toFixed(6),
          valueUsd: Math.round(valueUsd * 100) / 100,
          price: Math.round(price * 10000) / 10000,
          percentage: 0,
          contractAddress: token.contractAddress,
        });
      }
    }
  }

  // Calculate percentages
  for (const token of tokens) {
    token.percentage = totalValueUsd > 0 
      ? Math.round((token.valueUsd / totalValueUsd) * 10000) / 100 
      : 0;
  }

  // Sort by value (highest first)
  tokens.sort((a, b) => b.valueUsd - a.valueUsd);

  return {
    address,
    chain,
    totalValueUsd: Math.round(totalValueUsd * 100) / 100,
    tokens: tokens.slice(0, 20), // Return top 20 tokens
    nftCount: nfts.length,
    defiPositionsCount: defiPositions.length,
    lastUpdated: new Date().toISOString(),
  };
}
