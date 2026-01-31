# MCP Servers Documentation

Detailed documentation for each MCP server integrated into the gateway.

## Overview

The gateway manages 20 MCP servers across 5 categories:
- **DeFi Protocols** (7 servers)
- **Market Data** (3 servers)  
- **Layer 2** (4 servers)
- **NFT & Gaming** (3 servers)
- **Wallets & Identity** (3 servers)

## DeFi Protocol Servers

### Aave MCP

**ID:** `aave`  
**Category:** DeFi  
**Package:** `@universal-crypto-mcp/aave-mcp`

**Tools:**
- `getMarkets` - Get all lending markets
- `getUserPosition` - Get user's lending/borrowing position
- `getReserveData` - Get reserve information for an asset
- `calculateHealthFactor` - Calculate liquidation health factor

**Example:**
```typescript
// Get Aave markets on Polygon
const markets = await gateway.callTool('aave', 'getMarkets', {
  network: 'polygon'
});

// Get user position
const position = await gateway.callTool('aave', 'getUserPosition', {
  address: '0x123...',
  network: 'mainnet'
});
```

**API Endpoints:**
- `GET /api/v1/defi/aave/markets`
- `GET /api/v1/defi/aave/position/:address`

**Configuration:**
- Requires: Alchemy or Infura API key
- Networks: mainnet, polygon, arbitrum, optimism, base

---

### Uniswap V3 MCP

**ID:** `uniswap-v3`  
**Category:** DeFi  
**Package:** `@universal-crypto-mcp/uniswap-v3-mcp`

**Tools:**
- `getQuote` - Get swap quote
- `getPools` - Get liquidity pools
- `getPoolInfo` - Get pool details
- `getPositions` - Get LP positions

**Example:**
```typescript
// Get swap quote
const quote = await gateway.callTool('uniswap-v3', 'getQuote', {
  tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  amountIn: '1000000000', // 1000 USDC
  network: 'mainnet'
});
```

**API Endpoints:**
- `POST /api/v1/defi/uniswap/quote`
- `GET /api/v1/defi/uniswap/pools`

---

### Curve Finance MCP

**ID:** `curve`  
**Category:** DeFi

**Tools:**
- `getPools` - List all Curve pools
- `getPoolAPY` - Get pool APY
- `getExchangeRate` - Get exchange rate between assets

---

### Compound V3 MCP

**ID:** `compound-v3`  
**Category:** DeFi

**Tools:**
- `getMarkets` - Get Compound markets
- `getSupplyRate` - Get supply APY
- `getBorrowRate` - Get borrow APY
- `getUserPosition` - Get user position

---

### Lido MCP

**ID:** `lido`  
**Category:** DeFi

**Tools:**
- `getStakingAPR` - Get staking APR
- `getTotalStaked` - Get total stETH
- `getUserStake` - Get user's staked amount

---

### GMX V2 MCP

**ID:** `gmx-v2`  
**Category:** DeFi

**Tools:**
- `getMarkets` - Get perpetual markets
- `getPositions` - Get user positions
- `getFundingRate` - Get funding rates

---

### Yearn Finance MCP

**ID:** `yearn`  
**Category:** DeFi

**Tools:**
- `getVaults` - List all vaults
- `getVaultAPY` - Get vault APY
- `getUserVaultBalance` - Get user balance in vault

## Market Data Servers

### CoinGecko Pro MCP

**ID:** `coingecko-pro`  
**Category:** Market Data  
**Package:** `@universal-crypto-mcp/coingecko-pro-mcp`

**Tools:**
- `getPrice` - Get current price
- `getMarketData` - Get full market data
- `getHistoricalPrices` - Get historical prices
- `getTrendingCoins` - Get trending coins
- `searchCoins` - Search for coins

