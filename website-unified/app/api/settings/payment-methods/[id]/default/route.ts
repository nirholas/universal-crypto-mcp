/**
 * Set Default Payment Method API Route
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: Implement actual default setting
    // 1. Verify payment method belongs to user
    // 2. Update with payment provider
    // 3. Update database - set this as default, unset others
    
    // Example with Stripe:
    // await stripe.customers.update(stripeCustomerId, {
    //   invoice_settings: { default_payment_method: params.id }
    // });

    await setDefaultPaymentMethod(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set default payment method:', error);
    return NextResponse.json(
      { error: 'Failed to set default payment method' },
      { status: 500 }
    );
  }
}

async function setDefaultPaymentMethod(id: string, userId: string): Promise<void> {
  // TODO: Implement actual update
  // await prisma.$transaction([
  //   prisma.paymentMethod.updateMany({
  //     where: { userId },
  //     data: { isDefault: false }
  //   }),
  //   prisma.paymentMethod.update({
  //     where: { id, userId },
  //     data: { isDefault: true }
  //   })
  // ]);
}
