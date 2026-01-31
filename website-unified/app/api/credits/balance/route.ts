import { NextResponse } from 'next/server';

// Mock credit balance
// In production, this would query the database

export async function GET() {
  // Mock balance for demo
  const balance = {
    available: 1500.50,
    pending: 50.00,
    spent: 350.00,
    currency: 'USD',
  };

  return NextResponse.json(balance);
}
