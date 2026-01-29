/**
 * HD Wallet Factory
 * Creates and manages hierarchical deterministic wallets for Solana
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  HDWalletFactory as IHDWalletFactory,
  MasterWallet,
  DerivedWallet,
  MnemonicStrength,
  WalletErrorCode,
} from '../types.js';
import { WalletManagerError } from '../types.js';
import {
  generateMnemonic as genMnemonic,
  validateMnemonic as validateMnemonicFn,
  mnemonicToSeed,
  normalizeMnemonic,
} from './mnemonic.js';
import {
  deriveKeypair,
  deriveKeypairBatch,
  createDerivedWallet,
} from './derivation.js';
import {
  encryptData,
  decryptData,
} from '../vault/encryption.js';

/**
 * In-memory storage for master wallet seeds
 * In production, this would be stored securely in the KeyVault
 */
const masterWalletSeeds = new Map<string, Buffer>();

/**
 * HD Wallet Factory implementation
 */
export class HDWalletFactoryImpl implements IHDWalletFactory {
  /**
   * Generate a new BIP39 mnemonic phrase
   * @param strength - 128 for 12 words, 256 for 24 words (default)
   * @returns The generated mnemonic phrase
   */
  generateMnemonic(strength: MnemonicStrength = 256): string {
    return genMnemonic(strength);
  }

  /**
   * Validate a BIP39 mnemonic phrase
   * @param mnemonic - The mnemonic to validate
   * @returns True if valid, false otherwise
   */
  validateMnemonic(mnemonic: string): boolean {
    return validateMnemonicFn(mnemonic);
  }

  /**
   * Create a master wallet from a mnemonic
   * @param mnemonic - The BIP39 mnemonic phrase
   * @param passphrase - Optional passphrase for additional security
   * @returns The created master wallet
   */
  async createMasterWallet(
    mnemonic: string,
    passphrase?: string
  ): Promise<MasterWallet> {
    const normalizedMnemonic = normalizeMnemonic(mnemonic);
    
    if (!this.validateMnemonic(normalizedMnemonic)) {
      throw new WalletManagerError(
        'INVALID_MNEMONIC' as WalletErrorCode,
        'Invalid mnemonic phrase provided'
      );
    }

    // Derive the master seed
    const seed = await mnemonicToSeed(normalizedMnemonic, passphrase);
    
    // Derive the master public key (account 0) for identification
    const { publicKey } = deriveKeypair(seed, 0);
    
    const masterWallet: MasterWallet = {
      id: uuidv4(),
      publicKey,
      createdAt: new Date(),
      derivedCount: 0,
    };

    // Store the seed in memory (in production, encrypt and store in KeyVault)
    masterWalletSeeds.set(masterWallet.id, seed);

    return masterWallet;
  }

  /**
   * Derive a single wallet from a master wallet
   * @param master - The master wallet
   * @param index - The derivation index
   * @returns The derived wallet
   */
  async deriveWallet(master: MasterWallet, index: number): Promise<DerivedWallet> {
    const seed = masterWalletSeeds.get(master.id);
    
    if (!seed) {
      throw new WalletManagerError(
        'KEY_NOT_FOUND' as WalletErrorCode,
        'Master wallet seed not found. The wallet may need to be re-imported.'
      );
    }

    const { publicKey, derivationPath } = deriveKeypair(seed, index);
    
    const derivedWallet: DerivedWallet = {
      id: uuidv4(),
      ...createDerivedWallet(master.id, index, publicKey, derivationPath),
    };

    return derivedWallet;
  }

  /**
   * Derive multiple wallets in batch from a master wallet
   * @param master - The master wallet
   * @param startIndex - Starting derivation index
   * @param count - Number of wallets to derive
   * @returns Array of derived wallets
   */
  async deriveWalletBatch(
    master: MasterWallet,
    startIndex: number,
    count: number
  ): Promise<DerivedWallet[]> {
    const seed = masterWalletSeeds.get(master.id);
    
    if (!seed) {
      throw new WalletManagerError(
        'KEY_NOT_FOUND' as WalletErrorCode,
        'Master wallet seed not found. The wallet may need to be re-imported.'
      );
    }

    if (count > 10000) {
      throw new WalletManagerError(
        'DERIVATION_FAILED' as WalletErrorCode,
        'Cannot derive more than 10,000 wallets in a single batch'
      );
    }

    const keypairs = deriveKeypairBatch(seed, startIndex, count);
    
    return keypairs.map(({ publicKey, derivationPath, index }) => ({
      id: uuidv4(),
      ...createDerivedWallet(master.id, index, publicKey, derivationPath),
    }));
  }

