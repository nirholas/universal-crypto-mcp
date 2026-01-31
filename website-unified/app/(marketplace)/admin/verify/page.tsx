'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

// Mock pending verifications
const mockPendingServices = [
  {
    id: 'svc-pending-1',
    name: 'DeFi Yield Optimizer Pro',
    provider: {
      name: 'YieldMax Labs',
      address: '0x1234...5678',
      reputation: 0, // New provider
      services: 0,
    },
    category: 'defi',
    description: 'Advanced yield optimization across multiple DeFi protocols with auto-compounding and risk management.',
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    pricing: { base: 99, per1kCalls: 0.05 },
    documentation: true,
    apiEndpoint: 'https://api.yieldmax.io/v1',
    testResults: {
      latency: 245,
      uptime: 99.8,
      successRate: 99.5,
    },
  },
  {
    id: 'svc-pending-2',
    name: 'Cross-Chain Bridge API',
    provider: {
      name: 'BridgeProtocol',
      address: '0xabcd...efgh',
      reputation: 85,
      services: 2,
    },
    category: 'infrastructure',
    description: 'Seamless cross-chain asset transfers with atomic swaps and liquidity aggregation.',
    submittedAt: '2024-01-14T14:20:00Z',
    status: 'review',
    pricing: { base: 149, per1kCalls: 0.10 },
    documentation: true,
    apiEndpoint: 'https://api.bridgeprotocol.xyz/v2',
    testResults: {
      latency: 380,
      uptime: 99.2,
      successRate: 98.8,
    },
  },
  {
    id: 'svc-pending-3',
    name: 'MEV Protection Service',
    provider: {
      name: 'FlashGuard',
      address: '0x9876...5432',
      reputation: 92,
      services: 4,
    },
    category: 'security',
    description: 'Protect your transactions from MEV extraction with private mempool routing.',
    submittedAt: '2024-01-13T09:15:00Z',
    status: 'pending',
    pricing: { base: 199, per1kCalls: 0 },
    documentation: true,
    apiEndpoint: 'https://rpc.flashguard.io',
    testResults: {
      latency: 125,
      uptime: 99.95,
      successRate: 99.9,
    },
  },
];

export default function AdminVerifyPage() {
  const [services, setServices] = React.useState(mockPendingServices);
  const [selectedService, setSelectedService] = React.useState<typeof mockPendingServices[0] | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'review'>('all');
  const [verificationNotes, setVerificationNotes] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const filteredServices = services.filter((s) => filter === 'all' || s.status === filter);

  const handleApprove = async (serviceId: string) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setSelectedService(null);
    setIsProcessing(false);
  };

  const handleReject = async (serviceId: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setSelectedService(null);
    setIsProcessing(false);
  };

  const handleRequestChanges = async (serviceId: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: 'review' } : s))
    );
    setSelectedService(null);
    setIsProcessing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-black">Admin</Link>
          <span>/</span>
          <span className="text-gray-900">Service Verification</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Service Verification Queue</h1>
        <p className="mt-1 text-gray-600">Review and approve new service submissions</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {services.filter((s) => s.status === 'pending').length}
          </p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">In Review</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {services.filter((s) => s.status === 'review').length}
          </p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Approved Today</p>
          <p className="mt-1 text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Avg Review Time</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">4.2h</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {(['all', 'pending', 'review'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors',
              filter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service List */}
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedService(service)}
              className={cn(
                'w-full rounded-2xl border-2 bg-white p-6 text-left transition-all',
                selectedService?.id === service.id
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">by {service.provider.name}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-medium',
                    service.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                    service.status === 'review' && 'bg-blue-100 text-blue-700'
                  )}
                >
                  {service.status}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-gray-600">{service.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span>📁 {service.category}</span>
                <span>💰 ${service.pricing.base}/mo</span>
                <span>📅 {new Date(service.submittedAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}

          {filteredServices.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-4xl">✅</p>
              <h3 className="mt-4 font-semibold text-gray-900">All caught up!</h3>
              <p className="mt-1 text-gray-600">No services pending verification</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedService ? (
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedService.name}</h2>
                <p className="text-gray-500">{selectedService.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Provider Info */}
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Provider Information</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{selectedService.provider.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet</span>
                  <span className="font-mono text-gray-900">{selectedService.provider.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reputation</span>
                  <span
                    className={cn(
                      'font-medium',
                      selectedService.provider.reputation > 0 ? 'text-green-600' : 'text-gray-500'
                    )}
                  >
                    {selectedService.provider.reputation > 0
                      ? `${selectedService.provider.reputation} pts`
                      : 'New Provider'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Existing Services</span>
                  <span className="text-gray-900">{selectedService.provider.services}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Description</h4>
              <p className="text-gray-600">{selectedService.description}</p>
            </div>

            {/* Technical Details */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Technical Details</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">API Endpoint</span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                    {selectedService.apiEndpoint}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Documentation</span>
                  <span className={selectedService.documentation ? 'text-green-600' : 'text-red-600'}>
                    {selectedService.documentation ? '✓ Provided' : '✗ Missing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Automated Test Results</h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedService.testResults.latency}ms
                  </p>
                  <p className="text-xs text-gray-500">Avg Latency</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-green-600">
                    {selectedService.testResults.uptime}%
                  </p>
                  <p className="text-xs text-gray-500">Uptime (7d)</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {selectedService.testResults.successRate}%
                  </p>
                  <p className="text-xs text-gray-500">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Pricing</h4>
              <div className="flex gap-4 text-sm">
                <div className="rounded-lg bg-gray-50 px-4 py-2">
                  <span className="text-gray-500">Base:</span>
                  <span className="ml-2 font-medium">${selectedService.pricing.base}/mo</span>
                </div>
                <div className="rounded-lg bg-gray-50 px-4 py-2">
                  <span className="text-gray-500">Per 1K calls:</span>
                  <span className="ml-2 font-medium">${selectedService.pricing.per1kCalls}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Verification Notes</h4>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add notes about your verification decision..."
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleReject(selectedService.id)}
                disabled={isProcessing}
                className="flex-1 rounded-xl border-2 border-red-200 py-3 font-medium text-red-600 hover:border-red-500 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
              <button
                type="button"
                onClick={() => handleRequestChanges(selectedService.id)}
                disabled={isProcessing}
                className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium text-gray-700 hover:border-black disabled:opacity-50"
              >
                Request Changes
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedService.id)}
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12">
            <div className="text-center">
              <p className="text-4xl">👈</p>
              <h3 className="mt-4 font-semibold text-gray-900">Select a service</h3>
              <p className="mt-1 text-gray-600">Click on a service to review its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
