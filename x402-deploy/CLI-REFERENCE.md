# x402-deploy CLI - Complete Command Reference

The world's most powerful CLI for monetizing APIs and MCP servers with cryptocurrency payments.

## 🚀 Quick Start

```bash
# Initialize x402 in your project
npx x402-deploy init

# Deploy with payments enabled
npx x402-deploy deploy

# Test locally
npx x402-deploy test
```

## 📋 Core Commands

### `init` - Initialize x402
Initialize x402 in your project with smart detection and configuration.

```bash
x402-deploy init [options]

Options:
  -y, --yes              Skip prompts and use defaults
  --wallet <address>     Wallet address to receive payments
  --network <network>    Blockchain network (e.g., eip155:8453)
  --template <template>  Use a template configuration
```

**Features:**
- 🔍 Smart project detection (Express, Hono, FastAPI, MCP)
- 💰 Intelligent pricing suggestions based on detected routes
- 📊 Revenue projections
- 🎨 Beautiful interactive prompts

### `deploy` - Deploy with Payments
Deploy your monetized API to production with one command.

```bash
x402-deploy deploy [options]

Options:
  -p, --provider <provider>  Deployment provider (railway, fly, vercel, docker)
  --dry-run                  Show what would be deployed without deploying
  --no-discovery             Skip x402scan registration
  --env <env>                Environment name (development, staging, production)
```

**Features:**
- 🚀 One-click deployment to multiple platforms
- 🔍 Automatic x402scan registration for discoverability
- 📝 Deployment preview with dry-run mode
- ✅ Configuration validation

### `test` - Local Testing
Test your monetized API locally with a full x402 middleware server.

```bash
x402-deploy test [options]

Options:
  --port <port>  Local server port (default: 3402)
```

**Features:**
- 🖥️ Full Express server with x402 middleware
- 🔐 Real payment verification
- 📍 /.well-known/x402 discovery endpoint
- 🧪 Test routes: /api/test, /api/echo

## 📊 Analytics & Monitoring

### `analytics` - Deep Analytics
Comprehensive analytics and insights for your monetized API.

```bash
x402-deploy analytics [options]

Options:
  -p, --period <period>  Time period: day, week, month, all (default: week)
  -r, --route <route>    Filter by specific route
  -e, --export <format>  Export format: json, csv
  -t, --top <count>      Number of top routes to show (default: 10)
```

**Features:**
- 📈 Revenue summary with metrics boxes
- 🛣️ Top routes by revenue
- 📉 Sparkline charts for daily trends
- 👥 Top payers analysis
- 💡 Automated insights and growth projections
- 📤 Export to JSON/CSV

### `dashboard` - Earnings Dashboard
View your earnings in a beautiful terminal dashboard.

```bash
x402-deploy dashboard [project] [options]

Options:
  --json            Output earnings as JSON
  --period <period> Time period: day, week, month, all (default: week)
  --compact         Show compact one-line summary
  --trends          Show revenue trends chart
```

### `watch` - Live Monitoring
Real-time monitoring of payments and API activity.

```bash
x402-deploy watch [options]

Options:
  -i, --interval <ms>  Refresh interval in milliseconds (default: 5000)
  -c, --compact        Compact display mode
  -r, --routes         Show route breakdown
  -s, --sound          Play sound on new payments
```

**Features:**
- 🔴 Live updating dashboard
- 💰 Instant payment notifications
- 📊 Real-time metrics
- 🔔 Sound alerts for new payments
- 📈 Activity indicators

### `status` - Health Check
Check the health and status of your deployed API.

```bash
x402-deploy status
```

**Features:**
- 🏥 Comprehensive health checks
- 🌐 Network connectivity tests
- 💳 Payment facilitator status
- 📡 x402scan registration verification

### `logs` - View Logs
View deployment logs with live streaming support.

```bash
x402-deploy logs [options]

Options:
  -f, --follow        Follow log output
  -n, --lines <lines> Number of lines to show (default: 100)
```

## 💰 Pricing & Configuration

