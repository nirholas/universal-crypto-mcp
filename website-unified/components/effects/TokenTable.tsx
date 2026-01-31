'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface Token {
  rank: number;
  symbol: string;
  name: string;
  logo?: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sparkline?: number[];
}

interface TokenTableProps {
  tokens: Token[];
  onRowClick?: (token: Token) => void;
  className?: string;
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-20 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={positive ? '#22c55e' : '#ef4444'}
        strokeWidth="3"
        points={points}
      />
    </svg>
  );
}

export function TokenTable({ tokens, onRowClick, className }: TokenTableProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-white/40 border-b border-white/10">
            <th className="pb-3 font-medium">#</th>
            <th className="pb-3 font-medium">Token</th>
            <th className="pb-3 font-medium text-right">Price</th>
            <th className="pb-3 font-medium text-right">24h %</th>
            <th className="pb-3 font-medium text-right hidden md:table-cell">24h Volume</th>
            <th className="pb-3 font-medium text-right hidden lg:table-cell">Market Cap</th>
            <th className="pb-3 font-medium text-right hidden sm:table-cell">Last 7d</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => {
            const isPositive = token.change24h > 0;
            const isNeutral = token.change24h === 0;
            
            return (
              <motion.tr
                key={token.symbol}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onRowClick?.(token)}
              >
                <td className="py-4 text-white/60">{token.rank}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <TokenLogo symbol={token.symbol} src={token.logo} size="md" />
                    <div>
                      <div className="font-medium text-white">{token.symbol}</div>
                      <div className="text-sm text-white/40">{token.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right font-mono text-white">
                  ${token.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: token.price < 1 ? 6 : 2 
                  })}
                </td>
                <td className="py-4 text-right">
                  <div className={cn(
                    'inline-flex items-center gap-1 font-medium',
                    isPositive ? 'text-green-400' : isNeutral ? 'text-white/60' : 'text-red-400'
                  )}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : isNeutral ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(token.change24h).toFixed(2)}%
                  </div>
                </td>
                <td className="py-4 text-right font-mono text-white/60 hidden md:table-cell">
                  {formatNumber(token.volume24h)}
                </td>
                <td className="py-4 text-right font-mono text-white/60 hidden lg:table-cell">
                  {formatNumber(token.marketCap)}
                </td>
                <td className="py-4 text-right hidden sm:table-cell">
                  {token.sparkline && (
                    <MiniSparkline data={token.sparkline} positive={isPositive} />
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
