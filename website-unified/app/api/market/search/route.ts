/**
 * Token Search API Route
 * 
 * Search for tokens by name or symbol
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (query.length < 1) {
      return NextResponse.json([]);
    }

    const searchResults = await searchTokens(query);
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search tokens' },
      { status: 500 }
    );
  }
}

async function searchTokens(query: string) {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    const response = await fetch(
      `${API_BASE}/search?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 60 } }
    );
    
    const data = await response.json();
    const coins = data.coins || [];

    // Get prices for top results
    const topCoins = coins.slice(0, 20);
    const ids = topCoins.map((c: any) => c.id).join(',');
    
    let prices: Record<string, any> = {};
    if (ids) {
      try {
        const priceResponse = await fetch(
          `${API_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
          { next: { revalidate: 60 } }
        );
        prices = await priceResponse.json();
      } catch (e) {
        console.error('Failed to fetch prices:', e);
      }
    }

    return topCoins.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase() || '',
      name: coin.name || '',
      rank: coin.market_cap_rank || 0,
      logoUrl: coin.thumb || coin.small || coin.large || '',
      price: prices[coin.id]?.usd || 0,
      change24h: prices[coin.id]?.usd_24h_change || 0,
      marketCap: prices[coin.id]?.usd_market_cap || 0,
    }));
  } catch (error) {
    console.error('CoinGecko search API error:', error);
    return [];
  }
}
