/**
 * Swap Worker
 * Processes swap/trade tasks
 */

import type { Task, WorkerContext, WorkerResult, TradeRecord } from '../../types.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Swap task payload interface
 */
export interface SwapPayload {
  botId: string;
  walletId: string;
  tokenMint: string;
  direction: 'buy' | 'sell';
  amount: string;
  slippageBps?: number;
  priorityFee?: string;
  poolAddress?: string;
}

/**
 * Process a swap task
 */
export async function processSwapTask(
  task: Task,
  context: WorkerContext
): Promise<WorkerResult> {
  const payload = task.payload as unknown as SwapPayload;
  const startTime = Date.now();

  try {
    // Validate payload
    if (!payload.walletId || !payload.tokenMint || !payload.amount) {
      throw new Error('Invalid swap payload: missing required fields');
    }

    // Get trading engine from context
    const tradingEngine = context.tradingEngine as {
      executeSwap?: (params: {
        walletId: string;
        tokenMint: string;
        direction: 'buy' | 'sell';
        amount: bigint;
        slippageBps: number;
        priorityFee?: bigint;
      }) => Promise<{
        signature: string;
        amountIn: bigint;
        amountOut: bigint;
        fee: bigint;
      }>;
    } | undefined;

    if (!tradingEngine?.executeSwap) {
      // Mock execution for testing without trading engine
      console.warn('Trading engine not available, simulating swap');
      
      await simulateSwap(payload);

      // Record trade
      const tradeRecord: TradeRecord = {
        id: uuidv4(),
        botId: payload.botId,
        walletId: payload.walletId,
        campaignId: task.campaignId,
        tokenMint: payload.tokenMint,
        type: payload.direction,
        amount: BigInt(payload.amount),
        price: 0.001, // Mock price
        fees: 5000n, // Mock fee
        signature: `mock-${uuidv4().slice(0, 8)}`,
        timestamp: new Date(),
        success: true,
      };

      context.metricsCollector.recordTrade(tradeRecord);

      return {
        success: true,
        data: {
          signature: tradeRecord.signature,
          amountIn: payload.amount,
          amountOut: (BigInt(payload.amount) * 99n / 100n).toString(),
          fee: '5000',
          executionTime: Date.now() - startTime,
        },
      };
    }

    // Execute actual swap
    const result = await tradingEngine.executeSwap({
      walletId: payload.walletId,
      tokenMint: payload.tokenMint,
      direction: payload.direction,
      amount: BigInt(payload.amount),
      slippageBps: payload.slippageBps ?? 100,
      priorityFee: payload.priorityFee ? BigInt(payload.priorityFee) : undefined,
    });

    // Record successful trade
    const tradeRecord: TradeRecord = {
      id: uuidv4(),
      botId: payload.botId,
      walletId: payload.walletId,
      campaignId: task.campaignId,
      tokenMint: payload.tokenMint,
      type: payload.direction,
      amount: result.amountIn,
      price: Number(result.amountOut) / Number(result.amountIn),
      fees: result.fee,
      signature: result.signature,
      timestamp: new Date(),
      success: true,
    };

    context.metricsCollector.recordTrade(tradeRecord);

    return {
      success: true,
      data: {
        signature: result.signature,
        amountIn: result.amountIn.toString(),
        amountOut: result.amountOut.toString(),
        fee: result.fee.toString(),
        executionTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    // Record failed trade
    const tradeRecord: TradeRecord = {
      id: uuidv4(),
      botId: payload.botId,
      walletId: payload.walletId,
      campaignId: task.campaignId,
      tokenMint: payload.tokenMint,
      type: payload.direction,
      amount: BigInt(payload.amount),
      price: 0,
      fees: 0n,
      signature: '',
      timestamp: new Date(),
      success: false,
      errorMessage: err.message,
    };

    context.metricsCollector.recordTrade(tradeRecord);

    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Simulate a swap for testing
 */
async function simulateSwap(payload: SwapPayload): Promise<void> {
  // Simulate network delay
  const delay = 500 + Math.random() * 1500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate occasional failures (5% failure rate)
  if (Math.random() < 0.05) {
    throw new Error('Simulated transaction failure');
  }
}

/**
 * Validate swap payload
 */
export function validateSwapPayload(payload: unknown): payload is SwapPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return (
    typeof p.botId === 'string' &&
    typeof p.walletId === 'string' &&
    typeof p.tokenMint === 'string' &&
    (p.direction === 'buy' || p.direction === 'sell') &&
    typeof p.amount === 'string'
  );
}
