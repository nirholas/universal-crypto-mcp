'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowExecutionResult,
  ExecutionResult,
  ExecutionStatus,
} from '@/lib/playground/types';
import { executeTool, createMockExecution } from '@/lib/playground/execution';
import { getToolById } from '@/lib/playground/tools-data';
import {
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
  Bug,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface WorkflowRunnerProps {
  workflow: Workflow;
  onNodeUpdate?: (nodeId: string, status: ExecutionStatus, result?: ExecutionResult) => void;
  onComplete?: (result: WorkflowExecutionResult) => void;
  demoMode?: boolean;
  className?: string;
}

type RunnerState = 'idle' | 'running' | 'paused' | 'completed' | 'error';

export function WorkflowRunner({
  workflow,
  onNodeUpdate,
  onComplete,
  demoMode = true,
  className,
}: WorkflowRunnerProps) {
  const [state, setState] = useState<RunnerState>('idle');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [executedNodes, setExecutedNodes] = useState<Set<string>>(new Set());
  const [nodeResults, setNodeResults] = useState<Record<string, ExecutionResult>>({});
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [breakpoints, setBreakpoints] = useState<Set<string>>(new Set());
  const [showLogs, setShowLogs] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const abortRef = useRef(false);
  const pausedRef = useRef(false);

  interface LogEntry {
    id: string;
    timestamp: Date;
    type: 'info' | 'success' | 'error' | 'warn';
    nodeId?: string;
    message: string;
  }

  const addLog = useCallback((type: LogEntry['type'], message: string, nodeId?: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: new Date(),
        type,
        nodeId,
        message,
      },
    ]);
  }, []);

  // Get execution order (topological sort)
  const getExecutionOrder = useCallback((): string[] => {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) {
        throw new Error('Workflow contains a cycle');
      }

      visiting.add(nodeId);

      // Get incoming edges
      const incomingEdges = workflow.edges.filter(e => e.target === nodeId);
      for (const edge of incomingEdges) {
        visit(edge.source);
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
      order.push(nodeId);
    };

    // Find nodes with no incoming edges (start nodes)
    const startNodes = workflow.nodes.filter(
      node => !workflow.edges.some(e => e.target === node.id)
    );

    for (const node of startNodes) {
      visit(node.id);
    }

    // Visit any remaining nodes
    for (const node of workflow.nodes) {
      visit(node.id);
    }

    return order;
  }, [workflow]);

  // Execute a single node
  const executeNode = async (node: WorkflowNode): Promise<ExecutionResult | null> => {
    if (node.type === 'tool') {
      const tool = getToolById(node.data.toolId);
      if (!tool) {
        return {
          id: `exec_${Date.now()}`,
          toolId: node.data.toolId,
          toolName: 'Unknown',
          status: 'error',
          parameters: node.data.parameters,
          startTime: new Date(),
          error: { code: 'TOOL_NOT_FOUND', message: 'Tool not found' },
        };
      }

      // Resolve parameter mappings
      const resolvedParams = { ...node.data.parameters };
      if (node.data.parameterMappings) {
        for (const [paramKey, mapping] of Object.entries(node.data.parameterMappings)) {
          // Parse mapping like "nodeId.outputKey"
          const [sourceNodeId, outputKey] = mapping.split('.');
          const sourceResult = nodeResults[sourceNodeId];
          if (sourceResult?.content?.[0]?.data) {
            const data = sourceResult.content[0].data as Record<string, unknown>;
            resolvedParams[paramKey] = data[outputKey] ?? data;
          }
        }
      }

      if (demoMode) {
        await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
        return createMockExecution(tool, resolvedParams);
      }

      return executeTool(tool, resolvedParams);
    }

    if (node.type === 'condition') {
      // Evaluate condition
      addLog('info', `Evaluating condition`, node.id);
      // Simplified: always return true for demo
      return {
        id: `exec_${Date.now()}`,
        toolId: 'condition',
        toolName: 'Condition',
        status: 'success',
        parameters: {},
        startTime: new Date(),
        content: [{ type: 'json', data: { result: true } }],
      };
    }

    if (node.type === 'variable') {
      return {
        id: `exec_${Date.now()}`,
        toolId: 'variable',
        toolName: 'Variable',
        status: 'success',
        parameters: node.data.parameters,
        startTime: new Date(),
        content: [{ type: 'json', data: node.data.parameters }],
      };
    }

    return null;
  };

  // Run the workflow
  const runWorkflow = async () => {
    abortRef.current = false;
    pausedRef.current = false;
    setState('running');
    setStartTime(new Date());
    setExecutedNodes(new Set());
    setNodeResults({});
    setLogs([]);

    addLog('info', 'Starting workflow execution');

    try {
      const order = getExecutionOrder();
      addLog('info', `Execution order: ${order.join(' → ')}`);

      for (const nodeId of order) {
        if (abortRef.current) {
          addLog('warn', 'Workflow cancelled');
          setState('idle');
          return;
        }

        // Wait if paused
        while (pausedRef.current) {
          await new Promise(r => setTimeout(r, 100));
          if (abortRef.current) {
            setState('idle');
            return;
          }
        }

        // Check breakpoint
        if (breakpoints.has(nodeId) && state !== 'paused') {
          addLog('warn', `Breakpoint hit at node ${nodeId}`, nodeId);
          pausedRef.current = true;
          setState('paused');
          continue;
        }

        const node = workflow.nodes.find(n => n.id === nodeId);
        if (!node) continue;

        setCurrentNodeId(nodeId);
        onNodeUpdate?.(nodeId, 'running');
        addLog('info', `Executing node: ${node.data.label || nodeId}`, nodeId);

        const result = await executeNode(node);

        if (result) {
          setNodeResults(prev => ({ ...prev, [nodeId]: result }));
          onNodeUpdate?.(nodeId, result.status, result);

          if (result.status === 'success') {
            addLog('success', `Node completed in ${result.duration}ms`, nodeId);
          } else if (result.status === 'error') {
            addLog('error', `Node failed: ${result.error?.message}`, nodeId);
            // Continue or stop based on settings
          }
        }

        setExecutedNodes(prev => new Set([...prev, nodeId]));
      }

      setState('completed');
      addLog('success', 'Workflow completed successfully');

      if (onComplete) {
        onComplete({
          workflowId: workflow.id,
          status: 'success',
          startTime: startTime!,
          endTime: new Date(),
          nodeResults,
        });
      }
    } catch (error: any) {
      setState('error');
      addLog('error', `Workflow error: ${error.message}`);
    }
  };

  const pauseWorkflow = () => {
    pausedRef.current = true;
    setState('paused');
    addLog('info', 'Workflow paused');
  };

  const resumeWorkflow = () => {
    pausedRef.current = false;
    setState('running');
    addLog('info', 'Workflow resumed');
  };

  const stopWorkflow = () => {
    abortRef.current = true;
    pausedRef.current = false;
    setState('idle');
    setCurrentNodeId(null);
    addLog('warn', 'Workflow stopped');
  };

  const stepWorkflow = () => {
    // Execute one node then pause
    pausedRef.current = false;
    setTimeout(() => {
      pausedRef.current = true;
      setState('paused');
    }, 100);
  };

  const resetWorkflow = () => {
    setState('idle');
    setCurrentNodeId(null);
    setExecutedNodes(new Set());
    setNodeResults({});
    setVariables({});
    setLogs([]);
    setStartTime(null);

    // Reset all node statuses
    for (const node of workflow.nodes) {
      onNodeUpdate?.(node.id, 'idle');
    }
  };

  const toggleBreakpoint = (nodeId: string) => {
    setBreakpoints(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          {state === 'idle' && (
            <button
              onClick={runWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          )}
          {state === 'running' && (
            <>
              <button
                onClick={pauseWorkflow}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={stopWorkflow}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          )}
          {state === 'paused' && (
            <>
              <button
                onClick={resumeWorkflow}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
              <button
                onClick={stepWorkflow}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Step
              </button>
              <button
                onClick={stopWorkflow}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          )}
          {(state === 'completed' || state === 'error') && (
            <button
              onClick={resetWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Status */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
            state === 'idle' && 'bg-gray-100 text-gray-600',
            state === 'running' && 'bg-blue-100 text-blue-700',
            state === 'paused' && 'bg-yellow-100 text-yellow-700',
            state === 'completed' && 'bg-green-100 text-green-700',
            state === 'error' && 'bg-red-100 text-red-700'
          )}>
            {state === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
            {state === 'completed' && <CheckCircle2 className="w-4 h-4" />}
            {state === 'error' && <XCircle className="w-4 h-4" />}
            {state === 'paused' && <Pause className="w-4 h-4" />}
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </div>

          {/* Progress */}
          <div className="text-sm text-gray-500">
            {executedNodes.size} / {workflow.nodes.length} nodes
          </div>

          {/* Toggle logs */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 text-sm rounded-lg transition-colors',
              showLogs ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            <Eye className="w-4 h-4" />
            Logs
          </button>
        </div>
      </div>

      {/* Logs */}
      {showLogs && (
        <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-900 p-4 font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">Execution logs will appear here...</p>
          ) : (
            <div className="space-y-1">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    log.type === 'info' && 'bg-blue-900/50 text-blue-300',
                    log.type === 'success' && 'bg-green-900/50 text-green-300',
                    log.type === 'error' && 'bg-red-900/50 text-red-300',
                    log.type === 'warn' && 'bg-yellow-900/50 text-yellow-300'
                  )}>
                    {log.type.toUpperCase()}
                  </span>
                  {log.nodeId && (
                    <span className="text-purple-400">[{log.nodeId}]</span>
                  )}
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Variable Inspector */}
      {Object.keys(variables).length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Variables</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-purple-600">{key}</span>
                <span className="text-gray-400">=</span>
                <span className="font-mono text-gray-600 truncate">
                  {JSON.stringify(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowRunner;
