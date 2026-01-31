/**
 * Protocols API Route
 * 
 * Fetches DeFi protocol data
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const protocols = await getProtocols(category);
    return NextResponse.json(protocols);
  } catch (error) {
    console.error('Protocols API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch protocols' },
      { status: 500 }
    );
  }
}

async function getProtocols(category?: string | null) {
  const API_BASE = 'https://api.llama.fi';
  
  try {
    const response = await fetch(
      `${API_BASE}/protocols`,
      { next: { revalidate: 300 } }
    );
    
    const data = await response.json();
    
    let protocols = Array.isArray(data) ? data : [];
    
    // Filter by category if specified
    if (category) {
      protocols = protocols.filter((p: any) => 
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by TVL and take top 100
    protocols = protocols
      .sort((a: any, b: any) => (b.tvl || 0) - (a.tvl || 0))
      .slice(0, 100);

    return protocols.map((protocol: any) => ({
      id: protocol.slug,
      name: protocol.name,
      logo: protocol.logo,
      tvl: protocol.tvl || 0,
      tvlChange24h: protocol.change_1d || 0,
      tvlChange7d: protocol.change_7d || 0,
      revenue24h: protocol.revenue24h || 0,
      fees24h: protocol.fees24h || 0,
      users24h: protocol.users24h || 0,
      chains: protocol.chains || [],
      category: protocol.category || 'Unknown',
      auditStatus: protocol.audits ? 'audited' : 'unaudited',
      governanceToken: protocol.symbol || null,
      tokenPrice: null,
      tokenChange24h: null,
    }));
  } catch (error) {
    console.error('DeFiLlama protocols API error:', error);
    return [];
  }
}
