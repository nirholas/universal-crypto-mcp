/**
 * getWalletHistory tool tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWalletHistoryDefinition } from '../tools/getWalletHistory';

// Mock the lib modules
vi.mock('../lib', () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockResolvedValue({ data: {} }),
  })),
  Cache: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  })),
}));

// Mock the API clients
vi.mock('../apis/alchemy', () => ({
  getAlchemyClient: vi.fn().mockReturnValue({
    getHistory: vi.fn().mockResolvedValue([]),
  }),
}));

describe('getWalletHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Definition structure', () => {
    it('should have correct tool name', () => {
      expect(getWalletHistoryDefinition.name).toBe('getWalletHistory');
    });

    it('should have a description', () => {
      expect(getWalletHistoryDefinition.description).toBeDefined();
      expect(typeof getWalletHistoryDefinition.description).toBe('string');
    });

    it('should have inputSchema with address property', () => {
      expect(getWalletHistoryDefinition.inputSchema.properties.address).toBeDefined();
    });

    it('should have inputSchema with chain property', () => {
      expect(getWalletHistoryDefinition.inputSchema.properties.chain).toBeDefined();
    });

    it('should have inputSchema with limit property', () => {
      expect(getWalletHistoryDefinition.inputSchema.properties.limit).toBeDefined();
    });
  });
});
