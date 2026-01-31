'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Command } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
}

interface CommandPaletteProps {
  shortcuts: Shortcut[];
  className?: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const modifiersMatch =
          (!shortcut.modifiers || shortcut.modifiers.length === 0) ||
          (shortcut.modifiers.every((mod) => {
            switch (mod) {
              case 'ctrl': return e.ctrlKey;
              case 'shift': return e.shiftKey;
              case 'alt': return e.altKey;
              case 'meta': return e.metaKey;
              default: return false;
            }
          }));

        if (modifiersMatch && e.key.toLowerCase() === shortcut.key.toLowerCase()) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function CommandPalette({ shortcuts, className }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredShortcuts = shortcuts.filter((s) =>
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Open with Cmd/Ctrl + K
  useKeyboardShortcuts([
    { key: 'k', modifiers: ['meta'], action: toggle },
    { key: 'k', modifiers: ['ctrl'], action: toggle },
    { key: 'Escape', action: () => setIsOpen(false) },
  ]);

  const formatModifier = (mod: string) => {
    const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
    switch (mod) {
      case 'meta': return isMac ? '⌘' : 'Win';
      case 'ctrl': return isMac ? '⌃' : 'Ctrl';
      case 'shift': return '⇧';
      case 'alt': return isMac ? '⌥' : 'Alt';
      default: return mod;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl',
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
          >
            {/* Search */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Command className="w-5 h-5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs text-white/40 bg-white/5 rounded">
                ESC
              </kbd>
            </div>

            {/* Commands */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredShortcuts.length === 0 ? (
                <div className="p-8 text-center text-white/40">
                  No commands found
                </div>
              ) : (
                filteredShortcuts.map((shortcut, i) => (
                  <motion.button
                    key={shortcut.key + shortcut.description}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/5 text-left transition-colors"
                    onClick={() => {
                      shortcut.action();
                      setIsOpen(false);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <span className="text-white">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.modifiers?.map((mod) => (
                        <kbd
                          key={mod}
                          className="px-2 py-1 text-xs text-white/60 bg-white/10 rounded"
                        >
                          {formatModifier(mod)}
                        </kbd>
                      ))}
                      <kbd className="px-2 py-1 text-xs text-white/60 bg-white/10 rounded uppercase">
                        {shortcut.key}
                      </kbd>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/40">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
