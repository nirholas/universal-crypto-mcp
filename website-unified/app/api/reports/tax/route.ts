'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface TaxSummary {
  id: string;
  year: number;
  quarter?: number;
  month?: number;
  jurisdiction: string;
  totalRevenue: number;
  taxableRevenue: number;
  taxAmount: number;
  taxRate: number;
  currency: string;
  status: 'pending' | 'filed' | 'paid';
  dueDate: string;
  filedDate?: string;
  paidDate?: string;
}

interface TaxSummaryResponse {
  summaries: TaxSummary[];
  totalTaxLiability: number;
  pendingTax: number;
  paidTax: number;
}

async function fetchTaxSummariesFromDatabase(
  userId: string,
  options: {
    year?: number;
    jurisdiction?: string;
  }
): Promise<TaxSummary[]> {
  // Real implementation would query your database or tax service
  // Example with Prisma:
  /*
  const summaries = await prisma.taxSummary.findMany({
    where: {
      userId,
      ...(options.year && { year: options.year }),
      ...(options.jurisdiction && { jurisdiction: options.jurisdiction }),
    },
    orderBy: [
      { year: 'desc' },
      { quarter: 'desc' },
    ],
  });

  return summaries;
  */

  // Fetch from tax service
  const queryParams = new URLSearchParams({
    userId,
    ...(options.year && { year: String(options.year) }),
    ...(options.jurisdiction && { jurisdiction: options.jurisdiction }),
  });

  const response = await fetch(
    `${process.env.TAX_SERVICE_URL}/api/v1/tax/summaries?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TAX_SERVICE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tax summaries');
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
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const jurisdiction = searchParams.get('jurisdiction') || undefined;

    const summaries = await fetchTaxSummariesFromDatabase(session.user.id, {
      year,
      jurisdiction,
    });

    const totalTaxLiability = summaries.reduce((sum, s) => sum + s.taxAmount, 0);
    const pendingTax = summaries
      .filter(s => s.status === 'pending')
      .reduce((sum, s) => sum + s.taxAmount, 0);
    const paidTax = summaries
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + s.taxAmount, 0);

    const response: TaxSummaryResponse = {
      summaries,
      totalTaxLiability,
      pendingTax,
      paidTax,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Tax summaries fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tax summaries' },
      { status: 500 }
    );
  }
}
