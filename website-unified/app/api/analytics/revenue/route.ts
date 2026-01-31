'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  transactions: number;
  fees: number;
  netRevenue: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalTransactions: number;
  totalFees: number;
  netRevenue: number;
  averageTransactionValue: number;
  growthRate: number;
  previousPeriodRevenue: number;
}

interface RevenueResponse {
  data: RevenueDataPoint[];
  summary: RevenueSummary;
  period: string;
  currency: string;
}

// Database service for revenue analytics
async function fetchRevenueFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date,
  granularity: 'hour' | 'day' | 'week' | 'month'
): Promise<RevenueDataPoint[]> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const transactions = await prisma.transaction.groupBy({
    by: ['date'],
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'completed',
    },
    _sum: {
      amount: true,
      fees: true,
    },
    _count: true,
  });
  */

  // For now, return aggregated real data from your payment processor
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/analytics/revenue`,
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
        granularity,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch revenue data from payment service');
  }

  return response.json();
}

async function calculateRevenueSummary(
  data: RevenueDataPoint[],
  previousPeriodData: RevenueDataPoint[]
): Promise<RevenueSummary> {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalTransactions = data.reduce((sum, d) => sum + d.transactions, 0);
  const totalFees = data.reduce((sum, d) => sum + d.fees, 0);
  const netRevenue = data.reduce((sum, d) => sum + d.netRevenue, 0);
  const previousPeriodRevenue = previousPeriodData.reduce((sum, d) => sum + d.revenue, 0);

  const growthRate = previousPeriodRevenue > 0 
    ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
    : 0;

  return {
    totalRevenue,
    totalTransactions,
    totalFees,
    netRevenue,
    averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
    growthRate,
    previousPeriodRevenue,
  };
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
    const currency = searchParams.get('currency') || 'USD';
    const granularity = (searchParams.get('granularity') || 'day') as 'hour' | 'day' | 'week' | 'month';

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    const previousStartDate = new Date();
    const previousEndDate = new Date();

    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        previousEndDate.setHours(previousEndDate.getHours() - 24);
        previousStartDate.setHours(previousStartDate.getHours() - 48);
        break;
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

    // Fetch current and previous period data
    const [currentData, previousData] = await Promise.all([
      fetchRevenueFromDatabase(session.user.id, startDate, endDate, granularity),
      fetchRevenueFromDatabase(session.user.id, previousStartDate, previousEndDate, granularity),
    ]);

    const summary = await calculateRevenueSummary(currentData, previousData);

    const response: RevenueResponse = {
      data: currentData,
      summary,
      period,
      currency,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
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
    const { startDate, endDate, granularity, filters } = body;

    // Custom date range query
    const data = await fetchRevenueFromDatabase(
      session.user.id,
      new Date(startDate),
      new Date(endDate),
      granularity
    );

    // Apply any additional filters
    let filteredData = data;
    if (filters?.serviceId) {
      filteredData = data.filter((d: RevenueDataPoint & { serviceId?: string }) => 
        d.serviceId === filters.serviceId
      );
    }

    return NextResponse.json({
      data: filteredData,
      period: 'custom',
      startDate,
      endDate,
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}
