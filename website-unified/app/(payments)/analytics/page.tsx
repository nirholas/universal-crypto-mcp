/**
 * Analytics Page
 * 
 * Comprehensive payment analytics and reporting dashboard
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { Suspense, useState } from 'react';
import { Loader2, Calendar } from 'lucide-react';
import { RevenueAnalytics } from '@/components/payments/RevenueAnalytics';
import { FinancialReports } from '@/components/payments/FinancialReports';
import { PaymentAlerts } from '@/components/payments/PaymentAlerts';

// ============================================
// Types
// ============================================

type DateRange = '7d' | '30d' | '90d' | '1y';

// ============================================
// Loading Fallback
// ============================================

function AnalyticsLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

// ============================================
// Component
// ============================================

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics & Reports</h1>
              <p className="text-gray-400 text-sm">
                Track your payment performance and generate reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Alerts Section */}
        <section>
          <Suspense fallback={<AnalyticsLoading />}>
            <PaymentAlerts compact={true} />
          </Suspense>
        </section>

        {/* Revenue Analytics */}
        <section>
          <Suspense fallback={<AnalyticsLoading />}>
            <RevenueAnalytics dateRange={dateRange} />
          </Suspense>
        </section>

        {/* Financial Reports */}
        <section>
          <Suspense fallback={<AnalyticsLoading />}>
            <FinancialReports dateRange={dateRange} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
