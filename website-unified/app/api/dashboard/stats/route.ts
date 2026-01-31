'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface DashboardStats {
  totalRevenue: string;
  revenueChange: number;
  totalPayments: number;
  paymentsChange: number;
  successRate: number;
  successRateChange: number;
  averagePayment: string;
  averageChange: number;
  activeSubscriptions: number;
  subscriptionsChange: number;
  pendingPayouts: string;
}

async function fetchStatsFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date,
  previousStartDate: Date,
  previousEndDate: Date
): Promise<DashboardStats> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const [currentPeriod, previousPeriod, subscriptions, pendingPayouts] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        createdAt: { gte: startDate, lte: endDate },
        status: 'completed',
      },
      _sum: { amount: true },
      _count: true,
      _avg: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        createdAt: { gte: previousStartDate, lte: previousEndDate },
        status: 'completed',
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.subscription.count({
      where: { providerId: userId, status: 'active' },
    }),
    prisma.payout.aggregate({
      where: { userId, status: 'pending' },
      _sum: { amount: true },
    }),
  ]);

  const successfulPayments = await prisma.transaction.count({
    where: {
      userId,
      createdAt: { gte: startDate, lte: endDate },
      status: 'completed',
    },
  });

  const totalPayments = await prisma.transaction.count({
    where: {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 100;
  */

  // Fetch from payment analytics service
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/dashboard/stats`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYMENT_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        previousStartDate: previousStartDate.toISOString(),
        previousEndDate: previousEndDate.toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return response.json();
}

function calculateDateRanges(period: string) {
  const endDate = new Date();
  const startDate = new Date();
  const previousEndDate = new Date();
  const previousStartDate = new Date();

  switch (period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      previousEndDate.setDate(previousEndDate.getDate() - 7);
      previousStartDate.setDate(previousStartDate.getDate() - 14);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      previousEndDate.setDate(previousEndDate.getDate() - 30);
      previousStartDate.setDate(previousStartDate.getDate() - 60);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      previousEndDate.setDate(previousEndDate.getDate() - 90);
      previousStartDate.setDate(previousStartDate.getDate() - 180);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      previousEndDate.setFullYear(previousEndDate.getFullYear() - 1);
      previousStartDate.setFullYear(previousStartDate.getFullYear() - 2);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
      previousEndDate.setDate(previousEndDate.getDate() - 30);
      previousStartDate.setDate(previousStartDate.getDate() - 60);
  }

  return { startDate, endDate, previousStartDate, previousEndDate };
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
    const period = searchParams.get('period') || '30d';

    const { startDate, endDate, previousStartDate, previousEndDate } = calculateDateRanges(period);

    const stats = await fetchStatsFromDatabase(
      session.user.id,
      startDate,
      endDate,
      previousStartDate,
      previousEndDate
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
