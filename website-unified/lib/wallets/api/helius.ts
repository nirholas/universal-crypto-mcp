/**
 * Helius API Integration
 * 
 * Real API calls to Helius for Solana chain data
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { TokenBalance, NFT, Transaction } from '../types';

// ============================================
// Types
// ============================================

interface HeliusTokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  tokenAccount: string;
}

interface HeliusTokenMetadata {
  mint: string;
  onChainMetadata?: {
    metadata?: {
      name: string;
      symbol: string;
      uri: string;
    };
    tokenStandard?: string;
  };
  offChainMetadata?: {
    name?: string;
    symbol?: string;
    image?: string;
    description?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

interface HeliusNFT {
  id: string;
  content: {
    metadata: {
      name: string;
      symbol: string;
      description?: string;
      attributes?: Array<{
        trait_type: string;
        value: string | number;
      }>;
    };
    files?: Array<{
      uri: string;
      cdn_uri?: string;
      mime?: string;
    }>;
    links?: {
      image?: string;
      external_url?: string;
    };
  };
  authorities?: Array<{
    address: string;
    scopes: string[];
  }>;
  compression?: {
    compressed: boolean;
    tree?: string;
  };
  grouping?: Array<{
    group_key: string;
    group_value: string;
  }>;
  ownership: {
    owner: string;
    frozen: boolean;
  };
  token_info?: {
    supply: number;
    decimals: number;
  };
}

interface HeliusTransaction {
  signature: string;
  slot: number;
  timestamp: number;
  type: string;
  fee: number;
  feePayer: string;
  description?: string;
  source?: string;
  tokenTransfers?: Array<{
    mint: string;
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    tokenStandard: string;
  }>;
  nativeTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  accountData?: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges?: Array<{
      mint: string;
      rawTokenAmount: {
        tokenAmount: string;
        decimals: number;
      };
    }>;
  }>;
}

// ============================================
// API Configuration
// ============================================

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || '';

const HELIUS_ENDPOINTS = {
  mainnet: 'https://mainnet.helius-rpc.com',
  devnet: 'https://devnet.helius-rpc.com',
};

function getHeliusRpcUrl(cluster: 'mainnet' | 'devnet' = 'mainnet'): string {
  return `${HELIUS_ENDPOINTS[cluster]}/?api-key=${HELIUS_API_KEY}`;
}

function getHeliusApiUrl(cluster: 'mainnet' | 'devnet' = 'mainnet'): string {
  return `https://api${cluster === 'devnet' ? '-devnet' : ''}.helius.xyz/v0`;
}

// ============================================
// Token Balance Functions
// ============================================

/**
 * Get all token balances for a Solana address
 */
export async function getSolanaTokenBalances(
  address: string,
  cluster: 'mainnet' | 'devnet' = 'mainnet'
): Promise<TokenBalance[]> {
  const rpcUrl = getHeliusRpcUrl(cluster);
  
  // Get token accounts
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getTokenAccountsByOwner',
      params: [
        address,
        { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
        { encoding: 'jsonParsed' },
      ],
      id: 1,
    }),
  });

  const data = await response.json();
  const tokenAccounts = data.result?.value || [];

  // Get SOL balance
  const solBalance = await getSolanaBalance(address, cluster);
  
  // Get token metadata
  const tokenBalances = await Promise.all(
    tokenAccounts.map(async (account: any) => {
      try {
        const parsedInfo = account.account.data.parsed.info;
        const mint = parsedInfo.mint;
        const amount = BigInt(parsedInfo.tokenAmount.amount);
        const decimals = parsedInfo.tokenAmount.decimals;

        // Skip zero balances
        if (amount === BigInt(0)) return null;

        // Get token metadata from Helius
        const metadata = await getTokenMetadataHelius(mint, cluster);
        const priceData = await getSolanaTokenPrice(mint);

        return {
          token: {
            address: mint,
            chainId: cluster === 'mainnet' ? 101 : 103,
            name: metadata?.offChainMetadata?.name || metadata?.onChainMetadata?.metadata?.name || 'Unknown',
            symbol: metadata?.offChainMetadata?.symbol || metadata?.onChainMetadata?.metadata?.symbol || '???',
            decimals,
            logoUri: metadata?.offChainMetadata?.image,
            priceUsd: priceData.price,
            priceChange24h: priceData.change24h,
            isNative: false,
            isVerified: true,
          },
          balance: amount,
          balanceFormatted: formatSolanaBalance(amount, decimals),
          valueUsd: calculateValueUsd(amount, decimals, priceData.price),
          chainId: cluster === 'mainnet' ? 101 : 103,
        } as TokenBalance;
      } catch (error) {
        console.error('Error processing token account:', error);
        return null;
      }
    })
  );

  return [solBalance, ...tokenBalances.filter(Boolean) as TokenBalance[]];
}

