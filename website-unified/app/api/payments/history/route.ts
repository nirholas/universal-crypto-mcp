/**
 * Payment History API
 * 
 * GET /api/payments/history
 * Retrieves payment history with filtering and pagination
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Payment, PaymentStatus, PaymentSummary } from '@/lib/payments/types';

// ============================================
// Query Validation Schema
// ============================================

const HistoryQuerySchema = z.object({
  type: z.enum(['sent', 'received']).optional(),
  status: z.enum(['pending', 'processing', 'confirming', 'completed', 'failed', 'refunded', 'expired']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'amount', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// Mock Data Store (Replace with actual DB)
// ============================================

// In production, this would query your database
const mockPayments: Payment[] = [];

// ============================================
// GET Handler
// ============================================

export async function GET(request: NextRequest) {
  try {
    // Get user address from auth (simplified - use proper auth in production)
    const userAddress = request.headers.get('X-User-Address');
    
    if (!userAddress) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    // Validate query
    const validation = HistoryQuerySchema.safeParse(searchParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { type, status, from, to, page, limit, sortBy, sortOrder } = validation.data;

    // Filter payments (in production, this would be a DB query)
    let filteredPayments = mockPayments.filter((payment) => {
      // Filter by user
      const isUserPayment =
        payment.sender.toLowerCase() === userAddress.toLowerCase() ||
        payment.recipient.toLowerCase() === userAddress.toLowerCase();
      
      if (!isUserPayment) return false;

      // Filter by type
      if (type) {
        const isSent = payment.sender.toLowerCase() === userAddress.toLowerCase();
        if (type === 'sent' && !isSent) return false;
        if (type === 'received' && isSent) return false;
      }

      // Filter by status
      if (status && payment.status !== status) return false;

      // Filter by date range
      if (from) {
        const fromTimestamp = new Date(from).getTime() / 1000;
        if (payment.createdAt < fromTimestamp) return false;
      }
      if (to) {
        const toTimestamp = new Date(to).getTime() / 1000;
        if (payment.createdAt > toTimestamp) return false;
      }

      return true;
    });

    // Sort payments
    filteredPayments.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'amount':
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Paginate
    const total = filteredPayments.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedPayments = filteredPayments.slice(offset, offset + limit);

    // Calculate summary
    const summary = calculateSummary(filteredPayments, userAddress);

    return NextResponse.json({
      success: true,
      payments: paginatedPayments,
      total,
      page,
      limit,
      totalPages,
      summary,
    });
  } catch (error) {
    console.error('Payment history error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch payment history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================
// Summary Calculation
// ============================================

function calculateSummary(payments: Payment[], userAddress: string): PaymentSummary {
  let totalSent = 0;
  let totalReceived = 0;
  let totalFees = 0;
  let successCount = 0;

  for (const payment of payments) {
    const amount = parseFloat(payment.amount);
    const isSent = payment.sender.toLowerCase() === userAddress.toLowerCase();
    
    if (isSent) {
      totalSent += amount;
    } else {
      totalReceived += amount;
    }

    if (payment.status === 'completed') {
      successCount++;
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

  return {
    totalSent: totalSent.toFixed(2),
    totalReceived: totalReceived.toFixed(2),
    totalFees: totalFees.toFixed(2),
    paymentCount: payments.length,
    successRate: payments.length > 0 ? (successCount / payments.length) * 100 : 0,
    averageAmount: payments.length > 0 
      ? ((totalSent + totalReceived) / payments.length).toFixed(2)
      : '0.00',
    period: {
      start: thirtyDaysAgo,
      end: now,
    },
  };
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Address',
    },
  });
}
