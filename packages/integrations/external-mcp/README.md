# External MCP Server Integration

This directory contains **27 integrated crypto MCP servers** from the community, rebranded and restructured for Universal Crypto MCP.

## ✅ Implemented Servers (Ranks 20-40)

### Solana & DeFi (Ranks 21-27)
| Rank | Server | Description | Status |
|------|--------|-------------|--------|
| 21 | `solana-agent-kit` | Solana AI agent toolkit | ✅ |
| 22 | `crypto-price-oracle` | Multi-source price aggregation | ✅ |
| 23 | `defillama-mcp` | DeFi TVL and protocol data | ✅ |
| 24 | `coingecko-enhanced-mcp` | Enhanced CoinGecko integration | ✅ |
| 25 | `dune-analytics-mcp` | SQL analytics and dashboards | ✅ |
| 26 | `nansen-mcp` | Wallet tracking and analysis | ✅ |
| 27 | `arkham-intelligence-mcp` | Entity tracking | ✅ |

### Block Explorers (Ranks 28-34)
| Rank | Server | Description | Status |
|------|--------|-------------|--------|
| 28 | `etherscan-advanced-mcp` | Ethereum explorer | ✅ |
| 29 | `polygonscan-mcp` | Polygon explorer | ✅ |
| 30 | `bscscan-mcp` | BSC explorer | ✅ |
| 31 | `arbitrum-scan-mcp` | Arbitrum L2 explorer | ✅ |
| 32 | `optimism-scan-mcp` | Optimism L2 explorer | ✅ |
| 33 | `base-scan-mcp` | Base L2 explorer | ✅ |
| 34 | `avalanche-explorer-mcp` | Avalanche explorer | ✅ |

### L1 Chains (Ranks 35-40)
| Rank | Server | Description | Status |
|------|--------|-------------|--------|
| 35 | `cosmos-hub-mcp` | Cosmos Hub and IBC | ✅ |
| 36 | `near-protocol-mcp` | NEAR Protocol | ✅ |
| 37 | `aptos-mcp` | Aptos blockchain | ✅ |
| 38 | `sui-network-mcp` | Sui Network | ✅ |
| 39 | `polkadot-mcp` | Polkadot parachains | ✅ |
| 40 | `cardano-mcp` | Cardano blockchain | ✅ |

## Integration Process

The servers in this directory have been:

1. **Created** with full MCP server implementations
2. **Branded** with Universal Crypto MCP branding and author information
3. **Structured** to fit the monorepo architecture
4. **Documented** with README and usage examples

## Author & Branding

