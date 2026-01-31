/**
 * Automation Workflows API Route
 * GET /api/automation/workflows - List workflows
 * POST /api/automation/workflows - Create workflow
 * DELETE /api/automation/workflows - Delete multiple workflows
 * 
 * Integrates with @universal-crypto-mcp/automation for workflow management
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// ============================================================================
// Types
// ============================================================================

type TriggerType = 'schedule' | 'price' | 'event' | 'webhook' | 'manual';
type ActionType = 'swap' | 'transfer' | 'stake' | 'unstake' | 'claim' | 'notify' | 'custom' | 'agent';
type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'between';

interface WorkflowTrigger {
  type: TriggerType;
  config: {
    // Schedule trigger
    cron?: string;
    timezone?: string;
    // Price trigger
    token?: string;
    condition?: ConditionOperator;
    price?: number;
    priceEnd?: number; // for 'between'
    // Event trigger
    eventType?: string;
    contract?: string;
    // Webhook trigger
    webhookId?: string;
    secret?: string;
  };
}

interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
  valueEnd?: unknown; // for 'between'
}

interface WorkflowAction {
  id: string;
  type: ActionType;
  name: string;
  config: Record<string, unknown>;
  onSuccess?: string; // ID of next action
  onFailure?: string; // ID of fallback action
  retries?: number;
  timeout?: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'active' | 'paused' | 'disabled' | 'error';
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  chains: string[];
  walletAddress: string | null;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt: string | null;
  lastSuccessAt: string | null;
  executionCount: number;
  successCount: number;
  failureCount: number;
  tags: string[];
  metadata: Record<string, unknown>;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  triggeredAt: string;
  completedAt: string | null;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  triggerData: Record<string, unknown>;
  actionsExecuted: Array<{
    actionId: string;
    actionName: string;
    status: 'success' | 'failed' | 'skipped';
    startedAt: string;
    completedAt: string;
    output: unknown;
    error: string | null;
  }>;
  error: string | null;
}

// ============================================================================
// In-Memory Stores
// ============================================================================

const workflowStore = new Map<string, Workflow>();
const executionStore = new Map<string, WorkflowExecution[]>();

// ============================================================================
// Schemas
// ============================================================================

const TriggerSchema = z.object({
  type: z.enum(['schedule', 'price', 'event', 'webhook', 'manual']),
  config: z.object({
    cron: z.string().optional(),
    timezone: z.string().optional().default('UTC'),
    token: z.string().optional(),
    condition: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'between']).optional(),
    price: z.number().optional(),
    priceEnd: z.number().optional(),
    eventType: z.string().optional(),
    contract: z.string().optional(),
    webhookId: z.string().optional(),
    secret: z.string().optional(),
  }).optional().default({}),
});

const ConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'between']),
  value: z.unknown(),
  valueEnd: z.unknown().optional(),
});

const ActionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['swap', 'transfer', 'stake', 'unstake', 'claim', 'notify', 'custom', 'agent']),
  name: z.string(),
  config: z.record(z.unknown()),
  onSuccess: z.string().optional(),
  onFailure: z.string().optional(),
  retries: z.number().int().min(0).max(5).optional().default(0),
  timeout: z.number().int().min(1000).max(300000).optional().default(30000),
});

const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  trigger: TriggerSchema,
  conditions: z.array(ConditionSchema).optional().default([]),
  actions: z.array(ActionSchema).min(1).max(20),
  chains: z.array(z.string()).optional().default(['ethereum']),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  metadata: z.record(z.unknown()).optional().default({}),
});

const QuerySchema = z.object({
  status: z.enum(['active', 'paused', 'disabled', 'error', 'all']).optional().default('all'),
  trigger: z.enum(['schedule', 'price', 'event', 'webhook', 'manual', 'all']).optional().default('all'),
  search: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ============================================================================
// Helper Functions
// ============================================================================

function generateWorkflowId(): string {
  return `wf_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateActionId(): string {
  return `act_${Math.random().toString(36).substr(2, 9)}`;
}

function validateTriggerConfig(trigger: WorkflowTrigger): string[] {
  const errors: string[] = [];

  switch (trigger.type) {
    case 'schedule':
      if (!trigger.config.cron) {
        errors.push('Schedule trigger requires cron expression');
      }
      break;
    case 'price':
      if (!trigger.config.token) {
        errors.push('Price trigger requires token');
      }
      if (trigger.config.price === undefined) {
        errors.push('Price trigger requires target price');
      }
      break;
    case 'event':
      if (!trigger.config.eventType) {
        errors.push('Event trigger requires event type');
      }
      break;
    case 'webhook':
      // Webhook ID will be auto-generated
      break;
    case 'manual':
      // No config needed
      break;
  }

  return errors;
}

// ============================================================================
// Workflow Templates
// ============================================================================

const WORKFLOW_TEMPLATES = [
  {
    id: 'template_dca',
    name: 'DCA Strategy',
    description: 'Dollar-cost averaging - buy tokens on a schedule',
    trigger: { type: 'schedule' as const, config: { cron: '0 9 * * *', timezone: 'UTC' } },
    actions: [
      { type: 'swap' as const, name: 'Buy Token', config: { fromToken: 'USDC', toToken: 'ETH', amount: '100' } },
    ],
  },
  {
    id: 'template_price_alert',
    name: 'Price Alert',
    description: 'Get notified when token reaches target price',
    trigger: { type: 'price' as const, config: { token: 'ETH', condition: 'gte' as const, price: 5000 } },
    actions: [
      { type: 'notify' as const, name: 'Send Alert', config: { channel: 'email', message: 'Price target reached!' } },
    ],
  },
  {
    id: 'template_auto_claim',
    name: 'Auto Claim Rewards',
    description: 'Automatically claim DeFi rewards on schedule',
    trigger: { type: 'schedule' as const, config: { cron: '0 0 * * 1', timezone: 'UTC' } },
    actions: [
      { type: 'claim' as const, name: 'Claim Rewards', config: { protocol: 'aave' } },
      { type: 'notify' as const, name: 'Notify', config: { channel: 'webhook', message: 'Rewards claimed' } },
    ],
  },
  {
    id: 'template_stop_loss',
    name: 'Stop Loss',
    description: 'Sell tokens when price drops below threshold',
    trigger: { type: 'price' as const, config: { token: 'ETH', condition: 'lte' as const, price: 1500 } },
    actions: [
      { type: 'swap' as const, name: 'Sell Token', config: { fromToken: 'ETH', toToken: 'USDC', amount: 'all' } },
    ],
  },
];

// ============================================================================
// GET Handler - List workflows
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Check for templates request
    if (searchParams.get('templates') === 'true') {
      return NextResponse.json({
        success: true,
        data: {
          templates: WORKFLOW_TEMPLATES,
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

    // Get all workflows
    let workflows = Array.from(workflowStore.values());

    // Filter by status
    if (query.status !== 'all') {
      workflows = workflows.filter((w) => w.status === query.status);
    }

    // Filter by trigger type
    if (query.trigger !== 'all') {
      workflows = workflows.filter((w) => w.trigger.type === query.trigger);
    }

    // Filter by search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      workflows = workflows.filter(
        (w) =>
          w.name.toLowerCase().includes(searchLower) ||
          w.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tag
    if (query.tag) {
      workflows = workflows.filter((w) => w.tags.includes(query.tag!));
    }

    // Sort by creation date (newest first)
    workflows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate stats
    const stats = {
      total: workflowStore.size,
      active: Array.from(workflowStore.values()).filter((w) => w.status === 'active').length,
      paused: Array.from(workflowStore.values()).filter((w) => w.status === 'paused').length,
      disabled: Array.from(workflowStore.values()).filter((w) => w.status === 'disabled').length,
      error: Array.from(workflowStore.values()).filter((w) => w.status === 'error').length,
    };

    // Paginate
    const total = workflows.length;
    const offset = (query.page - 1) * query.limit;
    const paginatedWorkflows = workflows.slice(offset, offset + query.limit);

    return NextResponse.json({
      success: true,
      data: {
        workflows: paginatedWorkflows,
        stats,
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
    console.error('Workflows GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch workflows',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Create workflow
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if creating from template
    if (body.templateId) {
      const template = WORKFLOW_TEMPLATES.find((t) => t.id === body.templateId);
      if (!template) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TEMPLATE_NOT_FOUND',
              message: `Template ${body.templateId} not found`,
            },
          },
          { status: 404 }
        );
      }

      // Merge template with custom overrides
      body.name = body.name || template.name;
      body.description = body.description || template.description;
      body.trigger = body.trigger || template.trigger;
      body.actions = body.actions || template.actions;
    }

    const parseResult = CreateWorkflowSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid workflow configuration',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Validate trigger config
    const triggerErrors = validateTriggerConfig(data.trigger as WorkflowTrigger);
    if (triggerErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TRIGGER',
            message: 'Invalid trigger configuration',
            details: triggerErrors,
          },
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const workflowId = generateWorkflowId();

    // Generate webhook ID if needed
    if (data.trigger.type === 'webhook' && !data.trigger.config.webhookId) {
      data.trigger.config.webhookId = `whk_${Math.random().toString(36).substr(2, 16)}`;
      data.trigger.config.secret = `sec_${Math.random().toString(36).substr(2, 32)}`;
    }

    // Assign IDs to actions
    const actions: WorkflowAction[] = data.actions.map((action) => ({
      ...action,
      id: action.id || generateActionId(),
    }));

    const workflow: Workflow = {
      id: workflowId,
      name: data.name,
      description: data.description,
      owner: request.headers.get('x-user-id') || 'anonymous',
      status: 'active',
      trigger: data.trigger as WorkflowTrigger,
      conditions: data.conditions as WorkflowCondition[],
      actions,
      chains: data.chains,
      walletAddress: data.walletAddress || null,
      createdAt: now,
      updatedAt: now,
      lastTriggeredAt: null,
      lastSuccessAt: null,
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
      tags: data.tags,
      metadata: data.metadata,
    };

    workflowStore.set(workflowId, workflow);

    return NextResponse.json(
      {
        success: true,
        data: {
          workflow,
        },
        meta: {
          timestamp: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Workflows POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create workflow',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT Handler - Bulk update workflows
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, action } = body as { ids: string[]; action: 'pause' | 'resume' | 'disable' };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Workflow IDs array is required',
          },
        },
        { status: 400 }
      );
    }

    if (!['pause', 'resume', 'disable'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Invalid action. Use: pause, resume, or disable',
          },
        },
        { status: 400 }
      );
    }

    const updated: string[] = [];
    const notFound: string[] = [];
    const now = new Date().toISOString();

    for (const id of ids) {
      const workflow = workflowStore.get(id);
      if (workflow) {
        workflow.status = action === 'resume' ? 'active' : action === 'pause' ? 'paused' : 'disabled';
        workflow.updatedAt = now;
        workflowStore.set(id, workflow);
        updated.push(id);
      } else {
        notFound.push(id);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        updated,
        notFound,
        updatedCount: updated.length,
      },
      meta: {
        timestamp: now,
      },
    });
  } catch (error) {
    console.error('Workflows PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update workflows',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE Handler - Delete multiple workflows
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
            message: 'Workflow IDs array is required',
          },
        },
        { status: 400 }
      );
    }

    const deleted: string[] = [];
    const notFound: string[] = [];

    for (const id of ids) {
      if (workflowStore.has(id)) {
        workflowStore.delete(id);
        executionStore.delete(id);
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
    console.error('Workflows DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete workflows',
        },
      },
      { status: 500 }
    );
  }
}

// Export stores for use by other routes
export { workflowStore, executionStore };
export type { Workflow, WorkflowExecution, WorkflowAction };
