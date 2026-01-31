'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mark all alerts as read for user
    const response = await fetch(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/alerts/mark-all-read`,
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
      throw new Error('Failed to mark all alerts as read');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark all alerts read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark all alerts as read' },
      { status: 500 }
    );
  }
}
