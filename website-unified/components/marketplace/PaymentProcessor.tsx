'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface PaymentProcessorProps {
  amount: number;
  method: 'x402' | 'crypto' | 'card';
  onSuccess: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export function PaymentProcessor({
  amount,
  method,
  onSuccess,
  disabled = false,
  isProcessing = false,
}: PaymentProcessorProps) {
  const [walletConnected, setWalletConnected] = React.useState(false);
  const [transactionStatus, setTransactionStatus] = React.useState<'idle' | 'pending' | 'confirming' | 'complete'>('idle');

  const handlePayment = async () => {
    if (method === 'x402' || method === 'crypto') {
      // Simulate wallet connection
      setTransactionStatus('pending');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWalletConnected(true);
      
      // Simulate transaction
      setTransactionStatus('confirming');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setTransactionStatus('complete');
      onSuccess();
    } else {
      // Card payment
      onSuccess();
    }
  };

  if (method === 'card') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-gray-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-gray-600">Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handlePayment}
          disabled={disabled}
          className={cn(
            'w-full rounded-xl py-3 font-medium transition-colors',
            disabled
              ? 'cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-black text-white hover:bg-gray-800'
          )}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Status */}
      <div className="rounded-xl border-2 border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{method === 'x402' ? '⚡' : '🦊'}</span>
            <div>
              <p className="font-medium text-gray-900">
                {method === 'x402' ? 'x402 Payment' : 'Crypto Wallet'}
              </p>
              <p className="text-sm text-gray-500">
                {walletConnected ? 'Connected: 0x1234...5678' : 'Not connected'}
              </p>
            </div>
          </div>
          {walletConnected && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              ✓ Connected
            </span>
          )}
        </div>
      </div>

      {/* Transaction Status */}
      {transactionStatus !== 'idle' && (
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            {transactionStatus === 'complete' ? (
              <span className="text-xl text-green-500">✓</span>
            ) : (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {transactionStatus === 'pending' && 'Connecting wallet...'}
                {transactionStatus === 'confirming' && 'Confirming transaction...'}
                {transactionStatus === 'complete' && 'Payment complete!'}
              </p>
              <p className="text-sm text-gray-500">
                {transactionStatus === 'confirming' && 'Please confirm in your wallet'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={disabled || transactionStatus !== 'idle'}
        className={cn(
          'w-full rounded-xl py-3 font-medium transition-colors',
          disabled || transactionStatus !== 'idle'
            ? 'cursor-not-allowed bg-gray-200 text-gray-400'
            : 'bg-black text-white hover:bg-gray-800'
        )}
      >
        {isProcessing || transactionStatus !== 'idle' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
            Processing...
          </span>
        ) : (
          <>
            {method === 'x402' ? 'Pay with x402' : 'Connect Wallet'} - ${amount}
          </>
        )}
      </button>

      {/* Info */}
      <p className="text-center text-xs text-gray-500">
        {method === 'x402'
          ? 'x402 enables seamless crypto payments with automatic subscription management'
          : 'Connect your wallet to complete the payment'}
      </p>
    </div>
  );
}
