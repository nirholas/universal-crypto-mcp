'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <motion.div
      className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-4 px-4 py-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl',
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.href}
          whileHover={{ scale: 1.4, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Link
            href={item.href}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              {item.icon}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
