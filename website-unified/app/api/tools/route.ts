/**
 * MCP Tools Catalog API Route
 * GET /api/tools - List all available MCP tools
 * 
 * Real implementation using tool data from lib/playground
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  paginate,
  setCacheHeaders,
} from '@/lib/api';
import type { Tool, Category } from '@/lib/api';
import { SAMPLE_TOOLS } from '@/lib/playground/tools-data';
import { TOOL_CATEGORIES as PLAYGROUND_CATEGORIES } from '@/lib/playground/categories';

export const runtime = 'edge';

// ============================================================================
// Query Schema
// ============================================================================

const ToolsQuerySchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  premium: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'category', 'popularity', 'newest']).default('name'),
});

interface ToolsQueryParams {
  category?: string;
  subcategory?: string;
  search?: string;
  tag?: string;
  premium?: string;
  page: number;
  limit: number;
  sort: 'name' | 'category' | 'popularity' | 'newest';
}

function parseToolsQuery(request: NextRequest): ToolsQueryParams {
  const url = new URL(request.url);
  const rawParams = Object.fromEntries(url.searchParams);
  const parsed = ToolsQuerySchema.parse(rawParams);
  return parsed;
}

// ============================================================================
// Transform Playground Tools to API Format
// ============================================================================

function transformToApiTool(tool: typeof SAMPLE_TOOLS[number]): Tool {
  // Map playground category to simplified category
  const categoryMap: Record<string, string> = {
    'blockchain-evm': 'wallet',
    'blockchain-solana': 'wallet',
    'blockchain-multichain': 'wallet',
    'defi-lending': 'defi',
    'defi-dex': 'defi',
    'defi-staking': 'defi',
    'defi-yield': 'defi',
    'trading-cex': 'trading',
    'trading-bots': 'trading',
    'trading-signals': 'trading',
    'market-data-prices': 'analytics',
    'market-data-analytics': 'analytics',
    'market-data-onchain': 'analytics',
    'wallets-management': 'wallet',
    'wallets-signing': 'wallet',
    'wallets-ens': 'wallet',
    'nft-trading': 'nft',
    'nft-analytics': 'nft',
    'nft-metadata': 'nft',
    'security-audit': 'security',
    'security-scanning': 'security',
    'security-monitoring': 'security',
    'ai-agents-frameworks': 'analytics',
    'ai-agents-orchestration': 'analytics',
    'infrastructure': 'wallet',
    'payments': 'defi',
    'social': 'analytics',
    'governance': 'governance',
    'analytics': 'analytics',
  };

  return {
    id: tool.id,
    name: tool.name,
    description: tool.description,
    category: categoryMap[tool.category] || 'wallet',
    version: tool.version,
    tags: tool.tags,
    premium: tool.pricing?.type === 'paid' || tool.pricing?.type === 'credits',
    deprecated: tool.deprecated || false,
  };
}

// ============================================================================
// Generate Categories from Real Tools
// ============================================================================

function getToolCategories(): Category[] {
  // Aggregate tool counts by simplified category
  const categoryCounts: Record<string, number> = {};
  SAMPLE_TOOLS.forEach(tool => {
    const apiTool = transformToApiTool(tool);
    categoryCounts[apiTool.category] = (categoryCounts[apiTool.category] || 0) + 1;
  });

  // Define categories with real counts
  const categories: Category[] = [
    { id: 'wallet', name: 'Wallet', description: 'Wallet management, balance, and blockchain tools', icon: 'wallet', count: categoryCounts['wallet'] || 0 },
    { id: 'defi', name: 'DeFi', description: 'DeFi protocol interactions - lending, DEX, staking', icon: 'chart', count: categoryCounts['defi'] || 0 },
    { id: 'nft', name: 'NFT', description: 'NFT trading, analytics, and metadata', icon: 'image', count: categoryCounts['nft'] || 0 },
    { id: 'trading', name: 'Trading', description: 'CEX trading, bots, and signals', icon: 'trending', count: categoryCounts['trading'] || 0 },
    { id: 'analytics', name: 'Analytics', description: 'Market data, on-chain analytics, and AI tools', icon: 'bar-chart', count: categoryCounts['analytics'] || 0 },
    { id: 'security', name: 'Security', description: 'Security auditing, scanning, and monitoring', icon: 'shield', count: categoryCounts['security'] || 0 },
    { id: 'governance', name: 'Governance', description: 'DAO and governance tools', icon: 'vote', count: categoryCounts['governance'] || 0 },
  ];

  return categories.filter(c => c.count > 0);
}

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest) {
  const query = parseToolsQuery(request);
  
  // Transform all tools from playground to API format
  let allTools = SAMPLE_TOOLS.map(transformToApiTool);
  
  // Filter tools
  if (query.category) {
    allTools = allTools.filter((t) => t.category === query.category);
  }
  
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    allTools = allTools.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some((tag: string) => tag.includes(searchLower))
    );
  }
  
  if (query.tag) {
    allTools = allTools.filter((t) => t.tags.includes(query.tag!));
  }
  
  if (query.premium !== undefined) {
    const isPremium = query.premium === 'true';
    allTools = allTools.filter((t) => t.premium === isPremium);
  }
  
  // Sort
  switch (query.sort) {
    case 'name':
      allTools.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'category':
      allTools.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'newest':
      allTools.reverse();
      break;
    // 'popularity' - tools are already in a reasonable order
  }
  
  // Paginate
  const { items: tools, meta } = paginate(allTools, query.page, query.limit);
  
  const response = createResponse({
    tools,
    categories: getToolCategories(),
    totalTools: SAMPLE_TOOLS.length,
  }, { meta });
  
  // Cache for 5 minutes
  setCacheHeaders(response, { maxAge: 300, staleWhileRevalidate: 600 });
  
  return response;
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
