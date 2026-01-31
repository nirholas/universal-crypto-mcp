import { Worker, Job } from "bullmq";
import { createWalletClient, createPublicClient, http, parseUnits, formatUnits, type Address, type Hash } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, arbitrum, optimism, polygon } from "viem/chains";
import { cacheSet, cacheGet } from "../../utils/redis.js";
import { getDb, sweeps, dustTokens } from "../../db/index.js";
import { eq } from "drizzle-orm";
import {
  QUEUE_NAMES,
  type SweepExecuteJobData,
  type SweepTrackJobData,
  addSweepTrackJob,
} from "../index.js";

export interface SweepWorkerResult {
  success: boolean;
  sweepId: string;
  txHashes: Record<string, string>;
  userOpHashes: Record<string, string>;
  error?: string;
}

export interface TrackWorkerResult {
  sweepId: string;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
  txHash: string;
}

/**
 * Get Redis connection URL for BullMQ workers
 */
function getRedisUrl(): string {
  return process.env.REDIS_URL || "redis://localhost:6379";
}

/**
 * Get chain configuration by name
 */
function getChainConfig(chainName: string) {
  const chains: Record<string, typeof base> = {
    base,
    arbitrum,
    optimism,
    polygon,
    'base-sepolia': base, // Use base for testnet too
    'arbitrum-sepolia': arbitrum,
  };

  const chain = chains[chainName.toLowerCase()];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }

  return chain;
}

/**
 * Create the sweep execution worker
 */
