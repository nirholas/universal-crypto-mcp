# x402-deploy

> 1-click deployment for monetized APIs & MCP servers

Turn any API or MCP server into a paid service in **5 minutes**. No code changes required.

[![npm version](https://badge.fury.io/js/@nirholas%2Fx402-deploy.svg)](https://www.npmjs.com/package/@nirholas/x402-deploy)
[![Tests](https://github.com/nirholas/universal-crypto-mcp/actions/workflows/test.yml/badge.svg)](https://github.com/nirholas/universal-crypto-mcp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **💰 Instant Monetization** - Charge per API call with crypto (USDC on Base)
- **🚀 1-Click Deploy** - Railway, Fly.io, Vercel, or Docker
- **📊 Live Dashboard** - Real-time earnings and analytics
- **🔍 Auto-Discovery** - Automatic listing on x402scan.com
- **🛡️ Zero Trust** - Payment verification before API access
- **🎨 Beautiful CLI** - Stunning terminal UI with live updates

---

## 🚀 Quick Start

```bash
# Install globally
npm install -g @nirholas/x402-deploy

# Navigate to your API/MCP server
cd my-awesome-api

# Initialize (detects project automatically)
x402-deploy init

# Deploy (creates wallet, deploys, registers)
x402-deploy deploy

# Watch earnings
x402-deploy dashboard
```

**That's it!** Your API is now live and earning money. 💸

---

## 📦 What Gets Deployed?

x402-deploy wraps your existing API with a payment gateway:

```
┌─────────────────────────────────────┐
│   Your API (unchanged)              │
│   ↓                                 │
│   x402 Gateway (automatic)          │
│   ↓                                 │
│   Payment Verification              │
│   ↓                                 │
│   Analytics & Rate Limiting         │
│   ↓                                 │
│   Deployed to Cloud                 │
└─────────────────────────────────────┘
```

---

## 💡 Use Cases

- **MCP Servers** - Monetize Claude Desktop tools
- **AI APIs** - Charge for GPT wrappers, embeddings
- **Trading Bots** - Sell API access to strategies
- **Data APIs** - Weather, crypto prices, analytics
- **Web Services** - Any REST/HTTP API

---

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Deployment Platforms](docs/deployment.md)
- [Pricing Strategies](docs/pricing.md)
- [Dashboard Guide](docs/dashboard.md)
- [API Reference](docs/api.md)

---

## 🎯 Supported Platforms

| Platform | Status | Deploy Time | Free Tier |
|----------|--------|-------------|-----------|
| Railway | ✅ | ~2 min | $5/month |
| Fly.io | ✅ | ~3 min | Yes |
| Vercel | ✅ | ~1 min | Yes |
| Docker | ✅ | ~30 sec | Self-hosted |

---

## 🏗️ Project Types

Automatically detects and configures:

- ✅ MCP Servers (`@modelcontextprotocol/sdk`)
- ✅ Express APIs
- ✅ Fastify
- ✅ FastAPI (Python)
- ✅ Next.js
- ✅ Generic Node.js/Python

---

## 💰 Pricing Models

```json
{
  "pricing": {
    "model": "per-call",
    "default": { "price": "$0.01" },
    "routes": {
      "GET /api/*": "$0.0001",
      "POST /api/trade": "$0.10",
      "GET /api/free": "$0"
    }
  }
}
```

---

## 📊 Dashboard

Beautiful terminal dashboard with live updates:

```bash
x402-deploy dashboard
```

```
╔═══════════════════════════════════════════╗
║  💰 Earnings Summary                      ║
╠═══════════════════════════════════════════╣
║  Today:     $12.45  (1,245 calls)         ║
║  This Week: $87.32  (8,732 calls)         ║
║  All Time:  $1,547  (154,718 calls)       ║
╚═══════════════════════════════════════════╝
```

---

## 🔧 CLI Commands

```bash
x402-deploy init              # Initialize project
x402-deploy deploy            # Deploy to cloud
x402-deploy deploy --dry-run  # Preview deployment
x402-deploy dashboard         # Live earnings dashboard
x402-deploy pricing           # Manage pricing
x402-deploy status            # Check deployment status
x402-deploy logs              # View deployment logs
x402-deploy withdraw          # Withdraw earnings
x402-deploy export --csv      # Export analytics
```

---

## 🤝 Contributing

We love contributions! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

MIT © [nirholas](https://github.com/nirholas)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nirholas/universal-crypto-mcp&type=Date)](https://star-history.com/#nirholas/universal-crypto-mcp&Date)

---

**Made with ❤️ by the x402 community**
