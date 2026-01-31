'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type ReportType = 'monthly_statement' | 'tax_summary' | 'payout_report' | 'transaction_ledger' | 'revenue_report';
export type ReportFormat = 'pdf' | 'csv' | 'excel' | 'json';

export interface ScheduledReport {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  frequency: ScheduleFrequency;
  nextRunAt: string;
  lastRunAt?: string;
  recipients: string[];
  enabled: boolean;
  createdAt: string;
  options?: Record<string, unknown>;
}

interface ScheduledReportsResponse {
  reports: ScheduledReport[];
  total: number;
}

async function fetchScheduledReportsFromDatabase(
  userId: string
): Promise<ScheduledReport[]> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const reports = await prisma.scheduledReport.findMany({
    where: { userId },
    orderBy: { nextRunAt: 'asc' },
  });

  return reports;
  */

  // Fetch from reporting service
  const response = await fetch(
    `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/scheduled?userId=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch scheduled reports');
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

    const reports = await fetchScheduledReportsFromDatabase(session.user.id);

    const response: ScheduledReportsResponse = {
      reports,
      total: reports.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Scheduled reports fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled reports' },
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
    const { name, type, format, frequency, recipients, options } = body;

    // Validate required fields
    if (!name || !type || !format || !frequency || !recipients?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, format, frequency, recipients' },
        { status: 400 }
      );
    }

    // Validate frequency
    const validFrequencies: ScheduleFrequency[] = ['daily', 'weekly', 'monthly', 'quarterly'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate recipients (email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter((email: string) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate next run time
    const nextRunAt = calculateNextRunTime(frequency);

    // Create scheduled report
    const response = await fetch(
      `${process.env.REPORTING_SERVICE_URL}/api/v1/reports/scheduled`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REPORTING_SERVICE_API_KEY}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          name,
          type,
          format,
          frequency,
          nextRunAt: nextRunAt.toISOString(),
          recipients,
          enabled: true,
          options,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create scheduled report');
    }

    const report = await response.json();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Scheduled report creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create scheduled report' },
      { status: 500 }
    );
  }
}

function calculateNextRunTime(frequency: ScheduleFrequency): Date {
  const now = new Date();
  const next = new Date(now);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(8, 0, 0, 0); // 8 AM
      break;
    case 'weekly':
      next.setDate(next.getDate() + (7 - next.getDay() + 1) % 7 || 7); // Next Monday
      next.setHours(8, 0, 0, 0);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      next.setHours(8, 0, 0, 0);
      break;
    case 'quarterly':
      const currentQuarter = Math.floor(next.getMonth() / 3);
      next.setMonth((currentQuarter + 1) * 3);
      next.setDate(1);
      next.setHours(8, 0, 0, 0);
      break;
  }

  return next;
}
