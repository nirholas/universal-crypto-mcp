/**
 * Wallet Status
 * 
 * Connected wallet address display with ENS/SNS resolution and quick actions
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  ExternalLink,
  LogOut,
  ChevronDown,
  Wallet,
  RefreshCw,
  Settings,
  User,
  History,
  Shield,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { useAddressName, useTokenBalances } from '@/lib/wallets/hooks';
import { truncateAddress, formatBalance, formatUsd, copyToClipboard } from '@/lib/wallets/utils';
import { getExplorerAddressUrl } from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface WalletStatusProps {
  onOpenConnect?: () => void;
  onOpenSettings?: () => void;
  showBalance?: boolean;
  className?: string;
}

// ============================================
// Main Component
// ============================================

export function WalletStatus({
  onOpenConnect,
  onOpenSettings,
  showBalance = true,
  className,
}: WalletStatusProps) {
  const {
    isConnected,
    isConnecting,
    activeWallet,
    currentNetwork,
    disconnect,
    openConnectModal,
  } = useWallet();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get ENS/SNS name
  const { name: resolvedName, displayName } = useAddressName(activeWallet?.address);

  // Get native balance
  const { balances, isLoading: isLoadingBalance } = useTokenBalances(
    activeWallet?.address,
    currentNetwork?.chainId
  );

  const nativeBalance = balances.find(b => b.token.isNative);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle copy address
  const handleCopy = async () => {
    if (activeWallet?.address) {
      await copyToClipboard(activeWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    await disconnect();
    setIsDropdownOpen(false);
  };

  // Open explorer
  const openExplorer = () => {
    if (activeWallet?.address && currentNetwork) {
      const url = getExplorerAddressUrl(currentNetwork, activeWallet.address);
      window.open(url, '_blank');
    }
  };

  // Not connected state
  if (!isConnected || !activeWallet) {
    return (
      <button
        onClick={onOpenConnect || openConnectModal}
        disabled={isConnecting}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
          'bg-blue-500 hover:bg-blue-600 text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        {isConnecting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Wallet Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          'flex items-center gap-3 px-4 py-2 rounded-xl border transition-all',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'border-gray-200 dark:border-gray-700',
          isDropdownOpen && 'ring-2 ring-blue-500'
        )}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: `linear-gradient(135deg, ${currentNetwork?.color || '#627EEA'}, #1a1a2e)`,
          }}
        >
          {displayName.slice(0, 2).toUpperCase()}
        </div>

        {/* Address & Balance */}
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {resolvedName || truncateAddress(activeWallet.address)}
            </span>
            {resolvedName && (
              <span className="text-xs text-gray-500">
                {truncateAddress(activeWallet.address, 4, 3)}
              </span>
            )}
          </div>
          {showBalance && nativeBalance && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatBalance(nativeBalance.balance, nativeBalance.token.decimals)}{' '}
              {nativeBalance.token.symbol}
            </div>
          )}
        </div>

        {/* Network Indicator */}
        {currentNetwork && (
          <div
            className="w-3 h-3 rounded-full border-2 border-white dark:border-gray-900"
            style={{ backgroundColor: currentNetwork.color || '#627EEA' }}
            title={currentNetwork.name}
          />
        )}

        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform',
            isDropdownOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute top-full mt-2 right-0 z-50',
              'w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl',
              'border border-gray-200 dark:border-gray-700 overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${currentNetwork?.color || '#627EEA'}, #1a1a2e)`,
                  }}
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {resolvedName || truncateAddress(activeWallet.address)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentNetwork?.name || 'Unknown Network'}
                  </div>
                </div>
              </div>

              {/* Balance */}
              {nativeBalance && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Balance</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatBalance(nativeBalance.balance, nativeBalance.token.decimals)}{' '}
                    {nativeBalance.token.symbol}
                  </div>
                  <div className="text-sm text-gray-500">
                    ≈ {formatUsd(nativeBalance.valueUsd)}
                  </div>
                </div>
              )}

              {/* Address with copy */}
              <div className="mt-3 flex items-center gap-2">
                <code className="flex-1 text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {truncateAddress(activeWallet.address, 10, 8)}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={openExplorer}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <a
                href="/wallets/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Dashboard</span>
              </a>
              <a
                href="/wallets/history"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <History className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Transaction History</span>
              </a>
              <a
                href="/wallets/security"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Security Center</span>
              </a>
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Settings</span>
              </button>
            </div>

            {/* Disconnect */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDisconnect}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2 rounded-lg',
                  'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
                  'transition-colors'
                )}
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WalletStatus;
