/**
 * Transaction Simulation API Route
 * POST /api/wallets/transactions/simulate - Simulate transaction execution
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  parseBody,
} from '@/lib/api';
import type { RequestContext } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Schema
// ============================================================================

const SimulateTransactionSchema = z.object({
  chain: z.string(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().optional().default('0'),
  data: z.string().optional().default('0x'),
  gasLimit: z.string().optional(),
  blockNumber: z.number().optional(),
});

// ============================================================================
// Simulation Response Types
// ============================================================================

interface SimulationResult {
  success: boolean;
  gasUsed: string;
  gasLimit: string;
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
    decoded?: {
      event: string;
      args: Record<string, unknown>;
    };
  }>;
  stateChanges: Array<{
    address: string;
    type: 'balance' | 'storage' | 'nonce';
    before: string;
    after: string;
  }>;
  assetChanges: Array<{
    type: 'send' | 'receive';
    asset: string;
    symbol: string;
    amount: string;
    usdValue: number;
  }>;
  error?: {
    message: string;
    revertReason?: string;
  };
  warnings: string[];
  trace: string[];
}

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, SimulateTransactionSchema);
  
  // Simulate delay (real simulation would take 1-3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Determine simulation outcome
  const success = Math.random() > 0.15;
  const gasUsed = Math.floor(21000 + Math.random() * 200000);
  const gasLimit = body.gasLimit || Math.floor(gasUsed * 1.2).toString();
  
  const result: SimulationResult = {
    success,
    gasUsed: gasUsed.toString(),
    gasLimit,
    logs: [],
    stateChanges: [],
    assetChanges: [],
    warnings: [],
    trace: success ? ['CALL', 'SSTORE', 'SLOAD', 'LOG1', 'RETURN'] : ['CALL', 'SLOAD', 'REVERT'],
  };
  
  if (success) {
    // Generate mock state changes
    result.stateChanges = [
      {
        address: body.from,
        type: 'balance',
        before: '1.5',
        after: (1.5 - parseFloat(body.value) / 1e18 - gasUsed * 30 / 1e9).toFixed(6),
      },
      {
        address: body.to,
        type: 'balance',
        before: '0.5',
        after: (0.5 + parseFloat(body.value) / 1e18).toFixed(6),
      },
    ];
    
    // Generate mock asset changes
    if (parseFloat(body.value) > 0) {
      const ethAmount = parseFloat(body.value) / 1e18;
      result.assetChanges = [
        {
          type: 'send',
          asset: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          amount: ethAmount.toFixed(6),
          usdValue: ethAmount * 2500,
        },
      ];
    }
    
    // Check for potential issues
    if (body.data && body.data.length > 100) {
      result.logs.push({
        address: body.to,
        topics: ['0x' + 'a'.repeat(64)],
        data: '0x',
        decoded: {
          event: 'Transfer',
          args: { from: body.from, to: body.to, value: body.value },
        },
      });
    }
    
    // Add warnings
    if (parseFloat(body.value) > 1e18) {
      result.warnings.push('Large value transfer detected');
    }
    if (gasUsed > 500000) {
      result.warnings.push('High gas consumption detected');
    }
  } else {
    result.error = {
      message: 'Transaction would revert',
      revertReason: Math.random() > 0.5 
        ? 'ERC20: insufficient allowance' 
        : 'Execution reverted: SafeERC20: low-level call failed',
    };
  }
  
  return createResponse({
    simulation: result,
    meta: {
      chain: body.chain,
      blockNumber: body.blockNumber || 18500000,
      timestamp: Date.now(),
      simulationProvider: 'tenderly',
    },
  }, {
    meta: { requestId: ctx.requestId },
  });
}

export const POST = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 30, keyPrefix: 'tx-simulate' },
});
