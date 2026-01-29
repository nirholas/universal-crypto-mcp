# Configuration

Universal Crypto MCP can be configured through environment variables, a config file, or CLI arguments.

## Environment Variables

### Core Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARN, ERROR) | `INFO` |
| `MCP_TRANSPORT` | Transport mode (stdio, http, sse) | `stdio` |
| `MCP_PORT` | HTTP/SSE server port | `3000` |

### API Keys

| Variable | Description | Required For |
|----------|-------------|--------------|
| `COINGECKO_API_KEY` | CoinGecko Pro API key | Enhanced market data |
| `BINANCE_API_KEY` | Binance API key | Trading tools |
| `BINANCE_API_SECRET` | Binance API secret | Trading tools |
| `BINANCE_US_API_KEY` | Binance US API key | US trading |
| `BINANCE_US_API_SECRET` | Binance US API secret | US trading |
| `CRYPTOPANIC_API_KEY` | CryptoPanic API key | News tools |
| `ETHERSCAN_API_KEY` | Etherscan API key | Contract verification |
| `INFURA_API_KEY` | Infura API key | RPC fallback |
| `ALCHEMY_API_KEY` | Alchemy API key | RPC fallback |

### x402 Payment Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `X402_PRIVATE_KEY` | EVM private key for payments | - |
| `X402_CHAIN` | Default chain | `arbitrum` |
| `X402_MAX_AMOUNT` | Maximum payment amount | `1.0` |
| `X402_AUTO_PAY` | Enable automatic payments | `false` |

### Wallet Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `PRIVATE_KEY` | EVM wallet private key | - |
| `MNEMONIC` | HD wallet mnemonic phrase | - |
| `RPC_URL` | Custom RPC endpoint | Chain default |

## Configuration File

Create a `.universal-crypto-mcp.json` file in your project root or home directory:

```json
{
  "transport": "stdio",
  "logLevel": "INFO",
  "modules": {
    "trading": {
      "enabled": true,
      "exchanges": ["binance", "binance-us"]
    },
    "marketData": {
      "enabled": true,
      "providers": ["coingecko", "dexpaprika"]
    },
    "defi": {
      "enabled": true,
      "protocols": ["aave", "uniswap", "compound"]
    },
    "wallets": {
      "enabled": true,
      "chains": ["ethereum", "arbitrum", "base", "polygon"]
    },
    "payments": {
      "enabled": true,
      "x402": {
        "chain": "arbitrum",
        "maxAmount": "1.0",
        "autoPay": false
      }
    }
  },
  "rpc": {
    "ethereum": "https://eth.llamarpc.com",
    "arbitrum": "https://arb1.arbitrum.io/rpc",
    "base": "https://mainnet.base.org",
    "polygon": "https://polygon-rpc.com"
  }
}
```

## CLI Arguments

Override settings via command line:

```bash
# Transport mode
npx @nirholas/universal-crypto-mcp --http --port 8080

# Log level
npx @nirholas/universal-crypto-mcp --log-level DEBUG

# Enable specific modules
npx @nirholas/universal-crypto-mcp --modules trading,market-data

# Custom config file
npx @nirholas/universal-crypto-mcp --config ./my-config.json
```

## Priority Order

Configuration is applied in this order (later overrides earlier):

1. Default values
2. Configuration file
3. Environment variables
4. CLI arguments

## Module-Specific Configuration

### Trading Module

```json
{
  "modules": {
    "trading": {
      "enabled": true,
      "exchanges": ["binance"],
      "sandbox": false,
      "defaultPairs": ["BTC/USDT", "ETH/USDT"]
    }
  }
}
```

### DeFi Module

```json
{
  "modules": {
    "defi": {
      "enabled": true,
      "protocols": ["aave", "uniswap", "compound"],
      "slippageTolerance": 0.5,
      "gasMultiplier": 1.2
    }
  }
}
```

### Wallet Module

```json
{
  "modules": {
    "wallets": {
      "enabled": true,
      "chains": ["ethereum", "arbitrum"],
      "confirmations": 1,
      "gasStrategy": "fast"
    }
  }
}
```

## Security Best Practices

### Never Commit Secrets

Add to your `.gitignore`:

```gitignore
.env
.env.local
*.key
*-key.json
```

### Use Environment Variables

Store sensitive data in environment variables, not config files:

```bash
export X402_PRIVATE_KEY="0x..."
export BINANCE_API_KEY="..."
export BINANCE_API_SECRET="..."
```

### Limit Permissions

When using API keys:
- Enable only required permissions
- Use IP whitelisting when available
- Set spending limits for exchange APIs

### Test with Small Amounts

Always test with small amounts before enabling larger transactions:

```json
{
  "modules": {
    "payments": {
      "x402": {
        "maxAmount": "0.01"
      }
    }
  }
}
```

## Next Steps

- [First Tool](first-tool.md) - Use your first crypto tool
- [Deployment](deployment.md) - Deploy to production
