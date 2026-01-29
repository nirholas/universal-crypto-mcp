/**
 * Test Setup File
 *
 * This file is run before each test file and sets up the test environment.
 */

import { beforeAll, afterAll, vi } from "vitest";

// Set test environment
process.env.NODE_ENV = "test";

// Mock environment variables that might be needed
beforeAll(() => {
  // Reset environment for tests
  vi.stubEnv("X402_TEST_MODE", "true");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

// Global test utilities
declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    createTestWallet: () => string;
    createTestConfig: (overrides?: Record<string, unknown>) => Record<string, unknown>;
  };
}

globalThis.testUtils = {
  /**
   * Create a random test wallet address
   */
  createTestWallet: () => {
    const chars = "0123456789abcdef";
    let address = "0x";
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  },

  /**
   * Create a test configuration with optional overrides
   */
  createTestConfig: (overrides = {}) => ({
    name: "test-api",
    version: "1.0.0",
    type: "express-api",
    payment: {
      wallet: globalThis.testUtils.createTestWallet(),
      network: "eip155:8453",
      token: "USDC",
      facilitator: "https://facilitator.x402.dev",
    },
    pricing: {
      model: "per-call",
      default: "$0.001",
      routes: {
        "GET /api/test": "$0.001",
      },
    },
    ...overrides,
  }),
};
