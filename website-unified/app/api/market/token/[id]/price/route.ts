/**
 * Token Price History API Route
 * 
 * Provides historical price data for charts
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1M';

    const priceData = await getTokenPriceHistory(id, timeframe);
    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Token price API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}

async function getTokenPriceHistory(id: string, timeframe: string) {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  // Map timeframe to CoinGecko days parameter
  const daysMap: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
    'ALL': 'max' as unknown as number,
  };

  const days = daysMap[timeframe] || 30;

  try {
    const response = await fetch(
      `${API_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }
    );
    
    const data = await response.json();
    
    const prices = data.prices || [];
    const volumes = data.total_volumes || [];

    return {
      timestamps: prices.map((p: [number, number]) => new Date(p[0]).toISOString()),
      values: prices.map((p: [number, number]) => p[1]),
      volumes: volumes.map((v: [number, number]) => v[1]),
      timeframe,
    };
  } catch (error) {
    console.error('CoinGecko price history API error:', error);
    return {
      timestamps: [],
      values: [],
      volumes: [],
      timeframe,
    };
  }
}
