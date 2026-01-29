# Developer Quick Reference

## Service Modules API Reference

### Market Data Service

```typescript
import { 
  getPrice, 
  getPrices, 
  getMarketOverview,
  getTrending,
  getCoinDetails,
  getFearGreedIndex,
  getOHLCV 
} from './services/market-data.js';

// Get single price
const btc = await getPrice('bitcoin');
console.log(btc.price, btc.change24h, btc.marketCap);

// Get multiple prices
const prices = await getPrices(['BTC', 'ETH', 'SOL']);

// Market overview
const market = await getMarketOverview();
console.log(market.totalMarketCap, market.btcDominance);

// Trending coins
const trending = await getTrending(); // Top 10

// Coin details
const eth = await getCoinDetails('ethereum');
console.log(eth.description, eth.links, eth.sentiment);

// Fear & Greed Index
const fg = await getFearGreedIndex();
console.log(fg.value, fg.classification); // 0-100

// OHLCV data
const ohlcv = await getOHLCV('bitcoin', 30); // 30 days
console.log(ohlcv.data); // Array of {timestamp, open, high, low, close}
```

### DeFi Service

```typescript
import {
  getTopProtocols,
  getProtocol,
  getBestYields,
  getChainTVLs,
  getStablecoins,
  getDexVolume,
  getBridgeVolume
} from './services/defi.js';

// Top protocols by TVL
const protocols = await getTopProtocols(20);

// Protocol details
const aave = await getProtocol('aave');
console.log(aave.tvl, aave.chainTvls);

// Best yields
const yields = await getBestYields({
  chain: 'ethereum',
  stablecoinOnly: true,
  minTvl: 1_000_000,
  limit: 10
});

// Chain TVLs
const chains = await getChainTVLs();

// Stablecoins
const stables = await getStablecoins();

// DEX volume
const dex = await getDexVolume('ethereum');
console.log(dex.total24h, dex.topDexes);

// Bridge volume
const bridges = await getBridgeVolume();
```

### Wallet Service

```typescript
import {
  getNativeBalance,
  getTokenBalance,
  getGasPrice,
  getBlockNumber,
  getTransaction,
  getSupportedChains,
  isValidAddress
} from './services/wallet.js';

// Check if address is valid
if (isValidAddress('0x...')) {
  // Get native balance
  const balance = await getNativeBalance('0x...', 'ethereum');
  console.log(balance.balanceFormatted, balance.balanceUsd);
  
  // Get token balance
  const usdc = await getTokenBalance('0x...', 'arbitrum', 'USDC');
  console.log(usdc.balanceFormatted);
}

// Gas price
const gas = await getGasPrice('ethereum');
console.log(gas.gasPriceGwei, gas.baseFee, gas.priorityFee);

// Current block
const block = await getBlockNumber('base');

// Transaction details
const tx = await getTransaction('ethereum', '0x...');
console.log(tx.status, tx.from, tx.to, tx.valueFormatted);

// Supported chains
const chains = getSupportedChains();
```

### Technical Analysis Service

```typescript
import {
  generateTradingSignal,
  calculateSupportResistance,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateMovingAverages
} from './services/technical-analysis.js';

// Complete trading signal
const signal = await generateTradingSignal('bitcoin');
console.log(signal.signal); // "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell"
console.log(signal.score); // -100 to 100
console.log(signal.confidence); // 0 to 1
console.log(signal.indicators.rsi.current); // 0-100
console.log(signal.indicators.macd.histogram); // MACD histogram
console.log(signal.indicators.bollinger.percentB); // %B
console.log(signal.indicators.movingAverages.sma200);

// Support & resistance
const ohlcv = await getOHLCV('ethereum', 30);
const sr = calculateSupportResistance(ohlcv.data);
console.log(sr.supports, sr.resistances);
console.log(sr.pivotPoint, sr.r1, sr.s1);

// Individual indicators (from price arrays)
const prices = [100, 102, 98, 105, ...];
const rsi = calculateRSI(prices, 14);
const macd = calculateMACD(prices);
const bb = calculateBollingerBands(prices);
const ma = calculateMovingAverages(prices);
```

### x402 Payment Service

