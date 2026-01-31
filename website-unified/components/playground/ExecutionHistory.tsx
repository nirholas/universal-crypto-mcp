'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { ExecutionResult, ExecutionStatus } from '@/lib/playground/types';
import { getToolById } from '@/lib/playground/tools-data';
import { formatDuration } from '@/lib/playground/execution';
import {
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Trash2,
  Copy,
  Download,
  Eye,
  Calendar,
  ArrowUpDown,
  BarChart2,
} from 'lucide-react';

interface ExecutionHistoryProps {
  executions: ExecutionResult[];
  onSelect?: (execution: ExecutionResult) => void;
  onDelete?: (executionId: string) => void;
  onRetry?: (execution: ExecutionResult) => void;
  onExport?: (executions: ExecutionResult[]) => void;
  className?: string;
}

type SortField = 'date' | 'tool' | 'duration' | 'status';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | ExecutionStatus;

export function ExecutionHistory({
  executions,
  onSelect,
  onDelete,
  onRetry,
  onExport,
  className,
}: ExecutionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort executions
  const filteredExecutions = useMemo(() => {
    let result = [...executions];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        exec =>
          exec.toolName.toLowerCase().includes(query) ||
          exec.toolId.toLowerCase().includes(query) ||
          JSON.stringify(exec.parameters).toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(exec => exec.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case 'tool':
          comparison = a.toolName.localeCompare(b.toolName);
          break;
        case 'duration':
          comparison = (a.duration || 0) - (b.duration || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [executions, searchQuery, filterStatus, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = executions.length;
    const success = executions.filter(e => e.status === 'success').length;
    const error = executions.filter(e => e.status === 'error').length;
    const avgDuration =
      executions.reduce((sum, e) => sum + (e.duration || 0), 0) / total || 0;
    return { total, success, error, avgDuration };
  }, [executions]);

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredExecutions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredExecutions.map(e => e.id)));
    }
  };

  const deleteSelected = () => {
    selectedIds.forEach(id => onDelete?.(id));
    setSelectedIds(new Set());
  };

  const exportSelected = () => {
    const selected = filteredExecutions.filter(e => selectedIds.has(e.id));
    onExport?.(selected.length > 0 ? selected : filteredExecutions);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Stats Bar */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-t-xl border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <BarChart2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Total:</span>
          <span className="font-medium">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-gray-600">Success:</span>
          <span className="font-medium text-green-600">{stats.success}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-gray-600">Errors:</span>
          <span className="font-medium text-red-600">{stats.error}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Avg Duration:</span>
          <span className="font-medium">{formatDuration(stats.avgDuration)}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executions..."
              className="w-64 h-9 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:ring-0 text-sm"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              showFilters ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {filterStatus !== 'all' && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <>
              <span className="text-sm text-gray-500">
                {selectedIds.size} selected
              </span>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          <button
            onClick={exportSelected}
            className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="flex gap-1">
              {(['all', 'success', 'error', 'running', 'cancelled'] as FilterStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    filterStatus === status
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
        <div className="w-6">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredExecutions.length && filteredExecutions.length > 0}
            onChange={selectAll}
            className="rounded border-gray-300"
          />
        </div>
        <button
          onClick={() => toggleSort('tool')}
          className="flex-1 flex items-center gap-1 hover:text-gray-900"
        >
          Tool
          {sortField === 'tool' && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <button
          onClick={() => toggleSort('status')}
          className="w-24 flex items-center gap-1 hover:text-gray-900"
        >
          Status
          {sortField === 'status' && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <button
          onClick={() => toggleSort('duration')}
          className="w-24 flex items-center gap-1 hover:text-gray-900"
        >
          Duration
          {sortField === 'duration' && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <button
          onClick={() => toggleSort('date')}
          className="w-32 flex items-center gap-1 hover:text-gray-900"
        >
          Date
          {sortField === 'date' && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <div className="w-24">Actions</div>
      </div>

      {/* Execution List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filteredExecutions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600">No executions found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Run a tool to see execution history'}
            </p>
          </div>
        ) : (
          filteredExecutions.map(execution => {
            const isExpanded = expandedId === execution.id;
            const isSelected = selectedIds.has(execution.id);
            const tool = getToolById(execution.toolId);

            return (
              <div
                key={execution.id}
                className={cn(
                  'transition-colors',
                  isSelected && 'bg-blue-50'
                )}
              >
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <div className="w-6">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(execution.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300"
                    />
                  </div>

                  <div
                    className="flex-1 flex items-center gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : execution.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-lg">{tool?.icon || '🔧'}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{execution.toolName}</h4>
                      <p className="text-xs text-gray-500 font-mono">{execution.toolId}</p>
                    </div>
                  </div>

                  <div className="w-24 flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <span className="text-sm text-gray-600">{execution.status}</span>
                  </div>

                  <div className="w-24 text-sm text-gray-600">
                    {execution.duration ? formatDuration(execution.duration) : '-'}
                  </div>

                  <div className="w-32 text-sm text-gray-500">
                    {formatDate(execution.startTime)}
                  </div>

                  <div className="w-24 flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(execution);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRetry?.(execution);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Retry"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(execution.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Parameters */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Parameters
                        </h5>
                        <pre className="p-3 bg-white rounded-lg text-xs font-mono overflow-x-auto border border-gray-200">
                          {JSON.stringify(execution.parameters, null, 2)}
                        </pre>
                      </div>

                      {/* Result */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Result
                        </h5>
                        {execution.status === 'success' && execution.content?.[0]?.data ? (
                          <pre className="p-3 bg-white rounded-lg text-xs font-mono overflow-x-auto border border-gray-200 max-h-48">
                            {JSON.stringify(execution.content[0].data, null, 2)}
                          </pre>
                        ) : execution.error ? (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700">
                            <strong>{execution.error.code}:</strong> {execution.error.message}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No result data</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ExecutionHistory;
