# External Crypto API Integrations

This directory contains comprehensive integrations with major cryptocurrency exchanges and data providers.

## 🔥 Newly Integrated APIs

### Exchanges

#### 1. **Gemini** (`@universal-crypto-mcp/gemini-api`)
- **Type**: Centralized Exchange
- **Features**: Spot trading, market data, account management
- **Documentation**: https://docs.gemini.com/rest-api/
- **Package**: `packages/integrations/external-apis/gemini/`

#### 2. **Bitfinex** (`@universal-crypto-mcp/bitfinex-api`)
- **Type**: Centralized Exchange
- **Features**: Spot, margin, derivatives trading
- **Documentation**: https://docs.bitfinex.com/docs
- **Package**: `packages/integrations/external-apis/bitfinex/`

#### 3. **HTX/Huobi** (`@universal-crypto-mcp/htx-api`)
- **Type**: Centralized Exchange
- **Features**: Spot, margin, futures trading
- **Documentation**: https://www.htx.com/en-us/opend/newApiPages/
- **Package**: `packages/integrations/external-apis/htx/`

#### 4. **Gate.io** (`@universal-crypto-mcp/gateio-api`)
- **Type**: Centralized Exchange
- **Features**: Spot, margin, futures, options trading
- **Documentation**: https://www.gate.io/docs/developers/apiv4
- **Package**: `packages/integrations/external-apis/gateio/`

#### 5. **MEXC** (`@universal-crypto-mcp/mexc-api`)
- **Type**: Centralized Exchange
- **Features**: Spot and margin trading
- **Documentation**: https://mexcdevelop.github.io/apidocs/spot_v3_en/
- **Package**: `packages/integrations/external-apis/mexc/`

#### 6. **Bitget** (`@universal-crypto-mcp/bitget-api`)
- **Type**: Centralized Exchange
- **Features**: Spot, futures, copy trading
- **Documentation**: https://www.bitget.com/api-doc/common/intro
- **Package**: `packages/integrations/external-apis/bitget/`

### Data & Analytics Providers

#### 7. **CryptoCompare** (`@universal-crypto-mcp/cryptocompare-api`)
- **Type**: Market Data & Analytics
- **Features**: Prices, OHLCV, news, social sentiment, on-chain data
- **Documentation**: https://min-api.cryptocompare.com/documentation
- **Package**: `packages/integrations/external-apis/cryptocompare/`

#### 8. **Messari** (`@universal-crypto-mcp/messari-api`)
- **Type**: Research & Analytics
- **Features**: Asset metrics, timeseries, news, quantitative metrics
- **Documentation**: https://messari.io/api/docs
- **Package**: `packages/integrations/external-apis/messari/`
- **Note**: Requires API key for full access

#### 9. **Glassnode** (`@universal-crypto-mcp/glassnode-api`)
- **Type**: On-Chain Analytics
- **Features**: On-chain metrics, market indicators, mining data, exchange flows
- **Documentation**: https://docs.glassnode.com/api/
- **Package**: `packages/integrations/external-apis/glassnode/`
- **Note**: Requires paid API key

## 📊 Previously Integrated APIs

- **Binance** - World's largest exchange
- **Coinbase** - US-regulated exchange
- **Kraken** - European exchange
- **OKX** - Global derivatives exchange
- **Bybit** - Derivatives exchange
- **KuCoin** - Global exchange
- **CoinGecko** - Market data aggregator
- **DeFiLlama** - DeFi analytics

## 🚀 Usage Examples

### Gemini Exchange

```typescript
import gemini from '@universal-crypto-mcp/gemini-api';

// Get ticker
const ticker = await gemini.getTicker('btcusd');

// Get orderbook
const orderbook = await gemini.getOrderbook('btcusd');

// With authentication
const credentials = {
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  sandbox: false
};

const balances = await gemini.getBalances(credentials);
const order = await gemini.placeOrder(credentials, {
  symbol: 'btcusd',
  amount: '0.01',
  price: '50000',
  side: 'buy',
  type: 'exchange limit'
});
```

### CryptoCompare

