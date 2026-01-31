'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div
        className={cn(
          'flex gap-1',
          variant === 'default' && 'p-1 bg-white/5 rounded-xl',
          variant === 'pills' && 'gap-2',
          variant === 'underline' && 'border-b border-white/10 gap-0'
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
                variant === 'default' && 'rounded-lg',
                variant === 'pills' && 'rounded-full',
                variant === 'underline' && 'pb-3',
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              )}
            >
              {/* Background for default and pills */}
              {(variant === 'default' || variant === 'pills') && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={cn(
                    'absolute inset-0 bg-white/10',
                    variant === 'default' && 'rounded-lg',
                    variant === 'pills' && 'rounded-full'
                  )}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Underline for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
