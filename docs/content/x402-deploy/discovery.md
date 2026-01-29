# x402 Discovery Network

The discovery network allows AI agents to find and use your paid API.

## What is Discovery?

Discovery enables:
- **AI agents to find APIs** by category, capability, or price
- **Automatic negotiation** of payment terms
- **Semantic search** for relevant services
- **Trust scoring** based on reputation

## Enabling Discovery

### Basic Configuration

```json
{
  "discovery": {
    "enabled": true,
    "categories": ["crypto", "market-data"],
    "instructions": "Real-time crypto price data"
  }
}
```

### Full Configuration

```json
{
  "discovery": {
    "enabled": true,
    "categories": ["crypto", "market-data", "analytics"],
    "tags": ["bitcoin", "ethereum", "prices", "real-time", "API"],
    "instructions": "Use this API to get real-time cryptocurrency prices and analytics. Supports BTC, ETH, and 1000+ tokens.",
    "capabilities": [
      "price-lookup",
      "historical-data",
      "analytics"
    ],
    "examples": [
      {
        "description": "Get Bitcoin price",
        "request": {
          "method": "GET",
          "path": "/api/price/BTC"
        },
        "response": {
          "symbol": "BTC",
          "price": 67890.12,
          "change24h": 2.5
        }
      }
    ],
    "openapi": "/api/openapi.json"
  }
}
```

## Categories

Standard categories for API classification:

| Category | Description |
|----------|-------------|
| `crypto` | Cryptocurrency data |
| `market-data` | Financial market data |
| `analytics` | Data analytics |
| `ai` | AI/ML services |
| `weather` | Weather data |
| `news` | News aggregation |
| `social` | Social media data |
| `compute` | Compute services |
| `storage` | Storage services |
| `search` | Search services |

### Custom Categories

You can use custom categories:

```json
{
  "discovery": {
    "categories": ["crypto", "my-custom-category"]
  }
}
```

## Instructions

The `instructions` field tells AI agents how to use your API:

```json
{
  "discovery": {
    "instructions": "This API provides real-time cryptocurrency prices. Use GET /api/price/{symbol} to get the current price of any supported cryptocurrency. Supported symbols include BTC, ETH, SOL, and 1000+ others. The API returns price in USD, 24h change percentage, and market cap."
  }
}
```

### Best Practices:

- Be specific about endpoints
- List supported parameters
- Describe response format
- Include rate limits
- Mention pricing tiers

## Examples

Provide usage examples for AI agents:

```json
{
  "discovery": {
    "examples": [
      {
        "description": "Get current Bitcoin price",
        "request": {
          "method": "GET",
          "path": "/api/price/BTC"
        },
        "response": {
          "symbol": "BTC",
          "price": 67890.12
        }
      },
      {
        "description": "Get multiple prices",
        "request": {
          "method": "POST",
          "path": "/api/prices",
          "body": {
            "symbols": ["BTC", "ETH", "SOL"]
          }
        },
        "response": {
          "prices": [
            { "symbol": "BTC", "price": 67890.12 },
            { "symbol": "ETH", "price": 3456.78 }
          ]
        }
      }
    ]
  }
}
```

## OpenAPI Integration

Link to your OpenAPI specification:

```json
{
  "discovery": {
    "openapi": "/api/openapi.json"
  }
}
```

AI agents can use this for detailed endpoint information.

## Registration

### Automatic Registration

On deployment, your API is automatically registered:

```bash
npx @nirholas/x402-deploy deploy
# ✓ Deployed to https://my-api.vercel.app
# ✓ Registered in discovery network
```

### Manual Registration

Register manually:

```bash
npx @nirholas/x402-deploy register --url https://my-api.com
```

### Verify Registration

Check your registration:

```bash
npx @nirholas/x402-deploy status
# API: crypto-data-api
# URL: https://my-api.com
# Status: Active
# Categories: crypto, market-data
# Trust Score: 98
```

## Discovery API

### Search APIs

AI agents can search for APIs:

```typescript
import { discoverAPIs } from "@nirholas/x402-deploy/discovery";

// Find crypto price APIs under $0.01
const apis = await discoverAPIs({
  categories: ["crypto"],
  capabilities: ["price-lookup"],
  maxPrice: "$0.01",
});

// Returns:
[
  {
    name: "crypto-data-api",
    url: "https://api.x402.dev/crypto-data",
    instructions: "Real-time crypto prices...",
    pricing: {
      "GET /api/price/*": "$0.0001"
    },
    trustScore: 98
  }
]
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `categories` | string[] | Filter by categories |
| `tags` | string[] | Filter by tags |
| `capabilities` | string[] | Filter by capabilities |
| `maxPrice` | string | Maximum price per request |
| `minTrustScore` | number | Minimum trust score (0-100) |
| `query` | string | Semantic search query |

### Semantic Search

```typescript
const apis = await discoverAPIs({
  query: "I need to get Bitcoin price history for the last 30 days",
});
```

## Trust Score

APIs are assigned trust scores based on:

| Factor | Weight |
|--------|--------|
| Uptime | 30% |
| Response time | 20% |
| Payment reliability | 25% |
| User ratings | 15% |
| Age | 10% |

### Improving Trust Score

- Maintain high uptime (99.9%+)
- Fast response times (<100ms)
- Always deliver promised content
- Get positive user reviews
- Consistent operation over time

## llms.txt Support

Your API automatically serves `llms.txt` for LLM discovery:

```
# My Crypto API

> Real-time cryptocurrency prices and analytics

## Endpoints

- GET /api/price/{symbol} - Get current price ($0.0001)
- GET /api/history/{symbol} - Get price history ($0.001)

## Payment

Accepts USDC on Arbitrum One
Wallet: 0x...
```

Access at: `https://your-api.com/llms.txt`

## Opting Out

Disable discovery:

```json
{
  "discovery": {
    "enabled": false
  }
}
```

Or add to robots.txt:

```
User-agent: x402-crawler
Disallow: /
```

## Next Steps

- [Quick Start](quick-start.md) - Get started
- [Configuration](configuration.md) - Full configuration reference
