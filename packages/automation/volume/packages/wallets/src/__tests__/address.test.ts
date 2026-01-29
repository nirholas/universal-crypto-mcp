/**
 * Address utility tests
 */

import { describe, it, expect } from 'vitest';
import {
  isValidAddress,
  normalizeAddress,
  isENSName,
  getAddressType,
  shortenAddress,
} from '../utils/address';

describe('Address Utilities', () => {
  describe('isValidAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(isValidAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(true);
      expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidAddress('')).toBe(false);
      expect(isValidAddress('invalid')).toBe(false);
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(false);
    });
  });

  describe('normalizeAddress', () => {
    it('should lowercase addresses', () => {
      expect(normalizeAddress('0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045')).toBe(
        '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
      );
    });

    it('should handle already lowercase addresses', () => {
      expect(normalizeAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')).toBe(
        '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
      );
    });
  });

  describe('isENSName', () => {
    it('should identify valid ENS names', () => {
      expect(isENSName('vitalik.eth')).toBe(true);
      expect(isENSName('myname.eth')).toBe(true);
      expect(isENSName('subdomain.myname.eth')).toBe(true);
    });

    it('should reject invalid ENS names', () => {
      expect(isENSName('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(false);
      expect(isENSName('notens')).toBe(false);
      expect(isENSName('')).toBe(false);
    });
  });

  describe('getAddressType', () => {
    it('should return unknown for addresses without provider', async () => {
      // Without a provider, getAddressType should return 'unknown'
      expect(await getAddressType('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe('unknown');
    });

    it('should return unknown for invalid input', async () => {
      expect(await getAddressType('invalid')).toBe('unknown');
    });

    it('should identify EOA with mock provider', async () => {
      const mockProvider = {
        getBytecode: async () => '0x',
      };
      expect(await getAddressType('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', mockProvider)).toBe('eoa');
    });

    it('should identify contract with mock provider', async () => {
      const mockProvider = {
        getBytecode: async () => '0x6080604052',
      };
      expect(await getAddressType('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', mockProvider)).toBe('contract');
    });
  });

  describe('shortenAddress', () => {
    it('should shorten addresses correctly', () => {
      expect(shortenAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe('0xd8da...6045');
    });

    it('should handle custom lengths', () => {
      expect(shortenAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 6)).toBe(
        '0xd8da6b...a96045'
      );
    });
  });
});
