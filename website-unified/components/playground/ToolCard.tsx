'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { McpTool, ToolComplexity } from '@/lib/playground/types';
import { getCategoryById } from '@/lib/playground/categories';
import {
  Play,
  Star,
  ExternalLink,
  Zap,
  Shield,
  Lock,
  Coins,
} from 'lucide-react';

interface ToolCardProps {
  tool: McpTool;
  isFavorite?: boolean;
  onFavoriteToggle?: (toolId: string) => void;
  onQuickRun?: (tool: McpTool) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const COMPLEXITY_CONFIG: Record<ToolComplexity, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'text-green-700', bg: 'bg-green-100' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  advanced: { label: 'Advanced', color: 'text-orange-700', bg: 'bg-orange-100' },
  expert: { label: 'Expert', color: 'text-red-700', bg: 'bg-red-100' },
};

export function ToolCard({
  tool,
  isFavorite = false,
  onFavoriteToggle,
  onQuickRun,
  variant = 'default',
  className,
}: ToolCardProps) {
  const category = getCategoryById(tool.category);
  const complexityConfig = COMPLEXITY_CONFIG[tool.complexity];
  const hasWritePermission = tool.permissions.some(p => p.type === 'write' || p.type === 'sign');
  const isPaid = tool.pricing?.type !== 'free';

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200',
          'hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer',
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 truncate">{tool.name}</h4>
            {isPaid && <Coins className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 truncate">{category?.name}</p>
        </div>
        <Link
          href={`/playground/tool/${tool.id}`}
          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          <Play className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'bg-white rounded-2xl border-2 border-gray-200 p-6',
          'hover:border-gray-300 hover:shadow-lg transition-all',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 truncate">{tool.name}</h3>
              {hasWritePermission && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                  <Lock className="w-3 h-3" />
                  Write
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {tool.longDescription || tool.description}
            </p>
          </div>
          {onFavoriteToggle && (
            <button
              onClick={() => onFavoriteToggle(tool.id)}
              className={cn(
                'p-2 rounded-full transition-colors',
                isFavorite
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
              )}
            >
              <Star className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            {category?.name}
          </span>
          <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full', complexityConfig.bg, complexityConfig.color)}>
            {complexityConfig.label}
          </span>
          {isPaid && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
              <Coins className="w-3 h-3" />
              {tool.pricing?.cost} {tool.pricing?.unit || 'credits'}
            </span>
          )}
          {tool.chains && tool.chains.length > 0 && (
            <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              {tool.chains.length} chains
            </span>
          )}
        </div>

        {/* Tags */}
        {tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tool.tags.slice(0, 5).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs text-gray-500 bg-gray-50 rounded"
              >
                #{tag}
              </span>
            ))}
            {tool.tags.length > 5 && (
              <span className="px-2 py-0.5 text-xs text-gray-400">
                +{tool.tags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          {onQuickRun && (
            <button
              onClick={() => onQuickRun(tool)}
              className="flex-1 flex items-center justify-center gap-2 h-10 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Play className="w-4 h-4" />
              Try Now
            </button>
          )}
          <Link
            href={`/playground/tool/${tool.id}`}
            className="flex items-center justify-center gap-2 h-10 px-4 text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-black transition-colors"
          >
            View Details
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'group bg-white rounded-xl border-2 border-gray-200 p-5',
        'hover:border-gray-300 hover:shadow-md transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{tool.name}</h4>
            {hasWritePermission && (
              <Lock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            )}
            {isPaid && (
              <Coins className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
        </div>
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle(tool.id);
            }}
            className={cn(
              'p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100',
              isFavorite
                ? 'text-amber-500 opacity-100'
                : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
            )}
          >
            <Star className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
          {category?.name}
        </span>
        <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', complexityConfig.bg, complexityConfig.color)}>
          {complexityConfig.label}
        </span>
      </div>

      {/* Quick Action */}
      <Link
        href={`/playground/tool/${tool.id}`}
        className={cn(
          'flex items-center justify-center gap-2 h-9 w-full text-sm font-medium rounded-lg transition-all',
          'bg-gray-100 text-gray-700 hover:bg-black hover:text-white'
        )}
      >
        <Play className="w-3.5 h-3.5" />
        Try Tool
      </Link>
    </div>
  );
}

// Grid component for displaying multiple tools
interface ToolGridProps {
  tools: McpTool[];
  favorites?: string[];
  onFavoriteToggle?: (toolId: string) => void;
  onQuickRun?: (tool: McpTool) => void;
  variant?: 'default' | 'compact' | 'detailed';
  columns?: 1 | 2 | 3 | 4;
  emptyMessage?: string;
  className?: string;
}

export function ToolGrid({
  tools,
  favorites = [],
  onFavoriteToggle,
  onQuickRun,
  variant = 'default',
  columns = 3,
  emptyMessage = 'No tools found',
  className,
}: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Zap className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {tools.map(tool => (
        <ToolCard
          key={tool.id}
          tool={tool}
          isFavorite={favorites.includes(tool.id)}
          onFavoriteToggle={onFavoriteToggle}
          onQuickRun={onQuickRun}
          variant={variant}
        />
      ))}
    </div>
  );
}

export default ToolCard;
