# x402-deploy Examples

Complete, runnable examples showing how to monetize different types of APIs.

## 📁 Quick Examples

### Quick Start (`quickstart.ts`)
The simplest possible x402 API with marketplace integration.
- **Language:** TypeScript
- **Lines:** ~30
- **Features:** Discovery + Marketplace
- **Run:** `tsx quickstart.ts`

### Full Integration (`marketplace-integration.ts`)
Complete example with all Agent 13 & 14 features.
- **Language:** TypeScript
- **Features:** 
  - ✅ Marketplace API endpoints
  - ✅ Discovery document (/.well-known/x402)
  - ✅ OpenAPI specification
  - ✅ AI instructions (llms.txt)
  - ✅ x402scan registration
- **Run:** `tsx marketplace-integration.ts`

## 📁 Complete Projects

### 1. MCP Server (`mcp-calculator/`)
A simple calculator Model Context Protocol server with x402 payments.
- **Type:** MCP Server
- **Language:** TypeScript
- **Price:** $0.001 per calculation
- **Network:** Base (eip155:8453)

### 2. Express API (`express-weather/`)
REST API serving weather data with tiered pricing.
- **Type:** Express API
- **Language:** TypeScript
- **Pricing:** Tiered ($0.001 basic, $0.01 detailed)
- **Network:** Base (eip155:8453)

### 3. FastAPI Service (`fastapi-translation/`)
Translation API with subscription model.
- **Type:** FastAPI
- **Language:** Python
- **Pricing:** Subscription ($10/month, 1000 calls)
- **Network:** Base (eip155:8453)

### 4. Next.js API Routes (`nextjs-image-api/`)
Image processing API with credit-based pricing.
- **Type:** Next.js
- **Language:** TypeScript
- **Pricing:** Credit-based (1 credit per image)
- **Network:** Base (eip155:8453)

## 🚀 Quick Start

Each example has its own README with:
- Setup instructions
- Configuration details
- Deployment commands
- Testing steps

### Run a Simple Example

```bash
# Quick start (30 lines)
npx tsx examples/quickstart.ts

# Full integration (all features)
npx tsx examples/marketplace-integration.ts
```

### Run a Complete Project

```bash
# Choose an example
cd examples/mcp-calculator

# Initialize x402
npx x402-deploy init

# Deploy to Railway
npx x402-deploy deploy railway
```

## 🧪 Testing Examples

All examples can be tested locally:

```bash
cd examples/mcp-calculator
npm install
npm run dev

# In another terminal
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -H "X-Payment-Hash: <tx-hash>" \
  -d '{"operation": "add", "a": 5, "b": 3}'
```

## 📚 Learning Path

1. Start with **mcp-calculator** - simplest example
2. Try **express-weather** - learn tiered pricing
3. Explore **fastapi-translation** - subscription model
4. Build **nextjs-image-api** - credit system

## 💡 Advanced Features

See `advanced-features.ts` for examples of:
- Multi-chain payments
- Subscription management
- Credit systems
- Monitoring and alerts

## 🔗 Resources

- [Main Documentation](../README.md)
- [Configuration Guide](../docs/configuration.md)
- [Pricing Strategies](../docs/pricing.md)
- [Deployment Guide](../docs/deployment.md)
