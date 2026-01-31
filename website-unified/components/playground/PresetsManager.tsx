'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { ParameterPreset, McpTool } from '@/lib/playground/types';
import { getToolById, SAMPLE_TOOLS } from '@/lib/playground/tools-data';
import { getPresets, savePreset, deletePreset } from '@/lib/playground/storage';
import {
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  StarOff,
  Download,
  Upload,
  Share2,
} from 'lucide-react';

interface PresetsManagerProps {
  toolId?: string;
  onSelectPreset?: (preset: ParameterPreset) => void;
  onApplyPreset?: (parameters: Record<string, unknown>) => void;
  className?: string;
}

export function PresetsManager({
  toolId,
  onSelectPreset,
  onApplyPreset,
  className,
}: PresetsManagerProps) {
  const [presets, setPresets] = useState<ParameterPreset[]>(() => getPresets());
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPreset, setNewPreset] = useState<Partial<ParameterPreset>>({
    name: '',
    description: '',
    toolId: toolId || '',
    parameters: {},
    isDefault: false,
  });

  // Filter presets
  const filteredPresets = useMemo(() => {
    let result = presets;

    // Filter by tool if specified
    if (toolId) {
      result = result.filter(p => p.toolId === toolId);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Sort: default first, then by name
    result.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [presets, toolId, searchQuery]);

  // Group presets by tool
  const groupedPresets = useMemo(() => {
    if (toolId) return { [toolId]: filteredPresets };

    const groups: Record<string, ParameterPreset[]> = {};
    for (const preset of filteredPresets) {
      if (!groups[preset.toolId]) groups[preset.toolId] = [];
      groups[preset.toolId].push(preset);
    }
    return groups;
  }, [filteredPresets, toolId]);

  // Create preset
  const handleCreate = () => {
    if (!newPreset.name || !newPreset.toolId) return;

    const preset: ParameterPreset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newPreset.name,
      description: newPreset.description,
      toolId: newPreset.toolId,
      parameters: newPreset.parameters || {},
      isDefault: newPreset.isDefault || false,
      isPublic: false,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    savePreset(preset);
    setPresets(getPresets());
    setShowCreateModal(false);
    setNewPreset({
      name: '',
      description: '',
      toolId: toolId || '',
      parameters: {},
      isDefault: false,
    });
  };

  // Delete preset
  const handleDelete = (presetId: string) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;
    deletePreset(presetId);
    setPresets(getPresets());
  };

  // Toggle default
  const toggleDefault = (preset: ParameterPreset) => {
    const updated: ParameterPreset = {
      ...preset,
      isDefault: !preset.isDefault,
      updatedAt: new Date(),
    };
    savePreset(updated);
    setPresets(getPresets());
  };

  // Rename preset
  const handleRename = (presetId: string) => {
    if (!editingName.trim()) return;
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    const updated: ParameterPreset = {
      ...preset,
      name: editingName.trim(),
      updatedAt: new Date(),
    };
    savePreset(updated);
    setPresets(getPresets());
    setEditingId(null);
    setEditingName('');
  };

  // Duplicate preset
  const duplicatePreset = (preset: ParameterPreset) => {
    const duplicate: ParameterPreset = {
      ...preset,
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${preset.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    savePreset(duplicate);
    setPresets(getPresets());
  };

  // Export presets
  const exportPresets = () => {
    const data = JSON.stringify(filteredPresets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcp-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import presets
  const importPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          for (const preset of imported) {
            if (preset.name && preset.toolId && preset.parameters) {
              savePreset({
                ...preset,
                id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }
          setPresets(getPresets());
        }
      } catch (error) {
        console.error('Failed to import presets:', error);
        alert('Failed to import presets. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search presets..."
              className="w-56 h-9 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:ring-0 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportPresets}
            className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importPresets}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Preset
          </button>
        </div>
      </div>

      {/* Presets List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedPresets).length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600">No presets yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create presets to save frequently used parameter configurations
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Preset
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {Object.entries(groupedPresets).map(([groupToolId, groupPresets]) => {
              const tool = getToolById(groupToolId);
              return (
                <div key={groupToolId}>
                  {!toolId && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50">
                      <span className="text-lg">{tool?.icon || '🔧'}</span>
                      <h4 className="font-medium text-gray-700">{tool?.name || groupToolId}</h4>
                      <span className="text-xs text-gray-400">({groupPresets.length})</span>
                    </div>
                  )}

                  {groupPresets.map(preset => (
                    <div
                      key={preset.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                        {/* Expand toggle */}
                        <button
                          onClick={() => setExpandedId(expandedId === preset.id ? null : preset.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedId === preset.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {/* Default indicator */}
                        <button
                          onClick={() => toggleDefault(preset)}
                          className={cn(
                            'transition-colors',
                            preset.isDefault
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-500'
                          )}
                          title={preset.isDefault ? 'Remove default' : 'Set as default'}
                        >
                          {preset.isDefault ? (
                            <Star className="w-4 h-4 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </button>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          {editingId === preset.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onBlur={() => handleRename(preset.id)}
                              onKeyDown={(e) => e.key === 'Enter' && handleRename(preset.id)}
                              autoFocus
                              className="w-full h-8 px-2 border border-gray-300 rounded focus:border-black focus:ring-0"
                            />
                          ) : (
                            <div>
                              <h4 className="font-medium text-gray-900">{preset.name}</h4>
                              {preset.description && (
                                <p className="text-sm text-gray-500 truncate">{preset.description}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Param count */}
                        <span className="text-xs text-gray-400">
                          {Object.keys(preset.parameters).length} params
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onApplyPreset?.(preset.parameters)}
                            className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(preset.id);
                              setEditingName(preset.name);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicatePreset(preset)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(preset.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedId === preset.id && (
                        <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                          <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Parameters
                          </h5>
                          <pre className="p-3 bg-white rounded-lg text-xs font-mono overflow-x-auto border border-gray-200">
                            {JSON.stringify(preset.parameters, null, 2)}
                          </pre>
                          <p className="mt-2 text-xs text-gray-400">
                            Created: {new Date(preset.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Preset</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newPreset.name}
                  onChange={(e) => setNewPreset(p => ({ ...p, name: e.target.value }))}
                  placeholder="My Preset"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:border-black focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newPreset.description}
                  onChange={(e) => setNewPreset(p => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:border-black focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tool *
                </label>
                <select
                  value={newPreset.toolId}
                  onChange={(e) => setNewPreset(p => ({ ...p, toolId: e.target.value }))}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:border-black focus:ring-0"
                >
                  <option value="">Select a tool...</option>
                  {SAMPLE_TOOLS.map(tool => (
                    <option key={tool.id} value={tool.id}>
                      {tool.icon || '🔧'} {tool.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newPreset.isDefault}
                  onChange={(e) => setNewPreset(p => ({ ...p, isDefault: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default preset for this tool
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newPreset.name || !newPreset.toolId}
                  className="flex-1 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PresetsManager;
