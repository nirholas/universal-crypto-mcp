/**
 * Payment Creation API
 * 
 * POST /api/payments/create
 * Creates a new payment request
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getX402Client } from '@/lib/payments/x402Client';
import type { Address, ChainId } from '@/lib/payments/types';

// ============================================
// Request Validation Schema
// ============================================

const CreatePaymentSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Amount must be a positive number'),
  token: z.string().min(1, 'Token is required'),
  chain: z.number().int().positive('Chain ID must be a positive integer'),
  recipient: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
  metadata: z.object({
    serviceId: z.string().optional(),
    subscriptionId: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
  }),
  expiresIn: z.number().int().positive().optional(),
});

// ============================================
// POST Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request
    const validation = CreatePaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { amount, token, chain, recipient, metadata, expiresIn } = validation.data;

    // Get X402 client
    const x402Client = getX402Client();

    // Create payment request
    const paymentRequest = x402Client.createPaymentRequest({
      amount,
      token,
      chainId: chain as ChainId,
      recipient: recipient as Address,
      description: metadata.description,
      metadata: {
        serviceId: metadata.serviceId,
        subscriptionId: metadata.subscriptionId,
        description: metadata.description,
      },
      expiresIn,
    });

    // Generate QR code data (base64 encoded payment request)
    const qrCodeData = Buffer.from(
      JSON.stringify({
        id: paymentRequest.id,
        amount: paymentRequest.amount,
        token: paymentRequest.token.symbol,
        chainId: paymentRequest.chainId,
        recipient: paymentRequest.recipient,
        expiresAt: paymentRequest.expiresAt,
      })
    ).toString('base64');

    // Generate payment request string for X-PAYMENT header
    const paymentRequestString = Buffer.from(
      JSON.stringify({
        id: paymentRequest.id,
        amount: paymentRequest.amount,
        token: paymentRequest.token.symbol,
        tokenAddress: paymentRequest.token.address,
        chainId: paymentRequest.chainId,
        recipient: paymentRequest.recipient,
        description: paymentRequest.description,
        nonce: paymentRequest.nonce,
        expiresAt: paymentRequest.expiresAt,
        createdAt: paymentRequest.createdAt,
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      paymentId: paymentRequest.id,
      paymentRequest: paymentRequestString,
      expiresAt: paymentRequest.expiresAt,
      qrCode: `data:application/json;base64,${qrCodeData}`,
      details: {
        amount: paymentRequest.amount,
        token: paymentRequest.token.symbol,
        chainId: paymentRequest.chainId,
        recipient: paymentRequest.recipient,
        description: paymentRequest.description,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to create payment',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
