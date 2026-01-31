export const config = { runtime: 'edge' };

// OFAC and other sanctions lists APIs
const CHAINALYSIS_API = 'https://public.chainalysis.com/api/v1/address';
const OFAC_SDN_LIST_URL = 'https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml';

// Known sanctioned addresses from OFAC (partial list for offline checking)
const KNOWN_SANCTIONED = new Set([
  '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c', // Tornado Cash: Deposit
  '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b', // Tornado Cash: Router
  '0x722122df12d4e14e13ac3b6895a86e84145b6967', // Tornado Cash: Proxy
  '0xdd4c48c0b24039969fc16d1cdf626eab821d3384', // Tornado Cash: 0.1 ETH
  '0xd4b88df4d29f5cedd6857912842cff3b20c8cfa3', // Tornado Cash: 1 ETH
  '0xfd8610d20aa15b7b2e3be39b396a1bc3516c7144', // Tornado Cash: 10 ETH
  '0x07687e702b410fa43f4cb4af7fa097918ffd2730', // Tornado Cash: 100 ETH
]);

/**
 * Check if address is sanctioned
 * 
 * Parameters:
 * // address: string (required) - Blockchain address to check
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
      return new Response(JSON.stringify({ error: 'Address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedAddress = address.toLowerCase();
    
    // Check against known sanctioned addresses first
    const isKnownSanctioned = KNOWN_SANCTIONED.has(normalizedAddress);
    
    // Try Chainalysis API if available
    let chainalysisResult: { isSanctioned: boolean; source?: string } | null = null;
    const chainalysisKey = process.env.CHAINALYSIS_API_KEY;
    
    if (chainalysisKey) {
      try {
        const response = await fetch(`${CHAINALYSIS_API}/${address}`, {
          headers: { 
            'X-API-Key': chainalysisKey,
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
          const data = await response.json() as { identifications?: Array<{ category: string; name: string }> };
          const sanctioned = data.identifications?.some(
            (id) => id.category === 'sanctions'
          );
          chainalysisResult = {
            isSanctioned: sanctioned || false,
            source: 'chainalysis',
          };
        }
      } catch {
        // Fall back to local list
      }
    }
    
    const isSanctioned = isKnownSanctioned || chainalysisResult?.isSanctioned || false;
    
    const result = {
      success: true,
      data: {
        address: normalizedAddress,
        isSanctioned,
        riskLevel: isSanctioned ? 'critical' : 'low',
        sources: [
          isKnownSanctioned ? 'ofac-sdn-list' : null,
          chainalysisResult?.source || null,
        ].filter(Boolean),
        checkedAt: new Date().toISOString(),
        details: isSanctioned ? {
          reason: 'Address is on OFAC SDN list or associated with sanctioned entities',
          action: 'Do not interact with this address',
        } : null,
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
