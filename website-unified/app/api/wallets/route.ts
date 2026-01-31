/**
 * Wallets API Route
 * GET /api/wallets - Get wallet list for current user
 * POST /api/wallets - Add a new wallet to track
 * DELETE /api/wallets - Remove a wallet
 * 
 * Integrates with @universal-crypto-mcp/core for wallet utilities
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// ============================================================================
// Schemas
// ============================================================================

const AddWalletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
  label: z.string().max(50).optional(),
  chains: z.array(z.string()).optional().default(['ethereum']),
  type: z.enum(['eoa', 'contract', 'multisig', 'safe']).optional().default('eoa'),
});

const DeleteWalletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
});

// ============================================================================
// Types
// ============================================================================

interface TrackedWallet {
  address: string;
  label: string | null;
  type: 'eoa' | 'contract' | 'multisig' | 'safe';
  chains: string[];
  addedAt: string;
  lastActivity: string | null;
  totalValueUsd: number;
  isContract: boolean;
  ensName: string | null;
}

// In-memory store (in production, use a database)
const walletStore = new Map<string, TrackedWallet>();

// ============================================================================
// Utility Functions
// ============================================================================

function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

async function resolveENS(address: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.ensideas.com/ens/resolve/${address}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.name || null;
  } catch {
    return null;
  }
}

async function checkIfContract(address: string, chain: string): Promise<boolean> {
  const RPC_ENDPOINTS: Record<string, string> = {
    ethereum: 'https://eth.llamarpc.com',
    base: 'https://mainnet.base.org',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
    polygon: 'https://polygon-rpc.com',
  };

  try {
    const rpcUrl = RPC_ENDPOINTS[chain] || RPC_ENDPOINTS.ethereum;
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getCode',
        params: [address, 'latest'],
      }),
    });

    const data = await response.json();
    return data.result && data.result !== '0x';
  } catch {
    return false;
  }
}

async function getWalletValue(address: string, chains: string[]): Promise<number> {
  // Fetch total value from DeBank or similar API
  try {
    const response = await fetch(
      `https://pro-openapi.debank.com/v1/user/total_balance?id=${address}`,
      { 
        headers: {
          'AccessKey': process.env.DEBANK_API_KEY || '',
        },
        next: { revalidate: 300 }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.total_usd_value || 0;
    }
  } catch (e) {
    // DeBank API may not be available without API key
  }

  return 0;
}

// ============================================================================
// GET Handler - List tracked wallets
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (would come from auth middleware)
    const userId = request.headers.get('x-user-id') || 'anonymous';

    // In production, filter by userId
    const wallets = Array.from(walletStore.values());

    // Enrich with live data
    const enrichedWallets = await Promise.all(
      wallets.map(async (wallet) => {
        const [ensName, totalValueUsd] = await Promise.all([
          wallet.ensName ? Promise.resolve(wallet.ensName) : resolveENS(wallet.address),
          getWalletValue(wallet.address, wallet.chains),
        ]);

        return {
          ...wallet,
          ensName,
          totalValueUsd,
          displayName: wallet.label || ensName || truncateAddress(wallet.address),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        wallets: enrichedWallets,
        total: enrichedWallets.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Wallets GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch wallets',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Add a wallet
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parseResult = AddWalletSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid wallet data',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { address, label, chains, type } = parseResult.data;
    const normalizedAddress = address.toLowerCase();

    // Check if already exists
    if (walletStore.has(normalizedAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WALLET_EXISTS',
            message: 'Wallet is already being tracked',
          },
        },
        { status: 409 }
      );
    }

    // Verify wallet and get metadata
    const [isContract, ensName] = await Promise.all([
      checkIfContract(normalizedAddress, chains[0]),
      resolveENS(normalizedAddress),
    ]);

    const wallet: TrackedWallet = {
      address: normalizedAddress,
      label: label || null,
      type: isContract ? (type === 'safe' ? 'safe' : 'contract') : type,
      chains,
      addedAt: new Date().toISOString(),
      lastActivity: null,
      totalValueUsd: 0,
      isContract,
      ensName,
    };

    walletStore.set(normalizedAddress, wallet);

    // Get initial value
    wallet.totalValueUsd = await getWalletValue(normalizedAddress, chains);

    return NextResponse.json({
      success: true,
      data: {
        wallet: {
          ...wallet,
          displayName: label || ensName || truncateAddress(normalizedAddress),
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Wallets POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to add wallet',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT Handler - Update wallet
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, label, chains } = body;

    if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid wallet address',
          },
        },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();
    const existing = walletStore.get(normalizedAddress);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Wallet not found',
          },
        },
        { status: 404 }
      );
    }

    // Update fields
    const updated: TrackedWallet = {
      ...existing,
      label: label !== undefined ? label : existing.label,
      chains: chains || existing.chains,
    };

    walletStore.set(normalizedAddress, updated);

    return NextResponse.json({
      success: true,
      data: {
        wallet: {
          ...updated,
          displayName: updated.label || updated.ensName || truncateAddress(normalizedAddress),
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Wallets PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update wallet',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE Handler - Remove wallet
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parseResult = DeleteWalletSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const normalizedAddress = parseResult.data.address.toLowerCase();

    if (!walletStore.has(normalizedAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Wallet not found',
          },
        },
        { status: 404 }
      );
    }

    walletStore.delete(normalizedAddress);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Wallet removed successfully',
        address: normalizedAddress,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Wallets DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete wallet',
        },
      },
      { status: 500 }
    );
  }
}
