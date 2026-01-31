'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Percent, Timer, TrendingUp, Lock, Wallet, ArrowRight } from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface StakingPool {
  id: string;
  name: string;
  token: { symbol: string; logo?: string };
  rewardToken?: { symbol: string; logo?: string };
  apy: number;
  tvl: number;
  lockPeriod?: string;
  minStake?: number;
  userStaked?: number;
  userRewards?: number;
}

interface StakingCardProps {
  pool: StakingPool;
  onStake?: () => void;
  onUnstake?: () => void;
  onClaim?: () => void;
  className?: string;
}

export function StakingCard({
  pool,
  onStake,
  onUnstake,
  onClaim,
  className,
}: StakingCardProps) {
  const hasPosition = pool.userStaked && pool.userStaked > 0;

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden',
        className
      )}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <TokenLogo symbol={pool.token.symbol} src={pool.token.logo} size="lg" />
            {pool.rewardToken && (
              <div className="absolute -bottom-1 -right-1 border-2 border-black rounded-full">
                <TokenLogo symbol={pool.rewardToken.symbol} src={pool.rewardToken.logo} size="sm" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
            <p className="text-sm text-white/60">
              Stake {pool.token.symbol}
              {pool.rewardToken && ` → Earn ${pool.rewardToken.symbol}`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="p-4 bg-green-500/10 rounded-xl">
          <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
            <Percent className="w-4 h-4" />
            APY
          </div>
          <p className="text-2xl font-bold text-green-400">{pool.apy.toFixed(2)}%</p>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            TVL
          </div>
          <p className="text-2xl font-bold text-white">
            ${(pool.tvl / 1e6).toFixed(2)}M
          </p>
        </div>

        {pool.lockPeriod && (
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <Lock className="w-4 h-4" />
              Lock Period
            </div>
            <p className="text-lg font-bold text-white">{pool.lockPeriod}</p>
          </div>
        )}

        {pool.minStake !== undefined && (
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <Wallet className="w-4 h-4" />
              Min Stake
            </div>
            <p className="text-lg font-bold text-white">
              {pool.minStake} {pool.token.symbol}
            </p>
          </div>
        )}
      </div>

      {/* User Position */}
      {hasPosition && (
        <div className="mx-6 mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <p className="text-sm text-purple-400 mb-3">Your Position</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40">Staked</p>
              <p className="text-lg font-bold text-white">
                {pool.userStaked?.toLocaleString()} {pool.token.symbol}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <div className="text-right">
              <p className="text-xs text-white/40">Rewards</p>
              <p className="text-lg font-bold text-green-400">
                +{pool.userRewards?.toLocaleString()} {pool.rewardToken?.symbol || pool.token.symbol}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 pt-0 flex gap-3">
        {hasPosition ? (
          <>
            <motion.button
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUnstake}
            >
              Unstake
            </motion.button>
            <motion.button
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClaim}
            >
              Claim Rewards
            </motion.button>
          </>
        ) : (
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStake}
          >
            Stake {pool.token.symbol}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
