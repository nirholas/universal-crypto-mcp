/**
 * Alchemy API Integration
 * 
 * Real API calls to Alchemy for EVM chain data
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { Token, TokenBalance, NFT, Transaction } from '../types';

// ============================================
// Types
// ============================================

interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
  error?: string;
}

interface AlchemyTokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
}

interface AlchemyNFT {
  contract: {
    address: string;
    name: string;
    symbol: string;
    tokenType: string;
    openSeaMetadata?: {
      floorPrice?: number;
      collectionName?: string;
      collectionSlug?: string;
      imageUrl?: string;
      description?: string;
    };
  };
  tokenId: string;
  tokenType: string;
  name?: string;
  description?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    pngUrl?: string;
    originalUrl?: string;
  };
  raw?: {
    metadata?: {
      attributes?: Array<{
        trait_type: string;
        value: string | number;
      }>;
    };
  };
}

interface AlchemyTransfer {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  asset: string;
  category: string;
  rawContract: {
    value: string;
    address: string;
    decimal: string;
  };
  metadata: {
    blockTimestamp: string;
  };
}

// ============================================
// API Configuration
// ============================================

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

const ALCHEMY_NETWORKS: Record<number, string> = {
  1: 'eth-mainnet',
  5: 'eth-goerli',
  11155111: 'eth-sepolia',
  10: 'opt-mainnet',
  137: 'polygon-mainnet',
  42161: 'arb-mainnet',
  8453: 'base-mainnet',
  324: 'zksync-mainnet',
  59144: 'linea-mainnet',
  534352: 'scroll-mainnet',
};

function getAlchemyBaseUrl(chainId: number): string {
  const network = ALCHEMY_NETWORKS[chainId];
  if (!network) {
    throw new Error(`Unsupported chain ID for Alchemy: ${chainId}`);
  }
  return `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
}

function getAlchemyNftUrl(chainId: number): string {
  const network = ALCHEMY_NETWORKS[chainId];
  if (!network) {
    throw new Error(`Unsupported chain ID for Alchemy NFT: ${chainId}`);
  }
  return `https://${network}.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`;
}

// ============================================
// Token Balance Functions
// ============================================

/**
 * Get all token balances for an address
 */
export async function getTokenBalances(
  address: string,
  chainId: number
): Promise<TokenBalance[]> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  // Get token balances
  const balanceResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [address, 'erc20'],
      id: 1,
    }),
  });

  const balanceData = await balanceResponse.json();
  
  if (balanceData.error) {
    throw new Error(balanceData.error.message);
  }

  const tokenBalances: AlchemyTokenBalance[] = balanceData.result?.tokenBalances || [];
  
  // Filter out zero balances and errors
  const nonZeroBalances = tokenBalances.filter(
    (tb) => !tb.error && tb.tokenBalance !== '0x0' && tb.tokenBalance !== '0x'
  );

  // Get metadata for each token
  const balancesWithMetadata = await Promise.all(
    nonZeroBalances.map(async (tb) => {
      try {
        const metadata = await getTokenMetadata(tb.contractAddress, chainId);
        const balance = BigInt(tb.tokenBalance);
        
        // Get token price from Alchemy
        const priceData = await getTokenPrice(tb.contractAddress, chainId);
        
        return {
          token: {
            address: tb.contractAddress,
            chainId,
            name: metadata.name,
            symbol: metadata.symbol,
            decimals: metadata.decimals,
            logoUri: metadata.logo,
            priceUsd: priceData.price,
            priceChange24h: priceData.change24h,
            isNative: false,
            isVerified: true,
          },
          balance,
          balanceFormatted: formatTokenBalance(balance, metadata.decimals),
          valueUsd: calculateValueUsd(balance, metadata.decimals, priceData.price),
          chainId,
        } as TokenBalance;
      } catch (error) {
        console.error(`Error fetching metadata for ${tb.contractAddress}:`, error);
        return null;
      }
    })
  );

  // Add native token balance
  const nativeBalance = await getNativeBalance(address, chainId);
  
  return [nativeBalance, ...balancesWithMetadata.filter(Boolean) as TokenBalance[]];
}

/**
 * Get native token balance (ETH, MATIC, etc.)
 */
