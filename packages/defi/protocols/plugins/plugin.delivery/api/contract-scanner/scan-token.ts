export const config = { runtime: 'edge' };

// Token security scanning APIs
const GOPLUSLAB_API = 'https://api.gopluslabs.io/api/v1/token_security';
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens';

// Chain ID mapping
const CHAIN_IDS: Record<string, string> = {
  ethereum: '1',
  eth: '1',
  bsc: '56',
  polygon: '137',
  arbitrum: '42161',
  base: '8453',
  avalanche: '43114',
  fantom: '250',
  optimism: '10',
};

/**
 * Scan token for security risks
 * 
 * Parameters:
 * // address: string (required) - Token contract address
 * // chain: string - Chain name or ID (default: ethereum)
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
    
    // Fetch security data from multiple sources
    const [goPlusData, dexScreenerData] = await Promise.all([
      fetchGoPlusData(address, chainId),
      fetchDexScreenerData(address),
    ]);
    
    // Analyze risks
    const risks: Array<{ type: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string }> = [];
    
    if (goPlusData) {
      if (goPlusData.isHoneypot) {
        risks.push({ type: 'honeypot', severity: 'critical', description: 'Token appears to be a honeypot - cannot sell' });
      }
      if (goPlusData.isMintable) {
        risks.push({ type: 'mintable', severity: 'high', description: 'Token supply can be increased by owner' });
      }
      if (goPlusData.hasHiddenOwner) {
        risks.push({ type: 'hidden_owner', severity: 'high', description: 'Contract has hidden owner functionality' });
      }
      if (goPlusData.canBlacklist) {
        risks.push({ type: 'blacklist', severity: 'medium', description: 'Owner can blacklist addresses from trading' });
      }
      if (goPlusData.canPause) {
        risks.push({ type: 'pausable', severity: 'medium', description: 'Trading can be paused by owner' });
      }
      if (goPlusData.buyTax && goPlusData.buyTax > 5) {
        risks.push({ type: 'high_buy_tax', severity: goPlusData.buyTax > 15 ? 'high' : 'medium', description: `Buy tax is ${goPlusData.buyTax}%` });
      }
      if (goPlusData.sellTax && goPlusData.sellTax > 5) {
        risks.push({ type: 'high_sell_tax', severity: goPlusData.sellTax > 15 ? 'high' : 'medium', description: `Sell tax is ${goPlusData.sellTax}%` });
      }
      if (goPlusData.isProxy) {
        risks.push({ type: 'proxy_contract', severity: 'low', description: 'Contract uses proxy pattern - code can be upgraded' });
      }
    }
    
    // Calculate overall risk score
    const riskScore = calculateRiskScore(risks);
    const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    
    const result = {
      success: true,
      data: {
        address,
        chain: chainId,
        riskScore,
        riskLevel,
        risks,
        tokenInfo: {
          name: goPlusData?.tokenName || dexScreenerData?.name || 'Unknown',
          symbol: goPlusData?.tokenSymbol || dexScreenerData?.symbol || 'UNKNOWN',
          totalSupply: goPlusData?.totalSupply || null,
          holders: goPlusData?.holderCount || null,
          creator: goPlusData?.creator || null,
        },
        trading: {
          buyTax: goPlusData?.buyTax ? `${goPlusData.buyTax}%` : 'unknown',
          sellTax: goPlusData?.sellTax ? `${goPlusData.sellTax}%` : 'unknown',
          isHoneypot: goPlusData?.isHoneypot || false,
          lpLocked: goPlusData?.lpLocked || null,
          lpBurned: goPlusData?.lpBurned || null,
        },
        contract: {
          verified: goPlusData?.isVerified || false,
          isProxy: goPlusData?.isProxy || false,
          isOpenSource: goPlusData?.isOpenSource || false,
          hasAntiWhale: goPlusData?.hasAntiWhale || false,
        },
        liquidity: dexScreenerData?.liquidity || null,
        priceUSD: dexScreenerData?.priceUsd || null,
        volume24h: dexScreenerData?.volume24h || null,
        scannedAt: new Date().toISOString(),
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

interface GoPlusResult {
  isHoneypot: boolean;
  isMintable: boolean;
  hasHiddenOwner: boolean;
  canBlacklist: boolean;
  canPause: boolean;
  buyTax: number | null;
  sellTax: number | null;
  isProxy: boolean;
  isVerified: boolean;
  isOpenSource: boolean;
  hasAntiWhale: boolean;
  lpLocked: boolean | null;
  lpBurned: boolean | null;
  tokenName: string | null;
  tokenSymbol: string | null;
  totalSupply: string | null;
  holderCount: number | null;
  creator: string | null;
}

async function fetchGoPlusData(address: string, chainId: string): Promise<GoPlusResult | null> {
  try {
    const response = await fetch(
      `${GOPLUSLAB_API}/${chainId}?contract_addresses=${address}`,
      { signal: AbortSignal.timeout(15000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json() as {
      result?: Record<string, {
        is_honeypot?: string;
        is_mintable?: string;
        hidden_owner?: string;
        is_blacklisted?: string;
        transfer_pausable?: string;
        buy_tax?: string;
        sell_tax?: string;
        is_proxy?: string;
        is_open_source?: string;
        is_anti_whale?: string;
        lp_holder_count?: string;
        lp_total_supply?: string;
        token_name?: string;
        token_symbol?: string;
        total_supply?: string;
        holder_count?: string;
        creator_address?: string;
      }>;
    };
    
    const tokenData = data.result?.[address.toLowerCase()];
    if (!tokenData) return null;
    
    return {
      isHoneypot: tokenData.is_honeypot === '1',
      isMintable: tokenData.is_mintable === '1',
      hasHiddenOwner: tokenData.hidden_owner === '1',
      canBlacklist: tokenData.is_blacklisted === '1',
      canPause: tokenData.transfer_pausable === '1',
      buyTax: tokenData.buy_tax ? parseFloat(tokenData.buy_tax) * 100 : null,
      sellTax: tokenData.sell_tax ? parseFloat(tokenData.sell_tax) * 100 : null,
      isProxy: tokenData.is_proxy === '1',
      isVerified: false, // GoPlus doesn't provide this
      isOpenSource: tokenData.is_open_source === '1',
      hasAntiWhale: tokenData.is_anti_whale === '1',
      lpLocked: null, // Would need additional parsing
      lpBurned: null,
      tokenName: tokenData.token_name || null,
      tokenSymbol: tokenData.token_symbol || null,
      totalSupply: tokenData.total_supply || null,
      holderCount: tokenData.holder_count ? parseInt(tokenData.holder_count) : null,
      creator: tokenData.creator_address || null,
    };
  } catch {
    return null;
  }
}

interface DexScreenerResult {
  name: string;
  symbol: string;
  priceUsd: string;
  liquidity: number;
  volume24h: number;
}

async function fetchDexScreenerData(address: string): Promise<DexScreenerResult | null> {
  try {
    const response = await fetch(
      `${DEXSCREENER_API}/${address}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json() as {
      pairs?: Array<{
        baseToken?: { name?: string; symbol?: string };
        priceUsd?: string;
        liquidity?: { usd?: number };
        volume?: { h24?: number };
      }>;
    };
    
    const pair = data.pairs?.[0];
    if (!pair) return null;
    
    return {
      name: pair.baseToken?.name || 'Unknown',
      symbol: pair.baseToken?.symbol || 'UNKNOWN',
      priceUsd: pair.priceUsd || '0',
      liquidity: pair.liquidity?.usd || 0,
      volume24h: pair.volume?.h24 || 0,
    };
  } catch {
    return null;
  }
}

function calculateRiskScore(risks: Array<{ severity: string }>): number {
  const weights = { critical: 40, high: 25, medium: 10, low: 5 };
  let score = 0;
  
  for (const risk of risks) {
    score += weights[risk.severity as keyof typeof weights] || 0;
  }
  
  return Math.min(100, score);
}
