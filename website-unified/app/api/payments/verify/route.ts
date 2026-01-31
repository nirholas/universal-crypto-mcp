/**
 * Payment Verification API
 * 
 * POST /api/payments/verify
 * Verifies a payment from X-PAYMENT header
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getX402Client } from '@/lib/payments/x402Client';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// Request Validation Schema
// ============================================

const VerifyPaymentSchema = z.object({
  paymentId: z.string().uuid('Invalid payment ID format'),
});

// ============================================
// POST Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get X-PAYMENT header
    const paymentHeader = request.headers.get('X-PAYMENT');
    
    if (!paymentHeader) {
      return NextResponse.json(
        {
          error: 'Missing X-PAYMENT header',
          verified: false,
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate request
    const validation = VerifyPaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors,
          verified: false,
        },
        { status: 400 }
      );
    }

    const { paymentId } = validation.data;

    // Get X402 client
    const x402Client = getX402Client();

    // Verify payment header
    const verification = await x402Client.verifyPayment(paymentHeader);

    // Check if payment ID matches
    if (verification.paymentId !== paymentId) {
      return NextResponse.json(
        {
          error: 'Payment ID mismatch',
          verified: false,
        },
        { status: 400 }
      );
    }

    // Check if payment is valid
    if (!verification.isValid) {
      return NextResponse.json(
        {
          error: 'Payment verification failed',
          verified: false,
          reason: verification.onChainConfirmed ? 'Signature invalid' : 'Not confirmed on-chain',
        },
        { status: 402 }
      );
    }

    // Generate access token for verified payment
    const accessToken = generateAccessToken(paymentId, verification.sender);

    return NextResponse.json({
      verified: true,
      paymentDetails: {
        paymentId: verification.paymentId,
        amount: verification.amount,
        token: verification.token,
        sender: verification.sender,
        recipient: verification.recipient,
        timestamp: verification.timestamp,
        expiresAt: verification.expiresAt,
        onChainConfirmed: verification.onChainConfirmed,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to verify payment',
        message: error instanceof Error ? error.message : 'Unknown error',
        verified: false,
      },
      { status: 500 }
    );
  }
}

// ============================================
// Access Token Generation
// ============================================

function generateAccessToken(paymentId: string, sender: string): string {
  // In production, use proper JWT with signing
  const payload = {
    paymentId,
    sender,
    issuedAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    jti: uuidv4(),
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// ============================================
// OPTIONS Handler (CORS)
// ============================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-PAYMENT',
    },
  });
}
