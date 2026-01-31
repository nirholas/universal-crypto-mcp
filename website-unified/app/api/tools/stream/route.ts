/**
 * MCP Tool Streaming Execution API Route
 * POST /api/tools/stream - Execute tool with streaming output
 * 
 * Real implementation using actual blockchain/API calls
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createRequestContext } from '@/lib/api/handler';

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================================================
// Request Schema
// ============================================================================

const StreamRequestSchema = z.object({
  toolId: z.string().min(1).max(100),
  parameters: z.record(z.unknown()),
  options: z.object({
    timeout: z.number().int().min(1000).max(120000).optional().default(60000),
  }).optional().default({}),
});

// ============================================================================
// Real API Helpers
// ============================================================================

async function fetchEthBalance(address: string, chain: string = 'ethereum'): Promise<{ balance: string; formatted: string }> {
  const rpcUrls: Record<string, string> = {
    ethereum: 'https://eth.llamarpc.com',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
    polygon: 'https://polygon-rpc.com',
    base: 'https://mainnet.base.org',
    optimism: 'https://mainnet.optimism.io',
  };

  const rpcUrl = rpcUrls[chain] || rpcUrls.ethereum;
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1,
    }),
  });

  const data = await response.json();
  const balanceWei = BigInt(data.result || '0');
  const formatted = (Number(balanceWei) / 1e18).toFixed(4);
  
  return { balance: balanceWei.toString(), formatted };
}

async function fetchCoinGeckoPrice(coinId: string): Promise<{ price: number; change24h: number }> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
    { headers: { 'Accept': 'application/json' } }
  );
  
  const data = await response.json();
  const coinData = data[coinId] || {};
  
  return {
    price: coinData.usd || 0,
    change24h: coinData.usd_24h_change || 0,
  };
}

async function fetchContractInfo(address: string): Promise<{ verified: boolean; name?: string; compiler?: string }> {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    const data = await response.json();
    const result = data.result?.[0] || {};
    
    return {
      verified: result.ABI !== 'Contract source code not verified',
      name: result.ContractName || undefined,
      compiler: result.CompilerVersion || undefined,
    };
  } catch {
    return { verified: false };
  }
}

// ============================================================================
// Streaming Tools
// ============================================================================

interface StreamingTool {
  validate: (params: Record<string, unknown>) => boolean;
  stream: (params: Record<string, unknown>, emit: (data: StreamEvent) => void) => Promise<void>;
}

interface StreamEvent {
  type: 'progress' | 'data' | 'complete' | 'error';
  progress?: number;
  message?: string;
  data?: unknown;
  error?: string;
}

const STREAMING_TOOLS: Record<string, StreamingTool> = {
  'analyze-portfolio': {
    validate: (params) => typeof params.address === 'string',
    stream: async (params, emit) => {
      const address = params.address as string;
      const chains = ['ethereum', 'arbitrum', 'polygon', 'base', 'optimism'];
      
      emit({ type: 'progress', progress: 5, message: 'Starting portfolio analysis...' });
      
      // Fetch balances from all chains in parallel
      emit({ type: 'progress', progress: 10, message: 'Fetching multi-chain balances...' });
      
      const balanceResults = await Promise.allSettled(
        chains.map(chain => fetchEthBalance(address, chain).then(b => ({ chain, ...b })))
      );
      
      const balances: Array<{ chain: string; balance: string; formatted: string }> = [];
      for (const result of balanceResults) {
        if (result.status === 'fulfilled') {
          balances.push(result.value);
        }
      }
      
      emit({ type: 'progress', progress: 35, message: 'Fetching token prices...' });
      
      // Fetch current prices for native tokens
      const priceResults = await Promise.allSettled([
        fetchCoinGeckoPrice('ethereum'),
        fetchCoinGeckoPrice('matic-network'),
      ]);
      
      const ethPrice = priceResults[0].status === 'fulfilled' ? priceResults[0].value.price : 0;
      const maticPrice = priceResults[1].status === 'fulfilled' ? priceResults[1].value.price : 0;
      
      emit({ type: 'progress', progress: 60, message: 'Calculating portfolio value...' });
      
      // Calculate total value
      let totalValue = 0;
      const tokenHoldings = balances.map(b => {
        const price = b.chain === 'polygon' ? maticPrice : ethPrice;
        const value = parseFloat(b.formatted) * price;
        totalValue += value;
        return {
          chain: b.chain,
          symbol: b.chain === 'polygon' ? 'MATIC' : 'ETH',
          balance: b.formatted,
          usdValue: value,
        };
      });
      
      emit({ type: 'progress', progress: 80, message: 'Generating insights...' });
      
      // Generate recommendations based on portfolio
      const recommendations: string[] = [];
      if (totalValue > 10000) {
        recommendations.push('Consider diversifying across more L2 chains for lower gas fees');
      }
      if (balances.some(b => parseFloat(b.formatted) > 5)) {
        recommendations.push('Large holdings detected - consider hardware wallet for security');
      }
      if (tokenHoldings.filter(t => t.usdValue > 0).length < 3) {
        recommendations.push('Portfolio is concentrated - consider spreading across more chains');
      }
      
      emit({ type: 'progress', progress: 95, message: 'Finalizing report...' });
      
      emit({
        type: 'complete',
        progress: 100,
        data: {
          address,
          totalValue: Math.round(totalValue * 100) / 100,
          tokens: tokenHoldings.filter(t => t.usdValue > 0),
          chainsAnalyzed: chains.length,
          recommendations: recommendations.length > 0 
            ? recommendations 
            : ['Portfolio looks well-balanced'],
          timestamp: new Date().toISOString(),
        },
      });
    },
  },
  'scan-contract': {
    validate: (params) => typeof params.address === 'string',
    stream: async (params, emit) => {
      const address = params.address as string;
      
      emit({ type: 'progress', progress: 10, message: 'Fetching contract metadata...' });
      
      // Fetch contract info from Etherscan
      const contractInfo = await fetchContractInfo(address);
      
      emit({ type: 'progress', progress: 30, message: 'Checking verification status...' });
      
      // Fetch contract bytecode size
      let bytecodeSize = 0;
      try {
        const response = await fetch('https://eth.llamarpc.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: [address, 'latest'],
            id: 1,
          }),
        });
        const data = await response.json();
        bytecodeSize = ((data.result?.length || 2) - 2) / 2; // Convert hex to bytes
      } catch {
        // Ignore errors
      }
      
      emit({ type: 'progress', progress: 50, message: 'Analyzing contract patterns...' });
      
      // Calculate security score based on real data
      let score = 50;
      const findings: Array<{ severity: string; title: string; description: string }> = [];
      
      if (contractInfo.verified) {
        score += 25;
        findings.push({
          severity: 'info',
          title: 'Contract is verified',
          description: 'Source code is publicly available and matches bytecode',
        });
      } else {
        findings.push({
          severity: 'warning',
          title: 'Contract not verified',
          description: 'Source code is not publicly available - use with caution',
        });
      }
      
      if (contractInfo.name) {
        score += 10;
        findings.push({
          severity: 'info',
          title: `Contract: ${contractInfo.name}`,
          description: contractInfo.compiler ? `Compiled with ${contractInfo.compiler}` : 'Known contract',
        });
      }
      
      if (bytecodeSize > 24000) {
        findings.push({
          severity: 'info',
          title: 'Large contract',
          description: `Bytecode size: ${bytecodeSize} bytes - complex functionality`,
        });
      }
      
      emit({ type: 'progress', progress: 80, message: 'Generating security report...' });
      
      emit({
        type: 'complete',
        progress: 100,
        data: {
          address,
          score: Math.min(score, 100),
          riskLevel: score > 75 ? 'low' : score > 50 ? 'medium' : 'high',
          verified: contractInfo.verified,
          contractName: contractInfo.name,
          bytecodeSize,
          findings,
          timestamp: new Date().toISOString(),
        },
      });
    },
  },
  'batch-price-fetch': {
    validate: (params) => Array.isArray(params.tokens),
    stream: async (params, emit) => {
      const tokens = params.tokens as string[];
      
      // Map symbols to CoinGecko IDs
      const symbolToId: Record<string, string> = {
        ETH: 'ethereum', BTC: 'bitcoin', SOL: 'solana', 
        ARB: 'arbitrum', OP: 'optimism', MATIC: 'matic-network',
        AVAX: 'avalanche-2', BNB: 'binancecoin', USDC: 'usd-coin',
        USDT: 'tether', LINK: 'chainlink', UNI: 'uniswap',
        AAVE: 'aave', CRV: 'curve-dao-token', MKR: 'maker',
      };
      
      const results: Array<{ symbol: string; price: number; change24h: number }> = [];
      
      for (let i = 0; i < tokens.length; i++) {
        const symbol = tokens[i].toUpperCase();
        const coinId = symbolToId[symbol];
        
        if (coinId) {
          try {
            const priceData = await fetchCoinGeckoPrice(coinId);
            results.push({
              symbol,
              price: priceData.price,
              change24h: priceData.change24h,
            });
          } catch {
            results.push({ symbol, price: 0, change24h: 0 });
          }
        } else {
          results.push({ symbol, price: 0, change24h: 0 });
        }
        
        emit({
          type: 'data',
          progress: Math.floor(((i + 1) / tokens.length) * 95),
          message: `Fetched ${symbol}`,
          data: results[results.length - 1],
        });
      }
      
      emit({
        type: 'complete',
        progress: 100,
        data: { prices: results, timestamp: Date.now() },
      });
    },
  },
};

// ============================================================================
// SSE Handler
// ============================================================================

export async function POST(request: NextRequest) {
  const ctx = createRequestContext(request);
  
  // Parse and validate request
  let body;
  try {
    body = await request.json();
    body = StreamRequestSchema.parse(body);
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request body' },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const { toolId, parameters, options } = body;
  
  // Check if tool exists
  const tool = STREAMING_TOOLS[toolId];
  if (!tool) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: `Streaming tool '${toolId}' not found` },
      }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Validate parameters
  if (!tool.validate(parameters)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters' },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        const data = JSON.stringify(event);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };
      
      try {
        // Send initial event
        emit({
          type: 'progress',
          progress: 0,
          message: 'Starting execution...',
        });
        
        // Execute with timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), options.timeout);
        });
        
        await Promise.race([
          tool.stream(parameters, emit),
          timeoutPromise,
        ]);
        
      } catch (error) {
        emit({
          type: 'error',
          error: error instanceof Error ? error.message : 'Execution failed',
        });
      } finally {
        controller.close();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Request-Id': ctx.requestId,
    },
  });
}
