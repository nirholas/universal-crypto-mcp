/**
 * Token Approvals API Route
 * /api/wallets/tokens/approvals - Manage token approvals
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  parseQuery,
  parseBody,
  setCacheHeaders,
  BadRequestError,
} from '@/lib/api';
import type { RequestContext } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Schemas
// ============================================================================

const ApprovalsQuerySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chain: z.string().optional().default('ethereum'),
});

const RevokeApprovalSchema = z.object({
  chain: z.string(),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  spenderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

// ============================================================================
// Types
// ============================================================================

interface TokenApproval {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  spenderAddress: string;
  spenderName: string;
  allowance: string;
  allowanceFormatted: string;
  isUnlimited: boolean;
  valueAtRisk: number;
  lastUpdated: string;
  txHash: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_APPROVALS: TokenApproval[] = [
  {
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    tokenSymbol: 'USDC',
    tokenName: 'USD Coin',
    spenderAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    spenderName: 'Uniswap V2 Router',
    allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    allowanceFormatted: 'Unlimited',
    isUnlimited: true,
    valueAtRisk: 5000,
    lastUpdated: '2025-01-15T10:00:00Z',
    txHash: '0xabc123...',
    riskLevel: 'medium',
  },
  {
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    tokenSymbol: 'USDT',
    tokenName: 'Tether',
    spenderAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    spenderName: 'Uniswap V3 Router',
    allowance: '1000000000',
    allowanceFormatted: '1,000',
    isUnlimited: false,
    valueAtRisk: 1000,
    lastUpdated: '2025-01-20T14:30:00Z',
    txHash: '0xdef456...',
    riskLevel: 'low',
  },
  {
    tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    tokenSymbol: 'LINK',
    tokenName: 'Chainlink',
    spenderAddress: '0x881D40237659C251811CEC9c364ef91dC08D300C',
    spenderName: 'Unknown Contract',
    allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    allowanceFormatted: 'Unlimited',
    isUnlimited: true,
    valueAtRisk: 3000,
    lastUpdated: '2024-11-05T08:00:00Z',
    txHash: '0xghi789...',
    riskLevel: 'high',
  },
  {
    tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    tokenSymbol: 'UNI',
    tokenName: 'Uniswap',
    spenderAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    spenderName: 'Uniswap Universal Router',
    allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    allowanceFormatted: 'Unlimited',
    isUnlimited: true,
    valueAtRisk: 800,
    lastUpdated: '2025-01-25T16:00:00Z',
    txHash: '0xjkl012...',
    riskLevel: 'low',
  },
];

// ============================================================================
// GET - List Approvals
// ============================================================================

async function listHandler(request: NextRequest) {
  const query = parseQuery(request, ApprovalsQuerySchema);
  
  // Calculate summary
  const totalValueAtRisk = MOCK_APPROVALS.reduce((sum, a) => sum + a.valueAtRisk, 0);
  const unlimitedCount = MOCK_APPROVALS.filter((a) => a.isUnlimited).length;
  const highRiskCount = MOCK_APPROVALS.filter((a) => a.riskLevel === 'high').length;
  
  const response = createResponse({
    address: query.address,
    chain: query.chain,
    approvals: MOCK_APPROVALS,
    summary: {
      totalApprovals: MOCK_APPROVALS.length,
      unlimitedApprovals: unlimitedCount,
      highRiskApprovals: highRiskCount,
      totalValueAtRisk: totalValueAtRisk,
    },
    recommendations: [
      highRiskCount > 0 ? 'Review and revoke approvals for unknown contracts' : null,
      unlimitedCount > 0 ? 'Consider setting limited allowances for better security' : null,
    ].filter(Boolean),
  });
  
  // Cache for 5 minutes
  setCacheHeaders(response, { maxAge: 300, staleWhileRevalidate: 600, private: true });
  
  return response;
}

// ============================================================================
// POST - Revoke Approval (build transaction)
// ============================================================================

async function revokeHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, RevokeApprovalSchema);
  
  // Build revoke transaction (set allowance to 0)
  // ERC20 approve(spender, 0) function selector: 0x095ea7b3
  const data = `0x095ea7b3${body.spenderAddress.slice(2).padStart(64, '0')}${'0'.repeat(64)}`;
  
  return createResponse({
    transaction: {
      to: body.tokenAddress,
      data,
      value: '0',
      chainId: body.chain === 'ethereum' ? 1 : body.chain === 'polygon' ? 137 : 42161,
      gasLimit: '50000',
    },
    message: 'Revoke transaction prepared. Sign and submit to revoke approval.',
  }, {
    meta: { requestId: ctx.requestId },
  });
}

export const GET = withHandler(listHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});

export const POST = withHandler(revokeHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 20 },
});
