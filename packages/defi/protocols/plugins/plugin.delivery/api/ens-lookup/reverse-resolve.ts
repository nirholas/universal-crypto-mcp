export const config = { runtime: 'edge' };

const ETH_RPC = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';

/**
 * Get ENS name for address (reverse resolution)
 * 
 * Parameters:
 * // address: string (required) - Ethereum address
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as { address?: string };
    const { address } = body;

    if (!address) {
      return new Response(JSON.stringify({ error: 'Ethereum address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return new Response(JSON.stringify({ error: 'Invalid Ethereum address format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedAddress = address.toLowerCase();
    
    // Try reverse resolution
    const ensName = await reverseResolveAddress(normalizedAddress);
    
    if (!ensName) {
      const result = {
        success: true,
        data: {
          address: normalizedAddress,
          resolved: false,
          name: null,
          message: 'No ENS name set for this address',
        },
      };
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Verify forward resolution matches (security check)
    const forwardAddress = await forwardResolve(ensName);
    const verified = forwardAddress?.toLowerCase() === normalizedAddress;
    
    const result = {
      success: true,
      data: {
        address: normalizedAddress,
        resolved: true,
        name: ensName,
        verified,
        warning: verified ? null : 'Forward resolution does not match - possible ENS misconfiguration',
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

async function reverseResolveAddress(address: string): Promise<string | null> {
  // Try ENS public API first
  try {
    const response = await fetch(
      `https://api.ensideas.com/ens/resolve/${address}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (response.ok) {
      const data = await response.json() as { name?: string; displayName?: string };
      if (data.name || data.displayName) {
        return data.name || data.displayName || null;
      }
    }
  } catch {
    // Fall back to RPC
  }
  
  // Fall back to RPC reverse resolution
  try {
    // Construct the reverse record name: <address>.addr.reverse
    const reverseName = address.slice(2).toLowerCase() + '.addr.reverse';
    
    // Universal Resolver for reverse lookup
    const resolverAddr = '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62';
    
    const response = await fetch(ETH_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: resolverAddr,
          data: '0x691f3431' + // name(bytes32) selector
            reverseName.padEnd(64, '0'),
        }, 'latest'],
      }),
      signal: AbortSignal.timeout(10000),
    });
    
    if (response.ok) {
      const data = await response.json() as { result?: string };
      if (data.result && data.result !== '0x' && data.result.length > 66) {
        // Decode the name from the result
        // This is simplified - proper ABI decoding needed
        const nameBytes = data.result.slice(130);
        const name = decodeString(nameBytes);
        if (name && name.endsWith('.eth')) {
          return name;
        }
      }
    }
  } catch {
    // Reverse resolution failed
  }
  
  return null;
}

async function forwardResolve(name: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.ensideas.com/ens/resolve/${encodeURIComponent(name)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      const data = await response.json() as { address?: string };
      return data.address || null;
    }
  } catch {
    // Forward resolution failed
  }
  
  return null;
}

function decodeString(hex: string): string {
  try {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substr(i, 2), 16);
      if (byte === 0) break; // Null terminator
      bytes.push(byte);
    }
    return String.fromCharCode(...bytes);
  } catch {
    return '';
  }
}
