'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type AlertType = 
  | 'payment_received'
  | 'payment_failed'
  | 'subscription_renewal'
  | 'low_balance'
  | 'unusual_activity'
  | 'payout_ready'
  | 'payout_completed'
  | 'usage_limit'
  | 'security_warning';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'success';

export interface PaymentAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

interface AlertsResponse {
  alerts: PaymentAlert[];
  unreadCount: number;
  total: number;
}

async function fetchAlertsFromDatabase(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    types?: AlertType[];
  }
): Promise<{ alerts: PaymentAlert[]; total: number }> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      where: {
        userId,
        ...(options.unreadOnly && { read: false }),
        ...(options.types && { type: { in: options.types } }),
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit,
      skip: options.offset,
    }),
    prisma.alert.count({
      where: {
        userId,
        ...(options.unreadOnly && { read: false }),
        ...(options.types && { type: { in: options.types } }),
      },
    }),
  ]);

  return { alerts, total };
  */

  // Fetch from notification service
  const queryParams = new URLSearchParams({
    userId,
    limit: String(options.limit || 50),
    offset: String(options.offset || 0),
    ...(options.unreadOnly && { unreadOnly: 'true' }),
    ...(options.types && { types: options.types.join(',') }),
  });

  const response = await fetch(
    `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/alerts?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NOTIFICATION_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const types = searchParams.get('types')?.split(',') as AlertType[] | undefined;

    const { alerts, total } = await fetchAlertsFromDatabase(session.user.id, {
      limit,
      offset,
      unreadOnly,
      types,
    });

    const unreadCount = alerts.filter(a => !a.read).length;

    const response: AlertsResponse = {
      alerts,
      unreadCount,
      total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Alerts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clear all alerts for user
    const response = await fetch(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/alerts/clear`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NOTIFICATION_SERVICE_API_KEY}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to clear alerts');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clear alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to clear alerts' },
      { status: 500 }
    );
  }
}
