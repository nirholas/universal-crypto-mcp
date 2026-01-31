'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { MarketplaceService, SubscriptionTier } from '@/lib/marketplace/types';
import { PaymentProcessor } from './PaymentProcessor';

interface SubscriptionFlowProps {
  service: MarketplaceService;
  onClose: () => void;
  onSuccess: (apiKey: string) => void;
}

type Step = 'select-plan' | 'payment' | 'confirmation' | 'success';

export function SubscriptionFlow({ service, onClose, onSuccess }: SubscriptionFlowProps) {
  const [step, setStep] = React.useState<Step>('select-plan');
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionTier | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<'x402' | 'crypto' | 'card'>('x402');
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const plans = service.pricing.subscription?.plans || [];
  const isPayPerUse = service.pricing.type === 'pay-per-use';

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    // Simulate API key generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const generatedKey = `sk_live_${Math.random().toString(36).substr(2, 32)}`;
    setApiKey(generatedKey);
    setStep('success');
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Subscribe to {service.name}</h2>
          <p className="mt-1 text-gray-600">Complete your subscription in a few steps</p>
        </div>

        {/* Progress */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            {['Select Plan', 'Payment', 'Confirm', 'Success'].map((label, index) => {
              const steps: Step[] = ['select-plan', 'payment', 'confirmation', 'success'];
              const isActive = step === steps[index];
              const isComplete = steps.indexOf(step) > index;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
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
                    <span className={cn('text-sm', isActive ? 'font-medium text-black' : 'text-gray-500')}>
                      {label}
                    </span>
                  </div>
                  {index < 3 && <div className="h-px flex-1 bg-gray-200" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Select Plan */}
          {step === 'select-plan' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Choose your plan</h3>
              
              {isPayPerUse ? (
                <div
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-4 transition-colors',
                    selectedPlan ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() =>
                    setSelectedPlan({
                      name: 'starter',
                      price: 0,
                      currency: 'USD',
                      billingPeriod: 'monthly',
                      requestsIncluded: 0,
                      features: ['Pay only for what you use'],
                    })
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Pay Per Use</p>
                      <p className="text-sm text-gray-500">
                        ${service.pricing.payPerUse?.pricePerRequest} per request
                      </p>
                    </div>
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300">
                      {selectedPlan && <div className="h-full w-full rounded-full bg-black" />}
                    </div>
                  </div>
                </div>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={cn(
                      'cursor-pointer rounded-xl border-2 p-4 transition-colors',
                      selectedPlan?.name === plan.name
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-500">
                          ${plan.price}/{plan.billingPeriod} • {plan.requestsIncluded.toLocaleString()} requests
                        </p>
                      </div>
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full border-2',
                          selectedPlan?.name === plan.name ? 'border-black bg-black' : 'border-gray-300'
                        )}
                      >
                        {selectedPlan?.name === plan.name && (
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              <button
                type="button"
                onClick={() => setStep('payment')}
                disabled={!selectedPlan}
                className={cn(
                  'mt-4 w-full rounded-xl py-3 font-medium transition-colors',
                  selectedPlan
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                )}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900">Select payment method</h3>

              <div className="space-y-3">
                {[
                  { value: 'x402', label: 'x402 Protocol', desc: 'Pay with crypto via x402', icon: '⚡' },
                  { value: 'crypto', label: 'Crypto Wallet', desc: 'MetaMask, WalletConnect', icon: '🦊' },
                  { value: 'card', label: 'Credit Card', desc: 'Visa, Mastercard', icon: '💳' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors',
                      paymentMethod === option.value
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                    <div
                      className={cn(
                        'h-5 w-5 rounded-full border-2',
                        paymentMethod === option.value ? 'border-black bg-black' : 'border-gray-300'
                      )}
                    />
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select-plan')}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium text-gray-700 hover:border-black"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('confirmation')}
                  className="flex-1 rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-800"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900">Confirm your subscription</h3>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm capitalize text-gray-500">{selectedPlan?.name} Plan</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${selectedPlan?.price || service.pricing.payPerUse?.pricePerRequest || 0}
                    {selectedPlan?.billingPeriod && `/${selectedPlan.billingPeriod}`}
                  </p>
                </div>
                <div className="pt-4 text-sm text-gray-600">
                  <p>Payment Method: {paymentMethod === 'x402' ? 'x402 Protocol' : paymentMethod === 'crypto' ? 'Crypto Wallet' : 'Credit Card'}</p>
                </div>
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-black underline">
                    Terms of Service
                  </a>{' '}
                  and authorize this subscription.
                </span>
              </label>

              <PaymentProcessor
                amount={selectedPlan?.price || Number(service.pricing.payPerUse?.pricePerRequest) || 0}
                method={paymentMethod}
                onSuccess={handlePaymentSuccess}
                disabled={!termsAccepted || isProcessing}
                isProcessing={isProcessing}
              />

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full rounded-xl border-2 border-gray-200 py-3 font-medium text-gray-700 hover:border-black"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Subscription Successful!</h3>
                <p className="mt-2 text-gray-600">
                  Your subscription to {service.name} is now active.
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-left">
                <p className="mb-2 text-sm font-medium text-gray-700">Your API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-gray-200 px-3 py-2 font-mono text-sm">
                    {apiKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  ⚠️ Save this key securely. You won't be able to see it again.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-left">
                <h4 className="font-medium text-blue-900">Quick Start</h4>
                <pre className="mt-2 overflow-x-auto rounded bg-blue-100 p-3 text-xs text-blue-800">
                  {`curl -X POST ${service.endpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => onSuccess(apiKey)}
                className="w-full rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-800"
              >
                Go to My Subscriptions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
