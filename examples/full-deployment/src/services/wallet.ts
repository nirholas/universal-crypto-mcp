/**
 * Wallet Service
 * 
 * Real implementations for blockchain wallet operations.
 * Uses public APIs to fetch balances without requiring private keys for reads.
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 15000; // 15 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expires) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// Chain configurations with public RPC endpoints
const CHAINS: Record<string, {
  name: string;
  chainId: number;
  rpc: string;
  symbol: string;
  explorer: string;
  blockTime: number;
}> = {
  ethereum: {
    name: "Ethereum",
    chainId: 1,
    rpc: "https://eth.llamarpc.com",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    blockTime: 12,
  },
  arbitrum: {
    name: "Arbitrum One",
    chainId: 42161,
    rpc: "https://arb1.arbitrum.io/rpc",
    symbol: "ETH",
    explorer: "https://arbiscan.io",
    blockTime: 0.25,
  },
  base: {
    name: "Base",
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    symbol: "ETH",
    explorer: "https://basescan.org",
    blockTime: 2,
  },
  optimism: {
    name: "Optimism",
    chainId: 10,
    rpc: "https://mainnet.optimism.io",
    symbol: "ETH",
    explorer: "https://optimistic.etherscan.io",
    blockTime: 2,
  },
  polygon: {
    name: "Polygon",
    chainId: 137,
    rpc: "https://polygon-rpc.com",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    blockTime: 2,
  },
  bsc: {
    name: "BNB Smart Chain",
    chainId: 56,
    rpc: "https://bsc-dataseed.binance.org",
    symbol: "BNB",
    explorer: "https://bscscan.com",
    blockTime: 3,
  },
  avalanche: {
    name: "Avalanche C-Chain",
    chainId: 43114,
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    symbol: "AVAX",
    explorer: "https://snowtrace.io",
    blockTime: 2,
  },
};

// Common token addresses
const TOKENS: Record<string, Record<string, { address: string; decimals: number; symbol: string }>> = {
  ethereum: {
    USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, symbol: "USDC" },
    USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, symbol: "USDT" },
    DAI: { address: "0x6B175474E89094C44Da98b954EesNF1C4C0", decimals: 18, symbol: "DAI" },
    WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, symbol: "WETH" },
  },
  arbitrum: {
    USDC: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6, symbol: "USDC" },
    "USDC.e": { address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", decimals: 6, symbol: "USDC.e" },
    USDT: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6, symbol: "USDT" },
    ARB: { address: "0x912CE59144191C1204E64559FE8253a0e49E6548", decimals: 18, symbol: "ARB" },
  },
  base: {
    USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, symbol: "USDC" },
    USDbC: { address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", decimals: 6, symbol: "USDbC" },
  },
};

export interface NativeBalance {
  chain: string;
  chainId: number;
  symbol: string;
  balance: string;
  balanceFormatted: string;
  balanceUsd: number;
  explorer: string;
}

export interface TokenBalance {
  chain: string;
  token: string;
  symbol: string;
  address: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
}

export interface WalletPortfolio {
  address: string;
  totalValueUsd: number;
  totalValueFormatted: string;
  chains: Array<{
    chain: string;
    nativeBalance: NativeBalance;
    tokens: TokenBalance[];
    totalValueUsd: number;
  }>;
  lastUpdated: string;
}

/**
 * Make JSON-RPC call
 */
