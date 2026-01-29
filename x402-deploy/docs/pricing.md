# Pricing Strategies

Comprehensive guide to monetizing your API with flexible pricing models.

---

## Pricing Models Overview

| Model | Description | Best For |
|-------|-------------|----------|
| **Per-Call** | Fixed price per API request | Simple APIs |
| **Tiered** | Volume-based discounts | High-volume APIs |
| **Time-Based** | Subscription per time period | SaaS products |
| **Dynamic** | Price based on compute/resources | AI/ML APIs |

---

## Per-Call Pricing

The simplest and most common model. Each API call costs a fixed amount.

### Basic Configuration

```json
{
  "pricing": {
    "model": "per-call",
    "default": {
      "price": "$0.01",
      "currency": "USD"
    }
  }
}
```

### Route-Specific Pricing

Different prices for different endpoints:

```json
{
  "pricing": {
    "model": "per-call",
    "default": { "price": "$0.001" },
    "routes": {
      "GET /api/status": "$0",
      "GET /api/data": "$0.001",
      "GET /api/premium/*": "$0.01",
      "POST /api/generate": "$0.10",
      "POST /api/train": "$1.00",
      "* /api/admin/*": "$0"
    }
  }
}
```

### Route Pattern Matching

| Pattern | Matches |
|---------|---------|
| `GET /api/users` | Exact match |
| `GET /api/users/*` | Any path under /api/users |
| `* /api/data` | Any HTTP method to /api/data |
| `POST /api/*` | Any POST under /api |
| `* /*` | Everything (catch-all) |

### Free Routes

Set price to `"$0"` for free endpoints:

```json
{
  "routes": {
    "GET /health": "$0",
    "GET /api/status": "$0",
    "GET /docs/*": "$0"
  }
}
```

---

## Tiered Pricing

Volume discounts for high-usage customers.

### Configuration

```json
{
  "pricing": {
    "model": "tiered",
    "tiers": [
      { "upTo": 1000, "price": "$0.01" },
      { "upTo": 10000, "price": "$0.008" },
      { "upTo": 100000, "price": "$0.005" },
      { "upTo": null, "price": "$0.002" }
    ],
    "resetPeriod": "monthly"
  }
}
```

### How It Works

| Calls | Price Per Call | Example Cost |
|-------|----------------|--------------|
| 1-1,000 | $0.01 | $10.00 |
| 1,001-10,000 | $0.008 | $72.00 |
| 10,001-100,000 | $0.005 | $450.00 |
| 100,001+ | $0.002 | $0.002 each |

### Tiered by Route

```json
{
  "pricing": {
    "model": "tiered",
    "routes": {
      "GET /api/basic/*": {
        "tiers": [
          { "upTo": 10000, "price": "$0.001" },
          { "upTo": null, "price": "$0.0005" }
        ]
      },
      "POST /api/ai/*": {
        "tiers": [
          { "upTo": 100, "price": "$0.10" },
          { "upTo": 1000, "price": "$0.05" },
          { "upTo": null, "price": "$0.02" }
        ]
      }
    }
  }
}
```

---

## Time-Based Pricing

Subscription model with time-limited access.

### Configuration

```json
{
  "pricing": {
    "model": "subscription",
    "plans": [
      {
        "name": "hourly",
        "price": "$0.50",
        "duration": "1h",
        "callLimit": 1000
      },
      {
        "name": "daily",
        "price": "$5.00",
        "duration": "24h",
        "callLimit": 10000
      },
      {
        "name": "monthly",
        "price": "$50.00",
        "duration": "30d",
        "callLimit": null
      }
    ]
  }
}
```

### Subscription Flow

1. Client pays for subscription plan
2. Receives access token valid for duration
3. Makes unlimited calls (up to limit)
4. Token expires, must renew

---

## Dynamic Pricing

Price based on actual resource usage.

### Configuration

```json
{
  "pricing": {
    "model": "dynamic",
    "basePrice": "$0.001",
    "factors": {
      "computeTime": {
        "perMs": "$0.000001"
      },
      "responseSize": {
        "perKb": "$0.0001"
      },
      "modelUsage": {
        "gpt-4": "$0.03",
        "gpt-3.5": "$0.002",
        "claude": "$0.025"
      }
    },
    "minimum": "$0.001",
    "maximum": "$10.00"
  }
}
```

### Use Cases

- **AI APIs**: Charge based on tokens/model used
- **Image Processing**: Charge based on image size
- **Video Processing**: Charge based on duration
- **Compute APIs**: Charge based on CPU time

---

## Pricing CLI Commands

### View Current Pricing

```bash
x402-deploy pricing --list
```

Output:
```
┌────────────────────────────┬──────────┐
│ Route                      │ Price    │
├────────────────────────────┼──────────┤
│ GET /health                │ FREE     │
│ GET /api/*                 │ $0.001   │
│ POST /api/generate         │ $0.10    │
│ POST /api/train            │ $1.00    │
└────────────────────────────┴──────────┘
```

