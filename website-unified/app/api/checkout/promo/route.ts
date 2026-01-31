/**
 * Promo Code Validation API Route
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, planId } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    const result = await validatePromoCode(code, planId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to validate promo code:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}

// ============================================
// Helper Functions
// ============================================

interface PromoCodeResult {
  code: string;
  discountType: 'percent' | 'fixed';
  discountAmount: number;
  valid: boolean;
  message?: string;
}

async function validatePromoCode(code: string, planId?: string): Promise<PromoCodeResult> {
  // TODO: Implement actual promo code validation
  // return await prisma.promoCode.findFirst({
  //   where: {
  //     code: code.toUpperCase(),
  //     active: true,
  //     expiresAt: { gte: new Date() },
  //     OR: [
  //       { planIds: { isEmpty: true } },
  //       { planIds: { has: planId } }
  //     ]
  //   }
  // });

  // Example validation with Stripe:
  // try {
  //   const coupon = await stripe.coupons.retrieve(code);
  //   return {
  //     code,
  //     discountType: coupon.percent_off ? 'percent' : 'fixed',
  //     discountAmount: coupon.percent_off || (coupon.amount_off! / 100),
  //     valid: coupon.valid
  //   };
  // } catch {
  //   return { code, discountType: 'percent', discountAmount: 0, valid: false, message: 'Invalid code' };
  // }

  // Placeholder - replace with real implementation
  const upperCode = code.toUpperCase();
  
  // Example promo codes for testing
  const validCodes: Record<string, Omit<PromoCodeResult, 'code'>> = {
    'SAVE20': { discountType: 'percent', discountAmount: 20, valid: true },
    'FIRST10': { discountType: 'fixed', discountAmount: 10, valid: true },
    'ENTERPRISE50': { discountType: 'percent', discountAmount: 50, valid: planId === 'plan_enterprise' },
  };

  if (validCodes[upperCode]) {
    const promo = validCodes[upperCode];
    return {
      code: upperCode,
      ...promo,
      message: promo.valid ? undefined : 'This code is not valid for the selected plan',
    };
  }

  return {
    code: upperCode,
    discountType: 'percent',
    discountAmount: 0,
    valid: false,
    message: 'Invalid promo code',
  };
}
