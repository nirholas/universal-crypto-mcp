'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface DisputeFlowProps {
  serviceId: string;
  serviceName: string;
  subscriptionId: string;
  onClose: () => void;
  onSubmit: (dispute: DisputeData) => Promise<void>;
}

interface DisputeData {
  serviceId: string;
  subscriptionId: string;
  reason: string;
  description: string;
  evidenceFiles: File[];
  requestedResolution: 'refund' | 'partial-refund' | 'credit' | 'other';
  requestedAmount?: number;
}

type Step = 'reason' | 'evidence' | 'resolution' | 'review' | 'submitted';

const DISPUTE_REASONS = [
  { value: 'service-not-working', label: 'Service not working as described', icon: '❌' },
  { value: 'downtime', label: 'Excessive downtime', icon: '⏱️' },
  { value: 'quality', label: 'Poor quality or accuracy', icon: '📉' },
  { value: 'billing', label: 'Billing issue', icon: '💳' },
  { value: 'unauthorized', label: 'Unauthorized charges', icon: '🚫' },
  { value: 'other', label: 'Other', icon: '📝' },
];

export function DisputeFlow({ serviceId, serviceName, subscriptionId, onClose, onSubmit }: DisputeFlowProps) {
  const [step, setStep] = React.useState<Step>('reason');
  const [reason, setReason] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [evidenceFiles, setEvidenceFiles] = React.useState<File[]>([]);
  const [requestedResolution, setRequestedResolution] = React.useState<DisputeData['requestedResolution']>('refund');
  const [requestedAmount, setRequestedAmount] = React.useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [disputeId, setDisputeId] = React.useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidenceFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        serviceId,
        subscriptionId,
        reason,
        description,
        evidenceFiles,
        requestedResolution,
        requestedAmount,
      });
      setDisputeId(`DSP-${Date.now().toString(36).toUpperCase()}`);
      setStep('submitted');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'reason':
        return reason && description.length >= 50;
      case 'evidence':
        return true; // Evidence is optional
      case 'resolution':
        return requestedResolution && (requestedResolution !== 'partial-refund' || requestedAmount);
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">File a Dispute</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-gray-600">Dispute for: {serviceName}</p>
        </div>

        {/* Progress */}
        {step !== 'submitted' && (
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              {['Reason', 'Evidence', 'Resolution', 'Review'].map((label, index) => {
                const steps: Step[] = ['reason', 'evidence', 'resolution', 'review'];
                const isActive = step === steps[index];
                const isComplete = steps.indexOf(step) > index;
                return (
                  <React.Fragment key={label}>
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {isComplete ? '✓' : index + 1}
                    </div>
                    {index < 3 && <div className="h-px flex-1 bg-gray-200" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Reason */}
          {step === 'reason' && (
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  What is the reason for this dispute?
                </label>
                <div className="space-y-2">
                  {DISPUTE_REASONS.map((r) => (
                    <label
                      key={r.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors',
                        reason === r.value
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={(e) => setReason(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-xl">{r.icon}</span>
                      <span className="font-medium text-gray-900">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Describe the issue in detail (minimum 50 characters)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide specific details about what happened, when it occurred, and how it affected you..."
                  rows={5}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
                />
                <p className={cn('mt-1 text-sm', description.length >= 50 ? 'text-green-600' : 'text-gray-500')}>
                  {description.length}/50 characters minimum
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Evidence */}
          {step === 'evidence' && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload supporting evidence (optional)
                </label>
                <p className="mb-4 text-sm text-gray-500">
                  Screenshots, logs, API responses, or any other documentation that supports your claim
                </p>

                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf,.txt,.json,.log"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <span className="text-4xl">📎</span>
                    <p className="mt-2 text-sm text-gray-600">
                      Drop files here or click to upload
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Images, PDFs, text files, or logs
                    </p>
                  </label>
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {evidenceFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <span>📄</span>
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Resolution */}
          {step === 'resolution' && (
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  What resolution are you requesting?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'refund', label: 'Full Refund', desc: 'Complete refund of all payments' },
                    { value: 'partial-refund', label: 'Partial Refund', desc: 'Refund a specific amount' },
                    { value: 'credit', label: 'Service Credit', desc: 'Credit for future usage' },
                    { value: 'other', label: 'Other Resolution', desc: 'Describe your desired outcome' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors',
                        requestedResolution === option.value
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="resolution"
                        value={option.value}
                        checked={requestedResolution === option.value}
                        onChange={(e) => setRequestedResolution(e.target.value as DisputeData['requestedResolution'])}
                        className="sr-only"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {requestedResolution === 'partial-refund' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Requested Refund Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={requestedAmount || ''}
                      onChange={(e) => setRequestedAmount(parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-8 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="rounded-xl bg-gray-50 p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Dispute Summary</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Service</dt>
                    <dd className="font-medium text-gray-900">{serviceName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Reason</dt>
                    <dd className="font-medium text-gray-900">
                      {DISPUTE_REASONS.find((r) => r.value === reason)?.label}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Requested Resolution</dt>
                    <dd className="font-medium capitalize text-gray-900">
                      {requestedResolution.replace('-', ' ')}
                      {requestedAmount && ` ($${requestedAmount})`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Evidence Files</dt>
                    <dd className="font-medium text-gray-900">{evidenceFiles.length} file(s)</dd>
                  </div>
                </dl>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">Description:</p>
                  <p className="mt-1 text-sm text-gray-900">{description}</p>
                </div>
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> By submitting this dispute, you agree to our dispute resolution process.
                  A mediator will review your case within 3-5 business days. During this time, any funds in escrow
                  will be held until a resolution is reached.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Submitted */}
          {step === 'submitted' && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">📋</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dispute Submitted</h3>
                <p className="mt-2 text-gray-600">
                  Your dispute has been filed and is being reviewed.
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-6">
                <p className="text-sm text-gray-500">Dispute ID</p>
                <p className="mt-1 font-mono text-xl font-bold text-gray-900">{disputeId}</p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-left">
                <h4 className="font-medium text-blue-900">What happens next?</h4>
                <ul className="mt-2 space-y-2 text-sm text-blue-800">
                  <li>1. Our team will review your dispute within 24-48 hours</li>
                  <li>2. The provider will be notified and given 72 hours to respond</li>
                  <li>3. If unresolved, a mediator will be assigned</li>
                  <li>4. You'll receive updates via email and in your dashboard</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          )}

          {/* Navigation */}
          {step !== 'submitted' && (
            <div className="mt-8 flex gap-3">
              {step !== 'reason' && (
                <button
                  type="button"
                  onClick={() => {
                    const steps: Step[] = ['reason', 'evidence', 'resolution', 'review'];
                    const currentIndex = steps.indexOf(step);
                    setStep(steps[currentIndex - 1]);
                  }}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium text-gray-700 hover:border-black"
                >
                  Back
                </button>
              )}
              {step !== 'review' ? (
                <button
                  type="button"
                  onClick={() => {
                    const steps: Step[] = ['reason', 'evidence', 'resolution', 'review'];
                    const currentIndex = steps.indexOf(step);
                    setStep(steps[currentIndex + 1]);
                  }}
                  disabled={!canProceed()}
                  className={cn(
                    'flex-1 rounded-xl py-3 font-medium transition-colors',
                    canProceed()
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'cursor-not-allowed bg-gray-200 text-gray-400'
                  )}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