```typescript
import cryptocompare from '@universal-crypto-mcp/cryptocompare-api';

// Get current price
const price = await cryptocompare.getPrice('BTC', ['USD', 'EUR']);

// Get historical data
const histoDay = await cryptocompare.getHistoDay('BTC', 'USD', {
  limit: 30,
  aggregate: 1
});

// Get news
const news = await cryptocompare.getNews();

// With API key for premium features
const credentials = { apiKey: 'YOUR_API_KEY' };
const topCoins = await cryptocompare.getTopByMarketCap('USD', 100, credentials);
```

### Messari

```typescript
import messari from '@universal-crypto-mcp/messari-api';

const credentials = { apiKey: 'YOUR_API_KEY' };

// Get asset data
const bitcoin = await messari.getAsset('bitcoin', {}, credentials);

// Get price timeseries
const priceData = await messari.getPriceTimeseries('bitcoin', {
  start: '2024-01-01',
  end: '2024-12-31',
  interval: '1d'
}, credentials);

// Get on-chain metrics
const mvrv = await messari.getMVRVTimeseries('bitcoin', {}, credentials);
```

### Glassnode

```typescript
import glassnode from '@universal-crypto-mcp/glassnode-api';

const credentials = { apiKey: 'YOUR_API_KEY' };

// Get active addresses
const activeAddresses = await glassnode.getActiveAddresses(credentials, 'BTC', {
  since: 1640995200,
  interval: '24h'
});

// Get MVRV ratio
const mvrv = await glassnode.getMVRV(credentials, 'BTC');

// Get exchange flows
const exchangeInflow = await glassnode.getExchangeInflow(credentials, 'BTC');
const exchangeOutflow = await glassnode.getExchangeOutflow(credentials, 'BTC');
```

## 🔑 API Key Setup

Most exchanges and premium data providers require API keys:

1. **Exchange APIs**: Create API keys in your account settings
   - Enable only necessary permissions (read, trade, withdraw)
   - Use IP whitelisting when available
   - Store keys securely in environment variables

2. **Data Providers**:
   - **CryptoCompare**: Free tier available, premium for advanced features
   - **Messari**: Requires registration for API access
   - **Glassnode**: Paid subscription required

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for credentials:
   ```bash
   export GEMINI_API_KEY="your-key"
   export GEMINI_API_SECRET="your-secret"
   export GLASSNODE_API_KEY="your-key"
   ```
3. **Limit API key permissions** to only what's needed
4. **Enable IP whitelisting** when available
5. **Rotate keys regularly**
6. **Monitor API usage** for unusual activity

## 📦 Installation

Each integration is a separate package that can be installed independently:

```bash
# Install specific integration
pnpm add @universal-crypto-mcp/gemini-api
pnpm add @universal-crypto-mcp/cryptocompare-api
pnpm add @universal-crypto-mcp/glassnode-api

# Or install all at once
pnpm install
```

## 🧪 Testing

Each integration includes connection test utilities:

```typescript
import gemini from '@universal-crypto-mcp/gemini-api';
import glassnode from '@universal-crypto-mcp/glassnode-api';

// Test public endpoint
const isGeminiUp = await gemini.getServerTime();

// Test authenticated connection
const canConnect = await gemini.testConnection(credentials);
const glassnodeWorks = await glassnode.testConnection({ apiKey: 'key' });
```

## 🌐 Rate Limits

Each API has different rate limits. Consult their documentation:

- **Gemini**: 120 requests/minute (public), 600/minute (private)
- **Bitfinex**: Varies by endpoint
- **HTX**: Varies by endpoint  
- **Gate.io**: Varies by tier
- **MEXC**: 20 requests/second
- **Bitget**: Varies by endpoint
- **CryptoCompare**: 100,000 calls/month (free tier)
- **Messari**: Varies by subscription
- **Glassnode**: Varies by subscription

## 🤝 Contributing

To add a new crypto API integration:

1. Create a new package in `packages/integrations/external-apis/[api-name]/`
2. Implement the API client with TypeScript
3. Add comprehensive types and documentation
4. Include test connection utilities
5. Update this README with usage examples
6. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Links

- [Universal Crypto MCP Documentation](../../docs/)
- [API Integration Guide](../../docs/INTEGRATION_STRATEGY.md)
- [Security Guidelines](../../SECURITY.md)
