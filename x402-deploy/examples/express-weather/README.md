# Weather API with x402 Payments

A REST API serving weather data with tiered pricing powered by x402 cryptocurrency payments.

## 💰 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Basic** | $0.001 | Current weather conditions |
| **Detailed** | $0.01 | 7-day forecast + 30-day historical data |
| **Premium** | $0.05 | Alerts, radar, satellite, air quality, UV index |

All payments in **USDC on Base network** (eip155:8453).

## 🚀 Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure

Set your wallet address:

```bash
export X402_WALLET=0xYourWalletAddress
```

Or edit `x402.config.json`:

```json
{
  "payment": {
    "wallet": "0xYourWalletAddress"
  }
}
```

### 3. Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### 4. Deploy

```bash
npx x402-deploy deploy railway
```

## 📡 API Endpoints

### Basic Tier ($0.001)

#### GET `/api/weather/current`

Get current weather conditions.

**Query Parameters:**
- `location` (string): City name (default: "New York")

**Example:**
```bash
curl "http://localhost:3000/api/weather/current?location=London" \
  -H "X-Payment-Hash: 0x..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "London",
    "temperature": 15,
    "condition": "Cloudy",
    "humidity": 65,
    "wind_speed": 12,
    "timestamp": "2026-01-29T10:30:00.000Z"
  },
  "tier": "basic",
  "cost": "$0.001"
}
```

### Detailed Tier ($0.01)

#### GET `/api/weather/forecast`

7-day weather forecast.

```bash
curl "http://localhost:3000/api/weather/forecast?location=Tokyo" \
  -H "X-Payment-Hash: 0x..."
```

#### GET `/api/weather/historical`

Historical weather data.

**Query Parameters:**
- `location` (string): City name
- `days` (number): Number of days (default: 30)

```bash
curl "http://localhost:3000/api/weather/historical?location=Paris&days=30" \
  -H "X-Payment-Hash: 0x..."
```

### Premium Tier ($0.05)

#### GET `/api/weather/premium`

Full weather package with radar and satellite.

```bash
curl "http://localhost:3000/api/weather/premium?location=Berlin" \
  -H "X-Payment-Hash: 0x..."
```

**Response includes:**
- Current conditions
- 7-day forecast
- Radar URL
- Satellite URL
- Air quality index
- UV index
- Pollen count

#### GET `/api/weather/alerts`

Active weather alerts and warnings.

```bash
curl "http://localhost:3000/api/weather/alerts?location=Miami" \
  -H "X-Payment-Hash: 0x..."
```

### Free Endpoints

- `GET /health` - Health check
- `GET /docs` - API documentation
- `GET /.well-known/x402` - Payment discovery

## 💳 Making Payments

### 1. Get Payment Info

```bash
curl http://localhost:3000/.well-known/x402
```

### 2. Send USDC Payment

Send USDC on Base network to the wallet address.

### 3. Call API with Payment Hash

```bash
curl "http://localhost:3000/api/weather/current?location=London" \
  -H "X-Payment-Hash: 0xtransactionhash" \
  -H "Content-Type: application/json"
```

## 📊 View Analytics

```bash
npx x402-deploy dashboard
```

Dashboard shows:
- Total revenue per tier
- Most popular locations
- Request volume
- Payment history

## 🧪 Testing

### Test Mode

Skip payment verification during development:

```bash
X402_TEST_MODE=true npm run dev
```

### Test Requests

```bash
# Basic tier
curl "http://localhost:3000/api/weather/current?location=London"

# Detailed tier
curl "http://localhost:3000/api/weather/forecast?location=Tokyo"

# Premium tier
curl "http://localhost:3000/api/weather/premium?location=Paris"
```

## 🔧 Configuration

### Custom Pricing

Edit `x402.config.json`:

```json
{
  "pricing": {
    "routes": {
      "/api/weather/current": "$0.002",
      "/api/weather/forecast": "$0.02"
    }
  }
}
```

### Add Subscriptions

```json
{
  "subscriptions": {
    "basic": {
      "price": "$5",
      "duration": "30d",
      "routes": ["/api/weather/current"]
    },
    "pro": {
      "price": "$20",
      "duration": "30d",
      "routes": ["*"]
    }
  }
}
```

## 🌐 Real Weather Data

To use real weather data, integrate an external API:

```typescript
import axios from "axios";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function getRealWeather(location: string) {
  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json`,
    {
      params: {
        key: WEATHER_API_KEY,
        q: location,
      },
    }
  );
  return response.data;
}
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com)
- [x402 Protocol](https://x402.dev)
- [Base Network](https://base.org)
- [Parent Project](../../README.md)
