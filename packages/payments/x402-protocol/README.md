# x402 Protocol Reference

This directory references the official x402 protocol packages from Coinbase.

## What is x402?

x402 is a decentralized payment protocol that enables HTTP 402 Payment Required responses with cryptocurrency payments. It allows web services to require payment for access, with AI agents and users paying via stablecoins.

## Official Packages

Install from npm:

```bash
npm install @x402/core @x402/express @x402/evm
```

### @x402/core

Core protocol utilities for x402 payment handling.

```typescript
import { createPaywall, verifyPayment } from "@x402/core";
```

### @x402/express

Express.js middleware for x402 paywalls.

```typescript
import { x402Middleware } from "@x402/express";

app.use("/premium", x402Middleware({
  price: "0.01",
  token: "USDC",
  chain: "base",
}));
```

### @x402/evm

EVM-specific payment verification and handling.

```typescript
import { createEvmPayment, verifyEvmPayment } from "@x402/evm";
```

## Documentation

- [x402 Official Docs](https://docs.x402.org)
- [x402 GitHub](https://github.com/coinbase/x402)
- [x402 Specification](https://x402.org/spec)

## Integration with Universal Crypto MCP

See [@universal-crypto-mcp/x402-ecosystem](../x402-ecosystem/) for our ecosystem additions that enhance x402 with:

- **PayableAgent**: AI agent with built-in payment capabilities
- **Tool Marketplace**: Discover and pay for premium MCP tools
- **Yield Integration**: Earn yield on agent funds with USDs
- **Premium Tiers**: Subscription-based access levels

## Quick Start

1. Install the official packages:
   ```bash
   pnpm add @x402/core @x402/express @x402/evm
   ```

2. Install our ecosystem additions:
   ```bash
   pnpm add @universal-crypto-mcp/x402-ecosystem
   ```

3. Create a paywall:
   ```typescript
   import { x402Middleware } from "@x402/express";
   import { PayableAgent } from "@universal-crypto-mcp/x402-ecosystem";

   // Server-side paywall
   app.use("/api/premium", x402Middleware({ /* config */ }));

   // Client-side agent
   const agent = new PayableAgent({
     wallet: myWallet,
     maxPayment: "10.00",
   });
   ```

## Related Packages

| Package | Description |
|---------|-------------|
| [@universal-crypto-mcp/x402-ecosystem](../x402-ecosystem/) | Ecosystem utilities |
| [@universal-crypto-mcp/x402-stablecoin](../x402-stablecoin/) | Stablecoin integrations |
| [@universal-crypto-mcp/payments-shared](../shared/) | Shared payment types |

## License

The x402 protocol is developed by Coinbase under Apache-2.0 license.
