# Installation Guide

Complete guide to installing and setting up x402-deploy for API monetization.

---

## Prerequisites

Before installing x402-deploy, ensure you have:

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher (or pnpm/yarn)
- **Git** for version control
- A crypto wallet (we can create one for you)

### Check Your Versions

```bash
node --version  # Should be v18+
npm --version   # Should be v8+
```

---

## Installation Methods

### Global Installation (Recommended)

Install globally to use the `x402-deploy` command anywhere:

```bash
# Using npm
npm install -g @nirholas/x402-deploy

# Using pnpm
pnpm add -g @nirholas/x402-deploy

# Using yarn
yarn global add @nirholas/x402-deploy
```

Verify installation:

```bash
x402-deploy --version
x402-deploy --help
```

### npx (No Installation)

Run directly without installing:

```bash
npx @nirholas/x402-deploy init
npx @nirholas/x402-deploy deploy
```

### Local Installation

Add as a dev dependency to your project:

```bash
npm install --save-dev @nirholas/x402-deploy
```

Then use via npm scripts in `package.json`:

```json
{
  "scripts": {
    "x402:init": "x402-deploy init",
    "x402:deploy": "x402-deploy deploy",
    "x402:dashboard": "x402-deploy dashboard"
  }
}
```

---

## First-Time Setup

### 1. Initialize Your Project

Navigate to your API or MCP server directory:

```bash
cd my-awesome-api
x402-deploy init
```

The init wizard will:
1. Detect your project type (Express, FastAPI, MCP, etc.)
2. Create or import a wallet for receiving payments
3. Set up default pricing
4. Create `x402.config.json`

### 2. Configure Your Wallet

You have three options for wallet setup:

#### Option A: Generate New Wallet (Recommended for New Users)

```bash
x402-deploy init
# Select "Generate new wallet" when prompted
```

The CLI will:
- Generate a new Ethereum wallet
- Display your address and private key
- Save encrypted credentials locally
- **IMPORTANT**: Back up your private key securely!

#### Option B: Import Existing Wallet

```bash
x402-deploy init --wallet 0xYourWalletAddress
```

Or import with private key for signing:

```bash
x402-deploy init --import-key
# Enter your private key when prompted (never share this!)
```

#### Option C: Use Environment Variables

```bash
export X402_WALLET=0xYourWalletAddress
export X402_PRIVATE_KEY=your_private_key_here
x402-deploy init
```

### 3. Set Up Platform Credentials

For cloud deployment, configure your platform credentials:

#### Railway

```bash
# Get token from https://railway.app/account/tokens
export RAILWAY_TOKEN=your_railway_token
```

#### Fly.io

```bash
# Install flyctl and authenticate
curl -L https://fly.io/install.sh | sh
fly auth login
```

#### Vercel

```bash
# Get token from https://vercel.com/account/tokens
export VERCEL_TOKEN=your_vercel_token
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `X402_WALLET` | Your Ethereum wallet address | Yes |
| `X402_PRIVATE_KEY` | Private key for signing | Optional |
| `X402_NETWORK` | Default network (e.g., `eip155:8453`) | Optional |
| `RAILWAY_TOKEN` | Railway deployment token | For Railway |
| `FLY_API_TOKEN` | Fly.io API token | For Fly.io |
| `VERCEL_TOKEN` | Vercel deployment token | For Vercel |
| `X402_FACILITATOR` | Custom facilitator URL | Optional |

---

## Project Structure After Init

After running `x402-deploy init`, your project will have:

```
your-project/
├── x402.config.json      # Main configuration file
├── .x402/
│   ├── wallet.enc        # Encrypted wallet (if generated)
│   └── analytics.db      # Local analytics database
├── package.json          # Updated with x402 scripts
└── ... your existing files
```

---

## Updating x402-deploy

Keep your installation up to date:

```bash
# Global installation
npm update -g @nirholas/x402-deploy

# Check for updates
x402-deploy --version

# Local installation
npm update @nirholas/x402-deploy
```

---

## Uninstalling

```bash
# Global uninstall
npm uninstall -g @nirholas/x402-deploy

# Remove local config (optional)
rm -rf .x402 x402.config.json
```

---

## Troubleshooting

### "Command not found: x402-deploy"

Ensure npm global bin is in your PATH:

```bash
# Find npm global bin directory
npm config get prefix

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Permission Errors on Linux/Mac

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Node Version Too Old

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or update Node directly
# Visit https://nodejs.org/en/download/
```

### Network Connection Issues

If you're behind a proxy:

```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

---

## Next Steps

- [Configuration Guide](configuration.md) - Customize your setup
- [Pricing Strategies](pricing.md) - Set up monetization
- [Deployment Platforms](deployment.md) - Deploy to the cloud
- [Dashboard Guide](dashboard.md) - Monitor earnings

---

[← Back to Docs](../README.md)
