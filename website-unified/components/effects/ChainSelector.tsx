'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  Check, 
  Network,
  Zap
} from 'lucide-react';

interface Chain {
  id: number;
  name: string;
  icon: string | React.ReactNode;
  color: string;
  rpcUrl?: string;
  explorerUrl?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain | null;
  onSelect: (chain: Chain) => void;
  disabled?: boolean;
  className?: string;
}

const defaultChains: Chain[] = [
  { id: 1, name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 137, name: 'Polygon', icon: '⬡', color: '#8247E5' },
  { id: 42161, name: 'Arbitrum', icon: '🔵', color: '#28A0F0' },
  { id: 10, name: 'Optimism', icon: '🔴', color: '#FF0420' },
  { id: 8453, name: 'Base', icon: '🔵', color: '#0052FF' },
  { id: 43114, name: 'Avalanche', icon: '🔺', color: '#E84142' },
  { id: 56, name: 'BNB Chain', icon: '⬡', color: '#F0B90B' },
  { id: 250, name: 'Fantom', icon: '👻', color: '#1969FF' },
];

export function ChainSelector({
  chains = defaultChains,
  selectedChain,
  onSelect,
  disabled = false,
  className,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <motion.button
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        {selectedChain ? (
          <>
            <span 
              className="w-6 h-6 flex items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: selectedChain.color + '30' }}
            >
              {selectedChain.icon}
            </span>
            <span className="font-medium text-white">{selectedChain.name}</span>
          </>
        ) : (
          <>
            <Network className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Select Network</span>
          </>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 text-white/40 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="p-2 border-b border-white/5">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-white/40 uppercase">
                  <Zap className="w-3 h-3" /> Networks
                </div>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {chains.map((chain, i) => {
                  const isSelected = selectedChain?.id === chain.id;
                  
                  return (
                    <motion.button
                      key={chain.id}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors',
                        isSelected 
                          ? 'bg-white/10' 
                          : 'hover:bg-white/5'
                      )}
                      onClick={() => {
                        onSelect(chain);
                        setIsOpen(false);
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <span 
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-lg"
                        style={{ backgroundColor: chain.color + '20' }}
                      >
                        {chain.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-white">{chain.name}</div>
                        <div className="text-xs text-white/40">Chain ID: {chain.id}</div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
