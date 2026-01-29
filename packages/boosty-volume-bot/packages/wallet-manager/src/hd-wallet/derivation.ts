/**
 * BIP44 Key Derivation for Solana
 * Implements HD wallet derivation following Solana's standard paths
 */

import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import type { DerivedWallet } from '../types.js';

/**
 * Solana coin type for BIP44 (501)
 */
export const SOLANA_COIN_TYPE = 501;

/**
 * Default derivation path template for Solana
 * m/44'/501'/account'/change'
 */
export const SOLANA_DERIVATION_PATH_TEMPLATE = "m/44'/501'/{account}'/0'";

/**
 * Build a Solana BIP44 derivation path
 * @param accountIndex - The account index (0-based)
 * @returns The full derivation path
 */
export function buildDerivationPath(accountIndex: number): string {
  if (accountIndex < 0 || !Number.isInteger(accountIndex)) {
    throw new Error('Account index must be a non-negative integer');
  }
  
  if (accountIndex > 2147483647) {
    throw new Error('Account index exceeds maximum allowed value');
  }
  
  return `m/44'/${SOLANA_COIN_TYPE}'/${accountIndex}'/0'`;
}

/**
 * Derive a Solana keypair from seed
 * @param seed - The master seed buffer
 * @param accountIndex - The account index to derive
 * @returns Object containing public key, secret key, and derivation path
 */
export function deriveKeypair(
  seed: Buffer,
  accountIndex: number
): {
  publicKey: string;
  secretKey: Uint8Array;
  derivationPath: string;
} {
  const derivationPath = buildDerivationPath(accountIndex);
  
  // Derive the key using ed25519-hd-key
  const derived = derivePath(derivationPath, seed.toString('hex'));
  
  // Create ed25519 keypair from the derived seed
  const keypair = nacl.sign.keyPair.fromSeed(derived.key);
  
  return {
    publicKey: bs58.encode(keypair.publicKey),
    secretKey: keypair.secretKey,
    derivationPath,
  };
}

/**
 * Derive multiple keypairs in batch
 * @param seed - The master seed buffer
 * @param startIndex - Starting account index
 * @param count - Number of keypairs to derive
 * @returns Array of derived keypairs
 */
export function deriveKeypairBatch(
  seed: Buffer,
  startIndex: number,
  count: number
): Array<{
  publicKey: string;
  secretKey: Uint8Array;
  derivationPath: string;
  index: number;
}> {
  if (count <= 0 || !Number.isInteger(count)) {
    throw new Error('Count must be a positive integer');
  }
  
  if (count > 10000) {
    throw new Error('Batch size cannot exceed 10,000 wallets');
  }
  
  const keypairs: Array<{
    publicKey: string;
    secretKey: Uint8Array;
    derivationPath: string;
    index: number;
  }> = [];
  
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const { publicKey, secretKey, derivationPath } = deriveKeypair(seed, index);
    keypairs.push({
      publicKey,
      secretKey,
      derivationPath,
      index,
    });
  }
  
  return keypairs;
}

/**
 * Get public key from secret key
 * @param secretKey - The 64-byte secret key
 * @returns The base58-encoded public key
 */
export function getPublicKeyFromSecretKey(secretKey: Uint8Array): string {
  if (secretKey.length !== 64) {
    throw new Error('Secret key must be 64 bytes');
  }
  
  // Public key is the last 32 bytes of the secret key in NaCl format
  const publicKeyBytes = secretKey.slice(32);
  return bs58.encode(publicKeyBytes);
}

/**
 * Validate a Solana address
 * @param address - The base58-encoded address
 * @returns True if valid, false otherwise
 */
export function validateSolanaAddress(address: string): boolean {
  try {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    const decoded = bs58.decode(address);
    return decoded.length === 32;
  } catch {
    return false;
  }
}

/**
 * Create a DerivedWallet object from derivation results
 * @param masterWalletId - The ID of the master wallet
 * @param index - The derivation index
 * @param publicKey - The derived public key
 * @param derivationPath - The derivation path used
 * @returns A DerivedWallet object
 */
export function createDerivedWallet(
  masterWalletId: string,
  index: number,
  publicKey: string,
  derivationPath: string
): Omit<DerivedWallet, 'id'> {
  return {
    index,
    publicKey,
    address: publicKey, // Solana address is the same as public key
    derivationPath,
    masterWalletId,
  };
}
