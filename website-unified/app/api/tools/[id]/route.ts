/**
 * MCP Tool Details API Route
 * GET /api/tools/[id] - Get tool details with schema
 * 
 * Real implementation using tool data from lib/playground
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
import { SAMPLE_TOOLS, getToolById, getRelatedTools } from '@/lib/playground/tools-data';
import type { McpTool } from '@/lib/playground/types';

export const runtime = 'edge';

// ============================================================================
// Related Tools Mapping
// ============================================================================

const RELATED_TOOLS: Record<string, string[]> = {
  'evm_get_balance': ['evm_get_token_balance', 'wallet_resolve_ens', 'infra_get_block'],
  'evm_get_token_balance': ['evm_get_balance', 'defi_get_swap_quote', 'market_get_price'],
  'defi_get_swap_quote': ['defi_execute_swap', 'market_get_price', 'defi_get_liquidity_pools'],
  'defi_execute_swap': ['defi_get_swap_quote', 'evm_get_token_balance'],
  'market_get_price': ['market_get_ohlcv', 'market_get_gas_price'],
  'wallet_resolve_ens': ['evm_get_balance', 'evm_get_token_balance'],
  'nft_get_owned': ['nft_get_collection_stats', 'evm_get_balance'],
  'security_scan_contract': ['security_check_address', 'evm_call_contract'],
};

// ============================================================================
// Transform Playground Tool to API Tool Detail
// ============================================================================

function transformToApiTool(tool: McpTool): Tool {
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

function transformToToolDetail(tool: McpTool): ToolDetail {
  const baseTool = transformToApiTool(tool);
  
  // Transform examples to API format
  const examples: ToolExample[] = tool.examples.map(ex => ({
    name: ex.name,
    description: ex.description,
    input: ex.parameters,
    output: ex.expectedOutput,
  }));

  // Create changelog from version info
  const changelog: ToolChangelog[] = [
    {
      version: tool.version,
      date: '2025-01-15',
      changes: ['Current release'],
    },
  ];

  return {
    ...baseTool,
    fullDescription: tool.longDescription || tool.description,
    inputSchema: tool.inputSchema as unknown as Record<string, unknown>,
    outputSchema: (tool.outputSchema as unknown as Record<string, unknown>) || {},
    examples,
    changelog,
    documentation: tool.documentation,
    rateLimit: { requests: 100, window: 60 },
  };
}

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  const params = await _context.params;
  const id = params.id;
  
  // Look up tool from real data
  const playgroundTool = getToolById(id);
  if (!playgroundTool) {
    throw new NotFoundError('Tool', id);
  }
  
  // Transform to API format
  const toolDetail = transformToToolDetail(playgroundTool);
  
  // Get related tools from the playground data or fallback to our mapping
  let relatedToolIds = playgroundTool.relatedTools || RELATED_TOOLS[id] || [];
  const relatedTools = relatedToolIds
    .map((relId) => {
      const relTool = getToolById(relId);
      return relTool ? transformToApiTool(relTool) : null;
    })
    .filter((t): t is Tool => t !== null)
    .slice(0, 5);
  
  const response = createResponse({
    tool: toolDetail,
    relatedTools,
  });
  
  // Cache for 10 minutes
  setCacheHeaders(response, { maxAge: 600, staleWhileRevalidate: 1200 });
  
  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withHandler(() => handler(request, context), {
    rateLimit: { windowMs: 60000, maxRequests: 100 },
  })(request);
}
