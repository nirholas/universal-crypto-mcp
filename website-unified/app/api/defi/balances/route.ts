import { NextRequest, NextResponse } from 'next/server';

/**
 * Get token balances for an address
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, tokens } = body;

    if (!address || !tokens?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: address, tokens' },
        { status: 400 }
      );
    }

    // In production, fetch from RPC or indexer
    // For demo, return mock balances
    const balances: Record<string, string> = {};
    
    for (const token of tokens) {
      // Mock balance between 0 and 100
      balances[token] = (Math.random() * 100).toFixed(6);
    }

    // Always give some ETH
    const ethToken = tokens.find((t: string) => 
      t.toLowerCase().includes('eeee') || t.toLowerCase() === 'eth'
    );
    if (ethToken) {
      balances[ethToken] = (Math.random() * 10 + 1).toFixed(6);
    }

    return NextResponse.json(balances);
  } catch (error) {
    console.error('Balances error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}