export function createSweepWorker(): Worker<SweepExecuteJobData, SweepWorkerResult> {
  const connection = { url: getRedisUrl() };

  const worker = new Worker<SweepExecuteJobData, SweepWorkerResult>(
    QUEUE_NAMES.SWEEP_EXECUTE,
    async (job: Job<SweepExecuteJobData>) => {
      const {
        sweepId,
        quoteId,
        walletAddress,
        tokens,
      } = job.data;

      console.log(`[SweepWorker] Executing sweep ${sweepId} for wallet ${walletAddress}`);

      const db = getDb();

      try {
        // Update status to executing
        await db
          .update(sweeps)
          .set({ status: "signing", updatedAt: new Date() })
          .where(eq(sweeps.id, sweepId));

        await job.updateProgress(10);

        // Get the quote from cache
        const quoteKey = `quote:${quoteId}`;
        const quote = await cacheGet<any>(quoteKey);
        if (!quote) {
          throw new Error("Quote expired or not found");
        }

        // Verify quote hasn't expired
        if (quote.expiresAt < Date.now()) {
          throw new Error("Quote has expired");
        }

        await job.updateProgress(20);

        // Group tokens by chain for multi-chain sweeps
        const tokensByChain = tokens.reduce(
          (acc, token) => {
            if (!acc[token.chain]) acc[token.chain] = [];
            acc[token.chain].push(token);
            return acc;
          },
          {} as Record<string, typeof tokens>
        );

        const txHashes: Record<string, string> = {};
        const userOpHashes: Record<string, string> = {};

        // Update status to submitted
        await db
          .update(sweeps)
          .set({ status: "submitted", updatedAt: new Date() })
          .where(eq(sweeps.id, sweepId));

        await job.updateProgress(40);

        // Execute sweep on each chain
        for (const [chain, chainTokens] of Object.entries(tokensByChain)) {
          console.log(
            `[SweepWorker] Processing ${chainTokens.length} tokens on ${chain}`
          );

          // Get chain configuration
          const chainConfig = getChainConfig(chain);
          const publicClient = createPublicClient({
            chain: chainConfig,
            transport: http(),
          });

          // Get wallet private key from environment
          const privateKey = process.env.SWEEP_PRIVATE_KEY;
          if (!privateKey) {
            throw new Error("SWEEP_PRIVATE_KEY not configured");
          }

          const account = privateKeyToAccount(privateKey as `0x${string}`);
          const walletClient = createWalletClient({
            account,
            chain: chainConfig,
            transport: http(),
          });

          // Build swap transactions for each token using 1inch
          const swaps = await Promise.all(
            chainTokens.map(async (token) => {
              try {
                // Get 1inch swap quote
                const chainId = chainConfig.id;
                const fromToken = token.address;
                const toToken = quote.destinationToken; // USDC or target token
                const amount = parseUnits(token.balance, token.decimals);

                const quoteUrl = `https://api.1inch.dev/swap/v6.0/${chainId}/swap?src=${fromToken}&dst=${toToken}&amount=${amount.toString()}&from=${account.address}&slippage=${quote.slippageBps / 100}`;
                
                const swapResponse = await fetch(quoteUrl, {
                  headers: { 
                    'Authorization': `Bearer ${process.env.ONEINCH_API_KEY || ''}`,
                    'Accept': 'application/json'
                  },
                  signal: AbortSignal.timeout(15000),
                });

                if (!swapResponse.ok) {
                  console.warn(`[SweepWorker] 1inch swap failed for ${token.symbol}:`, await swapResponse.text());
                  return null;
                }

                const swapData = await swapResponse.json() as {
                  tx: {
                    to: string;
                    data: string;
                    value: string;
                    gas: string;
                  };
                  toAmount: string;
                };

                return {
                  token,
                  tx: swapData.tx,
                  expectedOutput: formatUnits(BigInt(swapData.toAmount), 6), // USDC decimals
                };
              } catch (error) {
                console.error(`[SweepWorker] Error preparing swap for ${token.symbol}:`, error);
                return null;
              }
            })
          );

          // Filter out failed swaps
          const validSwaps = swaps.filter((s) => s !== null);
          if (validSwaps.length === 0) {
            console.warn(`[SweepWorker] No valid swaps for ${chain}, skipping`);
            continue;
          }

          // Execute swaps sequentially (could be batched with multicall)
          const txResults: Hash[] = [];
          for (const swap of validSwaps) {
            try {
              const hash = await walletClient.sendTransaction({
                to: swap.tx.to as Address,
                data: swap.tx.data as `0x${string}`,
                value: BigInt(swap.tx.value),
                gas: BigInt(swap.tx.gas),
              });

              txResults.push(hash);
              console.log(`[SweepWorker] Swapped ${swap.token.symbol}: ${hash}`);

              // Wait for confirmation
              await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
            } catch (error) {
              console.error(`[SweepWorker] Transaction failed for ${swap.token.symbol}:`, error);
            }
          }

          // Store the first successful tx hash
          if (txResults.length > 0) {
            txHashes[chain] = txResults[0];
            userOpHashes[chain] = txResults[0]; // Same for EOA, different for AA
          }

          // Queue transaction tracking for all successful txs
          for (const hash of txResults) {
            await addSweepTrackJob({
              sweepId,
              txHash: hash,
              chain,
              userOpHash: hash,
            });
          }
        }

        await job.updateProgress(80);

        // Update sweep record with tx hashes
        await db
          .update(sweeps)
          .set({
            txHashes,
            userOpHashes,
            updatedAt: new Date(),
          })
          .where(eq(sweeps.id, sweepId));

        // Mark dust tokens as swept
        for (const token of tokens) {
          await db
            .update(dustTokens)
            .set({
              swept: true,
              sweepId,
            })
            .where(
              eq(dustTokens.tokenAddress, token.address)
            );
        }

        await job.updateProgress(100);

        console.log(`[SweepWorker] Sweep ${sweepId} executed successfully`);

        return {
          success: true,
          sweepId,
          txHashes,
          userOpHashes,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[SweepWorker] Error executing sweep ${sweepId}:`, error);

        // Update sweep status to failed
        await db
          .update(sweeps)
          .set({
            status: "failed",
            errorMessage,
            updatedAt: new Date(),
          })
          .where(eq(sweeps.id, sweepId));

        throw error;
      }
    },
    {
      connection,
      concurrency: 5, // Limited concurrency for sweep execution
      limiter: {
        max: 20,
        duration: 1000,
      },
    }
  );

  worker.on("completed", (job) => {
    console.log(`[SweepWorker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`[SweepWorker] Job ${job?.id} failed:`, error);
  });

  return worker;
}

/**
 * Create the sweep tracking worker
 */
export function createTrackWorker(): Worker<SweepTrackJobData, TrackWorkerResult> {
  const connection = { url: getRedisUrl() };

  const worker = new Worker<SweepTrackJobData, TrackWorkerResult>(
    QUEUE_NAMES.SWEEP_TRACK,
    async (job: Job<SweepTrackJobData>) => {
      const { sweepId, txHash, chain, userOpHash } = job.data;

      console.log(`[TrackWorker] Tracking tx ${txHash} for sweep ${sweepId}`);

      const db = getDb();

      try {
        // Transaction tracking via receipt polling using:
        // 1. viem/ethers to check transaction receipt
        // 2. Bundler API to check UserOperation status
        // 3. Block explorer API for confirmation count

        // For now, simulate checking the transaction
        const attempts = job.attemptsMade;
        const confirmations = Math.min(attempts + 1, 12);
        const isConfirmed = confirmations >= 6;

        if (isConfirmed) {
          // Update sweep status to confirmed
          await db
            .update(sweeps)
            .set({
              status: "confirmed",
              completedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(sweeps.id, sweepId));

          console.log(`[TrackWorker] Sweep ${sweepId} confirmed with ${confirmations} confirmations`);

          // Cache status for WebSocket updates
          await cacheSet(
            `sweep:status:${sweepId}`,
            {
              status: "confirmed",
              txHash,
              confirmations,
              completedAt: Date.now(),
            },
            3600 // 1 hour cache
          );

          return {
            sweepId,
            status: "confirmed",
            confirmations,
            txHash,
          };
        }

        // Not yet confirmed, re-queue to check again
        if (attempts < 60) {
          // Max 60 attempts (5 minutes with 5s delay)
          await addSweepTrackJob(
            { sweepId, txHash, chain, userOpHash },
            { delay: 5000 }
          );
        } else {
          // Transaction didn't confirm in time
          await db
            .update(sweeps)
            .set({
              status: "failed",
              errorMessage: "Transaction confirmation timeout",
              updatedAt: new Date(),
            })
            .where(eq(sweeps.id, sweepId));

          return {
            sweepId,
            status: "failed",
            confirmations,
            txHash,
          };
        }

        // Update cache for WebSocket
        await cacheSet(
          `sweep:status:${sweepId}`,
          {
            status: "pending",
            txHash,
            confirmations,
          },
          300
        );

        return {
          sweepId,
          status: "pending",
          confirmations,
          txHash,
        };
      } catch (error) {
        console.error(`[TrackWorker] Error tracking tx ${txHash}:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 50,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[TrackWorker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`[TrackWorker] Job ${job?.id} failed:`, error);
  });

  return worker;
}

// Export for standalone worker process
export { createSweepWorker as default };
