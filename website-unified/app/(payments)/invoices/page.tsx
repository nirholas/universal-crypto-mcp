/**
 * Invoices Page
 * 
 * View and manage billing invoices with download and payment functionality
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Calendar,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface Invoice {
  id: string;
  number: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'void';
  amount: number;
  amountDue: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  periodStart: string;
  periodEnd: string;
  subscription?: {
    id: string;
    name: string;
  };
  lineItems: {
    description: string;
    quantity: number;
    unitAmount: number;
    amount: number;
  }[];
  downloadUrl?: string;
  hostedUrl?: string;
}

interface InvoiceStats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  invoiceCount: number;
}

// ============================================
// Invoices API Service
// ============================================

class InvoicesService {
  private baseUrl = '/api/invoices';

  async fetchInvoices(params: {
    page?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{
    invoices: Invoice[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const searchParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      ...(params.status && params.status !== 'all' && { status: params.status }),
      ...(params.search && { search: params.search }),
    });

    const response = await fetch(`${this.baseUrl}?${searchParams}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  }

  async fetchInvoice(id: string): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  }

  async downloadInvoice(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${id}/download`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to download invoice');
    return response.blob();
  }

  async payInvoice(id: string, paymentMethodId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/${id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Payment failed');
    return response.json();
  }

  async sendInvoice(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/${id}/send`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to send invoice');
    return response.json();
  }

  async getStats(): Promise<InvoiceStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
}

const invoicesService = new InvoicesService();

// ============================================
// Component
// ============================================

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const [invoicesData, statsData] = await Promise.all([
        invoicesService.fetchInvoices({ page, status: statusFilter, search }),
        invoicesService.getStats(),
      ]);
      setInvoices(invoicesData.invoices);
      setPagination(invoicesData.pagination);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleDownload = async (invoice: Invoice) => {
    setDownloading(invoice.id);
    try {
      const blob = await invoicesService.downloadInvoice(invoice.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const config = {
      paid: { icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
      pending: { icon: Clock, color: 'text-yellow-500 bg-yellow-500/10' },
      overdue: { icon: AlertCircle, color: 'text-red-500 bg-red-500/10' },
      draft: { icon: FileText, color: 'text-gray-500 bg-gray-500/10' },
      void: { icon: XCircle, color: 'text-gray-500 bg-gray-500/10' },
    };

    const { icon: Icon, color } = config[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Invoices</h1>
              <p className="text-gray-400 text-sm">Manage your billing invoices</p>
            </div>
            <button
              onClick={() => fetchData(pagination.page)}
              disabled={loading}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Total Paid</div>
                  <div className="text-xl font-bold">${stats.totalPaid.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Pending</div>
                  <div className="text-xl font-bold">${stats.totalPending.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Overdue</div>
                  <div className="text-xl font-bold text-red-400">${stats.totalOverdue.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Total Invoices</div>
                  <div className="text-xl font-bold">{stats.invoiceCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
              <option value="void">Void</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Invoices List */}
        {!loading && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {invoices.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Invoices Found</h3>
                <p className="text-gray-400">
                  {search || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : "You don't have any invoices yet"}
                </p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Invoice</th>
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Status</th>
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Date</th>
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Due Date</th>
                      <th className="text-right text-gray-400 font-medium text-sm px-6 py-4">Amount</th>
                      <th className="text-right text-gray-400 font-medium text-sm px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{invoice.number}</div>
                          {invoice.subscription && (
                            <div className="text-gray-500 text-sm">{invoice.subscription.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium text-white">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </span>
                          {invoice.amountDue > 0 && invoice.amountDue !== invoice.amount && (
                            <div className="text-gray-500 text-sm">
                              {formatCurrency(invoice.amountDue, invoice.currency)} due
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(invoice)}
                              disabled={downloading === invoice.id}
                              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                              title="Download PDF"
                            >
                              {downloading === invoice.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                            {invoice.hostedUrl && (
                              <a
                                href={invoice.hostedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                                title="View Online"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                    <div className="text-gray-400 text-sm">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} invoices
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchData(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-gray-400 px-2">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchData(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-semibold">Invoice {selectedInvoice.number}</h3>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Invoice Date</div>
                    <div className="font-medium">
                      {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Due Date</div>
                    <div className="font-medium">
                      {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Period</div>
                    <div className="font-medium">
                      {new Date(selectedInvoice.periodStart).toLocaleDateString()} -{' '}
                      {new Date(selectedInvoice.periodEnd).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedInvoice.paidAt && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Paid On</div>
                      <div className="font-medium text-green-400">
                        {new Date(selectedInvoice.paidAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="font-medium mb-3">Line Items</h4>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left text-gray-400 px-4 py-2">Description</th>
                          <th className="text-right text-gray-400 px-4 py-2">Qty</th>
                          <th className="text-right text-gray-400 px-4 py-2">Unit Price</th>
                          <th className="text-right text-gray-400 px-4 py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.lineItems.map((item, index) => (
                          <tr key={index} className="border-b border-gray-700 last:border-0">
                            <td className="px-4 py-3">{item.description}</td>
                            <td className="px-4 py-3 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(item.unitAmount, selectedInvoice.currency)}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(item.amount, selectedInvoice.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">Total Amount</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                    </div>
                    {selectedInvoice.amountDue > 0 && (
                      <div className="text-yellow-400 text-sm">
                        {formatCurrency(selectedInvoice.amountDue, selectedInvoice.currency)} due
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => handleDownload(selectedInvoice)}
                    disabled={downloading === selectedInvoice.id}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {downloading === selectedInvoice.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download PDF
                  </button>
                  {selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue' ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      <DollarSign className="w-4 h-4" />
                      Pay Now
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
