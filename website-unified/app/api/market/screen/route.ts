/**
 * Market Screener API Route
 * 
 * Filter tokens based on various criteria
 */

import { NextRequest, NextResponse } from 'next/server';

interface ScreenerFilter {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'between';
  value: number | [number, number];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters } = body as { filters: ScreenerFilter[] };

    const screenResults = await screenTokens(filters);
    return NextResponse.json(screenResults);
  } catch (error) {
    console.error('Screener API error:', error);
    return NextResponse.json(
      { error: 'Failed to screen tokens' },
      { status: 500 }
    );
  }
}

async function screenTokens(filters: ScreenerFilter[]) {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    // Fetch top 250 coins to apply filters
    const response = await fetch(
      `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
      { next: { revalidate: 300 } }
    );
    
    const data = await response.json();
    
    if (!Array.isArray(data)) return [];

    // Apply filters
    let filtered = data;
    
    for (const filter of filters) {
      filtered = filtered.filter((coin: any) => {
        const fieldMap: Record<string, any> = {
          marketCap: coin.market_cap,
          price: coin.current_price,
          volume24h: coin.total_volume,
          change24h: coin.price_change_percentage_24h,
          change7d: coin.price_change_percentage_7d_in_currency,
          rank: coin.market_cap_rank,
        };
        
        const value = fieldMap[filter.field];
        if (value === undefined || value === null) return false;

        switch (filter.operator) {
          case 'gt':
            return value > (filter.value as number);
          case 'lt':
            return value < (filter.value as number);
          case 'eq':
            return value === (filter.value as number);
          case 'between':
            const [min, max] = filter.value as [number, number];
            return value >= min && value <= max;
          default:
            return true;
        }
      });
    }

    return filtered.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase() || '',
      name: coin.name || '',
      price: coin.current_price || 0,
      marketCap: coin.market_cap || 0,
      volume24h: coin.total_volume || 0,
      change1h: coin.price_change_percentage_1h_in_currency || 0,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      rank: coin.market_cap_rank || 0,
      logoUrl: coin.image || '',
    }));
  } catch (error) {
    console.error('CoinGecko screen API error:', error);
    return [];
  }
}
