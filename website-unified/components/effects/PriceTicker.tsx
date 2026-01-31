'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceTickerProps {
  symbol: string;
  price: number;
  change: number;
  className?: string;
}

export function PriceTicker({ symbol, price, change, className }: PriceTickerProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10',
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <span className="font-bold text-white">{symbol}</span>
      <span className="text-white/80 font-mono">
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <div
        className={cn(
          'flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-green-400' : 'text-red-400'
        )}
      >
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </div>
    </motion.div>
  );
}