**Example:**
```typescript
// Get Bitcoin price
const btc = await gateway.callTool('coingecko-pro', 'getPrice', {
  coinId: 'bitcoin',
  vsCurrency: 'usd'
});

// Get market data
const market = await gateway.callTool('coingecko-pro', 'getMarketData', {
  coinId: 'ethereum',
  localization: false,
  tickers: false,
  communityData: false
});
```

**API Endpoints:**
- `GET /api/v1/prices/:symbol`
- `GET /api/v1/market/:symbol/full`

**Configuration:**
- Requires: CoinGecko Pro API key
- Rate limits: 500 calls/minute (Pro tier)

---

### DefiLlama MCP

**ID:** `defillama`  
**Category:** Market Data

**Tools:**
- `getProtocolTVL` - Get protocol TVL
- `getChainTVL` - Get chain TVL
- `getYields` - Get yield opportunities
- `getStablecoinCharts` - Get stablecoin data

**Example:**
```typescript
const aaveTVL = await gateway.callTool('defillama', 'getProtocolTVL', {
  protocol: 'aave'
});
```

---

### Dune Analytics MCP

**ID:** `dune-analytics`  
**Category:** Market Data

**Tools:**
- `executeQuery` - Run Dune query
- `getQueryResults` - Get query results
- `getLatestResult` - Get latest execution

**Example:**
```typescript
const results = await gateway.callTool('dune-analytics', 'executeQuery', {
  queryId: 1234567,
  parameters: { network: 'ethereum' }
});
```

**Configuration:**
- Requires: Dune API key

## Layer 2 Servers

### Arbitrum MCP

**ID:** `arbitrum`  
**Category:** Layer 2

**Tools:**
- `getGasPrice` - Get L2 gas price
- `getBridgeStatus` - Check bridge status
- `getTransactionStatus` - Check tx status

---

### Optimism MCP

**ID:** `optimism`  
**Category:** Layer 2

**Tools:**
- `getGasPrice` - Get L2 gas price
- `getBridgeDeposits` - Get bridge deposits
- `getTransactionStatus` - Check tx status

---

### Base Chain MCP

**ID:** `base-chain`  
**Category:** Layer 2

**Tools:**
- `getGasPrice` - Get L2 gas price
- `getBlockNumber` - Get latest block
- `getTransactionReceipt` - Get tx receipt

---

### Polygon zkEVM MCP

**ID:** `polygon-zkevm`  
**Category:** Layer 2

**Tools:**
- `getGasPrice` - Get L2 gas price
- `getBatchInfo` - Get batch information
- `getProofStatus` - Check proof status

## NFT & Gaming Servers

### OpenSea MCP

**ID:** `opensea`  
**Category:** NFT

**Tools:**
- `getCollectionStats` - Get collection stats
- `getNFTsByOwner` - Get NFTs owned by address
- `getAssetDetails` - Get NFT details
- `getFloorPrice` - Get collection floor price

**Example:**
```typescript
const nfts = await gateway.callTool('opensea', 'getNFTsByOwner', {
  owner: '0x123...',
  limit: 20
});
```

**Configuration:**
- Requires: OpenSea API key

---

### Blur MCP

**ID:** `blur`  
**Category:** NFT

**Tools:**
- `getCollectionStats` - Get collection data
- `getListings` - Get active listings
- `getBids` - Get active bids

---

### Axie Infinity MCP

**ID:** `axie-infinity`  
**Category:** NFT

**Tools:**
- `getAxies` - Get Axie data
- `getMarketplace` - Get marketplace listings
- `getPlayerProfile` - Get player stats

## Wallet & Identity Servers

### ENS Domains MCP

**ID:** `ens-domains`  
**Category:** Wallets

**Tools:**
- `resolveName` - Resolve ENS to address
- `reverseResolve` - Address to ENS
- `getNameRecords` - Get all ENS records
- `checkAvailability` - Check if name available

**Example:**
```typescript
const address = await gateway.callTool('ens-domains', 'resolveName', {
  name: 'vitalik.eth'
});

const ens = await gateway.callTool('ens-domains', 'reverseResolve', {
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
});
```

