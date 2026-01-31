export const config = { runtime: 'edge' };

// ENS Public Resolver contract address
const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const ETH_RPC = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';

// ENS name hash function
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

// Simple keccak256 using Web Crypto API
async function keccak256Async(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  // Note: Web Crypto doesn't support keccak256, so we use a workaround via RPC
  return data; // Placeholder - actual implementation uses RPC call
}

// Simplified hash for ENS - in production use proper keccak256
function keccak256(input: string): string {
  // This is a simplified version - the actual namehash is computed on-chain
  return input;
}

function keccak256Concat(a: string, b: string): string {
  return a + b.slice(2);
}

/**
 * Resolve ENS name to address
 * 
 * Parameters:
 * // name: string (required) - ENS name (e.g., vitalik.eth)
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as { name?: string };
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'ENS name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Normalize the name
    const normalizedName = name.toLowerCase().trim();
    
    // Try ENS resolution via RPC call to Universal Resolver
    const address = await resolveENSName(normalizedName);
    
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      const result = {
        success: true,
        data: {
          name: normalizedName,
          resolved: false,
          address: null,
          error: 'ENS name not found or not registered',
        },
      };
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Optionally fetch additional records
    const records = await fetchENSRecords(normalizedName);
    
    const result = {
      success: true,
      data: {
        name: normalizedName,
        resolved: true,
        address,
        records: {
          avatar: records.avatar || null,
          url: records.url || null,
          twitter: records.twitter || null,
          github: records.github || null,
          email: records.email || null,
        },
        resolvedAt: new Date().toISOString(),
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function resolveENSName(name: string): Promise<string | null> {
  // Use eth_call to the Universal Resolver for ENS resolution
  // Alternatively, use a public ENS API
  try {
    // Try ENS public API first (unofficial but reliable)
    const response = await fetch(
      `https://api.ensideas.com/ens/resolve/${encodeURIComponent(name)}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (response.ok) {
      const data = await response.json() as { address?: string };
      if (data.address) return data.address;
    }
  } catch {
    // Fall back to RPC
  }
  
  // Fall back to RPC call
  try {
    // Universal Resolver contract call
    const resolverAddr = '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62';
    const resolveFunc = '0x9061b923'; // resolve(bytes,bytes)
    
    // Simplified - in production, properly encode the ENS name
    const response = await fetch(ETH_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: resolverAddr,
          data: resolveFunc + encodeName(name) + encodeFunction('addr(bytes32)'),
        }, 'latest'],
      }),
      signal: AbortSignal.timeout(10000),
    });
    
    if (response.ok) {
      const data = await response.json() as { result?: string };
      if (data.result && data.result !== '0x') {
        // Extract address from response
        const addr = '0x' + data.result.slice(26, 66);
        if (addr !== '0x0000000000000000000000000000000000000000') {
          return addr;
        }
      }
    }
  } catch {
    // Resolution failed
  }
  
  return null;
}

async function fetchENSRecords(name: string): Promise<Record<string, string>> {
  const records: Record<string, string> = {};
  
  try {
    // Try ENS metadata API
    const response = await fetch(
      `https://metadata.ens.domains/mainnet/avatar/${encodeURIComponent(name)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      records.avatar = response.url; // Avatar URL
    }
  } catch {
    // Records are optional
  }
  
  return records;
}

function encodeName(name: string): string {
  // DNS-style encoding for ENS names
  const labels = name.split('.');
  let encoded = '';
  
  for (const label of labels) {
    const len = label.length.toString(16).padStart(2, '0');
    const hex = Buffer.from(label).toString('hex');
    encoded += len + hex;
  }
  
  encoded += '00'; // Null terminator
  return encoded;
}

function encodeFunction(sig: string): string {
  // Function selector for addr(bytes32)
  return '3b3b57de';
}
