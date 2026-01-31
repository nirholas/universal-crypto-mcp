'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { McpTool, JsonSchemaProperty, ToolInputSchema } from '@/lib/playground/types';
import { validateParameters } from '@/lib/playground/execution';
import { getPresetsForTool } from '@/lib/playground/storage';
import {
  ChevronDown,
  HelpCircle,
  AlertCircle,
  Bookmark,
  Copy,
  RefreshCw,
} from 'lucide-react';

interface ParameterFormProps {
  tool: McpTool;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  showPresets?: boolean;
  className?: string;
}

export function ParameterForm({
  tool,
  values,
  onChange,
  errors = {},
  disabled = false,
  showPresets = true,
  className,
}: ParameterFormProps) {
  const [expandedDocs, setExpandedDocs] = useState<string[]>([]);
  const presets = showPresets ? getPresetsForTool(tool.id) : [];

  const schema = tool.inputSchema;
  const properties = schema.properties || {};
  const required = schema.required || [];

  // Initialize default values
  useEffect(() => {
    const defaults: Record<string, unknown> = {};
    let hasDefaults = false;

    for (const [key, prop] of Object.entries(properties)) {
      if (prop.default !== undefined && values[key] === undefined) {
        defaults[key] = prop.default;
        hasDefaults = true;
      }
    }

    if (hasDefaults) {
      onChange({ ...values, ...defaults });
    }
  }, [tool.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((key: string, value: unknown) => {
    onChange({ ...values, [key]: value });
  }, [values, onChange]);

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      onChange(preset.parameters);
    }
  };

  const clearForm = () => {
    const defaults: Record<string, unknown> = {};
    for (const [key, prop] of Object.entries(properties)) {
      if (prop.default !== undefined) {
        defaults[key] = prop.default;
      }
    }
    onChange(defaults);
  };

  const loadExample = (index: number = 0) => {
    if (tool.examples[index]) {
      onChange(tool.examples[index].parameters);
    }
  };

  const toggleDocs = (key: string) => {
    setExpandedDocs(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Parameters</h3>
        <div className="flex items-center gap-2">
          {tool.examples.length > 0 && (
            <button
              onClick={() => loadExample(0)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Copy className="w-3.5 h-3.5" />
              Load Example
            </button>
          )}
          {presets.length > 0 && (
            <select
              onChange={(e) => e.target.value && applyPreset(e.target.value)}
              disabled={disabled}
              className="h-7 px-2 text-xs border border-gray-200 rounded-lg focus:border-black focus:ring-0"
            >
              <option value="">Load Preset...</option>
              {presets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={clearForm}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Clear form"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {Object.entries(properties).map(([key, prop]) => {
          const isRequired = required.includes(key);
          const hasError = !!errors[key];
          const showDocs = expandedDocs.includes(key);

          return (
            <ParameterField
              key={key}
              name={key}
              property={prop}
              value={values[key]}
              onChange={(value) => handleChange(key, value)}
              isRequired={isRequired}
              error={errors[key]}
              disabled={disabled}
              showDocs={showDocs}
              onToggleDocs={() => toggleDocs(key)}
            />
          );
        })}
      </div>

      {/* No Parameters */}
      {Object.keys(properties).length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">This tool has no parameters</p>
        </div>
      )}
    </div>
  );
}

// Individual parameter field component
interface ParameterFieldProps {
  name: string;
  property: JsonSchemaProperty;
  value: unknown;
  onChange: (value: unknown) => void;
  isRequired: boolean;
  error?: string;
  disabled?: boolean;
  showDocs?: boolean;
  onToggleDocs?: () => void;
}

function ParameterField({
  name,
  property,
  value,
  onChange,
  isRequired,
  error,
  disabled = false,
  showDocs = false,
  onToggleDocs,
}: ParameterFieldProps) {
  const inputId = `param-${name}`;
  const hasError = !!error;

  // Determine input type based on property
  const renderInput = () => {
    // Enum - render as select
    if (property.enum && property.enum.length > 0) {
      return (
        <select
          id={inputId}
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 text-sm border rounded-lg transition-colors',
            'focus:outline-none focus:ring-0',
            hasError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-black'
          )}
        >
          <option value="">Select {name}...</option>
          {property.enum.map((opt) => (
            <option key={String(opt)} value={String(opt)}>
              {String(opt)}
            </option>
          ))}
        </select>
      );
    }

    // Boolean - render as toggle
    if (property.type === 'boolean') {
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          disabled={disabled}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            value ? 'bg-black' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              value ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      );
    }

    // Number/Integer
    if (property.type === 'number' || property.type === 'integer') {
      return (
        <input
          type="number"
          id={inputId}
          value={value !== undefined ? String(value) : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              onChange(undefined);
            } else {
              onChange(property.type === 'integer' ? parseInt(val, 10) : parseFloat(val));
            }
          }}
          min={property.minimum}
          max={property.maximum}
          disabled={disabled}
          placeholder={property.examples?.[0] !== undefined ? String(property.examples[0]) : undefined}
          className={cn(
            'w-full h-10 px-3 text-sm border rounded-lg transition-colors',
            'focus:outline-none focus:ring-0',
            hasError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-black'
          )}
        />
      );
    }

    // Array
    if (property.type === 'array') {
      const arrayValue = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          <textarea
            id={inputId}
            value={arrayValue.join('\n')}
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(l => l.trim());
              onChange(lines);
            }}
            disabled={disabled}
            placeholder="Enter each item on a new line"
            rows={3}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-lg transition-colors resize-none',
              'focus:outline-none focus:ring-0',
              hasError
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-black'
            )}
          />
          <p className="text-xs text-gray-400">
            {arrayValue.length} items
          </p>
        </div>
      );
    }

    // Object
    if (property.type === 'object') {
      const objValue = typeof value === 'object' && value !== null ? value : {};
      let jsonString = '';
      try {
        jsonString = JSON.stringify(objValue, null, 2);
      } catch {
        jsonString = '{}';
      }

      return (
        <textarea
          id={inputId}
          value={jsonString}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              // Keep the invalid JSON for editing
            }
          }}
          disabled={disabled}
          placeholder="{}"
          rows={4}
          className={cn(
            'w-full px-3 py-2 text-sm font-mono border rounded-lg transition-colors resize-none',
            'focus:outline-none focus:ring-0',
            hasError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-black'
          )}
        />
      );
    }

    // Default: String input
    // Check for special formats
    const isAddress = property.pattern?.includes('0x') || name.toLowerCase().includes('address');
    const isMultiline = (property.maxLength && property.maxLength > 200) || name.toLowerCase().includes('data');

    if (isMultiline) {
      return (
        <textarea
          id={inputId}
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={property.examples?.[0] !== undefined ? String(property.examples[0]) : undefined}
          rows={3}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-lg transition-colors resize-none',
            'focus:outline-none focus:ring-0',
            isAddress && 'font-mono',
            hasError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-black'
          )}
        />
      );
    }

    return (
      <input
        type="text"
        id={inputId}
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={property.examples?.[0] !== undefined ? String(property.examples[0]) : undefined}
        className={cn(
          'w-full h-10 px-3 text-sm border rounded-lg transition-colors',
          'focus:outline-none focus:ring-0',
          isAddress && 'font-mono',
          hasError
            ? 'border-red-300 focus:border-red-500'
            : 'border-gray-300 focus:border-black'
        )}
      />
    );
  };

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {name}
          {isRequired && <span className="text-red-500">*</span>}
          {property.description && (
            <button
              type="button"
              onClick={onToggleDocs}
              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </label>
        {property.default !== undefined && (
          <span className="text-xs text-gray-400">
            default: {String(property.default)}
          </span>
        )}
      </div>

      {/* Description */}
      {showDocs && property.description && (
        <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg">
          {property.description}
        </p>
      )}

      {/* Input */}
      {renderInput()}

      {/* Error */}
      {hasError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {/* Type hint */}
      {!hasError && property.type !== 'boolean' && (
        <p className="text-xs text-gray-400">
          Type: {property.type}
          {property.pattern && ' (pattern validated)'}
          {property.minimum !== undefined && ` (min: ${property.minimum})`}
          {property.maximum !== undefined && ` (max: ${property.maximum})`}
        </p>
      )}
    </div>
  );
}

export default ParameterForm;