/**
 * Get native SOL balance
 */
export async function getSolanaBalance(
  address: string,
  cluster: 'mainnet' | 'devnet' = 'mainnet'
): Promise<TokenBalance> {
  const rpcUrl = getHeliusRpcUrl(cluster);
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getBalance',
      params: [address],
      id: 1,
    }),
  });

  const data = await response.json();
  const lamports = BigInt(data.result?.value || 0);
  
  // Get SOL price
  const priceData = await getSolPrice();
  const chainId = cluster === 'mainnet' ? 101 : 103;

  return {
    token: {
      address: 'So11111111111111111111111111111111111111112',
      chainId,
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
      logoUri: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
      priceUsd: priceData.price,
      priceChange24h: priceData.change24h,
      isNative: true,
      isVerified: true,
    },
    balance: lamports,
    balanceFormatted: formatSolanaBalance(lamports, 9),
    valueUsd: calculateValueUsd(lamports, 9, priceData.price),
    chainId,
  };
}

/**
 * Get token metadata from Helius
 */
async function getTokenMetadataHelius(
  mint: string,
  cluster: 'mainnet' | 'devnet' = 'mainnet'
): Promise<HeliusTokenMetadata | null> {
  try {
    const apiUrl = getHeliusApiUrl(cluster);
    
    const response = await fetch(`${apiUrl}/token-metadata?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mintAccounts: [mint] }),
    });

    const data = await response.json();
    return data[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get SOL price
 */
async function getSolPrice(): Promise<{ price: number; change24h: number }> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    
    return {
      price: data.solana?.usd || 0,
      change24h: data.solana?.usd_24h_change || 0,
    };
  } catch {
    return { price: 0, change24h: 0 };
  }
}

/**
 * Get Solana token price using Jupiter
 */
async function getSolanaTokenPrice(mint: string): Promise<{ price: number; change24h: number }> {
  try {
    const response = await fetch(`https://price.jup.ag/v6/price?ids=${mint}`);
    const data = await response.json();
    
    return {
      price: data.data?.[mint]?.price || 0,
      change24h: 0, // Jupiter doesn't provide 24h change
    };
  } catch {
    return { price: 0, change24h: 0 };
  }
}

// ============================================
// NFT Functions
// ============================================

/**
 * Get NFTs owned by a Solana address
 */
export async function getSolanaNFTs(
  address: string,
  cluster: 'mainnet' | 'devnet' = 'mainnet',
  page = 1,
  limit = 100
): Promise<{ nfts: NFT[]; total: number; page: number }> {
  const rpcUrl = getHeliusRpcUrl(cluster);
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: address,
        page,
        limit,
        displayOptions: {
          showFungible: false,
          showNativeBalance: false,
        },
      },
      id: 1,
    }),
  });

  const data = await response.json();
  const assets: HeliusNFT[] = data.result?.items || [];
  const total = data.result?.total || 0;

  const chainId = cluster === 'mainnet' ? 101 : 103;

  const nfts: NFT[] = assets.map((asset) => {
    const collection = asset.grouping?.find((g) => g.group_key === 'collection');
    
    return {
      id: asset.id,
      contractAddress: asset.id,
      tokenId: asset.id,
      chainId,
      name: asset.content.metadata.name,
      description: asset.content.metadata.description,
      imageUrl: asset.content.links?.image || asset.content.files?.[0]?.cdn_uri || asset.content.files?.[0]?.uri,
      thumbnailUrl: asset.content.files?.[0]?.cdn_uri,
      externalUrl: asset.content.links?.external_url,
      collection: collection ? {
        name: collection.group_value,
        address: collection.group_value,
        isVerified: true,
      } : undefined,
      traits: asset.content.metadata.attributes?.map((attr) => ({
        traitType: attr.trait_type,
        value: String(attr.value),
      })),
      standard: 'SPL',
      isCompressed: asset.compression?.compressed || false,
    };
  });

  return { nfts, total, page };
}

// ============================================
// Transaction History Functions
// ============================================

