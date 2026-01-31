# API Reference

Complete API documentation for the Universal Crypto MCP Gateway.

## Base URL

```
Production: https://api.universalcrypto.io
Development: http://localhost:3000
```

## Authentication

### x402 Payment Headers

For paid endpoints, include payment proof in headers:

```http
X-Payment-Proof: 0x1234567890abcdef... (EIP-191 signature)
X-Payment-Token: USDC
X-Payment-Chain: base
X-Payment-Address: 0xYourWalletAddress
```

### API Keys (Optional)

```http
X-API-Key: your-api-key-here
```

## Response Format

### Success Response

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "requestId": "uuid-v4",
    "timestamp": 1738368000,
    "cached": false
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "requestId": "uuid-v4",
  "timestamp": 1738368000
}
```

### 402 Payment Required

```json
{
  "error": "Payment required",
  "payment": {
    "amount": "0.001",
    "token": "USDC",
    "network": "base",
    "recipient": "0xB1314Ed50b273A9c1dA9a43860d853F179868296",
    "validUntil": 1738368000,
    "signature": "Sign this message to authorize payment"
  }
}
```

## Health & Monitoring

### GET /health

Health check endpoint.

**Response:** `200 OK`

```json
{
  "status": "healthy",
  "timestamp": 1738368000,
  "uptime": 3600,
  "version": "1.0.0"
}
```

### GET /ready

Readiness probe for load balancers.

**Response:** `200 OK` when ready, `503` when not ready

### GET /live

Liveness probe for orchestrators.

**Response:** `200 OK` when alive

### GET /metrics

Prometheus metrics endpoint.

**Response:** `200 OK` (text/plain)

```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/api/v1/prices",status="200"} 1234

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 950
```

## API Discovery

### GET /api

Get API documentation and available endpoints.

**Response:** `200 OK`

```json
{
  "name": "Universal Crypto MCP Gateway",
  "version": "1.0.0",
  "description": "Enterprise x402 payment gateway for crypto MCP services",
  "endpoints": [ ... ],
  "pricing": { ... },
  "documentation": "https://docs.universal-crypto-mcp.com"
}
```

## Free Tier Endpoints

### GET /api/v1/prices/:symbol

Get basic price data for a cryptocurrency.

**Rate Limit:** 10 req/min  
**Cost:** FREE

**Parameters:**
- `symbol` (path) - Token symbol (e.g., BTC, ETH, SOL)

**Example Request:**

```http
GET /api/v1/prices/BTC
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "symbol": "BTC",
    "price": 42000.50,
    "currency": "USD",
    "change24h": 2.5,
    "timestamp": 1738368000
  }
}
```

## Paid Endpoints (x402)

### GET /api/v1/market/:symbol/full

Get comprehensive market data.

**Cost:** $0.001 USDC per request  
**Rate Limit:** Unlimited with payment

**Parameters:**
- `symbol` (path) - Token symbol

**Example Request:**

```http
GET /api/v1/market/ETH/full
X-Payment-Proof: 0x1234...
X-Payment-Token: USDC
X-Payment-Chain: base
X-Payment-Address: 0xABCD...
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "symbol": "ETH",
    "price": 2500.00,
    "marketCap": 300000000000,
    "volume24h": 15000000000,
    "high24h": 2550.00,
    "low24h": 2450.00,
    "change24h": 3.2,
    "change7d": 12.5,
    "ath": 4878.26,
    "atl": 0.43,
    "circulatingSupply": 120000000,
    "totalSupply": 120000000,
    "rank": 2
  }
}
```

### GET /api/v1/trading/signals/:symbol

Get AI-powered trading signals.

**Cost:** $0.01 USDC per request  
**Rate Limit:** Unlimited with payment

**Parameters:**
- `symbol` (path) - Trading pair (e.g., ETHUSDT)

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "symbol": "ETHUSDT",
    "signal": "BUY",
    "confidence": 0.85,
    "entry": 2500.00,
    "targets": [2550.00, 2600.00, 2650.00],
    "stopLoss": 2450.00,
    "timeframe": "4h",
    "indicators": {
      "rsi": 45,
      "macd": "bullish",
      "ema": "golden_cross"
    }
  }
}
```

### GET /api/v1/defi/:protocol/rates

Get DeFi protocol lending/borrowing rates.

**Cost:** $0.005 USDC per request  
**Rate Limit:** Unlimited with payment

**Parameters:**
- `protocol` (path) - Protocol name (aave, compound, curve)

**Query Parameters:**
- `network` (optional) - Network (mainnet, polygon, arbitrum)

**Example Request:**

```http
GET /api/v1/defi/aave/rates?network=mainnet
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "protocol": "aave",
    "network": "mainnet",
    "markets": [
      {
        "asset": "USDC",
        "supplyAPY": 3.5,
        "borrowAPY": 5.2,
        "totalSupply": "1500000000",
        "totalBorrow": "800000000",
        "utilizationRate": 0.53
      },
      {
        "asset": "ETH",
        "supplyAPY": 2.1,
        "borrowAPY": 3.8,
        "totalSupply": "500000",
        "totalBorrow": "200000",
        "utilizationRate": 0.40
      }
    ]
  }
}
```

### GET /api/v1/wallet/:address/analysis

Comprehensive wallet analysis.

