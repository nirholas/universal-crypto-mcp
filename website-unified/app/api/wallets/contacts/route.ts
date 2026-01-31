/**
 * Wallet Contacts API Route
 * /api/wallets/contacts - Address book management
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
  paginate,
  NotFoundError,
} from '@/lib/api';
import type { RequestContext, Contact } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Schemas
// ============================================================================

const ContactsQuerySchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const CreateContactSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chain: z.string().optional(),
  ens: z.string().optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

const ValidateAddressSchema = z.object({
  address: z.string(),
  chain: z.string().optional().default('ethereum'),
});

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact-001',
    name: 'Main Wallet',
    address: '0x1234567890123456789012345678901234567890',
    chain: 'ethereum',
    ens: 'mywallet.eth',
    notes: 'My primary hardware wallet',
    tags: ['personal', 'hardware'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: 'contact-002',
    name: 'Trading Wallet',
    address: '0x2345678901234567890123456789012345678901',
    chain: 'arbitrum',
    notes: 'Hot wallet for trading',
    tags: ['trading', 'hot'],
    createdAt: '2024-08-20T08:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'contact-003',
    name: 'DeFi Wallet',
    address: '0x3456789012345678901234567890123456789012',
    chain: 'ethereum',
    ens: 'defi-degen.eth',
    notes: 'DeFi farming activities',
    tags: ['defi', 'farming'],
    createdAt: '2024-10-01T12:00:00Z',
    updatedAt: '2025-01-28T16:00:00Z',
  },
  {
    id: 'contact-004',
    name: 'Exchange Deposit',
    address: '0x4567890123456789012345678901234567890123',
    notes: 'Binance deposit address',
    tags: ['exchange', 'binance'],
    createdAt: '2024-12-10T14:00:00Z',
    updatedAt: '2024-12-10T14:00:00Z',
  },
  {
    id: 'contact-005',
    name: 'Friend - Alice',
    address: '0x5678901234567890123456789012345678901234',
    ens: 'alice.eth',
    notes: 'Crypto friend',
    tags: ['friend'],
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z',
  },
];

// ============================================================================
// GET - List Contacts
// ============================================================================

async function listHandler(request: NextRequest, ctx: RequestContext) {
  const query = parseQuery(request, ContactsQuerySchema);
  
  let contacts = [...MOCK_CONTACTS];
  
  // Filter by search
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    contacts = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.address.toLowerCase().includes(searchLower) ||
        c.ens?.toLowerCase().includes(searchLower) ||
        c.notes?.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by tag
  if (query.tag) {
    contacts = contacts.filter((c) => c.tags.includes(query.tag!));
  }
  
  // Sort by name
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  
  const { items, meta } = paginate(contacts, query.page, query.limit);
  
  // Get all unique tags
  const allTags = [...new Set(MOCK_CONTACTS.flatMap((c) => c.tags))];
  
  return createResponse({
    contacts: items,
    tags: allTags,
  }, { meta });
}

// ============================================================================
// POST - Create Contact
// ============================================================================

async function createHandler(request: NextRequest, ctx: RequestContext) {
  const body = await parseBody(request, CreateContactSchema);
  
  // Check if address already exists
  const existing = MOCK_CONTACTS.find(
    (c) => c.address.toLowerCase() === body.address.toLowerCase()
  );
  if (existing) {
    return createResponse({
      error: 'Contact with this address already exists',
      existingContact: existing,
    }, { status: 409 });
  }
  
  const contact: Contact = {
    id: `contact-${Date.now()}`,
    name: body.name,
    address: body.address,
    chain: body.chain,
    ens: body.ens,
    notes: body.notes,
    tags: body.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return createResponse({
    contact,
    message: 'Contact created successfully.',
  }, {
    status: 201,
    meta: { requestId: ctx.requestId },
  });
}

export const GET = withHandler(listHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});

export const POST = withHandler(createHandler, {
  rateLimit: { windowMs: 60000, maxRequests: 30 },
});