/**
 * Get parsed transaction history for a Solana address
 */
export async function getSolanaTransactionHistory(
  address: string,
  cluster: 'mainnet' | 'devnet' = 'mainnet',
  options?: {
    before?: string;
    limit?: number;
    type?: string;
  }
): Promise<{ transactions: Transaction[]; hasMore: boolean }> {
  const apiUrl = getHeliusApiUrl(cluster);
  
  const params = new URLSearchParams({
    'api-key': HELIUS_API_KEY,
  });
  
  if (options?.before) params.append('before', options.before);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.type) params.append('type', options.type);

  const response = await fetch(
    `${apiUrl}/addresses/${address}/transactions?${params}`
  );
  
  const data: HeliusTransaction[] = await response.json();
  const chainId = cluster === 'mainnet' ? 101 : 103;

  const transactions: Transaction[] = data.map((tx) => {
    // Determine transaction type and direction
    let type: Transaction['type'] = 'contract';
    let from = tx.feePayer;
    let to = '';
    let value = BigInt(0);
    let valueFormatted = '0';

    // Check native transfers
    if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
      const transfer = tx.nativeTransfers[0];
      from = transfer.fromUserAccount;
      to = transfer.toUserAccount;
      value = BigInt(transfer.amount);
      valueFormatted = formatSolanaBalance(value, 9);
      type = from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive';
    }

    // Check token transfers
    if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
      const transfer = tx.tokenTransfers[0];
      from = transfer.fromUserAccount;
      to = transfer.toUserAccount;
      type = from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive';
    }

    // Check for swap
    if (tx.type === 'SWAP' || tx.source === 'JUPITER' || tx.source === 'RAYDIUM') {
      type = 'swap';
    }

    return {
      hash: tx.signature,
      chainId,
      type,
      status: 'confirmed',
      from,
      to,
      value,
      valueFormatted,
      timestamp: new Date(tx.timestamp * 1000),
      gasFee: BigInt(tx.fee),
      confirmations: 1,
      description: tx.description,
    };
  });

  return {
    transactions,
    hasMore: data.length === (options?.limit || 100),
  };
}

// ============================================
// Priority Fee Functions
// ============================================

/**
 * Get priority fee estimates for Solana transactions
 */
export async function getSolanaPriorityFees(
  cluster: 'mainnet' | 'devnet' = 'mainnet'
): Promise<{
  min: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
}> {
  const rpcUrl = getHeliusRpcUrl(cluster);
  
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getRecentPrioritizationFees',
      params: [],
      id: 1,
    }),
  });

  const data = await response.json();
  const fees: Array<{ prioritizationFee: number }> = data.result || [];

  if (fees.length === 0) {
    return { min: 0, low: 1000, medium: 5000, high: 10000, veryHigh: 50000 };
  }

  // Sort fees and calculate percentiles
  const sortedFees = fees.map((f) => f.prioritizationFee).sort((a, b) => a - b);
  
  const getPercentile = (arr: number[], p: number) => {
    const index = Math.ceil((p / 100) * arr.length) - 1;
    return arr[Math.max(0, index)];
  };

  return {
    min: getPercentile(sortedFees, 0),
    low: getPercentile(sortedFees, 25),
    medium: getPercentile(sortedFees, 50),
    high: getPercentile(sortedFees, 75),
    veryHigh: getPercentile(sortedFees, 95),
  };
}

// ============================================
// Utility Functions
// ============================================

function formatSolanaBalance(lamports: bigint, decimals: number): string {
  if (lamports === BigInt(0)) return '0';
  
  const divisor = BigInt(10 ** decimals);
  const integerPart = lamports / divisor;
  const fractionalPart = lamports % divisor;
  
  if (fractionalPart === BigInt(0)) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.slice(0, 6).replace(/0+$/, '');
  
  if (!trimmedFractional) {
    return integerPart.toString();
  }
  
  return `${integerPart}.${trimmedFractional}`;
}

function calculateValueUsd(amount: bigint, decimals: number, priceUsd: number): number {
  const divisor = BigInt(10 ** decimals);
  const integerPart = Number(amount / divisor);
  const fractionalPart = Number(amount % divisor) / (10 ** decimals);
  
  return (integerPart + fractionalPart) * priceUsd;
}

/**
 * Check if Helius is configured
 */
export function isHeliusConfigured(): boolean {
  return !!HELIUS_API_KEY && HELIUS_API_KEY.length > 0;
}
