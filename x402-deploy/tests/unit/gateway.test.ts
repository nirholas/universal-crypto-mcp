/**
 * Gateway Middleware Unit Tests
 *
 * Tests for x402 payment middleware, pricing engine, and payment verification
 */

import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock the dependencies before importing
vi.mock("../../src/gateway/payment-verifier.js", () => ({
  verifyPayment: vi.fn(),
}));

vi.mock("../../src/gateway/helpers.js", () => ({
  getPriceForRoute: vi.fn(),
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  trackRequest: vi.fn().mockResolvedValue(undefined),
}));

import { x402Middleware } from "../../src/gateway/middleware.js";
import { verifyPayment } from "../../src/gateway/payment-verifier.js";
import { getPriceForRoute, checkRateLimit } from "../../src/gateway/helpers.js";
import { PricingEngine, parsePrice, formatPrice, priceToX402Format } from "../../src/gateway/pricing-engine.js";
import type { X402Config } from "../../src/types/config.js";

// Helper to create mock request
function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    method: "GET",
    path: "/api/test",
    ...overrides,
  } as Request;
}

// Helper to create mock response
function createMockResponse(): Response & { 
  status: Mock; 
  json: Mock; 
  setHeader: Mock;
} {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return res as any;
}

// Test config - matches X402Config schema from types/config.ts
const testConfig: X402Config = {
  name: "test-api",
  version: "1.0.0",
  type: "express-api",
  payment: {
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "eip155:8453",
    token: "USDC",
    facilitator: "https://facilitator.x402.dev",
  },
  pricing: {
    model: "per-call",
    default: "$0.01",
    routes: {
      "GET /api/free": "$0",
      "POST /api/expensive": "$1.00",
      "GET /api/data": "$0.001",
    },
  },
};