### Update Pricing

```bash
# Set route price
x402-deploy pricing --route "GET /api/data" --price "$0.02"

# Set default price
x402-deploy pricing --default "$0.005"

# Make route free
x402-deploy pricing --route "GET /status" --price "$0"
```

### Pricing Simulation

Test pricing before deploying:

```bash
x402-deploy pricing --simulate
```

Output:
```
Pricing Simulation (1000 requests):
────────────────────────────────────
GET /api/data (400 calls)    → $0.40
POST /api/generate (100 calls) → $10.00
GET /api/status (500 calls)  → $0.00
────────────────────────────────────
Total Revenue:                 $10.40
Average per call:              $0.0104
```

---

## Currency & Token Support

### Supported Tokens

| Token | Networks | Decimals |
|-------|----------|----------|
| USDC | Base, Arbitrum, Polygon, Optimism | 6 |
| USDT | Ethereum, Polygon, Arbitrum | 6 |
| DAI | Ethereum, Polygon, Optimism | 18 |
| ETH | All EVM chains | 18 |

### Configuration

```json
{
  "payment": {
    "token": "USDC",
    "network": "eip155:8453",
    "acceptedTokens": ["USDC", "USDT", "DAI"]
  }
}
```

### Multi-Token Pricing

```json
{
  "pricing": {
    "model": "per-call",
    "default": {
      "USDC": "0.01",
      "ETH": "0.000003",
      "DAI": "0.01"
    }
  }
}
```

---

## Best Practices

### 1. Start Simple

Begin with per-call pricing, then add complexity:

```json
{
  "pricing": {
    "model": "per-call",
    "default": { "price": "$0.01" }
  }
}
```

### 2. Free Health Endpoints

Always keep monitoring endpoints free:

```json
{
  "routes": {
    "GET /health": "$0",
    "GET /ready": "$0",
    "GET /metrics": "$0"
  }
}
```

### 3. Consider Your Costs

Calculate your costs and add margin:

| Your Cost | Suggested Price | Margin |
|-----------|-----------------|--------|
| $0.001 | $0.005 | 400% |
| $0.01 | $0.03 | 200% |
| $0.10 | $0.25 | 150% |

### 4. Document Your Pricing

Add pricing info to your API docs:

```json
{
  "discovery": {
    "instructions": "AI data API. Pricing: $0.001/call for reads, $0.01/call for writes.",
    "pricing": {
      "summary": "Per-call pricing starting at $0.001",
      "documentation": "https://myapi.com/pricing"
    }
  }
}
```

### 5. A/B Test Prices

Use environments for pricing experiments:

```bash
# Production pricing
x402-deploy deploy --env production

# Test higher prices
x402-deploy deploy --env pricing-test-a
```

---

## Pricing Examples

### Simple REST API

```json
{
  "pricing": {
    "model": "per-call",
    "default": { "price": "$0.001" },
    "routes": {
      "GET /health": "$0",
      "GET /api/*": "$0.001",
      "POST /api/*": "$0.005",
      "DELETE /api/*": "$0.005"
    }
  }
}
```

### AI/ML API

```json
{
  "pricing": {
    "model": "per-call",
    "routes": {
      "POST /api/embed": "$0.0001",
      "POST /api/chat": "$0.01",
      "POST /api/generate-image": "$0.05",
      "POST /api/train": "$1.00"
    }
  }
}
```

### Data API with Volume Discounts

```json
{
  "pricing": {
    "model": "tiered",
    "tiers": [
      { "upTo": 10000, "price": "$0.001" },
      { "upTo": 100000, "price": "$0.0005" },
      { "upTo": null, "price": "$0.0001" }
    ]
  }
}
```

### MCP Server

```json
{
  "pricing": {
    "model": "per-call",
    "routes": {
      "tools/list": "$0",
      "tools/call:get_weather": "$0.01",
      "tools/call:search_web": "$0.05",
      "tools/call:execute_code": "$0.10"
    }
  }
}
```

---

## Revenue Projections

Use the dashboard to project revenue:

```bash
x402-deploy dashboard --projections
```

```
Revenue Projections (based on last 7 days)
──────────────────────────────────────────
Current daily average:     $12.45
Projected monthly:         $373.50
Projected yearly:          $4,544.25

Top earning routes:
1. POST /api/generate      $8.50/day (68%)
2. GET /api/data           $2.45/day (20%)
3. POST /api/analyze       $1.50/day (12%)
```

---

## Next Steps

- [Dashboard Guide](dashboard.md) - Monitor your earnings
- [API Reference](api.md) - Programmatic pricing control
- [Configuration](configuration.md) - Full config reference

---

[← Back to Docs](../README.md)
