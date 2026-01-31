/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for subscription and payment updates
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Simple in-memory store (replace with database in production)
const subscriptions = new Map<string, {
  userId: string;
  status: string;
  plan: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}>();

// Stripe webhook event types we handle
type StripeEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  try {
    // Verify webhook signature with Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ============================================
// Event Handlers
// ============================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  // Get customer and subscription details
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (subscriptionId) {
    // Fetch full subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;

    // Map price ID to plan name
    const planName = getPlanFromPriceId(priceId);

    // Store subscription in database
    subscriptions.set(subscriptionId, {
      userId: customerId,
      status: subscription.status,
      plan: planName,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    console.log(`User ${customerId} subscribed to ${planName} plan`);

    // Send confirmation email (integrate with email service)
    await sendEmail({
      to: session.customer_email || '',
      subject: 'Welcome to Universal Crypto MCP!',
      template: 'subscription-welcome',
      data: { plan: planName },
    });
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const planName = getPlanFromPriceId(priceId);

  // Create subscription record
  subscriptions.set(subscription.id, {
    userId: customerId,
    status: subscription.status,
    plan: planName,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  console.log(`Subscription ${subscription.id} created for customer ${customerId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const existing = subscriptions.get(subscription.id);
  const priceId = subscription.items.data[0]?.price.id;
  const newPlan = getPlanFromPriceId(priceId);

  // Check if plan changed
  const planChanged = existing?.plan !== newPlan;

  // Update subscription record
  subscriptions.set(subscription.id, {
    userId: subscription.customer as string,
    status: subscription.status,
    plan: newPlan,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  if (planChanged && existing) {
    console.log(`Subscription ${subscription.id} changed from ${existing.plan} to ${newPlan}`);
    
    // Notify user of plan change
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if (!('deleted' in customer) && customer.email) {
      await sendEmail({
        to: customer.email,
        subject: 'Your subscription has been updated',
        template: 'subscription-updated',
        data: { oldPlan: existing.plan, newPlan },
      });
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const existing = subscriptions.get(subscription.id);

  // Mark subscription as cancelled
  if (existing) {
    existing.status = 'cancelled';
    subscriptions.set(subscription.id, existing);
  }

  // Revoke feature access by updating status
  subscriptions.delete(subscription.id);

  // Send cancellation confirmation
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if (!('deleted' in customer) && customer.email) {
    await sendEmail({
      to: customer.email,
      subject: 'Subscription cancelled',
      template: 'subscription-cancelled',
      data: { endDate: new Date(subscription.current_period_end * 1000).toISOString() },
    });
  }

  console.log(`Subscription ${subscription.id} cancelled`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);

  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;
  const amountPaid = invoice.amount_paid / 100; // Convert cents to dollars

  // Update subscription period if applicable
  const existing = subscriptions.get(subscriptionId);
  if (existing) {
    existing.status = 'active';
    existing.currentPeriodEnd = new Date((invoice.lines.data[0]?.period?.end || 0) * 1000);
    subscriptions.set(subscriptionId, existing);
  }

  // Record payment in analytics/database
  console.log(`Payment of $${amountPaid} received from ${customerId}`);

  // Send receipt
  const customer = await stripe.customers.retrieve(customerId);
  if (!('deleted' in customer) && customer.email) {
    await sendEmail({
      to: customer.email,
      subject: 'Payment receipt',
      template: 'payment-receipt',
      data: { 
        amount: amountPaid, 
        invoiceNumber: invoice.number,
        invoiceUrl: invoice.hosted_invoice_url 
      },
    });
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;

  // Update subscription status
  const existing = subscriptions.get(subscriptionId);
  if (existing) {
    existing.status = 'past_due';
    subscriptions.set(subscriptionId, existing);
  }

  // Notify user of payment failure
  const customer = await stripe.customers.retrieve(customerId);
  if (!('deleted' in customer) && customer.email) {
    await sendEmail({
      to: customer.email,
      subject: 'Payment failed - action required',
      template: 'payment-failed',
      data: { 
        updatePaymentUrl: `${process.env.NEXT_PUBLIC_URL}/billing/update-payment`,
        retryDate: invoice.next_payment_attempt 
          ? new Date(invoice.next_payment_attempt * 1000).toISOString()
          : null
      },
    });
  }

  console.log(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  const amount = paymentIntent.amount / 100;
  const customerId = paymentIntent.customer as string;

  // Log successful payment
  console.log(`One-time payment of $${amount} from ${customerId || 'guest'}`);

  // If this is a one-time purchase, fulfill the order
  if (paymentIntent.metadata?.productType === 'credits') {
    const credits = parseInt(paymentIntent.metadata.credits || '0');
    console.log(`Adding ${credits} credits to customer ${customerId}`);
    // Add credits to user account in database
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  const customerId = paymentIntent.customer as string;
  const amount = paymentIntent.amount / 100;

  // Log the failure
  console.log(`Payment of $${amount} failed for ${customerId || 'guest'}`);

  // Notify customer if we have their info
  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    if (!('deleted' in customer) && customer.email) {
      await sendEmail({
        to: customer.email,
        subject: 'Payment failed',
        template: 'payment-failed',
        data: { amount },
      });
    }
  }
}

// ============================================
// Helper Functions
// ============================================

function getPlanFromPriceId(priceId: string | undefined): string {
  const priceToPlans: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER || '']: 'starter',
    [process.env.STRIPE_PRICE_PRO || '']: 'pro',
    [process.env.STRIPE_PRICE_ENTERPRISE || '']: 'enterprise',
  };

  return priceToPlans[priceId || ''] || 'unknown';
}

async function sendEmail(options: {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}): Promise<void> {
  // Integrate with email service (SendGrid, Resend, etc.)
  // For now, just log
  console.log('Sending email:', {
    to: options.to,
    subject: options.subject,
    template: options.template,
  });

  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@universalcrypto.mcp',
  //   to: options.to,
  //   subject: options.subject,
  //   react: getEmailTemplate(options.template, options.data),
  // });
}
