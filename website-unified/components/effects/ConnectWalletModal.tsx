'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wallet, X, ChevronRight, Loader2, Check } from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  installed?: boolean;
  popular?: boolean;
}

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => Promise<void>;
  wallets?: WalletOption[];
}

const defaultWallets: WalletOption[] = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', popular: true },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', popular: true },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '💰', popular: true },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
  { id: 'phantom', name: 'Phantom', icon: '👻' },
  { id: 'brave', name: 'Brave Wallet', icon: '🦁' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️' },
  { id: 'ledger', name: 'Ledger', icon: '📟' },
];

export function ConnectWalletModal({
  isOpen,
  onClose,
  onConnect,
  wallets = defaultWallets,
}: ConnectWalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId);
    setError(null);
    
    try {
      await onConnect(walletId);
      setConnected(walletId);
      setTimeout(() => {
        onClose();
        setConnected(null);
        setConnecting(null);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setConnecting(null);
    }
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const popularWallets = wallets.filter(w => w.popular);
  const otherWallets = wallets.filter(w => !w.popular);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Wallet className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
                    <p className="text-sm text-white/60">Select your preferred wallet</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Error */}
                {error && (
                  <motion.div
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Popular Wallets */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wide mb-3">
                    Popular
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {popularWallets.map((wallet) => (
                      <motion.button
                        key={wallet.id}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                          connecting === wallet.id
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : connected === wallet.id
                            ? 'bg-green-500/20 border-green-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        )}
                        onClick={() => handleConnect(wallet.id)}
                        disabled={connecting !== null}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-3xl">
                          {connecting === wallet.id ? (
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                          ) : connected === wallet.id ? (
                            <Check className="w-8 h-8 text-green-400" />
                          ) : (
                            wallet.icon
                          )}
                        </span>
                        <span className="text-sm text-white font-medium">{wallet.name}</span>
                        {wallet.installed && (
                          <span className="text-xs text-green-400">Detected</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Other Wallets */}
                {otherWallets.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wide mb-3">
                      More Options
                    </h3>
                    <div className="space-y-2">
                      {otherWallets.map((wallet) => (
                        <motion.button
                          key={wallet.id}
                          className={cn(
                            'flex items-center gap-3 w-full p-3 rounded-xl border transition-all',
                            connecting === wallet.id
                              ? 'bg-purple-500/20 border-purple-500/50'
                              : connected === wallet.id
                              ? 'bg-green-500/20 border-green-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          )}
                          onClick={() => handleConnect(wallet.id)}
                          disabled={connecting !== null}
                          whileHover={{ x: 4 }}
                        >
                          <span className="text-2xl">{wallet.icon}</span>
                          <span className="flex-1 text-left font-medium text-white">
                            {wallet.name}
                          </span>
                          {connecting === wallet.id ? (
                            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                          ) : connected === wallet.id ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-white/40" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                <p className="text-xs text-white/40 text-center">
                  By connecting, you agree to our{' '}
                  <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
