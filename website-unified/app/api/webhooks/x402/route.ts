/**
 * x402 Payment Webhook Handler
 * 
 * Handles x402 protocol payment notifications for crypto payments
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

// x402 webhook event types
type X402EventType =
  | 'payment.created'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.refunded'
  | 'subscription.created'
  | 'subscription.renewed'
  | 'subscription.cancelled';

interface X402Event {
  id: string;
  type: X402EventType;
  createdAt: string;
  data: {
    paymentId?: string;
    subscriptionId?: string;
    amount: string;
    token: string;
    chainId: number;
    txHash?: string;
    sender?: string;
    recipient?: string;
    status?: string;
  };
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('x-x402-signature');
  const timestamp = headers().get('x-x402-timestamp');

  if (!signature || !timestamp) {
    return NextResponse.json(
      { error: 'Missing signature or timestamp' },
      { status: 400 }
    );
  }

  // Verify webhook signature
  const isValid = verifySignature(body, signature, timestamp);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  try {
    const event: X402Event = JSON.parse(body);

    // Process the event
    switch (event.type) {
      case 'payment.created':
        await handlePaymentCreated(event);
        break;

      case 'payment.completed':
        await handlePaymentCompleted(event);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event);
        break;

      case 'payment.refunded':
        await handlePaymentRefunded(event);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(event);
        break;

      case 'subscription.renewed':
        await handleSubscriptionRenewed(event);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event);
        break;

      default:
        console.log(`Unhandled x402 event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, eventId: event.id });
  } catch (error) {
    console.error('x402 webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ============================================
// Signature Verification
// ============================================

function verifySignature(
  payload: string,
  signature: string,
  timestamp: string
): boolean {
  const webhookSecret = process.env.X402_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('X402_WEBHOOK_SECRET not configured');
    return false;
  }

  // Check timestamp is within 5 minutes
  const now = Math.floor(Date.now() / 1000);
  const eventTime = parseInt(timestamp);
  if (Math.abs(now - eventTime) > 300) {
    return false;
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  // Compare signatures in constant time
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================
// Event Handlers
// ============================================

async function handlePaymentCreated(event: X402Event) {
  // TODO: Implement payment creation handling
  // 1. Create pending payment record
  // 2. Associate with order/subscription
  console.log('x402 payment created:', event.data.paymentId);
}

async function handlePaymentCompleted(event: X402Event) {
  // TODO: Implement payment completion handling
  // 1. Update payment status
  // 2. Fulfill order/activate subscription
  // 3. Send confirmation
  // 4. Update revenue metrics
  console.log('x402 payment completed:', event.data.paymentId, 'tx:', event.data.txHash);
}

async function handlePaymentFailed(event: X402Event) {
  // TODO: Implement payment failure handling
  // 1. Update payment status
  // 2. Notify user
  // 3. Log for analytics
  console.log('x402 payment failed:', event.data.paymentId);
}

async function handlePaymentRefunded(event: X402Event) {
  // TODO: Implement refund handling
  // 1. Update payment status
  // 2. Record refund transaction
  // 3. Revoke access if applicable
  // 4. Notify user
  console.log('x402 payment refunded:', event.data.paymentId);
}

async function handleSubscriptionCreated(event: X402Event) {
  // TODO: Implement subscription creation
  // 1. Create subscription record
  // 2. Grant access
  // 3. Send welcome email
  console.log('x402 subscription created:', event.data.subscriptionId);
}

async function handleSubscriptionRenewed(event: X402Event) {
  // TODO: Implement subscription renewal
  // 1. Extend subscription period
  // 2. Record payment
  // 3. Send renewal confirmation
  console.log('x402 subscription renewed:', event.data.subscriptionId);
}

async function handleSubscriptionCancelled(event: X402Event) {
  // TODO: Implement subscription cancellation
  // 1. Update subscription status
  // 2. Schedule access revocation
  // 3. Send cancellation confirmation
  console.log('x402 subscription cancelled:', event.data.subscriptionId);
}
