import { NextRequest, NextResponse } from 'next/server';

const DEFILLAMA_API = 'https://yields.llama.fi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain');
  const protocol = searchParams.get('protocol');
  const minApy = parseFloat(searchParams.get('minApy') || '0');
  const sortBy = searchParams.get('sortBy') || 'apy';

  try {
    // Fetch from DeFiLlama yields API
    const response = await fetch(`${DEFILLAMA_API}/pools`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch farms');
    }

    const data = await response.json();
    let pools = data.data || [];

    // Filter to only yield-bearing pools (with APY)
    pools = pools.filter((p: any) => (p.apy || 0) > minApy);

    // Filter by chain
    if (chain) {
      pools = pools.filter((p: any) => 
        p.chain.toLowerCase() === chain.toLowerCase()
      );
    }

    // Filter by protocol
    if (protocol) {
      pools = pools.filter((p: any) => 
        p.project.toLowerCase() === protocol.toLowerCase()
      );
    }

    // Sort
    if (sortBy === 'apy') {
      pools.sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0));
    } else if (sortBy === 'tvl') {
      pools.sort((a: any, b: any) => (b.tvlUsd || 0) - (a.tvlUsd || 0));
    }

    // Determine risk level based on APY and TVL
    const getRisk = (apy: number, tvl: number): 'low' | 'medium' | 'high' => {
      if (apy > 50 || tvl < 1000000) return 'high';
      if (apy > 20 || tvl < 10000000) return 'medium';
      return 'low';
    };

    // Transform to our format
    const farms = pools.slice(0, 100).map((p: any) => ({
      id: p.pool,
      protocol: p.project,
      name: p.symbol,
      chain: p.chain,
      asset: {
        symbol: p.symbol,
        address: '',
      },
      tvl: p.tvlUsd || 0,
      apy: p.apy || 0,
      apyBase: p.apyBase || 0,
      apyReward: p.apyReward || 0,
      rewardTokens: (p.rewardTokens || []).map((t: string) => ({
        symbol: t,
        address: '',
        apy: (p.apyReward || 0) / (p.rewardTokens?.length || 1),
      })),
      depositToken: p.symbol.split('-')[0] || p.symbol,
      risk: getRisk(p.apy || 0, p.tvlUsd || 0),
    }));

    return NextResponse.json(farms);
  } catch (error) {
    console.error('Farms error:', error);
    
    // Return mock data on error
    return NextResponse.json([
      {
        id: 'yearn-eth',
        protocol: 'yearn',
        name: 'ETH Vault',
        chain: 'ethereum',
        asset: { symbol: 'ETH', address: '' },
        tvl: 500000000,
        apy: 5.2,
        apyBase: 3.5,
        apyReward: 1.7,
        rewardTokens: [{ symbol: 'YFI', address: '', apy: 1.7 }],
        depositToken: 'ETH',
        risk: 'low',
      },
      {
        id: 'convex-crv',
        protocol: 'convex',
        name: 'CRV Pool',
        chain: 'ethereum',
        asset: { symbol: 'CRV', address: '' },
        tvl: 200000000,
        apy: 18.5,
        apyBase: 8.0,
        apyReward: 10.5,
        rewardTokens: [
          { symbol: 'CVX', address: '', apy: 7.0 },
          { symbol: 'CRV', address: '', apy: 3.5 },
        ],
        depositToken: 'CRV',
        risk: 'medium',
      },
    ]);
  }
}