### `pricing` - Configure Pricing
Interactive pricing configuration with route-based pricing.

```bash
x402-deploy pricing [options]

Options:
  --route <route>  Route pattern (e.g., 'GET /api/*')
  --price <price>  Price (e.g., '$0.01')
  --list           List current pricing
  --remove <route> Remove pricing for a route
  -i, --interactive Interactive pricing editor
```

**Features:**
- 🎯 Route-based pricing patterns
- 📝 Interactive editor with add/edit/remove
- 📊 Price tier suggestions
- 💡 Revenue estimation

### `simulate` - Payment Simulation
Simulate payment flows and test your pricing configuration.

```bash
x402-deploy simulate [options]

Options:
  -r, --route <route>  Route to simulate
  -c, --calls <calls>  Number of calls to simulate
  -p, --payers <payers> Number of unique payers
```

**Features:**
- 🎲 Revenue projections (one-time, monthly, yearly)
- 📈 Growth scenarios (2x, 5x, 10x)
- 🔄 Payment flow visualization
- 💡 Detailed breakdown by payers

### `withdraw` - Withdraw Earnings
Withdraw your earnings to your wallet.

```bash
x402-deploy withdraw
```

**Features:**
- 💵 Real-time balance checking
- 🏦 Direct withdrawal to wallet
- ✅ Transaction confirmation
- 📊 Earnings summary

## 🔧 Management & Utilities

### `upgrade` - Upgrade Configuration
Upgrade your x402 configuration to the latest version.

```bash
x402-deploy upgrade
```

**Features:**
- 🔄 Automatic schema upgrades
- 🛣️ Route detection and suggestions
- 💰 Price optimization
- 📝 Changelog display

### `doctor` - Diagnose & Fix
Comprehensive health check and auto-repair functionality.

```bash
x402-deploy doctor [options]

Options:
  -f, --fix       Automatically apply fixes
  -v, --verbose   Show detailed output
```

**Features:**
- 🩺 Configuration validation
- 🔍 Wallet address verification
- 🌐 Network and facilitator checks
- 🛠️ Auto-fix common issues
- 📋 Detailed diagnostic report

### `export` - Export Configuration
Export your x402 configuration to various formats.

```bash
x402-deploy export [options]

Options:
  -f, --format <format>  Format: json, yaml, env, docker
  -o, --output <path>    Output file path
  -i, --include <items>  Include analytics, logs
```

**Formats:**
- 📄 JSON - Portable configuration
- 📝 YAML - Human-readable
- 🔐 ENV - Environment variables
- 🐳 Docker - docker-compose.yml snippet

### `import` - Import Configuration
Import x402 configuration from various sources.

```bash
x402-deploy import [options]

Options:
  -s, --source <source>  Source file or URL
  --force                Overwrite existing config
  -m, --merge            Merge with existing config
```

**Features:**
- 📥 Import from JSON, YAML, ENV
- 🔗 Remote URL support
- 🔄 Smart merging
- ✅ Validation and error checking

### `compare` - Compare Configurations
Compare pricing and revenue across different configurations.

```bash
x402-deploy compare [options]

Options:
  -c, --configs <configs...>  Config files to compare
  -o, --output <format>       Output format: table, json, chart
```

**Features:**
- ⚖️ Side-by-side comparison
- 📊 Revenue projections
- 💡 Insights and recommendations
- 🎯 Price optimization suggestions

## 🧪 Testing & Performance

### `benchmark` - Performance Testing
Load testing with payment simulation.

```bash
x402-deploy benchmark [options]

Options:
  -u, --url <url>          Target URL (default: http://localhost:3402)
  -n, --requests <count>   Total requests (default: 100)
  -c, --concurrency <count> Concurrent requests (default: 10)
  -r, --route <route>      Route to test (default: /api/test)
```

**Features:**
- ⚡ Performance metrics (req/s, latency)
- 📊 Percentile analysis (P50, P95, P99)
- 💳 Payment overhead measurement
- 📈 Baseline vs. payment comparison
- 💡 Performance recommendations

