/**
 * Payment Status API
 * 
 * GET /api/payments/[paymentId]/status
 * Gets the current status of a payment
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getX402Client } from '@/lib/payments/x402Client';
import { getExplorerTxUrl } from '@/lib/payments/config';
import type { ChainId } from '@/lib/payments/types';

// ============================================
// GET Handler
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params;
    
    // Validate payment ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(paymentId)) {
      return NextResponse.json(
        { error: 'Invalid payment ID format' },
        { status: 400 }
      );
    }

    // Get chain ID from query if provided
    const chainIdParam = request.nextUrl.searchParams.get('chainId');
    const chainId = chainIdParam ? parseInt(chainIdParam, 10) as ChainId : undefined;

    // Get X402 client
    const x402Client = getX402Client();

    // Check for pending payment first
    const pendingPayment = x402Client.getPendingPayment(paymentId);
    
    if (pendingPayment) {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = now > pendingPayment.expiresAt;
      
      return NextResponse.json({
        success: true,
        paymentId,
        status: isExpired ? 'expired' : 'pending',
        details: {
          amount: pendingPayment.amount,
          token: pendingPayment.token.symbol,
          chainId: pendingPayment.chainId,
          recipient: pendingPayment.recipient,
          expiresAt: pendingPayment.expiresAt,
          expiresIn: isExpired ? 0 : pendingPayment.expiresAt - now,
          createdAt: pendingPayment.createdAt,
        },
      });
    }

    // Check on-chain status
    const status = await x402Client.getStatus(paymentId, chainId);

    return NextResponse.json({
      success: true,
      paymentId,
      status,
      chainId,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to get payment status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================
// OPTIONS Handler (CORS)
// ============================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
