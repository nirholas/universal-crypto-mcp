/**
 * Network Utilities - Network definitions and validation
 * Comprehensive blockchain network support
 */

export interface NetworkInfo {
  chainId: string;
  name: string;
  displayName: string;
  type: "mainnet" | "testnet";
  explorer: string;
  nativeToken: string;
  stablecoins: string[];
  facilitatorUrl?: string;
  rpcUrl?: string;
  gasMultiplier: number;
}

export const NETWORKS: Record<string, NetworkInfo> = {
  // Ethereum Mainnet
  "eip155:1": {
    chainId: "eip155:1",
    name: "ethereum",
    displayName: "Ethereum Mainnet",
    type: "mainnet",
    explorer: "https://etherscan.io",
    nativeToken: "ETH",
    stablecoins: ["USDC", "USDT", "DAI"],
    gasMultiplier: 1.2,
  },
  
  // Arbitrum One
  "eip155:42161": {
    chainId: "eip155:42161",
    name: "arbitrum",
    displayName: "Arbitrum One",
    type: "mainnet",
    explorer: "https://arbiscan.io",
    nativeToken: "ETH",
    stablecoins: ["USDC", "USDT", "DAI"],
    gasMultiplier: 1.1,
  },
  
  // Base Mainnet
  "eip155:8453": {
    chainId: "eip155:8453",
    name: "base",
    displayName: "Base",
    type: "mainnet",
    explorer: "https://basescan.org",
    nativeToken: "ETH",
    stablecoins: ["USDC", "USDbC"],
    facilitatorUrl: "https://facilitator.x402.dev",
    gasMultiplier: 1.0,
  },
  
  // Base Sepolia (Testnet)
  "eip155:84532": {
    chainId: "eip155:84532",
    name: "base-sepolia",
    displayName: "Base Sepolia (Testnet)",
    type: "testnet",
    explorer: "https://sepolia.basescan.org",
    nativeToken: "ETH",
    stablecoins: ["USDC"],
    facilitatorUrl: "https://facilitator-testnet.x402.dev",
    gasMultiplier: 1.0,
  },
  
  // Optimism
  "eip155:10": {
    chainId: "eip155:10",
    name: "optimism",
    displayName: "Optimism",
    type: "mainnet",
    explorer: "https://optimistic.etherscan.io",
    nativeToken: "ETH",
    stablecoins: ["USDC", "USDT", "DAI"],
    gasMultiplier: 1.0,
  },
  
  // Polygon
  "eip155:137": {
    chainId: "eip155:137",
    name: "polygon",
    displayName: "Polygon PoS",
    type: "mainnet",
    explorer: "https://polygonscan.com",
    nativeToken: "MATIC",
    stablecoins: ["USDC", "USDT", "DAI"],
    gasMultiplier: 1.3,
  },
  
  // Polygon zkEVM
  "eip155:1101": {
    chainId: "eip155:1101",
    name: "polygon-zkevm",
    displayName: "Polygon zkEVM",
    type: "mainnet",
    explorer: "https://zkevm.polygonscan.com",
    nativeToken: "ETH",
    stablecoins: ["USDC"],
    gasMultiplier: 1.1,
  },
  
  // Avalanche C-Chain
  "eip155:43114": {
    chainId: "eip155:43114",
    name: "avalanche",
    displayName: "Avalanche C-Chain",
    type: "mainnet",
    explorer: "https://snowtrace.io",
    nativeToken: "AVAX",
    stablecoins: ["USDC", "USDT"],
    gasMultiplier: 1.1,
  },
  
  // BSC
  "eip155:56": {
    chainId: "eip155:56",
    name: "bsc",
    displayName: "BNB Smart Chain",
    type: "mainnet",
    explorer: "https://bscscan.com",
    nativeToken: "BNB",
    stablecoins: ["USDT", "BUSD", "USDC"],
    gasMultiplier: 1.1,
  },
  
  // Scroll
  "eip155:534352": {
    chainId: "eip155:534352",
    name: "scroll",
    displayName: "Scroll",
    type: "mainnet",
    explorer: "https://scrollscan.com",
    nativeToken: "ETH",
    stablecoins: ["USDC"],
    gasMultiplier: 1.0,
  },
  
  // zkSync Era
  "eip155:324": {
    chainId: "eip155:324",
    name: "zksync",
    displayName: "zkSync Era",
    type: "mainnet",
    explorer: "https://explorer.zksync.io",
    nativeToken: "ETH",
    stablecoins: ["USDC", "USDT"],
    gasMultiplier: 1.0,
  },
  
  // Linea
  "eip155:59144": {
    chainId: "eip155:59144",
    name: "linea",
    displayName: "Linea",
    type: "mainnet",
    explorer: "https://lineascan.build",
    nativeToken: "ETH",
    stablecoins: ["USDC"],
    gasMultiplier: 1.0,
  },
  
  // Mantle
  "eip155:5000": {
    chainId: "eip155:5000",
    name: "mantle",
    displayName: "Mantle",
    type: "mainnet",
    explorer: "https://explorer.mantle.xyz",
    nativeToken: "MNT",
    stablecoins: ["USDC", "USDT"],
    gasMultiplier: 1.0,
  },
  
  // Mode
  "eip155:34443": {
    chainId: "eip155:34443",
    name: "mode",
    displayName: "Mode",
    type: "mainnet",
    explorer: "https://explorer.mode.network",
    nativeToken: "ETH",
    stablecoins: ["USDC"],
    gasMultiplier: 1.0,
  },
};

/**
 * Get network info by chain ID
 */
export function getNetwork(chainId: string): NetworkInfo | undefined {
  return NETWORKS[chainId];
}

/**
 * Get all mainnet networks
 */
export function getMainnets(): NetworkInfo[] {
  return Object.values(NETWORKS).filter(n => n.type === "mainnet");
}

/**
 * Get all testnet networks
 */
export function getTestnets(): NetworkInfo[] {
  return Object.values(NETWORKS).filter(n => n.type === "testnet");
}

/**
 * Validate chain ID format
 */
export function isValidChainId(chainId: string): boolean {
  return /^eip155:\d+$/.test(chainId);
}

/**
 * Get chain ID from network name
 */
export function getChainIdByName(name: string): string | undefined {
  const network = Object.values(NETWORKS).find(
    n => n.name.toLowerCase() === name.toLowerCase()
  );
  return network?.chainId;
}

/**
 * Get explorer URL for address
 */
export function getExplorerUrl(chainId: string, address: string, type: "address" | "tx" = "address"): string | undefined {
  const network = NETWORKS[chainId];
  if (!network) return undefined;
  
  return `${network.explorer}/${type}/${address}`;
}

/**
 * Get facilitator URL for network
 */
export function getFacilitatorUrl(chainId: string): string {
  const network = NETWORKS[chainId];
  return network?.facilitatorUrl || "https://facilitator.x402.dev";
}

/**
 * Check if token is supported on network
 */
export function isTokenSupported(chainId: string, token: string): boolean {
  const network = NETWORKS[chainId];
  if (!network) return false;
  return network.stablecoins.includes(token.toUpperCase());
}

/**
 * Get recommended token for network
 */
export function getRecommendedToken(chainId: string): string {
  const network = NETWORKS[chainId];
  if (!network) return "USDC";
  return network.stablecoins[0] || "USDC";
}

/**
 * Format network for display
 */
export function formatNetwork(chainId: string): string {
  const network = NETWORKS[chainId];
  if (!network) return chainId;
  
  const indicator = network.type === "testnet" ? " 🧪" : "";
  return `${network.displayName}${indicator}`;
}
