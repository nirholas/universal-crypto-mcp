import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import type { RevenueData, TimeWindow } from '../../types/analytics';
import { TIME_WINDOWS } from '../../types/analytics';

interface RevenueChartProps {
  data: RevenueData[];
  window: TimeWindow['value'];
  onWindowChange: (window: TimeWindow['value']) => void;
}

function formatTime(timestamp: number, window: string): string {
  const date = new Date(timestamp);
  if (window === '24h') {
    return format(date, 'HH:mm');
  } else if (window === '7d') {
    return format(date, 'EEE');
  }
  return format(date, 'MMM d');
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {format(new Date(label), 'MMM d, HH:mm')}
      </p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function RevenueChart({ data, window, onWindowChange }: RevenueChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue
        </h3>
        <div className="flex gap-1">
          {TIME_WINDOWS.map((tw) => (
            <button
              key={tw.value}
              onClick={() => onWindowChange(tw.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                window === tw.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tw.value}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => formatTime(ts, window)}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
