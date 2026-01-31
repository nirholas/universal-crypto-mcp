'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type ReportStatus = 'generating' | 'ready' | 'failed' | 'scheduled';
export type ReportFormat = 'pdf' | 'csv' | 'excel' | 'json';
export type ReportType = 'monthly_statement' | 'tax_summary' | 'payout_report' | 'transaction_ledger' | 'revenue_report';

export interface FinancialReport {
  id: string;
  type: ReportType;
  name: string;
  description: string;
  period: string;
  generatedAt: string;
  status: ReportStatus;
  format: ReportFormat;
  downloadUrl?: string;
  size?: number;
}

interface ReportsResponse {
  reports: FinancialReport[];
  total: number;
}

async function fetchReportsFromDatabase(
  userId: string,
  options: {
    type?: ReportType;
    status?: ReportStatus;
    limit?: number;
    offset?: number;
  }
): Promise<{ reports: FinancialReport[]; total: number }> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const [reports, total] = await Promise.all([
    prisma.financialReport.findMany({
      where: {
        userId,
        ...(options.type && { type: options.type }),
        ...(options.status && { status: options.status }),
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit,
      skip: options.offset,
    }),
    prisma.financialReport.count({
      where: {
        userId,
        ...(options.type && { type: options.type }),
        ...(options.status && { status: options.status }),
      },
    }),
  ]);

  return { reports, total };
  */

  // Fetch from reporting service
  const queryParams = new URLSearchParams({
    userId,
    limit: String(options.limit || 50),
    offset: String(options.offset || 0),
    ...(options.type && { type: options.type }),
    ...(options.status && { status: options.status }),
  });

  const response = await fetch(
    `${process.env.REPORTING_SERVICE_URL}/api/v1/reports?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
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
    const type = searchParams.get('type') as ReportType | undefined;
    const status = searchParams.get('status') as ReportStatus | undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { reports, total } = await fetchReportsFromDatabase(session.user.id, {
      type,
      status,
      limit,
      offset,
    });

    const response: ReportsResponse = {
      reports,
      total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

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
    const { type, format, startDate, endDate, options } = body;

    // Validate required fields
    if (!type || !format || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: type, format, startDate, endDate' },
        { status: 400 }
      );
    }

    // Validate report type
    const validTypes: ReportType[] = ['monthly_statement', 'tax_summary', 'payout_report', 'transaction_ledger', 'revenue_report'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid report type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats: ReportFormat[] = ['pdf', 'csv', 'excel', 'json'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Must be one of: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate report via reporting service
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          type,
          format,
          startDate,
          endDate,
          options,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    const report = await response.json();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
