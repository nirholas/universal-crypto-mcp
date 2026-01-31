import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const ids = searchParams.get('ids');
  const category = searchParams.get('category');
  const order = searchParams.get('order') || 'market_cap_desc';
  const per_page = searchParams.get('per_page') || '100';
  const page = searchParams.get('page') || '1';
  const sparkline = searchParams.get('sparkline') === 'true';

  try {
    const url = new URL(`${COINGECKO_API}/coins/markets`);
    url.searchParams.set('vs_currency', vs_currency);
    url.searchParams.set('order', order);
    url.searchParams.set('per_page', per_page);
    url.searchParams.set('page', page);
    url.searchParams.set('sparkline', String(sparkline));
    url.searchParams.set('price_change_percentage', '24h,7d,30d');
    
    if (ids) url.searchParams.set('ids', ids);
    if (category) url.searchParams.set('category', category);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        ...(process.env.COINGECKO_API_KEY && {
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
        }),
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prices error:', error);
    
    // Return mock data on error
    return NextResponse.json([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 62500,
        market_cap: 1230000000000,
        market_cap_rank: 1,
        total_volume: 25000000000,
        high_24h: 63000,
        low_24h: 61000,
        price_change_24h: 1500,
        price_change_percentage_24h: 2.45,
        price_change_percentage_7d_in_currency: 5.2,
        price_change_percentage_30d_in_currency: 15.8,
        circulating_supply: 19600000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 69000,
        ath_date: '2021-11-10T00:00:00.000Z',
        atl: 67.81,
        atl_date: '2013-07-06T00:00:00.000Z',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        last_updated: new Date().toISOString(),
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 3200,
        market_cap: 385000000000,
        market_cap_rank: 2,
        total_volume: 15000000000,
        high_24h: 3250,
        low_24h: 3100,
        price_change_24h: 80,
        price_change_percentage_24h: 2.56,
        price_change_percentage_7d_in_currency: 3.1,
        price_change_percentage_30d_in_currency: 12.3,
        circulating_supply: 120000000,
        total_supply: 120000000,
        max_supply: null,
        ath: 4878,
        ath_date: '2021-11-10T00:00:00.000Z',
        atl: 0.432979,
        atl_date: '2015-10-20T00:00:00.000Z',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        last_updated: new Date().toISOString(),
      },
    ]);
  }
}
