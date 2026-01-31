/**
 * Payments Layer
 * 
 * Payment processing utilities.
 * 
 * Reference: /vendor/payments/
 */

// ============================================================
// Types
// ============================================================

export interface PaymentRequest {
  amount: string;
  currency: string;
  recipient: string;
  chain?: number;
  token?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  confirmedAt?: Date;
}

export interface PaymentConfig {
  provider: 'stripe' | 'coinbase' | 'x402' | 'custom';
  apiKey?: string;
  webhookSecret?: string;
}

// ============================================================
// x402 Protocol Types
// ============================================================

export interface X402PaymentHeader {
  version: string;
  network: string;
  token: string;
  amount: string;
  recipient: string;
  expires: number;
  signature: string;
}

export function parseX402Header(header: string): X402PaymentHeader | null {
  try {
    const decoded = Buffer.from(header, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function createX402Header(payment: Omit<X402PaymentHeader, 'signature'>, sign: (data: string) => string): string {
  const data = JSON.stringify(payment);
  const signature = sign(data);
  const fullPayment = { ...payment, signature };
  return Buffer.from(JSON.stringify(fullPayment)).toString('base64');
}

// ============================================================
// Payment Processing
// ============================================================

export interface PaymentProcessor {
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(id: string): Promise<PaymentResult>;
  refundPayment(id: string, amount?: string): Promise<PaymentResult>;
}

// Factory would be implemented with actual SDK imports
export function createPaymentProcessor(config: PaymentConfig): PaymentProcessor {
  // Implementation would use Stripe, Coinbase SDKs
  throw new Error(`Payment processor ${config.provider} not implemented`);
}
