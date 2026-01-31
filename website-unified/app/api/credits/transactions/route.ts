import { NextRequest, NextResponse } from 'next/server';

// Mock transactions
const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'purchase',
    amount: 100,
    balance: 1500.50,
    description: 'Credit package purchase',
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'tx-2',
    type: 'usage',
    amount: -5.50,
    balance: 1400.50,
    description: 'API call - Premium GPT',
    serviceId: 'svc-1',
    serviceName: 'Premium GPT API',
    timestamp: Date.now() - 43200000,
  },
  {
    id: 'tx-3',
    type: 'usage',
    amount: -2.00,
    balance: 1398.50,
    description: 'API call - Image Generator',
    serviceId: 'svc-2',
    serviceName: 'AI Image Generator',
    timestamp: Date.now() - 21600000,
  },
  {
    id: 'tx-4',
    type: 'bonus',
    amount: 50,
    balance: 1448.50,
    description: 'Referral bonus',
    timestamp: Date.now() - 10800000,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '20');
  const before = searchParams.get('before');

  let transactions = [...MOCK_TRANSACTIONS];

  if (type) {
    transactions = transactions.filter((tx) => tx.type === type);
  }

  if (before) {
    const beforeTs = parseInt(before);
    transactions = transactions.filter((tx) => tx.timestamp < beforeTs);
  }

  transactions = transactions.slice(0, limit);

  return NextResponse.json(transactions);
}
