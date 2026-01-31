/**
 * Individual Agent API Route
 * GET /api/agents/[id] - Get agent details
 * PUT /api/agents/[id] - Update agent
 * DELETE /api/agents/[id] - Delete agent
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// ============================================================================
// Shared Store Import (simulated - in production use proper module)
// ============================================================================

// Re-define types and store for this route
// In production, these would be imported from a shared module

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

interface ExecutionLog {
  id: string;
  agentId: string;
  input: string;
  output: string;
  toolCalls: Array<{
    name: string;
    input: Record<string, unknown>;
    output: unknown;
    duration: number;
    success: boolean;
  }>;
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

// Shared in-memory stores
const agentStore = new Map<string, AgentConfig>();
const executionLogStore = new Map<string, ExecutionLog[]>();

// ============================================================================
// Schemas
// ============================================================================

const UpdateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  model: z.enum(['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'custom']).optional(),
  systemPrompt: z.string().max(10000).optional(),
  tools: z.array(z.string()).optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional().nullable(),
  chains: z.array(z.string()).optional(),
  memory: z.enum(['none', 'session', 'persistent']).optional(),
  maxIterations: z.number().int().min(1).max(100).optional(),
  verbose: z.boolean().optional(),
  status: z.enum(['active', 'paused', 'disabled']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ============================================================================
// GET Handler - Get agent details
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeLogs = searchParams.get('logs') === 'true';
    const logsLimit = parseInt(searchParams.get('logsLimit') || '10');

    const agent = agentStore.get(id);

    if (!agent) {
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

    // Get execution logs if requested
    let logs: ExecutionLog[] = [];
    if (includeLogs) {
      logs = (executionLogStore.get(id) || [])
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, logsLimit);
    }

    // Calculate statistics
    const allLogs = executionLogStore.get(id) || [];
    const successfulExecutions = allLogs.filter((l) => l.success).length;
    const totalTokens = allLogs.reduce((sum, l) => sum + l.tokens.total, 0);
    const avgDuration = allLogs.length > 0
      ? allLogs.reduce((sum, l) => sum + l.duration, 0) / allLogs.length
      : 0;

    const stats = {
      totalExecutions: allLogs.length,
      successfulExecutions,
      failedExecutions: allLogs.length - successfulExecutions,
      successRate: allLogs.length > 0 ? (successfulExecutions / allLogs.length) * 100 : 0,
      totalTokensUsed: totalTokens,
      averageDuration: Math.round(avgDuration),
    };

    return NextResponse.json({
      success: true,
      data: {
        agent,
        stats,
        ...(includeLogs && { recentLogs: logs }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Agent GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch agent',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT Handler - Update agent
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const agent = agentStore.get(id);

    if (!agent) {
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

    const parseResult = UpdateAgentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid update data',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const updates = parseResult.data;
    const now = new Date().toISOString();

    // Apply updates
    const updatedAgent: AgentConfig = {
      ...agent,
      ...updates,
      updatedAt: now,
    };

    agentStore.set(id, updatedAgent);

    return NextResponse.json({
      success: true,
      data: {
        agent: updatedAgent,
      },
      meta: {
        timestamp: now,
      },
    });
  } catch (error) {
    console.error('Agent PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update agent',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH Handler - Partial update (status change, etc.)
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const agent = agentStore.get(id);

    if (!agent) {
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

    const { action } = body as { action: string };
    const now = new Date().toISOString();

    switch (action) {
      case 'pause':
        agent.status = 'paused';
        break;
      case 'resume':
      case 'activate':
        agent.status = 'active';
        break;
      case 'disable':
        agent.status = 'disabled';
        break;
      case 'clearLogs':
        executionLogStore.delete(id);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: `Unknown action: ${action}`,
              details: { validActions: ['pause', 'resume', 'activate', 'disable', 'clearLogs'] },
            },
          },
          { status: 400 }
        );
    }

    agent.updatedAt = now;
    agentStore.set(id, agent);

    return NextResponse.json({
      success: true,
      data: {
        agent,
        action,
      },
      meta: {
        timestamp: now,
      },
    });
  } catch (error) {
    console.error('Agent PATCH error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update agent',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE Handler - Delete agent
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Delete agent and its logs
    agentStore.delete(id);
    executionLogStore.delete(id);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Agent deleted successfully',
        id,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Agent DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete agent',
        },
      },
      { status: 500 }
    );
  }
}

// Export stores for use by execute route
export { agentStore, executionLogStore };
export type { AgentConfig, ExecutionLog };
