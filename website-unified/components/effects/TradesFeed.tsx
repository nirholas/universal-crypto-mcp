'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  tokenSymbol: string;
  tokenLogo?: string;
  amount: string;
  price: string;
  total: string;
  time: string;
}

interface TradesFeedProps {
  trades: Trade[];
  maxItems?: number;
  className?: string;
}

export function TradesFeed({ trades, maxItems = 10, className }: TradesFeedProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {trades.slice(0, maxItems).map((trade, index) => (
          <motion.div
            key={trade.id}
            layout
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              stiffness: 500, 
              damping: 30,
              delay: index * 0.05 
            }}
            className={cn(
              'flex items-center gap-4 p-3 rounded-xl border transition-colors',
              trade.type === 'buy'
                ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
            )}
          >
            <div className={cn(
              'p-2 rounded-lg',
              trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
            )}>
              {trade.type === 'buy' ? (
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
            </div>
            
            <TokenLogo symbol={trade.tokenSymbol} src={trade.tokenLogo} size="sm" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{trade.tokenSymbol}</span>
                <span className={cn(
                  'text-xs font-medium uppercase',
                  trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                )}>
                  {trade.type}
                </span>
              </div>
              <div className="text-sm text-white/60 truncate">
                {trade.amount} @ {trade.price}
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-mono text-white">{trade.total}</div>
              <div className="text-xs text-white/40">{trade.time}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