```typescript
import {
  getX402Balance,
  estimatePaymentGas,
  verifyPayment,
  getSupportedNetworks,
  getPaymentEnabledEndpoints
} from './services/x402.js';

// Check USDC balance
const balance = await getX402Balance('0x...', 'base-mainnet');
console.log(balance.balanceFormatted, balance.hasMinimumBalance);

// Estimate gas cost
const estimate = await estimatePaymentGas(
  'base-mainnet',
  '0xFrom',
  '0xTo',
  0.001 // $0.001 in USDC
);
console.log(estimate.gasLimit, estimate.estimatedCostUsd);

// Verify payment
const verification = await verifyPayment(
  '0xTxHash',
  'base-mainnet',
  '0xExpectedRecipient',
  '1000' // 0.001 USDC in smallest units
);
console.log(verification.valid, verification.receipt);

// Get networks
const networks = getSupportedNetworks();

// Get paid endpoints
const endpoints = getPaymentEnabledEndpoints();
```

## MCP Tool Naming Convention

All tools follow this pattern:
- `get_<resource>` - Fetch data
- `<service>_get_<resource>` - Service-specific fetch (e.g., `x402_get_balance`)
- `get_<resource>_<detail>` - Specific detail fetch

## Error Handling Pattern

All services follow this pattern:

```typescript
try {
  const result = await someServiceFunction();
  return result;
} catch (error) {
  throw new Error(error instanceof Error ? error.message : 'Unknown error');
}
```

The MCP server wraps all tool calls and returns errors as JSON:

```json
{
  "error": "Failed to fetch price data: 404"
}
```

## Caching Strategy

- **Market Data**: 30 seconds TTL
- **DeFi Data**: 60 seconds TTL
- **Wallet Data**: 15 seconds TTL
- **Technical Analysis**: No caching (uses cached market data)
- **x402**: No caching (real-time verification)

## Rate Limiting Best Practices

When making multiple calls:

```typescript
// DON'T: Rapid sequential calls
const btc = await getPrice('bitcoin');
const eth = await getPrice('ethereum');
const sol = await getPrice('solana');

// DO: Use batch endpoints
const prices = await getPrices(['bitcoin', 'ethereum', 'solana']);

// DO: Add delays for multiple individual calls
await getPrice('bitcoin');
await new Promise(r => setTimeout(r, 500));
await getPrice('ethereum');
```

## Environment Variables (Optional)

```bash
# For higher CoinGecko rate limits
COINGECKO_API_KEY=your_key

# For x402 payments
X402_NETWORK=base-mainnet
X402_PAY_TO=0x...
```

## Testing Individual Services

```typescript
// test-service.ts
import { getPrice } from './src/services/market-data.js';

const btc = await getPrice('bitcoin');
console.log(btc);

// Run: tsx test-service.ts
```

## Common Patterns

### Fetching and Caching

```typescript
const cacheKey = `resource:${id}`;
const cached = getCached<T>(cacheKey);
if (cached) return cached;

const fresh = await fetchFromAPI();
setCache(cacheKey, fresh);
return fresh;
```

### Number Formatting

```typescript
// Large numbers
const formatLarge = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

// Percentages
const formatPercent = (val: number): string => {
  const prefix = val >= 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}%`;
};

// Token amounts
const formatToken = (raw: bigint, decimals: number): string => {
  return (Number(raw) / Math.pow(10, decimals)).toFixed(decimals > 6 ? 6 : decimals);
};
```

### RPC Calls

```typescript
async function rpcCall(rpc: string, method: string, params: any[]): Promise<any> {
  const response = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    })
  });
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}
```

## Extending the Server

### Adding a New Tool

1. Create service function in appropriate module
2. Add tool definition to `server.ts`:

```typescript
const newTools: Tool[] = [
  {
    name: "my_new_tool",
    description: "What it does",
    inputSchema: {
      type: "object",
      properties: {
        param: { type: "string", description: "Parameter description" }
      },
      required: ["param"]
    }
  }
];
```

3. Add handler in `handleToolCall`:

```typescript
case "my_new_tool":
  result = await myServiceFunction(args.param as string);
  break;
```

4. Add test in `test.ts`:

```typescript
await test("myNewTool", async () => {
  const result = await myServiceFunction("test");
  assert(result !== null, "Should return data");
});
```

## Performance Tips

1. **Use batch endpoints** when available
2. **Cache aggressively** for expensive operations
3. **Parallelize independent** requests
4. **Add delays** between sequential API calls
5. **Use public RPCs** with fallbacks

## Security Notes

- ⚠️ Never include private keys in the code
- ⚠️ Always validate user inputs
- ⚠️ Use public RPCs for read-only operations
- ⚠️ Implement rate limiting for production
- ⚠️ Add authentication for paid endpoints

## License

Apache-2.0
