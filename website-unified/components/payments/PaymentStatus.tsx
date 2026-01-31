/**
 * Payment Status Component
 * 
 * Real-time payment status display with progress animation
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Loader2, 
  Clock, 
  RefreshCw, 
  ExternalLink,
  AlertCircle 
} from 'lucide-react';
import { getExplorerTxUrl, getChainName } from '@/lib/payments/config';
import type { PaymentStatus as PaymentStatusType, ChainId, Hash } from '@/lib/payments/types';

// ============================================
// Types
// ============================================

interface PaymentStatusProps {
  paymentId: string;
  status: PaymentStatusType;
  txHash?: Hash;
  chainId: ChainId;
  confirmations?: number;
  requiredConfirmations?: number;
  createdAt?: number;
  onRetry?: () => void;
  onClose?: () => void;
  compact?: boolean;
}

// ============================================
// Status Configuration
// ============================================

const STATUS_CONFIG: Record<PaymentStatusType, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  label: string;
  description: string;
}> = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    label: 'Pending',
    description: 'Waiting for payment',
  },
  processing: {
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    label: 'Processing',
    description: 'Transaction is being processed',
  },
  confirming: {
    icon: Loader2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    label: 'Confirming',
    description: 'Waiting for confirmations',
  },
  completed: {
    icon: Check,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    label: 'Completed',
    description: 'Payment successful',
  },
  failed: {
    icon: X,
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    label: 'Failed',
    description: 'Payment failed',
  },
  refunded: {
    icon: RefreshCw,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    label: 'Refunded',
    description: 'Payment was refunded',
  },
  expired: {
    icon: Clock,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/20',
    label: 'Expired',
    description: 'Payment request expired',
  },
};

// ============================================
// Component
// ============================================

export function PaymentStatus({
  paymentId,
  status,
  txHash,
  chainId,
  confirmations = 0,
  requiredConfirmations = 1,
  createdAt,
  onRetry,
  onClose,
  compact = false,
}: PaymentStatusProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time
  useEffect(() => {
    if (!createdAt || status === 'completed' || status === 'failed' || status === 'expired') {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Math.floor(Date.now() / 1000) - createdAt);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, status]);

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const isLoading = status === 'processing' || status === 'confirming';
  const confirmationProgress = requiredConfirmations > 0 
    ? Math.min((confirmations / requiredConfirmations) * 100, 100)
    : 0;

  // Format elapsed time
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Compact view
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
        </div>
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
        {status === 'confirming' && (
          <span className="text-xs text-gray-400">
            ({confirmations}/{requiredConfirmations})
          </span>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Status Header */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full ${config.bgColor} flex items-center justify-center`}>
            <Icon className={`w-7 h-7 ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${config.color}`}>
              {config.label}
            </h3>
            <p className="text-gray-400 text-sm">
              {config.description}
            </p>
          </div>
          {createdAt && isLoading && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Elapsed</div>
              <div className="font-mono text-white">{formatTime(elapsedTime)}</div>
            </div>
          )}
        </div>

        {/* Confirmation Progress */}
        {status === 'confirming' && requiredConfirmations > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Confirmations</span>
              <span className="text-white">
                {confirmations} / {requiredConfirmations}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${confirmationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-6 pb-6 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Payment ID</span>
          <span className="font-mono text-gray-300">
            {paymentId.slice(0, 8)}...{paymentId.slice(-4)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Network</span>
          <span className="text-white">{getChainName(chainId)}</span>
        </div>

        {txHash && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Transaction</span>
            <a
              href={getExplorerTxUrl(chainId, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
            >
              <span className="font-mono">
                {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      {(status === 'failed' || status === 'expired') && (
        <div className="px-6 pb-6 flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      )}

      {status === 'completed' && onClose && (
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// Status Badge Component
// ============================================

interface StatusBadgeProps {
  status: PaymentStatusType;
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentStatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const isLoading = status === 'processing' || status === 'confirming';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} ${config.bgColor} rounded-full`}>
      <Icon className={`${iconSizes[size]} ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
      <span className={config.color}>{config.label}</span>
    </span>
  );
}

// ============================================
// Inline Status Component
// ============================================

interface InlineStatusProps {
  status: PaymentStatusType;
  txHash?: Hash;
  chainId?: ChainId;
}

export function PaymentStatusInline({ status, txHash, chainId }: InlineStatusProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const isLoading = status === 'processing' || status === 'confirming';

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
      </div>
      <div>
        <div className={`font-medium ${config.color}`}>{config.label}</div>
        {txHash && chainId && (
          <a
            href={getExplorerTxUrl(chainId, txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-400 flex items-center gap-1"
          >
            View transaction
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default PaymentStatus;
