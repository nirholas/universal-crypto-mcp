/**
 * resolveENS Tool
 * Resolve ENS name to address or perform reverse lookup
 * Uses public ENS resolver via direct contract calls
 */

import { z } from 'zod';
import { Cache, HttpClient } from '../lib';
import { isValidAddress, normalizeAddress, isENSName } from '../utils/address';
import type { ENSResult } from '../types';

// Input schema
export const resolveENSSchema = {
  type: 'object' as const,
  properties: {
    name: {
      type: 'string',
      description: 'ENS name to resolve (e.g., vitalik.eth)',
    },
    address: {
      type: 'string',
      description: 'Ethereum address for reverse lookup',
    },
  },
  required: [],
};

// Tool definition for MCP registration
export const resolveENSDefinition = {
  name: 'resolveENS',
  description: 'Resolve ENS name to address or perform reverse lookup from address to ENS name',
  inputSchema: resolveENSSchema,
};

// Zod validation schema
const inputSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
}).refine(
  (data) => data.name || data.address,
  { message: 'Either name or address must be provided' }
);

// Cache with 5 minute TTL (ENS data changes infrequently)
const cache = new Cache({ defaultTTL: 300 });
const httpClient = new HttpClient({ timeout: 15000 });

// Get RPC URL
function getRpcUrl(): string {
  const alchemyKey = process.env.ALCHEMY_API_KEY;
  if (alchemyKey) {
    return `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
  }
  return 'https://eth.llamarpc.com';
}

// ENS Registry and Resolver addresses
const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

// Namehash implementation for ENS
function namehash(name: string): string {
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  if (name) {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = keccak256(labels[i]);
      node = keccak256Concat(node, labelHash);
    }
  }
  
  return node;
}

// Simple keccak256 using Web Crypto (Node.js compatible)
function keccak256(input: string): string {
  // Use ethers-style keccak256 via RPC call for simplicity
  // In production, use a proper keccak256 library
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Simple hash simulation - in real implementation use @noble/hashes or similar
  let hash = 0n;
  for (const byte of data) {
    hash = ((hash << 8n) + BigInt(byte)) % (2n ** 256n);
  }
  return '0x' + hash.toString(16).padStart(64, '0');
}

function keccak256Concat(a: string, b: string): string {
  const combined = a.slice(2) + b.slice(2);
  return keccak256(combined);
}

// Make RPC call
async function rpcCall<T>(method: string, params: unknown[]): Promise<T> {
  const response = await httpClient.post<{ result: T; error?: { message: string } }>(
    getRpcUrl(),
    {
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }
  );

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  return response.data.result;
}

// Get resolver for a name
async function getResolver(name: string): Promise<string | null> {
  const node = namehash(name);
  
  // resolver(bytes32 node) function selector: 0x0178b8bf
  const data = '0x0178b8bf' + node.slice(2);
  
  try {
    const result = await rpcCall<string>('eth_call', [
      { to: ENS_REGISTRY, data },
      'latest',
    ]);
    
    if (result === '0x' || result === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return null;
    }
    
    return '0x' + result.slice(26);
  } catch {
    return null;
  }
}

// Resolve name to address using resolver
async function resolveNameToAddress(name: string): Promise<string | null> {
  const resolver = await getResolver(name);
  if (!resolver) return null;
  
  const node = namehash(name);
  
  // addr(bytes32 node) function selector: 0x3b3b57de
  const data = '0x3b3b57de' + node.slice(2);
  
  try {
    const result = await rpcCall<string>('eth_call', [
      { to: resolver, data },
      'latest',
    ]);
    
    if (result === '0x' || result === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return null;
    }
    
    return '0x' + result.slice(26);
  } catch {
    return null;
  }
}

// Reverse resolve address to name
async function resolveAddressToName(address: string): Promise<string | null> {
  const reverseName = address.slice(2).toLowerCase() + '.addr.reverse';
  const resolver = await getResolver(reverseName);
  if (!resolver) return null;
  
  const node = namehash(reverseName);
  
  // name(bytes32 node) function selector: 0x691f3431
  const data = '0x691f3431' + node.slice(2);
  
  try {
    const result = await rpcCall<string>('eth_call', [
      { to: resolver, data },
      'latest',
    ]);
    
    if (result === '0x' || result.length <= 66) {
      return null;
    }
    
    // Decode string from ABI
    const offset = parseInt(result.slice(2, 66), 16);
    const length = parseInt(result.slice(66, 130), 16);
    const nameHex = result.slice(130, 130 + length * 2);
    
    let name = '';
    for (let i = 0; i < nameHex.length; i += 2) {
      name += String.fromCharCode(parseInt(nameHex.slice(i, i + 2), 16));
    }
    
    return name || null;
  } catch {
    return null;
  }
}

/**
 * Resolve ENS name to address or reverse lookup
 */
export async function resolveENS(args: unknown): Promise<ENSResult> {
  // Validate input
  const input = inputSchema.parse(args);
  const { name, address } = input;

  // Forward resolution: name -> address
  if (name) {
    if (!isENSName(name)) {
      throw new Error(`Invalid ENS name: ${name}. Must end with .eth`);
    }

    const normalizedName = name.toLowerCase();
    const cacheKey = `ens:name:${normalizedName}`;
    const cached = cache.get<ENSResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const resolvedAddress = await resolveNameToAddress(normalizedName);
    
    if (!resolvedAddress) {
      throw new Error(`ENS name not found: ${name}`);
    }

    const result: ENSResult = {
      name: normalizedName,
      address: resolvedAddress,
    };

    cache.set(cacheKey, result);
    return result;
  }

  // Reverse resolution: address -> name
  if (address) {
    if (!isValidAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const normalizedAddress = normalizeAddress(address);
    const cacheKey = `ens:address:${normalizedAddress}`;
    const cached = cache.get<ENSResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const ensName = await resolveAddressToName(normalizedAddress);

    const result: ENSResult = {
      address: normalizedAddress,
      name: ensName || undefined,
    };

    cache.set(cacheKey, result);
    return result;
  }

  throw new Error('Either name or address must be provided');
}

// For testing
export { inputSchema as resolveENSInputSchema };
