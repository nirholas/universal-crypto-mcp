/**
 * Balance Worker
 * Processes balance check tasks
 */

import type { Task, WorkerContext, WorkerResult } from '../../types.js';

/**
 * Balance check task payload interface
 */
export interface BalancePayload {
  walletId: string;
  tokenMints?: string[]; // If not provided, checks SOL balance
  checkAll?: boolean; // Check all token balances
}

/**
 * Balance result interface
 */
export interface BalanceResult {
  walletId: string;
  solBalance: string;
  tokenBalances: Record<string, string>;
  timestamp: Date;
}

/**
 * Process a balance check task
 */
export async function processBalanceTask(
  task: Task,
  context: WorkerContext
): Promise<WorkerResult> {
  const payload = task.payload as unknown as BalancePayload;
  const startTime = Date.now();

  try {
    // Validate payload
    if (!payload.walletId) {
      throw new Error('Invalid balance payload: missing walletId');
    }

    // Get wallet manager from context
    const walletManager = context.walletManager as {
      getBalance?: (walletId: string, tokenMint?: string) => Promise<bigint>;
      getAllBalances?: (walletId: string) => Promise<Map<string, bigint>>;
    } | undefined;

    if (!walletManager?.getBalance) {
      // Mock execution for testing
      console.warn('Wallet manager not available, simulating balance check');

      const result = await simulateBalanceCheck(payload);

      return {
        success: true,
        data: {
          ...result,
          executionTime: Date.now() - startTime,
        },
      };
    }

    const result: BalanceResult = {
      walletId: payload.walletId,
      solBalance: '0',
      tokenBalances: {},
      timestamp: new Date(),
    };

    // Get SOL balance
    const solBalance = await walletManager.getBalance(payload.walletId);
    result.solBalance = solBalance.toString();

    // Get token balances
    if (payload.checkAll && walletManager.getAllBalances) {
      const allBalances = await walletManager.getAllBalances(payload.walletId);
      for (const [mint, balance] of allBalances) {
        result.tokenBalances[mint] = balance.toString();
      }
    } else if (payload.tokenMints) {
      for (const mint of payload.tokenMints) {
        const balance = await walletManager.getBalance(payload.walletId, mint);
        result.tokenBalances[mint] = balance.toString();
      }
    }

    return {
      success: true,
      data: {
        ...result,
        executionTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Simulate a balance check for testing
 */
async function simulateBalanceCheck(payload: BalancePayload): Promise<BalanceResult> {
  // Simulate network delay
  const delay = 100 + Math.random() * 300;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const result: BalanceResult = {
    walletId: payload.walletId,
    solBalance: (Math.random() * 10 * 1e9).toFixed(0), // 0-10 SOL in lamports
    tokenBalances: {},
    timestamp: new Date(),
  };

  // Generate random token balances
  if (payload.tokenMints) {
    for (const mint of payload.tokenMints) {
      result.tokenBalances[mint] = (Math.random() * 1e6).toFixed(0);
    }
  }

  return result;
}

/**
 * Validate balance payload
 */
export function validateBalancePayload(payload: unknown): payload is BalancePayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return typeof p.walletId === 'string';
}

/**
 * Create a balance check task
 */
export function createBalanceCheckTask(
  walletId: string,
  tokenMints?: string[],
  options?: {
    priority?: 'low' | 'normal' | 'high' | 'critical';
    botId?: string;
    campaignId?: string;
  }
): Task {
  return {
    type: 'check-balance',
    payload: {
      walletId,
      tokenMints,
    },
    priority: options?.priority ?? 'low',
    maxRetries: 2,
    timeout: 30000,
    walletId,
    botId: options?.botId,
    campaignId: options?.campaignId,
  };
}
