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

    const body = await request.json();
    const { format, period, startDate, endDate, includeCharts } = body;

    // Validate format
    const validFormats = ['pdf', 'csv', 'excel', 'json'];
    if (format && !validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Must be one of: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate export via reporting service
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/analytics/revenue/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          format: format || 'pdf',
          period,
          startDate,
          endDate,
          includeCharts: includeCharts !== false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate revenue export');
    }

    const { reportId, status, downloadUrl, expiresAt } = await response.json();

    return NextResponse.json({
      reportId,
      status,
      downloadUrl,
      expiresAt,
    });
  } catch (error) {
    console.error('Revenue export error:', error);
    return NextResponse.json(
      { error: 'Failed to export revenue data' },
      { status: 500 }
    );
  }
}
