---
title: "Market Data API Reference"
description: "API documentation for market data, analytics, and pricing packages"
category: "api"
keywords: ["api", "market-data", "prices", "analytics", "coingecko", "dexscreener"]
order: 5
---

# Market Data API Reference

Market data packages provide real-time and historical pricing, analytics, and on-chain data.

## Packages

| Package | Description |
|---------|-------------|
| `@uniswap/mcp-coingecko` | CoinGecko price feeds |
| `@uniswap/mcp-dexscreener` | DEXScreener analytics |
| `@nirholas/market-data-analytics` | Advanced analytics |
| `@nirholas/market-data-sentiment` | Social sentiment analysis |
| `@nirholas/market-data-fear-greed` | Fear & Greed index |

---

## CoinGecko Integration

### Installation

```bash
pnpm add @uniswap/mcp-coingecko
```

### Configuration

```typescript
import { CoinGeckoClient } from '@uniswap/mcp-coingecko'

const coingecko = new CoinGeckoClient({
  apiKey: process.env.COINGECKO_API_KEY, // Optional for free tier
  rateLimit: 50, // Requests per minute
})
```

### Price Functions

#### getPrice

Get current price for tokens.

```typescript
async function getPrice(params: PriceParams): Promise<PriceData>

interface PriceParams {
  ids: string[]              // CoinGecko IDs: ['bitcoin', 'ethereum']
  vs_currencies: string[]    // ['usd', 'eur', 'btc']
  include_market_cap?: boolean
  include_24hr_vol?: boolean
  include_24hr_change?: boolean
  include_last_updated_at?: boolean
}

interface PriceData {
  [coinId: string]: {
    [currency: string]: number
    [currency_market_cap: string]: number
    [currency_24h_vol: string]: number
    [currency_24h_change: string]: number
    last_updated_at?: number
  }
}
```

**Example:**

```typescript
const prices = await coingecko.getPrice({
  ids: ['bitcoin', 'ethereum', 'solana'],
  vs_currencies: ['usd'],
  include_24hr_change: true,
})

console.log(`BTC: $${prices.bitcoin.usd}`)
console.log(`ETH: $${prices.ethereum.usd} (${prices.ethereum.usd_24h_change}%)`)
```

#### getPriceByContract

Get price by contract address.

```typescript
async function getPriceByContract(params: ContractPriceParams): Promise<PriceData>

interface ContractPriceParams {
  platform: 'ethereum' | 'binance-smart-chain' | 'polygon-pos' | 'arbitrum-one' | 'base'
  contract_addresses: string[]
  vs_currencies: string[]
}
```

#### getHistoricalPrice

Get historical price at a specific date.

```typescript
async function getHistoricalPrice(
  id: string,
  date: string  // DD-MM-YYYY format
): Promise<HistoricalData>
```

---

### Market Data

#### getCoinMarkets

Get market data for multiple coins.

```typescript
async function getCoinMarkets(params: MarketsParams): Promise<CoinMarket[]>

interface MarketsParams {
  vs_currency: string
  order?: 'market_cap_desc' | 'volume_desc' | 'gecko_desc'
  per_page?: number
  page?: number
  sparkline?: boolean
  price_change_percentage?: '1h' | '24h' | '7d' | '14d' | '30d'
  category?: string
}

interface CoinMarket {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  sparkline_in_7d?: { price: number[] }
}
```

#### getTrending

Get trending coins.

```typescript
async function getTrending(): Promise<TrendingCoins>

interface TrendingCoins {
  coins: Array<{
    item: {
      id: string
      coin_id: number
      name: string
      symbol: string
      market_cap_rank: number
      thumb: string
      score: number
      price_btc: number
    }
  }>
  categories: Array<{
    id: number
    name: string
    market_cap_1h_change: number
  }>
}
```

---

### OHLC & Charts

#### getOHLC

Get OHLC (candlestick) data.

```typescript
async function getOHLC(params: OHLCParams): Promise<OHLC[]>

interface OHLCParams {
  id: string
  vs_currency: string
  days: 1 | 7 | 14 | 30 | 90 | 180 | 365 | 'max'
}

// Returns [timestamp, open, high, low, close]
type OHLC = [number, number, number, number, number]
```

#### getMarketChart

Get price chart data.

```typescript
async function getMarketChart(params: ChartParams): Promise<MarketChart>

interface ChartParams {
  id: string
  vs_currency: string
  days: number | 'max'
  interval?: 'daily' | 'hourly' | '5min'
}

interface MarketChart {
  prices: [number, number][]       // [timestamp, price]
  market_caps: [number, number][]  // [timestamp, market_cap]
  total_volumes: [number, number][]// [timestamp, volume]
}
```

---

## DEXScreener Integration

### Installation

```bash
pnpm add @uniswap/mcp-dexscreener
```

### Configuration

```typescript
import { DexScreenerClient } from '@uniswap/mcp-dexscreener'

const dexscreener = new DexScreenerClient({
  rateLimit: 300, // Requests per minute
})
```

### Token Lookup

#### getTokenByAddress

Get token information by contract address.

