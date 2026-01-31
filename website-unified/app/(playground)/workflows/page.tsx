'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  Workflow,
  WorkflowNode as WorkflowNodeType,
  WorkflowEdge,
  McpTool,
  ExecutionStatus,
  ExecutionResult,
} from '@/lib/playground/types';
import { SAMPLE_TOOLS, getToolById } from '@/lib/playground/tools-data';
import { TOOL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/playground/categories';
import { getWorkflows, saveWorkflow, deleteWorkflow } from '@/lib/playground/storage';
import { WorkflowNode } from '@/components/playground/WorkflowNode';
import { DataFlow } from '@/components/playground/DataFlow';
import { WorkflowRunner } from '@/components/playground/WorkflowRunner';
import {
  Plus,
  Minus,
  Maximize2,
  Grid3X3,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Trash2,
  Play,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Copy,
  Download,
  Upload,
  Workflow as WorkflowIcon,
  ArrowRight,
  Layers,
  GitBranch,
  RefreshCw,
  Box,
} from 'lucide-react';

export default function WorkflowsPage() {
  const router = useRouter();
  
  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Workflow state
  const [workflow, setWorkflow] = useState<Workflow>({
    id: `workflow_${Date.now()}`,
    name: 'New Workflow',
    description: '',
    nodes: [],
    edges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    variables: {},
    isPublic: false,
    tags: [],
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  
  // UI state
  const [showToolbar, setShowToolbar] = useState(true);
  const [showRunner, setShowRunner] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'tools' | 'properties' | 'saved'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedWorkflows, setSavedWorkflows] = useState<Workflow[]>([]);
  
  // History for undo/redo
  const [history, setHistory] = useState<Workflow[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridSize = 20;

  // Load saved workflows
  useEffect(() => {
    const workflows = getWorkflows();
    setSavedWorkflows(workflows);
  }, []);

  // Filter tools by search
  const filteredTools = useMemo(() => {
    if (!searchQuery) return SAMPLE_TOOLS;
    const query = searchQuery.toLowerCase();
    return SAMPLE_TOOLS.filter(
      tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Snap position to grid
  const snapPosition = (x: number, y: number) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  // Add to history
  const pushHistory = useCallback((newWorkflow: Workflow) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newWorkflow]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setWorkflow(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setWorkflow(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Add node
  const addNode = useCallback((tool: McpTool, position?: { x: number; y: number }) => {
    const pos = position || { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 };
    const snapped = snapPosition(pos.x, pos.y);
    
    const newNode: WorkflowNodeType = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'tool',
      position: snapped,
      data: {
        toolId: tool.id,
        label: tool.name,
        parameters: {},
      },
    };
    
    const newWorkflow = {
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      updatedAt: new Date(),
    };
    
    setWorkflow(newWorkflow);
    pushHistory(newWorkflow);
    setSelectedNodeId(newNode.id);
  }, [workflow, snapToGrid, pushHistory]);

  // Add control node (condition, loop, etc.)
  const addControlNode = useCallback((type: 'condition' | 'loop' | 'transform' | 'variable') => {
    const pos = { x: 300 + Math.random() * 200, y: 150 + Math.random() * 200 };
    const snapped = snapPosition(pos.x, pos.y);
    
    const labels: Record<string, string> = {
      condition: 'Condition',
      loop: 'Loop',
      transform: 'Transform',
      variable: 'Variable',
    };
    
    const newNode: WorkflowNodeType = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: snapped,
      data: {
        toolId: type,
        label: labels[type],
        parameters: {},
      },
    };
    
    const newWorkflow = {
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      updatedAt: new Date(),
    };
    
    setWorkflow(newWorkflow);
    pushHistory(newWorkflow);
    setSelectedNodeId(newNode.id);
  }, [workflow, pushHistory]);

  // Delete node
  const deleteNode = useCallback((nodeId: string) => {
    const newWorkflow = {
      ...workflow,
      nodes: workflow.nodes.filter(n => n.id !== nodeId),
      edges: workflow.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      updatedAt: new Date(),
    };
    
    setWorkflow(newWorkflow);
    pushHistory(newWorkflow);
    setSelectedNodeId(null);
  }, [workflow, pushHistory]);

  // Duplicate node
  const duplicateNode = useCallback((nodeId: string) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const newNode: WorkflowNodeType = {
      ...node,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    };
    
    const newWorkflow = {
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      updatedAt: new Date(),
    };
    
    setWorkflow(newWorkflow);
    pushHistory(newWorkflow);
    setSelectedNodeId(newNode.id);
  }, [workflow, pushHistory]);

  // Connect nodes
  const connectNodes = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    
    // Check if edge already exists
    if (workflow.edges.some(e => e.source === sourceId && e.target === targetId)) return;
    
    const newEdge: WorkflowEdge = {
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: sourceId,
      target: targetId,
    };
    
    const newWorkflow = {
      ...workflow,
      edges: [...workflow.edges, newEdge],
      updatedAt: new Date(),
    };
    
    setWorkflow(newWorkflow);
    pushHistory(newWorkflow);
  }, [workflow, pushHistory]);

  // Delete edge
  const deleteEdge = useCallback((edgeId: string) => {
    const newWorkflow = {
      ...workflow,
      edges: workflow.edges.filter(e => e.id !== edgeId),
      updatedAt: new Date(),
    };
    
    setWorkflow(newWorkflow);
    pushHistory(newWorkflow);
    setSelectedEdgeId(null);
  }, [workflow, pushHistory]);

  // Handle node connection start
  const handleStartConnect = useCallback((nodeId: string, handleType: 'input' | 'output') => {
    if (handleType === 'output') {
      setConnectingFrom(nodeId);
    } else if (connectingFrom) {
      connectNodes(connectingFrom, nodeId);
      setConnectingFrom(null);
    }
  }, [connectingFrom, connectNodes]);

  // Update node status
  const updateNodeStatus = useCallback((nodeId: string, status: ExecutionStatus, result?: ExecutionResult) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n =>
        n.id === nodeId ? { ...n, status, result } : n
      ),
    }));
  }, []);

  // Save workflow
  const handleSave = useCallback(() => {
    saveWorkflow(workflow);
    setSavedWorkflows(getWorkflows());
  }, [workflow]);

  // Load workflow
  const loadWorkflow = useCallback((loaded: Workflow) => {
    setWorkflow(loaded);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setHistory([loaded]);
    setHistoryIndex(0);
  }, []);

  // Export workflow
  const exportWorkflow = useCallback(() => {
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflow]);

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setConnectingFrom(null);
    }
  };

  // Get selected node
  const selectedNode = selectedNodeId
    ? workflow.nodes.find(n => n.id === selectedNodeId)
    : null;

  // Get selected tool for properties
  const selectedTool = selectedNode?.type === 'tool'
    ? getToolById(selectedNode.data.toolId)
    : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/tools')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="h-6 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <WorkflowIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900"
              placeholder="Workflow name"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-200 mx-2" />
          
          <button
            onClick={exportWorkflow}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setShowRunner(!showRunner)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors',
              showRunner
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <Play className="w-4 h-4" />
            Run
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSidebarTab('tools')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  sidebarTab === 'tools'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Tools
              </button>
              <button
                onClick={() => setSidebarTab('properties')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  sidebarTab === 'properties'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Properties
              </button>
              <button
                onClick={() => setSidebarTab('saved')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  sidebarTab === 'saved'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Saved
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              {sidebarTab === 'tools' && (
                <div className="p-4 space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tools..."
                      className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:ring-0 text-sm"
                    />
                  </div>

                  {/* Control Nodes */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Control Flow</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addControlNode('condition')}
                        className="flex items-center gap-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <GitBranch className="w-4 h-4" />
                        Condition
                      </button>
                      <button
                        onClick={() => addControlNode('loop')}
                        className="flex items-center gap-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Loop
                      </button>
                      <button
                        onClick={() => addControlNode('transform')}
                        className="flex items-center gap-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Layers className="w-4 h-4" />
                        Transform
                      </button>
                      <button
                        onClick={() => addControlNode('variable')}
                        className="flex items-center gap-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Box className="w-4 h-4" />
                        Variable
                      </button>
                    </div>
                  </div>

                  {/* Tool List */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Tools ({filteredTools.length})
                    </h4>
                    <div className="space-y-1">
                      {filteredTools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => addNode(tool)}
                          className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-gray-200">
                            {tool.icon || '🔧'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {tool.category}
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {sidebarTab === 'properties' && (
                <div className="p-4">
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={selectedNode.data.label || ''}
                          onChange={(e) => {
                            setWorkflow(prev => ({
                              ...prev,
                              nodes: prev.nodes.map(n =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, label: e.target.value } }
                                  : n
                              ),
                            }));
                          }}
                          className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:border-black focus:ring-0"
                        />
                      </div>

                      {selectedTool && (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Tool Info
                            </h4>
                            <p className="text-sm text-gray-600">
                              {selectedTool.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Parameters
                            </h4>
                            <div className="space-y-3">
                              {Object.entries((selectedTool.inputSchema?.properties || {}) as Record<string, any>).map(
                                ([key, prop]) => (
                                  <div key={key}>
                                    <label className="block text-sm text-gray-600 mb-1">
                                      {key}
                                      {(selectedTool.inputSchema?.required as string[])?.includes(key) && (
                                        <span className="text-red-500 ml-1">*</span>
                                      )}
                                    </label>
                                    <input
                                      type={prop.type === 'number' ? 'number' : 'text'}
                                      value={String(selectedNode.data.parameters[key] ?? '')}
                                      onChange={(e) => {
                                        setWorkflow(prev => ({
                                          ...prev,
                                          nodes: prev.nodes.map(n =>
                                            n.id === selectedNode.id
                                              ? {
                                                  ...n,
                                                  data: {
                                                    ...n.data,
                                                    parameters: {
                                                      ...n.data.parameters,
                                                      [key]: e.target.value,
                                                    },
                                                  },
                                                }
                                              : n
                                          ),
                                        }));
                                      }}
                                      placeholder={prop.description}
                                      className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:border-black focus:ring-0"
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => deleteNode(selectedNode.id)}
                          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Node
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Settings className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Select a node to view properties</p>
                    </div>
                  )}
                </div>
              )}

              {sidebarTab === 'saved' && (
                <div className="p-4">
                  {savedWorkflows.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No saved workflows</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedWorkflows.map(w => (
                        <button
                          key={w.id}
                          onClick={() => loadWorkflow(w)}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{w.name}</p>
                            <p className="text-xs text-gray-500">
                              {w.nodes.length} nodes • {new Date(w.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteWorkflow(w.id);
                              setSavedWorkflows(getWorkflows());
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-72 top-1/2 -translate-y-1/2 z-10 p-1 bg-white border border-gray-200 rounded-r-lg shadow-sm"
          style={{ left: showSidebar ? '288px' : '0' }}
        >
          {showSidebar ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Canvas */}
        <main className="flex-1 relative overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              onClick={handleZoomReset}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                'p-2 rounded transition-colors',
                showGrid ? 'bg-gray-100' : 'hover:bg-gray-100'
              )}
              title="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Area */}
          <div
            ref={canvasRef}
            className={cn(
              'w-full h-full relative',
              showGrid && 'bg-[length:20px_20px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]'
            )}
            style={{
              backgroundPosition: `${offset.x}px ${offset.y}px`,
            }}
            onClick={handleCanvasClick}
          >
            {/* Workflow Nodes */}
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                transformOrigin: '0 0',
              }}
            >
              {/* Data Flow Edges */}
              <DataFlow
                nodes={workflow.nodes}
                edges={workflow.edges}
                selectedEdge={selectedEdgeId}
                onEdgeSelect={setSelectedEdgeId}
                onEdgeDelete={deleteEdge}
              />

              {/* Nodes */}
              {workflow.nodes.map(node => (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: node.position.x,
                    top: node.position.y,
                  }}
                >
                  <WorkflowNode
                    node={node}
                    isSelected={selectedNodeId === node.id}
                    isConnecting={connectingFrom !== null}
                    onSelect={setSelectedNodeId}
                    onDelete={deleteNode}
                    onDuplicate={duplicateNode}
                    onEdit={(id) => {
                      setSelectedNodeId(id);
                      setSidebarTab('properties');
                    }}
                    onStartConnect={handleStartConnect}
                  />
                </div>
              ))}

              {/* Empty State */}
              {workflow.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <WorkflowIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium text-gray-600">Start Building</h3>
                    <p className="text-sm mt-1">
                      Drag tools from the sidebar or click to add nodes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Runner Panel */}
          {showRunner && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <WorkflowRunner
                workflow={workflow}
                onNodeUpdate={updateNodeStatus}
                demoMode={true}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
