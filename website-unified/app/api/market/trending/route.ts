/**
 * Trending Tokens API Route
 * 
 * Provides list of trending/hot tokens
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const trendingData = await getTrendingTokens();
    return NextResponse.json(trendingData);
  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending tokens' },
      { status: 500 }
    );
  }
}

async function getTrendingTokens() {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    const response = await fetch(
      `${API_BASE}/search/trending`,
      { next: { revalidate: 300 } }
    );
    
    const data = await response.json();
    const coins = data.coins || [];

    return coins.map((item: any) => {
      const coin = item.item;
      return {
        id: coin.id,
        symbol: coin.symbol?.toUpperCase() || '',
        name: coin.name || '',
        rank: coin.market_cap_rank || 0,
        logoUrl: coin.thumb || coin.small || coin.large || '',
        price: coin.data?.price || 0,
        priceChange24h: coin.data?.price_change_percentage_24h?.usd || 0,
        marketCap: coin.data?.market_cap || '',
        volume24h: coin.data?.total_volume || '',
        sparkline: coin.data?.sparkline || '',
        score: coin.score || 0,
      };
    });
  } catch (error) {
    console.error('CoinGecko trending API error:', error);
    return [];
  }
}