```typescript
async function getTokenByAddress(
  chain: string,
  address: string
): Promise<TokenProfile>

interface TokenProfile {
  url: string
  chainId: string
  tokenAddress: string
  icon?: string
  header?: string
  description?: string
  links?: {
    type: string
    label: string
    url: string
  }[]
}
```

#### searchTokens

Search for tokens.

```typescript
async function searchTokens(query: string): Promise<SearchResult>

interface SearchResult {
  pairs: DexPair[]
}
```

---

### Pair Data

#### getPairsByToken

Get trading pairs for a token.

```typescript
async function getPairsByToken(
  chain: string,
  address: string
): Promise<DexPair[]>

interface DexPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  fdv: number
  marketCap: number
  pairCreatedAt: number
  info?: {
    imageUrl?: string
    websites?: { url: string }[]
    socials?: { platform: string; handle: string }[]
  }
  boosts?: {
    active: number
  }
}
```

#### getLatestPairs

Get newly created trading pairs.

```typescript
async function getLatestPairs(chain?: string): Promise<DexPair[]>
```

#### getTopPairs

Get top trading pairs by volume.

```typescript
async function getTopPairs(chain: string): Promise<DexPair[]>
```

---

## Analytics Package

### Installation

```bash
pnpm add @nirholas/market-data-analytics
```

### Technical Indicators

#### calculateRSI

Calculate Relative Strength Index.

```typescript
function calculateRSI(prices: number[], period?: number): number

// Example
const rsi = calculateRSI(closingPrices, 14)
if (rsi > 70) console.log('Overbought')
if (rsi < 30) console.log('Oversold')
```

#### calculateMACD

Calculate MACD indicator.

```typescript
function calculateMACD(params: MACDParams): MACDResult

interface MACDParams {
  prices: number[]
  fastPeriod?: number   // Default: 12
  slowPeriod?: number   // Default: 26
  signalPeriod?: number // Default: 9
}

interface MACDResult {
  macd: number
  signal: number
  histogram: number
}
```

#### calculateBollingerBands

Calculate Bollinger Bands.

```typescript
function calculateBollingerBands(params: BBParams): BollingerBands

interface BBParams {
  prices: number[]
  period?: number        // Default: 20
  stdDevMultiplier?: number // Default: 2
}

interface BollingerBands {
  upper: number
  middle: number
  lower: number
  bandwidth: number
  percentB: number
}
```

#### calculateSMA / calculateEMA

Calculate moving averages.

```typescript
function calculateSMA(prices: number[], period: number): number
function calculateEMA(prices: number[], period: number): number

const sma50 = calculateSMA(prices, 50)
const ema20 = calculateEMA(prices, 20)
```

---

### Portfolio Analytics

#### calculateSharpeRatio

Calculate risk-adjusted returns.

```typescript
function calculateSharpeRatio(params: SharpeParams): number

interface SharpeParams {
  returns: number[]
  riskFreeRate?: number // Default: 0.02 (2%)
  annualize?: boolean
}
```

#### calculateMaxDrawdown

Calculate maximum drawdown.

```typescript
function calculateMaxDrawdown(prices: number[]): DrawdownResult

interface DrawdownResult {
  maxDrawdown: number      // Percentage
  drawdownStart: number    // Index
  drawdownEnd: number      // Index
  recoveryEnd: number      // Index or -1 if not recovered
}
```

#### calculateVolatility

Calculate price volatility.

```typescript
function calculateVolatility(
  returns: number[],
  annualize?: boolean
): number
```

---

## Sentiment Analysis

### Installation

```bash
pnpm add @nirholas/market-data-sentiment
```

### Social Sentiment

```typescript
import { SentimentAnalyzer } from '@nirholas/market-data-sentiment'

const sentiment = new SentimentAnalyzer({
  twitterApiKey: process.env.TWITTER_API_KEY,
  redditClientId: process.env.REDDIT_CLIENT_ID,
  redditSecret: process.env.REDDIT_SECRET,
})

// Analyze sentiment for a token
const analysis = await sentiment.analyze('bitcoin')

interface SentimentResult {
  overall: number        // -1 to 1
  twitter: number
  reddit: number
  trending: boolean
  mentionCount: number
  sentiment24hChange: number
  topKeywords: string[]
}
```

---

## Fear & Greed Index

### Installation

```bash
pnpm add @nirholas/market-data-fear-greed
```

### Usage

```typescript
import { getFearGreedIndex } from '@nirholas/market-data-fear-greed'

const index = await getFearGreedIndex()

interface FearGreedIndex {
  value: number           // 0-100
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed'
  timestamp: number
  components: {
    volatility: number
    marketMomentum: number
    socialMedia: number
    surveys: number
    dominance: number
    trends: number
  }
}

// Historical data
const history = await getFearGreedHistory({ limit: 30 })
```

---

## Error Types

```typescript
class MarketDataError extends Error {
  code: string
}

class RateLimitError extends MarketDataError {
  retryAfter: number
}

class APIError extends MarketDataError {
  status: number
}

class TokenNotFoundError extends MarketDataError {
  address: string
  chain: string
}

class PairNotFoundError extends MarketDataError {}

class DataUnavailableError extends MarketDataError {}
```
