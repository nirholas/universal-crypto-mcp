/**
 * resolveENS tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveENSDefinition } from '../tools/resolveENS';

// Mock the lib modules
vi.mock('../lib', () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    post: vi.fn().mockResolvedValue({ data: { result: null } }),
  })),
  Cache: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  })),
}));

describe('resolveENS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(resolveENSDefinition.name).toBe('resolveENS');
    });

    it('should have a description', () => {
      expect(resolveENSDefinition.description).toBeDefined();
      expect(typeof resolveENSDefinition.description).toBe('string');
    });

    it('should have inputSchema with name property', () => {
      expect(resolveENSDefinition.inputSchema.properties.name).toBeDefined();
    });

    it('should have inputSchema with address property', () => {
      expect(resolveENSDefinition.inputSchema.properties.address).toBeDefined();
    });

    it('should allow either name or address', () => {
      // Both should be optional in the schema
      expect(resolveENSDefinition.inputSchema.required).toEqual([]);
    });
  });
});
