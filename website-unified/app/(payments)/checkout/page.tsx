/**
 * Checkout Page
 * 
 * Complete checkout flow for purchasing subscriptions or one-time payments
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard,
  Wallet,
  Shield,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
  Zap,
  CheckCircle,
  X
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface Plan {
  id: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: string[];
  highlighted?: boolean;
  limits: {
    apiCalls: number;
    storage: number;
    support: string;
  };
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto_wallet';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  walletAddress?: string;
  isDefault: boolean;
}

interface CheckoutSession {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  clientSecret?: string;
}

interface PromoCode {
  code: string;
  discountType: 'percent' | 'fixed';
  discountAmount: number;
  valid: boolean;
  message?: string;
}

// ============================================
// Checkout API Service
// ============================================

class CheckoutService {
  private baseUrl = '/api/checkout';

  async fetchPlans(): Promise<Plan[]> {
    const response = await fetch('/api/plans', {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  }

  async fetchPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch('/api/settings/payment-methods', {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch payment methods');
    return response.json();
  }

  async validatePromoCode(code: string, planId: string): Promise<PromoCode> {
    const response = await fetch(`${this.baseUrl}/promo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, planId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to validate promo code');
    return response.json();
  }

  async createCheckoutSession(params: {
    planId: string;
    billingInterval: 'monthly' | 'yearly';
    paymentMethodId?: string;
    promoCode?: string;
  }): Promise<CheckoutSession> {
    const response = await fetch(`${this.baseUrl}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create checkout session');
    return response.json();
  }

  async confirmPayment(sessionId: string, paymentMethodId: string): Promise<{
    success: boolean;
    subscriptionId?: string;
    error?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, paymentMethodId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Payment confirmation failed');
    return response.json();
  }
}

const checkoutService = new CheckoutService();

// ============================================
// Component
// ============================================

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan');
  const intervalParam = searchParams.get('interval') as 'monthly' | 'yearly' | null;

  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(intervalParam || 'monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [validatedPromo, setValidatedPromo] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [step, setStep] = useState<'plan' | 'payment' | 'confirm'>('plan');

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansData, methodsData] = await Promise.all([
        checkoutService.fetchPlans(),
        checkoutService.fetchPaymentMethods(),
      ]);
      setPlans(plansData);
      setPaymentMethods(methodsData);

      // Pre-select plan if provided
      if (planId) {
        const plan = plansData.find(p => p.id === planId);
        if (plan) {
          setSelectedPlan(plan);
          setStep('payment');
        }
      }

      // Pre-select default payment method
      const defaultMethod = methodsData.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Validate promo code
  const handleValidatePromo = async () => {
    if (!promoCode || !selectedPlan) return;
    try {
      const result = await checkoutService.validatePromoCode(promoCode, selectedPlan.id);
      setValidatedPromo(result);
    } catch (err) {
      setValidatedPromo({
        code: promoCode,
        discountType: 'percent',
        discountAmount: 0,
        valid: false,
        message: 'Invalid promo code',
      });
    }
  };

  // Calculate total
  const total = useMemo(() => {
    if (!selectedPlan) return { subtotal: 0, discount: 0, total: 0 };

    const subtotal = billingInterval === 'yearly' 
      ? selectedPlan.price.yearly 
      : selectedPlan.price.monthly;

    let discount = 0;
    if (validatedPromo?.valid) {
      discount = validatedPromo.discountType === 'percent'
        ? subtotal * (validatedPromo.discountAmount / 100)
        : validatedPromo.discountAmount;
    }

    return {
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
    };
  }, [selectedPlan, billingInterval, validatedPromo]);

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedPlan || !selectedPaymentMethod) return;

    setProcessing(true);
    setError(null);

    try {
      const session = await checkoutService.createCheckoutSession({
        planId: selectedPlan.id,
        billingInterval,
        paymentMethodId: selectedPaymentMethod,
        promoCode: validatedPromo?.valid ? validatedPromo.code : undefined,
      });

      const result = await checkoutService.confirmPayment(session.id, selectedPaymentMethod);

      if (result.success) {
        setCheckoutComplete(true);
        setTimeout(() => {
          router.push(`/subscriptions?success=true&subscription=${result.subscriptionId}`);
        }, 2000);
      } else {
        setError(result.error || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  // Success state
  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-400">Redirecting to your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Select Plan */}
              <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'plan' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {step !== 'plan' ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <h2 className="text-lg font-semibold">Select Plan</h2>
                </div>

                {step === 'plan' ? (
                  <>
                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-6 p-1 bg-gray-800 rounded-lg w-fit mx-auto">
                      <button
                        onClick={() => setBillingInterval('monthly')}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          billingInterval === 'monthly'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingInterval('yearly')}
                        className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                          billingInterval === 'yearly'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Yearly
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          Save 20%
                        </span>
                      </button>
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            selectedPlan?.id === plan.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          } ${plan.highlighted ? 'ring-2 ring-blue-500/50' : ''}`}
                        >
                          {plan.highlighted && (
                            <div className="text-xs text-blue-400 font-medium mb-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Popular
                            </div>
                          )}
                          <h3 className="font-semibold text-white mb-1">{plan.name}</h3>
                          <div className="text-2xl font-bold mb-2">
                            ${billingInterval === 'yearly' ? plan.price.yearly : plan.price.monthly}
                            <span className="text-sm text-gray-400 font-normal">
                              /{billingInterval === 'yearly' ? 'year' : 'month'}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">{plan.description}</p>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => selectedPlan && setStep('payment')}
                      disabled={!selectedPlan}
                      className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{selectedPlan?.name}</span>
                      <span className="text-gray-500 ml-2">
                        ${billingInterval === 'yearly' ? selectedPlan?.price.yearly : selectedPlan?.price.monthly}
                        /{billingInterval === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    <button
                      onClick={() => setStep('plan')}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Change
                    </button>
                  </div>
                )}
              </section>

              {/* Step 2: Payment Method */}
              {(step === 'payment' || step === 'confirm') && (
                <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'confirm' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {step === 'confirm' ? <Check className="w-4 h-4" /> : '2'}
                    </div>
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                  </div>

                  {step === 'payment' ? (
                    <>
                      {paymentMethods.length === 0 ? (
                        <div className="text-center py-8">
                          <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No payment methods on file</p>
                          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                            Add Payment Method
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {paymentMethods.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => setSelectedPaymentMethod(method.id)}
                              className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all ${
                                selectedPaymentMethod === method.id
                                  ? 'border-blue-500 bg-blue-500/10'
                                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                              }`}
                            >
                              {method.type === 'card' ? (
                                <CreditCard className="w-6 h-6 text-gray-400" />
                              ) : (
                                <Wallet className="w-6 h-6 text-gray-400" />
                              )}
                              <div className="text-left">
                                {method.type === 'card' && (
                                  <>
                                    <div className="text-white capitalize">
                                      {method.brand} •••• {method.last4}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                      Expires {method.expiryMonth}/{method.expiryYear}
                                    </div>
                                  </>
                                )}
                                {method.type === 'crypto_wallet' && (
                                  <>
                                    <div className="text-white font-mono">
                                      {method.walletAddress?.slice(0, 6)}...{method.walletAddress?.slice(-4)}
                                    </div>
                                    <div className="text-gray-500 text-sm">Crypto Wallet</div>
                                  </>
                                )}
                              </div>
                              {selectedPaymentMethod === method.id && (
                                <Check className="w-5 h-5 text-blue-500 ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => selectedPaymentMethod && setStep('confirm')}
                        disabled={!selectedPaymentMethod}
                        className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Review Order
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <span className="text-white">
                          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.brand} ••••{' '}
                          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.last4}
                        </span>
                      </div>
                      <button
                        onClick={() => setStep('payment')}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 sticky top-20">
                <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

                {selectedPlan ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{selectedPlan.name}</span>
                        <span className="text-white">
                          ${total.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Billed {billingInterval}
                        </span>
                      </div>

                      {validatedPromo?.valid && (
                        <div className="flex justify-between text-green-400">
                          <span>Discount ({validatedPromo.code})</span>
                          <span>-${total.discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-2">Promo Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
                        />
                        <button
                          onClick={handleValidatePromo}
                          disabled={!promoCode}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {validatedPromo && !validatedPromo.valid && (
                        <p className="text-red-400 text-sm mt-2">{validatedPromo.message}</p>
                      )}
                    </div>

                    <div className="border-t border-gray-800 pt-4 mb-6">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {step === 'confirm' && (
                      <button
                        onClick={handleCheckout}
                        disabled={processing}
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Complete Purchase
                          </>
                        )}
                      </button>
                    )}

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>256-bit SSL encrypted</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Select a plan to see order details
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