## 🔄 Migration

### `migrate` - Migrate from Other Systems
Migrate from Stripe, PayPal, and other payment platforms.

```bash
x402-deploy migrate [options]

Options:
  -f, --from <platform>  Source platform: stripe, paypal, razorpay, square
  -k, --api-key <key>    API key for source platform
  --dry-run              Preview migration without saving
```

**Supported Platforms:**
- 💳 Stripe
- 💰 PayPal
- 🇮🇳 Razorpay
- 🔲 Square
- 🔧 Custom migration

## 🛍️ Marketplace

### `marketplace` - API Marketplace
Browse and publish to the x402 API marketplace.

```bash
x402-deploy marketplace <command>

Commands:
  list                List APIs in the marketplace
  view <api-id>       View details of a specific API
  search <query>      Search for APIs
  publish             Publish your API to the marketplace
  categories          List marketplace categories
  review <api-id>     Submit a review for an API

Options (for list/search):
  -c, --category <category>  Filter by category
  -v, --verified             Show only verified APIs
  --json                     Output as JSON
```

**Alias:** `mp` for quick marketplace listing

## 🐚 Shell Completions

### `completions` - Generate Auto-completions
Generate shell completion scripts for bash, zsh, fish, and PowerShell.

```bash
x402-deploy completions [options]

Options:
  -s, --shell <shell>  Shell type: bash, zsh, fish, powershell
  -o, --output <path>  Output file path
```

**Supported Shells:**
- 🐚 Bash
- ⚡ Zsh
- 🐠 Fish
- 💻 PowerShell

## ⚡ Quick Aliases

- `d` → `deploy` - Quick deployment
- `s` → `status` - Quick status check
- `mp` → `marketplace list` - Quick marketplace browse

## 🎨 Global Options

All commands support:
- `--help` - Show command help
- `--version` - Show version information

## 📚 Examples

### Complete Workflow
```bash
# 1. Initialize
x402-deploy init --wallet 0x... --network eip155:8453

# 2. Configure pricing
x402-deploy pricing --interactive

# 3. Test locally
x402-deploy test --port 3402

# 4. Run diagnostics
x402-deploy doctor --fix

# 5. Simulate revenue
x402-deploy simulate --calls 1000 --payers 50

# 6. Deploy to production
x402-deploy deploy --provider railway

# 7. Monitor live
x402-deploy watch --routes --sound

# 8. View analytics
x402-deploy analytics --period month --export json
```

### Advanced Usage
```bash
# Compare dev vs prod configs
x402-deploy compare --configs x402.config.dev.json x402.config.prod.json

# Benchmark performance
x402-deploy benchmark --requests 1000 --concurrency 50

# Migrate from Stripe
x402-deploy migrate --from stripe --dry-run

# Export for Docker
x402-deploy export --format docker --output docker-compose.x402.yml

# Generate shell completions
x402-deploy completions --shell zsh
```

## 🌟 Features Summary

- ✅ **17 powerful commands** for complete API monetization
- 🎨 Beautiful ASCII art and colored output
- 📊 Real-time analytics and monitoring
- 💰 Smart pricing with revenue projections
- 🚀 One-click deployment to multiple platforms
- 🧪 Comprehensive testing and benchmarking
- 🔄 Easy migration from legacy payment systems
- 🛍️ Built-in marketplace integration
- 🐚 Shell auto-completion support
- 🩺 Automatic diagnostics and fixes
- 📈 Live payment monitoring
- 💡 AI-powered insights and recommendations

## 🔗 Links

- **Documentation:** https://docs.x402.dev
- **Website:** https://x402.dev
- **GitHub:** https://github.com/nirholas/universal-crypto-mcp
- **Discord:** https://discord.gg/x402

## 💬 Support

- 📧 Email: support@x402.dev
- 💬 Discord: Join our community
- 🐛 Issues: GitHub Issues
- 📖 Docs: https://docs.x402.dev

---

**Made with ❤️ by the x402 team**

*Monetize any API in minutes with cryptocurrency payments*
