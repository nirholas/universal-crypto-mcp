'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  Workspace,
  ExecutionResult,
  ExecutionHistoryItem,
  Workflow,
  ParameterPreset,
} from '@/lib/playground/types';
import {
  getWorkspace,
  saveExecution,
  deleteExecution,
  getWorkflows,
  deleteWorkflow,
  getPresets,
  getFavoriteTools,
  toggleFavoriteTool,
  getRecentTools,
  exportPlaygroundData,
  importPlaygroundData,
  clearAllData,
} from '@/lib/playground/storage';
import { getToolById, SAMPLE_TOOLS } from '@/lib/playground/tools-data';
import { ExecutionHistory } from '@/components/playground/ExecutionHistory';
import { PresetsManager } from '@/components/playground/PresetsManager';
import { SharingSystem } from '@/components/playground/SharingSystem';
import {
  LayoutDashboard,
  History,
  Bookmark,
  Workflow as WorkflowIcon,
  Star,
  Settings,
  Search,
  Plus,
  Download,
  Upload,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clock,
  Zap,
  TrendingUp,
  BarChart2,
  FolderOpen,
  FileCode,
  Play,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

type TabId = 'overview' | 'history' | 'workflows' | 'presets' | 'favorites' | 'settings';

export default function WorkspacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [executions, setExecutions] = useState<ExecutionHistoryItem[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [presets, setPresets] = useState<ParameterPreset[]>([]);
  const [favoriteToolIds, setFavoriteToolIds] = useState<string[]>([]);
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load workspace data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const ws = getWorkspace();
        if (ws) {
          setWorkspace(ws);
          setExecutions(ws.executions || []);
        }
        setWorkflows(getWorkflows());
        setPresets(getPresets());
        setFavoriteToolIds(getFavoriteTools());
        setRecentToolIds(getRecentTools());
      } catch (error) {
        console.error('Failed to load workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const total = executions.length;
    const successful = executions.filter(e => e.status === 'success').length;
    const failed = executions.filter(e => e.status === 'error').length;
    const avgDuration = total > 0
      ? executions.reduce((sum, e) => sum + (e.duration || 0), 0) / total
      : 0;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    // Get unique tools used
    const uniqueTools = new Set(executions.map(e => e.toolId));

    // Most used tools
    const toolUsage: Record<string, number> = {};
    executions.forEach(e => {
      toolUsage[e.toolId] = (toolUsage[e.toolId] || 0) + 1;
    });
    const topTools = Object.entries(toolUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ id, count, tool: getToolById(id) }));

    return {
      total,
      successful,
      failed,
      avgDuration,
      successRate,
      uniqueToolsCount: uniqueTools.size,
      topTools,
      workflowCount: workflows.length,
      presetCount: presets.length,
      favoriteCount: favoriteToolIds.length,
    };
  }, [executions, workflows, presets, favoriteToolIds]);

  // Favorite tools with details
  const favoriteTools = useMemo(() => {
    return favoriteToolIds
      .map(id => getToolById(id))
      .filter(Boolean);
  }, [favoriteToolIds]);

  // Recent tools with details
  const recentTools = useMemo(() => {
    return recentToolIds
      .slice(0, 10)
      .map(id => getToolById(id))
      .filter(Boolean);
  }, [recentToolIds]);

  // Handlers
  const handleDeleteExecution = useCallback((id: string) => {
    deleteExecution(id);
    setExecutions(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleRetryExecution = useCallback((execution: ExecutionResult) => {
    router.push(`/tool/${execution.toolId}?retry=${execution.id}`);
  }, [router]);

  const handleExportExecutions = useCallback((items: ExecutionResult[]) => {
    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-executions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExportAll = useCallback(() => {
    const data = exportPlaygroundData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-workspace-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importPlaygroundData(event.target?.result as string);
        // Reload all data
        const ws = getWorkspace();
        if (ws) {
          setWorkspace(ws);
          setExecutions(ws.executions || []);
        }
        setWorkflows(getWorkflows());
        setPresets(getPresets());
        setFavoriteToolIds(getFavoriteTools());
      } catch (error) {
        console.error('Failed to import:', error);
        alert('Failed to import workspace data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleClearAll = useCallback(() => {
    if (!confirm('Are you sure you want to clear all workspace data? This cannot be undone.')) {
      return;
    }
    clearAllData();
    setExecutions([]);
    setWorkflows([]);
    setPresets([]);
    setFavoriteToolIds([]);
    setRecentToolIds([]);
  }, []);

  const handleToggleFavorite = useCallback((toolId: string) => {
    toggleFavoriteTool(toolId);
    setFavoriteToolIds(getFavoriteTools());
  }, []);

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Executions</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Success Rate</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.successRate.toFixed(1)}%
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Avg Duration</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.avgDuration < 1000
                    ? `${Math.round(stats.avgDuration)}ms`
                    : `${(stats.avgDuration / 1000).toFixed(2)}s`}
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-500">Tools Used</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.uniqueToolsCount}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push('/tools')}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Search className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Explore Tools</p>
                    <p className="text-sm text-gray-500">{SAMPLE_TOOLS.length}+ available</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/workflows')}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <WorkflowIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Build Workflow</p>
                    <p className="text-sm text-gray-500">{stats.workflowCount} saved</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/sdk')}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileCode className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">SDK Playground</p>
                    <p className="text-sm text-gray-500">Write code</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <History className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View History</p>
                    <p className="text-sm text-gray-500">{stats.total} executions</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Tools */}
            {recentTools.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentTools.slice(0, 6).map(tool => tool && (
                    <button
                      key={tool.id}
                      onClick={() => router.push(`/tool/${tool.id}`)}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
                    >
                      <span className="text-2xl">{tool.icon || '🔧'}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{tool.name}</p>
                        <p className="text-sm text-gray-500 truncate">{tool.category}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top Tools */}
            {stats.topTools.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Tools</h3>
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {stats.topTools.map(({ id, count, tool }, index) => (
                    <button
                      key={id}
                      onClick={() => router.push(`/tool/${id}`)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-bold text-gray-300 w-6">
                        {index + 1}
                      </span>
                      <span className="text-2xl">{tool?.icon || '🔧'}</span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-medium text-gray-900">{tool?.name || id}</p>
                        <p className="text-sm text-gray-500">{count} executions</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <ExecutionHistory
              executions={executions}
              onSelect={(exec) => router.push(`/tool/${exec.toolId}`)}
              onDelete={handleDeleteExecution}
              onRetry={handleRetryExecution}
              onExport={handleExportExecutions}
            />
          </div>
        );

      case 'workflows':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Saved Workflows</h3>
              <button
                onClick={() => router.push('/workflows')}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Workflow
              </button>
            </div>

            {workflows.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <WorkflowIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600">No workflows yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Create workflows to automate multi-tool operations
                </p>
                <button
                  onClick={() => router.push('/workflows')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Workflow
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map(workflow => (
                  <div
                    key={workflow.id}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                        <p className="text-sm text-gray-500">
                          {workflow.nodes.length} nodes • {workflow.edges.length} connections
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          deleteWorkflow(workflow.id);
                          setWorkflows(getWorkflows());
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {workflow.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {workflow.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/workflows?load=${workflow.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </button>
                      <button
                        onClick={() => router.push(`/workflows?run=${workflow.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Run
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'presets':
        return (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <PresetsManager
              onApplyPreset={(params) => {
                console.log('Apply preset params:', params);
              }}
            />
          </div>
        );

      case 'favorites':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Tools</h3>
            
            {favoriteTools.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600">No favorites yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Star tools to add them to your favorites
                </p>
                <button
                  onClick={() => router.push('/tools')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Browse Tools
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteTools.map(tool => tool && (
                  <div
                    key={tool.id}
                    className="p-6 bg-white rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tool.icon || '🔧'}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                          <p className="text-sm text-gray-500">{tool.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(tool.id)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <button
                      onClick={() => router.push(`/tool/${tool.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Execute
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-2xl space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Import</h3>
              <p className="text-sm text-gray-600 mb-4">
                Export your workspace data including execution history, workflows, and presets.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export All
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Storage</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Execution History</p>
                    <p className="text-sm text-gray-500">{stats.total} executions stored</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Clear all execution history?')) {
                        setExecutions([]);
                      }
                    }}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Workflows</p>
                    <p className="text-sm text-gray-500">{stats.workflowCount} workflows saved</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete all workflows?')) {
                        workflows.forEach(w => deleteWorkflow(w.id));
                        setWorkflows([]);
                      }
                    }}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Presets</p>
                    <p className="text-sm text-gray-500">{stats.presetCount} presets saved</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete all presets?')) {
                        setPresets([]);
                      }
                    }}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 mb-4">
                This will permanently delete all your workspace data including history, workflows, presets, and favorites.
              </p>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>
        );
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'workflows', label: 'Workflows', icon: <WorkflowIcon className="w-5 h-5" /> },
    { id: 'presets', label: 'Presets', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'favorites', label: 'Favorites', icon: <Star className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-gray-400" />
              <h1 className="text-xl font-bold text-gray-900">Workspace</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const ws = getWorkspace();
                  if (ws) {
                    setWorkspace(ws);
                    setExecutions(ws.executions || []);
                  }
                  setWorkflows(getWorkflows());
                  setPresets(getPresets());
                }}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div>
  );
}
