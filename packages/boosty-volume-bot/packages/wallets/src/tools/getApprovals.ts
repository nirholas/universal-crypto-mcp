/**
 * MCP Tool: getApprovals
 * Get token approvals (allowances) for a wallet using Etherscan API
 */

import { z } from 'zod';
import { HttpClient, Cache, type Chain } from '../lib';

// Etherscan API endpoints per chain
const EXPLORER_APIS: Record<Chain, { url: string; keyEnv: string }> = {
  ethereum: { url: 'https://api.etherscan.io/api', keyEnv: 'ETHERSCAN_API_KEY' },
  arbitrum: { url: 'https://api.arbiscan.io/api', keyEnv: 'ARBISCAN_API_KEY' },
  polygon: { url: 'https://api.polygonscan.com/api', keyEnv: 'POLYGONSCAN_API_KEY' },
  optimism: { url: 'https://api-optimistic.etherscan.io/api', keyEnv: 'OPTIMISM_API_KEY' },
  base: { url: 'https://api.basescan.org/api', keyEnv: 'BASESCAN_API_KEY' },
  avalanche: { url: 'https://api.snowtrace.io/api', keyEnv: 'SNOWTRACE_API_KEY' },
  bsc: { url: 'https://api.bscscan.com/api', keyEnv: 'BSCSCAN_API_KEY' },
};

export const getApprovalsSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chain: z.enum(['ethereum', 'arbitrum', 'base', 'polygon', 'optimism', 'avalanche', 'bsc']).default('ethereum'),
});

export type GetApprovalsInput = z.infer<typeof getApprovalsSchema>;

export interface TokenApproval {
  token: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  spender: string;
  spenderName?: string;
  allowance: string;
  isUnlimited: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  txHash: string;
  timestamp: number;
}

export interface GetApprovalsOutput {
  address: string;
  chain: string;
  approvals: TokenApproval[];
  totalApprovals: number;
  highRiskCount: number;
  unlimitedCount: number;
  recommendations: string[];
  lastUpdated: string;
}

export const getApprovalsDefinition = {
  name: 'getApprovals',
  description:
    'Get token approvals (allowances) for a wallet to identify potential security risks from unlimited approvals',
  inputSchema: {
    type: 'object' as const,
    properties: {
      address: {
        type: 'string',
        description: 'Wallet address (0x...)',
      },
      chain: {
        type: 'string',
        description: 'Blockchain network',
        default: 'ethereum',
        enum: ['ethereum', 'arbitrum', 'base', 'polygon', 'optimism', 'avalanche', 'bsc'],
      },
    },
    required: ['address'],
  },
};

// Known trusted protocols (checksummed addresses)
const KNOWN_PROTOCOLS: Record<string, string> = {
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V3 Router 2',
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2 Router',
  '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router v5',
  '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3 Router',
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': '0x Exchange Proxy',
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': 'Uniswap Universal Router',
  '0x881d40237659c251811cec9c364ef91dc08d300c': 'Metamask Swap Router',
  '0x216b4b4ba9f3e719726886d34a177484278bfcae': 'Paraswap V5',
  '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2': 'Aave V3 Pool',
  '0x794a61358d6845594f94dc1db02a252b5b4814ad': 'Aave V3 Pool (Polygon)',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC Contract',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT Contract',
};

// ERC20 Approval event topic
const APPROVAL_TOPIC = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';

// Maximum uint256 value (unlimited approval)
const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const UNLIMITED_THRESHOLD = BigInt('0x' + 'f'.repeat(64)) / BigInt(2);

const cache = new Cache({ defaultTTL: 300 }); // 5 minute cache
const httpClient = new HttpClient({ timeout: 30000 });

function assessRisk(spender: string, isUnlimited: boolean, isKnown: boolean): 'low' | 'medium' | 'high' {
  if (isKnown && !isUnlimited) return 'low';
  if (isKnown && isUnlimited) return 'medium';
  if (!isKnown && !isUnlimited) return 'medium';
  return 'high';
}

function isUnlimitedAllowance(allowance: string): boolean {
  if (allowance === MAX_UINT256) return true;
  try {
    const value = BigInt(allowance);
    return value >= UNLIMITED_THRESHOLD;
  } catch {
    return false;
  }
}

async function getTokenInfo(
  tokenAddress: string,
  chain: Chain,
  apiKey: string
): Promise<{ symbol: string; name: string; decimals: number }> {
  const explorerConfig = EXPLORER_APIS[chain];
  
  try {
    // Get token info from explorer API
    const response = await httpClient.get<{
      status: string;
      result: Array<{ tokenSymbol: string; tokenName: string; tokenDecimal: string }>;
    }>(explorerConfig.url, {
      params: {
        module: 'token',
        action: 'tokeninfo',
        contractaddress: tokenAddress,
        apikey: apiKey,
      },
    });

    if (response.data.status === '1' && response.data.result.length > 0) {
      const info = response.data.result[0];
      return {
        symbol: info.tokenSymbol || 'UNKNOWN',
        name: info.tokenName || 'Unknown Token',
        decimals: parseInt(info.tokenDecimal) || 18,
      };
    }
  } catch {
    // Fallback for unknown tokens
  }

  return { symbol: 'UNKNOWN', name: 'Unknown Token', decimals: 18 };
}

