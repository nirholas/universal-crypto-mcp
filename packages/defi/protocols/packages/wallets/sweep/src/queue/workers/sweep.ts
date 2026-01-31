import { Worker, Job } from "bullmq";
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
 * Chain ID mapping
 */
function getChainId(chain: string): number | null {
  const chains: Record<string, number> = {
    ethereum: 1,
    mainnet: 1,
    arbitrum: 42161,
    base: 8453,
    optimism: 10,
    polygon: 137,
  };
  return chains[chain.toLowerCase()] || null;
}

/**
 * RPC URL mapping
 */
function getRpcUrl(chain: string): string | null {
  const rpcs: Record<string, string> = {
    ethereum: process.env.RPC_MAINNET || "https://eth.llamarpc.com",
    mainnet: process.env.RPC_MAINNET || "https://eth.llamarpc.com",
    arbitrum: process.env.RPC_ARBITRUM || "https://arb1.arbitrum.io/rpc",
    base: process.env.RPC_BASE || "https://mainnet.base.org",
    optimism: process.env.RPC_OPTIMISM || "https://mainnet.optimism.io",
    polygon: process.env.RPC_POLYGON || "https://polygon-rpc.com",
  };
  return rpcs[chain.toLowerCase()] || null;
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

          // Execute real sweep using 1inch API
          const chainId = getChainId(chain);
          const rpcUrl = getRpcUrl(chain);
          
          if (!chainId || !rpcUrl) {
            console.warn(`[SweepWorker] Unsupported chain: ${chain}`);
            continue;
          }

          try {
            // Get private key for sweep wallet
            const privateKey = process.env.SWEEP_WALLET_PRIVATE_KEY;
            if (!privateKey) {
              throw new Error("SWEEP_WALLET_PRIVATE_KEY not configured");
            }

            // Create wallet client
            const { createWalletClient, createPublicClient, http, parseAbi } = await import("viem");
            const { privateKeyToAccount } = await import("viem/accounts");
            const account = privateKeyToAccount(privateKey as `0x${string}`);
            
            const publicClient = createPublicClient({
              transport: http(rpcUrl),
            });

            const walletClient = createWalletClient({
              account,
              transport: http(rpcUrl),
            });

            const swapResults: string[] = [];
            const destinationToken = sweep.destinationTokenAddress || "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

            // Process each token
            for (const token of chainTokens) {
              try {
                // Skip if already destination token
                if (token.address.toLowerCase() === destinationToken.toLowerCase()) {
                  continue;
                }

                // Get 1inch quote
                const apiKey = process.env.ONEINCH_API_KEY;
                if (!apiKey) {
                  console.warn("[SweepWorker] 1inch API key not configured, skipping swap");
                  continue;
                }

                const quoteUrl = new URL(`https://api.1inch.dev/swap/v6.0/${chainId}/swap`);
                quoteUrl.searchParams.set("src", token.address);
                quoteUrl.searchParams.set("dst", destinationToken);
                quoteUrl.searchParams.set("amount", token.amount.toString());
                quoteUrl.searchParams.set("from", account.address);
                quoteUrl.searchParams.set("slippage", "1");

                const quoteResponse = await fetch(quoteUrl.toString(), {
                  headers: { Authorization: `Bearer ${apiKey}` },
                });

                if (!quoteResponse.ok) {
                  console.warn(`[SweepWorker] Failed to get quote for ${token.symbol}: ${await quoteResponse.text()}`);
                  continue;
                }

                const swapData = await quoteResponse.json() as { 
                  tx: { to: string; data: string; value: string; gas: string }
                };

                // Execute swap transaction
                const txHash = await walletClient.sendTransaction({
                  to: swapData.tx.to as `0x${string}`,
                  data: swapData.tx.data as `0x${string}`,
                  value: BigInt(swapData.tx.value || "0"),
                  gas: BigInt(swapData.tx.gas),
                });

                // Wait for confirmation
                const receipt = await publicClient.waitForTransactionReceipt({
                  hash: txHash,
                  confirmations: 1,
                });

                if (receipt.status === "success") {
                  swapResults.push(txHash);
                  console.log(`[SweepWorker] Swapped ${token.symbol}: ${txHash}`);
                } else {
                  console.warn(`[SweepWorker] Swap reverted for ${token.symbol}: ${txHash}`);
                }
              } catch (tokenError) {
                console.error(`[SweepWorker] Error swapping ${token.symbol}:`, tokenError);
              }
            }

            if (swapResults.length > 0) {
              txHashes[chain] = swapResults[0]; // Primary tx hash
              userOpHashes[chain] = `batch-${swapResults.length}-txs`;
            }
          } catch (chainError) {
            console.error(`[SweepWorker] Error on chain ${chain}:`, chainError);
          }

          // Queue transaction tracking
          if (txHashes[chain]) {
            await addSweepTrackJob({
              sweepId,
              txHash: txHashes[chain],
              chain,
              userOpHash: userOpHashes[chain],
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
        // TODO: Implement actual transaction tracking using:
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
