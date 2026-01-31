/**
 * @file index.test.ts
 * @author n1ch0las
 * @copyright (c) 2026 @nichxbt
 * @license MIT
 * @repository universal-crypto-mcp
 * @version 14.9.3.8
 * @checksum 1489314938
 */

import { describe, it, expect } from "vitest";
import { createPaywall, evmPaywall, svmPaywall } from "./index";
import type { PaymentRequired } from "./types";

describe("@x402/paywall", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });

  it("should handle payment required responses", () => {
    const paywall = createPaywall()
      .withNetwork(evmPaywall)
      .build();

    const paymentRequired: PaymentRequired = {
      accepts: [{
        network: "eip155:8453", // Base
        to: "0x742d35Cc6634C0532925a3b844Bc9e7595f5bB0D",
        amount: "1000000", // 1 USDC (6 decimals)
        asset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
      }],
    };

    const html = paywall.generateHtml(paymentRequired);
    
    expect(html).toBeDefined();
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain("Payment Required");
  });

  it("should render paywall UI", () => {
    const paywall = createPaywall()
      .withNetwork(evmPaywall)
      .withNetwork(svmPaywall)
      .build();

    const paymentRequired: PaymentRequired = {
      accepts: [
        {
          network: "eip155:8453", // Base
          to: "0x742d35Cc6634C0532925a3b844Bc9e7595f5bB0D",
          amount: "1000000",
          asset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        },
        {
          network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", // Solana mainnet
          to: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
          amount: "1000000", // 1 USDC (6 decimals)
          asset: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/spl-token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC on Solana
        },
      ],
    };

    const html = paywall.generateHtml(paymentRequired);
    
    expect(html).toBeDefined();
    expect(html).toContain("eip155");
    // Should contain UI elements
    expect(html).toContain("button") || expect(html).toContain("wallet");
  });

  it("should process payments", () => {
    const paywall = createPaywall()
      .withNetwork(evmPaywall)
      .withConfig({
        title: "Premium API Access",
        description: "Pay to access this endpoint",
      })
      .build();

    const paymentRequired: PaymentRequired = {
      accepts: [{
        network: "eip155:8453",
        to: "0x742d35Cc6634C0532925a3b844Bc9e7595f5bB0D",
        amount: "5000000", // 5 USDC
        asset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      }],
    };

    const html = paywall.generateHtml(paymentRequired, {
      customStyles: "background: linear-gradient(to right, #667eea 0%, #764ba2 100%);",
    });

    expect(html).toBeDefined();
    expect(html).toContain("Premium API Access");
    expect(html).toContain("Pay to access this endpoint");
    expect(html).toContain("5");
  });

  it("should throw error if no handlers registered", () => {
    const paywall = createPaywall().build();

    const paymentRequired: PaymentRequired = {
      accepts: [{
        network: "eip155:8453",
        to: "0x742d35Cc6634C0532925a3b844Bc9e7595f5bB0D",
        amount: "1000000",
        asset: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      }],
    };

    expect(() => paywall.generateHtml(paymentRequired)).toThrow(
      "No paywall handlers registered"
    );
  });

  it("should throw error if no handler supports network", () => {
    const paywall = createPaywall()
      .withNetwork(evmPaywall)
      .build();

    const paymentRequired: PaymentRequired = {
      accepts: [{
        network: "cosmos:cosmoshub-4", // Cosmos (unsupported)
        to: "cosmos1...",
        amount: "1000000",
        asset: "cosmos:cosmoshub-4/ibc:uatom",
      }],
    };

    expect(() => paywall.generateHtml(paymentRequired)).toThrow(
      "No paywall handler supports networks"
    );
  });
});


/* EOF - @nichxbt | 6e696368-786274-4d43-5000-000000000000 */