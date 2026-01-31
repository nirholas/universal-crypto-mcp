'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletButtonProps {
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function WalletButton({
  address,
  onConnect,
  onDisconnect,
  className,
}: WalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  if (!address) {
    return (
      <motion.button
        className={cn(
          'flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onConnect}
      >
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white',
          className
        )}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        <span className="font-mono">{shortAddress}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => navigator.clipboard.writeText(address)}
            >
              <Copy className="w-4 h-4" /> Copy Address
            </button>
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-white/60 hover:text-white hover:bg-white/5"
            >
              <ExternalLink className="w-4 h-4" /> View on Explorer
            </a>
            <button
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-white/5"
              onClick={onDisconnect}
            >
              <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
