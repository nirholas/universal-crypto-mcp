export const config = { runtime: 'edge' };

// Known phishing domain patterns
const PHISHING_PATTERNS = [
  /metamask.*claim/i,
  /uniswap.*airdrop/i,
  /opensea.*verify/i,
  /ethereum.*claim/i,
  /wallet.*connect.*verify/i,
  /nft.*mint.*free/i,
  /crypto.*giveaway/i,
];

// Known legitimate domains (whitelist)
const LEGITIMATE_DOMAINS = new Set([
  'uniswap.org',
  'app.uniswap.org',
  'opensea.io',
  'metamask.io',
  'ethereum.org',
  'etherscan.io',
  'coingecko.com',
  'coinmarketcap.com',
  'binance.com',
  'coinbase.com',
  'kraken.com',
  'aave.com',
  'compound.finance',
  'curve.fi',
  'lido.fi',
  'dydx.exchange',
  'gmx.io',
  'app.1inch.io',
  '1inch.io',
  'sushi.com',
  'pancakeswap.finance',
  'solana.com',
  'phantom.app',
  'raydium.io',
  'orca.so',
  'jupiter.ag',
  'jup.ag',
  'magic.eden',
  'tensor.trade',
]);

// Suspicious TLDs commonly used in phishing
const SUSPICIOUS_TLDS = new Set([
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click', '.link',
  '.info', '.online', '.site', '.website', '.space', '.tech', '.icu', '.buzz',
]);

/**
 * Check if URL is phishing
 * 
 * Parameters:
 * // url: string (required) - URL to check
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as { url?: string };
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return new Response(JSON.stringify({
        success: true,
        data: {
          url,
          isPhishing: true,
          riskLevel: 'high',
          reason: 'Invalid URL format',
        },
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const domain = parsedUrl.hostname.toLowerCase();
    const fullUrl = parsedUrl.href.toLowerCase();
    
    // Risk factors
    const riskFactors: string[] = [];
    let riskScore = 0;
    
    // Check if it's a known legitimate domain
    if (LEGITIMATE_DOMAINS.has(domain)) {
      const result = {
        success: true,
        data: {
          url,
          domain,
          isPhishing: false,
          riskLevel: 'safe',
          reason: 'Known legitimate domain',
          verified: true,
          checkedAt: new Date().toISOString(),
        },
      };
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Check for typosquatting of popular domains
    const typosquatResult = checkTyposquatting(domain);
    if (typosquatResult.isTyposquat) {
      riskFactors.push(`Possible typosquat of ${typosquatResult.targetDomain}`);
      riskScore += 40;
    }
    
    // Check for suspicious TLDs
    for (const tld of SUSPICIOUS_TLDS) {
      if (domain.endsWith(tld)) {
        riskFactors.push(`Suspicious TLD: ${tld}`);
        riskScore += 15;
        break;
      }
    }
    
    // Check URL against phishing patterns
    for (const pattern of PHISHING_PATTERNS) {
      if (pattern.test(fullUrl) || pattern.test(domain)) {
        riskFactors.push('Matches known phishing pattern');
        riskScore += 30;
        break;
      }
    }
    
    // Check for suspicious keywords in path
    const suspiciousKeywords = ['verify', 'claim', 'airdrop', 'free', 'giveaway', 'bonus', 'reward'];
    for (const keyword of suspiciousKeywords) {
      if (parsedUrl.pathname.toLowerCase().includes(keyword)) {
        riskFactors.push(`Suspicious keyword in URL path: ${keyword}`);
        riskScore += 10;
      }
    }
    
    // Check for excessive subdomains (common in phishing)
    const subdomainCount = domain.split('.').length - 2;
    if (subdomainCount > 2) {
      riskFactors.push(`Excessive subdomains (${subdomainCount})`);
      riskScore += 15;
    }
    
    // Check for IP address instead of domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      riskFactors.push('URL uses IP address instead of domain name');
      riskScore += 25;
    }
    
    // Check for punycode (IDN homograph attacks)
    if (domain.includes('xn--')) {
      riskFactors.push('Contains punycode - possible homograph attack');
      riskScore += 35;
    }
    
    // Try external phishing detection APIs
    const externalResult = await checkExternalPhishingAPIs(url);
    if (externalResult?.isPhishing) {
      riskFactors.push(`Flagged by external service: ${externalResult.source}`);
      riskScore += 50;
    }
    
    const isPhishing = riskScore >= 40;
    const riskLevel = riskScore >= 70 ? 'critical' : riskScore >= 40 ? 'high' : riskScore >= 20 ? 'medium' : 'low';
    
    const result = {
      success: true,
      data: {
        url,
        domain,
        isPhishing,
        riskLevel,
        riskScore: Math.min(100, riskScore),
        riskFactors,
        recommendation: isPhishing 
          ? 'DO NOT interact with this URL. It shows signs of being a phishing attempt.'
          : riskScore >= 20
            ? 'Exercise caution. Verify the URL before entering any sensitive information.'
            : 'URL appears safe, but always verify the address bar before connecting wallets.',
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

function checkTyposquatting(domain: string): { isTyposquat: boolean; targetDomain?: string } {
  const popularDomains = [
    'uniswap.org',
    'opensea.io',
    'metamask.io',
    'ethereum.org',
    'binance.com',
    'coinbase.com',
    'phantom.app',
  ];
  
  for (const popular of popularDomains) {
    const popularBase = popular.split('.')[0];
    const domainBase = domain.split('.')[0];
    
    // Check for character substitution (l->1, o->0, etc.)
    const normalized = domainBase
      .replace(/1/g, 'l')
      .replace(/0/g, 'o')
      .replace(/5/g, 's')
      .replace(/-/g, '');
    
    if (normalized === popularBase && domain !== popular) {
      return { isTyposquat: true, targetDomain: popular };
    }
    
    // Check Levenshtein distance
    if (levenshteinDistance(domainBase, popularBase) <= 2 && domain !== popular) {
      return { isTyposquat: true, targetDomain: popular };
    }
  }
  
  return { isTyposquat: false };
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

async function checkExternalPhishingAPIs(url: string): Promise<{ isPhishing: boolean; source: string } | null> {
  // Try Google Safe Browsing API if available
  const googleApiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (googleApiKey) {
    try {
      const response = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${googleApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client: { clientId: 'ucai', clientVersion: '1.0' },
            threatInfo: {
              threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
              platformTypes: ['ANY_PLATFORM'],
              threatEntryTypes: ['URL'],
              threatEntries: [{ url }],
            },
          }),
          signal: AbortSignal.timeout(5000),
        }
      );
      
      if (response.ok) {
        const data = await response.json() as { matches?: unknown[] };
        if (data.matches && data.matches.length > 0) {
          return { isPhishing: true, source: 'Google Safe Browsing' };
        }
      }
    } catch {
      // API check failed, continue
    }
  }
  
  return null;
}
