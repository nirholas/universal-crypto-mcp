'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'trading' | 'monitoring' | 'automation' | 'analysis' | 'custom';
  status: 'active' | 'paused' | 'stopped' | 'error';
  config: AgentConfig;
  metrics: AgentMetrics;
  createdAt: number;
  updatedAt: number;
  lastRunAt?: number;
  nextRunAt?: number;
}

export interface AgentConfig {
  model?: string;
  systemPrompt?: string;
  tools: string[];
  triggers: AgentTrigger[];
  schedule?: string; // cron expression
  maxIterations?: number;
  timeout?: number;
  memory?: {
    type: 'ephemeral' | 'persistent';
    ttl?: number;
  };
  notifications?: {
    onSuccess?: boolean;
    onError?: boolean;
    channels?: ('email' | 'webhook' | 'slack')[];
  };
}

export interface AgentTrigger {
  type: 'schedule' | 'webhook' | 'price' | 'event' | 'manual';
  config: Record<string, unknown>;
}

export interface AgentMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgExecutionTime: number;
  lastExecutionTime?: number;
  tokensUsed: number;
  actionsExecuted: number;
}

export interface AgentLog {
  id: string;
  agentId: string;
  runId: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: Record<string, unknown>;
}

export interface AgentRun {
  id: string;
  agentId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: number;
  completedAt?: number;
  trigger: AgentTrigger['type'];
  logs: AgentLog[];
  result?: unknown;
  error?: string;
  metrics: {
    tokensUsed: number;
    actionsExecuted: number;
    duration: number;
  };
}

export interface CreateAgentParams {
  name: string;
  description?: string;
  type: Agent['type'];
  config: Partial<AgentConfig>;
}

export interface UpdateAgentParams {
  id: string;
  name?: string;
  description?: string;
  config?: Partial<AgentConfig>;
}

// API Functions
async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch('/api/agents');
  if (!response.ok) throw new Error('Failed to fetch agents');
  return response.json();
}

async function fetchAgent(id: string): Promise<Agent> {
  const response = await fetch(`/api/agents/${id}`);
  if (!response.ok) throw new Error('Failed to fetch agent');
  return response.json();
}

async function createAgent(params: CreateAgentParams): Promise<Agent> {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Failed to create agent');
  return response.json();
}

async function updateAgent(params: UpdateAgentParams): Promise<Agent> {
  const response = await fetch(`/api/agents/${params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Failed to update agent');
  return response.json();
}

async function deleteAgent(id: string): Promise<void> {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete agent');
}

async function startAgent(id: string): Promise<AgentRun> {
  const response = await fetch(`/api/agents/${id}/start`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to start agent');
  return response.json();
}

async function stopAgent(id: string): Promise<void> {
  const response = await fetch(`/api/agents/${id}/stop`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to stop agent');
}

async function pauseAgent(id: string): Promise<void> {
  const response = await fetch(`/api/agents/${id}/pause`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to pause agent');
}

async function resumeAgent(id: string): Promise<void> {
  const response = await fetch(`/api/agents/${id}/resume`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to resume agent');
}

async function fetchAgentLogs(agentId: string, params?: {
  runId?: string;
  level?: AgentLog['level'];
  limit?: number;
  before?: number;
}): Promise<AgentLog[]> {
  const searchParams = new URLSearchParams();
  if (params?.runId) searchParams.set('runId', params.runId);
  if (params?.level) searchParams.set('level', params.level);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.before) searchParams.set('before', String(params.before));

  const response = await fetch(`/api/agents/${agentId}/logs?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch logs');
  return response.json();
}

async function fetchAgentRuns(agentId: string, params?: {
  status?: AgentRun['status'];
  limit?: number;
}): Promise<AgentRun[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const response = await fetch(`/api/agents/${agentId}/runs?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch runs');
  return response.json();
}

// Hooks
export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useAgent(id: string | undefined) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => fetchAgent(id!),
    enabled: !!id,
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // 30 seconds
  });
}

export function useAgentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAgent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', data.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  const startMutation = useMutation({
    mutationFn: startAgent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
      queryClient.invalidateQueries({ queryKey: ['agent-runs', id] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: stopAgent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: pauseAgent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: resumeAgent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    start: startMutation.mutateAsync,
    stop: stopMutation.mutateAsync,
    pause: pauseMutation.mutateAsync,
    resume: resumeMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  };
}

export function useAgentLogs(agentId: string | undefined, params?: {
  runId?: string;
  level?: AgentLog['level'];
  limit?: number;
}) {
  return useQuery({
    queryKey: ['agent-logs', agentId, params],
    queryFn: () => fetchAgentLogs(agentId!, params),
    enabled: !!agentId,
    staleTime: 10000, // 10 seconds
    refetchInterval: 15000, // 15 seconds
  });
}

export function useAgentRuns(agentId: string | undefined, params?: {
  status?: AgentRun['status'];
  limit?: number;
}) {
  return useQuery({
    queryKey: ['agent-runs', agentId, params],
    queryFn: () => fetchAgentRuns(agentId!, params),
    enabled: !!agentId,
    staleTime: 15000,
    refetchInterval: 30000,
  });
}

export function useAgentMetrics(agentId: string | undefined) {
  const { data: agent } = useAgent(agentId);
  const { data: runs = [] } = useAgentRuns(agentId, { limit: 100 });

  const metrics = agent?.metrics || {
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    avgExecutionTime: 0,
    tokensUsed: 0,
    actionsExecuted: 0,
  };

  // Calculate success rate
  const successRate = metrics.totalRuns > 0
    ? (metrics.successfulRuns / metrics.totalRuns) * 100
    : 0;

  // Recent run stats
  const recentRuns = runs.slice(0, 10);
  const avgRecentDuration = recentRuns.length > 0
    ? recentRuns.reduce((sum, r) => sum + (r.metrics?.duration || 0), 0) / recentRuns.length
    : 0;

  return {
    ...metrics,
    successRate,
    recentRuns,
    avgRecentDuration,
  };
}

// Combined hook for agent management
export function useAgentManagement() {
  const { data: agents = [], isLoading } = useAgents();
  const mutations = useAgentMutations();

  // Group agents by status
  const agentsByStatus = {
    active: agents.filter((a) => a.status === 'active'),
    paused: agents.filter((a) => a.status === 'paused'),
    stopped: agents.filter((a) => a.status === 'stopped'),
    error: agents.filter((a) => a.status === 'error'),
  };

  // Aggregate metrics
  const totalMetrics = agents.reduce(
    (acc, agent) => ({
      totalRuns: acc.totalRuns + agent.metrics.totalRuns,
      successfulRuns: acc.successfulRuns + agent.metrics.successfulRuns,
      failedRuns: acc.failedRuns + agent.metrics.failedRuns,
      tokensUsed: acc.tokensUsed + agent.metrics.tokensUsed,
      actionsExecuted: acc.actionsExecuted + agent.metrics.actionsExecuted,
    }),
    { totalRuns: 0, successfulRuns: 0, failedRuns: 0, tokensUsed: 0, actionsExecuted: 0 }
  );

  return {
    agents,
    agentsByStatus,
    totalMetrics,
    isLoading,
    ...mutations,
  };
}

export default useAgents;
