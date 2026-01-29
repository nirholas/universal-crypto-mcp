/**
 * Price Utilities - Parse, format, and calculate prices
 * Comprehensive pricing support for x402
 */

export interface ParsedPrice {
  amount: number;
  currency: string;
  formatted: string;
  wei?: bigint;
}

export interface PriceCalculation {
  pricePerCall: number;
  totalRevenue: number;
  netRevenue: number;
  platformFee: number;
  gasCost: number;
}

// Platform fee percentage (2.9% like Stripe for comparison)
const PLATFORM_FEE_PERCENT = 0;

// Token decimals
const TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  WETH: 18,
  ETH: 18,
};

/**
 * Parse a price string into structured data
 * Supports formats: "$0.01", "0.01 USDC", "0.01", "1e-6"
 */
export function parsePrice(price: string): ParsedPrice {
  if (!price) {
    return { amount: 0, currency: "USD", formatted: "$0.00" };
  }

  let amount = 0;
  let currency = "USD";
  
  const cleaned = price.toString().trim();
  
  // Handle dollar sign prefix
  if (cleaned.startsWith("$")) {
    const numStr = cleaned.slice(1).trim();
    amount = parseFloat(numStr);
    currency = "USD";
  }
  // Handle token suffix
  else if (/\s+(USDC|USDT|DAI|ETH|WETH)$/i.test(cleaned)) {
    const match = cleaned.match(/^([\d.e-]+)\s+(\w+)$/i);
    if (match) {
      amount = parseFloat(match[1]);
      currency = match[2].toUpperCase();
    }
  }
  // Handle scientific notation
  else if (/^[\d.]+e[+-]?\d+$/i.test(cleaned)) {
    amount = parseFloat(cleaned);
    currency = "USD";
  }
  // Handle plain number
  else {
    amount = parseFloat(cleaned);
    currency = "USD";
  }

  // Ensure valid number
  if (isNaN(amount)) {
    amount = 0;
  }

  return {
    amount,
    currency,
    formatted: formatPrice(amount, currency),
    wei: toWei(amount, currency),
  };
}

/**
 * Format a price for display
 */
export function formatPrice(amount: number, currency: string = "USD"): string {
  if (currency === "USD") {
    if (amount < 0.001) {
      return `$${amount.toFixed(6)}`;
    } else if (amount < 1) {
      return `$${amount.toFixed(4)}`;
    } else if (amount < 100) {
      return `$${amount.toFixed(2)}`;
    } else {
      return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }
  
  return `${amount} ${currency}`;
}

/**
 * Convert price to wei (smallest unit)
 */
export function toWei(amount: number, token: string = "USDC"): bigint {
  const decimals = TOKEN_DECIMALS[token.toUpperCase()] || 6;
  const multiplier = BigInt(10 ** decimals);
  
  // Use string manipulation to avoid floating point errors
  const amountStr = amount.toFixed(decimals);
  const [whole, decimal = ""] = amountStr.split(".");
  const paddedDecimal = decimal.padEnd(decimals, "0").slice(0, decimals);
  
  return BigInt(whole || "0") * multiplier + BigInt(paddedDecimal);
}

/**
 * Convert wei to human-readable amount
 */
export function fromWei(wei: bigint, token: string = "USDC"): number {
  const decimals = TOKEN_DECIMALS[token.toUpperCase()] || 6;
  const divisor = BigInt(10 ** decimals);
  
  const whole = wei / divisor;
  const remainder = wei % divisor;
  
  return Number(whole) + Number(remainder) / Number(divisor);
}

/**
 * Calculate revenue from number of calls
 */
export function calculateRevenue(
  pricePerCall: number,
  callCount: number,
  options: {
    includeFees?: boolean;
    avgGasCost?: number;
  } = {}
): PriceCalculation {
  const totalRevenue = pricePerCall * callCount;
  const platformFee = options.includeFees ? totalRevenue * PLATFORM_FEE_PERCENT : 0;
  const gasCost = options.avgGasCost ? options.avgGasCost * callCount : 0;
  const netRevenue = totalRevenue - platformFee - gasCost;

  return {
    pricePerCall,
    totalRevenue,
    netRevenue,
    platformFee,
    gasCost,
  };
}

/**
 * Suggest optimal price based on usage patterns
 */
export function suggestPrice(
  targetMonthlyRevenue: number,
  estimatedMonthlyCallCount: number
): ParsedPrice {
  if (estimatedMonthlyCallCount <= 0) {
    return parsePrice("$0.01");
  }

  const pricePerCall = targetMonthlyRevenue / estimatedMonthlyCallCount;
  
  // Round to reasonable precision
  let roundedPrice: number;
  if (pricePerCall < 0.0001) {
    roundedPrice = Math.ceil(pricePerCall * 100000) / 100000;
  } else if (pricePerCall < 0.001) {
    roundedPrice = Math.ceil(pricePerCall * 10000) / 10000;
  } else if (pricePerCall < 0.01) {
    roundedPrice = Math.ceil(pricePerCall * 1000) / 1000;
  } else if (pricePerCall < 0.1) {
    roundedPrice = Math.ceil(pricePerCall * 100) / 100;
  } else {
    roundedPrice = Math.ceil(pricePerCall * 10) / 10;
  }

  return parsePrice(`$${roundedPrice}`);
}

/**
 * Compare prices
 */
export function comparePrices(a: string, b: string): number {
  const priceA = parsePrice(a);
  const priceB = parsePrice(b);
  return priceA.amount - priceB.amount;
}

/**
 * Validate price string
 */
export function isValidPrice(price: string): boolean {
  const parsed = parsePrice(price);
  return parsed.amount >= 0 && !isNaN(parsed.amount);
}

/**
 * Get price tier label
 */
export function getPriceTier(price: number): string {
  if (price === 0) return "Free";
  if (price < 0.001) return "Micro";
  if (price < 0.01) return "Low";
  if (price < 0.1) return "Standard";
  if (price < 1) return "Premium";
  if (price < 10) return "High";
  return "Enterprise";
}

/**
 * Format price for different contexts
 */
export function formatPriceCompact(amount: number): string {
  if (amount === 0) return "Free";
  if (amount < 0.001) return `${(amount * 10000).toFixed(1)}¢/10k`;
  if (amount < 0.01) return `${(amount * 1000).toFixed(1)}¢/1k`;
  if (amount < 0.1) return `${(amount * 100).toFixed(1)}¢`;
  if (amount < 1) return `${(amount * 100).toFixed(0)}¢`;
  return `$${amount.toFixed(2)}`;
}

/**
 * Calculate break-even point
 */
export function calculateBreakeven(
  fixedCosts: number,
  pricePerCall: number,
  variableCostPerCall: number = 0
): number {
  if (pricePerCall <= variableCostPerCall) {
    return Infinity; // Never break even
  }
  return Math.ceil(fixedCosts / (pricePerCall - variableCostPerCall));
}

/**
 * Price presets for common use cases
 */
export const PRICE_PRESETS = {
  free: { price: "$0", description: "Free tier" },
  micro: { price: "$0.0001", description: "Micropayments - high volume" },
  low: { price: "$0.001", description: "Low cost - utility APIs" },
  standard: { price: "$0.01", description: "Standard pricing" },
  premium: { price: "$0.1", description: "Premium APIs" },
  high: { price: "$1", description: "High-value endpoints" },
  enterprise: { price: "$10", description: "Enterprise operations" },
};
