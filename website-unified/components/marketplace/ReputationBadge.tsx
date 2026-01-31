'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface ReputationBadgeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ReputationBadge({ score, size = 'md', showLabel = false, className }: ReputationBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500' };
    if (score >= 70) return { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-500' };
    if (score >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500' };
  };

  const getLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  const colors = getColor(score);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold ring-2',
          sizes[size],
          colors.bg,
          colors.text,
          colors.ring
        )}
      >
        {score}
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', colors.text)}>{getLabel(score)}</span>
      )}
    </div>
  );
}

interface VerificationBadgesProps {
  verified: boolean;
  kycVerified?: boolean;
  onChainVerified?: boolean;
  className?: string;
}

export function VerificationBadges({
  verified,
  kycVerified,
  onChainVerified,
  className,
}: VerificationBadgesProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {verified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Verified
        </span>
      )}
      {kycVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          KYC Verified
        </span>
      )}
      {onChainVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          On-Chain
        </span>
      )}
    </div>
  );
}

interface TrustIndicatorsProps {
  uptime: number;
  responseTime: number;
  successRate: number;
  className?: string;
}

export function TrustIndicators({ uptime, responseTime, successRate, className }: TrustIndicatorsProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{uptime.toFixed(2)}%</div>
        <div className="text-xs text-gray-500">Uptime</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{responseTime}ms</div>
        <div className="text-xs text-gray-500">Avg Response</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{successRate.toFixed(1)}%</div>
        <div className="text-xs text-gray-500">Success Rate</div>
      </div>
    </div>
  );
}
