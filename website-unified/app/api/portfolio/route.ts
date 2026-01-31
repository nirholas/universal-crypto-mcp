/**
 * Portfolio API Route
 * 
 * Aggregates wallet balances across chains to provide portfolio data
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallets } = body as { wallets: string[] };

    if (!wallets || wallets.length === 0) {
      return NextResponse.json(
        { error: 'Wallet addresses required' },
        { status: 400 }
      );
    }

    // Aggregate portfolio data from multiple sources
    const portfolioData = await aggregatePortfolioData(wallets);

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}

async function aggregatePortfolioData(wallets: string[]) {
  // In production, this would call external APIs like:
  // - Alchemy/Moralis for EVM chain balances
  // - Helius for Solana balances
  // - CoinGecko for price data
  
  const API_BASE = process.env.MARKET_DATA_API_URL || 'https://api.coingecko.com/api/v3';
  
  // Fetch current prices for major tokens
  let prices: Record<string, { usd: number; usd_24h_change: number }> = {};
  try {
    const priceResponse = await fetch(
      `${API_BASE}/simple/price?ids=bitcoin,ethereum,solana,binancecoin,polygon&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );
    prices = await priceResponse.json();
  } catch (e) {
    console.error('Failed to fetch prices:', e);
  }

  // Aggregate holdings from all wallets
  // This would be replaced with actual on-chain queries
  const holdings = [
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0,
      price: prices.ethereum?.usd || 0,
      value: 0,
      change24h: prices.ethereum?.usd_24h_change || 0,
      allocation: 0,
      chain: 'ethereum',
      logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0,
      price: prices.bitcoin?.usd || 0,
      value: 0,
      change24h: prices.bitcoin?.usd_24h_change || 0,
      allocation: 0,
      chain: 'bitcoin',
      logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      amount: 0,
      price: prices.solana?.usd || 0,
      value: 0,
      change24h: prices.solana?.usd_24h_change || 0,
      allocation: 0,
      chain: 'solana',
      logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    },
  ];

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const change24h = holdings.reduce((sum, h) => sum + (h.value * h.change24h / 100), 0);

  return {
    totalValue,
    change24h: totalValue > 0 ? (change24h / totalValue) * 100 : 0,
    change24hValue: change24h,
    holdings,
    lastUpdated: new Date().toISOString(),
  };
}
