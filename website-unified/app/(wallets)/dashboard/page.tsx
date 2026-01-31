/**
 * Portfolio Dashboard Page
 * 
 * Comprehensive wallet dashboard showing assets, balances, and history
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Image,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Settings,
  Plus,
} from 'lucide-react';
import { useWallet, WalletGuard } from '@/providers/WalletProvider';
import { useTokenBalances, useNFTs, useTransactionHistory } from '@/lib/wallets/hooks';
import { formatUsd, formatPercentChange, formatBalance } from '@/lib/wallets/utils';
import { TokenList } from '@/components/wallets/TokenList';
import { NFTGallery } from '@/components/wallets/NFTGallery';
import { TransactionHistory } from '@/components/wallets/TransactionHistory';
import { NetworkSwitcher } from '@/components/wallets/NetworkSwitcher';
import { WalletStatus } from '@/components/wallets/WalletStatus';
import { cn } from '@/lib/utils';

// ============================================
// Portfolio Overview Card
// ============================================

function PortfolioOverview() {
  const { activeWallet, currentNetwork } = useWallet();
  const { balances, isLoading, refetch } = useTokenBalances(
    activeWallet?.address,
    currentNetwork?.chainId
  );

  const totalValue = balances.reduce((sum, b) => sum + b.valueUsd, 0);
  const change24h = 245.32; // Mock data
  const changePercent24h = 2.45; // Mock data
  const isPositive = changePercent24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Total Portfolio Value</h2>
            <p className="text-sm text-white/70">Across all chains</p>
          </div>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
        </button>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold mb-2">
          {isLoading ? (
            <div className="h-10 w-48 bg-white/20 rounded animate-pulse" />
          ) : (
            formatUsd(totalValue)
          )}
        </div>
        <div className={cn(
          'flex items-center gap-2 text-sm',
          isPositive ? 'text-green-300' : 'text-red-300'
        )}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {formatPercentChange(changePercent24h)} ({formatUsd(Math.abs(change24h))}) today
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-sm text-white/70 mb-1">Tokens</div>
          <div className="text-xl font-semibold">{balances.length}</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-sm text-white/70 mb-1">Networks</div>
          <div className="text-xl font-semibold">5</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-sm text-white/70 mb-1">NFTs</div>
          <div className="text-xl font-semibold">12</div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Chain Breakdown Chart
// ============================================

function ChainBreakdown() {
  // Mock chain breakdown data
  const chains = [
    { name: 'Ethereum', value: 15234.56, percentage: 45, color: '#627EEA' },
    { name: 'Polygon', value: 8456.23, percentage: 25, color: '#8247E5' },
    { name: 'Arbitrum', value: 5123.45, percentage: 15, color: '#28A0F0' },
    { name: 'Base', value: 3456.78, percentage: 10, color: '#0052FF' },
    { name: 'Others', value: 1678.90, percentage: 5, color: '#9CA3AF' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chain Distribution
        </h3>
        <PieChart className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {chains.map((chain) => (
          <div key={chain.name} className="flex items-center gap-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chain.color }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {chain.name}
                </span>
                <span className="text-sm text-gray-500">
                  {chain.percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${chain.percentage}%`,
                    backgroundColor: chain.color,
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white w-24 text-right">
              {formatUsd(chain.value)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// DeFi Positions Summary
// ============================================

function DeFiPositions() {
  // Mock DeFi positions
  const positions = [
    {
      protocol: 'Aave',
      type: 'Lending',
      value: 5000,
      apy: 3.45,
      icon: '/icons/protocols/aave.svg',
    },
    {
      protocol: 'Uniswap',
      type: 'Liquidity',
      value: 3500,
      apy: 12.5,
      icon: '/icons/protocols/uniswap.svg',
    },
    {
      protocol: 'Lido',
      type: 'Staking',
      value: 8000,
      apy: 4.2,
      icon: '/icons/protocols/lido.svg',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          DeFi Positions
        </h3>
        <Layers className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {positions.map((position) => (
          <div
            key={position.protocol}
            className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <img
              src={position.icon}
              alt={position.protocol}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/protocols/default.svg';
              }}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {position.protocol}
              </div>
              <div className="text-sm text-gray-500">{position.type}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white">
                {formatUsd(position.value)}
              </div>
              <div className="text-sm text-green-500">+{position.apy}% APY</div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 text-center text-blue-500 hover:text-blue-600 font-medium">
        View All Positions →
      </button>
    </motion.div>
  );
}

// ============================================
// Quick Actions
// ============================================

function QuickActions() {
  const actions = [
    { icon: ArrowUpRight, label: 'Send', href: '/wallets/send', color: 'bg-blue-500' },
    { icon: ArrowDownLeft, label: 'Receive', href: '/wallets/receive', color: 'bg-green-500' },
    { icon: Activity, label: 'Swap', href: '/wallets/swap', color: 'bg-purple-500' },
    { icon: Plus, label: 'Buy', href: '/wallets/buy', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex gap-4">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="flex-1 flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
        >
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', action.color)}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {action.label}
          </span>
        </a>
      ))}
    </div>
  );
}

// ============================================
// Main Dashboard Page
// ============================================

type TabType = 'tokens' | 'nfts' | 'history';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tokens');
  const { openConnectModal } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Wallet Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your assets across all chains
          </p>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSwitcher />
          <WalletStatus />
        </div>
      </div>

      <WalletGuard
        fallback={
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Connect your wallet to view your portfolio and manage assets
            </p>
            <button
              onClick={openConnectModal}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        }
      >
        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <PortfolioOverview />
          </div>

          {/* Chain Breakdown */}
          <div>
            <ChainBreakdown />
          </div>
        </div>

        {/* DeFi Positions */}
        <div className="mb-8">
          <DeFiPositions />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
            {(['tokens', 'nfts', 'history'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium transition-all',
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {tab === 'tokens' && 'Tokens'}
                {tab === 'nfts' && 'NFTs'}
                {tab === 'history' && 'History'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
        >
          {activeTab === 'tokens' && <TokenList />}
          {activeTab === 'nfts' && <NFTGallery />}
          {activeTab === 'history' && <TransactionHistory />}
        </motion.div>
      </WalletGuard>
    </div>
  );
}
