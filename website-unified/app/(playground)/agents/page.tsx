'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAgents, useAgentMutations } from '@/hooks/useAgents';
import { cn } from '@/lib/utils';
import {
  Bot,
  Plus,
  Play,
  Pause,
  Square,
  MoreVertical,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
} from 'lucide-react';

export default function AgentsPage() {
  const { data: agents = [], isLoading } = useAgents();
  const { start, stop, pause, resume, isStarting, isStopping } = useAgentMutations();
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'stopped' | 'error'>('all');
  const [search, setSearch] = useState('');

  const filteredAgents = agents.filter((agent) => {
    const matchesFilter = filter === 'all' || agent.status === filter;
    const matchesSearch = search === '' || 
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    paused: agents.filter(a => a.status === 'paused').length,
    error: agents.filter(a => a.status === 'error').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      case 'stopped': return 'text-gray-400 bg-gray-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'stopped': return <Square className="w-3 h-3" />;
      case 'error': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleAction = async (agentId: string, action: 'start' | 'stop' | 'pause' | 'resume') => {
    try {
      switch (action) {
        case 'start': await start(agentId); break;
        case 'stop': await stop(agentId); break;
        case 'pause': await pause(agentId); break;
        case 'resume': await resume(agentId); break;
      }
    } catch (error) {
      console.error(`Failed to ${action} agent:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-gray-400 mt-1">Manage your autonomous trading and monitoring agents</p>
        </div>
        <Link
          href="/agents/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Agent
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Bot className="w-4 h-4" />
            <span className="text-sm">Total Agents</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Pause className="w-4 h-4" />
            <span className="text-sm">Paused</span>
          </div>
          <p className="text-2xl font-bold">{stats.paused}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Errors</span>
          </div>
          <p className="text-2xl font-bold">{stats.error}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'paused', 'stopped', 'error'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Agent List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Bot className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No agents found</h3>
          <p className="text-gray-400 mb-4">
            {search || filter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first AI agent to get started'}
          </p>
          {filter === 'all' && !search && (
            <Link
              href="/agents/new"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Agent
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Bot className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <Link 
                      href={`/agents/${agent.id}`}
                      className="text-lg font-semibold hover:text-purple-400 transition-colors"
                    >
                      {agent.name}
                    </Link>
                    <p className="text-gray-400 text-sm mt-1">{agent.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(agent.status)
                      )}>
                        {getStatusIcon(agent.status)}
                        {agent.status}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Type: {agent.type}
                      </span>
                      {agent.lastRunAt && (
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          Last run: {new Date(agent.lastRunAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick stats */}
                  <div className="text-right mr-4">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        {((agent.metrics.successfulRuns / (agent.metrics.totalRuns || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {agent.metrics.totalRuns} runs
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {agent.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleAction(agent.id, 'pause')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Pause"
                        >
                          <Pause className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button
                          onClick={() => handleAction(agent.id, 'stop')}
                          disabled={isStopping}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Stop"
                        >
                          <Square className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    )}
                    {agent.status === 'paused' && (
                      <button
                        onClick={() => handleAction(agent.id, 'resume')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Resume"
                      >
                        <Play className="w-4 h-4 text-green-400" />
                      </button>
                    )}
                    {(agent.status === 'stopped' || agent.status === 'error') && (
                      <button
                        onClick={() => handleAction(agent.id, 'start')}
                        disabled={isStarting}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Start"
                      >
                        <Play className="w-4 h-4 text-green-400" />
                      </button>
                    )}
                    <Link
                      href={`/agents/${agent.id}/edit`}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
