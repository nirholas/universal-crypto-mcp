/**
 * Protocols API Route
 * GET /api/defi/protocols - Get DeFi protocol data
 * 
 * Integrates with DeFiLlama and @universal-crypto-mcp/defi package
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

const DEFILLAMA_API = 'https://api.llama.fi';

// ============================================================================
// Query Schema
// ============================================================================

const QuerySchema = z.object({
  category: z.string().optional(),
  chain: z.string().optional(),
  search: z.string().optional(),
  minTvl: z.coerce.number().optional(),
  sortBy: z.enum(['tvl', 'change_1d', 'change_7d', 'fees', 'revenue']).optional().default('tvl'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// Types
// ============================================================================

interface Protocol {
  id: string;
  name: string;
  slug: string;
  logo: string;
  url: string;
  description: string | null;
  tvl: number;
  tvlChange1h: number | null;
  tvlChange24h: number;
  tvlChange7d: number;
  revenue24h: number;
  fees24h: number;
  volume24h: number | null;
  users24h: number | null;
  chains: string[];
  chainTvls: Record<string, number>;
  category: string;
  subcategory: string | null;
  auditStatus: 'audited' | 'unaudited' | 'partial';
  auditLinks: string[];
  governanceToken: string | null;
  tokenAddress: string | null;
  mcapTvl: number | null;
  twitter: string | null;
  github: string[];
  listedAt: number | null;
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const query = parseResult.data;

    // Fetch protocols from DeFiLlama
    const response = await fetch(`${DEFILLAMA_API}/protocols`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from DeFiLlama');
    }

    const data = await response.json();
    let protocols: any[] = Array.isArray(data) ? data : [];

    // Apply filters
    if (query.category) {
      protocols = protocols.filter(
        (p) => p.category?.toLowerCase() === query.category!.toLowerCase()
      );
    }

    if (query.chain) {
      protocols = protocols.filter(
        (p) => p.chains?.some((c: string) => c.toLowerCase() === query.chain!.toLowerCase())
      );
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      protocols = protocols.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.symbol?.toLowerCase().includes(searchLower)
      );
    }

    if (query.minTvl !== undefined) {
      protocols = protocols.filter((p) => (p.tvl || 0) >= query.minTvl!);
    }

    // Sort
    const sortMultiplier = query.sortOrder === 'desc' ? -1 : 1;
    protocols.sort((a, b) => {
      let aVal = 0,
        bVal = 0;
      switch (query.sortBy) {
        case 'change_1d':
          aVal = a.change_1d || 0;
          bVal = b.change_1d || 0;
          break;
        case 'change_7d':
          aVal = a.change_7d || 0;
          bVal = b.change_7d || 0;
          break;
        case 'fees':
          aVal = a.fees24h || 0;
          bVal = b.fees24h || 0;
          break;
        case 'revenue':
          aVal = a.revenue24h || 0;
          bVal = b.revenue24h || 0;
          break;
        default:
          aVal = a.tvl || 0;
          bVal = b.tvl || 0;
      }
      return (aVal - bVal) * sortMultiplier;
    });

    // Get total before pagination
    const total = protocols.length;

    // Paginate
    const offset = (query.page - 1) * query.limit;
    protocols = protocols.slice(offset, offset + query.limit);

    // Transform to response format
    const transformedProtocols: Protocol[] = protocols.map((p) => ({
      id: p.slug || p.id,
      name: p.name || '',
      slug: p.slug || '',
      logo: p.logo || '',
      url: p.url || '',
      description: p.description || null,
      tvl: p.tvl || 0,
      tvlChange1h: p.change_1h || null,
      tvlChange24h: p.change_1d || 0,
      tvlChange7d: p.change_7d || 0,
      revenue24h: p.revenue24h || 0,
      fees24h: p.fees24h || 0,
      volume24h: p.volume24h || null,
      users24h: p.users24h || null,
      chains: p.chains || [],
      chainTvls: p.chainTvls || {},
      category: p.category || 'Unknown',
      subcategory: p.subcategory || null,
      auditStatus: p.audits ? (p.audits === 2 ? 'audited' : 'partial') : 'unaudited',
      auditLinks: p.audit_links || [],
      governanceToken: p.symbol || null,
      tokenAddress: p.address || null,
      mcapTvl: p.mcap ? (p.tvl ? p.mcap / p.tvl : null) : null,
      twitter: p.twitter ? `https://twitter.com/${p.twitter}` : null,
      github: p.github || [],
      listedAt: p.listedAt || null,
    }));

    // Get unique categories for filtering
    const allCategories = [...new Set(data.map((p: any) => p.category).filter(Boolean))];
    const allChains = [...new Set(data.flatMap((p: any) => p.chains || []))];

    return NextResponse.json({
      success: true,
      data: {
        protocols: transformedProtocols,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
          hasMore: offset + query.limit < total,
        },
        filters: {
          categories: allCategories.slice(0, 30),
          chains: allChains.slice(0, 50),
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: 'defillama',
      },
    });
  } catch (error) {
    console.error('Protocols API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch protocols',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Get multiple protocols by ID
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slugs } = body as { slugs: string[] };

    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Protocol slugs array is required',
          },
        },
        { status: 400 }
      );
    }

    // Fetch detailed data for each protocol
    const protocolDetails = await Promise.all(
      slugs.slice(0, 20).map(async (slug) => {
        try {
          const response = await fetch(`${DEFILLAMA_API}/protocol/${slug}`, {
            next: { revalidate: 300 },
          });

          if (!response.ok) return null;

          const data = await response.json();
          return {
            id: data.slug || slug,
            name: data.name,
            tvl: data.tvl,
            tvlHistory: (data.tvl || []).slice(-30), // Last 30 days
            chains: data.chains || [],
            chainTvls: data.currentChainTvls || {},
            category: data.category,
            description: data.description,
            url: data.url,
          };
        } catch {
          return null;
        }
      })
    );

    const validProtocols = protocolDetails.filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        protocols: validProtocols,
        requested: slugs.length,
        found: validProtocols.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Protocols POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch protocol details',
        },
      },
      { status: 500 }
    );
  }
}
