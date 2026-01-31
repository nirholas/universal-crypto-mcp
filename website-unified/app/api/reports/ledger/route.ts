'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type LedgerEntryType = 
  | 'payment_received'
  | 'payment_sent'
  | 'fee'
  | 'refund'
  | 'payout'
  | 'adjustment'
  | 'subscription'
  | 'credit'
  | 'debit';

export interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerEntryType;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

interface LedgerResponse {
  entries: LedgerEntry[];
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  total: number;
  page: number;
  pageSize: number;
}

async function fetchLedgerFromDatabase(
  userId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    types?: LedgerEntryType[];
    page?: number;
    pageSize?: number;
  }
): Promise<LedgerResponse> {
  // Real implementation would query your database
  // Example with Prisma:
  /*
  const [entries, total] = await Promise.all([
    prisma.ledgerEntry.findMany({
      where: {
        userId,
        ...(options.startDate && options.endDate && {
          date: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
        ...(options.types && { type: { in: options.types } }),
      },
      orderBy: { date: 'desc' },
      take: options.pageSize,
      skip: ((options.page || 1) - 1) * (options.pageSize || 50),
    }),
    prisma.ledgerEntry.count({
      where: {
        userId,
        ...(options.startDate && options.endDate && {
          date: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
        ...(options.types && { type: { in: options.types } }),
      },
    }),
  ]);

  // Calculate running balances
  let runningBalance = openingBalance;
  const entriesWithBalance = entries.map(entry => {
    runningBalance = runningBalance + entry.credit - entry.debit;
    return { ...entry, balance: runningBalance };
  });

  return { entries: entriesWithBalance, total, ... };
  */

  // Fetch from accounting service
  const queryParams = new URLSearchParams({
    userId,
    page: String(options.page || 1),
    pageSize: String(options.pageSize || 50),
    ...(options.startDate && { startDate: options.startDate.toISOString() }),
    ...(options.endDate && { endDate: options.endDate.toISOString() }),
    ...(options.types && { types: options.types.join(',') }),
  });

  const response = await fetch(
    `${process.env.ACCOUNTING_SERVICE_URL}/api/v1/ledger?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.ACCOUNTING_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ledger');
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
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const types = searchParams.get('types')?.split(',') as LedgerEntryType[] | undefined;

    const ledger = await fetchLedgerFromDatabase(session.user.id, {
      page,
      pageSize,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      types,
    });

    return NextResponse.json(ledger);
  } catch (error) {
    console.error('Ledger fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ledger' },
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
    const { format, startDate, endDate } = body;

    // Export ledger
    const response = await fetch(
      `${process.env.ACCOUNTING_SERVICE_URL}/api/v1/ledger/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ACCOUNTING_SERVICE_API_KEY}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          format: format || 'csv',
          startDate,
          endDate,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export ledger');
    }

    const { downloadUrl, expiresAt } = await response.json();

    return NextResponse.json({ downloadUrl, expiresAt });
  } catch (error) {
    console.error('Ledger export error:', error);
    return NextResponse.json(
      { error: 'Failed to export ledger' },
      { status: 500 }
    );
  }
}
