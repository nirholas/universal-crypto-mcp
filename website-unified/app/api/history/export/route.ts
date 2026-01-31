/**
 * Transaction Export API Route
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') as 'csv' | 'json' | 'pdf' || 'csv';
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    const transactions = await fetchAllTransactions(session.user.id, {
      type,
      status,
      dateFrom,
      dateTo,
    });

    let content: string;
    let contentType: string;
    let filename: string;

    const dateStr = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'json':
        content = JSON.stringify(transactions, null, 2);
        contentType = 'application/json';
        filename = `transactions-${dateStr}.json`;
        break;
      case 'csv':
      default:
        content = convertToCSV(transactions);
        contentType = 'text/csv';
        filename = `transactions-${dateStr}.csv`;
        break;
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Failed to export transactions:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}

// ============================================
// Helper Functions
// ============================================

interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
}

interface FetchParams {
  type?: string | null;
  status?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

async function fetchAllTransactions(userId: string, params: FetchParams): Promise<Transaction[]> {
  // TODO: Implement actual database query (no pagination for export)
  // return await prisma.transaction.findMany({
  //   where: {
  //     userId,
  //     ...(params.type && { type: params.type }),
  //     ...(params.status && { status: params.status }),
  //     ...(params.dateFrom && { createdAt: { gte: new Date(params.dateFrom) } }),
  //     ...(params.dateTo && { createdAt: { lte: new Date(params.dateTo) } })
  //   },
  //   orderBy: { createdAt: 'desc' }
  // });
  return [];
}

function convertToCSV(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return 'id,type,status,amount,currency,description,createdAt';
  }

  const headers = Object.keys(transactions[0]).join(',');
  const rows = transactions.map(tx =>
    Object.values(tx)
      .map(val => {
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(',')
  );

  return [headers, ...rows].join('\n');
}
