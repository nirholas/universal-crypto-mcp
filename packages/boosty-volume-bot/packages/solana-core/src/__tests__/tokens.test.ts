/**
 * Token Operations Tests
 */

import { describe, it, expect } from 'vitest';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  getATA,
  toTokenAmount,
  fromTokenAmount,
  getMetadataPDA,
} from '../tokens/index.js';

describe('Token Utilities', () => {
  describe('getATA', () => {
    it('should derive correct ATA for USDC', () => {
      const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
      const owner = new PublicKey('9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g');
      
      const ata = getATA(usdcMint, owner);
      
      expect(ata).toBeInstanceOf(PublicKey);
      expect(ata.toBase58()).toHaveLength(44);
    });
  });

  describe('toTokenAmount', () => {
    it('should convert 100 tokens with 6 decimals', () => {
      const amount = toTokenAmount(100, 6);
      expect(amount).toBe(BigInt(100_000_000));
    });

    it('should convert 1.5 tokens with 9 decimals', () => {
      const amount = toTokenAmount(1.5, 9);
      expect(amount).toBe(BigInt(1_500_000_000));
    });

    it('should handle zero', () => {
      const amount = toTokenAmount(0, 6);
      expect(amount).toBe(BigInt(0));
    });
  });

  describe('fromTokenAmount', () => {
    it('should convert raw amount to decimal', () => {
      const amount = fromTokenAmount(BigInt(100_000_000), 6);
      expect(amount).toBe(100);
    });

    it('should handle fractional amounts', () => {
      const amount = fromTokenAmount(BigInt(1_500_000_000), 9);
      expect(amount).toBe(1.5);
    });
  });

  describe('getMetadataPDA', () => {
    it('should derive metadata PDA', () => {
      const mint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
      const pda = getMetadataPDA(mint);
      
      expect(pda).toBeInstanceOf(PublicKey);
      expect(pda.toBase58()).toHaveLength(44);
    });
  });
});

describe('Token Account Fetching', () => {
  const connection = new Connection('https://api.devnet.solana.com');

  it('should handle non-existent token account', async () => {
    const { getTokenAccount } = await import('../tokens/index.js');
    
    // Random address that doesn't exist
    const nonExistent = new PublicKey('11111111111111111111111111111111');
    const account = await getTokenAccount(connection, nonExistent);
    
    expect(account).toBeNull();
  });
});
