# x402-deploy Configuration

Complete reference for x402-deploy configuration options.

## Configuration File

Create `x402.config.json` in your project root:

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "description": "My paid API",
  "payment": {
    "wallet": "0x...",
    "network": "eip155:42161"
  },
  "pricing": {
    "routes": {}
  },
  "discovery": {},
  "dashboard": {},
  "security": {}
}
```

## Configuration Sections

### Basic Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | API name |
| `version` | string | No | API version |
| `description` | string | No | API description |
| `homepage` | string | No | API documentation URL |

```json
{
  "name": "crypto-data-api",
  "version": "2.0.0",
  "description": "Real-time cryptocurrency data for AI agents",
  "homepage": "https://docs.x402.dev"
}
```

### Payment Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payment.wallet` | string | Yes | Receiving wallet address |
| `payment.network` | string | Yes | Network identifier |
| `payment.assets` | string[] | No | Accepted assets |
| `payment.facilitator` | string | No | Payment facilitator URL |

```json
{
  "payment": {
    "wallet": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "network": "eip155:42161",
    "assets": ["USDC", "USDs"],
    "facilitator": "https://facilitator.x402.org"
  }
}
```

### Supported Networks

| Network | Identifier | Chain ID |
|---------|------------|----------|
| Arbitrum One | `eip155:42161` | 42161 |
| Base | `eip155:8453` | 8453 |
| Ethereum | `eip155:1` | 1 |
| Polygon | `eip155:137` | 137 |
| Optimism | `eip155:10` | 10 |

### Pricing Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pricing.routes` | object | Yes | Route pricing map |
| `pricing.default` | string | No | Default price for unlisted routes |
| `pricing.currency` | string | No | Currency (default: USD) |

```json
{
  "pricing": {
    "default": "$0.001",
    "currency": "USD",
    "routes": {
      "GET /api/free/*": "free",
      "GET /api/basic/*": "$0.0001",
      "GET /api/premium/*": "$0.01",
      "POST /api/analyze": "$0.05",
      "* /api/admin/*": "blocked"
    }
  }
}
```

#### Route Patterns

| Pattern | Description |
|---------|-------------|
| `GET /path` | Exact match, GET only |
| `POST /path` | Exact match, POST only |
| `* /path` | Any HTTP method |
| `/path/*` | Wildcard suffix |
| `/path/:param` | Path parameter |
| `/path/**` | Deep wildcard |

#### Pricing Values

| Value | Description |
|-------|-------------|
| `"free"` | No payment required |
| `"$0.01"` | USD amount |
| `"0.01"` | Numeric USD amount |
| `"blocked"` | Reject requests |

### Discovery Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `discovery.enabled` | boolean | No | Enable discovery (default: true) |
| `discovery.categories` | string[] | No | API categories |
| `discovery.tags` | string[] | No | Searchable tags |
| `discovery.instructions` | string | No | Instructions for AI agents |
| `discovery.examples` | object[] | No | Usage examples |

```json
{
  "discovery": {
    "enabled": true,
    "categories": ["crypto", "market-data", "analytics"],
    "tags": ["bitcoin", "ethereum", "prices", "real-time"],
    "instructions": "Use this API to get real-time cryptocurrency prices. Call GET /api/price/{symbol} with a symbol like BTC or ETH.",
    "examples": [
      {
        "description": "Get Bitcoin price",
        "request": {
          "method": "GET",
          "path": "/api/price/BTC"
        },
        "response": {
          "symbol": "BTC",
          "price": 67890.12
        }
      }
    ]
  }
}
```

### Dashboard Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dashboard.enabled` | boolean | No | Enable dashboard (default: true) |
| `dashboard.path` | string | No | Dashboard URL path |
| `dashboard.auth` | object | No | Dashboard authentication |

```json
{
  "dashboard": {
    "enabled": true,
    "path": "/x402/dashboard",
    "auth": {
      "type": "bearer",
      "token": "${DASHBOARD_TOKEN}"
    }
  }
}
```

### Security Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `security.rateLimit` | object | No | Rate limiting settings |
| `security.cors` | object | No | CORS settings |
| `security.ipWhitelist` | string[] | No | Allowed IPs |

```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 60000,
      "max": 100
    },
    "cors": {
      "origin": "*",
      "methods": ["GET", "POST"]
    },
    "ipWhitelist": ["10.0.0.0/8"]
  }
}
```

## Environment Variables

Environment variables can be used in the config file with `${VAR_NAME}` syntax:

```json
{
  "payment": {
    "wallet": "${X402_WALLET}"
  },
  "dashboard": {
    "auth": {
      "token": "${DASHBOARD_TOKEN}"
    }
  }
}
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `X402_WALLET` | Payment receiving address |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `X402_NETWORK` | Payment network | `eip155:42161` |
| `X402_FACILITATOR` | Facilitator URL | Public facilitator |
| `DASHBOARD_TOKEN` | Dashboard auth token | None |

## Programmatic Configuration

```typescript
import { createX402Config } from "@nirholas/x402-deploy";

const config = createX402Config({
  name: "my-api",
  payment: {
    wallet: process.env.X402_WALLET,
    network: "eip155:42161",
  },
  pricing: {
    routes: {
      "GET /api/*": "$0.001",
    },
  },
});
```

## Validation

Validate your configuration:

```bash
npx @nirholas/x402-deploy validate
```

## Full Example

```json
{
  "name": "crypto-intelligence-api",
  "version": "1.0.0",
  "description": "AI-powered cryptocurrency analysis and predictions",
  "homepage": "https://crypto-intel.x402.dev",
  
  "payment": {
    "wallet": "${X402_WALLET}",
    "network": "eip155:42161",
    "assets": ["USDC", "USDs"]
  },
  
  "pricing": {
    "default": "blocked",
    "currency": "USD",
    "routes": {
      "GET /api/v1/health": "free",
      "GET /api/v1/status": "free",
      "GET /api/v1/price/:symbol": "$0.0001",
      "GET /api/v1/prices": "$0.0005",
      "GET /api/v1/analysis/:symbol": "$0.01",
      "POST /api/v1/predict": "$0.05",
      "POST /api/v1/backtest": "$0.10"
    }
  },
  
  "discovery": {
    "enabled": true,
    "categories": ["crypto", "analytics", "predictions"],
    "tags": ["bitcoin", "ethereum", "ai", "machine-learning"],
    "instructions": "Use this API for cryptocurrency analysis and AI predictions.",
    "examples": [
      {
        "description": "Get price analysis",
        "request": { "method": "GET", "path": "/api/v1/analysis/BTC" }
      }
    ]
  },
  
  "dashboard": {
    "enabled": true,
    "path": "/x402/dashboard",
    "auth": {
      "type": "bearer",
      "token": "${DASHBOARD_TOKEN}"
    }
  },
  
  "security": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 60000,
      "max": 1000
    },
    "cors": {
      "origin": "*"
    }
  }
}
```

## Next Steps

- [Providers](providers.md) - Payment providers and networks
- [Discovery](discovery.md) - AI agent discovery network
