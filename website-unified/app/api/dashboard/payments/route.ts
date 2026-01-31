'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  type: 'one-time' | 'subscription' | 'usage-based';
  sender: string;
  recipient: string;
  txHash?: string;
  chainId: number;
  createdAt: string;
  completedAt?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchPaymentsFromDatabase(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    type?: string;
  }
): Promise<{ payments: Payment[]; total: number }> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const [payments, total] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
        ...(options.startDate && options.endDate && {
          createdAt: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
        ...(options.status && { status: options.status }),
        ...(options.type && { type: options.type }),
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit,
      skip: options.offset,
      include: {
        sender: { select: { address: true } },
        recipient: { select: { address: true } },
      },
    }),
    prisma.transaction.count({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    }),
  ]);

  return { payments, total };
  */

  // Fetch from payment service
  const queryParams = new URLSearchParams({
    userId,
    limit: String(options.limit || 10),
    offset: String(options.offset || 0),
    ...(options.startDate && { startDate: options.startDate.toISOString() }),
    ...(options.endDate && { endDate: options.endDate.toISOString() }),
    ...(options.status && { status: options.status }),
    ...(options.type && { type: options.type }),
  });

  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/payments?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.PAYMENT_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch payments');
  }

  return response.json();
}

function calculateDateRange(period: string): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  return { startDate, endDate };
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const period = searchParams.get('period') || '30d';
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    const { startDate, endDate } = calculateDateRange(period);

    const { payments, total } = await fetchPaymentsFromDatabase(session.user.id, {
      limit,
      offset,
      startDate,
      endDate,
      status,
      type,
    });

    const response: PaymentsResponse = {
      payments,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
