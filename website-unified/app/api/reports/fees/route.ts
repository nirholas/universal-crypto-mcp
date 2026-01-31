'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface FeeBreakdown {
  category: string;
  description: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface FeeBreakdownResponse {
  fees: FeeBreakdown[];
  totalFees: number;
  averageFeePercentage: number;
  period: string;
}

async function fetchFeeBreakdownFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<FeeBreakdown[]> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const fees = await prisma.transaction.groupBy({
    by: ['feeCategory'],
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      feeAmount: true,
    },
    _count: true,
  });

  const totalFees = fees.reduce((sum, f) => sum + (f._sum.feeAmount || 0), 0);

  return fees.map(fee => ({
    category: fee.feeCategory,
    description: getFeeDescription(fee.feeCategory),
    amount: fee._sum.feeAmount || 0,
    percentage: totalFees > 0 ? ((fee._sum.feeAmount || 0) / totalFees) * 100 : 0,
    transactions: fee._count,
  }));
  */

  // Fetch from accounting service
  const response = await fetch(
    `${process.env.ACCOUNTING_SERVICE_URL}/api/v1/fees/breakdown`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ACCOUNTING_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch fee breakdown');
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

    // Calculate date range
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

    const fees = await fetchFeeBreakdownFromDatabase(
      session.user.id,
      startDate,
      endDate
    );

    const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
    const totalTransactions = fees.reduce((sum, f) => sum + f.transactions, 0);
    const averageFeePercentage = totalTransactions > 0
      ? fees.reduce((sum, f) => sum + f.percentage * f.transactions, 0) / totalTransactions
      : 0;

    const response: FeeBreakdownResponse = {
      fees: fees.sort((a, b) => b.amount - a.amount),
      totalFees,
      averageFeePercentage,
      period,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Fee breakdown fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fee breakdown' },
      { status: 500 }
    );
  }
}
