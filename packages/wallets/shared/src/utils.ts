/**
 * @universal-crypto-mcp/wallets-shared
 * 
 * Common wallet utilities
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 */

/**
 * Format a raw balance with decimals
 */
export function formatBalance(
  rawBalance: bigint | string,
  decimals: number,
  displayDecimals: number = 6
): string {
  const raw = typeof rawBalance === "string" ? BigInt(rawBalance) : rawBalance;
  const divisor = BigInt(10 ** decimals);
  const wholePart = raw / divisor;
  const fractionalPart = raw % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  // Pad fractional part with leading zeros
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  const trimmed = fractionalStr.slice(0, displayDecimals).replace(/0+$/, "");
  
  return trimmed ? `${wholePart}.${trimmed}` : wholePart.toString();
}

/**
 * Parse a formatted amount to raw units
 */
export function parseAmount(
  amount: string,
  decimals: number
): bigint {
  const [whole, fractional = ""] = amount.split(".");
  const paddedFractional = fractional.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFractional);
}

/**
 * Check if a string is a valid hex string
 */
export function isHexString(value: string): boolean {
  return /^0x[a-fA-F0-9]*$/.test(value);
}

/**
 * Ensure a value is a hex string with 0x prefix
 */
export function ensureHex(value: string): `0x${string}` {
  if (value.startsWith("0x")) {
    return value as `0x${string}`;
  }
  return `0x${value}`;
}

/**
 * Truncate an address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate an EVM address
 */
export function isValidEVMAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate a Solana address (basic check)
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Get chain type from chain ID
 */
export function getChainType(chainId: string): "evm" | "solana" | "unknown" {
  if (chainId.startsWith("eip155:")) {
    return "evm";
  }
  if (chainId.startsWith("solana:")) {
    return "solana";
  }
  return "unknown";
}

/**
 * Sleep for a given duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
  } = options;
  
  let lastError: Error | undefined;
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        await sleep(Math.min(delay, maxDelay));
        delay *= factor;
      }
    }
  }
  
  throw lastError;
}

/**
 * Format a transaction hash for display
 */
export function formatTxHash(hash: string, chars: number = 8): string {
  if (hash.length <= chars * 2 + 3) {
    return hash;
  }
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: bigint | string): string {
  return formatBalance(wei, 18);
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string): bigint {
  return parseAmount(ether, 18);
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: bigint | string): string {
  return formatBalance(lamports, 9);
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: string): bigint {
  return parseAmount(sol, 9);
}
