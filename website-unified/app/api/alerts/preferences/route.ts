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

export interface AlertPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  alertTypes: Record<AlertType, boolean>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  thresholds: {
    lowBalanceAmount: number;
    unusualActivityAmount: number;
  };
}

async function getPreferencesFromDatabase(userId: string): Promise<AlertPreferences> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const preferences = await prisma.alertPreferences.findUnique({
    where: { userId },
  });

  if (!preferences) {
    // Return defaults
    return getDefaultPreferences();
  }

  return preferences;
  */

  // Fetch from notification service
  const response = await fetch(
    `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/preferences/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NOTIFICATION_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    // Return default preferences if not found
    return getDefaultPreferences();
  }

  return response.json();
}

function getDefaultPreferences(): AlertPreferences {
  return {
    emailEnabled: true,
    pushEnabled: true,
    alertTypes: {
      payment_received: true,
      payment_failed: true,
      subscription_renewal: true,
      low_balance: true,
      unusual_activity: true,
      payout_ready: true,
      payout_completed: true,
      usage_limit: true,
      security_warning: true,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
      timezone: 'UTC',
    },
    thresholds: {
      lowBalanceAmount: 100,
      unusualActivityAmount: 1000,
    },
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

    const preferences = await getPreferencesFromDatabase(session.user.id);

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const preferences: Partial<AlertPreferences> = body;

    // Validate preferences
    if (preferences.quietHours?.start && preferences.quietHours?.end) {
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(preferences.quietHours.start) || 
          !timeRegex.test(preferences.quietHours.end)) {
        return NextResponse.json(
          { error: 'Invalid time format' },
          { status: 400 }
        );
      }
    }

    // Update preferences
    const response = await fetch(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/preferences/${session.user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NOTIFICATION_SERVICE_API_KEY}`,
        },
        body: JSON.stringify(preferences),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }

    const updatedPreferences = await response.json();

    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
