/**
 * Individual Transaction API Route
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteContext {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const transaction = await fetchTransaction(params.id, session.user.id);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

async function fetchTransaction(id: string, userId: string) {
  // TODO: Implement actual database query
  // return await prisma.transaction.findFirst({
  //   where: { id, userId }
  // });
  return null;
}
