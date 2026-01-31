/**
 * Market Tokens API Route
 * 
 * Provides paginated list of top tokens by market cap
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const tokensData = await getTopTokens(limit, page);
    return NextResponse.json(tokensData);
  } catch (error) {
    console.error('Market tokens API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

async function getTopTokens(limit: number, page: number) {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    const response = await fetch(
      `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`,
      { next: { revalidate: 60 } }
    );
    
    const data = await response.json();
    
    const tokens = Array.isArray(data) ? data.map((coin: any) => ({
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
      sparkline: coin.sparkline_in_7d?.price || [],
      circulatingSupply: coin.circulating_supply || 0,
      totalSupply: coin.total_supply || 0,
      maxSupply: coin.max_supply || null,
      ath: coin.ath || 0,
      athChangePercent: coin.ath_change_percentage || 0,
      athDate: coin.ath_date || null,
    })) : [];

    return {
      tokens,
      total: 10000, // CoinGecko has ~10k+ coins
      page,
      limit,
    };
  } catch (error) {
    console.error('CoinGecko tokens API error:', error);
    return { tokens: [], total: 0, page, limit };
  }
}
