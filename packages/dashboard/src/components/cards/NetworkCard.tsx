import { clsx } from 'clsx';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { NetworkMetrics } from '../../types/analytics';

interface NetworkCardProps {
  network: NetworkMetrics;
  className?: string;
}

export function NetworkCard({ network, className }: NetworkCardProps) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    degraded: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    down: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  };

  const config = statusConfig[network.status];
  const StatusIcon = config.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {network.chainName}
        </h3>
        <div className={clsx('flex items-center gap-1 text-sm', config.color)}>
          <StatusIcon className="h-4 w-4" />
          <span className="capitalize">{network.status}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Volume</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {network.totalVolume}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Payments</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {network.totalPayments.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Success Rate</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {(network.successRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Avg Settlement</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {network.averageConfirmationTime}s
          </span>
        </div>
      </div>
    </div>
  );
}
