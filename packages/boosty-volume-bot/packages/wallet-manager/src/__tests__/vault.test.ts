/**
 * Vault / Encryption Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validatePassword,
  encryptData,
  decryptData,
  generateRandomKey,
  secureCompare,
  clearSensitiveData,
  MIN_PASSWORD_LENGTH,
  KeyVaultImpl,
} from '../vault/index.js';
import { WalletManagerError } from '../types.js';

describe('Password Validation', () => {
  it('accepts valid password', () => {
    expect(() => validatePassword('MySecurePassword123!')).not.toThrow();
    expect(() => validatePassword('Abcd1234!@#$')).not.toThrow();
  });

  it('rejects password too short', () => {
    expect(() => validatePassword('Short1!')).toThrow('at least');
  });

  it('rejects password without uppercase', () => {
    expect(() => validatePassword('mysecurepassword123!')).toThrow('uppercase');
  });

  it('rejects password without lowercase', () => {
    expect(() => validatePassword('MYSECUREPASSWORD123!')).toThrow('lowercase');
  });

  it('rejects password without number', () => {
    expect(() => validatePassword('MySecurePassword!!!')).toThrow('number');
  });

  it('rejects password without special character', () => {
    expect(() => validatePassword('MySecurePassword123')).toThrow('special');
  });

  it('rejects empty password', () => {
    expect(() => validatePassword('')).toThrow();
  });
});

describe('Encryption', () => {
  const password = 'MySecurePassword123!';
  const testData = new TextEncoder().encode('Hello, World!');

  it('encrypts and decrypts data correctly', async () => {
    const encrypted = await encryptData(testData, password);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');
    
    const decrypted = await decryptData(encrypted, password);
    expect(decrypted).toEqual(testData);
  });

  it('produces different ciphertext for same plaintext', async () => {
    const encrypted1 = await encryptData(testData, password);
    const encrypted2 = await encryptData(testData, password);
    
    // Should be different due to random salt/IV
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('fails to decrypt with wrong password', async () => {
    const encrypted = await encryptData(testData, password);
    
    await expect(decryptData(encrypted, 'WrongPassword123!')).rejects.toThrow();
  });

  it('fails to decrypt corrupted data', async () => {
    const encrypted = await encryptData(testData, password);
    const corrupted = encrypted.slice(0, -5) + 'XXXXX';
    
    await expect(decryptData(corrupted, password)).rejects.toThrow();
  });

  it('encrypts large data', async () => {
    const largeData = new Uint8Array(100000).fill(42);
    const encrypted = await encryptData(largeData, password);
    const decrypted = await decryptData(encrypted, password);
    
    expect(decrypted).toEqual(largeData);
  });

  it('encrypts binary data', async () => {
    const binaryData = new Uint8Array([0, 1, 255, 128, 64, 32, 16, 8, 4, 2, 1]);
    const encrypted = await encryptData(binaryData, password);
    const decrypted = await decryptData(encrypted, password);
    
    expect(decrypted).toEqual(binaryData);
  });
});

describe('Utility Functions', () => {
  it('generates random key', () => {
    const key1 = generateRandomKey();
    const key2 = generateRandomKey();
    
    expect(key1).toBeInstanceOf(Uint8Array);
    expect(key1.length).toBe(32);
    expect(key1).not.toEqual(key2);
  });

  it('securely compares equal buffers', () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 4]);
    
    expect(secureCompare(a, b)).toBe(true);
  });

  it('securely compares different buffers', () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 5]);
    
    expect(secureCompare(a, b)).toBe(false);
  });

  it('securely compares different length buffers', () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([1, 2, 3, 4]);
    
    expect(secureCompare(a, b)).toBe(false);
  });

  it('clears sensitive data', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    clearSensitiveData(data);
    
    expect(data.every(b => b === 0)).toBe(true);
  });
});

describe('KeyVault', () => {
  const password = 'MySecurePassword123!';
  let vault: KeyVaultImpl;

  beforeEach(() => {
    vault = new KeyVaultImpl();
    vault.clearAll();
  });

  it('stores and retrieves key', async () => {
    const walletId = 'test-wallet';
    const privateKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    await vault.storeKey(walletId, privateKey, password);
    
    const retrieved = await vault.retrieveKey(walletId, password);
    expect(retrieved).toEqual(privateKey);
  });

  it('throws for non-existent key', async () => {
    await expect(vault.retrieveKey('nonexistent', password)).rejects.toThrow('not found');
  });

  it('throws for wrong password', async () => {
    const walletId = 'test-wallet';
    const privateKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    await vault.storeKey(walletId, privateKey, password);
    
    await expect(vault.retrieveKey(walletId, 'WrongPassword123!')).rejects.toThrow();
  });

  it('prevents duplicate key storage', async () => {
    const walletId = 'test-wallet';
    const privateKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    await vault.storeKey(walletId, privateKey, password);
    
    await expect(vault.storeKey(walletId, privateKey, password)).rejects.toThrow('already exists');
  });

  it('rotates encryption', async () => {
    const walletId = 'test-wallet';
    const privateKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const newPassword = 'NewSecurePassword456!';

    await vault.storeKey(walletId, privateKey, password);
    await vault.rotateEncryption(walletId, password, newPassword);
    
    // Old password should fail
    await expect(vault.retrieveKey(walletId, password)).rejects.toThrow();
    
    // New password should work
    const retrieved = await vault.retrieveKey(walletId, newPassword);
    expect(retrieved).toEqual(privateKey);
  });

  it('deletes key', async () => {
    const walletId = 'test-wallet';
    const privateKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    await vault.storeKey(walletId, privateKey, password);
    await vault.deleteKey(walletId, password);
    
    await expect(vault.retrieveKey(walletId, password)).rejects.toThrow('not found');
  });

  it('lists wallet IDs', async () => {
    await vault.storeKey('wallet-1', new Uint8Array([1]), password);
    await vault.storeKey('wallet-2', new Uint8Array([2]), password);
    await vault.storeKey('wallet-3', new Uint8Array([3]), password);
    
    const ids = await vault.listWalletIds();
    expect(ids).toContain('wallet-1');
    expect(ids).toContain('wallet-2');
    expect(ids).toContain('wallet-3');
    expect(ids.length).toBe(3);
  });

  it('checks if key exists', async () => {
    const walletId = 'test-wallet';
    
    expect(await vault.hasKey(walletId)).toBe(false);
    
    await vault.storeKey(walletId, new Uint8Array([1]), password);
    
    expect(await vault.hasKey(walletId)).toBe(true);
  });

  it('exports and imports vault', async () => {
    const exportPassword = 'ExportPassword123!';
    
    await vault.storeKey('wallet-1', new Uint8Array([1, 2, 3]), password);
    await vault.storeKey('wallet-2', new Uint8Array([4, 5, 6]), password);
    
    const exported = await vault.exportVault(exportPassword);
    expect(typeof exported).toBe('string');
    
    // Create new vault and import
    const newVault = new KeyVaultImpl();
    await newVault.importVault(exported, exportPassword);
    
    // Verify keys are accessible (with original encryption passwords)
    const key1 = await newVault.retrieveKey('wallet-1', password);
    expect(key1).toEqual(new Uint8Array([1, 2, 3]));
  });
});
