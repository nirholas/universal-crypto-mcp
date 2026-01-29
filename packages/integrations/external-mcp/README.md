# External MCP Server Integration

This directory contains integrated crypto MCP servers from the community, rebranded and restructured for Universal Crypto MCP.

## Integration Process

The servers in this directory have been:

1. **Cloned** from original repositories (ranked 20-40 in crypto MCP ecosystem)
2. **Rebranded** with Universal Crypto MCP branding and author information
3. **Restructured** to fit the monorepo architecture
4. **Attributed** with proper licensing and credit to original authors

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
├── solana-agent-kit/          # Rank 21
├── crypto-price-oracle/       # Rank 22
├── defillama-mcp/            # Rank 23
├── coingecko-enhanced-mcp/   # Rank 24
└── ...                       # Ranks 25-40
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
