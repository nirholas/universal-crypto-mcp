'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, TrendingDown, ArrowRight, RefreshCw, 
  Settings, Zap, Shield, Clock
} from 'lucide-react';

// ============================================================
// Advanced Swap Interface
// ============================================================

interface Token {
  symbol: string;
  name: string;
  logo?: string;
  balance?: number;
  price?: number;
}

interface SwapInterfaceProps {
  fromToken?: Token;
  toToken?: Token;
  onSwap?: (from: Token, to: Token, amount: number) => void;
  onTokenSelect?: (direction: 'from' | 'to') => void;
  rate?: number;
  priceImpact?: number;
  fee?: number;
  slippage?: number;
  loading?: boolean;
  className?: string;
}

export function AdvancedSwapInterface({
  fromToken = { symbol: 'ETH', name: 'Ethereum', balance: 2.5, price: 3200 },
  toToken = { symbol: 'USDC', name: 'USD Coin', balance: 5000, price: 1 },
  onSwap,
  onTokenSelect,
  rate = 3200,
  priceImpact = 0.05,
  fee = 0.003,
  slippage = 0.5,
  loading = false,
  className,
}: SwapInterfaceProps) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [customSlippage, setCustomSlippage] = useState(slippage.toString());

  useEffect(() => {
    if (fromAmount && rate) {
      const result = parseFloat(fromAmount) * rate;
      setToAmount(result.toFixed(2));
    } else {
      setToAmount('');
    }
  }, [fromAmount, rate]);

  const handleSwapTokens = () => {
    // Swap the token positions
  };

  const handleMax = () => {
    if (fromToken?.balance) {
      setFromAmount(fromToken.balance.toString());
    }
  };

  return (
    <motion.div
      className={cn(
        'p-6 rounded-3xl bg-gradient-to-b from-white/5 to-black/40 backdrop-blur-2xl border border-white/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Swap</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-xl text-white/60 hover:text-white transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              'p-2 rounded-xl transition-colors',
              showSettings ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5 text-white/60 hover:text-white'
            )}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-white/60 mb-3">Slippage Tolerance</p>
              <div className="flex gap-2">
                {[0.1, 0.5, 1.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => setCustomSlippage(val.toString())}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      parseFloat(customSlippage) === val
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    )}
                  >
                    {val}%
                  </button>
                ))}
                <input
                  type="text"
                  value={customSlippage}
                  onChange={(e) => setCustomSlippage(e.target.value)}
                  className="w-20 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center"
                  placeholder="0.5"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* From Token */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-2">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>From</span>
          <span>Balance: {fromToken?.balance?.toFixed(4) || '0'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTokenSelect?.('from')}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {fromToken?.symbol?.slice(0, 2)}
            </div>
            <span className="text-white font-semibold">{fromToken?.symbol}</span>
          </button>
          <input
            type="text"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-right text-2xl font-bold text-white placeholder:text-white/30 outline-none"
          />
        </div>
        <div className="flex justify-between mt-2">
          <button
            onClick={handleMax}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            MAX
          </button>
          <span className="text-sm text-white/50">
            ≈ ${(parseFloat(fromAmount || '0') * (fromToken?.price || 0)).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Swap Button */}
      <div className="relative flex justify-center -my-4 z-10">
        <motion.button
          onClick={handleSwapTokens}
          className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl border border-purple-500/30 text-purple-400 transition-colors"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-5 h-5 rotate-90" />
        </motion.button>
      </div>

      {/* To Token */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>To</span>
          <span>Balance: {toToken?.balance?.toFixed(4) || '0'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTokenSelect?.('to')}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              {toToken?.symbol?.slice(0, 2)}
            </div>
            <span className="text-white font-semibold">{toToken?.symbol}</span>
          </button>
          <input
            type="text"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="flex-1 bg-transparent text-right text-2xl font-bold text-white placeholder:text-white/30 outline-none"
          />
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-sm text-white/50">
            ≈ ${(parseFloat(toAmount || '0') * (toToken?.price || 0)).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Rate Info */}
      {fromAmount && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-white/5 rounded-xl space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Rate</span>
            <span className="text-white">
              1 {fromToken?.symbol} = {rate.toLocaleString()} {toToken?.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Price Impact</span>
            <span className={priceImpact < 1 ? 'text-green-400' : priceImpact < 3 ? 'text-yellow-400' : 'text-red-400'}>
              {priceImpact}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Fee</span>
            <span className="text-white">{(fee * 100).toFixed(2)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Slippage</span>
            <span className="text-white">{customSlippage}%</span>
          </div>
        </motion.div>
      )}

      {/* Swap Button */}
      <motion.button
        onClick={() => onSwap?.(fromToken, toToken, parseFloat(fromAmount))}
        disabled={!fromAmount || loading}
        className={cn(
          'w-full mt-4 py-4 rounded-2xl font-bold text-lg transition-all',
          'bg-gradient-to-r from-purple-500 to-pink-500',
          'hover:from-purple-600 hover:to-pink-600',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Swapping...
          </span>
        ) : !fromAmount ? (
          'Enter an amount'
        ) : (
          'Swap'
        )}
      </motion.button>

      {/* Features */}
      <div className="mt-4 flex justify-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" /> Fast
        </span>
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" /> Secure
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> ~30s
        </span>
      </div>
    </motion.div>
  );
}

