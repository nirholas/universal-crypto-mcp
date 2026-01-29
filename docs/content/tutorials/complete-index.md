# Complete Tutorials Index

This directory contains step-by-step tutorials for building with Universal Crypto MCP.

## Available Tutorials

### 🚀 Getting Started

1. **[AI Crypto Trading Agent](ai-crypto-trading-agent.md)** - Build a full-featured trading agent
2. **[Cross-Chain Portfolio Tracker](cross-chain-portfolio.md)** - Track assets across 15+ chains
3. **[DeFi Analytics Dashboard](defi-analytics.md)** - Analyze lending, yields, and liquidity
4. **[Token Security Scanner](security-scanner.md)** - Scan smart contracts for risks

## Tutorial Difficulty Levels

- 🟢 **Beginner**: No prior blockchain experience needed
- 🟡 **Intermediate**: Basic understanding of crypto concepts
- 🔴 **Advanced**: Experience with smart contracts and DeFi

## What You'll Learn

### AI Crypto Trading Agent 🟡
**Time**: 30 minutes

- Connect to multiple exchanges (Binance, Binance US)
- Execute trades programmatically
- Implement risk management
- Create AI-powered trading strategies
- Real-time market data analysis

**Skills**: Trading APIs, Risk management, AI integration

### Cross-Chain Portfolio Tracker 🟢  
**Time**: 20 minutes

- Query balances across chains
- Track token holdings
- Calculate portfolio value
- Display NFTs
- Multi-wallet aggregation

**Skills**: Multi-chain queries, Data aggregation, Portfolio management

### DeFi Analytics Dashboard 🟡
**Time**: 45 minutes

- Connect to DeFi protocols (Aave, Compound, Uniswap)
- Query lending positions
- Calculate yields and APYs
- Track liquidity positions
- Generate analytics reports

**Skills**: DeFi protocols, Yield farming, Liquidity pools

### Token Security Scanner 🔴
**Time**: 60 minutes

- Analyze smart contract code
- Detect honeypots and rug pulls
- Check token liquidity
- Verify contract ownership
- Generate risk scores

**Skills**: Smart contract analysis, Security auditing, Risk assessment

## Prerequisites

Before starting any tutorial, ensure you have:

- Node.js 18+ installed
- Basic TypeScript/JavaScript knowledge  
- A code editor (VS Code recommended)
- MCP-compatible client (Claude Desktop, Cursor, etc.)

## Quick Setup

```bash
# Clone the repository
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp

# Install dependencies
pnpm install

# Build packages
pnpm build

# Start a tutorial
cd tutorials
```

## Environment Variables

Most tutorials require API keys:

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your API keys
nano .env
```

Required keys:
- `COINGECKO_API_KEY` - For market data (free tier available)
- `BINANCE_API_KEY` - For trading (optional)
- `BINANCE_API_SECRET` - For trading (optional)
- `PRIVATE_KEY` - Your EVM wallet key (for transactions)
- `SOLANA_PRIVATE_KEY` - Your Solana wallet key (optional)

## Running Examples

Each tutorial includes working code examples:

```bash
# Navigate to tutorial directory
cd tutorials/ai-trading-agent

# Run the example
pnpm start

# Or run with TypeScript directly
npx tsx src/index.ts
```

## Tutorial Structure

Each tutorial follows this structure:

```
tutorial-name/
├── README.md          # Tutorial instructions
├── package.json       # Dependencies
├── src/
│   ├── index.ts      # Main implementation
│   ├── config.ts     # Configuration
│   └── utils.ts      # Helper functions
├── examples/          # Code examples
└── .env.example       # Environment template
```

## Getting Help

- 📖 **Documentation**: [docs.ucai.tech](https://ucai.tech)
- 💬 **Discord**: [Join our community](https://discord.gg/universal-crypto-mcp)
- 🐛 **Issues**: [GitHub Issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- 🐦 **Twitter**: [@nichxbt](https://x.com/nichxbt)

## Contributing Tutorials

Want to add your own tutorial? We'd love to have it!

1. Fork the repository
2. Create your tutorial in `tutorials/your-tutorial-name/`
3. Follow the standard structure above
4. Add it to this index
5. Submit a pull request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## Video Walkthroughs

🎥 Video versions of these tutorials are coming soon!

Subscribe to our [YouTube channel](#) to get notified.

## Next Steps

After completing the tutorials, explore:

- **[Package Overview](../packages/overview.md)** - Discover all available packages
- **[API Reference](../api-reference/)** - Detailed API documentation
- **[x402 Payments](../x402-deploy/)** - Monetize your APIs
- **[Example Projects](../../examples/)** - More complete applications

## Community Showcases

Built something cool with these tutorials? Share it with the community!

- Tweet with #UniversalCryptoMCP
- Add to our [showcase page](../community/showcase.md)
- Present at our community calls

---

**Happy Building! 🚀**

For questions or feedback, reach out on [Twitter](https://x.com/nichxbt) or [GitHub](https://github.com/nirholas).
