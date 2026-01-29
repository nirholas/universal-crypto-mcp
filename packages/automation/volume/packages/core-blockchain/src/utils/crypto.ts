import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { createCipheriv, createDecipheriv, randomBytes, scrypt as scryptCallback } from 'crypto';

// Promisified scrypt with proper typing
function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      keylen,
      { N: options.N, r: options.r, p: options.p },
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      }
    );
  });
}

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const SALT_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

/**
 * Generate a new BIP39 mnemonic phrase
 */
export function generateMnemonic(strength: 128 | 256 = 256): string {
  return bip39.generateMnemonic(strength);
}

/**
 * Validate a BIP39 mnemonic phrase
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Convert mnemonic to seed
 */
export async function mnemonicToSeed(mnemonic: string, passphrase?: string): Promise<Buffer> {
  return bip39.mnemonicToSeed(mnemonic, passphrase);
}

/**
 * Derive Solana keypair from seed using BIP44 path
 * Standard Solana derivation path: m/44'/501'/account'/change'
 */
export function deriveSolanaKeypair(
  seed: Buffer,
  accountIndex: number = 0
): { publicKey: string; secretKey: Uint8Array } {
  const path = `m/44'/501'/${accountIndex}'/0'`;
  const derived = derivePath(path, seed.toString('hex'));
  const keypair = nacl.sign.keyPair.fromSeed(derived.key);

  return {
    publicKey: bs58.encode(keypair.publicKey),
    secretKey: keypair.secretKey,
  };
}

/**
 * Derive EVM address from seed using BIP44 path
 * Standard ETH derivation path: m/44'/60'/0'/0/account
 */
export function deriveEVMPrivateKey(seed: Buffer, accountIndex: number = 0): string {
  // Using hdkey for EVM derivation
  const HDKey = require('hdkey');
  const hdkey = HDKey.fromMasterSeed(seed);
  const path = `m/44'/60'/0'/0/${accountIndex}`;
  const derived = hdkey.derive(path);
  return '0x' + derived.privateKey.toString('hex');
}

/**
 * Encrypt a private key using AES-256-GCM with scrypt key derivation
 */
export async function encryptPrivateKey(
  privateKey: Uint8Array | string,
  password: string
): Promise<string> {
  // Convert string private key to buffer if needed
  const keyBuffer = typeof privateKey === 'string'
    ? Buffer.from(privateKey.replace('0x', ''), 'hex')
    : Buffer.from(privateKey);

  // Generate salt and IV
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);

  // Derive encryption key using scrypt
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }) as Buffer;

  // Encrypt
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
  const encrypted = Buffer.concat([cipher.update(keyBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Combine: salt + iv + tag + encrypted
  const combined = Buffer.concat([salt, iv, tag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypt an encrypted private key
 */
export async function decryptPrivateKey(
  encryptedData: string,
  password: string
): Promise<Uint8Array> {
  const combined = Buffer.from(encryptedData, 'base64');

  // Extract components
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  // Derive key
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }) as Buffer;

  // Decrypt
  const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return new Uint8Array(decrypted);
}

/**
 * Validate a Solana address
 */
export function validateSolanaAddress(address: string): boolean {
  try {
    const decoded = bs58.decode(address);
    return decoded.length === 32;
  } catch {
    return false;
  }
}

/**
 * Validate an EVM address
 */
export function validateEVMAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate address based on type
 */
export function validateAddress(address: string, type: 'solana' | 'evm'): boolean {
  return type === 'solana' ? validateSolanaAddress(address) : validateEVMAddress(address);
}

/**
 * Format units from smallest denomination to human-readable
 */
export function formatUnits(value: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  // Remove trailing zeros
  const trimmed = fractionalStr.replace(/0+$/, '');
  return `${integerPart}.${trimmed}`;
}

/**
 * Parse units from human-readable to smallest denomination
 */
export function parseUnits(value: string, decimals: number): bigint {
  const [integerPart, fractionalPart = ''] = value.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  const combined = integerPart + paddedFractional;
  return BigInt(combined);
}

/**
 * Generate a secure random ID
 */
export function generateSecureId(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
