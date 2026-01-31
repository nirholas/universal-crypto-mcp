import { useState } from 'react';
import {
  Activity,
  DollarSign,
  CreditCard,
  Users,
} from 'lucide-react';
import { StatCard } from '../components/cards/StatCard';
import { NetworkCard } from '../components/cards/NetworkCard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { NetworkDistribution } from '../components/charts/NetworkDistribution';
import { PaymentsTable } from '../components/tables/PaymentsTable';
import { useRealTimeStats, useAnalytics } from '../hooks/useAnalytics';
import type { TimeWindow } from '../types/analytics';

export function Dashboard() {
  const { stats, isConnected } = useRealTimeStats();
  const [timeWindow, setTimeWindow] = useState<TimeWindow['value']>('24h');
  const { revenueData, payments, networks, isLoading } = useAnalytics(timeWindow);

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time analytics and system health
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Payments/min"
          value={stats?.paymentsPerMinute ?? 0}
          icon={<Activity className="h-5 w-5" />}
          trend={stats?.trend}
          trendValue={stats?.trend === 'up' ? '+12%' : stats?.trend === 'down' ? '-5%' : ''}
        />
        <StatCard
          title="Revenue/hour"
          value={formatCurrency(stats?.revenuePerHour ?? '0')}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingSettlements ?? 0}
          icon={<CreditCard className="h-5 w-5" />}
          status={
            (stats?.pendingSettlements ?? 0) > 50
              ? 'warning'
              : (stats?.pendingSettlements ?? 0) > 100
              ? 'critical'
              : 'normal'
          }
        />
        <StatCard
          title="Connections"
          value={stats?.activeConnections ?? 0}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            data={revenueData}
            window={timeWindow}
            onWindowChange={setTimeWindow}
          />
        </div>
        <NetworkDistribution networks={networks} />
      </div>

      {/* Network Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Network Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networks.map((network) => (
            <NetworkCard key={network.chainId} network={network} />
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <PaymentsTable payments={payments} isLoading={isLoading} />
    </div>
  );
}