**Cost:** $0.02 USDC per request  
**Rate Limit:** Unlimited with payment

**Parameters:**
- `address` (path) - Wallet address (0x...)

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "address": "0x1234...5678",
    "balance": {
      "eth": 10.5,
      "usd": 26250.00
    },
    "tokens": [
      {
        "symbol": "USDC",
        "balance": 5000,
        "value": 5000
      }
    ],
    "nfts": {
      "count": 15,
      "collections": ["BoredApes", "CryptoPunks"]
    },
    "defi": {
      "totalValueLocked": 15000,
      "positions": [
        {
          "protocol": "Aave",
          "type": "lending",
          "value": 10000
        }
      ]
    },
    "activity": {
      "txCount": 1234,
      "firstTx": "2021-01-01",
      "lastTx": "2026-01-31"
    }
  }
}
```

### POST /api/v1/trading/execute

Execute trade via AI trading bot.

**Cost:** $0.10 USDC per trade  
**Rate Limit:** Unlimited with payment

**Request Body:**

```json
{
  "pair": "ETHUSDT",
  "side": "BUY",
  "amount": 1.0,
  "type": "MARKET",
  "slippage": 0.5
}
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "orderId": "abc123",
    "pair": "ETHUSDT",
    "side": "BUY",
    "amount": 1.0,
    "price": 2500.00,
    "filled": 1.0,
    "status": "FILLED",
    "timestamp": 1738368000
  }
}
```

### POST /api/v1/mev/analyze

Analyze MEV opportunities.

**Cost:** $0.05 USDC per request  
**Rate Limit:** Unlimited with payment

**Request Body:**

```json
{
  "transaction": "0x123...",
  "network": "mainnet"
}
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "mevPotential": 0.5,
    "opportunities": [
      {
        "type": "arbitrage",
        "profit": 0.3,
        "exchanges": ["Uniswap", "Sushiswap"]
      }
    ]
  }
}
```

### POST /api/v1/security/audit

AI-powered smart contract audit.

**Cost:** $1.00 USDC per contract  
**Rate Limit:** Unlimited with payment

**Request Body:**

```json
{
  "contractAddress": "0x123...",
  "network": "mainnet",
  "source": "..."
}
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "score": 85,
    "risk": "MEDIUM",
    "vulnerabilities": [
      {
        "severity": "HIGH",
        "type": "Reentrancy",
        "line": 42,
        "description": "..."
      }
    ],
    "recommendations": [ ... ]
  }
}
```

## MCP Protocol Endpoints

### POST /mcp

Execute MCP tool by name.

**Cost:** $0.001 base + $0.005 per tool  
**Rate Limit:** Unlimited with payment

**Request Body:**

```json
{
  "method": "aave.getMarkets",
  "params": {
    "network": "mainnet"
  }
}
```

**Example Response:**

```json
{
  "status": "success",
  "data": {
    "markets": [ ... ]
  }
}
```

### GET /mcp/tools

List all available MCP tools.

**Cost:** FREE  
**Rate Limit:** 10 req/min

**Example Response:**

```json
{
  "tools": [
    {
      "name": "aave.getMarkets",
      "description": "Get Aave lending markets",
      "serverId": "aave",
      "inputSchema": {
        "type": "object",
        "properties": {
          "network": {
            "type": "string",
            "enum": ["mainnet", "polygon"]
          }
        }
      }
    }
  ],
  "pricing": {
    "free": "Limited free access",
    "x402": "Pay-per-use with crypto"
  }
}
```

### GET /mcp/sse

Server-Sent Events streaming endpoint.

**Cost:** $0.01 USDC per hour  
**Rate Limit:** Unlimited with payment

**Example:**

```javascript
const eventSource = new EventSource('/mcp/sse');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

## Rate Limiting

### Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1738368000
```

### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "upgrade": "Pay with x402 for unlimited access",
  "pricing": "/api/pricing"
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `PAYMENT_REQUIRED` | 402 | Payment needed for this endpoint |
| `NOT_FOUND` | 404 | Endpoint or resource not found |
| `RATE_LIMIT` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |
| `BAD_GATEWAY` | 502 | MCP server unavailable |
| `TIMEOUT` | 504 | Request timeout |

## SDKs & Examples

### JavaScript/TypeScript

```typescript
import { UniversalCryptoClient } from '@universal-crypto-mcp/sdk';

const client = new UniversalCryptoClient({
  apiKey: 'your-api-key',
  wallet: '0xYourWallet',
  network: 'base'
});

// Free tier
const price = await client.prices.get('BTC');

// Paid tier (auto-handles x402 payment)
const marketData = await client.market.getFull('ETH');
```

### Python

```python
from universal_crypto_mcp import Client

client = Client(
    api_key='your-api-key',
    wallet='0xYourWallet',
    network='base'
)

# Free tier
price = client.prices.get('BTC')

# Paid tier
market_data = client.market.get_full('ETH')
```

### cURL

```bash
# Free tier
curl https://api.universalcrypto.io/api/v1/prices/BTC

# Paid tier (with payment proof)
curl -X GET \
  https://api.universalcrypto.io/api/v1/market/ETH/full \
  -H "X-Payment-Proof: 0x1234..." \
  -H "X-Payment-Token: USDC" \
  -H "X-Payment-Chain: base" \
  -H "X-Payment-Address: 0xABCD..."
```
