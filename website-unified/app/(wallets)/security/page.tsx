/**
 * Security Center Page
 * 
 * Token approvals management and security overview
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  ChevronDown,
  Info,
  Lock,
  Unlock,
  Trash2,
  Clock,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet, WalletGuard } from '@/providers/WalletProvider';
import { useWalletStore } from '@/lib/wallets/store';
import { useTokenApprovals } from '@/lib/wallets/hooks';
import { TokenApproval, SecurityScore } from '@/lib/wallets/types';
import { formatBalance, truncateAddress, getExplorerUrl, formatDate } from '@/lib/wallets/utils';
import { WalletStatus } from '@/components/wallets/WalletStatus';
import { NetworkSwitcher } from '@/components/wallets/NetworkSwitcher';
import { cn } from '@/lib/utils';

// ============================================
// Security Score Component
// ============================================

function SecurityScoreCard({ score }: { score: SecurityScore }) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (value: number) => {
    if (value >= 80) return 'from-green-500 to-emerald-500';
    if (value >= 60) return 'from-yellow-500 to-orange-500';
    if (value >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'At Risk';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Security Score
          </h2>
          <p className="text-sm text-gray-500">
            Based on your wallet's security posture
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-8">
        {/* Score Circle */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-gray-100 dark:text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(score.overall / 100) * 351.86} 351.86`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={cn('stop-current', getScoreColor(score.overall))} />
                <stop offset="100%" className={cn('stop-current', getScoreColor(score.overall))} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold', getScoreColor(score.overall))}>
              {score.overall}
            </span>
            <span className="text-sm text-gray-500">{getScoreLabel(score.overall)}</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Token Approvals</span>
              <span className={cn('font-medium', getScoreColor(score.approvalScore))}>
                {score.approvalScore}/100
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full bg-gradient-to-r', getScoreGradient(score.approvalScore))}
                initial={{ width: 0 }}
                animate={{ width: `${score.approvalScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Contract Risk</span>
              <span className={cn('font-medium', getScoreColor(score.contractRiskScore))}>
                {score.contractRiskScore}/100
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full bg-gradient-to-r', getScoreGradient(score.contractRiskScore))}
                initial={{ width: 0 }}
                animate={{ width: `${score.contractRiskScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Exposure</span>
              <span className={cn('font-medium', getScoreColor(score.exposureScore))}>
                {score.exposureScore}/100
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full bg-gradient-to-r', getScoreGradient(score.exposureScore))}
                initial={{ width: 0 }}
                animate={{ width: `${score.exposureScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recommendations
          </h3>
          <div className="space-y-2">
            {score.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg',
                  rec.severity === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : rec.severity === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-blue-50 dark:bg-blue-900/20'
                )}
              >
                {rec.severity === 'critical' ? (
                  <ShieldX className="w-5 h-5 text-red-500 shrink-0" />
                ) : rec.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-blue-500 shrink-0" />
                )}
                <div>
                  <p className={cn(
                    'font-medium',
                    rec.severity === 'critical'
                      ? 'text-red-700 dark:text-red-400'
                      : rec.severity === 'warning'
                      ? 'text-yellow-700 dark:text-yellow-400'
                      : 'text-blue-700 dark:text-blue-400'
                  )}>
                    {rec.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Approval Card Component
// ============================================

interface ApprovalCardProps {
  approval: TokenApproval;
  onRevoke: (approval: TokenApproval) => void;
  isRevoking: boolean;
}

function ApprovalCard({ approval, onRevoke, isRevoking }: ApprovalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { currentNetwork } = useWallet();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        'bg-white dark:bg-gray-900 border rounded-xl overflow-hidden',
        approval.riskLevel === 'high'
          ? 'border-red-200 dark:border-red-800'
          : approval.riskLevel === 'medium'
          ? 'border-yellow-200 dark:border-yellow-800'
          : 'border-gray-200 dark:border-gray-800'
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Token Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {approval.token.logoUri ? (
              <img src={approval.token.logoUri} alt={approval.token.symbol} className="w-full h-full" />
            ) : (
              <span className="text-sm font-bold">{approval.token.symbol.slice(0, 2)}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {approval.token.symbol}
              </span>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getRiskColor(approval.riskLevel))}>
                {approval.riskLevel.toUpperCase()}
              </span>
              {approval.isUnlimited && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
                  UNLIMITED
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              Approved to: {approval.spenderName || truncateAddress(approval.spender)}
            </div>
          </div>

          {/* Amount & Value */}
          <div className="text-right">
            <div className="font-medium text-gray-900 dark:text-white">
              {approval.isUnlimited ? '∞' : formatBalance(approval.amount, approval.token.decimals, 4)}
            </div>
            {approval.valueAtRisk > 0 && (
              <div className="text-sm text-gray-500">
                ${approval.valueAtRisk.toLocaleString()} at risk
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRevoke(approval)}
              disabled={isRevoking}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50',
                isRevoking && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isRevoking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Revoke'
              )}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', expanded && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Spender Contract</span>
                  <a
                    href={getExplorerUrl(currentNetwork?.chainId || 1, 'address', approval.spender)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 font-mono flex items-center gap-1"
                  >
                    {truncateAddress(approval.spender)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Token Contract</span>
                  <a
                    href={getExplorerUrl(currentNetwork?.chainId || 1, 'address', approval.token.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 font-mono flex items-center gap-1"
                  >
                    {truncateAddress(approval.token.address)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Approved On</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatDate(approval.approvedAt)}
                  </span>
                </div>
                {approval.lastUsed && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Used</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDate(approval.lastUsed)}
                    </span>
                  </div>
                )}
                {approval.transactionHash && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Approval TX</span>
                    <a
                      href={getExplorerUrl(currentNetwork?.chainId || 1, 'tx', approval.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 font-mono flex items-center gap-1"
                    >
                      {truncateAddress(approval.transactionHash)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================
// Main Security Page
// ============================================

export default function SecurityPage() {
  const { activeWallet, currentNetwork, openConnectModal } = useWallet();
  const { approvals, isLoading } = useTokenApprovals(activeWallet?.address, currentNetwork?.chainId);
  const revokeApproval = useWalletStore(state => state.revokeApproval);

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Filter approvals
  const filteredApprovals = useMemo(() => {
    let result = approvals;

    if (riskFilter !== 'all') {
      result = result.filter(a => a.riskLevel === riskFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.token.symbol.toLowerCase().includes(query) ||
        a.token.name.toLowerCase().includes(query) ||
        a.spender.toLowerCase().includes(query) ||
        a.spenderName?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [approvals, riskFilter, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = approvals.length;
    const unlimited = approvals.filter(a => a.isUnlimited).length;
    const highRisk = approvals.filter(a => a.riskLevel === 'high').length;
    const totalValueAtRisk = approvals.reduce((sum, a) => sum + a.valueAtRisk, 0);
    
    return { total, unlimited, highRisk, totalValueAtRisk };
  }, [approvals]);

  // Mock security score
  const securityScore: SecurityScore = {
    overall: stats.highRisk > 0 ? 60 : stats.unlimited > 3 ? 70 : 85,
    approvalScore: Math.max(0, 100 - stats.unlimited * 10 - stats.highRisk * 20),
    contractRiskScore: stats.highRisk > 0 ? 50 : 90,
    exposureScore: stats.totalValueAtRisk > 10000 ? 60 : stats.totalValueAtRisk > 1000 ? 80 : 95,
    recommendations: [
      ...(stats.highRisk > 0 ? [{
        severity: 'critical' as const,
        title: `${stats.highRisk} high-risk approvals detected`,
        description: 'Consider revoking approvals to known risky contracts.',
      }] : []),
      ...(stats.unlimited > 3 ? [{
        severity: 'warning' as const,
        title: 'Too many unlimited approvals',
        description: 'Unlimited approvals expose your entire token balance to risk.',
      }] : []),
      ...(stats.totalValueAtRisk > 1000 ? [{
        severity: 'info' as const,
        title: `$${stats.totalValueAtRisk.toLocaleString()} at risk`,
        description: 'Review your approvals to reduce potential exposure.',
      }] : []),
    ],
  };

  const handleRevoke = async (approval: TokenApproval) => {
    setRevokingId(`${approval.token.address}-${approval.spender}`);
    try {
      await revokeApproval(approval.token.address, approval.spender);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/wallets/dashboard"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Security Center
            </h1>
            <p className="text-gray-500">Manage approvals and protect your assets</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSwitcher compact />
          <WalletStatus />
        </div>
      </div>

      <WalletGuard
        fallback={
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connect Wallet
            </h2>
            <p className="text-gray-500 mb-6">
              Connect your wallet to view security status and approvals
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
        {/* Security Score */}
        <SecurityScoreCard score={securityScore} />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Total Approvals</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-500 mb-1">
              <Unlock className="w-4 h-4" />
              <span className="text-sm">Unlimited</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.unlimited}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-sm">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.highRisk}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Value at Risk</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${stats.totalValueAtRisk.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Approvals List */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search approvals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium capitalize transition-colors',
                    riskFilter === filter
                      ? filter === 'high'
                        ? 'bg-red-500 text-white'
                        : filter === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : filter === 'low'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredApprovals.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
              <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery || riskFilter !== 'all' ? 'No matching approvals' : 'No active approvals'}
              </h2>
              <p className="text-gray-500">
                {searchQuery || riskFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your wallet has no token approvals. Great security!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredApprovals.map((approval) => (
                  <ApprovalCard
                    key={`${approval.token.address}-${approval.spender}`}
                    approval={approval}
                    onRevoke={handleRevoke}
                    isRevoking={revokingId === `${approval.token.address}-${approval.spender}`}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </WalletGuard>
    </div>
  );
}
