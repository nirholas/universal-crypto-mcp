/**
 * Watchlist Detail API Route
 * 
 * Update and delete individual watchlists
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory store reference (shared with main route in production via database)
const watchlists: Map<string, any> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const watchlist = watchlists.get(id);

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Watchlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Get watchlist API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, tokens } = body as { name?: string; tokens?: string[] };

    const watchlist = watchlists.get(id);

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Watchlist not found' },
        { status: 404 }
      );
    }

    const updated = {
      ...watchlist,
      ...(name !== undefined && { name }),
      ...(tokens !== undefined && { tokens }),
      updatedAt: new Date().toISOString(),
    };

    watchlists.set(id, updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update watchlist API error:', error);
    return NextResponse.json(
      { error: 'Failed to update watchlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!watchlists.has(id)) {
      return NextResponse.json(
        { error: 'Watchlist not found' },
        { status: 404 }
      );
    }

    watchlists.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete watchlist API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete watchlist' },
      { status: 500 }
    );
  }
}
