import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET() {
  try {
    const response = await fetch(`${COINGECKO_API}/global`, {
      headers: {
        'Accept': 'application/json',
        ...(process.env.COINGECKO_API_KEY && {
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
        }),
      },
      next: { revalidate: 120 }, // Cache for 2 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch global market data');
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Global market error:', error);
    
    // Return mock data
    return NextResponse.json({
      total_market_cap: { usd: 2500000000000 },
      total_volume: { usd: 85000000000 },
      market_cap_percentage: { btc: 49.2, eth: 15.4 },
      market_cap_change_percentage_24h_usd: 1.8,
      active_cryptocurrencies: 12500,
      markets: 850,
      updated_at: Math.floor(Date.now() / 1000),
    });
  }
}
