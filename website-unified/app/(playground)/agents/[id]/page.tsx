'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAgent, useAgentLogs, useAgentRuns, useAgentMutations, useAgentMetrics } from '@/hooks/useAgents';
import { cn } from '@/lib/utils';
import {
  Bot,
  ArrowLeft,
  Play,
  Pause,
  Square,
  Settings,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Terminal,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: agent, isLoading } = useAgent(id);
  const { data: logs = [] } = useAgentLogs(id, { limit: 50 });
  const { data: runs = [] } = useAgentRuns(id, { limit: 10 });
  const metrics = useAgentMetrics(id);
  const { start, stop, pause, resume } = useAgentMutations();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'runs' | 'config'>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Agent not found</h2>
        <Link href="/agents" className="text-purple-400 hover:underline">
          Back to agents
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'stopped': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'debug': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/agents"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-gray-400">{agent.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-3 py-1 rounded-full border text-sm font-medium capitalize',
            getStatusColor(agent.status)
          )}>
            {agent.status}
          </span>
          {agent.status === 'active' && (
            <>
              <button
                onClick={() => pause(agent.id)}
                className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors"
              >
                <Pause className="w-5 h-5 text-yellow-400" />
              </button>
              <button
                onClick={() => stop(agent.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Square className="w-5 h-5 text-red-400" />
              </button>
            </>
          )}
          {(agent.status === 'stopped' || agent.status === 'error') && (
            <button
              onClick={() => start(agent.id)}
              className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
            >
              <Play className="w-5 h-5 text-green-400" />
            </button>
          )}
          {agent.status === 'paused' && (
            <button
              onClick={() => resume(agent.id)}
              className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
            >
              <Play className="w-5 h-5 text-green-400" />
            </button>
          )}
          <Link
            href={`/agents/${agent.id}/edit`}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10">
        {(['overview', 'logs', 'runs', 'config'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Total Runs</span>
              </div>
              <p className="text-2xl font-bold">{metrics.totalRuns}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Success Rate</span>
              </div>
              <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Avg Duration</span>
              </div>
              <p className="text-2xl font-bold">{(metrics.avgRecentDuration / 1000).toFixed(1)}s</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Tokens Used</span>
              </div>
              <p className="text-2xl font-bold">{metrics.tokensUsed.toLocaleString()}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-4">Recent Runs</h3>
            <div className="space-y-3">
              {runs.slice(0, 5).map((run) => (
                <div key={run.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {run.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : run.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="capitalize">{run.trigger}</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(run.startedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-black/50 rounded-xl border border-white/10 p-4 font-mono text-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
            <Terminal className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">Agent Logs</span>
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-gray-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={cn('shrink-0 uppercase text-xs w-12', getLogLevelColor(log.level))}>
                  [{log.level}]
                </span>
                <span className="text-white">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'runs' && (
        <div className="space-y-4">
          {runs.map((run) => (
            <div
              key={run.id}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {run.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : run.status === 'failed' ? (
                    <XCircle className="w-5 h-5 text-red-400" />
                  ) : run.status === 'running' ? (
                    <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium capitalize">{run.status}</span>
                  <span className="text-gray-400 text-sm">
                    Trigger: {run.trigger}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(run.startedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Duration: {(run.metrics.duration / 1000).toFixed(1)}s</span>
                <span>Tokens: {run.metrics.tokensUsed}</span>
                <span>Actions: {run.metrics.actionsExecuted}</span>
              </div>
              {run.error && (
                <div className="mt-3 p-2 bg-red-500/10 rounded text-red-400 text-sm">
                  {run.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'config' && (
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-semibold mb-4">Agent Configuration</h3>
          <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
            {JSON.stringify(agent.config, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
