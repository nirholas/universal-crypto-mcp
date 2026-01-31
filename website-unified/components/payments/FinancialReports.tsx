/**
 * Financial Reports Component
 * 
 * Enterprise-grade financial reporting with statements,
 * tax summaries, payout reports, and audit trails
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Printer,
  Filter,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Scale,
  Clock,
  CheckCircle,
  Search,
  ExternalLink
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface FinancialReportsProps {
  dateRange: '7d' | '30d' | '90d' | '1y';
  organizationId?: string;
}

type ReportType = 'statement' | 'tax' | 'payout' | 'fees' | 'ledger' | 'audit';
type ReportStatus = 'ready' | 'generating' | 'scheduled' | 'failed';
type ReportFormat = 'pdf' | 'csv' | 'xlsx';

interface ReportItem {
  id: string;
  type: ReportType;
  name: string;
  period: string;
  generatedAt: string;
  status: ReportStatus;
  size?: string;
  downloadUrl?: string;
}

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: string;
  balance: string;
  reference?: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

interface TaxSummary {
  id: string;
  period: string;
  taxableIncome: string;
  taxWithheld: string;
  estimatedTaxOwed: string;
  deductions: string;
  jurisdiction: string;
  status: 'pending' | 'filed' | 'paid';
  dueDate: string;
}

interface PayoutRecord {
  id: string;
  payoutDate: string;
  amount: string;
  currency: string;
  destinationAddress: string;
  destinationChain: string;
  transactionHash: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fees: string;
  netAmount: string;
}

interface FeeBreakdown {
  category: string;
  amount: string;
  percentage: number;
  transactions: number;
}

interface ScheduledReport {
  id: string;
  name: string;
  type: ReportType;
  schedule: string;
  recipients: string[];
  format: ReportFormat;
  lastRun?: string;
  nextRun: string;
  enabled: boolean;
}

// ============================================
// API Service
// ============================================

class FinancialReportsService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/reports') {
    this.baseUrl = baseUrl;
  }

  async fetchReports(type?: ReportType): Promise<ReportItem[]> {
    const params = type ? `?type=${type}` : '';
    const response = await fetch(`${this.baseUrl}/list${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async fetchLedger(
    dateRange: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ entries: LedgerEntry[]; total: number; summary: { credits: string; debits: string; balance: string } }> {
    const response = await fetch(
      `${this.baseUrl}/ledger?range=${dateRange}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ledger: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async fetchTaxSummaries(year?: number): Promise<TaxSummary[]> {
    const params = year ? `?year=${year}` : '';
    const response = await fetch(`${this.baseUrl}/tax${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tax summaries: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async fetchPayouts(dateRange: string): Promise<PayoutRecord[]> {
    const response = await fetch(`${this.baseUrl}/payouts?range=${dateRange}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payouts: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async fetchFeeBreakdown(dateRange: string): Promise<FeeBreakdown[]> {
    const response = await fetch(`${this.baseUrl}/fees?range=${dateRange}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fee breakdown: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async fetchScheduledReports(): Promise<ScheduledReport[]> {
    const response = await fetch(`${this.baseUrl}/scheduled`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scheduled reports: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async generateReport(
    type: ReportType,
    period: string,
    format: ReportFormat
  ): Promise<{ id: string; status: ReportStatus }> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type, period, format }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async downloadReport(reportId: string, format: ReportFormat): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/download/${reportId}?format=${format}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    return response.blob();
  }

  async scheduleReport(config: Omit<ScheduledReport, 'id' | 'lastRun'>): Promise<ScheduledReport> {
    const response = await fetch(`${this.baseUrl}/scheduled`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to schedule report: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async deleteScheduledReport(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/scheduled/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete scheduled report: ${response.statusText}`);
    }
  }

  async exportLedger(dateRange: string, format: 'csv' | 'xlsx'): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/ledger/export?range=${dateRange}&format=${format}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to export ledger: ${response.statusText}`);
    }

    return response.blob();
  }
}

const reportsService = new FinancialReportsService();

// ============================================
// Report Type Icons & Labels
// ============================================

const reportTypeConfig: Record<ReportType, { icon: typeof FileText; label: string; color: string }> = {
  statement: { icon: FileText, label: 'Monthly Statement', color: 'text-blue-400' },
  tax: { icon: Scale, label: 'Tax Summary', color: 'text-purple-400' },
  payout: { icon: DollarSign, label: 'Payout Report', color: 'text-green-400' },
  fees: { icon: Receipt, label: 'Fee Breakdown', color: 'text-yellow-400' },
  ledger: { icon: FileSpreadsheet, label: 'Transaction Ledger', color: 'text-cyan-400' },
  audit: { icon: Clock, label: 'Audit Trail', color: 'text-orange-400' },
};

// ============================================
// Sub-Components
// ============================================

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-gray-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="w-12 h-12 text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ready: 'bg-green-500/20 text-green-400',
    generating: 'bg-yellow-500/20 text-yellow-400',
    scheduled: 'bg-blue-500/20 text-blue-400',
    failed: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    filed: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-green-500/20 text-green-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ============================================
// Component
// ============================================

export function FinancialReports({ dateRange, organizationId }: FinancialReportsProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'ledger' | 'generate'>('reports');
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  
  // Reports state
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);
  
  // Ledger state
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<{ credits: string; debits: string; balance: string } | null>(null);
  const [ledgerLoading, setLedgerLoading] = useState(true);
  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [ledgerPage, setLedgerPage] = useState(1);
  const [hasMoreLedger, setHasMoreLedger] = useState(false);
  
  // Scheduled reports state
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  
  // Generate report state
  const [generateType, setGenerateType] = useState<ReportType>('statement');
  const [generatePeriod, setGeneratePeriod] = useState('');
  const [generateFormat, setGenerateFormat] = useState<ReportFormat>('pdf');
  const [generating, setGenerating] = useState(false);

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      setReportsLoading(true);
      setReportsError(null);
      const type = selectedType === 'all' ? undefined : selectedType;
      const data = await reportsService.fetchReports(type);
      setReports(data);
    } catch (err) {
      setReportsError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setReportsLoading(false);
    }
  }, [selectedType]);

  // Fetch ledger
  const fetchLedger = useCallback(async (page: number = 1) => {
    try {
      setLedgerLoading(true);
      setLedgerError(null);
      const data = await reportsService.fetchLedger(dateRange, page);
      setLedger(page === 1 ? data.entries : [...ledger, ...data.entries]);
      setLedgerSummary(data.summary);
      setHasMoreLedger(data.entries.length === 50);
    } catch (err) {
      setLedgerError(err instanceof Error ? err.message : 'Failed to load ledger');
    } finally {
      setLedgerLoading(false);
    }
  }, [dateRange, ledger]);

  // Fetch scheduled reports
  const fetchScheduledReports = useCallback(async () => {
    try {
      const data = await reportsService.fetchScheduledReports();
      setScheduledReports(data);
    } catch (err) {
      console.error('Failed to fetch scheduled reports:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    } else if (activeTab === 'ledger') {
      setLedgerPage(1);
      fetchLedger(1);
    } else if (activeTab === 'generate') {
      fetchScheduledReports();
    }
  }, [activeTab, fetchReports, fetchLedger, fetchScheduledReports]);

  // Re-fetch when filter changes
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [selectedType, activeTab, fetchReports]);

  // Download report
  const handleDownloadReport = async (report: ReportItem, format: ReportFormat) => {
    try {
      const blob = await reportsService.downloadReport(report.id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Export ledger
  const handleExportLedger = async (format: 'csv' | 'xlsx') => {
    try {
      const blob = await reportsService.exportLedger(dateRange, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transaction-ledger-${dateRange}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (!generatePeriod) return;
    
    try {
      setGenerating(true);
      await reportsService.generateReport(generateType, generatePeriod, generateFormat);
      setActiveTab('reports');
      fetchReports();
    } catch (err) {
      console.error('Generate failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Delete scheduled report
  const handleDeleteScheduledReport = async (id: string) => {
    try {
      await reportsService.deleteScheduledReport(id);
      setScheduledReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Financial Reports</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('generate')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800">
        {[
          { id: 'reports', label: 'Reports' },
          { id: 'ledger', label: 'Transaction Ledger' },
          { id: 'generate', label: 'Generate' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter:</span>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType | 'all')}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="statement">Monthly Statements</option>
              <option value="tax">Tax Summaries</option>
              <option value="payout">Payout Reports</option>
              <option value="fees">Fee Breakdowns</option>
            </select>
            <button
              onClick={fetchReports}
              disabled={reportsLoading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${reportsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Report List */}
          {reportsLoading ? (
            <LoadingState />
          ) : reportsError ? (
            <ErrorState message={reportsError} onRetry={fetchReports} />
          ) : reports.length === 0 ? (
            <EmptyState 
              title="No Reports Found" 
              description="Generate a new report to get started."
            />
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
              {reports.map((report) => {
                const config = reportTypeConfig[report.type];
                const Icon = config.icon;

                return (
                  <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-gray-800 ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{report.name}</div>
                        <div className="text-gray-400 text-sm flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {report.period}
                          </span>
                          {report.size && (
                            <span>{report.size}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={report.status} />
                      {report.status === 'ready' && (
                        <>
                          <button
                            onClick={() => handleDownloadReport(report, 'pdf')}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Print"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ledger Tab */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Ledger Summary */}
          {ledgerSummary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-gray-400 text-sm mb-1">Total Credits</div>
                <div className="text-2xl font-bold text-green-400">+${ledgerSummary.credits}</div>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-gray-400 text-sm mb-1">Total Debits</div>
                <div className="text-2xl font-bold text-red-400">-${ledgerSummary.debits}</div>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="text-gray-400 text-sm mb-1">Net Balance</div>
                <div className="text-2xl font-bold text-white">${ledgerSummary.balance}</div>
              </div>
            </div>
          )}

          {/* Ledger Table */}
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Transaction Ledger</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportLedger('csv')}
                  className="px-3 py-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => handleExportLedger('xlsx')}
                  className="px-3 py-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>

            {ledgerLoading && ledgerPage === 1 ? (
              <LoadingState />
            ) : ledgerError ? (
              <ErrorState message={ledgerError} onRetry={() => fetchLedger(1)} />
            ) : ledger.length === 0 ? (
              <EmptyState 
                title="No Transactions" 
                description="Transaction ledger will populate as payments are processed."
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium text-right">Amount</th>
                        <th className="px-4 py-3 font-medium text-right">Balance</th>
                        <th className="px-4 py-3 font-medium w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {ledger.map((entry) => (
                        <React.Fragment key={entry.id}>
                          <tr 
                            className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                            onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                          >
                            <td className="px-4 py-3 text-gray-300">{entry.date}</td>
                            <td className="px-4 py-3 text-white">{entry.description}</td>
                            <td className={`px-4 py-3 text-right font-medium ${
                              entry.type === 'credit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {entry.type === 'credit' ? '+' : '-'}${entry.amount}
                            </td>
                            <td className="px-4 py-3 text-right text-white">${entry.balance}</td>
                            <td className="px-4 py-3 text-center text-gray-400">
                              {expandedEntry === entry.id ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </td>
                          </tr>
                          {expandedEntry === entry.id && (
                            <tr>
                              <td colSpan={5} className="bg-gray-800/50 px-4 py-3">
                                <div className="text-sm text-gray-400 space-y-1">
                                  <div>
                                    <span className="text-gray-500">Reference:</span>{' '}
                                    <code className="bg-gray-800 px-2 py-0.5 rounded">{entry.reference}</code>
                                  </div>
                                  {entry.category && (
                                    <div>
                                      <span className="text-gray-500">Category:</span> {entry.category}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {hasMoreLedger && (
                  <div className="p-4 flex justify-center">
                    <button
                      onClick={() => {
                        const nextPage = ledgerPage + 1;
                        setLedgerPage(nextPage);
                        fetchLedger(nextPage);
                      }}
                      disabled={ledgerLoading}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {ledgerLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Generate New Report</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Report Type Selection */}
              <div className="space-y-4">
                <label className="block text-gray-400 text-sm font-medium">Report Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(reportTypeConfig) as [ReportType, typeof reportTypeConfig[ReportType]][]).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setGenerateType(type)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          generateType === type 
                            ? 'bg-blue-500/20 border-blue-500' 
                            : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${config.color} mb-2`} />
                        <div className="text-white text-sm font-medium">{config.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Report Options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Period</label>
                  <input
                    type="text"
                    placeholder="e.g., January 2026, Q1 2026"
                    value={generatePeriod}
                    onChange={(e) => setGeneratePeriod(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Format</label>
                  <div className="flex gap-3">
                    {(['pdf', 'csv', 'xlsx'] as ReportFormat[]).map((format) => (
                      <button
                        key={format}
                        onClick={() => setGenerateFormat(format)}
                        className={`flex-1 px-4 py-3 border rounded-lg transition-colors ${
                          generateFormat === format
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleGenerateReport}
                    disabled={generating || !generatePeriod}
                    className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Scheduled Reports</h3>
            <p className="text-gray-400 text-sm mb-6">
              Automatically generate and email reports on a recurring schedule.
            </p>

            {scheduledReports.length === 0 ? (
              <EmptyState 
                title="No Scheduled Reports" 
                description="Set up automatic report generation."
              />
            ) : (
              <div className="space-y-3">
                {scheduledReports.map((scheduled) => (
                  <div key={scheduled.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{scheduled.name}</div>
                      <div className="text-gray-400 text-sm">
                        {scheduled.schedule} → {scheduled.recipients.join(', ')}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Next run: {new Date(scheduled.nextRun).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={scheduled.enabled ? 'ready' : 'scheduled'} />
                      <button 
                        onClick={() => handleDeleteScheduledReport(scheduled.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              + Add Scheduled Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialReports;