All integrated servers are maintained by:
- **Author**: nich (nirholas)
- **Twitter/X**: [@nichxbt](https://x.com/nichxbt)
- **GitHub**: [nirholas](https://github.com/nirholas)
- **Repository**: [universal-crypto-mcp](https://github.com/nirholas/universal-crypto-mcp)

## Integration Script

To integrate more MCP servers:

```bash
# Run the integration script
pnpm run integrate:mcp-servers
```

The script will:
- Clone repositories from `scripts/top-crypto-mcp-servers.json`
- Rebrand package.json, README, and other files
- Add ATTRIBUTION.md with proper credit
- Restructure for monorepo compatibility
- Skip already-integrated servers

## License Compliance

All integrated servers maintain their original licenses (MIT or compatible).
Each server includes:
- Original LICENSE file
- ATTRIBUTION.md with original source
- Proper credit in README

## Directory Structure

```
external-mcp/
├── index.ts                   # Unified exports
├── shared/                    # Shared utilities
│   └── base-explorer.ts       # Base EVM explorer class
├── solana-agent-kit/          # Rank 21
├── crypto-price-oracle/       # Rank 22
├── defillama-mcp/            # Rank 23
├── coingecko-enhanced-mcp/   # Rank 24
├── dune-analytics-mcp/       # Rank 25
├── nansen-mcp/               # Rank 26
├── arkham-intelligence-mcp/  # Rank 27
├── etherscan-advanced-mcp/   # Rank 28
├── polygonscan-mcp/          # Rank 29
├── bscscan-mcp/              # Rank 30
├── arbitrum-scan-mcp/        # Rank 31
├── optimism-scan-mcp/        # Rank 32
├── base-scan-mcp/            # Rank 33
├── avalanche-explorer-mcp/   # Rank 34
├── cosmos-hub-mcp/           # Rank 35
├── near-protocol-mcp/        # Rank 36
├── aptos-mcp/                # Rank 37
├── sui-network-mcp/          # Rank 38
├── polkadot-mcp/             # Rank 39
└── cardano-mcp/              # Rank 40
```

## Usage

### Register All Servers

```typescript
import { registerAllExternalServers } from '@nirholas/universal-crypto-mcp/integrations/external-mcp';

const server = new McpServer({ name: "my-server" });
registerAllExternalServers(server);
```

### Register Individual Servers

```typescript
import { registerSolanaAgentKit, registerDeFiLlama } from '@nirholas/universal-crypto-mcp/integrations/external-mcp';

registerSolanaAgentKit(server);
registerDeFiLlama(server);
```

### Server Categories

```typescript
import { ServerCategories } from '@nirholas/universal-crypto-mcp/integrations/external-mcp';

// Available categories:
// - DEFI: DeFi and price data servers
// - INTELLIGENCE: Wallet tracking and analytics
// - EVM_EXPLORERS: Ethereum and EVM L2 explorers
// - L1_CHAINS: Non-EVM L1 blockchain servers
```

## Testing Integrated Servers

After integration:

```bash
# Install dependencies
pnpm install

# Build a specific server
cd packages/integrations/external-mcp/[server-name]
pnpm build

# Test server
pnpm test
```

## Contributing

To suggest a new MCP server for integration:

1. Ensure it has MIT or compatible license
2. Add to `scripts/top-crypto-mcp-servers.json`
3. Run `pnpm run integrate:mcp-servers`
4. Test and submit PR

## Attribution Policy

We respect open source licenses and authors. Each integrated server:
- Maintains original license
- Credits original author
- Links to original repository
- Follows license requirements

## Supported Integrations (Ranks 20-40)

| Rank | Server | Description | Features |
|------|--------|-------------|----------|
| 21 | solana-agent-kit | Solana AI toolkit | Trading, NFT, Tokens |
| 22 | crypto-price-oracle | Price aggregation | Multi-source prices |
| 23 | defillama-mcp | DeFi TVL data | Protocol analytics |
| 24 | coingecko-enhanced-mcp | Enhanced market data | Prices, charts |
| 25 | dune-analytics-mcp | SQL analytics | Dashboards, queries |
| 26 | nansen-mcp | Wallet tracking | Smart money tracking |
| 27 | arkham-intelligence-mcp | Entity tracking | Intelligence |
| 28 | etherscan-advanced-mcp | Ethereum explorer | Transactions |
| 29 | polygonscan-mcp | Polygon explorer | L2 transactions |
| 30 | bscscan-mcp | BSC explorer | BNB Chain |
| 31 | arbitrum-scan-mcp | Arbitrum explorer | L2 scaling |
| 32 | optimism-scan-mcp | Optimism explorer | L2 scaling |
| 33 | base-scan-mcp | Base explorer | Coinbase L2 |
| 34 | avalanche-explorer-mcp | Avalanche | Subnets |
| 35 | cosmos-hub-mcp | Cosmos | IBC protocol |
| 36 | near-protocol-mcp | NEAR | Sharding |
| 37 | aptos-mcp | Aptos | Move language |
| 38 | sui-network-mcp | Sui | Object model |
| 39 | polkadot-mcp | Polkadot | Parachains |
| 40 | cardano-mcp | Cardano | Plutus smart contracts |

## Notes

- Some repositories may not exist - script will skip them gracefully
- Integration preserves original functionality
- All servers work standalone or as part of Universal Crypto MCP
- Updates to original repos must be manually integrated

---

**Maintained by**: [nich (@nichxbt)](https://x.com/nichxbt)  
**Part of**: [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)
