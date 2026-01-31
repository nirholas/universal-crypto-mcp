'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { TOOL_CATEGORIES, CATEGORY_GROUPS, getCategoryById } from '@/lib/playground/categories';
import { ToolCategoryId, ToolCategory } from '@/lib/playground/types';
import {
  Blocks,
  Zap,
  Network,
  Landmark,
  ArrowLeftRight,
  Coins,
  TrendingUp,
  Building2,
  Bot,
  Bell,
  DollarSign,
  BarChart3,
  Database,
  Wallet,
  PenTool,
  AtSign,
  Image,
  PieChart,
  FileImage,
  Shield,
  Scan,
  Activity,
  Brain,
  GitBranch,
  Server,
  CreditCard,
  Users,
  Vote,
  LineChart,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Blocks,
  Zap,
  Network,
  Landmark,
  ArrowLeftRight,
  Coins,
  TrendingUp,
  Building2,
  Bot,
  Bell,
  DollarSign,
  BarChart3,
  Database,
  Wallet,
  PenTool,
  AtSign,
  Image,
  PieChart,
  FileImage,
  Shield,
  Scan,
  Activity,
  Brain,
  GitBranch,
  Server,
  CreditCard,
  Users,
  Vote,
  LineChart,
};

interface CategoryNavProps {
  selectedCategories: ToolCategoryId[];
  onCategorySelect: (categories: ToolCategoryId[]) => void;
  toolCounts?: Record<ToolCategoryId, number>;
  className?: string;
  collapsible?: boolean;
}

export function CategoryNav({
  selectedCategories,
  onCategorySelect,
  toolCounts,
  className,
  collapsible = true,
}: CategoryNavProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    CATEGORY_GROUPS.map(g => g.name)
  );

  const toggleGroup = (groupName: string) => {
    if (!collapsible) return;
    
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const toggleCategory = (categoryId: ToolCategoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onCategorySelect(selectedCategories.filter(c => c !== categoryId));
    } else {
      onCategorySelect([...selectedCategories, categoryId]);
    }
  };

  const selectGroupCategories = (groupName: string) => {
    const group = CATEGORY_GROUPS.find(g => g.name === groupName);
    if (!group) return;

    const groupCategoryIds = group.categories as ToolCategoryId[];
    const allSelected = groupCategoryIds.every(c => selectedCategories.includes(c));

    if (allSelected) {
      onCategorySelect(selectedCategories.filter(c => !groupCategoryIds.includes(c)));
    } else {
      const newSelection = [...selectedCategories];
      for (const catId of groupCategoryIds) {
        if (!newSelection.includes(catId)) {
          newSelection.push(catId);
        }
      }
      onCategorySelect(newSelection);
    }
  };

  const clearAllCategories = () => {
    onCategorySelect([]);
  };

  const getCategoryIcon = (iconName: string) => {
    const Icon = CATEGORY_ICONS[iconName] || Blocks;
    return Icon;
  };

  const getToolCount = (categoryId: ToolCategoryId): number => {
    if (toolCounts) {
      return toolCounts[categoryId] || 0;
    }
    const category = getCategoryById(categoryId);
    return category?.toolCount || 0;
  };

  return (
    <nav className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={clearAllCategories}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4 px-2">
        {['DeFi', 'Trading', 'NFT'].map(groupName => {
          const group = CATEGORY_GROUPS.find(g => g.name === groupName);
          if (!group) return null;

          const groupCategoryIds = group.categories as ToolCategoryId[];
          const isSelected = groupCategoryIds.some(c => selectedCategories.includes(c));

          return (
            <button
              key={groupName}
              onClick={() => selectGroupCategories(groupName)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-full transition-all',
                isSelected
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {groupName}
            </button>
          );
        })}
      </div>

      {/* Category Groups */}
      <div className="space-y-1">
        {CATEGORY_GROUPS.map(group => {
          const isExpanded = expandedGroups.includes(group.name);
          const groupCategories = group.categories
            .map(id => getCategoryById(id as ToolCategoryId))
            .filter((c): c is ToolCategory => c !== undefined);

          const groupCategoryIds = group.categories as ToolCategoryId[];
          const selectedInGroup = groupCategoryIds.filter(c =>
            selectedCategories.includes(c)
          ).length;
          const totalInGroup = groupCategoryIds.length;

          return (
            <div key={group.name} className="border-b border-gray-100 last:border-0">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.name)}
                className={cn(
                  'w-full flex items-center justify-between px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors',
                  isExpanded && 'bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2">
                  {collapsible && (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )
                  )}
                  <span>{group.name}</span>
                  {selectedInGroup > 0 && (
                    <span className="px-1.5 py-0.5 text-xs bg-black text-white rounded-full">
                      {selectedInGroup}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {groupCategories.reduce((sum, c) => sum + (toolCounts?.[c.id] || c.toolCount), 0)}
                </span>
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="pl-6 pb-2 space-y-0.5">
                  {groupCategories.map(category => {
                    const Icon = getCategoryIcon(category.icon);
                    const isSelected = selectedCategories.includes(category.id);
                    const count = getToolCount(category.id);

                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-all group',
                          isSelected
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={cn(
                            'w-4 h-4 flex-shrink-0',
                            isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                          )} />
                          <span className="truncate">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'text-xs',
                            isSelected ? 'text-white/70' : 'text-gray-400'
                          )}>
                            {count}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Count Footer */}
      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 px-2">
          <p className="text-xs text-gray-500">
            {selectedCategories.length} categories selected
          </p>
        </div>
      )}
    </nav>
  );
}

export default CategoryNav;
