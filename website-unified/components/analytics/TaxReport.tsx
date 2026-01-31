'use client';

/**
 * Tax Report Component
 * 
 * Generate tax reports with capital gains/losses, income from staking/airdrops,
 * and export functionality for tax filing. Uses real API integration.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { TaxReport as TaxReportType, CostBasisMethod } from '@/lib/analytics/types';
import { formatCurrency, formatDate } from '@/lib/analytics/hooks';
import { generateTaxReport, exportTaxReport } from '@/lib/analytics/api';

// ============================================================================
// Types
// ============================================================================

interface TaxReportProps {
  walletAddresses: string[];
  className?: string;
}

// ============================================================================
// Tax Form Selection Component
// ============================================================================

function TaxFormSelector({ 
  selectedForm, 
  onSelectForm 
}: { 
  selectedForm: string; 
  onSelectForm: (form: string) => void 
}) {
  const forms = [
    { id: 'form8949', name: 'Form 8949', description: 'Sales and Dispositions of Capital Assets' },
    { id: 'scheduleD', name: 'Schedule D', description: 'Capital Gains and Losses' },
    { id: 'form1099', name: 'Form 1099', description: 'Miscellaneous Income' },
    { id: 'fbar', name: 'FBAR', description: 'Foreign Bank Account Report' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {forms.map((form) => (
        <button
          key={form.id}
          onClick={() => onSelectForm(form.id)}
          className={cn(
            'rounded-xl border-2 p-4 text-left transition-all',
            selectedForm === form.id
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="font-semibold">{form.name}</div>
          <div className="mt-1 text-xs text-gray-500">{form.description}</div>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Summary Stats Component
// ============================================================================

interface SummaryStatsProps {
  report: TaxReportType;
}

function SummaryStats({ report }: SummaryStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Short-Term Gains</div>
        <div className={cn(
          'mt-2 text-2xl font-bold',
          report.shortTermGains >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {formatCurrency(report.shortTermGains)}
        </div>
        <div className="mt-1 text-xs text-gray-500">≤ 1 year holding</div>
      </div>

      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Long-Term Gains</div>
        <div className={cn(
          'mt-2 text-2xl font-bold',
          report.longTermGains >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {formatCurrency(report.longTermGains)}
        </div>
        <div className="mt-1 text-xs text-gray-500">&gt; 1 year holding</div>
      </div>

      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Total Income</div>
        <div className="mt-2 text-2xl font-bold text-blue-600">
          {formatCurrency(
            report.income.staking + 
            report.income.airdrops + 
            report.income.mining + 
            report.income.other
          )}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Staking, airdrops, etc.
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
        <div className="text-sm opacity-80">Net Gain/Loss</div>
        <div className="mt-2 text-2xl font-bold">
          {formatCurrency(report.totalGains)}
        </div>
        <div className="mt-1 text-xs opacity-80">
          {report.transactions.length} transactions
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Capital Gains Table Component
// ============================================================================

interface CapitalGainsTableProps {
  report: TaxReportType;
  isShortTerm: boolean;
}

function CapitalGainsTable({ report, isShortTerm }: CapitalGainsTableProps) {
  const transactions = useMemo(() => {
    return report.transactions.filter(tx => tx.holdingPeriod === (isShortTerm ? 'short' : 'long'));
  }, [report, isShortTerm]);

  const totals = useMemo(() => {
    const proceeds = transactions.reduce((sum, tx) => sum + tx.proceeds, 0);
    const costBasis = transactions.reduce((sum, tx) => sum + tx.costBasis, 0);
    const gain = transactions.reduce((sum, tx) => sum + tx.gain, 0);
    return { proceeds, costBasis, gain };
  }, [transactions]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h4 className="font-semibold">
          {isShortTerm ? 'Short-Term' : 'Long-Term'} Capital Gains
        </h4>
        <p className="text-xs text-gray-500">
          {isShortTerm ? 'Assets held for 1 year or less' : 'Assets held for more than 1 year'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Asset</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Proceeds</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cost Basis</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Gain/Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{formatDate(tx.date)}</td>
                <td className="px-4 py-3 text-sm font-medium">{tx.asset}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700 capitalize">
                    {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">{tx.amount}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(tx.proceeds)}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(tx.costBasis)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    'font-medium',
                    tx.gain >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {tx.gain >= 0 ? '+' : ''}{formatCurrency(tx.gain)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
            <tr>
              <td colSpan={4} className="px-4 py-3 text-sm">Total</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.proceeds)}</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.costBasis)}</td>
              <td className="px-4 py-3 text-right">
                <span className={cn(
                  totals.gain >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {totals.gain >= 0 ? '+' : ''}{formatCurrency(totals.gain)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-500">
          No {isShortTerm ? 'short-term' : 'long-term'} transactions
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Income Section Component
// ============================================================================

interface IncomeSectionProps {
  report: TaxReportType;
}

function IncomeSection({ report }: IncomeSectionProps) {
  const incomeItems = [
    { label: 'Staking Rewards', value: report.income.staking, color: 'bg-green-100 text-green-700' },
    { label: 'Airdrops', value: report.income.airdrops, color: 'bg-blue-100 text-blue-700' },
    { label: 'Mining', value: report.income.mining, color: 'bg-purple-100 text-purple-700' },
    { label: 'Other Income', value: report.income.other, color: 'bg-gray-100 text-gray-700' },
  ];

  const total = Object.values(report.income).reduce((sum, val) => sum + val, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h4 className="mb-4 font-semibold">Income Summary</h4>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {incomeItems.map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="mt-2 text-xl font-bold">{formatCurrency(item.value)}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-blue-900">Total Income</span>
          <span className="text-2xl font-bold text-blue-900">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TaxReport({ walletAddresses, className }: TaxReportProps) {
  const [selectedForm, setSelectedForm] = useState('form8949');
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [jurisdiction, setJurisdiction] = useState('US');
  const [method, setMethod] = useState<CostBasisMethod>('fifo');
  const [report, setReport] = useState<TaxReportType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (walletAddresses.length === 0) return;
    
    setIsGenerating(true);
    try {
      const data = await generateTaxReport(walletAddresses, year, jurisdiction, method);
      setReport(data);
    } catch (error) {
      console.error('Failed to generate tax report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'turbotax' | 'form8949') => {
    if (!report) return;
    
    setIsLoading(true);
    try {
      const blob = await exportTaxReport(report, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-report-${year}.${format === 'pdf' ? 'pdf' : 'csv'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export tax report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Configuration */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Tax Report Configuration</h3>
        
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tax Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {[2026, 2025, 2024, 2023, 2022].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Jurisdiction
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="EU">European Union</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Cost Basis Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as CostBasisMethod)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="fifo">FIFO</option>
              <option value="lifo">LIFO</option>
              <option value="hifo">HIFO</option>
              <option value="specific">Specific ID</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || walletAddresses.length === 0}
              className={cn(
                'w-full rounded-lg px-4 py-2 text-sm font-medium text-white',
                isGenerating || walletAddresses.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-900'
              )}
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {walletAddresses.length === 0 && (
          <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            No wallet addresses configured. Add wallets to generate tax reports.
          </p>
        )}
      </div>

      {/* Form Selection */}
      {report && (
        <>
          <TaxFormSelector 
            selectedForm={selectedForm} 
            onSelectForm={setSelectedForm} 
          />

          {/* Summary Stats */}
          <SummaryStats report={report} />

          {/* Capital Gains Tables */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CapitalGainsTable report={report} isShortTerm={true} />
            <CapitalGainsTable report={report} isShortTerm={false} />
          </div>

          {/* Income Section */}
          <IncomeSection report={report} />

          {/* Export Actions */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Export Tax Documents</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleExport('form8949')}
                disabled={isLoading}
                className="rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-900 disabled:bg-gray-400"
              >
                Export Form 8949 (PDF)
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                disabled={isLoading}
                className="rounded-xl border-2 border-gray-200 px-6 py-3 font-medium hover:bg-gray-50 disabled:bg-gray-100"
              >
                Export Schedule D (PDF)
              </button>
              <button 
                onClick={() => handleExport('csv')}
                disabled={isLoading}
                className="rounded-xl border-2 border-gray-200 px-6 py-3 font-medium hover:bg-gray-50 disabled:bg-gray-100"
              >
                Export All Transactions (CSV)
              </button>
              <button 
                onClick={() => handleExport('turbotax')}
                disabled={isLoading}
                className="rounded-xl border-2 border-gray-200 px-6 py-3 font-medium hover:bg-gray-50 disabled:bg-gray-100"
              >
                TurboTax Format
              </button>
            </div>
          </div>
        </>
      )}

      {!report && !isGenerating && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Report Generated</h3>
          <p className="mt-2 text-sm text-gray-500">
            Configure settings and click "Generate Report" to create your tax report.
          </p>
        </div>
      )}
    </div>
  );
}

export default TaxReport;
