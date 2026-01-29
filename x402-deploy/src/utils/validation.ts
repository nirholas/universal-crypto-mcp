/**
 * Validation Utilities - Comprehensive input validation
 * Ensures data integrity across x402 configuration
 */

import { z } from "zod";

/**
 * Ethereum address validation
 */
export const EthereumAddressSchema = z.string().regex(
  /^0x[a-fA-F0-9]{40}$/,
  "Invalid Ethereum address format"
);

export function isValidEthereumAddress(address: string): boolean {
  return EthereumAddressSchema.safeParse(address).success;
}

/**
 * Chain ID validation (CAIP-2 format)
 */
export const ChainIdSchema = z.string().regex(
  /^eip155:\d+$/,
  "Invalid chain ID format. Use eip155:CHAIN_NUMBER"
);

export function isValidChainId(chainId: string): boolean {
  return ChainIdSchema.safeParse(chainId).success;
}

/**
 * Price string validation
 */
export const PriceSchema = z.string().refine(
  (price) => {
    // Match: $0.01, 0.01, 0.01 USDC, 1e-6
    return /^(\$?\d+\.?\d*|\d+\.?\d*\s*\w+|\d+\.?\d*e[+-]?\d+)$/.test(price.trim());
  },
  "Invalid price format. Examples: $0.01, 0.001, 0.01 USDC"
);

export function isValidPrice(price: string): boolean {
  return PriceSchema.safeParse(price).success;
}

/**
 * Route pattern validation
 */
export const RoutePatternSchema = z.string().refine(
  (route) => {
    // Match: GET /api/*, POST /users/:id, /api/v1/**, etc.
    return /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|\*)?\s*\/[\w\-\/:\*\{\}\.]+$/.test(route.trim());
  },
  "Invalid route pattern. Examples: GET /api/*, POST /users/:id"
);

export function isValidRoutePattern(route: string): boolean {
  return RoutePatternSchema.safeParse(route).success;
}

/**
 * URL validation
 */
export const UrlSchema = z.string().url("Invalid URL format");

export function isValidUrl(url: string): boolean {
  return UrlSchema.safeParse(url).success;
}

/**
 * Project name validation
 */
export const ProjectNameSchema = z.string()
  .min(1, "Project name is required")
  .max(100, "Project name too long")
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9\-_\.]*$/, "Invalid project name. Use alphanumeric characters, hyphens, underscores, and dots");

export function isValidProjectName(name: string): boolean {
  return ProjectNameSchema.safeParse(name).success;
}

/**
 * Token symbol validation
 */
export const TokenSymbolSchema = z.string()
  .min(1, "Token symbol is required")
  .max(10, "Token symbol too long")
  .regex(/^[A-Za-z]+$/, "Invalid token symbol");

export function isValidTokenSymbol(symbol: string): boolean {
  return TokenSymbolSchema.safeParse(symbol).success;
}

/**
 * Environment name validation
 */
export const EnvironmentSchema = z.enum(["development", "staging", "production", "local", "test"]);

export function isValidEnvironment(env: string): boolean {
  return EnvironmentSchema.safeParse(env).success;
}

/**
 * Semantic version validation
 */
export const SemVerSchema = z.string().regex(
  /^\d+\.\d+\.\d+(-[a-zA-Z0-9\.\-]+)?(\+[a-zA-Z0-9\.\-]+)?$/,
  "Invalid semantic version"
);

export function isValidSemVer(version: string): boolean {
  return SemVerSchema.safeParse(version).success;
}

/**
 * Validate full configuration object
 */
