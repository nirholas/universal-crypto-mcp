/**
 * Yield Opportunities API Route
 * 
 * Fetches current yield farming opportunities
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const yields = await getYieldOpportunities();
    return NextResponse.json(yields);
  } catch (error) {
    console.error('Yields API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yield opportunities' },
      { status: 500 }
    );
  }
}

async function getYieldOpportunities() {
  // Query DeFiLlama yields API
  const API_BASE = 'https://yields.llama.fi';
  
  try {
    const response = await fetch(
      `${API_BASE}/pools`,
      { next: { revalidate: 300 } }
    );
    
    const data = await response.json();
    const pools = data.data || [];

    // Filter and map top opportunities
    const filtered = pools
      .filter((p: any) => p.tvlUsd > 1000000 && p.apy > 0)
      .sort((a: any, b: any) => b.tvlUsd - a.tvlUsd)
      .slice(0, 100);

    return filtered.map((pool: any) => ({
      id: pool.pool,
      protocol: pool.project,
      chain: pool.chain,
      asset: pool.symbol,
      tvl: pool.tvlUsd,
      apy: pool.apy,
      apyBase: pool.apyBase,
      apyReward: pool.apyReward,
      rewardTokens: pool.rewardTokens || [],
      ilRisk: pool.ilRisk || 'unknown',
      exposure: pool.exposure || 'single',
      stablecoin: pool.stablecoin || false,
      audited: true, // Would need additional data
    }));
  } catch (error) {
    console.error('DeFiLlama yields API error:', error);
    return [];
  }
}
