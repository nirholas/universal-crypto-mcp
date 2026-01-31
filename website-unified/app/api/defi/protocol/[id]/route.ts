/**
 * Protocol Details API Route
 * 
 * Fetches detailed protocol information
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const protocol = await getProtocolDetails(id);
    
    if (!protocol) {
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(protocol);
  } catch (error) {
    console.error('Protocol details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch protocol details' },
      { status: 500 }
    );
  }
}

async function getProtocolDetails(id: string) {
  const API_BASE = 'https://api.llama.fi';
  
  try {
    const response = await fetch(
      `${API_BASE}/protocol/${id}`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();

    return {
      id: data.slug,
      name: data.name,
      logo: data.logo,
      tvl: data.tvl || 0,
      tvlChange24h: data.change_1d || 0,
      tvlChange7d: data.change_7d || 0,
      revenue24h: 0,
      fees24h: 0,
      users24h: 0,
      chains: data.chains || [],
      category: data.category || 'Unknown',
      auditStatus: data.audits ? 'audited' : 'unaudited',
      governanceToken: data.symbol || null,
      tokenPrice: null,
      tokenChange24h: null,
      description: data.description || '',
      url: data.url || '',
      twitter: data.twitter || '',
      tvlHistory: data.tvl || [],
      chainTvls: data.chainTvls || {},
    };
  } catch (error) {
    console.error('DeFiLlama protocol details API error:', error);
    return null;
  }
}
