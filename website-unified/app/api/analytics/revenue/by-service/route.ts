'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface ServiceRevenue {
  serviceId: string;
  serviceName: string;
  revenue: number;
  transactions: number;
  percentage: number;
  growth: number;
  color: string;
}

interface ServiceRevenueResponse {
  services: ServiceRevenue[];
  totalRevenue: number;
  period: string;
}

// Color palette for services
const SERVICE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

async function fetchServiceRevenueFromDatabase(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<ServiceRevenue[]> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const serviceRevenue = await prisma.transaction.groupBy({
    by: ['serviceId'],
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
    },
    _count: true,
  });

  // Join with services table to get names
  const services = await prisma.service.findMany({
    where: {
      id: { in: serviceRevenue.map(s => s.serviceId) },
    },
  });
  */

  // Fetch from payment service
  const response = await fetch(
    `${process.env.PAYMENT_SERVICE_URL}/api/v1/analytics/revenue/by-service`,
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
    throw new Error('Failed to fetch service revenue data');
  }

  const data = await response.json();
  
  // Calculate percentages and assign colors
  const totalRevenue = data.reduce((sum: number, s: ServiceRevenue) => sum + s.revenue, 0);
  
  return data.map((service: ServiceRevenue, index: number) => ({
    ...service,
    percentage: totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0,
    color: SERVICE_COLORS[index % SERVICE_COLORS.length],
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

    const services = await fetchServiceRevenueFromDatabase(
      session.user.id,
      startDate,
      endDate
    );

    const totalRevenue = services.reduce((sum: number, s: ServiceRevenue) => sum + s.revenue, 0);

    const response: ServiceRevenueResponse = {
      services: services.sort((a: ServiceRevenue, b: ServiceRevenue) => b.revenue - a.revenue),
      totalRevenue,
      period,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Service revenue analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service revenue analytics' },
      { status: 500 }
    );
  }
}
