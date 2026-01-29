/**
 * Key Vault implementation
 * Secure storage and retrieval of private keys
 */

import type {
  KeyVault as IKeyVault,
  StoredKey,
  WalletErrorCode,
  AuditAction,
} from '../types.js';
import { WalletManagerError } from '../types.js';
import {
  encryptData,
  decryptData,
  validatePassword,
  clearSensitiveData,
} from './encryption.js';

/**
 * In-memory key storage
 * In production, this would be backed by a secure database or HSM
 */
interface InMemoryKeyStore {
  keys: Map<string, StoredKey>;
  masterPassword?: string;
}

const keyStore: InMemoryKeyStore = {
  keys: new Map(),
};

/**
 * Audit log function type
 */
type AuditLogFn = (action: AuditAction, walletId: string | undefined, success: boolean, error?: string) => void;

/**
 * Key Vault implementation
 */
export class KeyVaultImpl implements IKeyVault {
  private auditLog?: AuditLogFn;

  constructor(options?: { auditLog?: AuditLogFn }) {
    this.auditLog = options?.auditLog;
  }

  /**
   * Log an audit event
   */
  private log(action: AuditAction, walletId: string | undefined, success: boolean, error?: string): void {
    if (this.auditLog) {
      this.auditLog(action, walletId, success, error);
    }
  }

  /**
   * Store a private key securely
   * @param walletId - The wallet ID
   * @param privateKey - The private key to store
   * @param password - The encryption password
   */
  async storeKey(walletId: string, privateKey: Uint8Array, password: string): Promise<void> {
    try {
      validatePassword(password);

      if (keyStore.keys.has(walletId)) {
        throw new WalletManagerError(
          'WALLET_ALREADY_EXISTS' as WalletErrorCode,
          'A key already exists for this wallet ID'
        );
      }

      // Encrypt the private key
      const encryptedKey = await encryptData(privateKey, password);

      // Store the key
      const storedKey: StoredKey = {
        walletId,
        encryptedKey,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        accessCount: 0,
      };

      keyStore.keys.set(walletId, storedKey);

      // Clear the original key from memory
      clearSensitiveData(privateKey);

      this.log('key_store', walletId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('key_store', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * Retrieve a private key
   * @param walletId - The wallet ID
   * @param password - The decryption password
   * @returns The decrypted private key
   */
  async retrieveKey(walletId: string, password: string): Promise<Uint8Array> {
    try {
      const storedKey = keyStore.keys.get(walletId);

      if (!storedKey) {
        throw new WalletManagerError(
          'KEY_NOT_FOUND' as WalletErrorCode,
          'No key found for the specified wallet ID'
        );
      }

      // Decrypt the key
      const privateKey = await decryptData(storedKey.encryptedKey, password);

      // Update access tracking
      storedKey.lastAccessedAt = new Date();
      storedKey.accessCount++;

      this.log('key_access', walletId, true);

      return privateKey;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('key_access', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * Rotate the encryption for a stored key
   * @param walletId - The wallet ID
   * @param oldPassword - The current password
   * @param newPassword - The new password
   */
  async rotateEncryption(
    walletId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      validatePassword(newPassword);

      // Retrieve with old password
      const privateKey = await this.retrieveKey(walletId, oldPassword);

      // Re-encrypt with new password
      const newEncryptedKey = await encryptData(privateKey, newPassword);

      // Update stored key
      const storedKey = keyStore.keys.get(walletId);
      if (storedKey) {
        storedKey.encryptedKey = newEncryptedKey;
      }

      // Clear the decrypted key
      clearSensitiveData(privateKey);

      this.log('key_rotate', walletId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('key_rotate', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * Delete a stored key
   * @param walletId - The wallet ID
   * @param password - The password (to verify ownership)
   */
  async deleteKey(walletId: string, password: string): Promise<void> {
    try {
      // Verify the password first by attempting to decrypt
      await this.retrieveKey(walletId, password);

      // Delete the key
      keyStore.keys.delete(walletId);

      this.log('key_delete', walletId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('key_delete', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * List all wallet IDs in the vault
   * @returns Array of wallet IDs
   */
  async listWalletIds(): Promise<string[]> {
    return Array.from(keyStore.keys.keys());
  }

  /**
   * Check if a key exists for a wallet
   * @param walletId - The wallet ID
   * @returns True if the key exists
   */
  async hasKey(walletId: string): Promise<boolean> {
    return keyStore.keys.has(walletId);
  }

  /**
   * Export the entire vault (encrypted)
   * @param password - The export password
   * @returns The encrypted vault as a string
   */
  async exportVault(password: string): Promise<string> {
    try {
      validatePassword(password);

      // Serialize all keys
      const keysArray = Array.from(keyStore.keys.entries()).map(([id, key]) => ({
        id,
        encryptedKey: key.encryptedKey,
        createdAt: key.createdAt.toISOString(),
      }));

      const vaultData = JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        keys: keysArray,
      });

      // Encrypt the vault data
      const encryptedVault = await encryptData(
        new TextEncoder().encode(vaultData),
        password
      );

      this.log('export_vault', undefined, true);

      return encryptedVault;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('export_vault', undefined, false, errorMessage);
      throw error;
    }
  }

  /**
   * Import a vault from encrypted backup
   * @param encrypted - The encrypted vault
   * @param password - The password
   */
  async importVault(encrypted: string, password: string): Promise<void> {
    try {
      // Decrypt the vault
      const decryptedBytes = await decryptData(encrypted, password);
      const vaultData = JSON.parse(new TextDecoder().decode(decryptedBytes));

      if (vaultData.version !== 1) {
        throw new WalletManagerError(
          'DECRYPTION_FAILED' as WalletErrorCode,
          'Unsupported vault version'
        );
      }

      // Import all keys
      for (const keyData of vaultData.keys) {
        if (!keyStore.keys.has(keyData.id)) {
          keyStore.keys.set(keyData.id, {
            walletId: keyData.id,
            encryptedKey: keyData.encryptedKey,
            createdAt: new Date(keyData.createdAt),
            lastAccessedAt: new Date(),
            accessCount: 0,
          });
        }
      }

      this.log('import_vault', undefined, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('import_vault', undefined, false, errorMessage);
      throw error;
    }
  }

  /**
   * Get the count of stored keys
   * @returns The number of keys in the vault
   */
  getKeyCount(): number {
    return keyStore.keys.size;
  }

  /**
   * Clear all keys from the vault (use with caution!)
   */
  clearAll(): void {
    keyStore.keys.clear();
  }
}

/**
 * Export a singleton instance
 */
export const keyVault = new KeyVaultImpl();
