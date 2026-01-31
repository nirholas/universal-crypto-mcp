'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface ChainStats {
  chain: string;
  chainId: number;
  percentage: number;
  color: string;
  amount: number;
  transactionCount: number;
}

const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  base: '#3B82F6',
  arbitrum: '#28A0F0',
  optimism: '#FF0420',
  polygon: '#8247E5',
  avalanche: '#E84142',
  bsc: '#F0B90B',
  solana: '#14F195',
};

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  10: 'Optimism',
  137: 'Polygon',
  43114: 'Avalanche',
  56: 'BSC',
};

async function fetchChainStatsFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<ChainStats[]> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const chainStats = await prisma.transaction.groupBy({
    by: ['chainId'],
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId },
      ],
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'completed',
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const totalAmount = chainStats.reduce((sum, s) => sum + (s._sum.amount || 0), 0);

  return chainStats.map(s => ({
    chainId: s.chainId,
    chain: CHAIN_NAMES[s.chainId] || `Chain ${s.chainId}`,
    amount: s._sum.amount || 0,
    transactionCount: s._count,
    percentage: totalAmount > 0 ? ((s._sum.amount || 0) / totalAmount) * 100 : 0,
    color: CHAIN_COLORS[CHAIN_NAMES[s.chainId]?.toLowerCase()] || '#6B7280',
  }));
  */

  // Fetch from payment analytics service
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/analytics/chains`,
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
    throw new Error('Failed to fetch chain stats');
  }

  const data = await response.json();

  // Add colors to the response
  return data.map((item: ChainStats) => ({
    ...item,
    color: CHAIN_COLORS[item.chain.toLowerCase()] || '#6B7280',
  }));
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
    const period = searchParams.get('period') || '30d';

    const { startDate, endDate } = calculateDateRange(period);

    const chainStats = await fetchChainStatsFromDatabase(
      session.user.id,
      startDate,
      endDate
    );

    // Sort by amount descending
    chainStats.sort((a, b) => b.amount - a.amount);

    return NextResponse.json(chainStats);
  } catch (error) {
    console.error('Chain stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chain stats' },
      { status: 500 }
    );
  }
}
