'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

// Mock disputes data
const mockDisputes = [
  {
    id: 'dsp-001',
    service: { id: 'svc-1', name: 'Trading Signals AI' },
    consumer: { name: 'Alice', address: '0x1111...2222' },
    provider: { name: 'SignalPro', address: '0x3333...4444' },
    reason: 'service-not-working',
    description: 'The trading signals have been consistently wrong for the past week, resulting in significant losses.',
    amount: 299,
    status: 'escalated',
    priority: 'high',
    createdAt: '2024-01-12T08:30:00Z',
    lastUpdate: '2024-01-15T14:20:00Z',
    evidence: [
      { type: 'screenshot', name: 'signal-history.png' },
      { type: 'log', name: 'api-responses.json' },
    ],
    messages: [
      { from: 'consumer', message: 'Signals have been wrong 8 out of 10 times', time: '2024-01-12' },
      { from: 'provider', message: 'We had a data feed issue that has been resolved', time: '2024-01-13' },
      { from: 'consumer', message: 'Still experiencing issues after the fix', time: '2024-01-14' },
    ],
  },
  {
    id: 'dsp-002',
    service: { id: 'svc-2', name: 'Crypto Oracle Feed' },
    consumer: { name: 'Bob', address: '0x5555...6666' },
    provider: { name: 'OracleNet', address: '0x7777...8888' },
    reason: 'downtime',
    description: 'Service was down for 4+ hours during a critical trading period.',
    amount: 149,
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-14T16:45:00Z',
    lastUpdate: '2024-01-14T16:45:00Z',
    evidence: [
      { type: 'screenshot', name: 'downtime-proof.png' },
    ],
    messages: [],
  },
  {
    id: 'dsp-003',
    service: { id: 'svc-3', name: 'NFT Valuation API' },
    consumer: { name: 'Charlie', address: '0x9999...aaaa' },
    provider: { name: 'NFTMetrics', address: '0xbbbb...cccc' },
    reason: 'billing',
    description: 'Charged for API calls that returned errors and should not have been billed.',
    amount: 45,
    status: 'mediation',
    priority: 'low',
    createdAt: '2024-01-10T11:20:00Z',
    lastUpdate: '2024-01-14T09:30:00Z',
    evidence: [
      { type: 'log', name: 'error-responses.log' },
    ],
    messages: [
      { from: 'consumer', message: 'I have logs showing 450 failed calls that were billed', time: '2024-01-10' },
      { from: 'provider', message: 'Looking into this, our logs show different numbers', time: '2024-01-11' },
      { from: 'mediator', message: 'Requested detailed logs from both parties', time: '2024-01-12' },
    ],
  },
];

