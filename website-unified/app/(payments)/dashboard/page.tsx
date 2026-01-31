/**
 * Payment Dashboard Page
 * 
 * Analytics dashboard for payment tracking and financial reporting
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Users,
  Activity,
  RefreshCw
} from 'lucide-react';
import { RevenueAnalytics } from '@/components/payments/RevenueAnalytics';
import { FinancialReports } from '@/components/payments/FinancialReports';
import { PaymentAlerts } from '@/components/payments/PaymentAlerts';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import type { PaymentAnalytics, PaymentSummary, Payment } from '@/lib/payments/types';

// ============================================
// Types
// ============================================

interface DashboardStats {
  totalRevenue: string;
  revenueChange: number;
  totalPayments: number;
  paymentsChange: number;
  successRate: number;
  successRateChange: number;
  averagePayment: string;
  averageChange: number;
  activeSubscriptions: number;
  subscriptionsChange: number;
  pendingPayouts: string;
}

// ============================================
// Mock Data (Replace with API calls)
// ============================================

const mockStats: DashboardStats = {
  totalRevenue: '125,430.50',
  revenueChange: 12.5,
  totalPayments: 3842,
  paymentsChange: 8.2,
  successRate: 98.7,
  successRateChange: 0.5,
  averagePayment: '32.65',
  averageChange: -2.1,
  activeSubscriptions: 847,
  subscriptionsChange: 15.3,
  pendingPayouts: '12,350.00',
};

const mockPayments: Payment[] = [];

// ============================================
// Component
// ============================================

export default function PaymentDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'reports' | 'history'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Fetch dashboard data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockStats);
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Dashboard</h1>
            <p className="text-gray-400 text-sm">Track revenue, payments, and financial metrics</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'reports', label: 'Reports' },
              { id: 'history', label: 'History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue}`}
                change={stats.revenueChange}
                icon={DollarSign}
                color="green"
              />
              <StatCard
                title="Total Payments"
                value={stats.totalPayments.toLocaleString()}
                change={stats.paymentsChange}
                icon={CreditCard}
                color="blue"
              />
              <StatCard
                title="Success Rate"
                value={`${stats.successRate}%`}
                change={stats.successRateChange}
                icon={Activity}
                color="purple"
              />
              <StatCard
                title="Avg. Payment"
                value={`$${stats.averagePayment}`}
                change={stats.averageChange}
                icon={TrendingUp}
                color="yellow"
              />
              <StatCard
                title="Active Subscriptions"
                value={stats.activeSubscriptions.toLocaleString()}
                change={stats.subscriptionsChange}
                icon={Users}
                color="cyan"
              />
            </div>

            {/* Alerts */}
            <PaymentAlerts />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueAnalytics dateRange={dateRange} compact />
              <PaymentsByChainChart />
            </div>

            {/* Recent Payments */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
              <PaymentHistory payments={payments} pageSize={5} showPagination={false} />
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <RevenueAnalytics dateRange={dateRange} />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <FinancialReports dateRange={dateRange} />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <PaymentHistory 
            payments={payments} 
            onRefresh={fetchData}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// Stat Card Component
// ============================================

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'green' | 'blue' | 'purple' | 'yellow' | 'cyan';
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{Math.abs(change)}%</span>
        <span className="text-gray-500">vs last period</span>
      </div>
    </div>
  );
}

// ============================================
// Payments by Chain Chart
// ============================================

function PaymentsByChainChart() {
  const data = [
    { chain: 'Base', percentage: 45, color: '#3B82F6' },
    { chain: 'Arbitrum', percentage: 25, color: '#28A0F0' },
    { chain: 'Ethereum', percentage: 15, color: '#627EEA' },
    { chain: 'Polygon', percentage: 10, color: '#8247E5' },
    { chain: 'Optimism', percentage: 5, color: '#FF0420' },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Payments by Chain</h3>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.chain}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{item.chain}</span>
              <span className="text-gray-400">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
