import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import type { PaymentRecord } from '../../types/analytics';

interface PaymentsTableProps {
  payments: PaymentRecord[];
  isLoading?: boolean;
}

function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length / 2)}...${str.slice(-length / 2)}`;
}

function StatusBadge({ status }: { status: PaymentRecord['status'] }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    settled: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        colors[status]
      )}
    >
      {status}
    </span>
  );
}

function NetworkBadge({ network }: { network: string }) {
  const networkNames: Record<string, string> = {
    'eip155:1': 'Ethereum',
    'eip155:8453': 'Base',
    'eip155:42161': 'Arbitrum',
    'eip155:10': 'Optimism',
    'eip155:137': 'Polygon',
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
      {networkNames[network] || network}
    </span>
  );
}

function AddressLink({ address }: { address: string }) {
  return (
    <a
      href={`https://etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      {truncate(address, 8)}
    </a>
  );
}

export function PaymentsTable({ payments, isLoading }: PaymentsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Payments
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Network
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map((payment) => (
              <tr
                key={payment.paymentId}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {truncate(payment.paymentId, 8)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AddressLink address={payment.payer} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AddressLink address={payment.payee} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {payment.amount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NetworkBadge network={payment.network} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(payment.settledAt), {
                    addSuffix: true,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
