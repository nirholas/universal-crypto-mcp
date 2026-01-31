'use client';

/**
 * Market Screener Component
 * 
 * Advanced filtering and screening for tokens with customizable filters,
 * saved presets, and export functionality.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { TokenData, ScreenerFilter, ScreenerPreset } from '@/lib/analytics/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface MarketScreenerProps {
  tokens: TokenData[];
  presets?: ScreenerPreset[];
  onSavePreset?: (preset: Omit<ScreenerPreset, 'id' | 'createdAt'>) => void;
  onExport?: (tokens: TokenData[], format: 'csv' | 'json') => void;
  className?: string;
}

interface FilterConfig {
  field: keyof TokenData;
  label: string;
  type: 'range' | 'select';
  options?: { value: string; label: string }[];
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

// ============================================================================
// Filter Configurations
// ============================================================================

const FILTER_CONFIGS: FilterConfig[] = [
  {
    field: 'marketCap',
    label: 'Market Cap',
    type: 'range',
    unit: 'USD',
    min: 0,
    max: 1000000000000,
  },
  {
    field: 'volume24h',
    label: '24h Volume',
    type: 'range',
    unit: 'USD',
    min: 0,
    max: 50000000000,
  },
  {
    field: 'price',
    label: 'Price',
    type: 'range',
    unit: 'USD',
    min: 0,
    max: 100000,
    step: 0.01,
  },
  {
    field: 'change24h',
    label: '24h Change',
    type: 'range',
    unit: '%',
    min: -100,
    max: 1000,
    step: 0.1,
  },
  {
    field: 'change7d',
    label: '7d Change',
    type: 'range',
    unit: '%',
    min: -100,
    max: 1000,
    step: 0.1,
  },
  {
    field: 'change30d',
    label: '30d Change',
    type: 'range',
    unit: '%',
    min: -100,
    max: 5000,
    step: 0.1,
  },
];

// ============================================================================
// Quick Filter Presets
// ============================================================================

const QUICK_PRESETS = [
  {
    name: 'Large Cap',
    filters: [{ field: 'marketCap' as keyof TokenData, operator: 'gt' as const, value: 10000000000 }],
  },
  {
    name: 'Top Gainers (24h)',
    filters: [{ field: 'change24h' as keyof TokenData, operator: 'gt' as const, value: 10 }],
  },
  {
    name: 'Top Losers (24h)',
    filters: [{ field: 'change24h' as keyof TokenData, operator: 'lt' as const, value: -10 }],
  },
  {
    name: 'High Volume',
    filters: [{ field: 'volume24h' as keyof TokenData, operator: 'gt' as const, value: 1000000000 }],
  },
  {
    name: 'Low Cap Gems',
    filters: [
      { field: 'marketCap' as keyof TokenData, operator: 'lt' as const, value: 100000000 },
      { field: 'change7d' as keyof TokenData, operator: 'gt' as const, value: 20 },
    ],
  },
];

// ============================================================================
// Filter Row Component
// ============================================================================

interface FilterRowProps {
  config: FilterConfig;
  filter: ScreenerFilter | null;
  onChange: (filter: ScreenerFilter | null) => void;
}

function FilterRow({ config, filter, onChange }: FilterRowProps) {
  const [operator, setOperator] = useState<ScreenerFilter['operator']>(
    filter?.operator || 'gt'
  );
  const [value, setValue] = useState<string>(
    filter?.value !== undefined ? String(filter.value) : ''
  );
  const [minValue, setMinValue] = useState<string>(
    Array.isArray(filter?.value) ? String(filter.value[0]) : ''
  );
  const [maxValue, setMaxValue] = useState<string>(
    Array.isArray(filter?.value) ? String(filter.value[1]) : ''
  );
  const [isActive, setIsActive] = useState(filter !== null);

  const handleToggle = () => {
    if (isActive) {
      onChange(null);
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const handleUpdate = useCallback(() => {
    if (!isActive) return;

    if (operator === 'between') {
      if (minValue && maxValue) {
        onChange({
          field: config.field,
          operator: 'between',
          value: [parseFloat(minValue), parseFloat(maxValue)],
        });
      }
    } else {
      if (value) {
        onChange({
          field: config.field,
          operator,
          value: parseFloat(value),
        });
      }
    }
  }, [isActive, operator, value, minValue, maxValue, config.field, onChange]);

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all',
      isActive ? 'border-black bg-gray-50' : 'border-gray-200'
    )}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="font-medium">{config.label}</span>
        </label>
      </div>

      {isActive && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as ScreenerFilter['operator'])}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="gt">Greater than</option>
            <option value="lt">Less than</option>
            <option value="eq">Equal to</option>
            <option value="between">Between</option>
          </select>

          {operator === 'between' ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  onBlur={handleUpdate}
                  placeholder="Min"
                  className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  onBlur={handleUpdate}
                  placeholder="Max"
                  className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
            </>
          ) : (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleUpdate}
              placeholder="Value"
              step={config.step || 1}
              className="w-40 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          )}

          {config.unit && (
            <span className="text-sm text-gray-500">{config.unit}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Results Table Component
// ============================================================================

interface ResultsTableProps {
  tokens: TokenData[];
  onSort: (field: keyof TokenData) => void;
  sortField: keyof TokenData | null;
  sortDir: 'asc' | 'desc';
}

function ResultsTable({ tokens, onSort, sortField, sortDir }: ResultsTableProps) {
  const SortHeader = ({ 
    field, 
    children 
  }: { 
    field: keyof TokenData; 
    children: React.ReactNode 
  }) => (
    <th
      className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <SortHeader field="rank">#</SortHeader>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <SortHeader field="price">Price</SortHeader>
            <SortHeader field="change24h">24h %</SortHeader>
            <SortHeader field="change7d">7d %</SortHeader>
            <SortHeader field="marketCap">Market Cap</SortHeader>
            <SortHeader field="volume24h">Volume (24h)</SortHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tokens.map((token) => (
            <tr key={token.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-500">{token.rank}</td>
              <td className="px-4 py-4">
                <a
                  href={`/analytics/token/${token.symbol.toLowerCase()}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold">{token.name}</div>
                    <div className="text-xs text-gray-500">{token.symbol}</div>
                  </div>
                </a>
              </td>
              <td className="px-4 py-4 font-medium">{formatCurrency(token.price)}</td>
              <td className={cn(
                'px-4 py-4 font-medium',
                token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {formatPercentage(token.change24h)}
              </td>
              <td className={cn(
                'px-4 py-4 font-medium',
                token.change7d >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {formatPercentage(token.change7d)}
              </td>
              <td className="px-4 py-4">${formatNumber(token.marketCap)}</td>
              <td className="px-4 py-4 text-gray-600">${formatNumber(token.volume24h)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {tokens.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No tokens match your filters. Try adjusting your criteria.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function MarketScreener({
  tokens,
  presets = [],
  onSavePreset,
  onExport,
  className,
}: MarketScreenerProps) {
  const [filters, setFilters] = useState<Map<keyof TokenData, ScreenerFilter>>(new Map());
  const [sortField, setSortField] = useState<keyof TokenData | null>('marketCap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(true);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  // Apply filters
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      for (const filter of filters.values()) {
        const value = token[filter.field];
        if (typeof value !== 'number') continue;

        switch (filter.operator) {
          case 'gt':
            if (value <= (filter.value as number)) return false;
            break;
          case 'lt':
            if (value >= (filter.value as number)) return false;
            break;
          case 'eq':
            if (value !== filter.value) return false;
            break;
          case 'between':
            const [min, max] = filter.value as [number, number];
            if (value < min || value > max) return false;
            break;
        }
      }
      return true;
    });
  }, [tokens, filters]);

  // Apply sorting
  const sortedTokens = useMemo(() => {
    if (!sortField) return filteredTokens;

    return [...filteredTokens].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredTokens, sortField, sortDir]);

  const handleFilterChange = (field: keyof TokenData, filter: ScreenerFilter | null) => {
    setFilters((prev) => {
      const next = new Map(prev);
      if (filter) {
        next.set(field, filter);
      } else {
        next.delete(field);
      }
      return next;
    });
  };

  const handleSort = (field: keyof TokenData) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleQuickPreset = (preset: typeof QUICK_PRESETS[0]) => {
    const newFilters = new Map<keyof TokenData, ScreenerFilter>();
    preset.filters.forEach((f) => {
      newFilters.set(f.field, f);
    });
    setFilters(newFilters);
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset({
        name: presetName.trim(),
        filters: Array.from(filters.values()),
      });
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const handleClearFilters = () => {
    setFilters(new Map());
  };

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Market Screener</h3>
            <p className="mt-1 text-sm text-gray-500">
              {sortedTokens.length} of {tokens.length} tokens match your criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                showFilters
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {filters.size > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                  {filters.size}
                </span>
              )}
            </button>

            {onExport && (
              <div className="flex gap-2">
                <button
                  onClick={() => onExport(sortedTokens, 'csv')}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => onExport(sortedTokens, 'json')}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Export JSON
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleQuickPreset(preset)}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              {preset.name}
            </button>
          ))}
          {filters.size > 0 && (
            <button
              onClick={handleClearFilters}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b border-gray-200 bg-gray-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FILTER_CONFIGS.map((config) => (
              <FilterRow
                key={config.field}
                config={config}
                filter={filters.get(config.field) || null}
                onChange={(filter) => handleFilterChange(config.field, filter)}
              />
            ))}
          </div>

          {/* Save Preset */}
          {onSavePreset && (
            <div className="mt-4 flex items-center gap-3">
              {showSavePreset ? (
                <>
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name..."
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={handleSavePreset}
                    disabled={!presetName.trim()}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSavePreset(false)}
                    className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowSavePreset(true)}
                  disabled={filters.size === 0}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Save as Preset
                </button>
              )}
            </div>
          )}

          {/* Saved Presets */}
          {presets.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Saved Presets</div>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      const newFilters = new Map<keyof TokenData, ScreenerFilter>();
                      preset.filters.forEach((f) => {
                        newFilters.set(f.field, f);
                      });
                      setFilters(newFilters);
                    }}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Table */}
      <ResultsTable
        tokens={sortedTokens}
        onSort={handleSort}
        sortField={sortField}
        sortDir={sortDir}
      />
    </div>
  );
}

export default MarketScreener;
