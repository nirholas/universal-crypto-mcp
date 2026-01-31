/**
 * Tool Search - Fuzzy search and filtering for MCP tools
 * @module lib/playground/search
 */

import Fuse from 'fuse.js';
import { McpTool, ToolSearchQuery, ToolSearchResult, ToolCategoryId, ToolComplexity } from './types';
import { SAMPLE_TOOLS } from './tools-data';

// Fuse.js configuration for fuzzy search
const fuseOptions: Fuse.IFuseOptions<McpTool> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'longDescription', weight: 0.1 },
    { name: 'tags', weight: 0.15 },
    { name: 'category', weight: 0.05 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};

// Create the Fuse instance
let fuseInstance: Fuse<McpTool> | null = null;

function getFuseInstance(tools: McpTool[] = SAMPLE_TOOLS): Fuse<McpTool> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(tools, fuseOptions);
  }
  return fuseInstance;
}

/**
 * Search tools with fuzzy matching
 */
export function searchTools(query: ToolSearchQuery, tools: McpTool[] = SAMPLE_TOOLS): ToolSearchResult {
  let results = [...tools];

  // Apply text search if provided
  if (query.text && query.text.trim().length > 0) {
    const fuse = getFuseInstance(tools);
    const searchResults = fuse.search(query.text.trim());
    results = searchResults.map(r => r.item);
  }

  // Filter by categories
  if (query.categories && query.categories.length > 0) {
    results = results.filter(tool => query.categories!.includes(tool.category));
  }

  // Filter by complexity
  if (query.complexity && query.complexity.length > 0) {
    results = results.filter(tool => query.complexity!.includes(tool.complexity));
  }

  // Filter by chains
  if (query.chains && query.chains.length > 0) {
    results = results.filter(tool => 
      tool.chains?.some(chain => query.chains!.includes(chain))
    );
  }

  // Filter by tags
  if (query.tags && query.tags.length > 0) {
    results = results.filter(tool =>
      tool.tags.some(tag => query.tags!.includes(tag))
    );
  }

  // Filter by has examples
  if (query.hasExamples) {
    results = results.filter(tool => tool.examples.length > 0);
  }

  // Filter by free tools
  if (query.isFree) {
    results = results.filter(tool => tool.pricing?.type === 'free');
  }

  // Sort results
  if (query.sortBy) {
    results = sortTools(results, query.sortBy, query.sortOrder || 'asc');
  }

  // Calculate facets
  const facets = calculateFacets(tools);

  return {
    tools: results,
    total: results.length,
    facets,
  };
}

/**
 * Sort tools by a given field
 */
function sortTools(tools: McpTool[], sortBy: string, order: 'asc' | 'desc'): McpTool[] {
  const sorted = [...tools].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popularity':
        return (b.stats?.usageCount || 0) - (a.stats?.usageCount || 0);
      case 'recent':
        return (b.stats?.lastUsed?.getTime() || 0) - (a.stats?.lastUsed?.getTime() || 0);
      case 'complexity':
        const complexityOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
        return complexityOrder.indexOf(a.complexity) - complexityOrder.indexOf(b.complexity);
      default:
        return 0;
    }
  });

  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Calculate facets (counts) for filters
 */
function calculateFacets(tools: McpTool[]): ToolSearchResult['facets'] {
  const categories: Record<ToolCategoryId, number> = {} as Record<ToolCategoryId, number>;
  const complexity: Record<ToolComplexity, number> = {} as Record<ToolComplexity, number>;
  const chains: Record<string, number> = {};
  const tags: Record<string, number> = {};

  for (const tool of tools) {
    // Count categories
    categories[tool.category] = (categories[tool.category] || 0) + 1;

    // Count complexity
    complexity[tool.complexity] = (complexity[tool.complexity] || 0) + 1;

    // Count chains
    if (tool.chains) {
      for (const chain of tool.chains) {
        chains[chain] = (chains[chain] || 0) + 1;
      }
    }

    // Count tags
    for (const tag of tool.tags) {
      tags[tag] = (tags[tag] || 0) + 1;
    }
  }

  return { categories, complexity, chains, tags };
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(input: string, tools: McpTool[] = SAMPLE_TOOLS): string[] {
  if (!input || input.length < 2) return [];

  const suggestions = new Set<string>();
  const lowerInput = input.toLowerCase();

  for (const tool of tools) {
    // Match tool names
    if (tool.name.toLowerCase().includes(lowerInput)) {
      suggestions.add(tool.name);
    }

    // Match tags
    for (const tag of tool.tags) {
      if (tag.toLowerCase().includes(lowerInput)) {
        suggestions.add(tag);
      }
    }
  }

  return Array.from(suggestions).slice(0, 10);
}

/**
 * Parse advanced search query syntax
 * Supports: category:defi, chain:ethereum, complexity:beginner, tag:swap
 */
export function parseAdvancedQuery(queryString: string): ToolSearchQuery {
  const query: ToolSearchQuery = {};
  const parts = queryString.split(/\s+/);
  const textParts: string[] = [];

  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex > 0) {
      const key = part.substring(0, colonIndex).toLowerCase();
      const value = part.substring(colonIndex + 1);

      switch (key) {
        case 'category':
        case 'cat':
          query.categories = query.categories || [];
          query.categories.push(value as ToolCategoryId);
          break;
        case 'chain':
          query.chains = query.chains || [];
          query.chains.push(value);
          break;
        case 'complexity':
        case 'level':
          query.complexity = query.complexity || [];
          query.complexity.push(value as ToolComplexity);
          break;
        case 'tag':
          query.tags = query.tags || [];
          query.tags.push(value);
          break;
        case 'sort':
          query.sortBy = value as any;
          break;
        default:
          textParts.push(part);
      }
    } else {
      textParts.push(part);
    }
  }

  if (textParts.length > 0) {
    query.text = textParts.join(' ');
  }

  return query;
}

/**
 * Get popular search queries
 */
export function getPopularSearches(): string[] {
  return [
    'get balance',
    'swap tokens',
    'token price',
    'gas price',
    'NFT collection',
    'lending rates',
    'sign message',
    'ENS resolve',
    'contract call',
    'security scan',
  ];
}

/**
 * Get recent searches from local storage
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('playground_recent_searches');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save a search to recent searches
 */
export function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;

  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(q => q !== query);
    filtered.unshift(query);
    const limited = filtered.slice(0, 10);
    localStorage.setItem('playground_recent_searches', JSON.stringify(limited));
  } catch {
    // Ignore storage errors
  }
}
