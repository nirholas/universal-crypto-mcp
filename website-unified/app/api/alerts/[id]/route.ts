'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Mark alert as read
    const response = await fetch(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/alerts/${id}/read`,
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
      throw new Error('Failed to mark alert as read');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark alert read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark alert as read' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Dismiss/delete alert
    const response = await fetch(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/alerts/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NOTIFICATION_SERVICE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to dismiss alert');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Dismiss alert error:', error);
    return NextResponse.json(
      { error: 'Failed to dismiss alert' },
      { status: 500 }
    );
  }
}
