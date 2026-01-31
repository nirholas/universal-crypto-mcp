/**
 * Payment Methods Settings API Route
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const paymentMethods = await fetchPaymentMethods(session.user.id);
    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Failed to fetch payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, token, setAsDefault } = body;

    if (!type || !token) {
      return NextResponse.json(
        { error: 'Type and token are required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual payment method addition
    // Example with Stripe:
    // const paymentMethod = await stripe.paymentMethods.attach(token, {
    //   customer: stripeCustomerId
    // });
    // if (setAsDefault) {
    //   await stripe.customers.update(stripeCustomerId, {
    //     invoice_settings: { default_payment_method: paymentMethod.id }
    //   });
    // }

    const paymentMethod = await addPaymentMethod(session.user.id, {
      type,
      token,
      setAsDefault,
    });

    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error) {
    console.error('Failed to add payment method:', error);
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}

// ============================================
// Database Functions
// ============================================

interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto_wallet' | 'bank_account';
  isDefault: boolean;
  createdAt: string;
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  walletAddress?: string;
  chainId?: number;
  bankName?: string;
  accountLast4?: string;
}

async function fetchPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  // TODO: Implement actual database query
  // return await prisma.paymentMethod.findMany({
  //   where: { userId },
  //   orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  // });
  return [];
}

interface AddPaymentMethodParams {
  type: 'card' | 'crypto_wallet' | 'bank_account';
  token: string;
  setAsDefault?: boolean;
}

async function addPaymentMethod(
  userId: string,
  params: AddPaymentMethodParams
): Promise<PaymentMethod> {
  // TODO: Implement actual payment method storage
  throw new Error('Not implemented - connect to payment provider');
}
