// ucm:0.4.14.3:@nich

/**
 * Sign-In-With-X Extension Types
 * CAIP-122 Compliant Identity Assertion
 */

export interface SIWxExtensionInfo {
  /** Domain extracted from resourceUri */
  domain: string;
  /** Full resource URI */
  uri: string;
  /** Optional statement explaining what signing means */
  statement?: string;
  /** CAIP-122 version (defaults to "1") */
  version: string;
  /** Chain identifier in CAIP-2 format (e.g., "eip155:8453" for Base) */
  chainId: string;
  /** Cryptographically secure random nonce */
  nonce: string;
  /** ISO 8601 timestamp when message was issued */
  issuedAt: string;
  /** Optional expiration time */
  expirationTime?: string;
  /** Optional not-before time */
  notBefore?: string;
  /** Optional request identifier */
  requestId?: string;
  /** Array of resources (auto-populated with resourceUri) */
  resources: string[];
  /** Signature scheme used */
  signatureScheme?: string;
}

export interface SIWxExtension {
  info: SIWxExtensionInfo;
  schema: Record<string, any>;
}

export interface SIWxPayload {
  /** Domain from the server */
  domain: string;
  /** Wallet address */
  address: string;
  /** Optional statement */
  statement?: string;
  /** Resource URI */
  uri: string;
  /** CAIP-122 version */
  version: string;
  /** Chain ID */
  chainId: string;
  /** Nonce for replay protection */
  nonce: string;
  /** Timestamp when issued */
  issuedAt: string;
  /** Optional expiration */
  expirationTime?: string;
  /** Optional not-before */
  notBefore?: string;
  /** Optional request ID */
  requestId?: string;
  /** Resources array */
  resources?: string[];
  /** Cryptographic signature */
  signature: string;
}

export interface SIWxOptions {
  /** Full URI of the resource */
  resourceUri: string;
  /** Optional statement */
  statement?: string;
  /** CAIP-122 version */
  version?: string;
  /** Network in CAIP-2 format */
  network: `${string}:${string}`;
  /** Optional expiration time (defaults to +5 minutes) */
  expirationTime?: string;
  /** Signature scheme */
  signatureScheme?: 'eip191' | 'eip712' | 'eip1271' | 'eip6492' | 'siws' | 'sep10';
}

export interface ValidationOptions {
  /** Maximum age of message in seconds */
  maxAge?: number;
  /** Custom nonce validator */
  checkNonce?: (nonce: string) => boolean;
}

export interface VerificationOptions {
  /** Web3 provider for on-chain verification */
  provider?: any;
  /** Enable smart wallet verification (EIP-1271/6492) */
  checkSmartWallet?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface VerificationResult {
  valid: boolean;
  address?: string;
  error?: string;
}

/* universal-crypto-mcp © @nichxbt */
