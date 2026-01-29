/**
 * HD Wallet Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeed,
  getWordCount,
  normalizeMnemonic,
  deriveKeypair,
  deriveKeypairBatch,
  buildDerivationPath,
  validateSolanaAddress,
  HDWalletFactoryImpl,
} from '../hd-wallet/index.js';

describe('Mnemonic', () => {
  it('generates valid 12-word mnemonic', () => {
    const mnemonic = generateMnemonic(128);
    expect(getWordCount(mnemonic)).toBe(12);
    expect(validateMnemonic(mnemonic)).toBe(true);
  });

  it('generates valid 24-word mnemonic', () => {
    const mnemonic = generateMnemonic(256);
    expect(getWordCount(mnemonic)).toBe(24);
    expect(validateMnemonic(mnemonic)).toBe(true);
  });

  it('validates correct mnemonic', () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    expect(validateMnemonic(mnemonic)).toBe(true);
  });

  it('rejects invalid mnemonic', () => {
    expect(validateMnemonic('invalid mnemonic words')).toBe(false);
    expect(validateMnemonic('')).toBe(false);
    expect(validateMnemonic('abandon abandon abandon')).toBe(false); // Too short
  });

  it('normalizes mnemonic', () => {
    const input = '  ABANDON   abandon   ABANDON  ';
    const normalized = normalizeMnemonic(input);
    expect(normalized).toBe('abandon abandon abandon');
  });

  it('converts mnemonic to seed', async () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const seed = await mnemonicToSeed(mnemonic);
    expect(seed).toBeInstanceOf(Buffer);
    expect(seed.length).toBe(64);
  });

  it('produces different seeds with passphrase', async () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const seed1 = await mnemonicToSeed(mnemonic);
    const seed2 = await mnemonicToSeed(mnemonic, 'passphrase');
    expect(seed1.equals(seed2)).toBe(false);
  });
});

describe('Derivation', () => {
  const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
  let seed: Buffer;

  beforeEach(async () => {
    seed = await mnemonicToSeed(testMnemonic);
  });

  it('builds correct derivation path', () => {
    expect(buildDerivationPath(0)).toBe("m/44'/501'/0'/0'");
    expect(buildDerivationPath(1)).toBe("m/44'/501'/1'/0'");
    expect(buildDerivationPath(100)).toBe("m/44'/501'/100'/0'");
  });

  it('throws for invalid account index', () => {
    expect(() => buildDerivationPath(-1)).toThrow();
    expect(() => buildDerivationPath(1.5)).toThrow();
  });

  it('derives keypair from seed', () => {
    const { publicKey, secretKey, derivationPath } = deriveKeypair(seed, 0);
    
    expect(publicKey).toBeDefined();
    expect(publicKey.length).toBe(44); // Base58 encoded public key
    expect(secretKey).toBeInstanceOf(Uint8Array);
    expect(secretKey.length).toBe(64);
    expect(derivationPath).toBe("m/44'/501'/0'/0'");
  });

  it('derives different keypairs for different indices', () => {
    const keypair0 = deriveKeypair(seed, 0);
    const keypair1 = deriveKeypair(seed, 1);
    
    expect(keypair0.publicKey).not.toBe(keypair1.publicKey);
  });

  it('derives same keypair for same index (deterministic)', () => {
    const keypair1 = deriveKeypair(seed, 0);
    const keypair2 = deriveKeypair(seed, 0);
    
    expect(keypair1.publicKey).toBe(keypair2.publicKey);
  });

  it('derives batch of keypairs', () => {
    const keypairs = deriveKeypairBatch(seed, 0, 10);
    
    expect(keypairs).toHaveLength(10);
    
    // Check uniqueness
    const publicKeys = new Set(keypairs.map(k => k.publicKey));
    expect(publicKeys.size).toBe(10);
    
    // Check indices
    expect(keypairs[0].index).toBe(0);
    expect(keypairs[9].index).toBe(9);
  });

  it('throws for batch size over 10000', () => {
    expect(() => deriveKeypairBatch(seed, 0, 10001)).toThrow();
  });

  it('validates Solana addresses', () => {
    const keypair = deriveKeypair(seed, 0);
    expect(validateSolanaAddress(keypair.publicKey)).toBe(true);
    expect(validateSolanaAddress('invalid')).toBe(false);
    expect(validateSolanaAddress('')).toBe(false);
  });
});

describe('HDWalletFactory', () => {
  const factory = new HDWalletFactoryImpl();
  const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

  it('creates master wallet from mnemonic', async () => {
    const master = await factory.createMasterWallet(testMnemonic);
    
    expect(master.id).toBeDefined();
    expect(master.publicKey).toBeDefined();
    expect(master.createdAt).toBeInstanceOf(Date);
    expect(master.derivedCount).toBe(0);
  });

  it('throws for invalid mnemonic', async () => {
    await expect(factory.createMasterWallet('invalid')).rejects.toThrow();
  });

  it('derives wallet from master', async () => {
    const master = await factory.createMasterWallet(testMnemonic);
    const derived = await factory.deriveWallet(master, 0);
    
    expect(derived.id).toBeDefined();
    expect(derived.publicKey).toBeDefined();
    expect(derived.address).toBe(derived.publicKey); // Same for Solana
    expect(derived.index).toBe(0);
    expect(derived.masterWalletId).toBe(master.id);
    expect(derived.derivationPath).toBe("m/44'/501'/0'/0'");
  });

  it('derives wallet batch', async () => {
    const master = await factory.createMasterWallet(testMnemonic);
    const wallets = await factory.deriveWalletBatch(master, 0, 5);
    
    expect(wallets).toHaveLength(5);
    expect(wallets[0].index).toBe(0);
    expect(wallets[4].index).toBe(4);
  });

  it('clears master wallet from memory', async () => {
    const master = await factory.createMasterWallet(testMnemonic);
    expect(factory.isMasterWalletLoaded(master.id)).toBe(true);
    
    factory.clearMasterWallet(master.id);
    expect(factory.isMasterWalletLoaded(master.id)).toBe(false);
    
    // Should throw when trying to derive
    await expect(factory.deriveWallet(master, 0)).rejects.toThrow();
  });
});