export async function getNativeBalance(
  address: string,
  chainId: number
): Promise<TokenBalance> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1,
    }),
  });

  const data = await response.json();
  const balance = BigInt(data.result || '0x0');
  
  // Get native token info based on chain
  const nativeTokens: Record<number, { name: string; symbol: string; decimals: number }> = {
    1: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    10: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    137: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
    42161: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    8453: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    324: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    59144: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  };

  const nativeToken = nativeTokens[chainId] || { name: 'Ethereum', symbol: 'ETH', decimals: 18 };
  
  // Get ETH price
  const priceData = await getEthPrice();

  return {
    token: {
      address: '0x0000000000000000000000000000000000000000',
      chainId,
      name: nativeToken.name,
      symbol: nativeToken.symbol,
      decimals: nativeToken.decimals,
      logoUri: getChainLogo(chainId),
      priceUsd: priceData.price,
      priceChange24h: priceData.change24h,
      isNative: true,
      isVerified: true,
    },
    balance,
    balanceFormatted: formatTokenBalance(balance, nativeToken.decimals),
    valueUsd: calculateValueUsd(balance, nativeToken.decimals, priceData.price),
    chainId,
  };
}

/**
 * Get token metadata
 */
export async function getTokenMetadata(
  contractAddress: string,
  chainId: number
): Promise<AlchemyTokenMetadata> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      params: [contractAddress],
      id: 1,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}

/**
 * Get token price from Alchemy
 */
async function getTokenPrice(
  contractAddress: string,
  chainId: number
): Promise<{ price: number; change24h: number }> {
  try {
    const baseUrl = getAlchemyBaseUrl(chainId);
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenPrices',
        params: [{ addresses: [{ network: ALCHEMY_NETWORKS[chainId], address: contractAddress }] }],
        id: 1,
      }),
    });

    const data = await response.json();
    const priceData = data.result?.data?.[0]?.prices?.[0];
    
    return {
      price: priceData?.value || 0,
      change24h: priceData?.change24h || 0,
    };
  } catch {
    return { price: 0, change24h: 0 };
  }
}

/**
 * Get ETH price
 */
async function getEthPrice(): Promise<{ price: number; change24h: number }> {
  try {
    // Use CoinGecko for reliable ETH price
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    
    return {
      price: data.ethereum?.usd || 0,
      change24h: data.ethereum?.usd_24h_change || 0,
    };
  } catch {
    return { price: 0, change24h: 0 };
  }
}

// ============================================
// NFT Functions
// ============================================

/**
 * Get NFTs owned by address
 */
export async function getNFTsForOwner(
  address: string,
  chainId: number,
  pageKey?: string
): Promise<{ nfts: NFT[]; pageKey?: string }> {
  const nftUrl = getAlchemyNftUrl(chainId);
  
  const params = new URLSearchParams({
    owner: address,
    withMetadata: 'true',
    pageSize: '100',
  });
  
  if (pageKey) {
    params.append('pageKey', pageKey);
  }

  const response = await fetch(`${nftUrl}/getNFTsForOwner?${params}`);
  const data = await response.json();

  const nfts: NFT[] = (data.ownedNfts || []).map((nft: AlchemyNFT) => ({
    id: `${nft.contract.address}-${nft.tokenId}`,
    contractAddress: nft.contract.address,
    tokenId: nft.tokenId,
    chainId,
    name: nft.name || `#${nft.tokenId}`,
    description: nft.description,
    imageUrl: nft.image?.cachedUrl || nft.image?.originalUrl,
    thumbnailUrl: nft.image?.thumbnailUrl || nft.image?.cachedUrl,
    animationUrl: undefined,
    externalUrl: undefined,
    collection: {
      name: nft.contract.openSeaMetadata?.collectionName || nft.contract.name || 'Unknown',
      slug: nft.contract.openSeaMetadata?.collectionSlug,
      imageUrl: nft.contract.openSeaMetadata?.imageUrl,
      floorPrice: nft.contract.openSeaMetadata?.floorPrice,
      isVerified: !!nft.contract.openSeaMetadata?.collectionSlug,
    },
    attributes: nft.raw?.metadata?.attributes?.map((attr) => ({
      traitType: attr.trait_type,
      value: String(attr.value),
    })),
    tokenType: nft.tokenType as 'ERC721' | 'ERC1155',
    balance: 1,
  }));

  return {
    nfts,
    pageKey: data.pageKey,
  };
}

