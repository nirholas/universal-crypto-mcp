'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
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

    // Fetch report details
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch report');
    }

    const report = await response.json();

    // Verify ownership
    if (report.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
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

    // Delete report
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
          'X-User-Id': session.user.id,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to delete report');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
