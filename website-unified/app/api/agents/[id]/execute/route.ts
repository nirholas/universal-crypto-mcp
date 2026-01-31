/**
 * Agent Execution API Route
 * POST /api/agents/[id]/execute - Execute an agent with input
 * GET /api/agents/[id]/execute - Get execution history
 * 
 * Integrates with @universal-crypto-mcp/agents for agent execution
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================================================
// Types
// ============================================================================

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  tools: string[];
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

interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  output: unknown;
  duration: number;
  success: boolean;
  error?: string;
}

interface ExecutionLog {
  id: string;
  agentId: string;
  input: string;
  output: string;
  toolCalls: ToolCall[];
  startedAt: string;
  completedAt: string;
  duration: number;
  success: boolean;
  error: string | null;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

interface ExecutionContext {
  walletAddress: string | null;
  chain: string;
  sessionId: string | null;
}

// Shared stores (in production, use proper persistence)
const agentStore = new Map<string, AgentConfig>();
const executionLogStore = new Map<string, ExecutionLog[]>();
const sessionMemoryStore = new Map<string, Array<{ role: string; content: string }>>();

// ============================================================================
// Schemas
// ============================================================================

const ExecuteSchema = z.object({
  input: z.string().min(1).max(10000),
  context: z.object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional().nullable(),
    chain: z.string().optional().default('ethereum'),
    sessionId: z.string().optional().nullable(),
  }).optional().default({}),
  options: z.object({
    stream: z.boolean().optional().default(false),
    timeout: z.number().int().min(1000).max(120000).optional().default(30000),
    maxToolCalls: z.number().int().min(0).max(50).optional(),
  }).optional().default({}),
});

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['success', 'failed', 'all']).optional().default('all'),
});

// ============================================================================
// Tool Implementations
// ============================================================================

const toolImplementations: Record<string, (input: Record<string, unknown>, context: ExecutionContext) => Promise<unknown>> = {
  async getBalance(input, context) {
    const address = (input.address as string) || context.walletAddress;
    const chain = (input.chain as string) || context.chain || 'ethereum';
    
    if (!address) {
      throw new Error('Wallet address required');
    }

    // Call our own API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/wallets/${address}/balances?chains=${chain}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();
    return data.data;
  },

  async getTokenPrice(input) {
    const symbol = input.symbol as string;
    const address = input.address as string;

    if (address) {
      const response = await fetch(
        `https://coins.llama.fi/prices/current/ethereum:${address}`,
        { next: { revalidate: 60 } }
      );

      if (response.ok) {
        const data = await response.json();
        const key = `ethereum:${address}`;
        return data.coins?.[key] || { price: 0 };
      }
    }

    // Fallback to CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      return data[symbol.toLowerCase()] || { usd: 0 };
    }

    return { price: 0 };
  },

  async swap(input, context) {
    // Simulate swap quote (in production, call 1inch or similar)
    const fromToken = input.fromToken as string;
    const toToken = input.toToken as string;
    const amount = input.amount as string;
    const slippage = (input.slippage as number) || 0.5;

    return {
      status: 'quote',
      fromToken,
      toToken,
      fromAmount: amount,
      toAmount: '0', // Would be calculated
      priceImpact: 0.1,
      slippage,
      gasEstimate: '150000',
      message: 'Swap execution requires wallet signature - returning quote only',
    };
  },

  async transfer(input, context) {
    const to = input.to as string;
    const amount = input.amount as string;
    const token = input.token as string || 'native';

    return {
      status: 'prepared',
      to,
      amount,
      token,
      message: 'Transfer prepared - requires wallet signature to execute',
    };
  },

  async getDefiPositions(input, context) {
    const address = (input.address as string) || context.walletAddress;
    
    if (!address) {
      throw new Error('Wallet address required');
    }

    // In production, call our positions API
    return {
      positions: [],
      message: 'DeFi position tracking requires DeBank API key',
    };
  },

  async analyzeTrends(input) {
    const tokens = input.tokens as string[];
    const timeframe = (input.timeframe as string) || '24h';

    // Mock analysis (in production, use actual data)
    return {
      timeframe,
      tokens: tokens.map((t) => ({
        symbol: t,
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        sentiment: Math.random() * 100,
        momentum: (Math.random() - 0.5) * 20,
      })),
      analysis: `Market analysis for ${tokens.join(', ')} over ${timeframe}`,
    };
  },

  async setAlert(input) {
    const token = input.token as string;
    const condition = input.condition as string;
    const price = input.price as number;

    return {
      status: 'created',
      alertId: `alert_${Date.now()}`,
      token,
      condition,
      price,
      message: `Alert set: ${token} ${condition} $${price}`,
    };
  },

  async executeStrategy(input) {
    const strategy = input.strategy as string;
    const params = input.params as Record<string, unknown>;

    return {
      status: 'simulated',
      strategy,
      params,
      message: 'Strategy execution requires additional configuration',
    };
  },
};

// ============================================================================
// Execution Engine
// ============================================================================

function generateExecutionId(): string {
  return `exec_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

async function executeAgent(
  agent: AgentConfig,
  input: string,
  context: ExecutionContext,
  options: { maxToolCalls?: number }
): Promise<{ output: string; toolCalls: ToolCall[]; tokens: { prompt: number; completion: number; total: number } }> {
  const toolCalls: ToolCall[] = [];
  const maxCalls = options.maxToolCalls ?? agent.maxIterations;

  // Get session memory if applicable
  let conversationHistory: Array<{ role: string; content: string }> = [];
  if (agent.memory !== 'none' && context.sessionId) {
    conversationHistory = sessionMemoryStore.get(context.sessionId) || [];
  }

  // Simple keyword-based tool matching (in production, use LLM function calling)
  const inputLower = input.toLowerCase();
  
  // Check for tool triggers
  for (const toolName of agent.tools) {
    if (toolCalls.length >= maxCalls) break;

    const implementation = toolImplementations[toolName];
    if (!implementation) continue;

    let shouldCall = false;
    let toolInput: Record<string, unknown> = {};

    // Simple trigger matching
    switch (toolName) {
      case 'getBalance':
        if (inputLower.includes('balance') || inputLower.includes('how much')) {
          shouldCall = true;
          // Try to extract address from input
          const addressMatch = input.match(/0x[a-fA-F0-9]{40}/);
          if (addressMatch) {
            toolInput.address = addressMatch[0];
          }
        }
        break;

      case 'getTokenPrice':
        if (inputLower.includes('price') || inputLower.includes('worth') || inputLower.includes('value')) {
          shouldCall = true;
          // Try to extract token symbol
          const tokens = ['eth', 'btc', 'usdc', 'usdt', 'link', 'uni', 'aave'];
          for (const token of tokens) {
            if (inputLower.includes(token)) {
              toolInput.symbol = token;
              break;
            }
          }
        }
        break;

      case 'swap':
        if (inputLower.includes('swap') || inputLower.includes('exchange') || inputLower.includes('trade')) {
          shouldCall = true;
        }
        break;

      case 'transfer':
        if (inputLower.includes('send') || inputLower.includes('transfer')) {
          shouldCall = true;
        }
        break;

      case 'getDefiPositions':
        if (inputLower.includes('position') || inputLower.includes('defi') || inputLower.includes('lending')) {
          shouldCall = true;
        }
        break;

      case 'analyzeTrends':
        if (inputLower.includes('trend') || inputLower.includes('analysis') || inputLower.includes('market')) {
          shouldCall = true;
          toolInput.tokens = ['eth', 'btc'];
        }
        break;

      case 'setAlert':
        if (inputLower.includes('alert') || inputLower.includes('notify')) {
          shouldCall = true;
        }
        break;
    }

    if (shouldCall) {
      const startTime = Date.now();
      try {
        const result = await implementation(toolInput, context);
        toolCalls.push({
          name: toolName,
          input: toolInput,
          output: result,
          duration: Date.now() - startTime,
          success: true,
        });
      } catch (error) {
        toolCalls.push({
          name: toolName,
          input: toolInput,
          output: null,
          duration: Date.now() - startTime,
          success: false,
          error: (error as Error).message,
        });
      }
    }
  }

  // Generate response
  let output: string;
  
  if (toolCalls.length > 0) {
    const successfulCalls = toolCalls.filter((tc) => tc.success);
    if (successfulCalls.length > 0) {
      output = `I executed ${successfulCalls.length} tool(s) to help with your request:\n\n`;
      for (const tc of successfulCalls) {
        output += `**${tc.name}**: ${JSON.stringify(tc.output, null, 2)}\n\n`;
      }
    } else {
      output = `I attempted to execute tools but encountered errors:\n${toolCalls.map((tc) => `- ${tc.name}: ${tc.error}`).join('\n')}`;
    }
  } else {
    output = `I'm ${agent.name}. ${agent.description || 'How can I help you?'}\n\nYou said: "${input}"\n\nI can help with: ${agent.tools.join(', ')}.`;
  }

  // Update session memory
  if (agent.memory !== 'none' && context.sessionId) {
    conversationHistory.push(
      { role: 'user', content: input },
      { role: 'assistant', content: output }
    );
    // Keep last 20 messages
    if (conversationHistory.length > 40) {
      conversationHistory = conversationHistory.slice(-40);
    }
    sessionMemoryStore.set(context.sessionId, conversationHistory);
  }

  // Estimate tokens (simplified)
  const promptTokens = Math.ceil((agent.systemPrompt.length + input.length) / 4);
  const completionTokens = Math.ceil(output.length / 4);

  return {
    output,
    toolCalls,
    tokens: {
      prompt: promptTokens,
      completion: completionTokens,
      total: promptTokens + completionTokens,
    },
  };
}

// ============================================================================
// GET Handler - Get execution history
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    if (!agentStore.has(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Agent with ID ${id} not found`,
          },
        },
        { status: 404 }
      );
    }

    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams));
    const query = parseResult.success ? parseResult.data : { page: 1, limit: 20, status: 'all' as const };

    let logs = executionLogStore.get(id) || [];

    // Filter by status
    if (query.status !== 'all') {
      const isSuccess = query.status === 'success';
      logs = logs.filter((l) => l.success === isSuccess);
    }

    // Sort by date (newest first)
    logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    // Paginate
    const total = logs.length;
    const offset = (query.page - 1) * query.limit;
    const paginatedLogs = logs.slice(offset, offset + query.limit);

    return NextResponse.json({
      success: true,
      data: {
        executions: paginatedLogs,
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
    console.error('Execution history GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch execution history',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Execute agent
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if agent exists
    const agent = agentStore.get(id);

    // For demo purposes, create a default agent if not found
    if (!agent) {
      const defaultAgent: AgentConfig = {
        id,
        name: 'Demo Agent',
        description: 'A demo crypto assistant agent',
        model: 'gpt-4',
        systemPrompt: 'You are a helpful crypto assistant.',
        tools: ['getBalance', 'getTokenPrice', 'analyzeTrends'],
        walletAddress: null,
        chains: ['ethereum'],
        memory: 'session',
        maxIterations: 10,
        verbose: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastExecutedAt: null,
        executionCount: 0,
        metadata: {},
      };
      agentStore.set(id, defaultAgent);
    }

    const currentAgent = agentStore.get(id)!;

    // Check status
    if (currentAgent.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AGENT_NOT_ACTIVE',
            message: `Agent is ${currentAgent.status}`,
          },
        },
        { status: 400 }
      );
    }

    // Parse request
    const parseResult = ExecuteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid execution request',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { input, context, options } = parseResult.data;

    // Create execution context
    const execContext: ExecutionContext = {
      walletAddress: context.walletAddress || currentAgent.walletAddress,
      chain: context.chain,
      sessionId: context.sessionId || null,
    };

    // Execute
    const startedAt = new Date();
    const executionId = generateExecutionId();

    try {
      const result = await executeAgent(currentAgent, input, execContext, {
        maxToolCalls: options.maxToolCalls,
      });

      const completedAt = new Date();
      const duration = completedAt.getTime() - startedAt.getTime();

      // Create execution log
      const log: ExecutionLog = {
        id: executionId,
        agentId: id,
        input,
        output: result.output,
        toolCalls: result.toolCalls,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        duration,
        success: true,
        error: null,
        tokens: result.tokens,
      };

      // Store log
      const logs = executionLogStore.get(id) || [];
      logs.push(log);
      // Keep last 100 logs
      if (logs.length > 100) {
        logs.shift();
      }
      executionLogStore.set(id, logs);

      // Update agent stats
      currentAgent.lastExecutedAt = completedAt.toISOString();
      currentAgent.executionCount++;
      agentStore.set(id, currentAgent);

      return NextResponse.json({
        success: true,
        data: {
          executionId,
          output: result.output,
          toolCalls: result.toolCalls,
          duration,
          tokens: result.tokens,
        },
        meta: {
          timestamp: completedAt.toISOString(),
          agentId: id,
          agentName: currentAgent.name,
        },
      });
    } catch (execError) {
      const completedAt = new Date();
      const duration = completedAt.getTime() - startedAt.getTime();
      const errorMessage = (execError as Error).message;

      // Log failed execution
      const log: ExecutionLog = {
        id: executionId,
        agentId: id,
        input,
        output: '',
        toolCalls: [],
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        duration,
        success: false,
        error: errorMessage,
        tokens: { prompt: 0, completion: 0, total: 0 },
      };

      const logs = executionLogStore.get(id) || [];
      logs.push(log);
      executionLogStore.set(id, logs);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EXECUTION_FAILED',
            message: errorMessage,
          },
          data: {
            executionId,
            duration,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Agent execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to execute agent',
        },
      },
      { status: 500 }
    );
  }
}
