/**
 * DeFi Implementation
 *
 * Native DeFi integrations using DeFiLlama, 1inch, Uniswap, Aave APIs
 * No centralized services - direct on-chain and decentralized API access
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  formatUnits,
  parseUnits,
  type Address,
  type Hash,
} from 'viem';
import { mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

export * from './types';

// ============================================================
// Configuration
// ============================================================

const CHAINS = { mainnet, arbitrum, base, optimism, polygon } as const;

const RPC_URLS: Record<string, string> = {
  mainnet: process.env.RPC_MAINNET || 'https://eth.llamarpc.com',
  arbitrum: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
  base: process.env.RPC_BASE || 'https://mainnet.base.org',
  optimism: process.env.RPC_OPTIMISM || 'https://mainnet.optimism.io',
  polygon: process.env.RPC_POLYGON || 'https://polygon-rpc.com',
};

const DEFILLAMA_API = 'https://api.llama.fi';
const ONEINCH_API = 'https://api.1inch.dev/swap/v6.0';

// ============================================================
// Types
// ============================================================

interface BigNumber {
  toString(): string;
  toNumber(): number;
}

interface Liq {
  protocol: string;
  chain: string;
  amount: number;
  token: string;
}

interface Bins {
  [key: string]: Liq[];
}

interface Protocol {
  id: string;
  name: string;
  chain: string;
  tvl: number;
  change_1h?: number;
  change_1d?: number;
  change_7d?: number;
  category?: string;
}

interface Pool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase?: number;
  apyReward?: number;
  apy?: number;
  rewardTokens?: string[];
}

// ============================================================
// DeFi Protocol Functions
// ============================================================

export async function getProtocol(slug: string): Promise<Protocol | null> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/protocol/${slug}`);
    if (!response.ok) return null;
    
    const data = await response.json() as Protocol;
    return data;
  } catch (error) {
    console.error('Failed to fetch protocol:', error);
    return null;
  }
}

export async function getTVL(chain?: string): Promise<{ total: number; chains: Record<string, number> }> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/v2/chains`);
    if (!response.ok) throw new Error('Failed to fetch TVL');
    
    const chains = await response.json() as Array<{ name: string; tvl: number }>;
    
    const chainTVL: Record<string, number> = {};
    let total = 0;
    
    for (const c of chains) {
      chainTVL[c.name] = c.tvl;
      total += c.tvl;
      
      if (chain && c.name.toLowerCase() === chain.toLowerCase()) {
        return { total: c.tvl, chains: { [c.name]: c.tvl } };
      }
    }
    
    return { total, chains: chainTVL };
  } catch (error) {
    console.error('Failed to fetch TVL:', error);
    return { total: 0, chains: {} };
  }
}

export async function getAPY(protocol?: string): Promise<Pool[]> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/pools`);
    if (!response.ok) throw new Error('Failed to fetch pools');
    
    const data = await response.json() as { data: Pool[] };
    let pools = data.data;
    
    if (protocol) {
      pools = pools.filter(p => p.project.toLowerCase() === protocol.toLowerCase());
    }
    
    // Sort by APY descending
    return pools.sort((a, b) => (b.apy || 0) - (a.apy || 0)).slice(0, 100);
  } catch (error) {
    console.error('Failed to fetch APY:', error);
    return [];
  }
}

export async function getPool(poolId: string): Promise<Pool | null> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/pool/${poolId}`);
    if (!response.ok) return null;
    
    const data = await response.json() as { data: Pool[] };
    return data.data[0] || null;
  } catch (error) {
    console.error('Failed to fetch pool:', error);
    return null;
  }
}

// ============================================================
// Swap Functions (1inch Integration)
// ============================================================

export async function swap(params: {
  chain: keyof typeof CHAINS;
  fromToken: Address;
  toToken: Address;
  amount: string;
  fromAddress: Address;
  slippage?: number;
  privateKey?: string;
}): Promise<{ success: boolean; txHash?: Hash; quote?: unknown; error?: string }> {
  const chainId = {
    mainnet: 1,
    arbitrum: 42161,
    base: 8453,
    optimism: 10,
    polygon: 137,
  }[params.chain];

  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    return { success: false, error: '1inch API key not configured' };
  }

  try {
    // Get quote first
    const quoteUrl = new URL(`${ONEINCH_API}/${chainId}/quote`);
    quoteUrl.searchParams.set('src', params.fromToken);
    quoteUrl.searchParams.set('dst', params.toToken);
    quoteUrl.searchParams.set('amount', params.amount);

    const quoteResponse = await fetch(quoteUrl.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!quoteResponse.ok) {
      const error = await quoteResponse.text();
      return { success: false, error: `Quote failed: ${error}` };
    }

    const quote = await quoteResponse.json();

    // If no private key, just return the quote
    if (!params.privateKey) {
      return { success: true, quote };
    }

    // Get swap transaction
    const swapUrl = new URL(`${ONEINCH_API}/${chainId}/swap`);
    swapUrl.searchParams.set('src', params.fromToken);
    swapUrl.searchParams.set('dst', params.toToken);
    swapUrl.searchParams.set('amount', params.amount);
    swapUrl.searchParams.set('from', params.fromAddress);
    swapUrl.searchParams.set('slippage', String(params.slippage || 1));

    const swapResponse = await fetch(swapUrl.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!swapResponse.ok) {
      const error = await swapResponse.text();
      return { success: false, error: `Swap failed: ${error}` };
    }

    const swapData = await swapResponse.json() as { tx: { to: Address; data: string; value: string; gas: string } };

    // Execute transaction
    const account = privateKeyToAccount(params.privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: CHAINS[params.chain],
      transport: http(RPC_URLS[params.chain]),
    });

    const txHash = await walletClient.sendTransaction({
      to: swapData.tx.to,
      data: swapData.tx.data as `0x${string}`,
      value: BigInt(swapData.tx.value || '0'),
      gas: BigInt(swapData.tx.gas),
    });

    return { success: true, txHash, quote };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================
// Liquidation & Analytics Functions
// ============================================================

function createBigNumber(value: string | number): BigNumber {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return {
    toString: () => String(numValue),
    toNumber: () => numValue,
  };
}

export function collateralPriceAtRatio(params: {
  colRatio: BigNumber;
  collateral: BigNumber;
  vaultDebt: BigNumber;
}): BigNumber {
  const { colRatio, collateral, vaultDebt } = params;
  
  // Price at which collateral ratio equals target
  // colRatio = (collateral * price) / debt
  // price = (colRatio * debt) / collateral
  const price = (colRatio.toNumber() * vaultDebt.toNumber()) / collateral.toNumber();
  
  return createBigNumber(price);
}

export async function displayDebugInfo(
  skippedTokens: Set<string>,
  liqs: Liq[],
  bins: Bins
): Promise<void> {
  console.log('=== Debug Info ===');
  console.log(`Skipped tokens: ${Array.from(skippedTokens).join(', ')}`);
  console.log(`Total liquidations: ${liqs.length}`);
  console.log(`Bins: ${Object.keys(bins).length}`);
  
  for (const [key, value] of Object.entries(bins)) {
    console.log(`  ${key}: ${value.length} items`);
  }
}

export async function binResults(liqs: Liq[]): Promise<Bins> {
  const bins: Bins = {};
  
  for (const liq of liqs) {
    const key = `${liq.protocol}:${liq.chain}`;
    if (!bins[key]) {
      bins[key] = [];
    }
    bins[key].push(liq);
  }
  
  return bins;
}

// ============================================================
// GraphQL Helpers
// ============================================================

export async function getPagedGql<T>(
  url: string,
  query: string,
  itemName: string,
  pageSize: number = 1000
): Promise<T[]> {
  const results: T[] = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const pagedQuery = query.replace('$skip', String(skip)).replace('$first', String(pageSize));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: pagedQuery }),
    });

    if (!response.ok) break;

    const data = await response.json() as { data: Record<string, T[]> };
    const items = data.data[itemName] || [];
    
    results.push(...items);
    
    if (items.length < pageSize) {
      hasMore = false;
    } else {
      skip += pageSize;
    }
  }

  return results;
}

// ============================================================
// Utility Functions
// ============================================================

export function fromBase64(base64String: string): Uint8Array {
  return Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
}

export function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

// Main entry point for CLI/scripts
export async function main(): Promise<void> {
  console.log('DeFi module initialized');
  
  // Example: Fetch TVL
  const tvl = await getTVL();
  console.log(`Total DeFi TVL: $${(tvl.total / 1e9).toFixed(2)}B`);
}
