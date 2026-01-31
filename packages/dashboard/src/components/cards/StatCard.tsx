import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  status = 'normal',
  className,
}: StatCardProps) {
  const statusColors = {
    normal: 'bg-white dark:bg-gray-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-500',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={clsx(
        'rounded-lg border p-6 shadow-sm',
        statusColors[status],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {icon && (
          <span className="text-gray-400 dark:text-gray-500">{icon}</span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span className={clsx('flex items-center text-sm', trendColors[trend])}>
            <TrendIcon className="h-4 w-4 mr-0.5" />
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