// ============================================
// Transaction History Functions
// ============================================

/**
 * Get asset transfers (transaction history)
 */
export async function getAssetTransfers(
  address: string,
  chainId: number,
  options?: {
    category?: string[];
    fromBlock?: string;
    toBlock?: string;
    maxCount?: number;
    pageKey?: string;
    order?: 'asc' | 'desc';
  }
): Promise<{ transfers: Transaction[]; pageKey?: string }> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  const categories = options?.category || [
    'external',
    'internal',
    'erc20',
    'erc721',
    'erc1155',
  ];

  // Get transfers TO this address
  const incomingResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromBlock: options?.fromBlock || '0x0',
        toBlock: options?.toBlock || 'latest',
        toAddress: address,
        category: categories,
        maxCount: options?.maxCount ? `0x${options.maxCount.toString(16)}` : '0x64',
        order: options?.order || 'desc',
        withMetadata: true,
        pageKey: options?.pageKey,
      }],
      id: 1,
    }),
  });

  // Get transfers FROM this address
  const outgoingResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromBlock: options?.fromBlock || '0x0',
        toBlock: options?.toBlock || 'latest',
        fromAddress: address,
        category: categories,
        maxCount: options?.maxCount ? `0x${options.maxCount.toString(16)}` : '0x64',
        order: options?.order || 'desc',
        withMetadata: true,
      }],
      id: 2,
    }),
  });

  const incomingData = await incomingResponse.json();
  const outgoingData = await outgoingResponse.json();

  const incomingTransfers: AlchemyTransfer[] = incomingData.result?.transfers || [];
  const outgoingTransfers: AlchemyTransfer[] = outgoingData.result?.transfers || [];

  // Map to Transaction type
  const mapTransfer = (transfer: AlchemyTransfer, isIncoming: boolean): Transaction => {
    const type = isIncoming ? 'receive' : 'send';
    const value = transfer.rawContract?.value 
      ? BigInt(transfer.rawContract.value)
      : BigInt(0);

    return {
      hash: transfer.hash,
      chainId,
      type,
      status: 'confirmed',
      from: transfer.from,
      to: transfer.to,
      value,
      valueFormatted: transfer.value?.toString() || '0',
      timestamp: new Date(transfer.metadata.blockTimestamp),
      blockNumber: parseInt(transfer.blockNum, 16),
      confirmations: 1,
      token: transfer.rawContract?.address ? {
        address: transfer.rawContract.address,
        chainId,
        name: transfer.asset || 'Unknown',
        symbol: transfer.asset || '???',
        decimals: parseInt(transfer.rawContract.decimal || '18'),
        isNative: transfer.category === 'external',
        isVerified: true,
      } : undefined,
    };
  };

  const allTransfers = [
    ...incomingTransfers.map((t) => mapTransfer(t, true)),
    ...outgoingTransfers.map((t) => mapTransfer(t, false)),
  ].sort((a, b) => {
    const timeA = a.timestamp?.getTime() || 0;
    const timeB = b.timestamp?.getTime() || 0;
    return timeB - timeA;
  });

  // Remove duplicates by hash
  const uniqueTransfers = allTransfers.filter(
    (transfer, index, self) => index === self.findIndex((t) => t.hash === transfer.hash)
  );

  return {
    transfers: uniqueTransfers,
    pageKey: incomingData.result?.pageKey,
  };
}

// ============================================
// Gas Estimation Functions
// ============================================

/**
 * Get current gas prices
 */