const DISPUTE_REASONS: Record<string, string> = {
  'service-not-working': 'Service Not Working',
  'downtime': 'Excessive Downtime',
  'quality': 'Quality Issues',
  'billing': 'Billing Dispute',
  'unauthorized': 'Unauthorized Charges',
  'other': 'Other',
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = React.useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = React.useState<typeof mockDisputes[0] | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'escalated' | 'mediation'>('all');
  const [mediatorMessage, setMediatorMessage] = React.useState('');
  const [resolution, setResolution] = React.useState<'refund-full' | 'refund-partial' | 'favor-provider' | 'credit'>('refund-full');
  const [refundAmount, setRefundAmount] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const filteredDisputes = disputes.filter((d) => filter === 'all' || d.status === filter);

  const handleResolve = async (disputeId: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDisputes((prev) => prev.filter((d) => d.id !== disputeId));
    setSelectedDispute(null);
    setIsProcessing(false);
  };

  const handleEscalate = async (disputeId: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'escalated', priority: 'high' } : d))
    );
    setIsProcessing(false);
  };

  const handleSendMessage = async () => {
    if (!mediatorMessage.trim() || !selectedDispute) return;
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              messages: [
                ...d.messages,
                { from: 'mediator', message: mediatorMessage, time: new Date().toISOString().split('T')[0] },
              ],
            }
          : d
      )
    );
    setMediatorMessage('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-black">Admin</Link>
          <span>/</span>
          <span className="text-gray-900">Dispute Resolution</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Dispute Management</h1>
        <p className="mt-1 text-gray-600">Manage and resolve disputes between providers and consumers</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Active</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{disputes.length}</p>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">High Priority</p>
          <p className="mt-1 text-2xl font-bold text-red-700">
            {disputes.filter((d) => d.priority === 'high').length}
          </p>
        </div>
        <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-600">Escalated</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700">
            {disputes.filter((d) => d.status === 'escalated').length}
          </p>
        </div>
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-600">In Mediation</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {disputes.filter((d) => d.status === 'mediation').length}
          </p>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-600">Resolved (7d)</p>
          <p className="mt-1 text-2xl font-bold text-green-700">18</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {(['all', 'pending', 'escalated', 'mediation'] as const).map((f) => (
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
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Dispute List */}
        <div className="space-y-3 lg:col-span-2">
          {filteredDisputes.map((dispute) => (
            <button
              key={dispute.id}
              type="button"
              onClick={() => {
                setSelectedDispute(dispute);
                setRefundAmount(dispute.amount);
              }}
              className={cn(
                'w-full rounded-2xl border-2 bg-white p-4 text-left transition-all',
                selectedDispute?.id === dispute.id
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      dispute.priority === 'high' && 'bg-red-500',
                      dispute.priority === 'medium' && 'bg-yellow-500',
                      dispute.priority === 'low' && 'bg-green-500'
                    )}
                  />
                  <span className="font-mono text-xs text-gray-500">{dispute.id}</span>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    dispute.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                    dispute.status === 'escalated' && 'bg-red-100 text-red-700',
                    dispute.status === 'mediation' && 'bg-blue-100 text-blue-700'
                  )}
                >
                  {dispute.status}
                </span>
              </div>
              <h3 className="mt-2 font-medium text-gray-900">{dispute.service.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {DISPUTE_REASONS[dispute.reason]} • ${dispute.amount}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{dispute.consumer.name} vs {dispute.provider.name}</span>
                <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}

          {filteredDisputes.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-4xl">✅</p>
              <h3 className="mt-4 font-semibold text-gray-900">No disputes</h3>
              <p className="mt-1 text-gray-600">All caught up!</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedDispute ? (
          <div className="space-y-6 lg:col-span-3">
            {/* Header */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedDispute.service.name}</h2>
                  <p className="text-gray-500">{DISPUTE_REASONS[selectedDispute.reason]}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${selectedDispute.amount}</p>
                  <p className="text-sm text-gray-500">Disputed Amount</p>
                </div>
              </div>

              {/* Parties */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase text-gray-500">Consumer</p>
                  <p className="mt-1 font-medium text-gray-900">{selectedDispute.consumer.name}</p>
                  <p className="font-mono text-xs text-gray-500">{selectedDispute.consumer.address}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase text-gray-500">Provider</p>
                  <p className="mt-1 font-medium text-gray-900">{selectedDispute.provider.name}</p>
                  <p className="font-mono text-xs text-gray-500">{selectedDispute.provider.address}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="mt-1 text-gray-600">{selectedDispute.description}</p>
              </div>

              {/* Evidence */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">Evidence ({selectedDispute.evidence.length} files)</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedDispute.evidence.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                    >
                      <span>{file.type === 'screenshot' ? '🖼️' : '📄'}</span>
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">Communication Thread</h3>
              <div className="space-y-4">
                {selectedDispute.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      'rounded-xl p-4',
                      msg.from === 'consumer' && 'bg-blue-50',
                      msg.from === 'provider' && 'bg-gray-50',
                      msg.from === 'mediator' && 'bg-purple-50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-xs font-medium uppercase',
                          msg.from === 'consumer' && 'text-blue-600',
                          msg.from === 'provider' && 'text-gray-600',
                          msg.from === 'mediator' && 'text-purple-600'
                        )}
                      >
                        {msg.from}
                      </span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Send Message */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={mediatorMessage}
                  onChange={(e) => setMediatorMessage(e.target.value)}
                  placeholder="Send a message as mediator..."
                  className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Resolution */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">Resolution</h3>
              
              <div className="mb-4 space-y-2">
                {([
                  { value: 'refund-full', label: 'Full refund to consumer' },
                  { value: 'refund-partial', label: 'Partial refund' },
                  { value: 'credit', label: 'Service credit' },
                  { value: 'favor-provider', label: 'Favor provider (no refund)' },
                ] as const).map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors',
                      resolution === option.value
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="resolution"
                      value={option.value}
                      checked={resolution === option.value}
                      onChange={(e) => setResolution(e.target.value as typeof resolution)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>

              {resolution === 'refund-partial' && (
                <div className="mb-4">
                  <label className="mb-1 block text-sm text-gray-700">Refund Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                      max={selectedDispute.amount}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 pl-8 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedDispute.status !== 'escalated' && (
                  <button
                    type="button"
                    onClick={() => handleEscalate(selectedDispute.id)}
                    disabled={isProcessing}
                    className="flex-1 rounded-xl border-2 border-red-200 py-3 font-medium text-red-600 hover:border-red-500 disabled:opacity-50"
                  >
                    Escalate
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleResolve(selectedDispute.id)}
                  disabled={isProcessing}
                  className="flex-1 rounded-xl bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Resolve Dispute'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 lg:col-span-3">
            <div className="text-center">
              <p className="text-4xl">⚖️</p>
              <h3 className="mt-4 font-semibold text-gray-900">Select a dispute</h3>
              <p className="mt-1 text-gray-600">Click on a dispute to review and resolve</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
