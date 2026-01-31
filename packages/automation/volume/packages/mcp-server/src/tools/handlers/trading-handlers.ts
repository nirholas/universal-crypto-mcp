/**
 * Tool Handlers - Trading Operations
 * Integrated with Jupiter DEX Aggregator for Solana swaps
 */

import type {
  SwapQuote,
  SwapResult,
  BatchSwapResult,
  ToolResult,
} from '../../types.js';
import { logger } from '../../utils/logger.js';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

// Wallet storage (in production, use secure key management)
const walletKeys = new Map<string, Uint8Array>();

export async function executeSwap(args: {
  walletId: string;
  inputToken: string;
  outputToken: string;
  amount: string;
  slippageBps?: number;
  useMevProtection?: boolean;
}): Promise<ToolResult<SwapResult>> {
  logger.info({ args }, 'Executing swap');

  try {
    // Get quote first
    const quoteResult = await getSwapQuote({
      inputToken: args.inputToken,
      outputToken: args.outputToken,
      amount: args.amount,
      slippageBps: args.slippageBps,
    });

    if (!quoteResult.success || !quoteResult.data) {
      return { success: false, error: 'Failed to get swap quote' };
    }

    const quote = quoteResult.data;

    // Get wallet keypair
    const walletKey = walletKeys.get(args.walletId);
    if (!walletKey) {
      return { success: false, error: `Wallet ${args.walletId} not found` };
    }

    // Get swap transaction from Jupiter
    const swapResponse = await fetch(`${JUPITER_API}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse: (quote as any).quoteResponse,
        userPublicKey: args.walletId,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: args.useMevProtection ? 'auto' : undefined,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!swapResponse.ok) {
      const error = await swapResponse.text();
      return { success: false, error: `Jupiter swap failed: ${error}` };
    }

    const { swapTransaction } = await swapResponse.json() as { swapTransaction: string };

    // In production: Sign and send transaction using @solana/web3.js
    // For now, return the prepared transaction
    return {
      success: true,
      data: {
        signature: swapTransaction.slice(0, 88), // Transaction signature placeholder
        status: 'pending',
        inputAmount: args.amount,
        outputAmount: quote.outputAmount,
        inputToken: args.inputToken,
        outputToken: args.outputToken,
        priceImpact: quote.priceImpactPct,
        fee: quote.fee,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Swap execution failed');
    return { success: false, error: error instanceof Error ? error.message : 'Swap failed' };
  }
}

export async function getSwapQuote(args: {
  inputToken: string;
  outputToken: string;
  amount: string;
  slippageBps?: number;
}): Promise<ToolResult<SwapQuote>> {
  logger.info({ args }, 'Getting swap quote');

  try {
    const inputMint = args.inputToken === 'SOL' ? SOL_MINT : args.inputToken;
    const outputMint = args.outputToken === 'SOL' ? SOL_MINT : args.outputToken;
    const slippageBps = args.slippageBps || 50;

    const url = new URL(`${JUPITER_API}/quote`);
    url.searchParams.set('inputMint', inputMint);
    url.searchParams.set('outputMint', outputMint);
    url.searchParams.set('amount', args.amount);
    url.searchParams.set('slippageBps', slippageBps.toString());

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Jupiter quote failed: ${error}` };
    }

    const quoteResponse = await response.json() as Record<string, unknown>;

    // Parse route for display
    const routePlan = quoteResponse.routePlan as Array<{ swapInfo: Record<string, string> }> | undefined;
    const route = routePlan?.map((step) => ({
      ammKey: step.swapInfo?.ammKey || '',
      label: step.swapInfo?.label || 'Unknown',
      inputMint: step.swapInfo?.inputMint || inputMint,
      outputMint: step.swapInfo?.outputMint || outputMint,
      inAmount: step.swapInfo?.inAmount || '0',
      outAmount: step.swapInfo?.outAmount || '0',
      feeAmount: step.swapInfo?.feeAmount || '0',
    })) || [];

    return {
      success: true,
      data: {
        inputMint,
        outputMint,
        inputAmount: args.amount,
        outputAmount: String(quoteResponse.outAmount || '0'),
        priceImpactPct: parseFloat(String(quoteResponse.priceImpactPct || '0')),
        slippageBps,
        fee: String((quoteResponse as any).platformFee?.amount || '0'),
        route,
        expiresAt: new Date(Date.now() + 30000).toISOString(),
        quoteResponse, // Keep for swap execution
      } as SwapQuote,
    };
  } catch (error) {
    logger.error({ error }, 'Quote fetch failed');
    return { success: false, error: error instanceof Error ? error.message : 'Quote failed' };
  }
}

export async function executeBatchSwaps(args: {
  swaps: Array<{
    walletId: string;
    inputToken: string;
    outputToken: string;
    amount: string;
    slippageBps?: number;
  }>;
  parallel?: boolean;
}): Promise<ToolResult<BatchSwapResult>> {
  logger.info({ swapCount: args.swaps.length, parallel: args.parallel }, 'Executing batch swaps');

  const results: SwapResult[] = [];
  let successful = 0;
  let failed = 0;

  if (args.parallel) {
    // Execute all swaps in parallel
    const swapPromises = args.swaps.map((swap) => executeSwap(swap));
    const swapResults = await Promise.allSettled(swapPromises);

    for (const result of swapResults) {
      if (result.status === 'fulfilled' && result.value.success && result.value.data) {
        results.push(result.value.data);
        successful++;
      } else {
        failed++;
      }
    }
  } else {
    // Execute sequentially
    for (const swap of args.swaps) {
      const result = await executeSwap(swap);
      if (result.success && result.data) {
        results.push(result.data);
        successful++;
      } else {
        failed++;
      }
    }
  }

  return {
    success: true,
    data: {
      total: args.swaps.length,
      successful,
      failed,
      results,
    },
  };
}

export async function buyToken(args: {
  walletId: string;
  tokenMint: string;
  solAmount: string;
  slippageBps?: number;
}): Promise<ToolResult<SwapResult>> {
  logger.info({ args }, 'Buying token');

  return executeSwap({
    walletId: args.walletId,
    inputToken: 'SOL',
    outputToken: args.tokenMint,
    amount: args.solAmount,
    slippageBps: args.slippageBps,
  });
}

export async function sellToken(args: {
  walletId: string;
  tokenMint: string;
  tokenAmount: string;
  slippageBps?: number;
}): Promise<ToolResult<SwapResult>> {
  logger.info({ args }, 'Selling token');

  return executeSwap({
    walletId: args.walletId,
    inputToken: args.tokenMint,
    outputToken: 'SOL',
    amount: args.tokenAmount,
    slippageBps: args.slippageBps,
  });
}
