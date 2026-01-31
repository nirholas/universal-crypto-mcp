'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { McpTool, ToolCategoryId, ToolSearchQuery } from '@/lib/playground/types';
import { SAMPLE_TOOLS } from '@/lib/playground/tools-data';
import { searchTools } from '@/lib/playground/search';
import { getFavoriteTools, toggleFavoriteTool, getRecentTools } from '@/lib/playground/storage';
import { getTotalToolCount } from '@/lib/playground/categories';

import { ToolSearch } from '@/components/playground/ToolSearch';
import { CategoryNav } from '@/components/playground/CategoryNav';
import { ToolCard, ToolGrid } from '@/components/playground/ToolCard';

import {
  LayoutGrid,
  List,
  Star,
  Clock,
  TrendingUp,
  Filter,
  X,
} from 'lucide-react';

export default function ToolsExplorerPage() {
  // State
  const [searchResults, setSearchResults] = useState<McpTool[]>(SAMPLE_TOOLS);
  const [currentQuery, setCurrentQuery] = useState<ToolSearchQuery>({});
  const [selectedCategories, setSelectedCategories] = useState<ToolCategoryId[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteTools());

  // Get tools based on active tab
  const displayTools = useMemo(() => {
    if (activeTab === 'favorites') {
      return searchResults.filter(tool => favorites.includes(tool.id));
    }
    if (activeTab === 'recent') {
      const recentIds = getRecentTools();
      return recentIds
        .map(id => SAMPLE_TOOLS.find(t => t.id === id))
        .filter((t): t is McpTool => t !== undefined);
    }
    return searchResults;
  }, [activeTab, searchResults, favorites]);

  // Handle search
  const handleSearch = useCallback((results: McpTool[], query: ToolSearchQuery) => {
    setSearchResults(results);
    setCurrentQuery(query);
  }, []);

  // Handle category filter
  const handleCategorySelect = useCallback((categories: ToolCategoryId[]) => {
    setSelectedCategories(categories);
    // Re-run search with category filter
    const query = { ...currentQuery, categories };
    const results = searchTools(query, SAMPLE_TOOLS);
    setSearchResults(results.tools);
    setCurrentQuery(query);
  }, [currentQuery]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((toolId: string) => {
    toggleFavoriteTool(toolId);
    setFavorites(getFavoriteTools());
  }, []);

  // Calculate tool counts by category
  const toolCounts = useMemo(() => {
    const counts: Record<ToolCategoryId, number> = {} as Record<ToolCategoryId, number>;
    for (const tool of SAMPLE_TOOLS) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
    return counts;
  }, []);

  const totalTools = getTotalToolCount();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tool Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Browse and execute {totalTools}+ MCP tools across 19 categories
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <ToolSearch
            onSearch={handleSearch}
            showFilters={true}
            placeholder={`Search ${totalTools}+ tools...`}
          />
        </div>

        {/* Tabs & View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
            <TabButton
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              icon={<LayoutGrid className="w-4 h-4" />}
              label="All Tools"
              count={searchResults.length}
            />
            <TabButton
              active={activeTab === 'favorites'}
              onClick={() => setActiveTab('favorites')}
              icon={<Star className="w-4 h-4" />}
              label="Favorites"
              count={favorites.length}
            />
            <TabButton
              active={activeTab === 'recent'}
              onClick={() => setActiveTab('recent')}
              icon={<Clock className="w-4 h-4" />}
              label="Recent"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                showFilters
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {/* View Mode */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Filters:</span>
            {selectedCategories.map(catId => (
              <button
                key={catId}
                onClick={() => handleCategorySelect(selectedCategories.filter(c => c !== catId))}
                className="flex items-center gap-1.5 px-3 py-1 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                {catId.split('-').slice(0, 2).join(' ')}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => handleCategorySelect([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className={cn(
            'w-64 flex-shrink-0 transition-all',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <CategoryNav
                selectedCategories={selectedCategories}
                onCategorySelect={handleCategorySelect}
                toolCounts={toolCounts}
                collapsible={true}
              />
            </div>
          </aside>

          {/* Tool Grid */}
          <main className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {displayTools.length} {displayTools.length === 1 ? 'tool' : 'tools'}
                {activeTab === 'all' && currentQuery.text && (
                  <> matching "{currentQuery.text}"</>
                )}
              </p>
            </div>

            {/* Tools Grid */}
            <ToolGrid
              tools={displayTools}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
              variant={viewMode === 'list' ? 'compact' : 'default'}
              columns={viewMode === 'list' ? 1 : 3}
              emptyMessage={
                activeTab === 'favorites'
                  ? 'No favorite tools yet. Star tools to add them here.'
                  : activeTab === 'recent'
                    ? 'No recently used tools. Execute a tool to see it here.'
                    : 'No tools found matching your search.'
              }
            />
          </main>
        </div>
      </div>
    </div>
  );
}

// Tab button component
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
        active
          ? 'bg-black text-white'
          : 'text-gray-600 hover:bg-gray-50'
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && (
        <span className={cn(
          'px-1.5 py-0.5 text-xs rounded-full',
          active ? 'bg-white/20' : 'bg-gray-100'
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
