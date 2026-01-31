'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  MoreVertical,
  ArrowUpDown,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchKeys?: string[];
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  compact?: boolean;
}

// ============================================================
// DataTable
// ============================================================

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchable = false,
  searchKeys = [],
  onRowClick,
  selectable = false,
  onSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
  className,
  stickyHeader = false,
  striped = false,
  compact = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Filter data by search
  const filteredData = useMemo(() => {
    if (!search) return data;
    const keys = searchKeys.length > 0 ? searchKeys : columns.map(c => c.key);
    return data.filter(row =>
      keys.some(key => 
        String(row[key]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search, searchKeys, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleRowSelection = (index: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
    onSelectionChange?.(Array.from(newSelected).map(i => data[i]));
  };

  const toggleAllSelection = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
      onSelectionChange?.([]);
    } else {
      setSelected(new Set(data.map((_, i) => i)));
      onSelectionChange?.(data);
    }
  };

  return (
    <div className={cn('rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden', className)}>
      {/* Toolbar */}
      {searchable && (
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(
            'bg-white/5',
            stickyHeader && 'sticky top-0 z-10'
          )}>
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === data.length && data.length > 0}
                    onChange={toggleAllSelection}
                    className="rounded border-white/30"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 text-xs font-semibold text-white/60 uppercase tracking-wider',
                    compact ? 'py-2' : 'py-3',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer hover:text-white/80 transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {loading ? (
                // Loading skeleton
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    {selectable && <td className="px-4 py-3"><div className="w-4 h-4 bg-white/10 rounded animate-pulse" /></td>}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4', compact ? 'py-2' : 'py-3')}>
                        <div className="h-4 bg-white/10 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-4 py-12 text-center text-white/40"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, i) => {
                  const actualIndex = (currentPage - 1) * pageSize + i;
                  return (
                    <motion.tr
                      key={actualIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.02 }}
                      className={cn(
                        'border-t border-white/5 transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-white/5',
                        striped && i % 2 === 1 && 'bg-white/[0.02]',
                        selected.has(actualIndex) && 'bg-purple-500/10'
                      )}
                      onClick={() => onRowClick?.(row, actualIndex)}
                    >
                      {selectable && (
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(actualIndex)}
                            onChange={() => toggleRowSelection(actualIndex)}
                            className="rounded border-white/30"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            'px-4 text-white',
                            compact ? 'py-2' : 'py-3',
                            col.align === 'center' && 'text-center',
                            col.align === 'right' && 'text-right'
                          )}
                        >
                          {col.render
                            ? col.render(row[col.key], row, actualIndex)
                            : row[col.key]}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-white/60">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 -ml-2" />
            </button>
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-purple-500 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 -ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Simple Table for Quick Use
// ============================================================

interface SimpleTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
}

export function SimpleTable({ headers, rows, className }: SimpleTableProps) {
  return (
    <div className={cn('rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden', className)}>
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-white">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
