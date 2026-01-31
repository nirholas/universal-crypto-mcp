/**
 * Agents API Route
 * GET /api/agents - List all agents
 * POST /api/agents - Create a new agent
 * 
 * Integrates with @universal-crypto-mcp/agents package
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// ============================================================================
// Types from @universal-crypto-mcp/agents
// ============================================================================

interface AgentTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description?: string }>;
    required?: string[];
  };
}

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  tools: string[]; // Tool IDs
  walletAddress: string | null;
  chains: string[];
  memory: 'none' | 'session' | 'persistent';
  maxIterations: number;
  verbose: boolean;
  status: 'active' | 'paused' | 'disabled';
  createdAt: string;
  updatedAt: string;
  lastExecutedAt: string | null;
  executionCount: number;
  metadata: Record<string, unknown>;
}

// ============================================================================
// Schemas
// ============================================================================

const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  model: z.enum(['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'custom']).default('gpt-4'),
  systemPrompt: z.string().max(10000).optional().default('You are a helpful crypto assistant.'),
  tools: z.array(z.string()).optional().default([]),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional().nullable(),
  chains: z.array(z.string()).optional().default(['ethereum']),
  memory: z.enum(['none', 'session', 'persistent']).optional().default('session'),
  maxIterations: z.number().int().min(1).max(100).optional().default(10),
  verbose: z.boolean().optional().default(false),
  metadata: z.record(z.unknown()).optional().default({}),
});

const QuerySchema = z.object({
  status: z.enum(['active', 'paused', 'disabled', 'all']).optional().default('all'),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ============================================================================
// In-Memory Store (In production, use a database)
// ============================================================================

const agentStore = new Map<string, AgentConfig>();

// Available tools that agents can use
const AVAILABLE_TOOLS: AgentTool[] = [
  {
    name: 'getBalance',
    description: 'Get wallet balance for an address',
    parameters: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address' },
        chain: { type: 'string', description: 'Chain name (ethereum, base, etc.)' },
      },
      required: ['address'],
    },
  },
  {
    name: 'getTokenPrice',
    description: 'Get current price for a token',
    parameters: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Token symbol (ETH, BTC, etc.)' },
        address: { type: 'string', description: 'Token contract address' },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'swap',
    description: 'Execute a token swap',
    parameters: {
      type: 'object',
      properties: {
        fromToken: { type: 'string', description: 'Source token address' },
        toToken: { type: 'string', description: 'Destination token address' },
        amount: { type: 'string', description: 'Amount to swap' },
        slippage: { type: 'number', description: 'Slippage tolerance (%)' },
      },
      required: ['fromToken', 'toToken', 'amount'],
    },
  },
  {
    name: 'transfer',
    description: 'Transfer tokens to an address',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient address' },
        token: { type: 'string', description: 'Token address (or native)' },
        amount: { type: 'string', description: 'Amount to transfer' },
      },
      required: ['to', 'amount'],
    },
  },
  {
    name: 'getDefiPositions',
    description: 'Get DeFi positions for a wallet',
    parameters: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address' },
        protocols: { type: 'array', description: 'Filter by protocols' },
      },
      required: ['address'],
    },
  },
  {
    name: 'analyzeTrends',
    description: 'Analyze market trends for tokens',
    parameters: {
      type: 'object',
      properties: {
        tokens: { type: 'array', description: 'Token symbols to analyze' },
        timeframe: { type: 'string', description: 'Timeframe (1h, 24h, 7d, 30d)' },
      },
      required: ['tokens'],
    },
  },
  {
    name: 'setAlert',
    description: 'Set a price alert',
    parameters: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token symbol' },
        condition: { type: 'string', description: 'Alert condition (above, below)' },
        price: { type: 'number', description: 'Target price' },
      },
      required: ['token', 'condition', 'price'],
    },
  },
  {
    name: 'executeStrategy',
    description: 'Execute a predefined trading strategy',
    parameters: {
      type: 'object',
      properties: {
        strategy: { type: 'string', description: 'Strategy name' },
        params: { type: 'object', description: 'Strategy parameters' },
      },
      required: ['strategy'],
    },
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function generateAgentId(): string {
  return `agent_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// GET Handler - List agents
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Special endpoint to get available tools
    if (searchParams.get('tools') === 'list') {
      return NextResponse.json({
        success: true,
        data: {
          tools: AVAILABLE_TOOLS,
          total: AVAILABLE_TOOLS.length,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const query = parseResult.data;
    
    // Get all agents
    let agents = Array.from(agentStore.values());

    // Filter by status
    if (query.status !== 'all') {
      agents = agents.filter((a) => a.status === query.status);
    }

    // Filter by search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.name.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    agents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = agents.length;
    const offset = (query.page - 1) * query.limit;
    const paginatedAgents = agents.slice(offset, offset + query.limit);

    return NextResponse.json({
      success: true,
      data: {
        agents: paginatedAgents,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
          hasMore: offset + query.limit < total,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Agents GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch agents',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Create agent
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parseResult = CreateAgentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid agent configuration',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const now = new Date().toISOString();

    // Validate tools exist
    const validToolNames = AVAILABLE_TOOLS.map((t) => t.name);
    const invalidTools = data.tools.filter((t) => !validToolNames.includes(t));
    if (invalidTools.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOOLS',
            message: `Unknown tools: ${invalidTools.join(', ')}`,
            details: { validTools: validToolNames },
          },
        },
        { status: 400 }
      );
    }

    // Create agent
    const agent: AgentConfig = {
      id: generateAgentId(),
      name: data.name,
      description: data.description,
      model: data.model,
      systemPrompt: data.systemPrompt,
      tools: data.tools,
      walletAddress: data.walletAddress || null,
      chains: data.chains,
      memory: data.memory,
      maxIterations: data.maxIterations,
      verbose: data.verbose,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastExecutedAt: null,
      executionCount: 0,
      metadata: data.metadata,
    };

    agentStore.set(agent.id, agent);

    return NextResponse.json(
      {
        success: true,
        data: {
          agent,
        },
        meta: {
          timestamp: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Agents POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create agent',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE Handler - Delete multiple agents (bulk)
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body as { ids: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Agent IDs array is required',
          },
        },
        { status: 400 }
      );
    }

    const deleted: string[] = [];
    const notFound: string[] = [];

    for (const id of ids) {
      if (agentStore.has(id)) {
        agentStore.delete(id);
        deleted.push(id);
      } else {
        notFound.push(id);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        deleted,
        notFound,
        deletedCount: deleted.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Agents DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete agents',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Export store for use by other routes
// ============================================================================

export { agentStore, AVAILABLE_TOOLS };
export type { AgentConfig, AgentTool };
