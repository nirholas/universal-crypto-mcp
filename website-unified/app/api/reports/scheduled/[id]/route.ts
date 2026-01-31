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

    // Fetch scheduled report details
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/scheduled/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Scheduled report not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch scheduled report');
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
    console.error('Scheduled report fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled report' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const body = await request.json();

    // Update scheduled report
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/scheduled/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
          'X-User-Id': session.user.id,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Scheduled report not found' },
          { status: 404 }
        );
      }
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
      throw new Error('Failed to update scheduled report');
    }

    const report = await response.json();

    return NextResponse.json(report);
  } catch (error) {
    console.error('Scheduled report update error:', error);
    return NextResponse.json(
      { error: 'Failed to update scheduled report' },
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

    // Delete scheduled report
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/scheduled/${id}`,
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
          { error: 'Scheduled report not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to delete scheduled report');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Scheduled report delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled report' },
      { status: 500 }
    );
  }
}
