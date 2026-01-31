'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils/cn';
import { WorkflowNode as WorkflowNodeType, ExecutionStatus, McpTool } from '@/lib/playground/types';
import { getToolById } from '@/lib/playground/tools-data';
import { getCategoryById } from '@/lib/playground/categories';
import {
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  GripVertical,
  Settings,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected?: boolean;
  isConnecting?: boolean;
  onSelect?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onStartConnect?: (nodeId: string, handleType: 'input' | 'output') => void;
  className?: string;
}

const WorkflowNodeComponent = memo(function WorkflowNode({
  node,
  isSelected = false,
  isConnecting = false,
  onSelect,
  onDelete,
  onDuplicate,
  onEdit,
  onStartConnect,
  className,
}: WorkflowNodeProps) {
  const tool = node.type === 'tool' ? getToolById(node.data.toolId) : null;
  const category = tool ? getCategoryById(tool.category) : null;

  const getStatusIcon = (status?: ExecutionStatus) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Pause className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getNodeColor = () => {
    if (node.status === 'running') return 'border-blue-400 bg-blue-50';
    if (node.status === 'success') return 'border-green-400 bg-green-50';
    if (node.status === 'error') return 'border-red-400 bg-red-50';
    if (isSelected) return 'border-black bg-gray-50';
    return 'border-gray-200 bg-white';
  };

  const getTypeLabel = () => {
    switch (node.type) {
      case 'tool':
        return tool?.name || 'Unknown Tool';
      case 'condition':
        return 'Condition';
      case 'loop':
        return 'Loop';
      case 'transform':
        return 'Transform';
      case 'variable':
        return 'Variable';
      default:
        return 'Node';
    }
  };

  const getTypeIcon = () => {
    switch (node.type) {
      case 'condition':
        return '⬖';
      case 'loop':
        return '↻';
      case 'transform':
        return '⟳';
      case 'variable':
        return '𝑥';
      default:
        return '⬡';
    }
  };

  return (
    <div
      className={cn(
        'relative w-64 rounded-xl border-2 shadow-sm transition-all cursor-pointer',
        getNodeColor(),
        isConnecting && 'opacity-80',
        className
      )}
      onClick={() => onSelect?.(node.id)}
    >
      {/* Drag Handle */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 p-1 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Input Handle */}
      <div
        className={cn(
          'absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-300 bg-white cursor-crosshair transition-colors',
          isConnecting && 'border-blue-400 bg-blue-100'
        )}
        onClick={(e) => {
          e.stopPropagation();
          onStartConnect?.(node.id, 'input');
        }}
      />

      {/* Output Handle */}
      <div
        className={cn(
          'absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-300 bg-white cursor-crosshair transition-colors',
          isConnecting && 'border-blue-400 bg-blue-100'
        )}
        onClick={(e) => {
          e.stopPropagation();
          onStartConnect?.(node.id, 'output');
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{getTypeIcon()}</span>
          <div className="min-w-0">
            <h4 className="font-medium text-gray-900 truncate text-sm">
              {node.data.label || getTypeLabel()}
            </h4>
            {category && (
              <p className="text-xs text-gray-500 truncate">{category.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon(node.status)}
        </div>
      </div>

      {/* Content */}
      {node.type === 'tool' && tool && (
        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
          <p className="line-clamp-2">{tool.description}</p>
        </div>
      )}

      {/* Parameters Preview */}
      {Object.keys(node.data.parameters || {}).length > 0 && (
        <div className="px-4 py-2 text-xs">
          <div className="flex flex-wrap gap-1">
            {Object.entries(node.data.parameters).slice(0, 3).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 truncate max-w-[100px]"
              >
                {key}: {String(value).slice(0, 10)}
              </span>
            ))}
            {Object.keys(node.data.parameters).length > 3 && (
              <span className="px-2 py-0.5 text-gray-400">
                +{Object.keys(node.data.parameters).length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions (shown on hover/select) */}
      {isSelected && (
        <div className="flex items-center justify-end gap-1 px-3 py-2 bg-gray-50 rounded-b-xl border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(node.id);
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors"
            title="Edit"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.(node.id);
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(node.id);
            }}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Execution Result Badge */}
      {node.result && node.status === 'success' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
          {node.result.duration}ms
        </div>
      )}
    </div>
  );
});

export { WorkflowNodeComponent as WorkflowNode };
export default WorkflowNodeComponent;
