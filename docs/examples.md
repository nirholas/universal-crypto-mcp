# universal-crypto-mcp examples

The most extensive crypto MCP repository - 60+ networks, 100+ tools, DEX/CEX, DeFi, wallets, market data, automation, and x402 payments

## Example 1

```bash
npx @nirholas/universal-crypto-mcp
```

## Example 2

```text
User: "Get premium weather data for Tokyo"

Claude: 🔍 Checking x402 balance... $45.23 USDs
        💳 Paying $0.01 for premium API access...
        ✅ Payment confirmed! Here's your detailed forecast:
        
        🌤️ Tokyo Weather (7-day premium forecast)...
```

## Example 3

```text
packages/
├── core/               # Shared types, utilities, configuration
├── trading/            # CEX exchange integrations
│   ├── binance/        # Binance spot & futures
│   ├── binance-us/     # Binance US
│   └── bybit/          # Bybit exchange (ethancod1ng) ⭐ NEW
├── market-data/        # Prices, news, analytics  
│   ├── prices/         # CoinGecko, DexPaprika, CoinMarketCap
│   ├── news/           # CryptoPanic, aggregated news
│   ├── analytics/      # Whale tracking, Fear/Greed, Dune
│   ├── predictions/    # AI price predictions
│   ├── crypto-indicators/  # Technical analysis (Kukapay) ⭐ NEW
│   ├── crypto-sentiment/   # Sentiment analysis (Kukapay) ⭐ NEW
│   ├── crypto-feargreed/   # Fear & Greed Index (Kukapay) ⭐ NEW
│   ├── cryptopanic/        # News aggregation (Kukapay)
│   └── coinmarketcap/      # CMC API (Shinzo Labs) ⭐ NEW
├── defi/               # On-chain DeFi tools (60+ networks!)
│   ├── protocols/      # EVM MCP Server (360⭐), Sperax, DEX
│   │   ├── algorand/   # Algorand tools (GoPlausible) ⭐ NEW
│   │   └── bsc-ops/    # BSC operations (TermiX) ⭐ NEW
│   ├── chain-tools/    # BNB Chain, Onchain MCP
│   └── agents/         # Autonomous DeFi agents
├── wallets/            # Wallet management
│   ├── evm/            # Ethereum & EVM wallets
│   └── solana/         # Solana wallets
├── payments/           # Payment infrastructure
│   └── x402/           # x402 protocol, USDC transfers
├── automation/         # Bots & automation
│   ├── social/         # XActions Twitter automation
│   ├── sweep/          # Dust sweeping
│   └── volume/         # Volume tools
└── generators/         # Meta-tools for building MCP servers
    ├── abi-to-mcp/     # Convert ABIs to MCP tools
    ├── repo-to-mcp/    # GitHub repos → MCP servers
    ├── doc-extractor/  # Extract docs for LLMs
    ├── registry/       # Lyra tool registry
    └── discovery/      # Tool discovery & search
```

## Example 4

```bash
# Add to your environment
export X402_PRIVATE_KEY=0x...  # Your EVM private key
export X402_CHAIN=arbitrum      # Default chain (or base, ethereum, polygon)
```

## Example 5

```text
User: "Get premium weather data for Tokyo"
Agent: [calls x402_pay_request to weather API]
       [automatically pays $0.01 in USDs]
       "Here's the detailed forecast..."
```

## Example 6

```text
┌─────────┐      ┌───────────┐      ┌───────────┐
│ Claude  │─────▶│ MCP Server│─────▶│ Paid API  │
│  (AI)   │      │  (x402)   │      │   (402)   │
└─────────┘      └───────────┘      └───────────┘
     │                │                   │
     │  "Get data"    │  HTTP + Payment   │
     │                │                   │
     └────────────────┴───────────────────┘
```

## Example 7

```bash
npx @nirholas/universal-crypto-mcp@latest --http
```

## Example 8

```text
Swap 0.1 ETH for USDC on Arbitrum
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/universal-crypto-mcp#readme).
