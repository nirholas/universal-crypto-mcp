/**
 * Sweep Queue Workers
 * 
 * This file starts the BullMQ workers for processing sweep jobs
 * and other background tasks.
 */

import 'dotenv/config';
import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import {
  updateQueueMetrics,
  recordJobCompletion,
  setProtocolHealth,
} from './api/middleware/metrics.js';
import { createConsolidationWorker } from './queue/workers/consolidation.js';

// Redis connection
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Queue names
const QUEUES = {
  SWEEP: 'sweep',
  PRICE_UPDATE: 'price-update',
  HEALTH_CHECK: 'health-check',
} as const;

// API endpoints for price fetching
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const DEFILLAMA_API = 'https://coins.llama.fi/prices/current';

// DEX aggregator APIs
const ONEINCH_API = 'https://api.1inch.dev/swap/v6.0';
const PARASWAP_API = 'https://apiv5.paraswap.io';

// Initialize queues
const sweepQueue = new Queue(QUEUES.SWEEP, { connection });
const priceUpdateQueue = new Queue(QUEUES.PRICE_UPDATE, { connection });
const healthCheckQueue = new Queue(QUEUES.HEALTH_CHECK, { connection });

// ============================================
// Sweep Worker
// ============================================
const sweepWorker = new Worker(
  QUEUES.SWEEP,
  async (job) => {
    const startTime = Date.now();
    const { userId, walletAddress, chain, tokens, targetToken } = job.data as {
      userId: string;
      walletAddress: string;
      chain: string;
      tokens: Array<{ address: string; amount: string; decimals: number }>;
      targetToken: string;
    };

    console.log(`[Sweep] Processing job ${job.id} for wallet ${walletAddress} on ${chain}`);

    try {
      // Step 1: Get quotes for each token swap
      const quotes = await Promise.all(
        tokens.map((token) =>
          getSwapQuote(chain, token.address, targetToken, token.amount)
        )
      );

      // Filter out failed quotes
      const validQuotes = quotes.filter((q) => q !== null);
      if (validQuotes.length === 0) {
        throw new Error('No valid quotes obtained for any tokens');
      }

      // Step 2: Build transaction calldata for each swap
      const swapTxs = await Promise.all(
        validQuotes.map((quote) =>
          buildSwapTransaction(chain, walletAddress, quote!)
        )
      );

      // Step 3: Execute transactions (in production, use bundler for AA wallets)
      // For now, we return the prepared transactions
      const results = swapTxs.map((tx, i) => ({
        tokenAddress: validQuotes[i]!.srcToken,
        amountIn: validQuotes[i]!.srcAmount,
        expectedOut: validQuotes[i]!.destAmount,
        tx: tx ? { to: tx.to, data: tx.data, value: tx.value } : null,
        status: tx ? 'prepared' : 'failed',
      }));

      const successCount = results.filter((r) => r.status === 'prepared').length;

      const durationMs = Date.now() - startTime;
      recordJobCompletion(QUEUES.SWEEP, chain, durationMs, successCount > 0);

      return {
        success: successCount > 0,
        partial: successCount < validQuotes.length,
        tokensSwept: successCount,
        totalTokens: tokens.length,
        chain,
        targetToken,
        results,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorType = error instanceof Error ? error.name : 'UnknownError';
      recordJobCompletion(QUEUES.SWEEP, chain, durationMs, false, errorType);
      throw error;
    }
  },
  {
    connection,
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5', 10),
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

// ============================================
// Price Update Worker
// ============================================
const priceUpdateWorker = new Worker(
  QUEUES.PRICE_UPDATE,
  async (job) => {
    const { tokens, chain = 'ethereum' } = job.data as {
      tokens: Array<{ address: string; symbol?: string }>;
      chain?: string;
    };

    console.log(`[PriceUpdate] Updating prices for ${tokens.length} tokens on ${chain}`);

    try {
      // Fetch prices from DeFiLlama (supports multiple chains)
      const chainPrefix = getDefiLlamaChainPrefix(chain);
      const tokenIds = tokens.map((t) => `${chainPrefix}:${t.address}`).join(',');
      
      const response = await fetch(`${DEFILLAMA_API}/${tokenIds}`, {
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`DeFiLlama API error: ${response.status}`);
      }

      const data = await response.json() as {
        coins: Record<string, { price: number; timestamp: number; confidence: number }>;
      };

      // Cache prices in Redis with 5-minute TTL
      const prices: Array<{ address: string; price: number; timestamp: number }> = [];
      
      for (const token of tokens) {
        const key = `${chainPrefix}:${token.address}`;
        const priceData = data.coins[key];
        
        if (priceData) {
          const cacheKey = `price:${chain}:${token.address.toLowerCase()}`;
          await connection.setex(
            cacheKey,
            300, // 5 minutes TTL
            JSON.stringify({
              price: priceData.price,
              timestamp: priceData.timestamp,
              confidence: priceData.confidence,
            })
          );
          
          prices.push({
            address: token.address,
            price: priceData.price,
            timestamp: priceData.timestamp,
          });
        }
      }

      console.log(`[PriceUpdate] Cached ${prices.length}/${tokens.length} prices`);
      
      return { 
        updated: prices.length,
        total: tokens.length,
        prices,
      };
    } catch (error) {
      console.error('[PriceUpdate] Error:', error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);

// ============================================
// Health Check Worker
// ============================================
const healthCheckWorker = new Worker(
  QUEUES.HEALTH_CHECK,
  async (job) => {
    const { protocol } = job.data as { protocol: string };

    console.log(`[HealthCheck] Checking ${protocol}`);

    try {
      // Health check endpoints for various protocols
      const healthEndpoints: Record<string, string> = {
        '1inch': 'https://api.1inch.dev/swap/v6.0/1/healthcheck',
        'paraswap': 'https://apiv5.paraswap.io/health',
        'coingecko': 'https://api.coingecko.com/api/v3/ping',
        'defillama': 'https://api.llama.fi/health',
        'uniswap': 'https://api.uniswap.org/v1/quote',
        'ethereum': process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
        'polygon': process.env.POLYGON_RPC_URL || 'https://polygon.llamarpc.com',
        'arbitrum': process.env.ARBITRUM_RPC_URL || 'https://arbitrum.llamarpc.com',
        'base': process.env.BASE_RPC_URL || 'https://base.llamarpc.com',
      };

      const endpoint = healthEndpoints[protocol];
      if (!endpoint) {
        console.warn(`[HealthCheck] Unknown protocol: ${protocol}`);
        setProtocolHealth(protocol, false);
        return { protocol, healthy: false, error: 'Unknown protocol' };
      }

      // For RPC endpoints, use eth_blockNumber
      const isRpc = ['ethereum', 'polygon', 'arbitrum', 'base'].includes(protocol);
      
      const response = isRpc
        ? await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
            signal: AbortSignal.timeout(10000),
          })
        : await fetch(endpoint, { signal: AbortSignal.timeout(10000) });

      const healthy = response.ok;
      const latencyMs = response.headers.get('x-response-time') || 'unknown';
      
      setProtocolHealth(protocol, healthy);
      
      // Cache health status in Redis
      await connection.setex(
        `health:${protocol}`,
        60, // 1 minute TTL
        JSON.stringify({ healthy, checkedAt: new Date().toISOString(), latencyMs })
      );

      return { protocol, healthy, latencyMs };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[HealthCheck] ${protocol} failed:`, errorMessage);
      setProtocolHealth(protocol, false);
      
      await connection.setex(
        `health:${protocol}`,
        60,
        JSON.stringify({ healthy: false, error: errorMessage, checkedAt: new Date().toISOString() })
      );
      
      return { protocol, healthy: false, error: errorMessage };
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

// ============================================
// Helper Functions
// ============================================

// Get chain prefix for DeFiLlama API
function getDefiLlamaChainPrefix(chain: string): string {
  const prefixes: Record<string, string> = {
    ethereum: 'ethereum',
    eth: 'ethereum',
    polygon: 'polygon',
    arbitrum: 'arbitrum',
    optimism: 'optimism',
    base: 'base',
    bsc: 'bsc',
    avalanche: 'avax',
    fantom: 'fantom',
  };
  return prefixes[chain.toLowerCase()] || chain;
}

// Get swap quote from 1inch or ParaSwap
async function getSwapQuote(
  chain: string,
  srcToken: string,
  destToken: string,
  amount: string
): Promise<{
  srcToken: string;
  destToken: string;
  srcAmount: string;
  destAmount: string;
  protocols: string[];
} | null> {
  const chainId = getChainId(chain);
  
  // Try 1inch first
  const oneInchKey = process.env.ONEINCH_API_KEY;
  if (oneInchKey) {
    try {
      const response = await fetch(
        `${ONEINCH_API}/${chainId}/quote?src=${srcToken}&dst=${destToken}&amount=${amount}`,
        {
          headers: { 'Authorization': `Bearer ${oneInchKey}` },
          signal: AbortSignal.timeout(15000),
        }
      );
      
      if (response.ok) {
        const data = await response.json() as {
          toAmount?: string;
          protocols?: Array<Array<Array<{ name: string }>>>;
        };
        
        return {
          srcToken,
          destToken,
          srcAmount: amount,
          destAmount: data.toAmount || '0',
          protocols: data.protocols?.flat(2).map((p) => p.name) || ['1inch'],
        };
      }
    } catch (error) {
      console.warn(`[Sweep] 1inch quote failed for ${srcToken}:`, error);
    }
  }
  
  // Fallback to ParaSwap
  try {
    const response = await fetch(
      `${PARASWAP_API}/prices?srcToken=${srcToken}&destToken=${destToken}&amount=${amount}&network=${chainId}&side=SELL`,
      { signal: AbortSignal.timeout(15000) }
    );
    
    if (response.ok) {
      const data = await response.json() as {
        priceRoute?: { destAmount?: string; bestRoute?: Array<{ exchange: string }> };
      };
      
      return {
        srcToken,
        destToken,
        srcAmount: amount,
        destAmount: data.priceRoute?.destAmount || '0',
        protocols: data.priceRoute?.bestRoute?.map((r) => r.exchange) || ['paraswap'],
      };
    }
  } catch (error) {
    console.warn(`[Sweep] ParaSwap quote failed for ${srcToken}:`, error);
  }
  
  return null;
}

// Build swap transaction calldata
async function buildSwapTransaction(
  chain: string,
  fromAddress: string,
  quote: {
    srcToken: string;
    destToken: string;
    srcAmount: string;
    destAmount: string;
  }
): Promise<{ to: string; data: string; value: string } | null> {
  const chainId = getChainId(chain);
  const oneInchKey = process.env.ONEINCH_API_KEY;
  
  if (oneInchKey) {
    try {
      const slippage = 1; // 1% slippage
      const response = await fetch(
        `${ONEINCH_API}/${chainId}/swap?src=${quote.srcToken}&dst=${quote.destToken}&amount=${quote.srcAmount}&from=${fromAddress}&slippage=${slippage}&disableEstimate=true`,
        {
          headers: { 'Authorization': `Bearer ${oneInchKey}` },
          signal: AbortSignal.timeout(15000),
        }
      );
      
      if (response.ok) {
        const data = await response.json() as {
          tx?: { to: string; data: string; value: string };
        };
        
        return data.tx || null;
      }
    } catch (error) {
      console.warn(`[Sweep] 1inch swap build failed:`, error);
    }
  }
  
  // Fallback to ParaSwap transaction builder
  try {
    // First get the price route
    const priceResponse = await fetch(
      `${PARASWAP_API}/prices?srcToken=${quote.srcToken}&destToken=${quote.destToken}&amount=${quote.srcAmount}&network=${chainId}&side=SELL`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (!priceResponse.ok) return null;
    
    const priceData = await priceResponse.json() as { priceRoute?: object };
    if (!priceData.priceRoute) return null;
    
    // Build transaction
    const txResponse = await fetch(`${PARASWAP_API}/transactions/${chainId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        srcToken: quote.srcToken,
        destToken: quote.destToken,
        srcAmount: quote.srcAmount,
        destAmount: quote.destAmount,
        priceRoute: priceData.priceRoute,
        userAddress: fromAddress,
        partner: 'ucai',
      }),
      signal: AbortSignal.timeout(15000),
    });
    
    if (txResponse.ok) {
      const txData = await txResponse.json() as { to: string; data: string; value: string };
      return txData;
    }
  } catch (error) {
    console.warn(`[Sweep] ParaSwap transaction build failed:`, error);
  }
  
  return null;
}

// Get chain ID from chain name
function getChainId(chain: string): number {
  const chainIds: Record<string, number> = {
    ethereum: 1,
    eth: 1,
    polygon: 137,
    arbitrum: 42161,
    optimism: 10,
    base: 8453,
    bsc: 56,
    avalanche: 43114,
  };
  return chainIds[chain.toLowerCase()] || 1;
}

// ============================================
// Queue Metrics Update
// ============================================
async function updateAllQueueMetrics() {
  const queues = [
    { name: QUEUES.SWEEP, queue: sweepQueue },
    { name: QUEUES.PRICE_UPDATE, queue: priceUpdateQueue },
    { name: QUEUES.HEALTH_CHECK, queue: healthCheckQueue },
  ];

  for (const { name, queue } of queues) {
    try {
      const [waiting, active, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getDelayedCount(),
      ]);
      updateQueueMetrics(name, waiting, active, delayed);
    } catch (error) {
      console.error(`Error updating metrics for queue ${name}:`, error);
    }
  }
}

// Update metrics every 30 seconds
const metricsInterval = setInterval(updateAllQueueMetrics, 30000);

// ============================================
// Event Handlers
// ============================================
sweepWorker.on('completed', (job) => {
  console.log(`[Sweep] Job ${job.id} completed`);
});

sweepWorker.on('failed', (job, error) => {
  console.error(`[Sweep] Job ${job?.id} failed:`, error.message);
});

priceUpdateWorker.on('failed', (job, error) => {
  console.error(`[PriceUpdate] Job ${job?.id} failed:`, error.message);
});

healthCheckWorker.on('failed', (job, error) => {
  console.error(`[HealthCheck] Job ${job?.id} failed:`, error.message);
});

// ============================================
// Consolidation Worker
// ============================================
const consolidationWorker = createConsolidationWorker();

consolidationWorker.on('completed', (job, result) => {
  const status = result.success
    ? 'completed'
    : result.partialSuccess
      ? 'partial success'
      : 'failed';
  console.log(`[Consolidation] Job ${job.id} ${status}`);
});

consolidationWorker.on('failed', (job, error) => {
  console.error(`[Consolidation] Job ${job?.id} failed:`, error.message);
});

// ============================================
// Graceful Shutdown
// ============================================
async function shutdown() {
  console.log('Shutting down workers...');

  clearInterval(metricsInterval);

  await Promise.all([
    sweepWorker.close(),
    priceUpdateWorker.close(),
    healthCheckWorker.close(),
    consolidationWorker.close(),
  ]);

  await connection.quit();
  console.log('Workers shut down gracefully');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// ============================================
// Startup
// ============================================
console.log('🧹 Sweep Workers starting...');
console.log(`Connected to Redis at ${REDIS_URL}`);
console.log('Workers ready:');
console.log(`  - Sweep worker (concurrency: ${process.env.QUEUE_CONCURRENCY || 5})`);
console.log('  - Price update worker (concurrency: 2)');
console.log('  - Health check worker (concurrency: 5)');
console.log('  - Consolidation worker (concurrency: 3)');

// Initial metrics update
updateAllQueueMetrics();
