'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface TierRevenue {
  tierId: string;
  tierName: string;
  revenue: number;
  subscribers: number;
  percentage: number;
  growth: number;
  color: string;
  pricePerUnit: number;
}

interface TierRevenueResponse {
  tiers: TierRevenue[];
  totalRevenue: number;
  totalSubscribers: number;
  period: string;
}

const TIER_COLORS: Record<string, string> = {
  free: '#6B7280',
  starter: '#3B82F6',
  pro: '#10B981',
  enterprise: '#8B5CF6',
  custom: '#F59E0B',
};

async function fetchTierRevenueFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<TierRevenue[]> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const tierRevenue = await prisma.subscription.groupBy({
    by: ['tierId'],
    where: {
      providerId: userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'active',
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const tiers = await prisma.subscriptionTier.findMany({
    where: {
      id: { in: tierRevenue.map(t => t.tierId) },
    },
  });
  */

  // Fetch from payment service
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/analytics/revenue/by-tier`,
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
    throw new Error('Failed to fetch tier revenue data');
  }

  const data = await response.json();
  
  // Calculate percentages and assign colors
  const totalRevenue = data.reduce((sum: number, t: TierRevenue) => sum + t.revenue, 0);
  
  return data.map((tier: TierRevenue) => ({
    ...tier,
    percentage: totalRevenue > 0 ? (tier.revenue / totalRevenue) * 100 : 0,
    color: TIER_COLORS[tier.tierId.toLowerCase()] || TIER_COLORS.custom,
  }));
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
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
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

    const tiers = await fetchTierRevenueFromDatabase(
      session.user.id,
      startDate,
      endDate
    );

    const totalRevenue = tiers.reduce((sum: number, t: TierRevenue) => sum + t.revenue, 0);
    const totalSubscribers = tiers.reduce((sum: number, t: TierRevenue) => sum + t.subscribers, 0);

    const response: TierRevenueResponse = {
      tiers: tiers.sort((a: TierRevenue, b: TierRevenue) => b.revenue - a.revenue),
      totalRevenue,
      totalSubscribers,
      period,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Tier revenue analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tier revenue analytics' },
      { status: 500 }
    );
  }
}
