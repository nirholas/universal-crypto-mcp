/**
 * Refund Processing API
 * 
 * POST /api/payments/refund
 * Processes refund requests for payments
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { RefundDetails, RefundStatus, Address } from '@/lib/payments/types';

// ============================================
// Request Validation Schema
// ============================================

const RefundRequestSchema = z.object({
  paymentId: z.string().uuid('Invalid payment ID format'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
  amount: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Amount must be a positive number if provided'),
});

// ============================================
// Mock Data Store (Replace with actual DB)
// ============================================

const pendingRefunds: Map<string, RefundDetails> = new Map();

// ============================================
// POST Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get user address from auth
    const userAddress = request.headers.get('X-User-Address') as Address | null;
    
    if (!userAddress) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate request
    const validation = RefundRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { paymentId, reason, amount } = validation.data;

    // In production, verify:
    // 1. Payment exists
    // 2. User is the recipient (for refund requests) or service owner
    // 3. Payment is completed
    // 4. No existing refund for this payment
    // 5. Refund amount <= original amount

    // Check for existing refund
    const existingRefund = Array.from(pendingRefunds.values()).find(
      (r) => r.paymentId === paymentId
    );
    
    if (existingRefund) {
      return NextResponse.json(
        {
          error: 'Refund already requested',
          existingRefundId: existingRefund.id,
          status: existingRefund.status,
        },
        { status: 409 }
      );
    }

    // Create refund record
    const refundId = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    const refund: RefundDetails = {
      id: refundId,
      paymentId,
      amount: amount || '0', // Full refund if not specified (would be set from original payment)
      amountUsd: amount || '0',
      reason,
      status: 'pending',
      requestedAt: now,
    };

    // Store refund request
    pendingRefunds.set(refundId, refund);

    // In production, this would:
    // 1. Queue the refund for processing
    // 2. Notify the service owner
    // 3. Execute the on-chain refund transaction

    return NextResponse.json({
      success: true,
      refundId,
      status: 'pending' as RefundStatus,
      message: 'Refund request submitted successfully',
      estimatedProcessingTime: '1-3 business days',
    });
  } catch (error) {
    console.error('Refund processing error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process refund',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET Handler - Check refund status
// ============================================

export async function GET(request: NextRequest) {
  try {
    const refundId = request.nextUrl.searchParams.get('refundId');
    
    if (!refundId) {
      return NextResponse.json(
        { error: 'Refund ID required' },
        { status: 400 }
      );
    }

    const refund = pendingRefunds.get(refundId);
    
    if (!refund) {
      return NextResponse.json(
        { error: 'Refund not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error('Refund status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to get refund status',
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
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Address',
    },
  });
}
