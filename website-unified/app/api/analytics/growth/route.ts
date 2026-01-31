'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface GrowthMetrics {
  mrr: number;
  mrrGrowth: number;
  arr: number;
  arrGrowth: number;
  newRevenue: number;
  expansionRevenue: number;
  contractionRevenue: number;
  churnedRevenue: number;
  netRevenueRetention: number;
  grossRevenueRetention: number;
  customerCount: number;
  customerGrowth: number;
  arpu: number;
  arpuGrowth: number;
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  paybackPeriodMonths: number;
}

interface GrowthMetricsResponse {
  current: GrowthMetrics;
  previous: GrowthMetrics;
  trends: {
    metric: string;
    values: { date: string; value: number }[];
  }[];
  period: string;
}

async function fetchGrowthMetricsFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<GrowthMetrics> {
  // Real implementation would calculate these from your database
  // Example with Prisma:
  /*
  const [subscriptions, transactions, customers] = await Promise.all([
    prisma.subscription.findMany({
      where: {
        providerId: userId,
        status: 'active',
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        createdAt: { gte: startDate, lte: endDate },
        status: 'completed',
      },
    }),
    prisma.customer.count({
      where: {
        providerId: userId,
        createdAt: { gte: startDate, lte: endDate },
      },
    }),
  ]);

  const mrr = subscriptions.reduce((sum, s) => sum + s.monthlyAmount, 0);
  const arr = mrr * 12;
  // ... more calculations
  */

  // Fetch from payment service
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/analytics/growth`,
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
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch growth metrics');
  }

  return response.json();
}

async function calculateGrowthTrends(
  userId: string,
  startDate: Date,
  endDate: Date,
  metrics: string[]
): Promise<{ metric: string; values: { date: string; value: number }[] }[]> {
  // Fetch historical data points for trend charts
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/analytics/growth/trends`,
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
        metrics,
      }),
    }
  );

  if (!response.ok) {
    return metrics.map(metric => ({ metric, values: [] }));
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
    const period = searchParams.get('period') || '30d';
    const includeTrends = searchParams.get('trends') === 'true';

    // Calculate date ranges
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

    // Fetch current and previous period metrics
    const [current, previous] = await Promise.all([
      fetchGrowthMetricsFromDatabase(session.user.id, startDate, endDate),
      fetchGrowthMetricsFromDatabase(session.user.id, previousStartDate, previousEndDate),
    ]);

    // Calculate growth rates
    const calculateGrowth = (curr: number, prev: number) => 
      prev > 0 ? ((curr - prev) / prev) * 100 : 0;

    current.mrrGrowth = calculateGrowth(current.mrr, previous.mrr);
    current.arrGrowth = calculateGrowth(current.arr, previous.arr);
    current.customerGrowth = calculateGrowth(current.customerCount, previous.customerCount);
    current.arpuGrowth = calculateGrowth(current.arpu, previous.arpu);

    let trends: { metric: string; values: { date: string; value: number }[] }[] = [];
    
    if (includeTrends) {
      trends = await calculateGrowthTrends(
        session.user.id,
        startDate,
        endDate,
        ['mrr', 'arr', 'customerCount', 'arpu']
      );
    }

    const response: GrowthMetricsResponse = {
      current,
      previous,
      trends,
      period,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Growth metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch growth metrics' },
      { status: 500 }
    );
  }
}
