# DeFi Rates MCP Server

> Real-time lending and borrowing rates across 13+ DeFi protocols.

## Attribution

**Original Author:** [qingfeng](https://github.com/qingfeng)  
**Original Repository:** [defi-rates-mcp](https://github.com/qingfeng/defi-rates-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Supported Protocols

### Ethereum & L2s
| Protocol | Chains | Features |
|----------|--------|----------|
| **Aave V3** | Ethereum, Arbitrum, Optimism, Polygon, Base | Supply/Borrow APY, LTV |
| **Compound V3** | Ethereum, Base, Arbitrum | Supply/Borrow rates |
| **Morpho** | Ethereum | Optimized rates |
| **Spark** | Ethereum | DAI-focused lending |

### BNB Chain
| Protocol | Features |
|----------|----------|
| **Venus** | Multi-asset lending |
| **Radiant** | Cross-chain lending |

### Solana
| Protocol | Features |
|----------|----------|
| **Solend** | SOL ecosystem lending |
| **Drift** | Perpetuals + lending |
| **Jupiter** | Aggregated rates |
| **Marginfi** | Risk-managed lending |
| **Kamino** | Concentrated liquidity |

## Features

### From Original Implementation
- ✅ Real-time rate fetching
- ✅ Multi-protocol support
- ✅ Supply and borrow APY
- ✅ Utilization rates
- ✅ Looping strategy calculations

### Our Enhancements (Apache-2.0)
- ✅ Unified API across all protocols
- ✅ Best rate finder
- ✅ Rate comparison tables
- ✅ Historical rate tracking
- ✅ Alert system for rate changes
- ✅ Yield optimization suggestions

## Installation

```bash
pnpm add @nirholas/defi-rates-mcp
```

## Usage

### With MCP Server

```typescript
import { registerDeFiRatesTools } from '@nirholas/defi-rates-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-defi-server', version: '1.0.0' });
registerDeFiRatesTools(server);
```

### Standalone

```typescript
import { DeFiRatesClient } from '@nirholas/defi-rates-mcp';

const client = new DeFiRatesClient();

// Get Aave rates for ETH
const aaveRates = await client.getProtocolRates('aave', 'ETH');

// Find best lending rate for USDC across all protocols
const bestRate = await client.findBestRate('USDC', 'supply');

// Compare all protocols for a token
const comparison = await client.compareRates('USDC');
```

## Available Tools

| Tool | Description |
|------|-------------|
| `defi_rates` | Get rates for a specific protocol and asset |
| `defi_best_rate` | Find the best rate across all protocols |
| `defi_compare_rates` | Compare rates across all supported protocols |
| `defi_looping_strategy` | Calculate looping strategy returns |
| `defi_protocols` | List all supported protocols |
| `defi_protocol_assets` | List assets supported by a protocol |

## Example Queries

```
What's the best USDC lending rate right now?
```

```
Compare ETH borrowing rates across Aave, Compound, and Morpho
```

```
Calculate looping strategy for ETH on Aave with 3x leverage
```

## License

- Original Implementation: MIT (qingfeng)
- Enhancements: Apache-2.0 (Nich)
