/**
 * Playground Types - Type definitions for the MCP Tool Playground
 * @module lib/playground/types
 */

// ============================================================================
// Tool Categories
// ============================================================================

export type ToolCategoryId =
  | 'blockchain-evm'
  | 'blockchain-solana'
  | 'blockchain-multichain'
  | 'defi-lending'
  | 'defi-dex'
  | 'defi-staking'
  | 'defi-yield'
  | 'trading-cex'
  | 'trading-bots'
  | 'trading-signals'
  | 'market-data-prices'
  | 'market-data-analytics'
  | 'market-data-onchain'
  | 'wallets-management'
  | 'wallets-signing'
  | 'wallets-ens'
  | 'nft-trading'
  | 'nft-analytics'
  | 'nft-metadata'
  | 'security-audit'
  | 'security-scanning'
  | 'security-monitoring'
  | 'ai-agents-frameworks'
  | 'ai-agents-orchestration'
  | 'infrastructure'
  | 'payments'
  | 'social'
  | 'governance'
  | 'analytics';

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  description: string;
  icon: string;
  parentId?: ToolCategoryId;
  subcategories?: ToolCategory[];
  toolCount: number;
}

// ============================================================================
// Tool Schema Types
// ============================================================================

export interface JsonSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'integer';
  description?: string;
  enum?: (string | number | boolean)[];
  default?: unknown;
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  examples?: unknown[];
}

export interface ToolInputSchema {
  type: 'object';
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolOutputSchema {
  type: string;
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
  description?: string;
}

// ============================================================================
// Tool Definition
// ============================================================================

export type ToolComplexity = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface ToolPermission {
  type: 'read' | 'write' | 'sign' | 'admin';
  description: string;
  required: boolean;
}

export interface ToolExample {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  expectedOutput?: unknown;
}

export interface McpTool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: ToolCategoryId;
  subcategory?: string;
  version: string;
  icon?: string;
  inputSchema: ToolInputSchema;
  outputSchema?: ToolOutputSchema;
  complexity: ToolComplexity;
  permissions: ToolPermission[];
  examples: ToolExample[];
  tags: string[];
  chains?: string[];
  deprecated?: boolean;
  deprecatedMessage?: string;
  relatedTools?: string[];
  documentation?: string;
  pricing?: {
    type: 'free' | 'paid' | 'credits';
    cost?: number;
    unit?: string;
  };
  stats?: {
    usageCount: number;
    successRate: number;
    avgLatency: number;
    lastUsed?: Date;
  };
}

// ============================================================================
// Execution Types
// ============================================================================

export type ExecutionStatus = 'idle' | 'pending' | 'running' | 'success' | 'error' | 'cancelled';

export interface ExecutionContent {
  type: 'text' | 'image' | 'json' | 'table' | 'chart' | 'resource';
  data: unknown;
  mimeType?: string;
}

export interface ExecutionResult {
  id: string;
  toolId: string;
  toolName: string;
  status: ExecutionStatus;
  parameters: Record<string, unknown>;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  content?: ExecutionContent[];
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    chain?: string;
    transactionHash?: string;
    blockNumber?: number;
    gasUsed?: string;
  };
}

export interface ExecutionHistoryItem extends ExecutionResult {
  favorite: boolean;
  notes?: string;
  preset?: string;
}

// ============================================================================
// Workflow Types
// ============================================================================

export interface WorkflowNodePosition {
  x: number;
  y: number;
}

export interface WorkflowNodeData {
  toolId: string;
  parameters: Record<string, unknown>;
  parameterMappings?: Record<string, string>; // Maps to other node outputs
  label?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'tool' | 'condition' | 'loop' | 'transform' | 'variable';
  position: WorkflowNodePosition;
  data: WorkflowNodeData;
  status?: ExecutionStatus;
  result?: ExecutionResult;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface WorkflowExecutionResult {
  workflowId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  nodeResults: Record<string, ExecutionResult>;
  finalOutput?: unknown;
  error?: {
    nodeId: string;
    error: ExecutionResult['error'];
  };
}

// ============================================================================
// Preset Types
// ============================================================================

export interface ParameterPreset {
  id: string;
  name: string;
  toolId: string;
  parameters: Record<string, unknown>;
  description?: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  usageCount: number;
}

// ============================================================================
// Code Generation Types
// ============================================================================

export type CodeLanguage = 'typescript' | 'javascript' | 'python' | 'rust' | 'go' | 'curl';

export interface GeneratedCode {
  language: CodeLanguage;
  code: string;
  sdkVersion?: string;
  dependencies?: string[];
}

// ============================================================================
// Sharing Types
// ============================================================================

export interface SharedItem {
  id: string;
  type: 'execution' | 'workflow' | 'preset' | 'template';
  shareCode: string;
  createdAt: Date;
  expiresAt?: Date;
  views: number;
  isPublic: boolean;
  ownerId?: string;
}

// ============================================================================
// Workspace Types
// ============================================================================

export interface WorkspaceFolder {
  id: string;
  name: string;
  parentId?: string;
  children: string[];
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  folders: WorkspaceFolder[];
  executions: ExecutionHistoryItem[];
  workflows: Workflow[];
  presets: ParameterPreset[];
  favoriteTools: string[];
  recentTools: string[];
  settings: {
    defaultChain: string;
    autoSaveHistory: boolean;
    maxHistoryItems: number;
    theme: 'light' | 'dark' | 'system';
  };
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface ToolSearchQuery {
  text?: string;
  categories?: ToolCategoryId[];
  complexity?: ToolComplexity[];
  chains?: string[];
  tags?: string[];
  hasExamples?: boolean;
  isFree?: boolean;
  sortBy?: 'name' | 'popularity' | 'recent' | 'complexity';
  sortOrder?: 'asc' | 'desc';
}

export interface ToolSearchResult {
  tools: McpTool[];
  total: number;
  facets: {
    categories: Record<ToolCategoryId, number>;
    complexity: Record<ToolComplexity, number>;
    chains: Record<string, number>;
    tags: Record<string, number>;
  };
}
