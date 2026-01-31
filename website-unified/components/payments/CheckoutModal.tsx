/**
 * Checkout Modal Component
 * 
 * Payment checkout modal with wallet connection, chain selection,
 * and payment processing with real-time status updates
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Wallet, ChevronDown, Check, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { getWalletPaymentManager, type WalletConnection } from '@/lib/payments/walletPayment';
import { getChainName, getExplorerTxUrl, getChainTokens } from '@/lib/payments/config';
import type { PaymentRequest, PaymentResult, Token, ChainId } from '@/lib/payments/types';

// ============================================
// Types
// ============================================

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: PaymentRequest;
  onPaymentComplete?: (result: PaymentResult) => void;
  onPaymentError?: (error: Error) => void;
}

type CheckoutStep = 'connect' | 'review' | 'processing' | 'success' | 'error';

// ============================================
// Component
// ============================================

export function CheckoutModal({
  isOpen,
  onClose,
  paymentRequest,
  onPaymentComplete,
  onPaymentError,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('connect');
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token>(paymentRequest.token);
  const [selectedChain, setSelectedChain] = useState<ChainId>(paymentRequest.chainId);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const walletManager = getWalletPaymentManager();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingConnection = walletManager.getConnection();
      if (existingConnection) {
        setConnection(existingConnection);
        setStep('review');
      } else {
        setStep('connect');
      }
      setError(null);
      setResult(null);
    }
  }, [isOpen, walletManager]);

  // Connect wallet
  const handleConnect = useCallback(async (walletType: 'metamask' | 'coinbase' | 'injected') => {
    setIsConnecting(true);
    setError(null);

    try {
      const conn = await walletManager.connect(walletType);
      setConnection(conn);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [walletManager]);

  // Process payment
  const handlePayment = useCallback(async () => {
    if (!connection) return;

    setIsProcessing(true);
    setStep('processing');
    setError(null);

    try {
      const { result: paymentResult } = await walletManager.pay(paymentRequest);
      
      setResult(paymentResult);
      
      if (paymentResult.success) {
        setStep('success');
        onPaymentComplete?.(paymentResult);
      } else {
        setError(paymentResult.error || 'Payment failed');
        setStep('error');
        onPaymentError?.(new Error(paymentResult.error || 'Payment failed'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      setStep('error');
      onPaymentError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  }, [connection, paymentRequest, walletManager, onPaymentComplete, onPaymentError]);

  // Available tokens for selected chain
  const availableTokens = getChainTokens(selectedChain);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {step === 'connect' && 'Connect Wallet'}
            {step === 'review' && 'Review Payment'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Payment Complete'}
            {step === 'error' && 'Payment Failed'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Connect Step */}
          {step === 'connect' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm mb-6">
                Connect your wallet to proceed with the payment
              </p>

              <button
                onClick={() => handleConnect('metamask')}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">MetaMask</div>
                  <div className="text-sm text-gray-400">Connect with MetaMask</div>
                </div>
                {isConnecting && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
              </button>

              <button
                onClick={() => handleConnect('coinbase')}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">Coinbase Wallet</div>
                  <div className="text-sm text-gray-400">Connect with Coinbase</div>
                </div>
              </button>

              <button
                onClick={() => handleConnect('injected')}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">Other Wallet</div>
                  <div className="text-sm text-gray-400">Connect injected provider</div>
                </div>
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && connection && (
            <div className="space-y-6">
              {/* Connected Wallet */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Connected</div>
                    <div className="font-mono text-sm text-white">
                      {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {getChainName(connection.chainId)}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-2xl font-bold text-white">
                    {paymentRequest.amount} {selectedToken.symbol}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white">{getChainName(selectedChain)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Token</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                      <span className="text-white">{selectedToken.symbol}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showTokenDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10">
                        {availableTokens.map((token) => (
                          <button
                            key={token.address}
                            onClick={() => {
                              setSelectedToken(token);
                              setShowTokenDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {token.symbol}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Recipient</span>
                  <span className="font-mono text-sm text-white text-right">
                    {paymentRequest.recipient.slice(0, 10)}...{paymentRequest.recipient.slice(-8)}
                  </span>
                </div>

                {paymentRequest.description && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Description</span>
                    <span className="text-white text-right max-w-[200px]">
                      {paymentRequest.description}
                    </span>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Pay {paymentRequest.amount} {selectedToken.symbol}
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-400 text-sm">
                Please confirm the transaction in your wallet
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && result && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Your payment of {result.amount} {result.token} has been processed
              </p>

              {result.txHash && (
                <a
                  href={getExplorerTxUrl(result.chainId, result.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Transaction
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full mt-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {error || 'An error occurred while processing your payment'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Powered by</span>
            <span className="font-semibold text-gray-400">x402 Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
