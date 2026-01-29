# Overview

## What is Universal Crypto MCP?

Universal Crypto MCP is the world's first **AI-native blockchain infrastructure** that combines:

### 🔗 Universal MCP Server
A comprehensive Model Context Protocol server that gives AI agents superpowers:

- **380+ blockchain tools** across 20+ networks
- **Natural language blockchain interactions** 
- **Multi-chain portfolio management**
- **DeFi protocol integrations** (Uniswap, Aave, Compound, etc.)
- **Real-time market data & analytics**
- **Smart contract interactions**

### 💎 x402 Payment Protocol
An industry-first **AI agent payment system** that enables:

- **Pay-per-request APIs** accepting cryptocurrency
- **Automatic on-chain payment verification**
- **AI agent discovery network** for finding paid services
- **One-click deployment** to production
- **Built-in escrow & settlements**

---

## The Problem We Solve

### For AI Agents
❌ **Before**: AI agents couldn't interact with blockchains or make payments  
✅ **After**: Full blockchain access + ability to pay for premium services

### For Developers
❌ **Before**: Building paid APIs for AI required complex payment infrastructure  
✅ **After**: One command to add crypto payments to any API

### For Users
❌ **Before**: Manual blockchain interactions across multiple interfaces  
✅ **After**: Just describe what you want in natural language

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Agents Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Claude  │  │ ChatGPT  │  │  Cursor  │  │  Custom  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
              ┌───────────▼───────────┐
              │                       │
              │   MCP Protocol        │
              │   (JSON-RPC 2.0)      │
              │                       │
              └───────────┬───────────┘
                          │
┌─────────────────────────▼─────────────────────────────────┐
│           Universal Crypto MCP Server                      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Core MCP Server (380+ Tools)                        │ │
│  │  ├─ Blockchain Tools (transfers, queries, contracts) │ │
│  │  ├─ DeFi Tools (swap, lend, borrow, stake)          │ │
│  │  ├─ Analytics Tools (portfolio, market data)         │ │
│  │  └─ Trading Tools (strategies, execution)            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  x402 Payment Gateway                                 │ │
│  │  ├─ Payment Verification (on-chain)                  │ │
│  │  ├─ Pricing Engine (dynamic, tiered)                 │ │
│  │  ├─ Rate Limiting & Analytics                        │ │
│  │  └─ Discovery Protocol                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────┬──────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  EVM Chains  │ │   Solana     │ │  DeFi DEXs   │
│ • Ethereum   │ │ • Mainnet    │ │ • Uniswap    │
│ • Arbitrum   │ │ • Devnet     │ │ • Aave       │
│ • Base       │ │ • SPL Tokens │ │ • Compound   │
│ • Polygon    │ └──────────────┘ │ • Curve      │
│ • Optimism   │                  └──────────────┘
│ • 10+ more   │
└──────────────┘
```

---

## Key Concepts

### Model Context Protocol (MCP)
- **What**: Open protocol for connecting AI assistants to data sources
- **Why**: Standardized way for AI to access external tools
- **How**: JSON-RPC 2.0 over stdio or HTTP

### x402 Protocol
- **What**: Payment protocol for AI agent services (HTTP 402 Payment Required)
- **Why**: Enables monetization of AI services with crypto
- **How**: HTTP headers + on-chain verification

### Multi-Chain Support
- **What**: Single API for 20+ blockchain networks
- **Why**: Eliminate per-chain integration complexity
- **How**: Unified abstractions over viem, ethers, web3.js

### Pay-Per-Request Model
- **What**: Micropayments for each API call
- **Why**: Fair pricing, no subscriptions, no rate limits
- **How**: Crypto payments verified on-chain

---

## Use Cases

### 🤖 AI Agent Capabilities

**Portfolio Management**
```
User: "Show my crypto portfolio across all chains"
Agent: *Uses Universal MCP to query 20+ chains*
        *Aggregates balances, calculates values*
        *Returns formatted portfolio with USD values*
```

**Automated Trading**
```
User: "If ETH drops below $2000, swap 1 ETH to USDC on Arbitrum"
Agent: *Monitors price using market data tools*
        *Executes swap via Uniswap tools*
        *Confirms transaction on-chain*
```

**DeFi Interactions**
```
User: "Find the best yield for 1000 USDC across all chains"
Agent: *Queries lending rates on Aave, Compound, etc.*
        *Compares APYs across chains*
        *Suggests optimal strategy*
```

### 💰 Monetized AI Services

**Premium Data APIs**
```typescript
// Weather API that charges per request
import { wrapWithX402 } from "@nirholas/universal-crypto-mcp/x402";

const app = express();
app.get("/api/weather/:city", async (req, res) => {
  const forecast = await getWeatherForecast(req.params.city);
  res.json(forecast);
});

wrapWithX402(app, {
  pricing: { "GET /api/weather/*": "$0.001" },
  wallet: "0x..." // Payments go here
});
```

**AI Agent Marketplace**
```typescript
// Register your AI service for discovery
import { registerService } from "@nirholas/universal-crypto-mcp/x402";

await registerService({
  name: "crypto-sentiment-analyzer",
  description: "Real-time crypto sentiment analysis",
  pricing: { "analyze": "$0.01" },
  categories: ["analytics", "sentiment"],
});
```

### 🏢 Business Applications

**Analytics Dashboards**
- Build paid analytics APIs
- Charge per query or dataset
- Automatic crypto payment handling

**Trading Bots**
- Multi-chain execution
- DeFi strategy automation
- Risk management tools

**Data Services**
- On-chain data feeds
- Market intelligence
- Transaction monitoring

---

## Technology Stack

### Core Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 18+ | Server execution |
| **Language** | TypeScript 5.0 | Type safety |
| **Protocol** | MCP 1.0 | AI agent communication |
| **Blockchain** | viem, ethers | EVM interactions |
| **Solana** | @solana/web3.js | Solana support |
| **HTTP** | Express 4.x | API server |
| **Payments** | x402 Protocol | Crypto payments |

### Blockchain Integrations

**EVM Chains** (via viem)
- Ethereum, Arbitrum, Base, Polygon, Optimism
- BNB Chain, Avalanche, Fantom
- zkSync, Linea, Scroll, Blast, Mode

**Solana** (via @solana/web3.js)
- Mainnet, Devnet, Testnet
- SPL Token support
- Program interactions

**DeFi Protocols**
- Uniswap V2/V3
- Aave V2/V3
- Compound V2/V3
- Curve Finance

---

## Getting Started

Ready to give AI agents superpowers?

1. **[Installation](installation.md)** - Install in 60 seconds
2. **[Quick Start](quickstart.md)** - Your first blockchain transaction
3. **[Configuration](configuration.md)** - Set up your environment
4. **[x402 Setup](../x402-deploy/quick-start.md)** - Accept payments

---

## Next Steps

<div class="grid cards" markdown>

- 🚀 **[Quick Start Guide](quickstart.md)**

    Get up and running in minutes

- 📚 **[API Reference](../mcp-server/api-reference.md)**

    Complete tool documentation

- 💡 **[Tutorials](../tutorials/index.md)**

    Learn by building real projects

- 💰 **[x402 Deploy](../x402-deploy/overview.md)**

    Monetize your AI services

</div>
