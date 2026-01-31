/**
 * Wallet Transactions API Route
 * /api/wallets/transactions - Transaction history and management
 * 
 * Production implementation using blockchain explorers and RPC
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  createErrorResponse,
  parseQuery,
  parseBody,
  setCacheHeaders,
} from '@/lib/api';
import { APIException } from '@/lib/api/errors';
import type { TransactionInfo, TransactionBuildResponse, RequestContext } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Configuration
// ============================================================================

const RPC_ENDPOINTS: Record<string, string> = {
  ethereum: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
  base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  arbitrum: process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
  optimism: process.env.OP_RPC_URL || 'https://mainnet.optimism.io',
  bsc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
};

const EXPLORER_APIS: Record<string, { url: string; apiKey?: string }> = {
  ethereum: {
    url: 'https://api.etherscan.io/api',
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  base: {
    url: 'https://api.basescan.org/api',
    apiKey: process.env.BASESCAN_API_KEY,
  },
  arbitrum: {
    url: 'https://api.arbiscan.io/api',
    apiKey: process.env.ARBISCAN_API_KEY,
  },
  polygon: {
    url: 'https://api.polygonscan.com/api',
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  optimism: {
    url: 'https://api-optimistic.etherscan.io/api',
    apiKey: process.env.OPTIMISM_API_KEY,
  },
};

const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  bsc: 56,
};

// ============================================================================
// Schemas
// ============================================================================

const TransactionsQuerySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chain: z.string().optional(),
  type: z.enum(['all', 'transfer', 'swap', 'approve', 'contract']).optional(),
  status: z.enum(['all', 'pending', 'confirmed', 'failed']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

type TransactionsQuery = z.infer<typeof TransactionsQuerySchema>;

function parseTransactionsParams(query: TransactionsQuery) {
  return {
    address: query.address,
    chain: query.chain || 'ethereum',
    type: query.type || 'all' as const,
    status: query.status || 'all' as const,
    page: query.page || 1,
    limit: query.limit || 20,
  };
}

const BuildTransactionSchema = z.object({
  chain: z.string(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().optional(),
  data: z.string().optional(),
  gasLimit: z.string().optional(),
  maxFeePerGas: z.string().optional(),
  maxPriorityFeePerGas: z.string().optional(),
});

// ============================================================================
// RPC Helpers
// ============================================================================

async function jsonRpcCall(chain: string, method: string, params: unknown[]): Promise<unknown> {
  const rpcUrl = RPC_ENDPOINTS[chain] || RPC_ENDPOINTS.ethereum;

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || 'RPC error');
  }

  return data.result;
}

// ============================================================================
// Transaction History Fetching
// ============================================================================

async function fetchTransactionHistory(
  address: string,
  chain: string,
  page: number,
  limit: number
): Promise<{ transactions: TransactionInfo[]; total: number }> {
  const explorer = EXPLORER_APIS[chain];
  
  if (!explorer) {
    // Fallback: return empty for unsupported chains
    return { transactions: [], total: 0 };
  }

  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    page: page.toString(),
    offset: limit.toString(),
    sort: 'desc',
  });

  if (explorer.apiKey) {
    params.append('apikey', explorer.apiKey);
  }

  try {
    const response = await fetch(`${explorer.url}?${params.toString()}`);
    const data = await response.json();

    if (data.status !== '1' || !Array.isArray(data.result)) {
      // No transactions or error
      return { transactions: [], total: 0 };
    }

    const transactions: TransactionInfo[] = data.result.map((tx: any) => ({
      hash: tx.hash,
      chain,
      chainId: CHAIN_IDS[chain] || 1,
      from: tx.from,
      to: tx.to || '',
      value: (parseInt(tx.value) / 1e18).toFixed(6),
      status: tx.txreceipt_status === '1' ? 'confirmed' : tx.txreceipt_status === '0' ? 'failed' : 'pending',
      blockNumber: parseInt(tx.blockNumber),
      timestamp: parseInt(tx.timeStamp) * 1000,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      nonce: parseInt(tx.nonce),
      type: determineTransactionType(tx),
    }));

    return {
      transactions,
      total: transactions.length >= limit ? (page * limit) + 1 : offset + transactions.length,
    };
  } catch (error) {
    console.error(`[API] Transaction history error for ${chain}:`, error);
    return { transactions: [], total: 0 };
  }
}

function determineTransactionType(tx: any): TransactionInfo['type'] {
  if (!tx.input || tx.input === '0x' || tx.input === '') {
    return 'transfer';
  }
  
  // Check function selector
  const selector = tx.input.slice(0, 10).toLowerCase();
  
  // Common function selectors
  const SELECTORS: Record<string, TransactionInfo['type']> = {
    '0xa9059cbb': 'transfer', // ERC20 transfer
    '0x23b872dd': 'transfer', // ERC20 transferFrom
    '0x095ea7b3': 'approve',  // ERC20 approve
    '0x38ed1739': 'swap',     // Uniswap swapExactTokensForTokens
    '0x7ff36ab5': 'swap',     // Uniswap swapExactETHForTokens
    '0x18cbafe5': 'swap',     // Uniswap swapExactTokensForETH
    '0x5c11d795': 'swap',     // Uniswap V3 exact input
    '0xc04b8d59': 'swap',     // Uniswap V3 exact input single
  };

  return SELECTORS[selector] || 'contract';
}

// ============================================================================
// Gas Estimation
// ============================================================================

async function estimateGas(chain: string, from: string, to: string, value?: string, data?: string): Promise<{
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}> {
  try {
    // Get current gas prices
    const feeHistory = await jsonRpcCall(chain, 'eth_feeHistory', [4, 'latest', [25, 50, 75]]) as any;
    
    const baseFee = parseInt(feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1], 16);
    const priorityFees = feeHistory.reward.flat().map((f: string) => parseInt(f, 16));
    const avgPriorityFee = priorityFees.reduce((a: number, b: number) => a + b, 0) / priorityFees.length;
    
    // Estimate gas limit
    const txParams: any = { from, to };
    if (value) txParams.value = value.startsWith('0x') ? value : `0x${parseInt(value).toString(16)}`;
    if (data) txParams.data = data;
    
    let gasLimit = '21000'; // Default for simple transfers
    try {
      const estimatedGas = await jsonRpcCall(chain, 'eth_estimateGas', [txParams]) as string;
      gasLimit = Math.ceil(parseInt(estimatedGas, 16) * 1.2).toString(); // Add 20% buffer
    } catch {
      // Use default if estimation fails
    }
    
    return {
      gasLimit,
      maxFeePerGas: (baseFee * 2).toString(),
      maxPriorityFeePerGas: Math.ceil(avgPriorityFee).toString(),
    };
  } catch (error) {
    console.error('[API] Gas estimation error:', error);
    // Return defaults
    return {
      gasLimit: '21000',
      maxFeePerGas: (30 * 1e9).toString(),
      maxPriorityFeePerGas: (2 * 1e9).toString(),
    };
  }
}

// ============================================================================
// GET - Get Transaction History
// ============================================================================

async function listHandler(request: NextRequest, ctx: RequestContext) {
  const rawQuery = parseQuery(request, TransactionsQuerySchema);
  const query = parseTransactionsParams(rawQuery);
  
  try {
    const { transactions, total } = await fetchTransactionHistory(
      query.address,
      query.chain,
      query.page,
      query.limit
    );
    
    // Filter by type if specified
    let filtered = transactions;
    if (query.type !== 'all') {
      filtered = filtered.filter((tx) => tx.type === query.type);
    }
    
    // Filter by status if specified
    if (query.status !== 'all') {
      filtered = filtered.filter((tx) => tx.status === query.status);
    }
    
    const totalPages = Math.ceil(total / query.limit);
    
    const response = createResponse({
      address: query.address,
      chain: query.chain,
      transactions: filtered,
    }, {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrevious: query.page > 1,
      },
    });
    
    // Cache for 30 seconds
    setCacheHeaders(response, { maxAge: 30, staleWhileRevalidate: 60, private: true });
    
    return response;
  } catch (error) {
    console.error('[API] Transaction list error:', error);
    return createErrorResponse(error);
  }
}

// ============================================================================
// POST - Build Transaction
// ============================================================================

async function buildHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, BuildTransactionSchema);
  
  try {
    // Get current nonce
    const nonce = await jsonRpcCall(body.chain, 'eth_getTransactionCount', [body.from, 'pending']) as string;
    
    // Estimate gas
    const gasParams = await estimateGas(body.chain, body.from, body.to, body.value, body.data);
    
    // Get ETH price for USD estimation
    let ethPrice = 2500;
    try {
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const priceData = await priceRes.json();
      ethPrice = priceData.ethereum?.usd || 2500;
    } catch {
      // Use default
    }
    
    const gasLimit = parseInt(body.gasLimit || gasParams.gasLimit);
    const maxFeePerGas = parseInt(body.maxFeePerGas || gasParams.maxFeePerGas);
    const estimatedGasEth = (gasLimit * maxFeePerGas) / 1e18;
    
    const response: TransactionBuildResponse = {
      transaction: {
        to: body.to,
        value: body.value || '0',
        data: body.data || '0x',
        chainId: CHAIN_IDS[body.chain] || 1,
        gasLimit: gasLimit.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: body.maxPriorityFeePerGas || gasParams.maxPriorityFeePerGas,
        nonce: parseInt(nonce, 16),
      },
      estimatedGas: {
        usd: parseFloat((estimatedGasEth * ethPrice).toFixed(2)),
        native: estimatedGasEth.toFixed(6),
      },
      warnings: [],
    };
    
    // Add warnings if applicable
    const valueWei = parseFloat(body.value || '0');
    if (valueWei > 1e18) {
      response.warnings.push('Large transaction value detected. Please verify the amount.');
    }
    
    if (body.data && body.data.length > 10) {
      response.warnings.push('This is a contract interaction. Please review the transaction details carefully.');
    }
    
    return createResponse(response, {
      meta: { requestId: ctx.requestId },
    });
  } catch (error) {
    console.error('[API] Transaction build error:', error);
    return createErrorResponse(error);
  }
}

export const GET = withHandler(listHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});

export const POST = withHandler(buildHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
