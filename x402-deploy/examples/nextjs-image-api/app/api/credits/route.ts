import { NextRequest, NextResponse } from 'next/server';

const WALLET_ADDRESS = process.env.X402_WALLET || '0x0000000000000000000000000000000000000000';

// Credit packages
const PACKAGES = {
  small: { credits: 100, price: '10', discount: 0 },
  medium: { credits: 1000, price: '80', discount: 20 },
  large: { credits: 10000, price: '500', discount: 50 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { package: packageName, payment_hash } = body;

    if (!packageName || !(packageName in PACKAGES)) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      );
    }

    if (!payment_hash) {
      return NextResponse.json(
        { error: 'Payment hash required' },
        { status: 400 }
      );
    }

    // In production: verify payment on blockchain
    // const verified = await verifyPayment(payment_hash, WALLET_ADDRESS, PACKAGES[packageName].price);

    const pkg = PACKAGES[packageName as keyof typeof PACKAGES];
    const userId = `user_${payment_hash.slice(0, 16)}`;

    // In production: update database with new credits
    
    return NextResponse.json({
      success: true,
      user_id: userId,
      credits_purchased: pkg.credits,
      amount_paid: `$${pkg.price} USDC`,
      discount: `${pkg.discount}%`,
      instructions: `Include 'X-User-Id: ${userId}' header in API requests`,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({
      packages: PACKAGES,
      wallet: WALLET_ADDRESS,
      network: 'Base (eip155:8453)',
      token: 'USDC',
    });
  }

  // In production: fetch from database
  const balance = 50;

  return NextResponse.json({
    user_id: userId,
    balance,
    packages: PACKAGES,
  });
}
