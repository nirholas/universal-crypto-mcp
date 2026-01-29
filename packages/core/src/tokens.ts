/**
 * Token configurations for Universal Crypto MCP
 */

// ============================================================================
// Token Types
// ============================================================================

export interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  name: string;
}

export interface TokenWithChain extends TokenInfo {
  chain: string;
}

// ============================================================================
// USDC Addresses
// ============================================================================

export const USDC: Record<string, TokenInfo> = {
  "eip155:1": {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "eip155:42161": {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "eip155:8453": {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "eip155:84532": {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "eip155:137": {
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "eip155:10": {
    address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  "eip155:56": {
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    symbol: "USDC",
    decimals: 18,
    name: "USD Coin",
  },
};

// ============================================================================
// USDT Addresses
// ============================================================================

export const USDT: Record<string, TokenInfo> = {
  "eip155:1": {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "eip155:42161": {
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "eip155:137": {
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "eip155:10": {
    address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  "eip155:56": {
    address: "0x55d398326f99059fF775485246999027B3197955",
    symbol: "USDT",
    decimals: 18,
    name: "Tether USD",
  },
};

// ============================================================================
// WETH Addresses
// ============================================================================

export const WETH: Record<string, TokenInfo> = {
  "eip155:1": {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    decimals: 18,
    name: "Wrapped Ether",
  },
  "eip155:42161": {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    symbol: "WETH",
    decimals: 18,
    name: "Wrapped Ether",
  },
  "eip155:8453": {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    decimals: 18,
    name: "Wrapped Ether",
  },
  "eip155:137": {
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    symbol: "WETH",
    decimals: 18,
    name: "Wrapped Ether",
  },
  "eip155:10": {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    decimals: 18,
    name: "Wrapped Ether",
  },
};

// ============================================================================
// Special Tokens
// ============================================================================

export const USDs: TokenInfo = {
  address: "0xD74f5255D557944cf7Dd0E45FF521520002D5748",
  symbol: "USDs",
  decimals: 18,
  name: "Sperax USD",
};

// ============================================================================
// Token Utilities
// ============================================================================

/**
 * Gets a token for a specific chain
 */
export function getTokenForChain(
  chain: string,
  symbol: string = "USDC"
): TokenInfo | undefined {
  switch (symbol.toUpperCase()) {
    case "USDC":
      return USDC[chain];
    case "USDT":
      return USDT[chain];
    case "WETH":
      return WETH[chain];
    case "USDS":
      if (chain === "eip155:42161") return USDs;
      return undefined;
    default:
      return undefined;
  }
}

/**
 * Gets all supported tokens for a chain
 */
export function getTokensForChain(chain: string): TokenInfo[] {
  const tokens: TokenInfo[] = [];
  
  if (USDC[chain]) tokens.push(USDC[chain]);
  if (USDT[chain]) tokens.push(USDT[chain]);
  if (WETH[chain]) tokens.push(WETH[chain]);
  if (chain === "eip155:42161") tokens.push(USDs);
  
  return tokens;
}

/**
 * Finds a token by address across all chains
 */
export function findTokenByAddress(
  address: string
): TokenWithChain | undefined {
  const normalizedAddress = address.toLowerCase();
  
  for (const [chain, token] of Object.entries(USDC)) {
    if (token.address.toLowerCase() === normalizedAddress) {
      return { ...token, chain };
    }
  }
  
  for (const [chain, token] of Object.entries(USDT)) {
    if (token.address.toLowerCase() === normalizedAddress) {
      return { ...token, chain };
    }
  }
  
  for (const [chain, token] of Object.entries(WETH)) {
    if (token.address.toLowerCase() === normalizedAddress) {
      return { ...token, chain };
    }
  }
  
  return undefined;
}

/**
 * Checks if a token is a stablecoin
 */
export function isStablecoin(symbol: string): boolean {
  const stablecoins = ['USDC', 'USDT', 'DAI', 'USDS', 'FRAX', 'LUSD', 'GUSD'];
  return stablecoins.includes(symbol.toUpperCase());
}