export async function getGasPrice(chainId: number): Promise<{
  slow: bigint;
  standard: bigint;
  fast: bigint;
  instant: bigint;
  baseFee: bigint;
}> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  // Get fee data
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_feeHistory',
      params: ['0x5', 'latest', [10, 50, 90, 99]],
      id: 1,
    }),
  });

  const data = await response.json();
  const feeHistory = data.result;

  if (!feeHistory) {
    // Fallback to simple gas price
    const gasPriceResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1,
      }),
    });
    
    const gasPriceData = await gasPriceResponse.json();
    const gasPrice = BigInt(gasPriceData.result || '0x0');
    
    return {
      slow: gasPrice * BigInt(80) / BigInt(100),
      standard: gasPrice,
      fast: gasPrice * BigInt(120) / BigInt(100),
      instant: gasPrice * BigInt(150) / BigInt(100),
      baseFee: gasPrice,
    };
  }

  const baseFee = BigInt(feeHistory.baseFeePerGas?.[feeHistory.baseFeePerGas.length - 1] || '0x0');
  
  // Calculate priority fees from reward percentiles
  const rewards = feeHistory.reward || [];
  const latestReward = rewards[rewards.length - 1] || ['0x0', '0x0', '0x0', '0x0'];

  return {
    slow: baseFee + BigInt(latestReward[0] || '0x0'),
    standard: baseFee + BigInt(latestReward[1] || '0x0'),
    fast: baseFee + BigInt(latestReward[2] || '0x0'),
    instant: baseFee + BigInt(latestReward[3] || '0x0'),
    baseFee,
  };
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  chainId: number,
  params: {
    from: string;
    to: string;
    value?: string;
    data?: string;
  }
): Promise<bigint> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [params],
      id: 1,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  return BigInt(data.result);
}

// ============================================
// Token Approval Functions
// ============================================

/**
 * Get token approvals for an address
 */
export async function getTokenApprovals(
  address: string,
  chainId: number
): Promise<Array<{
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  spender: string;
  amount: bigint;
  isUnlimited: boolean;
}>> {
  const baseUrl = getAlchemyBaseUrl(chainId);
  
  // Get all Approval events for this address
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [{
        fromBlock: '0x0',
        toBlock: 'latest',
        topics: [
          '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // Approval topic
          `0x000000000000000000000000${address.slice(2).toLowerCase()}`, // Owner
        ],
      }],
      id: 1,
    }),
  });

  const data = await response.json();
  const logs = data.result || [];

  // Process logs to get current approvals
  const approvalMap = new Map<string, {
    tokenAddress: string;
    spender: string;
    amount: bigint;
    blockNumber: number;
  }>();

  for (const log of logs) {
    const tokenAddress = log.address;
    const spender = '0x' + log.topics[2].slice(26);
    const amount = BigInt(log.data);
    const blockNumber = parseInt(log.blockNumber, 16);
    
    const key = `${tokenAddress}-${spender}`;
    const existing = approvalMap.get(key);
    
    if (!existing || existing.blockNumber < blockNumber) {
      approvalMap.set(key, { tokenAddress, spender, amount, blockNumber });
    }
  }

  // Filter out zero approvals and get metadata
  const nonZeroApprovals = Array.from(approvalMap.values()).filter(
    (a) => a.amount > BigInt(0)
  );

  const approvalsWithMetadata = await Promise.all(
    nonZeroApprovals.map(async (approval) => {
      try {
        const metadata = await getTokenMetadata(approval.tokenAddress, chainId);
        const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        
        return {
          tokenAddress: approval.tokenAddress,
          tokenName: metadata.name,
          tokenSymbol: metadata.symbol,
          spender: approval.spender,
          amount: approval.amount,
          isUnlimited: approval.amount >= maxUint256 / BigInt(2),
        };
      } catch {
        return null;
      }
    })
  );

  return approvalsWithMetadata.filter(Boolean) as Array<{
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    spender: string;
    amount: bigint;
    isUnlimited: boolean;
  }>;
}

// ============================================
// Utility Functions
// ============================================

function formatTokenBalance(balance: bigint, decimals: number): string {
  if (balance === BigInt(0)) return '0';
  
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  
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

function calculateValueUsd(balance: bigint, decimals: number, priceUsd: number): number {
  const divisor = BigInt(10 ** decimals);
  const integerPart = Number(balance / divisor);
  const fractionalPart = Number(balance % divisor) / (10 ** decimals);
  
  return (integerPart + fractionalPart) * priceUsd;
}

function getChainLogo(chainId: number): string {
  const logos: Record<number, string> = {
    1: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    10: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    137: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    42161: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    8453: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
  };
  
  return logos[chainId] || logos[1];
}

/**
 * Check if Alchemy is configured
 */
export function isAlchemyConfigured(): boolean {
  return !!ALCHEMY_API_KEY && ALCHEMY_API_KEY.length > 0;
}

/**
 * Get supported chain IDs for Alchemy
 */
export function getAlchemySupportedChains(): number[] {
  return Object.keys(ALCHEMY_NETWORKS).map(Number);
}
