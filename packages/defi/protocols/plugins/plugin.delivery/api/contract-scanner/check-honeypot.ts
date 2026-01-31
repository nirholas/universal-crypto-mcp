export const config = { runtime: 'edge' };

// Honeypot detection API endpoints
const HONEYPOT_IS_API = 'https://api.honeypot.is/v2/IsHoneypot';
const GOPLUSLAB_API = 'https://api.gopluslabs.io/api/v1/token_security';

// Chain ID mapping
const CHAIN_IDS: Record<string, string> = {
  ethereum: '1',
  eth: '1',
  bsc: '56',
  polygon: '137',
  arbitrum: '42161',
  base: '8453',
  avalanche: '43114',
};

/**
 * Check if token is honeypot
 * 
 * Parameters:
 * // address: string (required) - Token contract address
 * // chain: string - Chain ID or name (default: ethereum)
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as { address?: string; chain?: string };
    const { address, chain = 'ethereum' } = body;

    if (!address) {
      return new Response(JSON.stringify({ error: 'Token address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const chainId = CHAIN_IDS[chain.toLowerCase()] || chain;
    
    // Try multiple honeypot detection services
    const [honeypotIsResult, goPlusResult] = await Promise.all([
      checkHoneypotIs(address, chainId),
      checkGoPlus(address, chainId),
    ]);
    
    // Combine results from multiple sources
    const isHoneypot = honeypotIsResult?.isHoneypot || goPlusResult?.isHoneypot || false;
    const buyTax = honeypotIsResult?.buyTax ?? goPlusResult?.buyTax ?? null;
    const sellTax = honeypotIsResult?.sellTax ?? goPlusResult?.sellTax ?? null;
    
    const riskFactors: string[] = [];
    if (isHoneypot) riskFactors.push('honeypot_detected');
    if (buyTax && buyTax > 10) riskFactors.push('high_buy_tax');
    if (sellTax && sellTax > 10) riskFactors.push('high_sell_tax');
    if (goPlusResult?.isMintable) riskFactors.push('mintable');
    if (goPlusResult?.canTakeOwnership) riskFactors.push('ownership_takeover_risk');
    if (goPlusResult?.hasHiddenOwner) riskFactors.push('hidden_owner');
    if (goPlusResult?.canBlacklist) riskFactors.push('can_blacklist');
    
    const riskLevel = isHoneypot ? 'critical' : 
      riskFactors.length > 2 ? 'high' :
      riskFactors.length > 0 ? 'medium' : 'low';
    
    const result = {
      success: true,
      data: {
        address,
        chain: chainId,
        isHoneypot,
        riskLevel,
        riskFactors,
        taxes: {
          buyTax: buyTax !== null ? `${buyTax}%` : 'unknown',
          sellTax: sellTax !== null ? `${sellTax}%` : 'unknown',
        },
        securityChecks: {
          isMintable: goPlusResult?.isMintable ?? null,
          canPause: goPlusResult?.canPause ?? null,
          canBlacklist: goPlusResult?.canBlacklist ?? null,
          hasHiddenOwner: goPlusResult?.hasHiddenOwner ?? null,
          canTakeOwnership: goPlusResult?.canTakeOwnership ?? null,
        },
        sources: [
          honeypotIsResult ? 'honeypot.is' : null,
          goPlusResult ? 'gopluslabs' : null,
        ].filter(Boolean),
        checkedAt: new Date().toISOString(),
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

async function checkHoneypotIs(address: string, chainId: string): Promise<{
  isHoneypot: boolean;
  buyTax: number | null;
  sellTax: number | null;
} | null> {
  try {
    const response = await fetch(
      `${HONEYPOT_IS_API}?address=${address}&chainId=${chainId}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json() as {
      honeypotResult?: { isHoneypot?: boolean };
      simulationResult?: { buyTax?: number; sellTax?: number };
    };
    
    return {
      isHoneypot: data.honeypotResult?.isHoneypot || false,
      buyTax: data.simulationResult?.buyTax ?? null,
      sellTax: data.simulationResult?.sellTax ?? null,
    };
  } catch {
    return null;
  }
}

async function checkGoPlus(address: string, chainId: string): Promise<{
  isHoneypot: boolean;
  buyTax: number | null;
  sellTax: number | null;
  isMintable: boolean;
  canPause: boolean;
  canBlacklist: boolean;
  hasHiddenOwner: boolean;
  canTakeOwnership: boolean;
} | null> {
  try {
    const response = await fetch(
      `${GOPLUSLAB_API}/${chainId}?contract_addresses=${address}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json() as {
      result?: Record<string, {
        is_honeypot?: string;
        buy_tax?: string;
        sell_tax?: string;
        is_mintable?: string;
        can_take_back_ownership?: string;
        hidden_owner?: string;
        is_blacklisted?: string;
        transfer_pausable?: string;
      }>;
    };
    
    const tokenData = data.result?.[address.toLowerCase()];
    if (!tokenData) return null;
    
    return {
      isHoneypot: tokenData.is_honeypot === '1',
      buyTax: tokenData.buy_tax ? parseFloat(tokenData.buy_tax) * 100 : null,
      sellTax: tokenData.sell_tax ? parseFloat(tokenData.sell_tax) * 100 : null,
      isMintable: tokenData.is_mintable === '1',
      canPause: tokenData.transfer_pausable === '1',
      canBlacklist: tokenData.is_blacklisted === '1',
      hasHiddenOwner: tokenData.hidden_owner === '1',
      canTakeOwnership: tokenData.can_take_back_ownership === '1',
    };
  } catch {
    return null;
  }
}
