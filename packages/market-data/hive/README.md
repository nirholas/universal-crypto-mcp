# Hive Intel MCP Server

> Unified crypto, DeFi, and Web3 analytics with wallet tracking.

## Attribution

**Original Author:** [AnonJon](https://github.com/AnonJon)  
**Original Repository:** [hive-crypto-mcp](https://github.com/AnonJon/hive-crypto-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Features

### From Original Implementation
- ✅ Market data aggregation
- ✅ Wallet tracking and monitoring
- ✅ DeFi protocol analytics
- ✅ Token holder analysis
- ✅ On-chain metrics
- ✅ Smart money tracking

### Our Enhancements (Apache-2.0)
- ✅ Cross-chain portfolio tracking
- ✅ Whale alert notifications
- ✅ Protocol TVL comparison
- ✅ Yield optimization suggestions
- ✅ Risk scoring

## Data Coverage

| Category | Coverage |
|----------|----------|
| Tokens | 10,000+ across all major chains |
| Protocols | 500+ DeFi protocols |
| Chains | 15+ EVM + non-EVM chains |
| Wallets | Unlimited tracking |
| Historical Data | 5+ years |

## Installation

```bash
pnpm add @nirholas/hive-mcp
```

## Configuration

```bash
export HIVE_API_KEY=your_api_key
```

## Usage

### With MCP Server

```typescript
import { registerHiveTools } from '@nirholas/hive-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-analytics-server', version: '1.0.0' });
registerHiveTools(server);
```

### Standalone

```typescript
import { HiveClient } from '@nirholas/hive-mcp';

const client = new HiveClient({
  apiKey: process.env.HIVE_API_KEY,
});

// Get market overview
const market = await client.getMarketOverview();

// Track a wallet
const wallet = await client.trackWallet('0x...');

// Get DeFi analytics
const defi = await client.getDeFiAnalytics('ethereum');

// Find whale movements
const whales = await client.getWhaleActivity('ETH');
```

## Available Tools

| Tool | Description |
|------|-------------|
| `hive_market_overview` | Get market overview and stats |
| `hive_token_analytics` | Deep analytics for a token |
| `hive_wallet_track` | Track and analyze a wallet |
| `hive_wallet_portfolio` | Get portfolio breakdown |
| `hive_defi_analytics` | DeFi protocol analytics |
| `hive_protocol_tvl` | Get protocol TVL data |
| `hive_whale_activity` | Track whale movements |
| `hive_smart_money` | Follow smart money flows |
| `hive_token_holders` | Analyze token holder distribution |
| `hive_trending` | Get trending tokens/protocols |

## Example Queries

```
Show me the market overview
```

```
Track this wallet: 0x...
```

```
What are whales doing with ETH?
```

```
Show TVL ranking for DeFi protocols
```

```
What are smart money wallets buying?
```

## Supported Chains

- Ethereum
- Polygon
- Arbitrum
- Optimism
- Base
- Avalanche
- BSC
- Solana
- Near
- Cosmos

## License

- Original Implementation: MIT (AnonJon)
- Enhancements: Apache-2.0 (Nich)