export async function getApprovals(
  input: GetApprovalsInput
): Promise<GetApprovalsOutput> {
  const { address, chain } = getApprovalsSchema.parse(input);
  const normalizedAddress = address.toLowerCase();

  // Check cache
  const cacheKey = `approvals:${chain}:${normalizedAddress}`;
  const cached = cache.get<GetApprovalsOutput>(cacheKey);
  if (cached) return cached;

  const explorerConfig = EXPLORER_APIS[chain as Chain];
  const apiKey = process.env[explorerConfig.keyEnv] || process.env.ETHERSCAN_API_KEY || '';

  if (!apiKey) {
    throw new Error(`API key not configured. Set ${explorerConfig.keyEnv} or ETHERSCAN_API_KEY environment variable.`);
  }

  // Fetch approval events from explorer API
  const response = await httpClient.get<{
    status: string;
    message: string;
    result: Array<{
      address: string;
      topics: string[];
      data: string;
      transactionHash: string;
      timeStamp: string;
      blockNumber: string;
    }>;
  }>(explorerConfig.url, {
    params: {
      module: 'logs',
      action: 'getLogs',
      address: normalizedAddress, // This gets approvals TO the address (not ideal)
      topic0: APPROVAL_TOPIC,
      topic1: '0x000000000000000000000000' + normalizedAddress.slice(2), // owner
      fromBlock: '0',
      toBlock: 'latest',
      apikey: apiKey,
    },
  });

  // Also need to get approval events where the address is the owner
  const ownerApprovals = await httpClient.get<{
    status: string;
    message: string;
    result: Array<{
      address: string;
      topics: string[];
      data: string;
      transactionHash: string;
      timeStamp: string;
    }> | string;
  }>(explorerConfig.url, {
    params: {
      module: 'logs',
      action: 'getLogs',
      topic0: APPROVAL_TOPIC,
      topic1: '0x000000000000000000000000' + normalizedAddress.slice(2),
      fromBlock: '0',
      toBlock: 'latest',
      apikey: apiKey,
    },
  });

  const approvalEvents = Array.isArray(ownerApprovals.data.result) ? ownerApprovals.data.result : [];

  // Process approval events - track latest approval per token/spender combo
  const latestApprovals = new Map<string, {
    tokenAddress: string;
    spender: string;
    allowance: string;
    txHash: string;
    timestamp: number;
  }>();

  for (const event of approvalEvents) {
    if (!event.topics || event.topics.length < 3) continue;

    const tokenAddress = event.address.toLowerCase();
    const spender = '0x' + event.topics[2].slice(26).toLowerCase();
    const allowance = event.data;
    const key = `${tokenAddress}:${spender}`;

    const timestamp = parseInt(event.timeStamp) * 1000;
    const existing = latestApprovals.get(key);

    if (!existing || timestamp > existing.timestamp) {
      latestApprovals.set(key, {
        tokenAddress,
        spender,
        allowance,
        txHash: event.transactionHash,
        timestamp,
      });
    }
  }

  // Filter out zero/revoked approvals and build output
  const approvals: TokenApproval[] = [];
  
  for (const [, approval] of latestApprovals) {
    // Skip zero approvals (revoked)
    if (approval.allowance === '0x' || approval.allowance === '0x0' || 
        approval.allowance === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      continue;
    }

    const isUnlimited = isUnlimitedAllowance(approval.allowance);
    const spenderLower = approval.spender.toLowerCase();
    const isKnown = KNOWN_PROTOCOLS[spenderLower] !== undefined;
    const spenderName = KNOWN_PROTOCOLS[spenderLower];
    const riskLevel = assessRisk(approval.spender, isUnlimited, isKnown);

    // Get token info
    const tokenInfo = await getTokenInfo(approval.tokenAddress, chain as Chain, apiKey);

    approvals.push({
      token: {
        address: approval.tokenAddress,
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
      },
      spender: approval.spender,
      spenderName,
      allowance: isUnlimited ? 'unlimited' : approval.allowance,
      isUnlimited,
      riskLevel,
      txHash: approval.txHash,
      timestamp: approval.timestamp,
    });
  }

  // Sort by risk level (high first) then by timestamp
  approvals.sort((a, b) => {
    const riskOrder = { high: 0, medium: 1, low: 2 };
    if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    }
    return b.timestamp - a.timestamp;
  });

  const highRiskCount = approvals.filter((a) => a.riskLevel === 'high').length;
  const unlimitedCount = approvals.filter((a) => a.isUnlimited).length;

  const recommendations: string[] = [];
  if (highRiskCount > 0) {
    recommendations.push(`⚠️ Found ${highRiskCount} high-risk approval(s) to unknown contracts. Consider revoking them.`);
  }
  if (unlimitedCount > 5) {
    recommendations.push('💡 You have many unlimited approvals. Consider setting specific allowances instead.');
  }
  if (approvals.length > 20) {
    recommendations.push('🧹 You have many active approvals. Regularly review and revoke unused ones for better security.');
  }
  if (approvals.length === 0) {
    recommendations.push('✅ No active token approvals found. Your wallet has minimal approval exposure.');
  }

  const result: GetApprovalsOutput = {
    address,
    chain,
    approvals,
    totalApprovals: approvals.length,
    highRiskCount,
    unlimitedCount,
    recommendations,
    lastUpdated: new Date().toISOString(),
  };

  cache.set(cacheKey, result);
  return result;
}