export function validateConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!config.name) {
    errors.push("Missing project name");
  } else if (!isValidProjectName(config.name)) {
    errors.push("Invalid project name format");
  }

  if (!config.payment?.wallet) {
    errors.push("Missing wallet address");
  } else if (!isValidEthereumAddress(config.payment.wallet)) {
    errors.push("Invalid wallet address format");
  }

  if (!config.payment?.network) {
    errors.push("Missing network configuration");
  } else if (!isValidChainId(config.payment.network)) {
    errors.push("Invalid network chain ID format");
  }

  // Optional validations
  if (config.payment?.facilitator && !isValidUrl(config.payment.facilitator)) {
    errors.push("Invalid facilitator URL");
  }

  if (config.pricing?.default && !isValidPrice(config.pricing.default)) {
    errors.push("Invalid default price format");
  }

  if (config.pricing?.routes) {
    for (const [route, pricing] of Object.entries(config.pricing.routes)) {
      if (!isValidRoutePattern(route)) {
        errors.push(`Invalid route pattern: ${route}`);
      }
      
      const priceStr = typeof pricing === "string" ? pricing : (pricing as any)?.price;
      if (priceStr && !isValidPrice(priceStr)) {
        errors.push(`Invalid price for route ${route}: ${priceStr}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string, options: {
  maxLength?: number;
  allowedChars?: RegExp;
  trim?: boolean;
} = {}): string {
  const {
    maxLength = 1000,
    allowedChars = /[^a-zA-Z0-9\s\-_\.\/\:\*\$\@]/g,
    trim = true,
  } = options;

  let sanitized = input;
  
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  sanitized = sanitized.replace(allowedChars, "");
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate and normalize wallet address
 */
export function normalizeAddress(address: string): string | null {
  const cleaned = address.trim().toLowerCase();
  
  if (!isValidEthereumAddress(cleaned)) {
    // Try adding 0x prefix
    const withPrefix = "0x" + cleaned.replace(/^0x/i, "");
    if (isValidEthereumAddress(withPrefix)) {
      return withPrefix;
    }
    return null;
  }
  
  return cleaned;
}

/**
 * Validate and normalize chain ID
 */
export function normalizeChainId(chainId: string): string | null {
  const cleaned = chainId.trim().toLowerCase();
  
  // Handle just number
  if (/^\d+$/.test(cleaned)) {
    return `eip155:${cleaned}`;
  }
  
  // Handle full format
  if (isValidChainId(cleaned)) {
    return cleaned;
  }
  
  // Handle common names
  const chainNameMap: Record<string, string> = {
    "ethereum": "eip155:1",
    "mainnet": "eip155:1",
    "arbitrum": "eip155:42161",
    "base": "eip155:8453",
    "base-sepolia": "eip155:84532",
    "optimism": "eip155:10",
    "polygon": "eip155:137",
  };
  
  if (chainNameMap[cleaned]) {
    return chainNameMap[cleaned];
  }
  
  return null;
}

/**
 * Validate and normalize price
 */
export function normalizePrice(price: string): string | null {
  const cleaned = price.trim();
  
  // Already in dollar format
  if (/^\$\d+\.?\d*$/.test(cleaned)) {
    return cleaned;
  }
  
  // Plain number
  if (/^\d+\.?\d*$/.test(cleaned)) {
    return `$${cleaned}`;
  }
  
  // Scientific notation
  if (/^\d+\.?\d*e[+-]?\d+$/i.test(cleaned)) {
    const value = parseFloat(cleaned);
    if (!isNaN(value)) {
      return `$${value}`;
    }
  }
  
  // Token suffix
  const tokenMatch = cleaned.match(/^(\d+\.?\d*)\s*(USDC|USDT|DAI)$/i);
  if (tokenMatch) {
    return `$${tokenMatch[1]}`;
  }
  
  return null;
}

/**
 * Detailed validation result type
 */
export interface ValidationResult {
  field: string;
  value: any;
  valid: boolean;
  error?: string;
  suggestion?: string;
  normalized?: any;
}

/**
 * Validate multiple fields at once
 */
export function validateFields(fields: Array<{
  name: string;
  value: any;
  validator: (value: any) => boolean;
  normalizer?: (value: any) => any;
  errorMessage?: string;
  required?: boolean;
}>): ValidationResult[] {
  return fields.map(field => {
    const result: ValidationResult = {
      field: field.name,
      value: field.value,
      valid: true,
    };

    // Check required
    if (field.required && (field.value === undefined || field.value === null || field.value === "")) {
      result.valid = false;
      result.error = `${field.name} is required`;
      return result;
    }

    // Skip validation if empty and not required
    if (!field.required && (field.value === undefined || field.value === null || field.value === "")) {
      return result;
    }

    // Validate
    if (!field.validator(field.value)) {
      result.valid = false;
      result.error = field.errorMessage || `Invalid ${field.name}`;
      
      // Try to normalize for suggestion
      if (field.normalizer) {
        const normalized = field.normalizer(field.value);
        if (normalized !== null) {
          result.suggestion = `Did you mean: ${normalized}?`;
          result.normalized = normalized;
        }
      }
    } else if (field.normalizer) {
      result.normalized = field.normalizer(field.value);
    }

    return result;
  });
}
