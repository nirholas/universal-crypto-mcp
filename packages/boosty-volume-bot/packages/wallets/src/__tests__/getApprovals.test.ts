/**
 * getApprovals tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApprovalsSchema, getApprovalsDefinition } from '../tools/getApprovals';

// Mock the lib modules
vi.mock('../lib', () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockResolvedValue({ data: { result: [] } }),
  })),
  Cache: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  })),
}));

describe('getApprovals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod Schema validation', () => {
    it('should validate a valid address', () => {
      const result = getApprovalsSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid address', () => {
      const result = getApprovalsSchema.safeParse({
        address: 'not-valid',
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid chain values', () => {
      const chains = ['ethereum', 'arbitrum', 'base', 'polygon', 'optimism', 'avalanche', 'bsc'];
      for (const chain of chains) {
        const result = getApprovalsSchema.safeParse({
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          chain,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should default to ethereum chain', () => {
      const result = getApprovalsSchema.parse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      });
      expect(result.chain).toBe('ethereum');
    });

    it('should reject invalid chains', () => {
      const result = getApprovalsSchema.safeParse({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        chain: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(getApprovalsDefinition.name).toBe('getApprovals');
    });

    it('should have a description', () => {
      expect(getApprovalsDefinition.description).toBeDefined();
      expect(typeof getApprovalsDefinition.description).toBe('string');
    });

    it('should have inputSchema with address property', () => {
      expect(getApprovalsDefinition.inputSchema.properties.address).toBeDefined();
    });

    it('should have address as required', () => {
      expect(getApprovalsDefinition.inputSchema.required).toContain('address');
    });
  });
});
