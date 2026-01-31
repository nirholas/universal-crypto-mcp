'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, CheckCircle, Info, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

interface SecurityCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  message: string;
  details?: string;
}

interface SecurityBadgeProps {
  level: RiskLevel;
  score?: number;
  checks?: SecurityCheck[];
  contractAddress?: string;
  explorerUrl?: string;
  className?: string;
}

const levelConfig = {
  safe: { color: 'green', icon: CheckCircle, label: 'Safe', bgColor: 'bg-green-500' },
  low: { color: 'emerald', icon: CheckCircle, label: 'Low Risk', bgColor: 'bg-emerald-500' },
  medium: { color: 'amber', icon: AlertTriangle, label: 'Medium Risk', bgColor: 'bg-amber-500' },
  high: { color: 'orange', icon: AlertTriangle, label: 'High Risk', bgColor: 'bg-orange-500' },
  critical: { color: 'red', icon: AlertTriangle, label: 'Critical Risk', bgColor: 'bg-red-500' },
};

const checkIcons = {
  pass: <CheckCircle className="w-4 h-4 text-green-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  fail: <X className="w-4 h-4 text-red-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
};

export function SecurityBadge({
  level,
  score,
  checks = [],
  contractAddress,
  explorerUrl,
  className,
}: SecurityBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn('relative', className)}>
      <motion.button
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          `bg-${config.color}-500/20 text-${config.color}-400 hover:bg-${config.color}-500/30`
        )}
        style={{
          backgroundColor: `rgb(var(--${config.color}-500) / 0.2)`,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
        {score !== undefined && (
          <span className="ml-1 px-1.5 py-0.5 bg-black/30 rounded text-xs">
            {score}/100
          </span>
        )}
      </motion.button>

      {/* Expanded Panel */}
      {isExpanded && checks.length > 0 && (
        <motion.div
          className="absolute top-full right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white/60" />
                <span className="font-semibold text-white">Security Analysis</span>
              </div>
              <div className={cn(
                'px-2 py-1 rounded-lg text-xs font-bold',
                config.bgColor
              )}>
                {score !== undefined ? `${score}/100` : config.label}
              </div>
            </div>
            {contractAddress && (
              <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                <span className="font-mono">{contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</span>
                {explorerUrl && (
                  <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Checks */}
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="space-y-3">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {checkIcons[check.status]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{check.name}</p>
                    <p className="text-xs text-white/60 mt-0.5">{check.message}</p>
                    {check.details && (
                      <p className="text-xs text-white/40 mt-1 font-mono">{check.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-white/[0.02]">
            <p className="text-xs text-white/40 text-center">
              Powered by Security Scanner
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
