'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6',
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'lg:col-span-3',
        rowSpan === 2 && 'row-span-2',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}
