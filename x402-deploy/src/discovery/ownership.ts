/**
 * Ownership Proof Generation and Verification
 *
 * Ownership proofs are EIP-191 signatures that prove the operator
 * of a service controls the payment wallet address.
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, base, baseSepolia, mainnet, optimism, polygon } from "viem/chains";

/**
 * Supported networks for ownership proofs
 */
const SUPPORTED_CHAINS: Record<string, typeof arbitrum> = {
  "eip155:1": mainnet,
  "eip155:42161": arbitrum,
  "eip155:8453": base,
  "eip155:84532": baseSepolia,
  "eip155:137": polygon,
  "eip155:10": optimism,
};

/**
 * Ownership proof structure
 */
export interface OwnershipProof {
  /** The origin URL that was signed */
  origin: string;
  /** The EIP-191 signature */
  signature: Hex;
  /** The signer's address */
  address: Address;
  /** Network identifier (CAIP-2) */
  network: string;
  /** Timestamp when proof was generated */
  timestamp: number;
}

/**
 * Options for generating ownership proofs
 */
export interface GenerateProofOptions {
  /** Include timestamp in the message */
  includeTimestamp?: boolean;
  /** Custom message prefix */
  messagePrefix?: string;
}

/**
 * Generate an ownership proof for a service origin
 *
 * This creates an EIP-191 signature proving that the private key holder
 * controls both the service and the payment wallet.
 *
 * @param origin - The service origin URL (e.g., "https://api.example.com")
 * @param privateKey - The wallet private key
 * @param network - The network identifier (CAIP-2 format)
 * @param options - Optional configuration
 * @returns The ownership proof with signature
 *
 * @example
 * ```typescript
 * const proof = await generateOwnershipProof(
 *   "https://api.example.com",
 *   "0x...",
 *   "eip155:42161"
 * );
 * ```
 */
export async function generateOwnershipProof(
  origin: string,
  privateKey: Hex,
  network: string,
  options: GenerateProofOptions = {}
): Promise<OwnershipProof> {
  // Validate network
  const chain = SUPPORTED_CHAINS[network];
  if (!chain) {
    throw new Error(
      `Unsupported network: ${network}. Supported: ${Object.keys(SUPPORTED_CHAINS).join(", ")}`
    );
  }

  // Create account from private key
  const account = privateKeyToAccount(privateKey);

  // Create wallet client
  const client = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  // Build the message to sign
  const timestamp = Date.now();
  const message = buildOwnershipMessage(origin, options.includeTimestamp ? timestamp : undefined, options.messagePrefix);

  // Sign the message
  const signature = await client.signMessage({
    message,
  });

  return {
    origin,
    signature,
    address: account.address,
    network,
    timestamp,
  };
}

/**
 * Build the ownership message to be signed
 */
function buildOwnershipMessage(
  origin: string,
  timestamp?: number,
  prefix?: string
): string {
  const parts: string[] = [];

  if (prefix) {
    parts.push(prefix);
  } else {
    parts.push("x402 Ownership Proof");
  }

  parts.push(`Origin: ${origin}`);

  if (timestamp) {
    parts.push(`Timestamp: ${timestamp}`);
  }

  return parts.join("\n");
}

/**
 * Verify an ownership proof
 *
 * @param proof - The ownership proof to verify
 * @param expectedAddress - The expected signer address
 * @returns True if the proof is valid
 */
export async function verifyOwnershipProof(
  proof: OwnershipProof,
  expectedAddress?: Address
): Promise<boolean> {
  try {
    const chain = SUPPORTED_CHAINS[proof.network];
    if (!chain) {
      return false;
    }

    const client = createPublicClient({
      chain,
      transport: http(),
    });

    // Reconstruct the message
    const message = buildOwnershipMessage(proof.origin);

    // Verify the signature
    const isValid = await client.verifyMessage({
      address: proof.address,
      message,
      signature: proof.signature,
    });

    if (!isValid) {
      return false;
    }

    // Check expected address if provided
    if (expectedAddress && proof.address.toLowerCase() !== expectedAddress.toLowerCase()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Verify an ownership proof signature directly
 *
 * @param origin - The origin URL that was signed
 * @param signature - The signature to verify
 * @param expectedAddress - The expected signer address
 * @param network - The network identifier
 * @returns True if valid
 */
export async function verifyOwnershipSignature(
  origin: string,
  signature: Hex,
  expectedAddress: Address,
  network: string = "eip155:42161"
): Promise<boolean> {
  const proof: OwnershipProof = {
    origin,
    signature,
    address: expectedAddress,
    network,
    timestamp: 0,
  };

  return verifyOwnershipProof(proof, expectedAddress);
}

/**
 * Recover the signer address from an ownership proof
 *
 * @param origin - The origin URL that was signed
 * @param signature - The signature
 * @param network - The network identifier
 * @returns The recovered address
 */
export async function recoverOwnershipAddress(
  origin: string,
  signature: Hex,
  network: string = "eip155:42161"
): Promise<Address> {
  const { recoverMessageAddress } = await import("viem");

  const message = buildOwnershipMessage(origin);

  const address = await recoverMessageAddress({
    message,
    signature,
  });

  return address;
}

/**
 * Generate multiple ownership proofs for different origins
 */
export async function generateMultipleProofs(
  origins: string[],
  privateKey: Hex,
  network: string
): Promise<OwnershipProof[]> {
  const proofs: OwnershipProof[] = [];

  for (const origin of origins) {
    const proof = await generateOwnershipProof(origin, privateKey, network);
    proofs.push(proof);
  }

  return proofs;
}

/**
 * Serialize an ownership proof for storage or transmission
 */
export function serializeProof(proof: OwnershipProof): string {
  return JSON.stringify(proof);
}

/**
 * Parse a serialized ownership proof
 */
export function parseProof(serialized: string): OwnershipProof {
  return JSON.parse(serialized) as OwnershipProof;
}

/**
 * Get the signature only (for use in discovery documents)
 */
export function getProofSignature(proof: OwnershipProof): Hex {
  return proof.signature;
}