---

### WalletConnect MCP

**ID:** `walletconnect`  
**Category:** Wallets

**Tools:**
- `createSession` - Create WC session
- `getSessionData` - Get active session
- `sendRequest` - Send RPC request

---

### Safe (Gnosis) MCP

**ID:** `safe-gnosis`  
**Category:** Wallets

**Tools:**
- `getSafeInfo` - Get Safe details
- `getPendingTransactions` - Get pending txs
- `proposeTransaction` - Propose new tx
- `getOwners` - Get Safe owners

**Example:**
```typescript
const safe = await gateway.callTool('safe-gnosis', 'getSafeInfo', {
  address: '0x123...',
  network: 'mainnet'
});
```

## Server Management

### Starting Servers

All servers start automatically when the gateway starts:

```typescript
const gateway = new UniversalCryptoGateway();
await gateway.start();
// All 20 MCP servers are now running
```

### Manual Control

```typescript
// Start specific server
await mcpManager.startServer('aave');

// Stop specific server
await mcpManager.stopServer('aave');

// Get server status
const info = mcpManager.getServerInfo('aave');
console.log(info.status); // 'running' | 'stopped' | 'error'
```

### Health Monitoring

```typescript
// Get all server info
const servers = mcpManager.getAllServerInfo();

servers.forEach(server => {
  console.log(`${server.name}: ${server.status}`);
  console.log(`Tools: ${server.tools.length}`);
  console.log(`PID: ${server.pid}`);
});
```

## Communication Protocol

### JSON-RPC Format

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "getPrice",
    "arguments": {
      "symbol": "BTC"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"price\": 42000}"
      }
    ]
  }
}
```

**Error:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Internal error"
  }
}
```

## Error Handling

### Common Errors

**Server Not Running:**
```json
{
  "error": "Server aave is not running",
  "code": "MCP_SERVER_DOWN"
}
```

**Tool Not Found:**
```json
{
  "error": "Tool getInvalidData not found",
  "code": "TOOL_NOT_FOUND"
}
```

**Invalid Parameters:**
```json
{
  "error": "Missing required parameter: symbol",
  "code": "INVALID_PARAMS"
}
```

### Auto-Restart

Servers automatically restart on failure:

```typescript
{
  id: 'aave',
  autoRestart: true  // Restart on crash
}
```

## Performance

### Concurrent Requests

Each MCP server can handle multiple concurrent requests:

```typescript
// These run in parallel
const [prices, markets, positions] = await Promise.all([
  gateway.callTool('coingecko-pro', 'getPrice', { symbol: 'BTC' }),
  gateway.callTool('aave', 'getMarkets', { network: 'mainnet' }),
  gateway.callTool('uniswap-v3', 'getPools', {})
]);
```

### Timeouts

Default timeout: 30 seconds

```typescript
// Configure in mcp-manager.ts
const TIMEOUT = 30000; // 30 seconds
```

### Resource Usage

Typical per-server:
- Memory: 50-100 MB
- CPU: < 5%
- Startup: 1-3 seconds

Total for 20 servers:
- Memory: ~1.5 GB
- CPU: < 20% (idle)

## Troubleshooting

### Server Won't Start

1. Check if built: `ls packages/xxx/dist/index.js`
2. Check logs: Review stderr output
3. Test manually: `node packages/xxx/dist/index.js`

### Slow Responses

1. Check API rate limits
2. Review network latency
3. Increase timeout if needed

### Memory Leaks

1. Monitor with: `process.memoryUsage()`
2. Restart server: `mcpManager.stopServer()` then `startServer()`
3. Check for unclosed connections

## Adding Custom Tools

See [DEVELOPMENT.md](./DEVELOPMENT.md#adding-a-new-mcp-server) for complete guide.

Quick example:

```typescript
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'myCustomTool':
      const result = await doSomething(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }]
      };
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```
