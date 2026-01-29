/**
 * Mnemonic generation and validation utilities
 * Implements BIP39 standard for Solana wallets
 */

import * as bip39 from 'bip39';
import type { MnemonicStrength } from '../types.js';

/**
 * Generate a new BIP39 mnemonic phrase
 * @param strength - 128 for 12 words, 256 for 24 words
 * @returns The generated mnemonic phrase
 */
export function generateMnemonic(strength: MnemonicStrength = 256): string {
  return bip39.generateMnemonic(strength);
}

/**
 * Validate a BIP39 mnemonic phrase
 * @param mnemonic - The mnemonic to validate
 * @returns True if valid, false otherwise
 */
export function validateMnemonic(mnemonic: string): boolean {
  if (!mnemonic || typeof mnemonic !== 'string') {
    return false;
  }
  
  const words = mnemonic.trim().split(/\s+/);
  
  // Must be 12, 15, 18, 21, or 24 words
  const validWordCounts = [12, 15, 18, 21, 24];
  if (!validWordCounts.includes(words.length)) {
    return false;
  }
  
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Convert mnemonic to seed buffer
 * @param mnemonic - The mnemonic phrase
 * @param passphrase - Optional passphrase for additional security
 * @returns The seed buffer
 */
export async function mnemonicToSeed(
  mnemonic: string,
  passphrase?: string
): Promise<Buffer> {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }
  
  return bip39.mnemonicToSeed(mnemonic, passphrase || '');
}

/**
 * Convert mnemonic to entropy (for secure storage)
 * @param mnemonic - The mnemonic phrase
 * @returns The entropy as a hex string
 */
export function mnemonicToEntropy(mnemonic: string): string {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }
  
  return bip39.mnemonicToEntropy(mnemonic);
}

/**
 * Convert entropy back to mnemonic
 * @param entropy - The entropy as a hex string
 * @returns The mnemonic phrase
 */
export function entropyToMnemonic(entropy: string): string {
  return bip39.entropyToMnemonic(entropy);
}

/**
 * Get word count from mnemonic
 * @param mnemonic - The mnemonic phrase
 * @returns The number of words
 */
export function getWordCount(mnemonic: string): number {
  if (!mnemonic || typeof mnemonic !== 'string') {
    return 0;
  }
  return mnemonic.trim().split(/\s+/).length;
}

/**
 * Normalize a mnemonic (lowercase, single spaces)
 * @param mnemonic - The mnemonic to normalize
 * @returns The normalized mnemonic
 */
export function normalizeMnemonic(mnemonic: string): string {
  if (!mnemonic || typeof mnemonic !== 'string') {
    return '';
  }
  return mnemonic.trim().toLowerCase().split(/\s+/).join(' ');
}
