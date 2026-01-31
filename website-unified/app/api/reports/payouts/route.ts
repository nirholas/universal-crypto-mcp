'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PayoutMethod = 'bank_transfer' | 'crypto' | 'paypal' | 'wire';

export interface PayoutRecord {
  id: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  status: PayoutStatus;
  destination: string;
  destinationDetails?: {
    bankName?: string;
    accountLast4?: string;
    walletAddress?: string;
    paypalEmail?: string;
  };
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  failedReason?: string;
  transactionHash?: string;
  fees: number;
  netAmount: number;
}

interface PayoutsResponse {
  payouts: PayoutRecord[];
  total: number;
  pendingAmount: number;
  completedAmount: number;
}

async function fetchPayoutsFromDatabase(
  userId: string,
  options: {
    status?: PayoutStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<{ payouts: PayoutRecord[]; total: number }> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const [payouts, total] = await Promise.all([
    prisma.payout.findMany({
      where: {
        userId,
        ...(options.status && { status: options.status }),
        ...(options.startDate && options.endDate && {
          initiatedAt: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
      },
      orderBy: { initiatedAt: 'desc' },
      take: options.limit,
      skip: options.offset,
    }),
    prisma.payout.count({
      where: {
        userId,
        ...(options.status && { status: options.status }),
      },
    }),
  ]);

  return { payouts, total };
  */

  // Fetch from payout service
  const queryParams = new URLSearchParams({
    userId,
    limit: String(options.limit || 50),
    offset: String(options.offset || 0),
    ...(options.status && { status: options.status }),
    ...(options.startDate && { startDate: options.startDate.toISOString() }),
    ...(options.endDate && { endDate: options.endDate.toISOString() }),
  });

  const response = await fetch(
    `${process.env.PAYOUT_SERVICE_URL}/api/v1/payouts?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.PAYOUT_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch payouts');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as PayoutStatus | undefined;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { payouts, total } = await fetchPayoutsFromDatabase(session.user.id, {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });

    const pendingAmount = payouts
      .filter(p => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);

    const completedAmount = payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const response: PayoutsResponse = {
      payouts,
      total,
      pendingAmount,
      completedAmount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Payouts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, currency, method, destination } = body;

    // Validate required fields
    if (!amount || !currency || !method || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, method, destination' },
        { status: 400 }
      );
    }

    // Create payout request
    const response = await fetch(
      `${process.env.PAYOUT_SERVICE_URL}/api/v1/payouts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYOUT_SERVICE_API_KEY}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          amount,
          currency,
          method,
          destination,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create payout' },
        { status: response.status }
      );
    }

    const payout = await response.json();

    return NextResponse.json(payout, { status: 201 });
  } catch (error) {
    console.error('Payout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    );
  }
}
