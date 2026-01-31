/**
 * Playground Storage - Local storage and persistence for playground data
 * @module lib/playground/storage
 */

import { 
  ExecutionHistoryItem, 
  ParameterPreset, 
  Workflow, 
  Workspace,
  SharedItem 
} from './types';

const STORAGE_KEYS = {
  WORKSPACE: 'playground_workspace',
  EXECUTIONS: 'playground_executions',
  WORKFLOWS: 'playground_workflows',
  PRESETS: 'playground_presets',
  FAVORITES: 'playground_favorites',
  RECENT_TOOLS: 'playground_recent_tools',
  SETTINGS: 'playground_settings',
} as const;

const MAX_HISTORY_ITEMS = 100;
const MAX_RECENT_TOOLS = 20;

// ============================================================================
// Workspace Management
// ============================================================================

/**
 * Get the current workspace
 */
export function getWorkspace(): Workspace | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WORKSPACE);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Save the workspace
 */
export function saveWorkspace(workspace: Workspace): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.WORKSPACE, JSON.stringify(workspace));
  } catch (error) {
    console.error('Failed to save workspace:', error);
  }
}

/**
 * Initialize a new workspace
 */
export function initializeWorkspace(): Workspace {
  const workspace: Workspace = {
    id: `ws_${Date.now()}`,
    name: 'My Workspace',
    folders: [],
    executions: [],
    workflows: [],
    presets: [],
    favoriteTools: [],
    recentTools: [],
    settings: {
      defaultChain: 'ethereum',
      autoSaveHistory: true,
      maxHistoryItems: MAX_HISTORY_ITEMS,
      theme: 'system',
    },
  };

  saveWorkspace(workspace);
  return workspace;
}

// ============================================================================
// Execution History
// ============================================================================

/**
 * Get execution history
 */
export function getExecutionHistory(): ExecutionHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXECUTIONS);
    if (!stored) return [];

    const items = JSON.parse(stored) as ExecutionHistoryItem[];
    // Convert date strings back to Date objects
    return items.map(item => ({
      ...item,
      startTime: new Date(item.startTime),
      endTime: item.endTime ? new Date(item.endTime) : undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Save an execution to history
 */
export function saveExecution(execution: ExecutionHistoryItem): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getExecutionHistory();
    history.unshift(execution);

    // Limit history size
    const limited = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save execution:', error);
  }
}

/**
 * Delete an execution from history
 */
export function deleteExecution(executionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getExecutionHistory();
    const filtered = history.filter(e => e.id !== executionId);
    localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete execution:', error);
  }
}

/**
 * Clear all execution history
 */
export function clearExecutionHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.EXECUTIONS);
}

/**
 * Toggle favorite status of an execution
 */
export function toggleExecutionFavorite(executionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getExecutionHistory();
    const updated = history.map(e => 
      e.id === executionId ? { ...e, favorite: !e.favorite } : e
    );
    localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
}

// ============================================================================
// Workflows
// ============================================================================

/**
 * Get saved workflows
 */
export function getWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
    if (!stored) return [];

    const workflows = JSON.parse(stored) as Workflow[];
    return workflows.map(w => ({
      ...w,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
    }));
  } catch {
    return [];
  }
}

/**
 * Save a workflow
 */
export function saveWorkflow(workflow: Workflow): void {
  if (typeof window === 'undefined') return;

  try {
    const workflows = getWorkflows();
    const existingIndex = workflows.findIndex(w => w.id === workflow.id);

    if (existingIndex >= 0) {
      workflows[existingIndex] = workflow;
    } else {
      workflows.unshift(workflow);
    }

    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
  } catch (error) {
    console.error('Failed to save workflow:', error);
  }
}

/**
 * Delete a workflow
 */
export function deleteWorkflow(workflowId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const workflows = getWorkflows();
    const filtered = workflows.filter(w => w.id !== workflowId);
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete workflow:', error);
  }
}

// ============================================================================
// Parameter Presets
// ============================================================================

/**
 * Get parameter presets
 */
export function getPresets(): ParameterPreset[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!stored) return [];

    const presets = JSON.parse(stored) as ParameterPreset[];
    return presets.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch {
    return [];
  }
}

/**
 * Get presets for a specific tool
 */
export function getPresetsForTool(toolId: string): ParameterPreset[] {
  return getPresets().filter(p => p.toolId === toolId);
}

/**
 * Save a preset
 */
export function savePreset(preset: ParameterPreset): void {
  if (typeof window === 'undefined') return;

  try {
    const presets = getPresets();
    const existingIndex = presets.findIndex(p => p.id === preset.id);

    if (existingIndex >= 0) {
      presets[existingIndex] = preset;
    } else {
      presets.unshift(preset);
    }

    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save preset:', error);
  }
}

/**
 * Delete a preset
 */
export function deletePreset(presetId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const presets = getPresets();
    const filtered = presets.filter(p => p.id !== presetId);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete preset:', error);
  }
}

// ============================================================================
// Favorites & Recent Tools
// ============================================================================

/**
 * Get favorite tool IDs
 */
export function getFavoriteTools(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle favorite status of a tool
 */
export function toggleFavoriteTool(toolId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavoriteTools();
    const index = favorites.indexOf(toolId);

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.unshift(toolId);
    }

    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return index < 0; // Return new favorite status
  } catch {
    return false;
  }
}

/**
 * Get recently used tool IDs
 */
export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_TOOLS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a tool to recent tools
 */
export function addRecentTool(toolId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const recent = getRecentTools();
    const filtered = recent.filter(id => id !== toolId);
    filtered.unshift(toolId);
    const limited = filtered.slice(0, MAX_RECENT_TOOLS);
    localStorage.setItem(STORAGE_KEYS.RECENT_TOOLS, JSON.stringify(limited));
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// Sharing
// ============================================================================

/**
 * Generate a share code for an item
 */
export function generateShareCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a shareable URL for an execution
 */
export function createShareUrl(execution: ExecutionHistoryItem): string {
  const data = {
    toolId: execution.toolId,
    parameters: execution.parameters,
  };
  const encoded = btoa(JSON.stringify(data));
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/playground/share/${encoded}`;
}

/**
 * Parse a share URL
 */
export function parseShareUrl(encoded: string): { toolId: string; parameters: Record<string, unknown> } | null {
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ============================================================================
// Export/Import
// ============================================================================

/**
 * Export all playground data
 */
export function exportPlaygroundData(): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    executions: getExecutionHistory(),
    workflows: getWorkflows(),
    presets: getPresets(),
    favorites: getFavoriteTools(),
    recentTools: getRecentTools(),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import playground data
 */
export function importPlaygroundData(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString);

    if (!data.version) {
      return { success: false, error: 'Invalid export format' };
    }

    if (data.executions) {
      localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(data.executions));
    }
    if (data.workflows) {
      localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(data.workflows));
    }
    if (data.presets) {
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(data.presets));
    }
    if (data.favorites) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
    }
    if (data.recentTools) {
      localStorage.setItem(STORAGE_KEYS.RECENT_TOOLS, JSON.stringify(data.recentTools));
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Clear all playground data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
