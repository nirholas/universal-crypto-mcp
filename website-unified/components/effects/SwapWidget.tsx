'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowDownUp, 
  Settings, 
  ChevronDown, 
  Loader2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface Token {
  symbol: string;
  name: string;
  logo?: string;
  balance?: number;
  price?: number;
}

interface SwapWidgetProps {
  tokens: Token[];
  onSwap?: (from: Token, to: Token, amount: number) => Promise<void>;
  className?: string;
}

export function SwapWidget({ tokens, onSwap, className }: SwapWidgetProps) {
  const [fromToken, setFromToken] = useState<Token | null>(tokens[0] || null);
  const [toToken, setToToken] = useState<Token | null>(tokens[1] || null);
  const [fromAmount, setFromAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate estimated output
  const toAmount = fromAmount && fromToken?.price && toToken?.price
    ? (parseFloat(fromAmount) * fromToken.price / toToken.price).toFixed(6)
    : '';

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !onSwap) return;
    
    setIsLoading(true);
    try {
      await onSwap(fromToken, toToken, parseFloat(fromAmount));
    } finally {
      setIsLoading(false);
    }
  };

  const TokenSelector = ({ 
    token, 
    onSelect, 
    show, 
    setShow 
  }: { 
    token: Token | null; 
    onSelect: (t: Token) => void;
    show: boolean;
    setShow: (s: boolean) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
      >
        {token ? (
          <>
            <TokenLogo symbol={token.symbol} src={token.logo} size="sm" />
            <span className="font-medium text-white">{token.symbol}</span>
          </>
        ) : (
          <span className="text-white/60">Select</span>
        )}
        <ChevronDown className="w-4 h-4 text-white/40" />
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {tokens.map((t) => (
              <button
                key={t.symbol}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 text-left transition-colors"
                onClick={() => {
                  onSelect(t);
                  setShow(false);
                }}
              >
                <TokenLogo symbol={t.symbol} src={t.logo} size="sm" />
                <div>
                  <div className="font-medium text-white">{t.symbol}</div>
                  {t.balance !== undefined && (
                    <div className="text-xs text-white/40">
                      Balance: {t.balance.toFixed(4)}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Swap</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="mb-4 p-3 bg-white/5 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-sm text-white/60 mb-2">Slippage Tolerance</div>
              <div className="flex gap-2">
                {[0.1, 0.5, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                      slippage === s
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    )}
                  >
                    {s}%
                  </button>
                ))}
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                  className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white text-center"
                  step="0.1"
                  min="0.1"
                  max="50"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* From Input */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/60">From</span>
            {fromToken?.balance !== undefined && (
              <button 
                className="text-sm text-purple-400 hover:text-purple-300"
                onClick={() => setFromAmount(fromToken.balance?.toString() || '')}
              >
                Max: {fromToken.balance.toFixed(4)}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-medium text-white placeholder:text-white/20 focus:outline-none"
            />
            <TokenSelector
              token={fromToken}
              onSelect={setFromToken}
              show={showFromSelect}
              setShow={setShowFromSelect}
            />
          </div>
          {fromToken?.price && fromAmount && (
            <div className="mt-2 text-sm text-white/40">
              ≈ ${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <motion.button
            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border-4 border-black rounded-xl transition-colors"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwapTokens}
          >
            <ArrowDownUp className="w-5 h-5 text-purple-400" />
          </motion.button>
        </div>

        {/* To Input */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/60">To</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-medium text-white placeholder:text-white/20"
            />
            <TokenSelector
              token={toToken}
              onSelect={setToToken}
              show={showToSelect}
              setShow={setShowToSelect}
            />
          </div>
          {toToken?.price && toAmount && (
            <div className="mt-2 text-sm text-white/40">
              ≈ ${(parseFloat(toAmount) * toToken.price).toFixed(2)}
            </div>
          )}
        </div>

        {/* Swap Details */}
        {fromToken && toToken && fromAmount && (
          <motion.div
            className="mt-4 p-3 bg-white/5 rounded-xl space-y-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between text-white/60">
              <span>Rate</span>
              <span className="text-white">
                1 {fromToken.symbol} = {(fromToken.price! / toToken.price!).toFixed(4)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Slippage</span>
              <span className="text-white">{slippage}%</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Network Fee</span>
              <span className="text-white flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                ~$2.50
              </span>
            </div>
          </motion.div>
        )}

        {/* Swap Button */}
        <motion.button
          className={cn(
            'w-full mt-4 py-4 rounded-xl font-semibold text-white transition-all',
            fromToken && toToken && fromAmount
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              : 'bg-white/10 cursor-not-allowed'
          )}
          whileHover={fromToken && toToken && fromAmount ? { scale: 1.02 } : {}}
          whileTap={fromToken && toToken && fromAmount ? { scale: 0.98 } : {}}
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !fromAmount || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Swapping...
            </span>
          ) : !fromToken || !toToken ? (
            'Select tokens'
          ) : !fromAmount ? (
            'Enter amount'
          ) : (
            'Swap'
          )}
        </motion.button>
      </div>
    </div>
  );
}
