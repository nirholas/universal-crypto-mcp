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
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type Hash,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';
import {
  updateQueueMetrics,
  recordJobCompletion,
  setProtocolHealth,
} from './api/middleware/metrics.js';
import { createConsolidationWorker } from './queue/workers/consolidation.js';

// Chain configurations
const CHAIN_CONFIGS: Record<string, { chain: typeof mainnet; rpc: string }> = {
  ethereum: { chain: mainnet, rpc: process.env.RPC_ETHEREUM || 'https://eth.llamarpc.com' },
  arbitrum: { chain: arbitrum, rpc: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc' },
  base: { chain: base, rpc: process.env.RPC_BASE || 'https://mainnet.base.org' },
  optimism: { chain: optimism, rpc: process.env.RPC_OPTIMISM || 'https://mainnet.optimism.io' },
  polygon: { chain: polygon, rpc: process.env.RPC_POLYGON || 'https://polygon-rpc.com' },
};

// 1inch API for swaps
const ONEINCH_API = 'https://api.1inch.dev/swap/v6.0';

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
    const { userId, walletAddress, chain, tokens, targetToken } = job.data;

    console.log(`[Sweep] Processing job ${job.id} for wallet ${walletAddress} on ${chain}`);

    try {
      // Get chain configuration
      const chainConfig = CHAIN_CONFIGS[chain];
      if (!chainConfig) {
        throw new Error(`Unsupported chain: ${chain}`);
      }

      // Get private key from secure storage
      const privateKey = process.env.SWEEP_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('SWEEP_PRIVATE_KEY not configured');
      }

      const account = privateKeyToAccount(privateKey as `0x${string}`);
      
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(chainConfig.rpc),
      });

      const walletClient = createWalletClient({
        account,
        chain: chainConfig.chain,
        transport: http(chainConfig.rpc),
      });

      const txHashes: Hash[] = [];
      const targetTokenAddress = targetToken || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Default to USDC

      // Process each token
      for (const token of tokens) {
        try {
          // Get swap quote from 1inch
          const chainId = chainConfig.chain.id;
          const amount = parseUnits(token.balance, token.decimals);
          
          const quoteUrl = `${ONEINCH_API}/${chainId}/swap?src=${token.address}&dst=${targetTokenAddress}&amount=${amount.toString()}&from=${account.address}&slippage=1`;
          
          const response = await fetch(quoteUrl, {
            headers: {
              'Authorization': `Bearer ${process.env.ONEINCH_API_KEY || ''}`,
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(15000),
          });

          if (!response.ok) {
            console.warn(`[Sweep] 1inch quote failed for ${token.symbol}: ${response.status}`);
            continue;
          }

          const swapData = await response.json() as {
            tx: { to: string; data: string; value: string; gas: string };
            toAmount: string;
          };

          // Execute the swap
          const hash = await walletClient.sendTransaction({
            to: swapData.tx.to as Address,
            data: swapData.tx.data as `0x${string}`,
            value: BigInt(swapData.tx.value),
            gas: BigInt(swapData.tx.gas),
          });

          console.log(`[Sweep] Swapped ${token.symbol}: ${hash}`);
          txHashes.push(hash);

          // Wait for confirmation
          await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });

        } catch (tokenError) {
          console.error(`[Sweep] Failed to swap ${token.symbol}:`, tokenError);
        }
      }

      const durationMs = Date.now() - startTime;
      recordJobCompletion(QUEUES.SWEEP, chain, durationMs, true);

      return {
        success: true,
        txHashes,
        tokensSwept: txHashes.length,
        chain,
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
    const { tokens } = job.data;

    console.log(`[PriceUpdate] Updating prices for ${tokens.length} tokens`);

    try {
      // Fetch prices from CoinGecko
      const tokenIds = tokens.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const prices = await response.json();
      
      // Update cached prices in Redis
      const redis = connection;
      const pipeline = redis.pipeline();
      
      for (const [tokenId, data] of Object.entries(prices)) {
        if (data && typeof data === 'object' && 'usd' in data) {
          const price = (data as { usd: number }).usd;
          pipeline.setex(`price:${tokenId}`, 300, price.toString()); // 5 min TTL
        }
      }
      
      await pipeline.exec();
      
      return { updated: Object.keys(prices).length };
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
    const { protocol } = job.data;

    console.log(`[HealthCheck] Checking ${protocol}`);

    try {
      // Implement health checks for each protocol
      let healthy = false;
      
      if (protocol === '1inch') {
        // Check 1inch API endpoint
        const response = await fetch(
          'https://api.1inch.dev/swap/v6.0/1/healthcheck',
          { 
            signal: AbortSignal.timeout(5000),
            headers: {
              'Authorization': `Bearer ${process.env.ONEINCH_API_KEY || ''}`,
            }
          }
        );
        healthy = response.ok;
      } else if (protocol === 'paraswap') {
        // Check ParaSwap API
        const response = await fetch(
          'https://api.paraswap.io/prices',
          { signal: AbortSignal.timeout(5000) }
        );
        healthy = response.ok;
      } else if (protocol === 'uniswap') {
        // Check Uniswap subgraph
        const response = await fetch(
          'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: '{ factories(first: 1) { id } }'
            }),
            signal: AbortSignal.timeout(5000)
          }
        );
        healthy = response.ok;
      } else {
        // Default: assume healthy
        healthy = true;
      }
      
      setProtocolHealth(protocol, healthy);

      return { protocol, healthy };
    } catch (error) {
      setProtocolHealth(protocol, false);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

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
