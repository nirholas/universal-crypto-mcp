'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, MoreVertical, Check, ChevronRight } from 'lucide-react';

// ============================================================
// Dropdown Menu
// ============================================================

interface MenuItem {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: MenuItem[];
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = 'left',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-2 min-w-[180px] py-1',
              'bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => item.children && setActiveSubmenu(i)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button
                  onClick={() => {
                    if (!item.disabled && !item.children) {
                      item.onClick?.();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    item.danger
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-white hover:bg-white/5'
                  )}
                >
                  {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-xs text-white/40">{item.shortcut}</span>
                  )}
                  {item.children && (
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  )}
                </button>

                {/* Submenu */}
                {item.children && activeSubmenu === i && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'absolute top-0 min-w-[160px] py-1',
                      'bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
                      align === 'right' ? 'right-full mr-1' : 'left-full ml-1'
                    )}
                  >
                    {item.children.map((child, j) => (
                      <button
                        key={j}
                        onClick={() => {
                          child.onClick?.();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Context Menu (right-click)
// ============================================================

interface ContextMenuProps {
  items: MenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  useEffect(() => {
    const close = () => setIsOpen(false);
    document.addEventListener('click', close);
    document.addEventListener('scroll', close);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('scroll', close);
    };
  }, []);

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 min-w-[180px] py-1 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
            style={{ left: position.x, top: position.y }}
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.danger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-white hover:bg-white/5'
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && <span className="text-xs text-white/40">{item.shortcut}</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// Breadcrumb
// ============================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4 text-white/30" />,
  className,
}: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && separator}
          {item.href || item.onClick ? (
            <button
              onClick={item.onClick}
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
            >
              {item.icon}
              {item.label}
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-white font-medium">
              {item.icon}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// ============================================================
// Action Button (with more options)
// ============================================================

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  moreActions?: MenuItem[];
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ActionButton({
  label,
  icon,
  onClick,
  moreActions,
  variant = 'primary',
  className,
}: ActionButtonProps) {
  const variants = {
    primary: 'bg-purple-500 hover:bg-purple-600 text-white',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
  };

  if (!moreActions) {
    return (
      <motion.button
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
          variants[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon}
        {label}
      </motion.button>
    );
  }

  return (
    <div className={cn('flex', className)}>
      <motion.button
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-l-xl font-medium transition-colors',
          variants[variant]
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon}
        {label}
      </motion.button>
      <DropdownMenu
        trigger={
          <button
            className={cn(
              'px-2 py-2 rounded-r-xl border-l border-white/10 transition-colors',
              variants[variant]
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        }
        items={moreActions}
        align="right"
      />
    </div>
  );
}

// ============================================================
// Kebab Menu (three dots)
// ============================================================

interface KebabMenuProps {
  items: MenuItem[];
  className?: string;
}

export function KebabMenu({ items, className }: KebabMenuProps) {
  return (
    <DropdownMenu
      trigger={
        <button className={cn(
          'p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white',
          className
        )}>
          <MoreVertical className="w-5 h-5" />
        </button>
      }
      items={items}
      align="right"
    />
  );
}