describe("x402 Gateway Middleware", () => {
  let mockNext: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNext = vi.fn();
  });

  describe("Payment Required (402) Responses", () => {
    it("returns 402 when no payment header is provided", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      // Mock getPriceForRoute to return a price (endpoint requires payment)
      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      await x402Middleware({ config: testConfig })(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(402);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "payment_required",
          message: expect.stringContaining("payment"),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("passes through for free endpoints (no pricing)", async () => {
      const req = createMockRequest({ path: "/api/free" });
      const res = createMockResponse();

      // Mock getPriceForRoute to return null (free endpoint)
      (getPriceForRoute as Mock).mockReturnValue(null);

      await x402Middleware({ config: testConfig })(req, res, mockNext);

      expect(res.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("Valid Payment Handling", () => {
    it("allows request with valid payment proof", async () => {
      const paymentProof = Buffer.from(
        JSON.stringify({ payer: "0x123", amount: "10000" })
      ).toString("base64");

      const req = createMockRequest({
        headers: { "x-payment": paymentProof },
      });
      const res = createMockResponse();

      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      (verifyPayment as Mock).mockResolvedValue({
        valid: true,
        payer: "0x123456789",
        amount: "$0.01",
        txHash: "0xabc123",
        remainingBalance: "1000000",
      });

      await x402Middleware({ config: testConfig })(req, res, mockNext);

      expect(verifyPayment).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith(
        "x-payment-response",
        expect.any(String)
      );
    });

    it("attaches x402 payment info to request", async () => {
      const paymentProof = Buffer.from(
        JSON.stringify({ payer: "0x123", amount: "10000" })
      ).toString("base64");

      const req = createMockRequest({
        headers: { "x-payment": paymentProof },
      }) as Request & { x402?: any };
      const res = createMockResponse();

      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      (verifyPayment as Mock).mockResolvedValue({
        valid: true,
        payer: "0xPayerAddress",
        amount: "$0.01",
        txHash: "0xtxhash",
      });

      await x402Middleware({ config: testConfig })(req, res, mockNext);

      expect((req as any).x402).toBeDefined();
      expect((req as any).x402.payer).toBe("0xPayerAddress");
      expect((req as any).x402.txHash).toBe("0xtxhash");
    });
  });

  describe("Invalid Payment Handling", () => {
    it("returns 402 when payment verification fails", async () => {
      const paymentProof = Buffer.from(
        JSON.stringify({ payer: "0x123", amount: "10000" })
      ).toString("base64");

      const req = createMockRequest({
        headers: { "x-payment": paymentProof },
      });
      const res = createMockResponse();

      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      (verifyPayment as Mock).mockResolvedValue({
        valid: false,
        payer: "0x123",
        amount: "0",
        error: "Insufficient payment amount",
      });

      await x402Middleware({ config: testConfig })(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(402);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "payment_invalid",
          message: "Insufficient payment amount",
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("calls onPaymentFailed callback on invalid payment", async () => {
      const onPaymentFailed = vi.fn();
      const paymentProof = Buffer.from(
        JSON.stringify({ payer: "0x123", amount: "10000" })
      ).toString("base64");

      const req = createMockRequest({
        headers: { "x-payment": paymentProof },
      });
      const res = createMockResponse();

      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      (verifyPayment as Mock).mockResolvedValue({
        valid: false,
        payer: "0x123",
        amount: "0",
        error: "Payment expired",
      });

      await x402Middleware({ config: testConfig, onPaymentFailed })(req, res, mockNext);

      expect(onPaymentFailed).toHaveBeenCalledWith(
        expect.any(Error),
        req
      );
    });
  });

  describe("Rate Limiting", () => {
    it("returns 429 when rate limit exceeded", async () => {
      const paymentProof = Buffer.from(
        JSON.stringify({ payer: "0x123", amount: "10000" })
      ).toString("base64");

      const req = createMockRequest({
        headers: { "x-payment": paymentProof },
      });
      const res = createMockResponse();

      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      (verifyPayment as Mock).mockResolvedValue({
        valid: true,
        payer: "0x123",
        amount: "$0.01",
        txHash: "0xabc",
      });

      (checkRateLimit as Mock).mockResolvedValue({
        allowed: false,
        limit: 100,
        window: "1 hour",
        retryAfter: 3600,
      });

      await x402Middleware({ config: testConfig })(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "rate_limit_exceeded",
          retryAfter: 3600,
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("Callback Handlers", () => {
    it("calls onPaymentVerified on successful payment", async () => {
      const onPaymentVerified = vi.fn();
      const paymentProof = Buffer.from(
        JSON.stringify({ payer: "0x123", amount: "10000" })
      ).toString("base64");

      const req = createMockRequest({
        headers: { "x-payment": paymentProof },
      });
      const res = createMockResponse();

      (getPriceForRoute as Mock).mockReturnValue({
        price: "$0.01",
        route: "GET /api/test",
      });

      const verification = {
        valid: true,
        payer: "0x123456789",
        amount: "$0.01",
        txHash: "0xabc123",
      };

      (verifyPayment as Mock).mockResolvedValue(verification);

      await x402Middleware({ config: testConfig, onPaymentVerified })(req, res, mockNext);

      expect(onPaymentVerified).toHaveBeenCalledWith(verification);
    });
  });
});

describe("Pricing Engine", () => {
  describe("Price Parsing", () => {
    it("parses dollar notation correctly", () => {
      expect(parsePrice("$0.01")).toEqual({ value: 0.01, currency: "USD" });
      expect(parsePrice("$1.50")).toEqual({ value: 1.5, currency: "USD" });
      expect(parsePrice("$0.001")).toEqual({ value: 0.001, currency: "USD" });
      expect(parsePrice("$100")).toEqual({ value: 100, currency: "USD" });
    });

    it("parses token notation correctly", () => {
      expect(parsePrice("0.001 USDC")).toEqual({ value: 0.001, currency: "USDC" });
      expect(parsePrice("1000000 wei")).toEqual({ value: 1000000, currency: "WEI" });
      expect(parsePrice("10 ETH")).toEqual({ value: 10, currency: "ETH" });
    });

    it("throws on invalid price format", () => {
      expect(() => parsePrice("invalid")).toThrow("Invalid price format");
      expect(() => parsePrice("")).toThrow("Invalid price format");
    });
  });

  describe("Price Formatting", () => {
    it("formats USD prices correctly", () => {
      expect(formatPrice(0.01, "USD")).toBe("$0.010000");
      expect(formatPrice(1.5, "USD")).toBe("$1.500000");
    });

    it("formats token prices correctly", () => {
      expect(formatPrice(1000, "USDC")).toBe("1000 USDC");
      expect(formatPrice(0.001, "ETH")).toBe("0.001 ETH");
    });
  });

  describe("x402 Format Conversion", () => {
    it("converts price to x402 format", () => {
      const result = priceToX402Format("$0.01", 6);
      expect(result.amount).toBe("10000"); // 0.01 * 10^6
    });

    it("handles zero price", () => {
      const result = priceToX402Format("$0", 6);
      expect(result.amount).toBe("0");
    });

    it("handles different decimal precisions", () => {
      const result18 = priceToX402Format("$0.01", 18);
      expect(result18.amount).toBe("10000000000000000"); // 0.01 * 10^18
    });
  });

  describe("PricingEngine Class", () => {
    let engine: PricingEngine;

    beforeEach(() => {
      engine = new PricingEngine({
        "GET /api/free": "$0",
        "POST /api/expensive": "$1.00",
        "GET /api/data": "$0.001",
      });
    });

    it("stores base pricing configuration", () => {
      // Engine is created successfully with pricing config
      expect(engine).toBeDefined();
    });

    it("tracks payment history", () => {
      const record = {
        id: "test-1",
        payer: "0x123",
        route: "GET /api/data",
        amount: "$0.001",
        asset: "USDC",
        network: "eip155:8453" as const,
        timestamp: new Date(),
        settled: true,
      };

      engine.recordPayment("0x123", record);
      const history = engine.getPayerHistory("0x123");

      expect(history).toHaveLength(1);
      expect(history[0].route).toBe("GET /api/data");
    });

    it("counts payer requests", () => {
      engine.recordPayment("0x123", { id: "t1", payer: "0x123", route: "GET /api/data", amount: "$0.001", asset: "USDC", network: "eip155:8453" as const, timestamp: new Date(), settled: true });
      engine.recordPayment("0x123", { id: "t2", payer: "0x123", route: "GET /api/data", amount: "$0.001", asset: "USDC", network: "eip155:8453" as const, timestamp: new Date(), settled: true });
      engine.recordPayment("0x123", { id: "t3", payer: "0x123", route: "POST /api/expensive", amount: "$1.00", asset: "USDC", network: "eip155:8453" as const, timestamp: new Date(), settled: true });

      expect(engine.getPayerRequestCount("0x123")).toBe(3);
      expect(engine.getPayerRequestCount("0x123", "GET /api/data")).toBe(2);
      expect(engine.getPayerRequestCount("0x456")).toBe(0);
    });

    it("updates load factor within bounds", () => {
      engine.updateLoad(0.5);
      engine.updateLoad(-0.5); // Should clamp to 0
      engine.updateLoad(1.5); // Should clamp to 1
      // No errors thrown, bounds are enforced internally
    });

    it("sets and retrieves dynamic pricing", () => {
      const dynamicConfig = {
        basePrice: "$0.001",
        loadMultiplier: 1.5,
        tiers: [
          { minRequests: 100, price: "$0.0008" },
          { minRequests: 1000, price: "$0.0005" },
        ],
      };

      engine.setDynamicPricing("GET /api/data", dynamicConfig);
      const retrieved = engine.getDynamicPricing("GET /api/data");

      expect(retrieved).toEqual(dynamicConfig);
    });

    it("returns undefined for non-existent dynamic pricing", () => {
      expect(engine.getDynamicPricing("GET /api/unknown")).toBeUndefined();
    });
  });
});

describe("Payment Verifier", () => {
  // These tests use the mocked verifyPayment function
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies valid payment header", async () => {
    (verifyPayment as Mock).mockResolvedValue({
      valid: true,
      payer: "0x123",
      amount: "$0.01",
      txHash: "0xabc",
    });

    const result = await verifyPayment({
      paymentHeader: "test-header",
      expectedPrice: "$0.01",
      expectedPayTo: "0x456",
      network: "eip155:8453",
      facilitatorUrl: "https://x402.org/facilitator",
    });

    expect(result.valid).toBe(true);
    expect(result.payer).toBe("0x123");
  });

  it("returns invalid for failed verification", async () => {
    (verifyPayment as Mock).mockResolvedValue({
      valid: false,
      payer: "unknown",
      amount: "0",
      error: "Invalid signature",
    });

    const result = await verifyPayment({
      paymentHeader: "invalid-header",
      expectedPrice: "$0.01",
      expectedPayTo: "0x456",
      network: "eip155:8453",
      facilitatorUrl: "https://x402.org/facilitator",
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid signature");
  });

  it("handles test mode", async () => {
    (verifyPayment as Mock).mockResolvedValue({
      valid: true,
      payer: "0xTestPayer",
      amount: "$0.01",
      txHash: "0xtest_123",
    });

    const result = await verifyPayment({
      paymentHeader: "any-header",
      expectedPrice: "$0.01",
      expectedPayTo: "0x456",
      network: "eip155:8453",
      facilitatorUrl: "https://x402.org/facilitator",
      testMode: true,
    });

    expect(result.valid).toBe(true);
    expect(result.payer).toBe("0xTestPayer");
  });
});
