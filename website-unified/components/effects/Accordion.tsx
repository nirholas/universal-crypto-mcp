'use client';

import { createContext, useContext, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, Plus, Minus } from 'lucide-react';

// ============================================================
// Accordion Context
// ============================================================

interface AccordionContextValue {
  type: 'single' | 'multiple';
  expandedItems: Set<string>;
  toggle: (id: string) => void;
  variant: 'default' | 'bordered' | 'separated';
  iconStyle: 'chevron' | 'plus';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within Accordion');
  return context;
}

// ============================================================
// Accordion Root
// ============================================================

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultExpanded?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  iconStyle?: 'chevron' | 'plus';
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type = 'single',
  defaultExpanded = [],
  variant = 'default',
  iconStyle = 'chevron',
  className,
  children,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (type === 'single') {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ type, expandedItems, toggle, variant, iconStyle }}>
      <div className={cn(
        variant === 'separated' ? 'space-y-3' : 'divide-y divide-white/10',
        variant === 'bordered' && 'border border-white/10 rounded-xl overflow-hidden',
        className
      )}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ============================================================
// Accordion Item
// ============================================================

interface AccordionItemProps {
  id?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AccordionItem({
  id: propId,
  title,
  subtitle,
  icon,
  disabled = false,
  className,
  children,
}: AccordionItemProps) {
  const generatedId = useId();
  const id = propId || generatedId;
  const { expandedItems, toggle, variant, iconStyle } = useAccordion();
  const isExpanded = expandedItems.has(id);

  const Icon = iconStyle === 'plus' 
    ? (isExpanded ? Minus : Plus)
    : ChevronDown;

  return (
    <div className={cn(
      variant === 'separated' && 'bg-white/5 border border-white/10 rounded-xl overflow-hidden',
      className
    )}>
      <button
        type="button"
        onClick={() => !disabled && toggle(id)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-4 px-4 py-4 text-left transition-colors',
          'hover:bg-white/5',
          disabled && 'opacity-50 cursor-not-allowed',
          isExpanded && 'bg-white/5'
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <div className="text-purple-400 flex-shrink-0">{icon}</div>}
          <div className="min-w-0">
            <div className="text-white font-medium truncate">
              {title}
            </div>
            {subtitle && (
              <div className="text-sm text-white/60 truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded && iconStyle === 'chevron' ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40 flex-shrink-0"
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-white/70">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// FAQ Accordion (Pre-styled for FAQs)
// ============================================================

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion variant="separated" iconStyle="plus" className={className}>
      {items.map((item, i) => (
        <AccordionItem key={i} id={`faq-${i}`} title={item.question}>
          {item.answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