// ============================================================
// Liquidity Pool Card
// ============================================================

interface PoolData {
  token0: { symbol: string; logo?: string };
  token1: { symbol: string; logo?: string };
  tvl: number;
  apr: number;
  volume24h: number;
  fees24h: number;
  userLiquidity?: number;
}

interface LiquidityPoolCardProps {
  pool: PoolData;
  onAddLiquidity?: () => void;
  onRemoveLiquidity?: () => void;
  className?: string;
}

export function LiquidityPoolCard({
  pool,
  onAddLiquidity,
  onRemoveLiquidity,
  className,
}: LiquidityPoolCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10 overflow-hidden',
        className
      )}
      layout
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
      >
        {/* Token Pair */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            {pool.token0.symbol.slice(0, 2)}
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm -ml-3 border-2 border-black">
            {pool.token1.symbol.slice(0, 2)}
          </div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-white font-semibold">
            {pool.token0.symbol}/{pool.token1.symbol}
          </p>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-semibold">{pool.apr.toFixed(2)}% APR</p>
          <p className="text-xs text-white/50">${(pool.tvl / 1e6).toFixed(2)}M TVL</p>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-white/50">24h Volume</p>
                  <p className="text-white font-semibold">${(pool.volume24h / 1e6).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">24h Fees</p>
                  <p className="text-white font-semibold">${pool.fees24h.toLocaleString()}</p>
                </div>
                {pool.userLiquidity && (
                  <div className="col-span-2">
                    <p className="text-xs text-white/50">Your Liquidity</p>
                    <p className="text-white font-semibold">${pool.userLiquidity.toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onAddLiquidity}
                  className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium transition-colors"
                >
                  Add Liquidity
                </button>
                {pool.userLiquidity && (
                  <button
                    onClick={onRemoveLiquidity}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// Yield Farm Card
// ============================================================

interface FarmData {
  name: string;
  token: { symbol: string; logo?: string };
  rewardToken: { symbol: string; logo?: string };
  apy: number;
  tvl: number;
  earned: number;
  staked: number;
  multiplier?: string;
}

interface YieldFarmCardProps {
  farm: FarmData;
  onStake?: () => void;
  onUnstake?: () => void;
  onHarvest?: () => void;
  className?: string;
}

export function YieldFarmCard({
  farm,
  onStake,
  onUnstake,
  onHarvest,
  className,
}: YieldFarmCardProps) {
  return (
    <motion.div
      className={cn(
        'p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10',
        className
      )}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {farm.token.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-white font-bold">{farm.name}</h3>
            <p className="text-sm text-white/50">Earn {farm.rewardToken.symbol}</p>
          </div>
        </div>
        {farm.multiplier && (
          <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs font-semibold rounded-lg">
            {farm.multiplier}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/50 mb-1">APY</p>
          <p className="text-2xl font-bold text-green-400">{farm.apy.toFixed(2)}%</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/50 mb-1">TVL</p>
          <p className="text-2xl font-bold text-white">${(farm.tvl / 1e6).toFixed(2)}M</p>
        </div>
      </div>

      {/* Earnings */}
      <div className="p-4 bg-white/5 rounded-xl mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">{farm.rewardToken.symbol} Earned</span>
          <span className="text-lg font-bold text-white">{farm.earned.toFixed(4)}</span>
        </div>
        <button
          onClick={onHarvest}
          disabled={farm.earned === 0}
          className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Harvest
        </button>
      </div>

      {/* Staked */}
      <div className="flex gap-2">
        <button
          onClick={onStake}
          className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium transition-colors"
        >
          Stake
        </button>
        {farm.staked > 0 && (
          <button
            onClick={onUnstake}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
          >
            Unstake ({farm.staked.toFixed(2)})
          </button>
        )}
      </div>
    </motion.div>
  );
}
