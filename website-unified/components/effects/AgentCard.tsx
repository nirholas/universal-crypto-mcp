'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize2, Bot, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  avatar: string | React.ReactNode;
  status: 'active' | 'paused' | 'idle' | 'error';
  stats: {
    trades?: number;
    profit?: number;
    profitPercent?: number;
    runtime?: string;
  };
  onStart?: () => void;
  onPause?: () => void;
  onConfigure?: () => void;
  className?: string;
}

const statusColors = {
  active: 'bg-green-500',
  paused: 'bg-amber-500',
  idle: 'bg-gray-500',
  error: 'bg-red-500',
};

const statusLabels = {
  active: 'Active',
  paused: 'Paused',
  idle: 'Idle',
  error: 'Error',
};

export function AgentCard({
  id,
  name,
  description,
  avatar,
  status,
  stats,
  onStart,
  onPause,
  onConfigure,
  className,
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        'relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 overflow-hidden',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Animated background */}
      {status === 'active' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-purple-500/5"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
      )}

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              {typeof avatar === 'string' ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                avatar || <Bot className="w-7 h-7 text-white" />
              )}
            </div>
            <div className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black',
              statusColors[status],
              status === 'active' && 'animate-pulse'
            )} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{name}</h3>
              {status === 'active' && (
                <Sparkles className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <p className="text-sm text-white/60 line-clamp-2 mt-1">{description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {stats.trades !== undefined && (
            <div>
              <p className="text-xs text-white/40 uppercase">Trades</p>
              <p className="text-lg font-bold text-white">{stats.trades}</p>
            </div>
          )}
          {stats.profit !== undefined && (
            <div>
              <p className="text-xs text-white/40 uppercase">Profit</p>
              <p className={cn(
                'text-lg font-bold',
                stats.profit >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {stats.profit >= 0 ? '+' : ''}${stats.profit.toLocaleString()}
              </p>
            </div>
          )}
          {stats.profitPercent !== undefined && (
            <div>
              <p className="text-xs text-white/40 uppercase">ROI</p>
              <p className={cn(
                'text-lg font-bold',
                stats.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {stats.profitPercent >= 0 ? '+' : ''}{stats.profitPercent.toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 flex-1">
            <span className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium',
              status === 'active' && 'bg-green-500/20 text-green-400',
              status === 'paused' && 'bg-amber-500/20 text-amber-400',
              status === 'idle' && 'bg-white/10 text-white/60',
              status === 'error' && 'bg-red-500/20 text-red-400'
            )}>
              {statusLabels[status]}
            </span>
            {stats.runtime && (
              <span className="text-xs text-white/40">
                Running for {stats.runtime}
              </span>
            )}
          </div>

          {status === 'active' ? (
            <motion.button
              className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPause}
            >
              <Pause className="w-4 h-4 text-amber-400" />
            </motion.button>
          ) : (
            <motion.button
              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onStart}
            >
              <Play className="w-4 h-4 text-green-400" />
            </motion.button>
          )}

          <motion.button
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onConfigure}
          >
            <Maximize2 className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
