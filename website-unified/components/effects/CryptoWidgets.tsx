'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, TrendingDown, Activity, Zap, Eye, BarChart3,
  Flame, Trophy, Star
} from 'lucide-react';

// ============================================================
// Live Token Metrics
// ============================================================

interface TokenMetricsProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  liquidity: number;
  className?: string;
}

export function TokenMetrics({
  symbol,
  name,
  price,
  change24h,
  marketCap,
  volume24h,
  holders,
  liquidity,
  className,
}: TokenMetricsProps) {
  const [prevPrice, setPrevPrice] = useState(price);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (price !== prevPrice) {
      setFlash(price > prevPrice ? 'up' : 'down');
      setPrevPrice(price);
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [price, prevPrice]);

  const formatNumber = (n: number) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className={cn('p-6 rounded-2xl bg-white/5 border border-white/10', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{symbol}</h3>
            <p className="text-sm text-white/50">{name}</p>
          </div>
        </div>
        <div className="text-right">
          <motion.p
            className={cn(
              'text-2xl font-bold transition-colors',
              flash === 'up' && 'text-green-400',
              flash === 'down' && 'text-red-400',
              !flash && 'text-white'
            )}
            animate={flash ? { scale: [1, 1.05, 1] } : {}}
          >
            ${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </motion.p>
          <p className={cn(
            'text-sm font-medium flex items-center justify-end gap-1',
            change24h >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change24h).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/50 mb-1">Market Cap</p>
          <p className="text-lg font-semibold text-white">{formatNumber(marketCap)}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/50 mb-1">24h Volume</p>
          <p className="text-lg font-semibold text-white">{formatNumber(volume24h)}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/50 mb-1">Holders</p>
          <p className="text-lg font-semibold text-white">{holders.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/50 mb-1">Liquidity</p>
          <p className="text-lg font-semibold text-white">{formatNumber(liquidity)}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Trending Tokens
// ============================================================

interface TrendingToken {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  logo?: string;
}

interface TrendingTokensProps {
  tokens: TrendingToken[];
  title?: string;
  className?: string;
}

export function TrendingTokens({
  tokens,
  title = 'Trending',
  className,
}: TrendingTokensProps) {
  return (
    <div className={cn('p-6 rounded-2xl bg-white/5 border border-white/10', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      <div className="space-y-3">
        {tokens.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <span className={cn(
              'w-6 h-6 flex items-center justify-center text-sm font-bold rounded',
              token.rank === 1 && 'text-yellow-400',
              token.rank === 2 && 'text-gray-400',
              token.rank === 3 && 'text-amber-600',
              token.rank > 3 && 'text-white/40'
            )}>
              {token.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              {token.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{token.symbol}</p>
              <p className="text-xs text-white/50 truncate">{token.name}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">${token.price.toFixed(4)}</p>
              <p className={cn(
                'text-xs font-medium',
                token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Whale Activity Feed
// ============================================================

interface WhaleTransaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  token: string;
  amount: number;
  usdValue: number;
  from?: string;
  to?: string;
  timestamp: Date;
}

interface WhaleActivityProps {
  transactions: WhaleTransaction[];
  className?: string;
}

export function WhaleActivity({ transactions, className }: WhaleActivityProps) {
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className={cn('p-6 rounded-2xl bg-white/5 border border-white/10', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Whale Activity</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                tx.type === 'buy' && 'bg-green-500/20 text-green-400',
                tx.type === 'sell' && 'bg-red-500/20 text-red-400',
                tx.type === 'transfer' && 'bg-blue-500/20 text-blue-400'
              )}>
                {tx.type === 'buy' && <TrendingUp className="w-5 h-5" />}
                {tx.type === 'sell' && <TrendingDown className="w-5 h-5" />}
                {tx.type === 'transfer' && <Zap className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">
                  <span className={cn(
                    tx.type === 'buy' && 'text-green-400',
                    tx.type === 'sell' && 'text-red-400',
                    tx.type === 'transfer' && 'text-blue-400'
                  )}>
                    {tx.type.toUpperCase()}
                  </span>
                  {' '}{tx.amount.toLocaleString()} {tx.token}
                </p>
                <p className="text-xs text-white/50">
                  ${tx.usdValue.toLocaleString()} • {formatTime(tx.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================
// Fear & Greed Index
// ============================================================

interface FearGreedIndexProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

export function FearGreedIndex({ value, label, className }: FearGreedIndexProps) {
  const getLabel = (v: number) => {
    if (v <= 20) return { text: 'Extreme Fear', color: '#ef4444' };
    if (v <= 40) return { text: 'Fear', color: '#f97316' };
    if (v <= 60) return { text: 'Neutral', color: '#eab308' };
    if (v <= 80) return { text: 'Greed', color: '#84cc16' };
    return { text: 'Extreme Greed', color: '#22c55e' };
  };

  const info = getLabel(value);
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className={cn('p-6 rounded-2xl bg-white/5 border border-white/10', className)}>
      <h3 className="text-lg font-bold text-white text-center mb-4">Fear & Greed Index</h3>
      
      <div className="relative mx-auto" style={{ width: 200, height: 120 }}>
        {/* Gauge background */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute left-1/2 bottom-2 origin-bottom"
          style={{ width: 4, height: 60, marginLeft: -2 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <div className="w-full h-full bg-white rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
        </motion.div>
      </div>

      <div className="text-center mt-2">
        <motion.p
          className="text-4xl font-bold"
          style={{ color: info.color }}
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {value}
        </motion.p>
        <p className="text-sm text-white/60">{label || info.text}</p>
      </div>
    </div>
  );
}

// ============================================================
// Leaderboard
// ============================================================

interface LeaderboardEntry {
  rank: number;
  address: string;
  ens?: string;
  avatar?: string;
  value: number;
  change?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  valueLabel?: string;
  className?: string;
}

export function Leaderboard({
  entries,
  title = 'Top Traders',
  valueLabel = 'PnL',
  className,
}: LeaderboardProps) {
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className={cn('p-6 rounded-2xl bg-white/5 border border-white/10', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      <div className="space-y-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl transition-colors',
              entry.rank <= 3 
                ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20'
                : 'hover:bg-white/5'
            )}
          >
            <div className={cn(
              'w-8 h-8 flex items-center justify-center rounded-lg font-bold',
              entry.rank === 1 && 'bg-yellow-500 text-black',
              entry.rank === 2 && 'bg-gray-400 text-black',
              entry.rank === 3 && 'bg-amber-600 text-white',
              entry.rank > 3 && 'bg-white/5 text-white/60'
            )}>
              {entry.rank <= 3 ? (
                <Star className="w-4 h-4" />
              ) : entry.rank}
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {entry.ens?.[0]?.toUpperCase() || entry.address.slice(2, 4)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {entry.ens || formatAddress(entry.address)}
              </p>
              {entry.change !== undefined && (
                <p className={cn(
                  'text-xs',
                  entry.change >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {entry.change >= 0 ? '+' : ''}{entry.change.toFixed(2)}%
                </p>
              )}
            </div>

            <div className="text-right">
              <p className={cn(
                'font-semibold',
                entry.value >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {entry.value >= 0 ? '+' : ''}${Math.abs(entry.value).toLocaleString()}
              </p>
              <p className="text-xs text-white/40">{valueLabel}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
