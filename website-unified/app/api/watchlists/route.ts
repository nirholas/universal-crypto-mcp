/**
 * Watchlists API Route
 * 
 * CRUD operations for user watchlists
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// In-memory store for demo (use database in production)
const watchlists: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  try {
    const allWatchlists = Array.from(watchlists.values());
    return NextResponse.json(allWatchlists);
  } catch (error) {
    console.error('Watchlists API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, tokens } = body as { name: string; tokens: string[] };

    if (!name) {
      return NextResponse.json(
        { error: 'Watchlist name required' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const watchlist = {
      id,
      name,
      tokens: tokens || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    watchlists.set(id, watchlist);

    return NextResponse.json(watchlist, { status: 201 });
  } catch (error) {
    console.error('Create watchlist API error:', error);
    return NextResponse.json(
      { error: 'Failed to create watchlist' },
      { status: 500 }
    );
  }
}
