import { NextRequest, NextResponse } from 'next/server';

const DEFILLAMA_API = 'https://yields.llama.fi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain');
  const protocol = searchParams.get('protocol');
  const minTvl = parseFloat(searchParams.get('minTvl') || '0');
  const sortBy = searchParams.get('sortBy') || 'tvl';

  try {
    // Fetch from DeFiLlama yields API
    const response = await fetch(`${DEFILLAMA_API}/pools`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch pools');
    }

    const data = await response.json();
    let pools = data.data || [];

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

    // Filter by min TVL
    pools = pools.filter((p: any) => (p.tvlUsd || 0) >= minTvl);

    // Sort
    if (sortBy === 'apy') {
      pools.sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0));
    } else if (sortBy === 'volume') {
      pools.sort((a: any, b: any) => (b.volumeUsd24h || 0) - (a.volumeUsd24h || 0));
    } else {
      pools.sort((a: any, b: any) => (b.tvlUsd || 0) - (a.tvlUsd || 0));
    }

    // Transform to our format
    const transformedPools = pools.slice(0, 100).map((p: any) => ({
      id: p.pool,
      protocol: p.project,
      name: p.symbol,
      symbol: p.symbol,
      chain: p.chain,
      token0: {
        symbol: p.symbol.split('-')[0] || p.symbol,
        address: '',
      },
      token1: {
        symbol: p.symbol.split('-')[1] || '',
        address: '',
      },
      tvl: p.tvlUsd || 0,
      volume24h: p.volumeUsd24h || 0,
      apy: p.apy || 0,
      apyBase: p.apyBase || 0,
      apyReward: p.apyReward || 0,
      rewardTokens: p.rewardTokens || [],
      fee: 0.003,
    }));

    return NextResponse.json(transformedPools);
  } catch (error) {
    console.error('Pools error:', error);
    
    // Return mock data on error
    return NextResponse.json([
      {
        id: 'uniswap-eth-usdc',
        protocol: 'uniswap-v3',
        name: 'ETH-USDC',
        symbol: 'ETH-USDC',
        chain: 'ethereum',
        token0: { symbol: 'ETH', address: '' },
        token1: { symbol: 'USDC', address: '' },
        tvl: 150000000,
        volume24h: 45000000,
        apy: 12.5,
        apyBase: 8.2,
        apyReward: 4.3,
        rewardTokens: [],
        fee: 0.003,
      },
      {
        id: 'aave-eth',
        protocol: 'aave-v3',
        name: 'ETH Supply',
        symbol: 'aETH',
        chain: 'ethereum',
        token0: { symbol: 'ETH', address: '' },
        token1: { symbol: '', address: '' },
        tvl: 2500000000,
        volume24h: 0,
        apy: 3.2,
        apyBase: 3.2,
        apyReward: 0,
        rewardTokens: [],
        fee: 0,
      },
    ]);
  }
}
