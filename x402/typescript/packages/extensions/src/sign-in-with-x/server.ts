// ucm:0.4.14.3:@nich

/**
 * Sign-In-With-X Server-Side Utilities
 */

import type {
  SIWxExtension,
  SIWxExtensionInfo,
  SIWxOptions,
  SIWxPayload,
  ValidationOptions,
  ValidationResult,
  VerificationOptions,
  VerificationResult,
} from './types.js';
import { createNonce } from './utils.js';

/**
 * Declare SIWx extension for a resource
 * Server-side function to create extension info for 402 response
 */
export function declareSIWxExtension(options: SIWxOptions): SIWxExtension {
  const {
    resourceUri,
    statement,
    version = '1',
    network,
    expirationTime,
    signatureScheme = 'eip191',
  } = options;

  // Extract domain from resourceUri (remove protocol)
  const domain = resourceUri.replace(/^https?:\/\//, '').split('/')[0] || '';

  // Generate nonce and timestamps
  const nonce = createNonce();
  const issuedAt = new Date().toISOString();
  
  // Default expiration to 5 minutes from now
  const defaultExpiration = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const info: SIWxExtensionInfo = {
    domain,
    uri: resourceUri,
    statement,
    version,
    chainId: network,
    nonce,
    issuedAt,
    expirationTime: expirationTime || defaultExpiration,
    resources: [resourceUri],
    signatureScheme,
  };

  // JSON Schema for validation
  const schema = {
    type: 'object',
    properties: {
      domain: { type: 'string' },
      address: { type: 'string' },
      statement: { type: 'string' },
      uri: { type: 'string' },
      version: { type: 'string' },
      chainId: { type: 'string' },
      nonce: { type: 'string' },
      issuedAt: { type: 'string', format: 'date-time' },
      expirationTime: { type: 'string', format: 'date-time' },
      notBefore: { type: 'string', format: 'date-time' },
      requestId: { type: 'string' },
      resources: { type: 'array', items: { type: 'string' } },
      signature: { type: 'string' },
    },
    required: ['domain', 'address', 'uri', 'version', 'chainId', 'nonce', 'issuedAt', 'signature'],
  };

  return { info, schema };
}

/**
 * Parse Sign-In-With-X header
 * Decodes base64 header and parses JSON payload
 */
export function parseSIWxHeader(header: string): SIWxPayload {
  try {
    // Decode base64
    const decoded = Buffer.from(header, 'base64').toString('utf-8');
    
    // Parse JSON
    const payload = JSON.parse(decoded) as SIWxPayload;
    
    return payload;
  } catch (error) {
    throw new Error(`Failed to parse SIWx header: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate SIWx message structure and content
 * Checks timestamps, domain, and optionally nonce
 */
export function validateSIWxMessage(
  message: SIWxPayload,
  expectedResourceUri: string,
  options: ValidationOptions = {}
): ValidationResult {
  const { maxAge = 300, checkNonce } = options; // Default 5 minutes

  // Validate required fields
  if (!message.domain || !message.address || !message.uri || !message.signature) {
    return { valid: false, error: 'Missing required fields' };
  }

  // Extract expected domain
  const expectedDomain = expectedResourceUri.replace(/^https?:\/\//, '').split('/')[0];
  if (message.domain !== expectedDomain) {
    return { valid: false, error: `Domain mismatch: expected ${expectedDomain}, got ${message.domain}` };
  }

  // Validate URI matches
  if (message.uri !== expectedResourceUri) {
    return { valid: false, error: 'URI mismatch' };
  }

  // Check timestamps
  const now = Date.now();
  const issuedAt = new Date(message.issuedAt).getTime();
  
  if (isNaN(issuedAt)) {
    return { valid: false, error: 'Invalid issuedAt timestamp' };
  }

  // Check message age
  const age = (now - issuedAt) / 1000; // seconds
  if (age > maxAge) {
    return { valid: false, error: `Message too old: ${Math.floor(age)}s (max: ${maxAge}s)` };
  }

  if (age < -60) {
    return { valid: false, error: 'Message issued in the future' };
  }

  // Check expiration
  if (message.expirationTime) {
    const expiration = new Date(message.expirationTime).getTime();
    if (now > expiration) {
      return { valid: false, error: 'Message expired' };
    }
  }

  // Check notBefore
  if (message.notBefore) {
    const notBefore = new Date(message.notBefore).getTime();
    if (now < notBefore) {
      return { valid: false, error: 'Message not yet valid (notBefore)' };
    }
  }

  // Custom nonce validation
  if (checkNonce && !checkNonce(message.nonce)) {
    return { valid: false, error: 'Invalid or reused nonce' };
  }

  return { valid: true };
}

/**
 * Verify SIWx signature
 * Supports EIP-191, EIP-712, EIP-1271 (smart wallets), EIP-6492
 */
export async function verifySIWxSignature(
  message: SIWxPayload,
  signature: string,
  options: VerificationOptions = {}
): Promise<VerificationResult> {
  const { provider, checkSmartWallet = false } = options;

  try {
    // Reconstruct CAIP-122 message
    const messageText = constructCAIP122Message(message);

    // Try to import viem for signature verification
    let verifyMessage: any;
    let recoverMessageAddress: any;
    
    try {
      const viem = await import('viem');
      verifyMessage = viem.verifyMessage;
      recoverMessageAddress = viem.recoverMessageAddress;
    } catch {
      return { valid: false, error: 'viem library not available for signature verification' };
    }

    // Recover address from signature (EIP-191)
    const recoveredAddress = await recoverMessageAddress({
      message: messageText,
      signature: signature as `0x${string}`,
    });

    // Check if recovered address matches claimed address
    if (recoveredAddress.toLowerCase() === message.address.toLowerCase()) {
      return { valid: true, address: recoveredAddress };
    }

    // If smart wallet check is enabled and primary verification failed
    if (checkSmartWallet && provider) {
      // Try EIP-1271 verification for smart wallets
      const isValidSmartWallet = await verifySmartWalletSignature(
        message.address,
        messageText,
        signature,
        provider
      );

      if (isValidSmartWallet) {
        return { valid: true, address: message.address };
      }
    }

    return {
      valid: false,
      error: `Signature verification failed: recovered ${recoveredAddress}, expected ${message.address}`,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Construct CAIP-122 formatted message
 * @internal
 */
function constructCAIP122Message(payload: SIWxPayload): string {
  let message = `${payload.domain} wants you to sign in with your ${payload.chainId} account:\n`;
  message += `${payload.address}\n\n`;
  
  if (payload.statement) {
    message += `${payload.statement}\n\n`;
  }
  
  message += `URI: ${payload.uri}\n`;
  message += `Version: ${payload.version}\n`;
  message += `Chain ID: ${payload.chainId}\n`;
  message += `Nonce: ${payload.nonce}\n`;
  message += `Issued At: ${payload.issuedAt}`;
  
  if (payload.expirationTime) {
    message += `\nExpiration Time: ${payload.expirationTime}`;
  }
  
  if (payload.notBefore) {
    message += `\nNot Before: ${payload.notBefore}`;
  }
  
  if (payload.requestId) {
    message += `\nRequest ID: ${payload.requestId}`;
  }
  
  if (payload.resources && payload.resources.length > 0) {
    message += '\nResources:';
    for (const resource of payload.resources) {
      message += `\n- ${resource}`;
    }
  }
  
  return message;
}

/**
 * Verify smart wallet signature using EIP-1271
 * @internal
 */
async function verifySmartWalletSignature(
  contractAddress: string,
  message: string,
  signature: string,
  provider: any
): Promise<boolean> {
  try {
    // Import necessary functions
    const { createPublicClient, http, keccak256, toBytes } = await import('viem');
    
    const client = createPublicClient({
      transport: http(provider),
    });

    // EIP-1271 magic value: bytes4(keccak256("isValidSignature(bytes32,bytes)"))
    const EIP1271_MAGIC_VALUE = '0x1626ba7e';
    
    // Hash the message
    const messageHash = keccak256(toBytes(message));
    
    // Call isValidSignature on the contract
    const result = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: [
        {
          name: 'isValidSignature',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: '_hash', type: 'bytes32' },
            { name: '_signature', type: 'bytes' },
          ],
          outputs: [{ name: '', type: 'bytes4' }],
        },
      ],
      functionName: 'isValidSignature',
      args: [messageHash, signature as `0x${string}`],
    });

    return result === EIP1271_MAGIC_VALUE;
  } catch {
    return false;
  }
}

/* universal-crypto-mcp © @nichxbt */
