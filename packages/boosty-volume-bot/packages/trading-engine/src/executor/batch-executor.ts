/**
 * Batch Trade Executor
 * 
 * Executes multiple trades efficiently with batching and parallel execution.
 */

import {
  Connection,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { TradeExecutor } from './trade-executor.js';
import type {
  TradeParams,
  TradeResult,
  BatchTradeResult,
  TradingEngineConfig,
} from '../types.js';
import { DEFAULT_TRADING_CONFIG } from '../types.js';

/**
 * Batch execution options
 */
interface BatchOptions {
  /** Maximum trades per batch transaction */
  maxTradesPerBatch?: number;
  /** Execute batches in parallel */
  parallel?: boolean;
  /** Continue on individual trade failure */
  continueOnError?: boolean;
  /** Delay between batches in ms */
  batchDelayMs?: number;
}

const DEFAULT_BATCH_OPTIONS: Required<BatchOptions> = {
  maxTradesPerBatch: 4,
  parallel: false,
  continueOnError: true,
  batchDelayMs: 0,
};

/**
 * Batch Trade Executor - efficiently executes multiple trades
 */
export class BatchExecutor {
  private readonly connection: Connection;
  private readonly config: TradingEngineConfig;
  private readonly executor: TradeExecutor;

  constructor(config: Partial<TradingEngineConfig> = {}) {
    this.config = { ...DEFAULT_TRADING_CONFIG, ...config };
    this.connection = new Connection(this.config.rpcEndpoint, 'confirmed');
    this.executor = new TradeExecutor(this.config);
  }

  /**
   * Execute trades in batch
   */
  async executeBatch(
    trades: TradeParams[],
    signer: Uint8Array | ((tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>),
    options: BatchOptions = {}
  ): Promise<BatchTradeResult> {
    const opts = { ...DEFAULT_BATCH_OPTIONS, ...options };
    const startTime = Date.now();

    const results: TradeResult[] = [];
    let successCount = 0;
    let failedCount = 0;

    if (opts.parallel && !opts.continueOnError) {
      // Execute all trades in parallel
      const tradePromises = trades.map(trade =>
        this.executor.executeTradeWithSigner(trade, signer)
      );

      const settledResults = await Promise.allSettled(tradePromises);

      for (const result of settledResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          if (result.value.transaction.confirmed) {
            successCount++;
          } else {
            failedCount++;
          }
        } else {
          failedCount++;
        }
      }
    } else {
      // Execute trades sequentially
      for (const trade of trades) {
        try {
          const result = await this.executor.executeTradeWithSigner(trade, signer);
          results.push(result);
          
          if (result.transaction.confirmed) {
            successCount++;
          } else {
            failedCount++;
            if (!opts.continueOnError) {
              break;
            }
          }

          // Delay between trades if specified
          if (opts.batchDelayMs > 0) {
            await this.sleep(opts.batchDelayMs);
          }
        } catch (error) {
          failedCount++;
          
          // Create failed result
          results.push(this.createFailedResult(trade, error));
          
          if (!opts.continueOnError) {
            break;
          }
        }
      }
    }

    return {
      results,
      successCount,
      failedCount,
      totalTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Execute trades in optimized batches (group by common tokens)
   */
  async executeOptimizedBatch(
    trades: TradeParams[],
    signer: Uint8Array | ((tx: any) => Promise<any>),
    options: BatchOptions = {}
  ): Promise<BatchTradeResult> {
    const opts = { ...DEFAULT_BATCH_OPTIONS, ...options };

    // Group trades by input token (can potentially batch these)
    const groupedTrades = this.groupTradesByInput(trades);

    const allResults: TradeResult[] = [];
    let totalSuccess = 0;
    let totalFailed = 0;
    const startTime = Date.now();

    for (const group of groupedTrades) {
      // Execute each group
      const result = await this.executeBatch(group, signer, opts);
      allResults.push(...result.results);
      totalSuccess += result.successCount;
      totalFailed += result.failedCount;

      // Delay between groups
      if (opts.batchDelayMs > 0) {
        await this.sleep(opts.batchDelayMs);
      }
    }

    return {
      results: allResults,
      successCount: totalSuccess,
      failedCount: totalFailed,
      totalTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Estimate batch execution
   */
  async estimateBatch(trades: TradeParams[]): Promise<{
    trades: Array<{
      trade: TradeParams;
      estimatedOutput: bigint;
      priceImpact: number;
    }>;
    totalEstimatedFees: bigint;
    estimatedTimeMs: number;
  }> {
    const estimates = await Promise.all(
      trades.map(async trade => {
        const estimate = await this.executor.estimateTradeOutput(trade);
        return {
          trade,
          estimatedOutput: estimate.outputAmount,
          priceImpact: estimate.priceImpactPct,
          fees: estimate.estimatedFees,
        };
      })
    );

    const totalFees = estimates.reduce((sum, e) => sum + e.fees, 0n);

    return {
      trades: estimates.map(e => ({
        trade: e.trade,
        estimatedOutput: e.estimatedOutput,
        priceImpact: e.priceImpact,
      })),
      totalEstimatedFees: totalFees,
      estimatedTimeMs: trades.length * 400, // ~400ms per trade
    };
  }

  /**
   * Validate batch before execution
   */
  async validateBatch(trades: TradeParams[]): Promise<{
    valid: boolean;
    errors: Array<{ index: number; error: string }>;
  }> {
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < trades.length; i++) {
      const trade = trades[i]!;

      // Validate slippage
      const slippage = trade.slippageBps ?? this.config.defaultSlippageBps;
      if (slippage > this.config.maxSlippageBps) {
        errors.push({
          index: i,
          error: `Slippage ${slippage} bps exceeds maximum ${this.config.maxSlippageBps} bps`,
        });
        continue;
      }

      // Check if route exists
      try {
        await this.executor.getOptimalRoute(trade.inputMint, trade.outputMint, trade.amount);
      } catch (error) {
        errors.push({
          index: i,
          error: `No route found: ${error instanceof Error ? error.message : 'Unknown'}`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Group trades by input token
   */
  private groupTradesByInput(trades: TradeParams[]): TradeParams[][] {
    const groups = new Map<string, TradeParams[]>();

    for (const trade of trades) {
      const key = trade.inputMint;
      const group = groups.get(key) ?? [];
      group.push(trade);
      groups.set(key, group);
    }

    return Array.from(groups.values());
  }

  /**
   * Create a failed trade result
   */
  private createFailedResult(trade: TradeParams, error: unknown): TradeResult {
    return {
      transaction: {
        signature: '',
        confirmed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      inputMint: trade.inputMint,
      outputMint: trade.outputMint,
      amountIn: trade.amount,
      amountOut: 0n,
      priceImpactPct: 0,
      route: { legs: [], inputAmount: 0n, outputAmount: 0n, priceImpactPct: 0, totalFeeBps: 0 },
      dex: 'jupiter',
      executedAt: Date.now(),
      totalFees: 0n,
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get underlying trade executor
   */
  getExecutor(): TradeExecutor {
    return this.executor;
  }

  /**
   * Get connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }
}
