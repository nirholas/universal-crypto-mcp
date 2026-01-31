/**
 * MCP Tools Catalog API Route
 * GET /api/tools - List all available MCP tools
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  parseQuery,
  paginate,
  setCacheHeaders,
} from '@/lib/api';
import type { Tool, Category, APIResponseMeta } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Query Schema
// ============================================================================

const ToolsQuerySchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  premium: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'category', 'popularity', 'newest']).default('name'),
});

type ToolsQuery = z.infer<typeof ToolsQuerySchema>;

// ============================================================================
// Mock Tool Catalog
// ============================================================================

const TOOL_CATEGORIES: Category[] = [
  { id: 'wallet', name: 'Wallet', description: 'Wallet management and balance tools', icon: 'wallet', count: 12 },
  { id: 'defi', name: 'DeFi', description: 'DeFi protocol interactions', icon: 'chart', count: 18 },
  { id: 'nft', name: 'NFT', description: 'NFT management and discovery', icon: 'image', count: 8 },
  { id: 'trading', name: 'Trading', description: 'Trading and market analysis', icon: 'trending', count: 15 },
  { id: 'analytics', name: 'Analytics', description: 'On-chain analytics and data', icon: 'bar-chart', count: 10 },
  { id: 'bridge', name: 'Bridge', description: 'Cross-chain bridging', icon: 'git-branch', count: 6 },
  { id: 'governance', name: 'Governance', description: 'DAO and governance tools', icon: 'vote', count: 4 },
  { id: 'security', name: 'Security', description: 'Security analysis tools', icon: 'shield', count: 7 },
];

const MOCK_TOOLS: Tool[] = [
  // Wallet tools
  { id: 'get-balance', name: 'Get Balance', description: 'Get native token balance for an address', category: 'wallet', version: '1.0.0', tags: ['balance', 'native'], premium: false, deprecated: false },
  { id: 'get-token-balance', name: 'Get Token Balance', description: 'Get ERC-20 token balance', category: 'wallet', version: '1.0.0', tags: ['balance', 'erc20'], premium: false, deprecated: false },
  { id: 'get-nft-balance', name: 'Get NFT Balance', description: 'Get NFT holdings for an address', category: 'wallet', version: '1.0.0', tags: ['nft', 'balance'], premium: false, deprecated: false },
  { id: 'transfer-tokens', name: 'Transfer Tokens', description: 'Build a token transfer transaction', category: 'wallet', version: '1.0.0', tags: ['transfer', 'transaction'], premium: false, deprecated: false },
  { id: 'approve-token', name: 'Approve Token', description: 'Approve token spending', category: 'wallet', version: '1.0.0', tags: ['approve', 'allowance'], premium: false, deprecated: false },
  { id: 'revoke-approval', name: 'Revoke Approval', description: 'Revoke token approval', category: 'wallet', version: '1.0.0', tags: ['revoke', 'security'], premium: false, deprecated: false },
  { id: 'get-tx-history', name: 'Get Transaction History', description: 'Get transaction history for an address', category: 'wallet', version: '1.0.0', tags: ['history', 'transactions'], premium: false, deprecated: false },
  { id: 'resolve-ens', name: 'Resolve ENS', description: 'Resolve ENS name to address', category: 'wallet', version: '1.0.0', tags: ['ens', 'dns'], premium: false, deprecated: false },
  { id: 'simulate-tx', name: 'Simulate Transaction', description: 'Simulate transaction execution', category: 'wallet', version: '1.0.0', tags: ['simulate', 'tenderly'], premium: true, deprecated: false },
  
  // DeFi tools
  { id: 'get-token-price', name: 'Get Token Price', description: 'Get current token price', category: 'defi', version: '1.0.0', tags: ['price', 'market'], premium: false, deprecated: false },
  { id: 'get-gas-price', name: 'Get Gas Price', description: 'Get current gas prices', category: 'defi', version: '1.0.0', tags: ['gas', 'fees'], premium: false, deprecated: false },
  { id: 'get-dex-quote', name: 'Get DEX Quote', description: 'Get swap quote from DEX aggregators', category: 'defi', version: '1.0.0', tags: ['swap', 'dex', 'quote'], premium: false, deprecated: false },
  { id: 'execute-swap', name: 'Execute Swap', description: 'Build a swap transaction', category: 'defi', version: '1.0.0', tags: ['swap', 'dex'], premium: false, deprecated: false },
  { id: 'get-pool-info', name: 'Get Pool Info', description: 'Get liquidity pool information', category: 'defi', version: '1.0.0', tags: ['pool', 'liquidity'], premium: false, deprecated: false },
  { id: 'get-yield-opportunities', name: 'Get Yield Opportunities', description: 'Find yield farming opportunities', category: 'defi', version: '1.0.0', tags: ['yield', 'farming'], premium: true, deprecated: false },
  { id: 'get-lending-rates', name: 'Get Lending Rates', description: 'Get lending protocol rates', category: 'defi', version: '1.0.0', tags: ['lending', 'apy'], premium: false, deprecated: false },
  { id: 'deposit-lending', name: 'Deposit to Lending', description: 'Build deposit transaction for lending', category: 'defi', version: '1.0.0', tags: ['lending', 'deposit'], premium: false, deprecated: false },
  { id: 'borrow-asset', name: 'Borrow Asset', description: 'Build borrow transaction', category: 'defi', version: '1.0.0', tags: ['lending', 'borrow'], premium: false, deprecated: false },
  { id: 'get-staking-info', name: 'Get Staking Info', description: 'Get staking opportunities', category: 'defi', version: '1.0.0', tags: ['staking', 'rewards'], premium: false, deprecated: false },
  
  // NFT tools
  { id: 'get-nft-metadata', name: 'Get NFT Metadata', description: 'Get NFT metadata and attributes', category: 'nft', version: '1.0.0', tags: ['metadata', 'attributes'], premium: false, deprecated: false },
  { id: 'get-collection-info', name: 'Get Collection Info', description: 'Get NFT collection information', category: 'nft', version: '1.0.0', tags: ['collection', 'floor'], premium: false, deprecated: false },
  { id: 'get-nft-sales', name: 'Get NFT Sales', description: 'Get recent NFT sales', category: 'nft', version: '1.0.0', tags: ['sales', 'history'], premium: false, deprecated: false },
  { id: 'transfer-nft', name: 'Transfer NFT', description: 'Build NFT transfer transaction', category: 'nft', version: '1.0.0', tags: ['transfer', 'erc721'], premium: false, deprecated: false },
  { id: 'list-nft', name: 'List NFT', description: 'List NFT for sale', category: 'nft', version: '1.0.0', tags: ['list', 'marketplace'], premium: false, deprecated: false },
  
  // Trading tools
  { id: 'get-market-overview', name: 'Get Market Overview', description: 'Get crypto market overview', category: 'trading', version: '1.0.0', tags: ['market', 'overview'], premium: false, deprecated: false },
  { id: 'get-trending-tokens', name: 'Get Trending Tokens', description: 'Get trending tokens', category: 'trading', version: '1.0.0', tags: ['trending', 'discovery'], premium: false, deprecated: false },
  { id: 'get-token-analysis', name: 'Get Token Analysis', description: 'Comprehensive token analysis', category: 'trading', version: '1.0.0', tags: ['analysis', 'research'], premium: true, deprecated: false },
  { id: 'get-orderbook', name: 'Get Orderbook', description: 'Get DEX orderbook', category: 'trading', version: '1.0.0', tags: ['orderbook', 'depth'], premium: false, deprecated: false },
  { id: 'place-limit-order', name: 'Place Limit Order', description: 'Place a limit order', category: 'trading', version: '1.0.0', tags: ['order', 'limit'], premium: false, deprecated: false },
  
  // Analytics tools
  { id: 'get-whale-activity', name: 'Get Whale Activity', description: 'Track whale wallet activity', category: 'analytics', version: '1.0.0', tags: ['whale', 'tracking'], premium: true, deprecated: false },
  { id: 'get-token-holders', name: 'Get Token Holders', description: 'Get token holder distribution', category: 'analytics', version: '1.0.0', tags: ['holders', 'distribution'], premium: false, deprecated: false },
  { id: 'get-smart-money', name: 'Get Smart Money', description: 'Track smart money movements', category: 'analytics', version: '1.0.0', tags: ['smart-money', 'tracking'], premium: true, deprecated: false },
  { id: 'get-on-chain-metrics', name: 'Get On-Chain Metrics', description: 'On-chain analytics metrics', category: 'analytics', version: '1.0.0', tags: ['metrics', 'on-chain'], premium: false, deprecated: false },
  
  // Bridge tools
  { id: 'get-bridge-quote', name: 'Get Bridge Quote', description: 'Get cross-chain bridge quote', category: 'bridge', version: '1.0.0', tags: ['bridge', 'quote'], premium: false, deprecated: false },
  { id: 'execute-bridge', name: 'Execute Bridge', description: 'Build bridge transaction', category: 'bridge', version: '1.0.0', tags: ['bridge', 'cross-chain'], premium: false, deprecated: false },
  { id: 'get-bridge-status', name: 'Get Bridge Status', description: 'Check bridge transaction status', category: 'bridge', version: '1.0.0', tags: ['bridge', 'status'], premium: false, deprecated: false },
  
  // Security tools
  { id: 'check-contract', name: 'Check Contract', description: 'Analyze smart contract security', category: 'security', version: '1.0.0', tags: ['audit', 'security'], premium: true, deprecated: false },
  { id: 'check-token', name: 'Check Token', description: 'Check token for scam indicators', category: 'security', version: '1.0.0', tags: ['scam', 'security'], premium: false, deprecated: false },
  { id: 'get-approvals', name: 'Get Approvals', description: 'List all token approvals', category: 'security', version: '1.0.0', tags: ['approvals', 'security'], premium: false, deprecated: false },
];

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest) {
  const query = parseQuery(request, ToolsQuerySchema);
  
  // Filter tools
  let filteredTools = [...MOCK_TOOLS];
  
  if (query.category) {
    filteredTools = filteredTools.filter((t) => t.category === query.category);
  }
  
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    filteredTools = filteredTools.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some((tag) => tag.includes(searchLower))
    );
  }
  
  if (query.tag) {
    filteredTools = filteredTools.filter((t) => t.tags.includes(query.tag!));
  }
  
  if (query.premium !== undefined) {
    filteredTools = filteredTools.filter((t) => t.premium === query.premium);
  }
  
  // Sort
  switch (query.sort) {
    case 'name':
      filteredTools.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'category':
      filteredTools.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'newest':
      filteredTools.reverse();
      break;
    // 'popularity' would use usage stats in production
  }
  
  // Paginate
  const { items: tools, meta } = paginate(filteredTools, query.page, query.limit);
  
  const response = createResponse({
    tools,
    categories: TOOL_CATEGORIES,
  }, { meta });
  
  // Cache for 5 minutes
  setCacheHeaders(response, { maxAge: 300, staleWhileRevalidate: 600 });
  
  return response;
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
