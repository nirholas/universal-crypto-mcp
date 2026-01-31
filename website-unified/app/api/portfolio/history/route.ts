/**
 * Portfolio History API Route
 * 
 * Provides historical portfolio value data for charts
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1M';
    const body = await request.json();
    const { wallets } = body as { wallets: string[] };

    if (!wallets || wallets.length === 0) {
      return NextResponse.json(
        { error: 'Wallet addresses required' },
        { status: 400 }
      );
    }

    const historyData = await getPortfolioHistory(wallets, timeframe);

    return NextResponse.json(historyData);
  } catch (error) {
    console.error('Portfolio history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio history' },
      { status: 500 }
    );
  }
}

async function getPortfolioHistory(wallets: string[], timeframe: string) {
  // Calculate time range based on timeframe
  const now = Date.now();
  const timeRanges: Record<string, { days: number; interval: number }> = {
    '1D': { days: 1, interval: 60 * 60 * 1000 }, // hourly
    '1W': { days: 7, interval: 4 * 60 * 60 * 1000 }, // 4 hours
    '1M': { days: 30, interval: 24 * 60 * 60 * 1000 }, // daily
    '3M': { days: 90, interval: 24 * 60 * 60 * 1000 }, // daily
    '1Y': { days: 365, interval: 7 * 24 * 60 * 60 * 1000 }, // weekly
    'ALL': { days: 730, interval: 7 * 24 * 60 * 60 * 1000 }, // weekly
  };

  const { days, interval } = timeRanges[timeframe] || timeRanges['1M'];
  const startTime = now - days * 24 * 60 * 60 * 1000;
  const dataPoints = Math.floor((now - startTime) / interval);

  // In production, this would query historical balance snapshots
  // For now, generate placeholder data structure
  const timestamps: string[] = [];
  const values: number[] = [];

  for (let i = 0; i <= dataPoints; i++) {
    const timestamp = new Date(startTime + i * interval);
    timestamps.push(timestamp.toISOString());
    values.push(0); // Placeholder - would be actual historical values
  }

  return {
    timestamps,
    values,
    timeframe,
    startDate: new Date(startTime).toISOString(),
    endDate: new Date(now).toISOString(),
  };
}
