# 🤖 Automation MCP Servers

> Bots, automation tools, and background processes for crypto

## Overview

This package provides automation tools for AI agents including social media bots, dust sweeping, and volume boosting utilities.

## Available Servers

### 📱 Social Media
- **XActions** - Twitter/X automation for crypto
- **Premium XActions** - Advanced social features

### 🧹 Sweep
- **Dust Sweeper** - Consolidate small balances
- **Token Cleanup** - Remove unwanted tokens

### 📊 Volume
- **Boosty Volume Bot** - DEX volume generation
- **Trading Bots** - Automated trading strategies

## Installation

```bash
# From workspace root
pnpm install

# Build automation packages
pnpm --filter "@nirholas/crypto-automation" build
```

## Configuration

```bash
# Twitter/X
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Dust Sweeper
PRIVATE_KEY=0x...
MIN_DUST_VALUE_USD=0.10
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "xactions": {
      "command": "node",
      "args": ["packages/automation/social/xactions/dist/index.js"],
      "env": {
        "TWITTER_API_KEY": "your_key"
      }
    },
    "dust-sweeper": {
      "command": "node",
      "args": ["packages/automation/sweep/dust-sweeper/dist/index.js"],
      "env": {
        "PRIVATE_KEY": "your_key"
      }
    }
  }
}
```

## Available Tools

### Social Tools
| Tool | Description |
|------|-------------|
| `post_tweet` | Post a tweet |
| `search_tweets` | Search for tweets |
| `get_user_tweets` | Get user's tweets |
| `track_mentions` | Monitor mentions |
| `analyze_sentiment` | Analyze tweet sentiment |

### Sweep Tools
| Tool | Description |
|------|-------------|
| `scan_dust` | Find dust tokens |
| `sweep_to_eth` | Swap dust to ETH |
| `sweep_to_usdc` | Swap dust to USDC |
| `estimate_sweep` | Estimate sweep value |

### Volume Tools
| Tool | Description |
|------|-------------|
| `generate_volume` | Create trading volume |
| `analyze_volume` | Analyze trading patterns |
| `volume_report` | Get volume metrics |

## ⚠️ Important Disclaimers

### Social Media
- Respect platform ToS
- Don't spam or harass
- Comply with rate limits
- Use for legitimate purposes only

### Trading Bots
- Volume generation may violate exchange ToS
- Use at your own risk
- Not financial advice
- Test on testnet first

### Dust Sweeping
- Verify transactions before signing
- Some tokens may be honeypots
- Gas costs may exceed dust value
- Check token contracts

## Architecture

```
packages/automation/
├── social/             # Social media automation
│   ├── xactions/       # Twitter/X integration
│   └── premium/        # Premium features
├── sweep/              # Dust sweeping tools
│   └── dust-sweeper/   # Main sweeper
└── volume/             # Volume tools
    └── boosty/         # Volume bot
```

## License

Apache-2.0

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
