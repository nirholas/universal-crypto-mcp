'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  searchTools,
  getSearchSuggestions,
  parseAdvancedQuery,
  getPopularSearches,
  getRecentSearches,
  saveRecentSearch,
} from '@/lib/playground/search';
import { McpTool, ToolSearchQuery, ToolComplexity, ToolCategoryId } from '@/lib/playground/types';
import { SAMPLE_TOOLS } from '@/lib/playground/tools-data';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown,
  Sliders,
} from 'lucide-react';

interface ToolSearchProps {
  onSearch: (results: McpTool[], query: ToolSearchQuery) => void;
  initialQuery?: string;
  className?: string;
  showFilters?: boolean;
  placeholder?: string;
}

export function ToolSearch({
  onSearch,
  initialQuery = '',
  className,
  showFilters = true,
  placeholder = 'Search 380+ tools...',
}: ToolSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<ToolSearchQuery>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Recent and popular searches
  const recentSearches = getRecentSearches();
  const popularSearches = getPopularSearches();

  // Handle search
  const handleSearch = useCallback((searchQuery: string) => {
    const parsedQuery = parseAdvancedQuery(searchQuery);
    const combinedQuery = { ...parsedQuery, ...filters };
    const results = searchTools(combinedQuery, SAMPLE_TOOLS);
    onSearch(results.tools, combinedQuery);

    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
  }, [filters, onSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      const newSuggestions = getSearchSuggestions(value, SAMPLE_TOOLS);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }

    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    handleSearch('');
    inputRef.current?.focus();
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update filters
  const updateFilter = (key: keyof ToolSearchQuery, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    handleSearch(query);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full h-12 pl-12 pr-24 text-base rounded-xl border-2 border-gray-200',
            'focus:border-black focus:outline-none focus:ring-0',
            'placeholder:text-gray-400 transition-all'
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {showFilters && (
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                'p-1.5 rounded-full transition-colors',
                showAdvanced
                  ? 'bg-black text-white'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              )}
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || recentSearches.length > 0 || !query) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-lg z-50 overflow-hidden"
        >
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase">
                Suggestions
              </p>
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Recent
              </p>
              {recentSearches.slice(0, 5).map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="p-2 border-t border-gray-100">
              <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Popular
              </p>
              <div className="flex flex-wrap gap-2 px-2 py-1">
                {popularSearches.slice(0, 6).map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tips */}
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Tip:</span> Use{' '}
              <code className="px-1 py-0.5 bg-gray-200 rounded text-xs">category:defi</code>,{' '}
              <code className="px-1 py-0.5 bg-gray-200 rounded text-xs">chain:ethereum</code>, or{' '}
              <code className="px-1 py-0.5 bg-gray-200 rounded text-xs">complexity:beginner</code>{' '}
              for advanced search
            </p>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && showFilters && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Complexity Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Complexity
              </label>
              <select
                value={filters.complexity?.[0] || ''}
                onChange={(e) => updateFilter('complexity', e.target.value ? [e.target.value as ToolComplexity] : undefined)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-0"
              >
                <option value="">Any</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Chain Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Chain
              </label>
              <select
                value={filters.chains?.[0] || ''}
                onChange={(e) => updateFilter('chains', e.target.value ? [e.target.value] : undefined)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-0"
              >
                <option value="">Any</option>
                <option value="ethereum">Ethereum</option>
                <option value="base">Base</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="polygon">Polygon</option>
                <option value="optimism">Optimism</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Sort By
              </label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) => updateFilter('sortBy', e.target.value || undefined)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-0"
              >
                <option value="">Relevance</option>
                <option value="name">Name</option>
                <option value="popularity">Popularity</option>
                <option value="complexity">Complexity</option>
              </select>
            </div>

            {/* Free Only */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Pricing
              </label>
              <button
                onClick={() => updateFilter('isFree', !filters.isFree)}
                className={cn(
                  'w-full h-9 px-3 text-sm font-medium rounded-lg border transition-all',
                  filters.isFree
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                )}
              >
                {filters.isFree ? 'Free Only ✓' : 'Free Only'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolSearch;
