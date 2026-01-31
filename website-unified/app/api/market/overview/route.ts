/**
 * Market Overview API Route
 * 
 * Provides global market data and statistics
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const marketData = await getMarketOverview();
    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Market overview API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market overview' },
      { status: 500 }
    );
  }
}

async function getMarketOverview() {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    // Fetch global market data
    const globalResponse = await fetch(
      `${API_BASE}/global`,
      { next: { revalidate: 60 } }
    );
    const globalData = await globalResponse.json();
    const data = globalData.data || {};

    return {
      totalMarketCap: data.total_market_cap?.usd || 0,
      totalVolume24h: data.total_volume?.usd || 0,
      btcDominance: data.market_cap_percentage?.btc || 0,
      ethDominance: data.market_cap_percentage?.eth || 0,
      marketCapChange24h: data.market_cap_change_percentage_24h_usd || 0,
      activeCryptocurrencies: data.active_cryptocurrencies || 0,
      markets: data.markets || 0,
      defiMarketCap: 0,
      defiVolume24h: 0,
      stablecoinMarketCap: 0,
      fearGreedIndex: 50,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('CoinGecko API error:', error);
    return {
      totalMarketCap: 0,
      totalVolume24h: 0,
      btcDominance: 0,
      ethDominance: 0,
      marketCapChange24h: 0,
      activeCryptocurrencies: 0,
      markets: 0,
      defiMarketCap: 0,
      defiVolume24h: 0,
      stablecoinMarketCap: 0,
      fearGreedIndex: 50,
      lastUpdated: new Date().toISOString(),
    };
  }
}
