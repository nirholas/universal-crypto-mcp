/**
 * useAutomation Hook
 * 
 * React hook for managing workflow automation, triggers, and scheduled tasks.
 * Connects to packages/automation for workflow execution and management.
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'archived';
export type TriggerType = 'schedule' | 'webhook' | 'price' | 'event' | 'manual' | 'onchain';
export type ActionType = 'swap' | 'transfer' | 'stake' | 'unstake' | 'notify' | 'webhook' | 'agent' | 'custom';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  createdAt: number;
  updatedAt: number;
  lastRunAt?: number;
  nextRunAt?: number;
  runCount: number;
  successCount: number;
  failCount: number;
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: TriggerConfig;
}

export interface TriggerConfig {
  // Schedule trigger
  cron?: string;
  timezone?: string;
  
  // Webhook trigger
  webhookUrl?: string;
  webhookSecret?: string;
  
  // Price trigger
  token?: string;
  chain?: string;
  condition?: 'above' | 'below' | 'equals' | 'change';
  threshold?: number;
  
  // Event trigger
  eventType?: string;
  eventFilter?: Record<string, unknown>;
  
  // On-chain trigger
  contractAddress?: string;
  eventName?: string;
  chainId?: number;
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  name: string;
  config: ActionConfig;
  order: number;
  continueOnError?: boolean;
  retryCount?: number;
  timeout?: number;
}

export interface ActionConfig {
  // Swap action
  fromToken?: string;
  toToken?: string;
  amount?: string;
  slippage?: number;
  
  // Transfer action
  recipient?: string;
  token?: string;
  transferAmount?: string;
  
  // Stake/Unstake action
  protocol?: string;
  pool?: string;
  stakeAmount?: string;
  
  // Notify action
  channel?: 'email' | 'telegram' | 'discord' | 'slack';
  message?: string;
  
  // Webhook action
  url?: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  body?: unknown;
  
  // Agent action
  agentId?: string;
  agentInput?: unknown;
  
  // Custom action
  script?: string;
  runtime?: 'javascript' | 'python';
}

export interface WorkflowCondition {
  id: string;
  type: 'if' | 'switch' | 'loop';
  expression: string;
  trueActions?: string[];
  falseActions?: string[];
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: number;
  endTime?: number;
  triggeredBy: string;
  steps: WorkflowStep[];
  error?: string;
  output?: unknown;
}

export interface WorkflowStep {
  actionId: string;
  actionName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: number;
  endTime?: number;
  input?: unknown;
  output?: unknown;
  error?: string;
}

export interface UseAutomationOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  status?: WorkflowStatus;
}

export interface UseAutomationReturn {
  // Workflow list
  workflows: Workflow[];
  loading: boolean;
  error: Error | null;
  
  // Single workflow access
  getWorkflow: (id: string) => Workflow | undefined;
  
  // Workflow management
  createWorkflow: (workflow: CreateWorkflowInput) => Promise<Workflow>;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => Promise<Workflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  
  // Workflow control
  activateWorkflow: (id: string) => Promise<void>;
  pauseWorkflow: (id: string) => Promise<void>;
  runWorkflow: (id: string, input?: unknown) => Promise<WorkflowRun>;
  
  // Utilities
  refetch: () => Promise<void>;
  getActiveWorkflows: () => Workflow[];
  getWorkflowsByTrigger: (triggerType: TriggerType) => Workflow[];
}

export type CreateWorkflowInput = Omit<
  Workflow,
  'id' | 'createdAt' | 'updatedAt' | 'lastRunAt' | 'nextRunAt' | 'runCount' | 'successCount' | 'failCount'
>;

// ============================================================================
// Mock Data (Development Fallback)
// ============================================================================

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'Daily Portfolio Rebalance',
    description: 'Automatically rebalances portfolio to maintain target allocations',
    status: 'active',
    trigger: {
      type: 'schedule',
      config: {
        cron: '0 9 * * *',
        timezone: 'UTC',
      },
    },
    actions: [
      {
        id: 'action-1',
        type: 'agent',
        name: 'Analyze Portfolio',
        config: {
          agentId: 'agent-1',
          agentInput: { task: 'analyze_imbalance' },
        },
        order: 1,
      },
      {
        id: 'action-2',
        type: 'swap',
        name: 'Rebalance ETH',
        config: {
          fromToken: 'USDC',
          toToken: 'ETH',
          amount: 'calculated',
          slippage: 0.5,
        },
        order: 2,
        continueOnError: true,
      },
      {
        id: 'action-3',
        type: 'notify',
        name: 'Send Report',
        config: {
          channel: 'telegram',
          message: 'Portfolio rebalanced successfully',
        },
        order: 3,
      },
    ],
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 3600000,
    lastRunAt: Date.now() - 86400000,
    nextRunAt: Date.now() + 43200000,
    runCount: 28,
    successCount: 26,
    failCount: 2,
  },
  {
    id: 'workflow-2',
    name: 'Whale Alert Monitor',
    description: 'Monitors large transactions and sends alerts',
    status: 'active',
    trigger: {
      type: 'onchain',
      config: {
        eventType: 'Transfer',
        chainId: 1,
        eventFilter: { minValue: '100000000000000000000' }, // 100 ETH
      },
    },
    actions: [
      {
        id: 'action-1',
        type: 'webhook',
        name: 'Analyze Transaction',
        config: {
          url: 'https://api.example.com/analyze',
          method: 'POST',
        },
        order: 1,
      },
      {
        id: 'action-2',
        type: 'notify',
        name: 'Send Alert',
        config: {
          channel: 'discord',
          message: 'Whale alert detected!',
        },
        order: 2,
      },
    ],
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 7200000,
    lastRunAt: Date.now() - 1800000,
    runCount: 145,
    successCount: 143,
    failCount: 2,
  },
  {
    id: 'workflow-3',
    name: 'Price Drop Auto-Buy',
    description: 'Automatically buys ETH when price drops by 5%',
    status: 'paused',
    trigger: {
      type: 'price',
      config: {
        token: 'ETH',
        chain: 'ethereum',
        condition: 'change',
        threshold: -5,
      },
    },
    actions: [
      {
        id: 'action-1',
        type: 'swap',
        name: 'Buy ETH',
        config: {
          fromToken: 'USDC',
          toToken: 'ETH',
          amount: '1000',
          slippage: 1,
        },
        order: 1,
      },
    ],
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 2,
    runCount: 3,
    successCount: 3,
    failCount: 0,
  },
  {
    id: 'workflow-4',
    name: 'Weekly Report Generator',
    description: 'Generates and sends weekly portfolio reports',
    status: 'active',
    trigger: {
      type: 'schedule',
      config: {
        cron: '0 10 * * 1',
        timezone: 'America/New_York',
      },
    },
    actions: [
      {
        id: 'action-1',
        type: 'agent',
        name: 'Generate Report',
        config: {
          agentId: 'agent-3',
          agentInput: { reportType: 'weekly', format: 'pdf' },
        },
        order: 1,
      },
      {
        id: 'action-2',
        type: 'notify',
        name: 'Email Report',
        config: {
          channel: 'email',
          message: 'Your weekly portfolio report is ready',
        },
        order: 2,
      },
    ],
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 604800000,
    lastRunAt: Date.now() - 604800000,
    nextRunAt: Date.now() + 172800000,
    runCount: 8,
    successCount: 8,
    failCount: 0,
  },
];

const MOCK_RUNS: WorkflowRun[] = [
  {
    id: 'run-1',
    workflowId: 'workflow-1',
    status: 'completed',
    startTime: Date.now() - 86400000,
    endTime: Date.now() - 86400000 + 45000,
    triggeredBy: 'schedule',
    steps: [
      {
        actionId: 'action-1',
        actionName: 'Analyze Portfolio',
        status: 'completed',
        startTime: Date.now() - 86400000,
        endTime: Date.now() - 86400000 + 15000,
        output: { imbalance: { ETH: -2.5, USDC: 2500 } },
      },
      {
        actionId: 'action-2',
        actionName: 'Rebalance ETH',
        status: 'completed',
        startTime: Date.now() - 86400000 + 15000,
        endTime: Date.now() - 86400000 + 35000,
        output: { txHash: '0x1234...5678' },
      },
      {
        actionId: 'action-3',
        actionName: 'Send Report',
        status: 'completed',
        startTime: Date.now() - 86400000 + 35000,
        endTime: Date.now() - 86400000 + 45000,
      },
    ],
  },
];

// ============================================================================
// API Functions
// ============================================================================

async function fetchWorkflows(status?: WorkflowStatus): Promise<Workflow[]> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 400));
    let workflows = [...MOCK_WORKFLOWS];
    if (status) {
      workflows = workflows.filter(w => w.status === status);
    }
    return workflows;
  }

  try {
    const url = status
      ? `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows?status=${status}`
      : `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return await response.json();
  } catch (error) {
    console.warn('Automation API failed, using mock data');
    return MOCK_WORKFLOWS;
  }
}

async function fetchWorkflowRuns(
  workflowId: string,
  limit = 10
): Promise<WorkflowRun[]> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_RUNS.filter(r => r.workflowId === workflowId).slice(0, limit);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows/${workflowId}/runs?limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch workflow runs');
    return await response.json();
  } catch {
    return MOCK_RUNS.filter(r => r.workflowId === workflowId);
  }
}

async function createWorkflowAPI(workflow: CreateWorkflowInput): Promise<Workflow> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const now = Date.now();
    return {
      ...workflow,
      id: `workflow-${now}`,
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      successCount: 0,
      failCount: 0,
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    }
  );
  if (!response.ok) throw new Error('Failed to create workflow');
  return await response.json();
}

async function updateWorkflowAPI(
  id: string,
  updates: Partial<Workflow>
): Promise<Workflow> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const existing = MOCK_WORKFLOWS.find(w => w.id === id);
    if (!existing) throw new Error('Workflow not found');
    return { ...existing, ...updates, updatedAt: Date.now() };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }
  );
  if (!response.ok) throw new Error('Failed to update workflow');
  return await response.json();
}

async function deleteWorkflowAPI(id: string): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows/${id}`,
    { method: 'DELETE' }
  );
  if (!response.ok) throw new Error('Failed to delete workflow');
}

async function activateWorkflowAPI(id: string): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows/${id}/activate`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error('Failed to activate workflow');
}

async function pauseWorkflowAPI(id: string): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows/${id}/pause`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error('Failed to pause workflow');
}

async function runWorkflowAPI(id: string, input?: unknown): Promise<WorkflowRun> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_AUTOMATION_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: `run-${Date.now()}`,
      workflowId: id,
      status: 'running',
      startTime: Date.now(),
      triggeredBy: 'manual',
      steps: [],
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTOMATION_API_URL}/workflows/${id}/run`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    }
  );
  if (!response.ok) throw new Error('Failed to run workflow');
  return await response.json();
}

// ============================================================================
// Hook: useAutomation
// ============================================================================

export function useAutomation(
  options: UseAutomationOptions = {}
): UseAutomationReturn {
  const {
    enabled = true,
    refetchInterval = 30000, // 30 seconds
    staleTime = 15000,
    status,
  } = options;

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workflows', status],
    queryFn: () => fetchWorkflows(status),
    enabled,
    refetchInterval,
    staleTime,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createWorkflowAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Workflow> }) =>
      updateWorkflowAPI(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkflowAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const activateMutation = useMutation({
    mutationFn: activateWorkflowAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const pauseMutation = useMutation({
    mutationFn: pauseWorkflowAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const runMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input?: unknown }) =>
      runWorkflowAPI(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const workflows = query.data ?? [];

  const getWorkflow = useCallback(
    (id: string) => workflows.find(w => w.id === id),
    [workflows]
  );

  const getActiveWorkflows = useCallback(
    () => workflows.filter(w => w.status === 'active'),
    [workflows]
  );

  const getWorkflowsByTrigger = useCallback(
    (triggerType: TriggerType) => workflows.filter(w => w.trigger.type === triggerType),
    [workflows]
  );

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['workflows', status] });
  }, [queryClient, status]);

  return {
    workflows,
    loading: query.isLoading,
    error: query.error as Error | null,
    getWorkflow,
    createWorkflow: createMutation.mutateAsync,
    updateWorkflow: (id: string, updates: Partial<Workflow>) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteWorkflow: deleteMutation.mutateAsync,
    activateWorkflow: activateMutation.mutateAsync,
    pauseWorkflow: pauseMutation.mutateAsync,
    runWorkflow: (id: string, input?: unknown) =>
      runMutation.mutateAsync({ id, input }),
    refetch,
    getActiveWorkflows,
    getWorkflowsByTrigger,
  };
}

// ============================================================================
// Hook: useWorkflowRuns
// ============================================================================

export function useWorkflowRuns(
  workflowId: string,
  options: { enabled?: boolean; limit?: number } = {}
) {
  const { enabled = true, limit = 10 } = options;

  const query = useQuery({
    queryKey: ['workflow-runs', workflowId, limit],
    queryFn: () => fetchWorkflowRuns(workflowId, limit),
    enabled: enabled && !!workflowId,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  return {
    runs: query.data ?? [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: () => query.refetch(),
  };
}

// ============================================================================
// Hook: useWorkflowStats
// ============================================================================

export function useWorkflowStats(options: UseAutomationOptions = {}) {
  const { workflows, loading, error } = useAutomation(options);

  const stats = useMemo(() => {
    if (!workflows.length) {
      return {
        totalWorkflows: 0,
        activeWorkflows: 0,
        pausedWorkflows: 0,
        totalRuns: 0,
        successRate: 0,
        avgRunsPerDay: 0,
        byTriggerType: {} as Record<TriggerType, number>,
      };
    }

    const byTriggerType = workflows.reduce((acc, w) => {
      acc[w.trigger.type] = (acc[w.trigger.type] || 0) + 1;
      return acc;
    }, {} as Record<TriggerType, number>);

    const totalRuns = workflows.reduce((sum, w) => sum + w.runCount, 0);
    const totalSuccess = workflows.reduce((sum, w) => sum + w.successCount, 0);

    // Calculate avg runs per day based on oldest workflow
    const oldestCreatedAt = Math.min(...workflows.map(w => w.createdAt));
    const daysSinceOldest = (Date.now() - oldestCreatedAt) / (1000 * 60 * 60 * 24);
    const avgRunsPerDay = daysSinceOldest > 0 ? totalRuns / daysSinceOldest : 0;

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      pausedWorkflows: workflows.filter(w => w.status === 'paused').length,
      totalRuns,
      successRate: totalRuns > 0 ? (totalSuccess / totalRuns) * 100 : 0,
      avgRunsPerDay: Math.round(avgRunsPerDay * 100) / 100,
      byTriggerType,
    };
  }, [workflows]);

  return {
    stats,
    loading,
    error,
  };
}

// ============================================================================
// Hook: useWorkflowBuilder (for creating workflows)
// ============================================================================

export function useWorkflowBuilder(initialWorkflow?: Partial<CreateWorkflowInput>) {
  const [workflow, setWorkflow] = useState<Partial<CreateWorkflowInput>>({
    name: '',
    status: 'draft',
    trigger: { type: 'manual', config: {} },
    actions: [],
    ...initialWorkflow,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setName = useCallback((name: string) => {
    setWorkflow(prev => ({ ...prev, name }));
    if (name) setErrors(prev => ({ ...prev, name: '' }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setWorkflow(prev => ({ ...prev, description }));
  }, []);

  const setTrigger = useCallback((trigger: WorkflowTrigger) => {
    setWorkflow(prev => ({ ...prev, trigger }));
  }, []);

  const addAction = useCallback((action: Omit<WorkflowAction, 'id' | 'order'>) => {
    setWorkflow(prev => {
      const actions = prev.actions ?? [];
      const newAction: WorkflowAction = {
        ...action,
        id: `action-${Date.now()}`,
        order: actions.length + 1,
      };
      return { ...prev, actions: [...actions, newAction] };
    });
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setWorkflow(prev => ({
      ...prev,
      actions: (prev.actions ?? [])
        .filter(a => a.id !== actionId)
        .map((a, i) => ({ ...a, order: i + 1 })),
    }));
  }, []);

  const updateAction = useCallback((actionId: string, updates: Partial<WorkflowAction>) => {
    setWorkflow(prev => ({
      ...prev,
      actions: (prev.actions ?? []).map(a =>
        a.id === actionId ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  const reorderActions = useCallback((fromIndex: number, toIndex: number) => {
    setWorkflow(prev => {
      const actions = [...(prev.actions ?? [])];
      const [removed] = actions.splice(fromIndex, 1);
      actions.splice(toIndex, 0, removed);
      return {
        ...prev,
        actions: actions.map((a, i) => ({ ...a, order: i + 1 })),
      };
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!workflow.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!workflow.trigger?.type) {
      newErrors.trigger = 'Trigger is required';
    }

    if (!workflow.actions?.length) {
      newErrors.actions = 'At least one action is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [workflow]);

  const reset = useCallback(() => {
    setWorkflow({
      name: '',
      status: 'draft',
      trigger: { type: 'manual', config: {} },
      actions: [],
    });
    setErrors({});
  }, []);

  const isValid = useMemo(() => {
    return (
      !!workflow.name?.trim() &&
      !!workflow.trigger?.type &&
      (workflow.actions?.length ?? 0) > 0
    );
  }, [workflow]);

  return {
    workflow,
    errors,
    isValid,
    setName,
    setDescription,
    setTrigger,
    addAction,
    removeAction,
    updateAction,
    reorderActions,
    validate,
    reset,
    getWorkflow: () => workflow as CreateWorkflowInput,
  };
}

// ============================================================================
// Default Export
// ============================================================================

export default useAutomation;
