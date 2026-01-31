/**
 * Notifications API Route
 * 
 * Manages notification retrieval and marking as read
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo (use database in production)
const notifications: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    let allNotifications = Array.from(notifications.values());
    
    if (unreadOnly) {
      allNotifications = allNotifications.filter(n => !n.read);
    }

    // Sort by timestamp descending
    allNotifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(allNotifications);
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
