'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  chart,
  className,
}: StatsCardProps) {
  const isPositive = change && change >= 0;

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6',
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-sm font-medium',
                isPositive ? 'text-green-400' : 'text-red-400'
              )}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-white/5">
            {icon}
          </div>
        )}
      </div>
      {chart && (
        <div className="mt-4 h-16">
          {chart}
        </div>
      )}
    </motion.div>
  );
}