  /**
   * Export the mnemonic for a master wallet (encrypted)
   * @param master - The master wallet
   * @param password - Password for encryption
   * @returns The encrypted mnemonic
   */
  async exportMnemonic(_master: MasterWallet, _password: string): Promise<string> {
    // In a full implementation, we would retrieve the mnemonic from secure storage
    // For now, we throw an error since we only store the seed
    throw new WalletManagerError(
      'KEY_NOT_FOUND' as WalletErrorCode,
      'Mnemonic export requires the original mnemonic to be stored. ' +
      'Use the encrypted mnemonic backup from wallet creation.'
    );
  }

  /**
   * Import a master wallet from an encrypted mnemonic
   * @param encrypted - The encrypted mnemonic
   * @param password - Password for decryption
   * @returns The imported master wallet
   */
  async importMnemonic(encrypted: string, password: string): Promise<MasterWallet> {
    try {
      const decryptedBytes = await decryptData(encrypted, password);
      const mnemonic = new TextDecoder().decode(decryptedBytes);
      
      if (!this.validateMnemonic(mnemonic)) {
        throw new WalletManagerError(
          'DECRYPTION_FAILED' as WalletErrorCode,
          'Decrypted data is not a valid mnemonic. Check your password.'
        );
      }
      
      return this.createMasterWallet(mnemonic);
    } catch (error) {
      if (error instanceof WalletManagerError) {
        throw error;
      }
      throw new WalletManagerError(
        'DECRYPTION_FAILED' as WalletErrorCode,
        'Failed to decrypt mnemonic. Check your password.'
      );
    }
  }

  /**
   * Create an encrypted backup of a mnemonic
   * @param mnemonic - The mnemonic to backup
   * @param password - Password for encryption
   * @returns The encrypted backup string
   */
  async createMnemonicBackup(mnemonic: string, password: string): Promise<string> {
    if (!this.validateMnemonic(mnemonic)) {
      throw new WalletManagerError(
        'INVALID_MNEMONIC' as WalletErrorCode,
        'Invalid mnemonic phrase'
      );
    }

    const normalizedMnemonic = normalizeMnemonic(mnemonic);
    const mnemonicBytes = new TextEncoder().encode(normalizedMnemonic);
    
    return encryptData(mnemonicBytes, password);
  }

  /**
   * Get the secret key for a derived wallet (for signing)
   * This should be used internally and the key should never be exposed
   * @param master - The master wallet
   * @param index - The derivation index
   * @returns The secret key
   */
  async getSecretKey(master: MasterWallet, index: number): Promise<Uint8Array> {
    const seed = masterWalletSeeds.get(master.id);
    
    if (!seed) {
      throw new WalletManagerError(
        'KEY_NOT_FOUND' as WalletErrorCode,
        'Master wallet seed not found'
      );
    }

    const { secretKey } = deriveKeypair(seed, index);
    return secretKey;
  }

  /**
   * Remove a master wallet from memory (for security)
   * @param masterId - The master wallet ID
   */
  clearMasterWallet(masterId: string): void {
    const seed = masterWalletSeeds.get(masterId);
    if (seed) {
      // Attempt to clear the buffer (best effort in JS)
      seed.fill(0);
      masterWalletSeeds.delete(masterId);
    }
  }

  /**
   * Check if a master wallet is loaded in memory
   * @param masterId - The master wallet ID
   * @returns True if loaded
   */
  isMasterWalletLoaded(masterId: string): boolean {
    return masterWalletSeeds.has(masterId);
  }
}

/**
 * Export a singleton instance
 */
export const hdWalletFactory = new HDWalletFactoryImpl();
