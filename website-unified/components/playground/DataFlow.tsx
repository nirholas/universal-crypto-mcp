'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { cn } from '@/lib/utils/cn';
import { WorkflowNode, WorkflowEdge, ExecutionResult } from '@/lib/playground/types';

interface DataFlowProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onEdgeCreate?: (source: string, target: string) => void;
  onEdgeDelete?: (edgeId: string) => void;
  selectedEdge?: string | null;
  onEdgeSelect?: (edgeId: string | null) => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

export const DataFlow = memo(function DataFlow({
  nodes,
  edges,
  onEdgeCreate,
  onEdgeDelete,
  selectedEdge,
  onEdgeSelect,
  className,
}: DataFlowProps) {
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);

  // Calculate node positions (simplified for demo)
  const nodePositions = useMemo(() => {
    const positions: Record<string, Point> = {};
    nodes.forEach((node, index) => {
      positions[node.id] = {
        x: node.position.x + 128, // Center of node (width/2)
        y: node.position.y + 40, // Center of node (height/2)
      };
    });
    return positions;
  }, [nodes]);

  // Generate SVG path for an edge
  const generatePath = (source: Point, target: Point): string => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);

    // Bezier curve
    return `M ${source.x} ${source.y} C ${source.x + controlOffset} ${source.y}, ${target.x - controlOffset} ${target.y}, ${target.x} ${target.y}`;
  };

  // Get color for edge based on status
  const getEdgeColor = (edge: WorkflowEdge): string => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (sourceNode?.status === 'success') return '#22c55e'; // green
    if (sourceNode?.status === 'error') return '#ef4444'; // red
    if (sourceNode?.status === 'running') return '#3b82f6'; // blue
    return '#d1d5db'; // gray
  };

  const handleEdgeClick = (edgeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onEdgeSelect?.(edgeId);
  };

  return (
    <svg
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
        <marker
          id="arrowhead-success"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map(edge => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];

        if (!sourcePos || !targetPos) return null;

        const path = generatePath(
          { x: sourcePos.x + 128, y: sourcePos.y }, // Right side of source
          { x: targetPos.x - 128, y: targetPos.y }  // Left side of target
        );

        const isSelected = selectedEdge === edge.id;
        const color = getEdgeColor(edge);

        return (
          <g key={edge.id} className="pointer-events-auto">
            {/* Hit area (wider for easier clicking) */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth="20"
              className="cursor-pointer"
              onClick={(e) => handleEdgeClick(edge.id, e)}
            />
            {/* Visible edge */}
            <path
              d={path}
              fill="none"
              stroke={isSelected ? '#3b82f6' : color}
              strokeWidth={isSelected ? 3 : 2}
              strokeDasharray={edge.condition ? '5,5' : undefined}
              markerEnd={`url(#${isSelected ? 'arrowhead-active' : 'arrowhead'})`}
              className="transition-colors"
            />
            {/* Edge label */}
            {edge.label && (
              <text
                x={(sourcePos.x + targetPos.x) / 2 + 128}
                y={(sourcePos.y + targetPos.y) / 2 - 10}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Connecting line (while dragging) */}
      {connectingFrom && mousePosition && nodePositions[connectingFrom] && (
        <path
          d={generatePath(
            { x: nodePositions[connectingFrom].x + 128, y: nodePositions[connectingFrom].y },
            mousePosition
          )}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="5,5"
          opacity={0.5}
        />
      )}
    </svg>
  );
});

// Edge info component
interface EdgeInfoProps {
  edge: WorkflowEdge;
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function EdgeInfo({ edge, sourceNode, targetNode, onDelete, onEdit }: EdgeInfoProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Edge</h4>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">From:</span>
          <span className="font-mono text-gray-900">{sourceNode.data.label || sourceNode.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">To:</span>
          <span className="font-mono text-gray-900">{targetNode.data.label || targetNode.id}</span>
        </div>
        {edge.condition && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-gray-500">Condition:</span>
            <pre className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
              {edge.condition}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Data mapping component for connecting outputs to inputs
interface DataMappingProps {
  sourceOutput: Record<string, unknown>;
  targetInputSchema: Record<string, unknown>;
  mapping: Record<string, string>;
  onChange: (mapping: Record<string, string>) => void;
}

export function DataMapping({
  sourceOutput,
  targetInputSchema,
  mapping,
  onChange,
}: DataMappingProps) {
  const outputKeys = Object.keys(sourceOutput || {});
  const inputKeys = Object.keys((targetInputSchema as any)?.properties || {});

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Data Mapping</h4>
      <div className="space-y-2">
        {inputKeys.map(inputKey => (
          <div key={inputKey} className="flex items-center gap-3">
            <select
              value={mapping[inputKey] || ''}
              onChange={(e) => {
                const newMapping = { ...mapping };
                if (e.target.value) {
                  newMapping[inputKey] = e.target.value;
                } else {
                  delete newMapping[inputKey];
                }
                onChange(newMapping);
              }}
              className="flex-1 h-8 px-2 text-sm border border-gray-200 rounded-lg focus:border-black focus:ring-0"
            >
              <option value="">Select source...</option>
              {outputKeys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <span className="text-gray-400">→</span>
            <span className="flex-1 px-2 py-1 bg-gray-50 rounded text-sm font-mono">
              {inputKey}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataFlow;