async function rpcCall(rpc: string, method: string, params: any[]): Promise<any> {
  const response = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`RPC error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || "RPC error");
  }
  
  return data.result;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get native token balance on a chain
 */
export async function getNativeBalance(address: string, chainName: string): Promise<NativeBalance> {
  if (!isValidAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
  
  const chain = CHAINS[chainName.toLowerCase()];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}. Supported: ${Object.keys(CHAINS).join(", ")}`);
  }
  
  const cacheKey = `native:${chainName}:${address}`;
  const cached = getCached<NativeBalance>(cacheKey);
  if (cached) return cached;
  
  const balanceHex = await rpcCall(chain.rpc, "eth_getBalance", [address, "latest"]);
  const balanceWei = BigInt(balanceHex);
  const balanceFormatted = (Number(balanceWei) / 1e18).toFixed(6);
  
  // Get USD price
  let priceUsd = 0;
  try {
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${chain.symbol === "ETH" ? "ethereum" : chain.symbol.toLowerCase()}&vs_currencies=usd`
    );
    if (priceResponse.ok) {
      const priceData = await priceResponse.json();
      const key = chain.symbol === "ETH" ? "ethereum" : chain.symbol.toLowerCase();
      priceUsd = priceData[key]?.usd || 0;
    }
  } catch {}
  
  const result: NativeBalance = {
    chain: chain.name,
    chainId: chain.chainId,
    symbol: chain.symbol,
    balance: balanceWei.toString(),
    balanceFormatted: `${balanceFormatted} ${chain.symbol}`,
    balanceUsd: parseFloat(balanceFormatted) * priceUsd,
    explorer: `${chain.explorer}/address/${address}`,
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get ERC20 token balance
 */
export async function getTokenBalance(
  address: string,
  chainName: string,
  tokenSymbol: string
): Promise<TokenBalance> {
  if (!isValidAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
  
  const chain = CHAINS[chainName.toLowerCase()];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  
  const chainTokens = TOKENS[chainName.toLowerCase()];
  const token = chainTokens?.[tokenSymbol.toUpperCase()];
  if (!token) {
    throw new Error(`Token ${tokenSymbol} not found on ${chainName}`);
  }
  
  const cacheKey = `token:${chainName}:${address}:${tokenSymbol}`;
  const cached = getCached<TokenBalance>(cacheKey);
  if (cached) return cached;
  
  // ERC20 balanceOf(address) selector: 0x70a08231
  const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
  
  const balanceHex = await rpcCall(chain.rpc, "eth_call", [
    { to: token.address, data },
    "latest",
  ]);
  
  const balanceRaw = BigInt(balanceHex);
  const balanceFormatted = (Number(balanceRaw) / Math.pow(10, token.decimals)).toFixed(token.decimals > 6 ? 6 : token.decimals);
  
  const result: TokenBalance = {
    chain: chain.name,
    token: token.symbol,
    symbol: token.symbol,
    address: token.address,
    balance: balanceRaw.toString(),
    balanceFormatted: `${balanceFormatted} ${token.symbol}`,
    decimals: token.decimals,
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get gas price for a chain
 */
export async function getGasPrice(chainName: string): Promise<{
  chain: string;
  gasPrice: string;
  gasPriceGwei: string;
  baseFee: string | null;
  priorityFee: string | null;
  estimatedTxCost: string;
}> {
  const chain = CHAINS[chainName.toLowerCase()];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  
  const cacheKey = `gas:${chainName}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const gasPriceHex = await rpcCall(chain.rpc, "eth_gasPrice", []);
  const gasPrice = BigInt(gasPriceHex);
  const gasPriceGwei = (Number(gasPrice) / 1e9).toFixed(2);
  
  // Try to get EIP-1559 fees
  let baseFee: string | null = null;
  let priorityFee: string | null = null;
  
  try {
    const block = await rpcCall(chain.rpc, "eth_getBlockByNumber", ["latest", false]);
    if (block.baseFeePerGas) {
      baseFee = (Number(BigInt(block.baseFeePerGas)) / 1e9).toFixed(2);
    }
    
    const maxPriorityFee = await rpcCall(chain.rpc, "eth_maxPriorityFeePerGas", []);
    priorityFee = (Number(BigInt(maxPriorityFee)) / 1e9).toFixed(2);
  } catch {}
  
  // Estimate cost for simple transfer (21000 gas)
  const txCostWei = gasPrice * BigInt(21000);
  const txCostEth = (Number(txCostWei) / 1e18).toFixed(6);
  
  const result = {
    chain: chain.name,
    gasPrice: gasPrice.toString(),
    gasPriceGwei: `${gasPriceGwei} Gwei`,
    baseFee: baseFee ? `${baseFee} Gwei` : null,
    priorityFee: priorityFee ? `${priorityFee} Gwei` : null,
    estimatedTxCost: `${txCostEth} ${chain.symbol}`,
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get current block number
 */
export async function getBlockNumber(chainName: string): Promise<{
  chain: string;
  blockNumber: number;
  timestamp: string;
}> {
  const chain = CHAINS[chainName.toLowerCase()];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  
  const blockHex = await rpcCall(chain.rpc, "eth_blockNumber", []);
  const blockNumber = Number(BigInt(blockHex));
  
  return {
    chain: chain.name,
    blockNumber,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get transaction by hash
 */
export async function getTransaction(chainName: string, txHash: string): Promise<{
  hash: string;
  status: "pending" | "success" | "failed";
  blockNumber: number | null;
  from: string;
  to: string | null;
  value: string;
  valueFormatted: string;
  gasUsed: string | null;
  gasPrice: string;
  timestamp: string | null;
  explorer: string;
}> {
  const chain = CHAINS[chainName.toLowerCase()];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  
  const tx = await rpcCall(chain.rpc, "eth_getTransactionByHash", [txHash]);
  
  if (!tx) {
    throw new Error("Transaction not found");
  }
  
  let receipt = null;
  let status: "pending" | "success" | "failed" = "pending";
  
  if (tx.blockNumber) {
    receipt = await rpcCall(chain.rpc, "eth_getTransactionReceipt", [txHash]);
    status = receipt?.status === "0x1" ? "success" : "failed";
  }
  
  const value = BigInt(tx.value || "0x0");
  const valueFormatted = (Number(value) / 1e18).toFixed(6);
  
  return {
    hash: tx.hash,
    status,
    blockNumber: tx.blockNumber ? Number(BigInt(tx.blockNumber)) : null,
    from: tx.from,
    to: tx.to,
    value: value.toString(),
    valueFormatted: `${valueFormatted} ${chain.symbol}`,
    gasUsed: receipt?.gasUsed ? Number(BigInt(receipt.gasUsed)).toString() : null,
    gasPrice: (Number(BigInt(tx.gasPrice || "0x0")) / 1e9).toFixed(2) + " Gwei",
    timestamp: null, // Would need block data
    explorer: `${chain.explorer}/tx/${txHash}`,
  };
}

/**
 * Get supported chains
 */
export function getSupportedChains(): Array<{
  id: string;
  name: string;
  chainId: number;
  symbol: string;
  explorer: string;
}> {
  return Object.entries(CHAINS).map(([id, chain]) => ({
    id,
    name: chain.name,
    chainId: chain.chainId,
    symbol: chain.symbol,
    explorer: chain.explorer,
  }));
}
