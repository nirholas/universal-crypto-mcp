import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { NetworkMetrics } from '../../types/analytics';

interface NetworkDistributionProps {
  networks: NetworkMetrics[];
}

const COLORS = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export function NetworkDistribution({ networks }: NetworkDistributionProps) {
  const data = networks.map((n) => ({
    name: n.chainName,
    value: n.totalPayments,
    volume: n.totalVolume,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Network Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} payments`,
              name,
            ]}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => (
              <span className="text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
