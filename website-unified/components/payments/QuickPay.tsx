/**
 * Quick Pay Button Component
 * 
 * One-click payment button for quick transactions
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Zap, Loader2, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { getWalletPaymentManager } from '@/lib/payments/walletPayment';
import { getX402Client } from '@/lib/payments/x402Client';
import { getChainName, getToken } from '@/lib/payments/config';
import type { PaymentResult, Address, ChainId, Token } from '@/lib/payments/types';

// ============================================
// Types
// ============================================

interface QuickPayProps {
  recipient: Address;
  defaultAmount?: string;
  defaultToken?: string;
  defaultChainId?: ChainId;
  description?: string;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

interface QuickPayState {
  status: 'idle' | 'connecting' | 'confirming' | 'processing' | 'success' | 'error';
  error?: string;
  result?: PaymentResult;
}

// ============================================
// Component
// ============================================

export function QuickPay({
  recipient,
  defaultAmount = '1.00',
  defaultToken = 'USDC',
  defaultChainId = 8453,
  description = 'Quick payment',
  onSuccess,
  onError,
  disabled = false,
  variant = 'default',
  className = '',
}: QuickPayProps) {
  const [state, setState] = useState<QuickPayState>({ status: 'idle' });
  const [amount, setAmount] = useState(defaultAmount);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const walletManager = getWalletPaymentManager();
  const x402Client = getX402Client();

  // Get token
  const token = getToken(defaultToken, defaultChainId);

  // Handle quick pay
  const handlePay = useCallback(async () => {
    if (!token) {
      setState({ status: 'error', error: 'Token not found' });
      return;
    }

    try {
      // Check if wallet is connected
      let connection = walletManager.getConnection();
      
      if (!connection) {
        setState({ status: 'connecting' });
        connection = await walletManager.connect('injected');
      }

      // Show confirmation for amounts > $10
      const amountNum = parseFloat(amount);
      if (amountNum > 10 && !showConfirmation) {
        setShowConfirmation(true);
        return;
      }

      setState({ status: 'processing' });

      // Create payment request
      const paymentRequest = x402Client.createPaymentRequest({
        amount,
        token: defaultToken,
        chainId: defaultChainId,
        recipient,
        description,
        metadata: { description },
      });

      // Execute payment
      const { result } = await walletManager.pay(paymentRequest);

      if (result.success) {
        setState({ status: 'success', result });
        onSuccess?.(result);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setState({ status: 'idle' });
          setShowConfirmation(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Payment failed');
      setState({ status: 'error', error: err.message });
      onError?.(err);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setState({ status: 'idle' });
        setShowConfirmation(false);
      }, 3000);
    }
  }, [
    amount, 
    defaultToken, 
    defaultChainId, 
    recipient, 
    description, 
    token, 
    walletManager, 
    x402Client, 
    onSuccess, 
    onError,
    showConfirmation
  ]);

  // Cancel confirmation
  const handleCancel = () => {
    setShowConfirmation(false);
    setState({ status: 'idle' });
  };

  // Preset amounts
  const presetAmounts = ['1', '5', '10', '25', '50', '100'];

  // Icon variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handlePay}
        disabled={disabled || state.status !== 'idle'}
        className={`p-3 rounded-full transition-all ${
          state.status === 'success'
            ? 'bg-green-500 text-white'
            : state.status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } disabled:opacity-50 ${className}`}
        title={`Pay ${amount} ${defaultToken}`}
      >
        {state.status === 'idle' && <Zap className="w-5 h-5" />}
        {(state.status === 'connecting' || state.status === 'processing') && (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
        {state.status === 'success' && <Check className="w-5 h-5" />}
        {state.status === 'error' && <AlertCircle className="w-5 h-5" />}
      </button>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <button
        onClick={handlePay}
        disabled={disabled || state.status !== 'idle'}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          state.status === 'success'
            ? 'bg-green-500 text-white'
            : state.status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } disabled:opacity-50 ${className}`}
      >
        {state.status === 'idle' && (
          <>
            <Zap className="w-4 h-4" />
            Pay {amount} {defaultToken}
          </>
        )}
        {state.status === 'connecting' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        )}
        {state.status === 'processing' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        )}
        {state.status === 'success' && (
          <>
            <Check className="w-4 h-4" />
            Paid!
          </>
        )}
        {state.status === 'error' && (
          <>
            <AlertCircle className="w-4 h-4" />
            Failed
          </>
        )}
      </button>
    );
  }

  // Default variant with amount selection
  return (
    <div className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-white">Quick Pay</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Confirmation View */}
        {showConfirmation ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-white mb-2">
                {amount} {defaultToken}
              </div>
              <div className="text-gray-400">
                to {recipient.slice(0, 10)}...{recipient.slice(-8)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                on {getChainName(defaultChainId)}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                disabled={state.status === 'processing'}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 text-white text-2xl font-bold px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {defaultToken}
                </div>
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    amount === preset
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            {/* Recipient */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">To</span>
              <span className="font-mono text-gray-300">
                {recipient.slice(0, 10)}...{recipient.slice(-8)}
              </span>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Network</span>
              <span className="text-gray-300">{getChainName(defaultChainId)}</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={disabled || state.status !== 'idle' || !amount || parseFloat(amount) <= 0}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {state.status === 'idle' && (
                <>
                  <Zap className="w-5 h-5" />
                  Pay {amount} {defaultToken}
                </>
              )}
              {state.status === 'connecting' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting Wallet...
                </>
              )}
              {state.status === 'processing' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              )}
              {state.status === 'success' && (
                <>
                  <Check className="w-5 h-5" />
                  Payment Sent!
                </>
              )}
              {state.status === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5" />
                  {state.error || 'Payment Failed'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {state.status === 'error' && state.error && !showConfirmation && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {state.error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 text-center">
          Powered by x402 Protocol
        </div>
      </div>
    </div>
  );
}

// ============================================
// Tip Button Variant
// ============================================

interface TipButtonProps {
  recipient: Address;
  amounts?: string[];
  defaultToken?: string;
  chainId?: ChainId;
  onSuccess?: (result: PaymentResult) => void;
  className?: string;
}

export function TipButton({
  recipient,
  amounts = ['1', '5', '10'],
  defaultToken = 'USDC',
  chainId = 8453,
  onSuccess,
  className = '',
}: TipButtonProps) {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
      >
        <Zap className="w-4 h-4" />
        Tip
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-lg border border-gray-800 shadow-xl z-10">
          <div className="p-2">
            {amounts.map((amount) => (
              <QuickPay
                key={amount}
                recipient={recipient}
                defaultAmount={amount}
                defaultToken={defaultToken}
                defaultChainId={chainId}
                description={`Tip: $${amount}`}
                onSuccess={(result) => {
                  setIsOpen(false);
                  onSuccess?.(result);
                }}
                variant="compact"
                className="w-full mb-1 last:mb-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickPay;
