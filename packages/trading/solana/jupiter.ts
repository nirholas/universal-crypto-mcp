/**
 * @file jupiter.ts
 * @description Jupiter DEX aggregator integration for Solana swaps
 * @author nirholas
 */

import { Connection, PublicKey, VersionedTransaction, Keypair } from '@solana/web3.js';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  priceImpactPct: number;
  slippageBps: number;
  route: RouteStep[];
  quoteResponse: unknown;
}

export interface RouteStep {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
}

export interface SwapResult {
  signature: string;
  status: 'success' | 'failed' | 'pending';
  inputAmount: string;
  outputAmount: string;
}

/**
 * Get a swap quote from Jupiter
 */
export async function getQuote(args: {
  inputToken: string;
  outputToken: string;
  amount: string;
  slippageBps?: number;
}): Promise<SwapQuote> {
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
    throw new Error(`Jupiter quote failed: ${await response.text()}`);
  }

  const quoteResponse = await response.json() as Record<string, unknown>;

  const routePlan = quoteResponse.routePlan as Array<{ swapInfo: Record<string, string> }> | undefined;
  const route: RouteStep[] = routePlan?.map((step) => ({
    ammKey: step.swapInfo?.ammKey || '',
    label: step.swapInfo?.label || 'Unknown',
    inputMint: step.swapInfo?.inputMint || inputMint,
    outputMint: step.swapInfo?.outputMint || outputMint,
    inAmount: step.swapInfo?.inAmount || '0',
    outAmount: step.swapInfo?.outAmount || '0',
  })) || [];

  return {
    inputMint,
    outputMint,
    inputAmount: args.amount,
    outputAmount: String(quoteResponse.outAmount || '0'),
    priceImpactPct: parseFloat(String(quoteResponse.priceImpactPct || '0')),
    slippageBps,
    route,
    quoteResponse,
  };
}

/**
 * Execute a swap using Jupiter
 */
export async function executeSwap(args: {
  quote: SwapQuote;
  userPublicKey: string;
  privateKey: Uint8Array;
}): Promise<SwapResult> {
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    'confirmed'
  );

  // Get swap transaction
  const swapResponse = await fetch(`${JUPITER_API}/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: args.quote.quoteResponse,
      userPublicKey: args.userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!swapResponse.ok) {
    throw new Error(`Jupiter swap failed: ${await swapResponse.text()}`);
  }

  const { swapTransaction } = await swapResponse.json() as { swapTransaction: string };

  // Sign and send
  const txBuf = Buffer.from(swapTransaction, 'base64');
  const tx = VersionedTransaction.deserialize(txBuf);
  tx.sign([Keypair.fromSecretKey(args.privateKey)]);

  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
    maxRetries: 3,
  });

  // Confirm
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  const confirmation = await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });

  return {
    signature,
    status: confirmation.value.err ? 'failed' : 'success',
    inputAmount: args.quote.inputAmount,
    outputAmount: args.quote.outputAmount,
  };
}

export default { getQuote, executeSwap };
