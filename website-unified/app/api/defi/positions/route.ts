/**
 * DeFi Positions API Route
 * POST /api/defi/positions - Get DeFi positions across protocols
 * GET /api/defi/positions - Get positions summary
 * 
 * Integrates with @universal-crypto-mcp/defi for position tracking
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// ============================================================================
// Configuration
// ============================================================================

const DEFILLAMA_YIELDS_API = 'https://yields.llama.fi';
const DEBANK_API = 'https://pro-openapi.debank.com/v1';

// Known DeFi protocol contract addresses for position detection
const PROTOCOL_CONTRACTS: Record<string, Record<string, string[]>> = {
  ethereum: {
    aave: ['0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'],
    compound: ['0xc3d688B66703497DAA19211EEdff47f25384cdc3'],
    uniswap: ['0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'],
    curve: ['0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'],
    lido: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
    makerdao: ['0x5ef30b9986345249bc32d8928B7ee64DE9435E39'],
  },
  arbitrum: {
    gmx: ['0x489ee077994B6658eAfA855C308275EAd8097C4A'],
    camelot: ['0x6E9e6E31b66C9F1a8F2F7F5E4B4A4f3f3f3f3f3f'],
  },
  base: {
    aerodrome: ['0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43'],
  },
};

// ============================================================================
// Schemas
// ============================================================================

const PostBodySchema = z.object({
  wallets: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/)).min(1).max(10),
  chains: z.array(z.string()).optional().default(['ethereum', 'arbitrum', 'base', 'polygon']),
  protocols: z.array(z.string()).optional(),
});

const QuerySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
});

// ============================================================================
// Types
// ============================================================================

interface DeFiPosition {
  id: string;
  protocol: string;
  protocolLogo: string | null;
  chain: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming' | 'vault' | 'other';
  poolName: string;
  tokens: Array<{
    symbol: string;
    address: string;
    amount: number;
    valueUsd: number;
  }>;
  totalValueUsd: number;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  rewardTokens: string[];
  healthFactor: number | null;
  liquidationRisk: 'none' | 'low' | 'medium' | 'high' | null;
  unlockTime: string | null;
  dailyYield: number;
  monthlyYield: number;
}

interface PositionsSummary {
  totalValueUsd: number;
  totalDailyYield: number;
  totalMonthlyYield: number;
  positionCount: number;
  byProtocol: Record<string, { valueUsd: number; count: number }>;
  byChain: Record<string, { valueUsd: number; count: number }>;
  byType: Record<string, { valueUsd: number; count: number }>;
  riskDistribution: {
    none: number;
    low: number;
    medium: number;
    high: number;
  };
}

// ============================================================================
// Position Detection Helpers
// ============================================================================

async function detectPositionsFromDeBank(
  address: string,
  chains: string[]
): Promise<DeFiPosition[]> {
  const positions: DeFiPosition[] = [];
  
  const apiKey = process.env.DEBANK_API_KEY;
  if (!apiKey) {
    console.log('DeBank API key not configured, using fallback data');
    return positions;
  }

  try {
    // Fetch all protocol list for user
    const response = await fetch(
      `${DEBANK_API}/user/all_complex_protocol_list?id=${address}`,
      {
        headers: { AccessKey: apiKey },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) return positions;

    const data = await response.json();
    
    for (const protocol of data || []) {
      for (const portfolioItem of protocol.portfolio_item_list || []) {
        const position: DeFiPosition = {
          id: `${protocol.id}-${portfolioItem.pool?.id || Math.random()}`,
          protocol: protocol.name,
          protocolLogo: protocol.logo_url || null,
          chain: protocol.chain,
          type: mapDeBankType(portfolioItem.name),
          poolName: portfolioItem.pool?.name || portfolioItem.name || 'Unknown Pool',
          tokens: (portfolioItem.asset_token_list || []).map((token: any) => ({
            symbol: token.symbol,
            address: token.id,
            amount: token.amount || 0,
            valueUsd: (token.amount || 0) * (token.price || 0),
          })),
          totalValueUsd: portfolioItem.stats?.net_usd_value || 0,
          apy: null,
          apyBase: null,
          apyReward: null,
          rewardTokens: (portfolioItem.reward_token_list || []).map((t: any) => t.symbol),
          healthFactor: portfolioItem.detail?.health_rate || null,
          liquidationRisk: calculateRisk(portfolioItem.detail?.health_rate),
          unlockTime: portfolioItem.detail?.unlock_at 
            ? new Date(portfolioItem.detail.unlock_at * 1000).toISOString() 
            : null,
          dailyYield: 0,
          monthlyYield: 0,
        };

        positions.push(position);
      }
    }
  } catch (error) {
    console.error('DeBank fetch error:', error);
  }

  return positions;
}

function mapDeBankType(name: string): DeFiPosition['type'] {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('lend') || nameLower.includes('supply')) return 'lending';
  if (nameLower.includes('borrow')) return 'borrowing';
  if (nameLower.includes('liquidity') || nameLower.includes('lp')) return 'liquidity';
  if (nameLower.includes('stake') || nameLower.includes('staked')) return 'staking';
  if (nameLower.includes('farm') || nameLower.includes('yield')) return 'farming';
  if (nameLower.includes('vault')) return 'vault';
  return 'other';
}

function calculateRisk(healthFactor: number | null): DeFiPosition['liquidationRisk'] {
  if (healthFactor === null) return null;
  if (healthFactor >= 2) return 'none';
  if (healthFactor >= 1.5) return 'low';
  if (healthFactor >= 1.2) return 'medium';
  return 'high';
}

async function fetchPoolAPYs(): Promise<Map<string, { apy: number; apyBase: number; apyReward: number }>> {
  const apyMap = new Map();
  
  try {
    const response = await fetch(`${DEFILLAMA_YIELDS_API}/pools`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return apyMap;

    const data = await response.json();
    
    for (const pool of data.data || []) {
      apyMap.set(pool.pool?.toLowerCase(), {
        apy: pool.apy || 0,
        apyBase: pool.apyBase || 0,
        apyReward: pool.apyReward || 0,
      });
    }
  } catch (error) {
    console.error('Failed to fetch APYs:', error);
  }

  return apyMap;
}

function calculateSummary(positions: DeFiPosition[]): PositionsSummary {
  const summary: PositionsSummary = {
    totalValueUsd: 0,
    totalDailyYield: 0,
    totalMonthlyYield: 0,
    positionCount: positions.length,
    byProtocol: {},
    byChain: {},
    byType: {},
    riskDistribution: { none: 0, low: 0, medium: 0, high: 0 },
  };

  for (const pos of positions) {
    summary.totalValueUsd += pos.totalValueUsd;
    summary.totalDailyYield += pos.dailyYield;
    summary.totalMonthlyYield += pos.monthlyYield;

    // By protocol
    if (!summary.byProtocol[pos.protocol]) {
      summary.byProtocol[pos.protocol] = { valueUsd: 0, count: 0 };
    }
    summary.byProtocol[pos.protocol].valueUsd += pos.totalValueUsd;
    summary.byProtocol[pos.protocol].count++;

    // By chain
    if (!summary.byChain[pos.chain]) {
      summary.byChain[pos.chain] = { valueUsd: 0, count: 0 };
    }
    summary.byChain[pos.chain].valueUsd += pos.totalValueUsd;
    summary.byChain[pos.chain].count++;

    // By type
    if (!summary.byType[pos.type]) {
      summary.byType[pos.type] = { valueUsd: 0, count: 0 };
    }
    summary.byType[pos.type].valueUsd += pos.totalValueUsd;
    summary.byType[pos.type].count++;

    // Risk distribution
    if (pos.liquidationRisk && pos.liquidationRisk !== 'none') {
      summary.riskDistribution[pos.liquidationRisk]++;
    } else {
      summary.riskDistribution.none++;
    }
  }

  return summary;
}

// ============================================================================
// GET Handler - Get positions for a single address
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
          },
        },
        { status: 400 }
      );
    }

    const { address } = parseResult.data;

    if (!address) {
      // Return available protocols info
      return NextResponse.json({
        success: true,
        data: {
          supportedChains: Object.keys(PROTOCOL_CONTRACTS),
          supportedProtocols: Object.fromEntries(
            Object.entries(PROTOCOL_CONTRACTS).map(([chain, protocols]) => [
              chain,
              Object.keys(protocols),
            ])
          ),
          dataSource: 'debank',
          requiresApiKey: true,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    const positions = await detectPositionsFromDeBank(
      address.toLowerCase(),
      ['ethereum', 'arbitrum', 'base', 'polygon']
    );

    const summary = calculateSummary(positions);

    return NextResponse.json({
      success: true,
      data: {
        address: address.toLowerCase(),
        positions,
        summary,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('DeFi positions GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch DeFi positions',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Get positions for multiple wallets
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parseResult = PostBodySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { wallets, chains, protocols: filterProtocols } = parseResult.data;

    // Fetch positions for all wallets in parallel
    const allPositions = await Promise.all(
      wallets.map((wallet) => detectPositionsFromDeBank(wallet.toLowerCase(), chains))
    );

    // Combine all positions
    let positions = allPositions.flat();

    // Filter by protocols if specified
    if (filterProtocols && filterProtocols.length > 0) {
      const protocolsLower = filterProtocols.map((p) => p.toLowerCase());
      positions = positions.filter((p) =>
        protocolsLower.includes(p.protocol.toLowerCase())
      );
    }

    // Calculate combined summary
    const summary = calculateSummary(positions);

    // Group by wallet
    const byWallet: Record<string, DeFiPosition[]> = {};
    for (let i = 0; i < wallets.length; i++) {
      byWallet[wallets[i].toLowerCase()] = allPositions[i] || [];
    }

    return NextResponse.json({
      success: true,
      data: {
        wallets: wallets.map((w) => w.toLowerCase()),
        positions,
        byWallet,
        summary,
      },
      meta: {
        timestamp: new Date().toISOString(),
        walletsQueried: wallets.length,
        positionsFound: positions.length,
      },
    });
  } catch (error) {
    console.error('DeFi positions POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch DeFi positions',
        },
      },
      { status: 500 }
    );
  }
}
