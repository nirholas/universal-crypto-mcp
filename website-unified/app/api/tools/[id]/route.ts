/**
 * MCP Tool Details API Route
 * GET /api/tools/[id] - Get tool details with schema
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import {
  withHandler,
  createResponse,
  NotFoundError,
  setCacheHeaders,
} from '@/lib/api';
import type { ToolDetail, Tool, ToolExample, ToolChangelog } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Mock Tool Details Data
// ============================================================================

const TOOL_DETAILS: Record<string, Omit<ToolDetail, keyof Tool>> = {
  'get-balance': {
    fullDescription: `
# Get Balance

Retrieve the native token balance (ETH, MATIC, BNB, etc.) for any wallet address across multiple blockchain networks.

## Supported Networks
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base
- BSC

## Features
- Real-time balance fetching
- Multi-chain support
- USD value calculation
- Historical balance snapshots
    `.trim(),
    inputSchema: {
      type: 'object',
      required: ['address'],
      properties: {
        address: {
          type: 'string',
          pattern: '^0x[a-fA-F0-9]{40}$',
          description: 'Wallet address to check balance for',
        },
        chain: {
          type: 'string',
          enum: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'bsc'],
          default: 'ethereum',
          description: 'Blockchain network',
        },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        balance: { type: 'string', description: 'Balance in wei' },
        balanceFormatted: { type: 'string', description: 'Human-readable balance' },
        symbol: { type: 'string', description: 'Native token symbol' },
        usdValue: { type: 'number', description: 'USD value of balance' },
      },
    },
    examples: [
      {
        name: 'Basic Balance Check',
        description: 'Get ETH balance on Ethereum mainnet',
        input: { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', chain: 'ethereum' },
        output: { balance: '1234567890000000000', balanceFormatted: '1.234', symbol: 'ETH', usdValue: 3085.0 },
      },
      {
        name: 'Polygon Balance',
        description: 'Get MATIC balance on Polygon',
        input: { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', chain: 'polygon' },
        output: { balance: '5000000000000000000', balanceFormatted: '5.0', symbol: 'MATIC', usdValue: 4.5 },
      },
    ],
    changelog: [
      { version: '1.0.0', date: '2025-01-15', changes: ['Initial release', 'Multi-chain support'] },
    ],
    documentation: 'https://docs.universal-crypto-mcp.dev/tools/get-balance',
    rateLimit: { requests: 100, window: 60 },
  },
  'get-token-price': {
    fullDescription: `
# Get Token Price

Get real-time price data for any cryptocurrency token. Supports thousands of tokens across multiple networks.

## Data Sources
- CoinGecko
- CoinMarketCap
- DEX prices (Uniswap, Sushiswap)
- On-chain oracles (Chainlink)

## Features
- Real-time prices
- Price change percentages (1h, 24h, 7d)
- Volume and market cap data
- Historical price data
    `.trim(),
    inputSchema: {
      type: 'object',
      required: ['symbol'],
      properties: {
        symbol: {
          type: 'string',
          description: 'Token symbol (e.g., ETH, BTC, USDC)',
        },
        currency: {
          type: 'string',
          default: 'usd',
          description: 'Quote currency',
        },
        includeMarketData: {
          type: 'boolean',
          default: false,
          description: 'Include market cap and volume',
        },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string' },
        price: { type: 'number' },
        change24h: { type: 'number' },
        change7d: { type: 'number' },
        marketCap: { type: 'number' },
        volume24h: { type: 'number' },
      },
    },
    examples: [
      {
        name: 'ETH Price',
        description: 'Get current ETH price in USD',
        input: { symbol: 'ETH' },
        output: { symbol: 'ETH', price: 2500.0, change24h: 2.5, change7d: -1.2 },
      },
    ],
    changelog: [
      { version: '1.0.0', date: '2025-01-15', changes: ['Initial release'] },
    ],
    rateLimit: { requests: 200, window: 60 },
  },
  'get-dex-quote': {
    fullDescription: `
# Get DEX Quote

Get the best swap quote from multiple DEX aggregators including 1inch, 0x, Paraswap, and more.

## Features
- Multi-DEX aggregation
- Best price discovery
- Slippage estimation
- Gas cost estimation
- Route optimization
    `.trim(),
    inputSchema: {
      type: 'object',
      required: ['fromToken', 'toToken', 'amount'],
      properties: {
        fromToken: { type: 'string', description: 'Token to sell (address or symbol)' },
        toToken: { type: 'string', description: 'Token to buy (address or symbol)' },
        amount: { type: 'string', description: 'Amount to swap (in wei)' },
        chain: { type: 'string', default: 'ethereum' },
        slippage: { type: 'number', default: 0.5, description: 'Max slippage percentage' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        fromToken: { type: 'string' },
        toToken: { type: 'string' },
        fromAmount: { type: 'string' },
        toAmount: { type: 'string' },
        priceImpact: { type: 'number' },
        route: { type: 'array' },
        gas: { type: 'string' },
      },
    },
    examples: [
      {
        name: 'ETH to USDC swap',
        description: 'Get quote for swapping 1 ETH to USDC',
        input: { fromToken: 'ETH', toToken: 'USDC', amount: '1000000000000000000', chain: 'ethereum' },
        output: { fromAmount: '1000000000000000000', toAmount: '2500000000', priceImpact: 0.1, gas: '150000' },
      },
    ],
    changelog: [
      { version: '1.0.0', date: '2025-01-15', changes: ['Initial release'] },
    ],
    rateLimit: { requests: 50, window: 60 },
  },
};

const MOCK_TOOLS: Record<string, Tool> = {
  'get-balance': { id: 'get-balance', name: 'Get Balance', description: 'Get native token balance for an address', category: 'wallet', version: '1.0.0', tags: ['balance', 'native'], premium: false, deprecated: false },
  'get-token-price': { id: 'get-token-price', name: 'Get Token Price', description: 'Get current token price', category: 'defi', version: '1.0.0', tags: ['price', 'market'], premium: false, deprecated: false },
  'get-dex-quote': { id: 'get-dex-quote', name: 'Get DEX Quote', description: 'Get swap quote from DEX aggregators', category: 'defi', version: '1.0.0', tags: ['swap', 'dex', 'quote'], premium: false, deprecated: false },
};

const RELATED_TOOLS: Record<string, string[]> = {
  'get-balance': ['get-token-balance', 'get-nft-balance', 'get-tx-history'],
  'get-token-price': ['get-market-overview', 'get-trending-tokens', 'get-dex-quote'],
  'get-dex-quote': ['execute-swap', 'get-token-price', 'get-pool-info'],
};

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const tool = MOCK_TOOLS[id];
  if (!tool) {
    throw new NotFoundError('Tool', id);
  }
  
  const details = TOOL_DETAILS[id];
  const toolDetail: ToolDetail = {
    ...tool,
    fullDescription: details?.fullDescription || tool.description,
    inputSchema: details?.inputSchema || {},
    outputSchema: details?.outputSchema || {},
    examples: details?.examples || [],
    changelog: details?.changelog || [],
    documentation: details?.documentation,
    rateLimit: details?.rateLimit,
  };
  
  // Get related tools
  const relatedToolIds = RELATED_TOOLS[id] || [];
  const relatedTools = relatedToolIds
    .map((relId) => MOCK_TOOLS[relId])
    .filter(Boolean);
  
  const response = createResponse({
    tool: toolDetail,
    relatedTools,
  });
  
  // Cache for 10 minutes
  setCacheHeaders(response, { maxAge: 600, staleWhileRevalidate: 1200 });
  
  return response;
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
