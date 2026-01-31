/**
 * Tool Handlers - Analysis Operations
 * Integrated with Helius, Jupiter, and DeFiLlama APIs
 */

import type {
  TokenInfo,
  PoolInfo,
  LiquidityAnalysis,
  TopHolder,
  ToolResult,
} from '../../types.js';
import { logger } from '../../utils/logger.js';

// API endpoints
const HELIUS_API = process.env.HELIUS_API_KEY 
  ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  : 'https://api.mainnet-beta.solana.com';
const JUPITER_PRICE_API = 'https://price.jup.ag/v6';
const BIRDEYE_API = 'https://public-api.birdeye.so';
const DEFILLAMA_API = 'https://coins.llama.fi';

export async function getTokenInfo(args: {
  mint: string;
}): Promise<ToolResult<TokenInfo>> {
  logger.info({ args }, 'Getting token info');

  try {
    // Fetch from Jupiter Price API
    const priceResponse = await fetch(
      `${JUPITER_PRICE_API}/price?ids=${args.mint}`,
      { signal: AbortSignal.timeout(10000) }
    );

    let price = 0;
    if (priceResponse.ok) {
      const priceData = await priceResponse.json() as { data: Record<string, { price: number }> };
      price = priceData.data?.[args.mint]?.price || 0;
    }

    // Fetch token metadata from Helius
    const metadataResponse = await fetch(HELIUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAsset',
        params: { id: args.mint },
      }),
      signal: AbortSignal.timeout(10000),
    });

    let symbol = 'UNKNOWN';
    let name = 'Unknown Token';
    let decimals = 9;

    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json() as {
        result?: { content?: { metadata?: { symbol?: string; name?: string } }; token_info?: { decimals?: number } };
      };
      symbol = metadata.result?.content?.metadata?.symbol || 'UNKNOWN';
      name = metadata.result?.content?.metadata?.name || 'Unknown Token';
      decimals = metadata.result?.token_info?.decimals || 9;
    }

    // Fetch additional data from Birdeye if API key available
    let volume24h = 0;
    let priceChange24h = 0;
    let marketCap = 0;

    if (process.env.BIRDEYE_API_KEY) {
      const birdeyeResponse = await fetch(
        `${BIRDEYE_API}/defi/token_overview?address=${args.mint}`,
        {
          headers: { 'X-API-KEY': process.env.BIRDEYE_API_KEY },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (birdeyeResponse.ok) {
        const birdeyeData = await birdeyeResponse.json() as {
          data?: { v24hUSD?: number; priceChange24h?: number; mc?: number };
        };
        volume24h = birdeyeData.data?.v24hUSD || 0;
        priceChange24h = birdeyeData.data?.priceChange24h || 0;
        marketCap = birdeyeData.data?.mc || 0;
      }
    }

    return {
      success: true,
      data: {
        mint: args.mint,
        symbol,
        name,
        decimals,
        totalSupply: '0', // Would need supply query
        price,
        priceChange24h,
        volume24h,
        marketCap,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Failed to get token info');
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get token info' };
  }
}

export async function getPoolInfo(args: {
  tokenMint: string;
  dex?: string;
}): Promise<ToolResult<PoolInfo[]>> {
  logger.info({ args }, 'Getting pool info');

  try {
    // Fetch from Jupiter's routing API to find pools
    const response = await fetch(
      `${JUPITER_PRICE_API}/tokens?ids=${args.tokenMint}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch pool data' };
    }

    // For detailed pool info, use Birdeye if available
    if (process.env.BIRDEYE_API_KEY) {
      const poolsResponse = await fetch(
        `${BIRDEYE_API}/defi/token_pools?address=${args.tokenMint}&limit=10`,
        {
          headers: { 'X-API-KEY': process.env.BIRDEYE_API_KEY },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (poolsResponse.ok) {
        const poolsData = await poolsResponse.json() as {
          data?: { items?: Array<{
            address: string;
            source: string;
            liquidity: number;
            volume24h: number;
            base: { address: string };
            quote: { address: string };
          }> };
        };

        const pools: PoolInfo[] = (poolsData.data?.items || []).map((pool) => ({
          address: pool.address,
          dex: pool.source,
          tokenA: pool.base?.address || '',
          tokenB: pool.quote?.address || '',
          liquidity: pool.liquidity || 0,
          volume24h: pool.volume24h || 0,
          fee: 0.003, // Default 0.3% fee
        }));

        return { success: true, data: pools };
      }
    }

    return { success: true, data: [] };
  } catch (error) {
    logger.error({ error }, 'Failed to get pool info');
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get pool info' };
  }
}

export async function getPriceHistory(args: {
  tokenMint: string;
  period?: string;
  interval?: string;
}): Promise<ToolResult<Array<{ timestamp: string; price: number; volume: number }>>> {
  logger.info({ args }, 'Getting price history');

  try {
    // Use DeFiLlama for historical prices
    const response = await fetch(
      `${DEFILLAMA_API}/chart/solana:${args.tokenMint}`,
      { signal: AbortSignal.timeout(15000) }
    );

    if (!response.ok) {
      // Fallback: return empty with message
      return { success: true, data: [] };
    }

    const data = await response.json() as {
      coins?: Record<string, { prices?: Array<{ timestamp: number; price: number }> }>;
    };

    const coinKey = `solana:${args.tokenMint}`;
    const prices = data.coins?.[coinKey]?.prices || [];

    const history = prices.map((p) => ({
      timestamp: new Date(p.timestamp * 1000).toISOString(),
      price: p.price,
      volume: 0, // DeFiLlama doesn't provide volume in chart endpoint
    }));

    return { success: true, data: history };
  } catch (error) {
    logger.error({ error }, 'Failed to get price history');
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get price history' };
  }
}

export async function analyzeLiquidity(args: {
  tokenMint: string;
  tradeSize?: string;
}): Promise<ToolResult<LiquidityAnalysis>> {
  logger.info({ args }, 'Analyzing liquidity');

  try {
    // Get pool info first
    const poolsResult = await getPoolInfo({ tokenMint: args.tokenMint });
    const pools = poolsResult.success ? (poolsResult.data || []) : [];

    // Calculate total liquidity
    const totalLiquidity = pools.reduce((sum, pool) => sum + (pool.liquidity || 0), 0);

    // Get slippage estimates from Jupiter
    const slippageAt: Record<string, number> = {
      '100SOL': 0,
      '500SOL': 0,
      '1000SOL': 0,
    };

    const SOL_MINT = 'So11111111111111111111111111111111111111112';
    const tradeAmounts = [100, 500, 1000];

    for (const amount of tradeAmounts) {
      try {
        const quoteResponse = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${args.tokenMint}&amount=${amount * 1e9}&slippageBps=100`,
          { signal: AbortSignal.timeout(5000) }
        );

        if (quoteResponse.ok) {
          const quote = await quoteResponse.json() as { priceImpactPct?: string };
          slippageAt[`${amount}SOL`] = parseFloat(quote.priceImpactPct || '0');
        }
      } catch {
        // Ignore individual quote failures
      }
    }

    // Determine recommendation based on liquidity and slippage
    let recommendation: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (totalLiquidity > 1000000 && slippageAt['1000SOL'] < 1) {
      recommendation = 'excellent';
    } else if (totalLiquidity > 100000 && slippageAt['500SOL'] < 2) {
      recommendation = 'good';
    } else if (totalLiquidity > 10000 && slippageAt['100SOL'] < 3) {
      recommendation = 'fair';
    }

    return {
      success: true,
      data: {
        tokenMint: args.tokenMint,
        totalLiquidity,
        pools: pools.map((p) => ({
          address: p.address,
          dex: p.dex,
          liquidity: p.liquidity,
        })),
        slippageAt,
        recommendation,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Failed to analyze liquidity');
    return { success: false, error: error instanceof Error ? error.message : 'Failed to analyze liquidity' };
  }
}

export async function getTopHolders(args: {
  tokenMint: string;
  limit?: number;
}): Promise<ToolResult<TopHolder[]>> {
  logger.info({ args }, 'Getting top holders');

  try {
    const limit = args.limit || 20;

    // Use Helius API for token largest accounts
    const response = await fetch(HELIUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenLargestAccounts',
        params: [args.tokenMint],
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch top holders' };
    }

    const data = await response.json() as {
      result?: { value?: Array<{ address: string; amount: string; decimals: number }> };
    };

    const accounts = data.result?.value || [];
    const totalSupply = accounts.reduce((sum, acc) => sum + BigInt(acc.amount), 0n);

    const holders: TopHolder[] = accounts.slice(0, limit).map((acc) => {
      const amount = BigInt(acc.amount);
      const percentage = totalSupply > 0n ? Number((amount * 10000n) / totalSupply) / 100 : 0;
      
      return {
        address: acc.address,
        amount: acc.amount,
        percentage,
        isContract: false, // Would need additional lookup
      };
    });

    return { success: true, data: holders };
  } catch (error) {
    logger.error({ error }, 'Failed to get top holders');
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get top holders' };
  }
}

export async function getMarketOverview(args: {
  category?: string;
  limit?: number;
}): Promise<ToolResult<TokenInfo[]>> {
  logger.info({ args }, 'Getting market overview');

  try {
    const limit = args.limit || 20;

    // Use Jupiter's token list for Solana tokens
    const response = await fetch(
      'https://token.jup.ag/strict',
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch market data' };
    }

    const tokens = await response.json() as Array<{
      address: string;
      symbol: string;
      name: string;
      decimals: number;
    }>;

    // Get prices for top tokens
    const topTokens = tokens.slice(0, limit);
    const addresses = topTokens.map((t) => t.address).join(',');

    const priceResponse = await fetch(
      `${JUPITER_PRICE_API}/price?ids=${addresses}`,
      { signal: AbortSignal.timeout(10000) }
    );

    let prices: Record<string, { price: number }> = {};
    if (priceResponse.ok) {
      const priceData = await priceResponse.json() as { data: Record<string, { price: number }> };
      prices = priceData.data || {};
    }

    const tokenInfos: TokenInfo[] = topTokens.map((t) => ({
      mint: t.address,
      symbol: t.symbol,
      name: t.name,
      decimals: t.decimals,
      totalSupply: '0',
      price: prices[t.address]?.price || 0,
      priceChange24h: 0,
      volume24h: 0,
      marketCap: 0,
    }));

    return { success: true, data: tokenInfos };
  } catch (error) {
    logger.error({ error }, 'Failed to get market overview');
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get market overview' };
  }
}
