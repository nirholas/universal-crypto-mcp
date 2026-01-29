# Troubleshooting Guide

Solutions to common issues when using x402-deploy.

---

## Quick Diagnostics

Run the diagnostic command first:

```bash
x402-deploy doctor
```

This checks:
- ✅ Node.js version
- ✅ Configuration file
- ✅ Wallet connectivity
- ✅ Network status
- ✅ Deployment health
- ✅ Analytics database

---

## Installation Issues

### "Command not found: x402-deploy"

**Cause:** npm global bin not in PATH

**Solution:**
```bash
# Find npm global bin directory
npm config get prefix

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm config get prefix)/bin:$PATH"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

### Permission Denied on Linux/Mac

**Solution:**
```bash
# Option 1: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use sudo (not recommended)
sudo npm install -g @nirholas/x402-deploy
```

### Node Version Too Old

**Error:** `Error: x402-deploy requires Node.js v18 or higher`

**Solution:**
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Verify
node --version  # Should show v18.x.x or higher
```

---

## Configuration Issues

### "Config file not found"

**Error:** `Error: x402.config.json not found`

**Solution:**
```bash
# Initialize in your project directory
cd your-project
x402-deploy init
```

### "Invalid configuration"

**Error:** `Error: Invalid x402.config.json: ...`

**Solution:**

1. Validate JSON syntax:
```bash
cat x402.config.json | python -m json.tool
```

2. Check required fields:
```json
{
  "name": "my-api",
  "version": "1.0.0",
  "payment": {
    "wallet": "0x...",  // Must be valid Ethereum address
    "network": "eip155:8453",  // Must be valid CAIP-2
    "token": "USDC"
  }
}
```

3. Regenerate config:
```bash
x402-deploy init --force
```

### Invalid Wallet Address

**Error:** `Error: Invalid wallet address`

**Solution:**
```bash
# Valid format (42 characters, starts with 0x)
x402-deploy init --wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1

# Generate new wallet
x402-deploy init --generate-wallet
```

---

## Deployment Issues

### Railway Deployment Failed

**Error:** `Error: Railway deployment failed`

**Solutions:**

1. Check Railway token:
```bash
echo $RAILWAY_TOKEN  # Should show your token
```

2. Re-authenticate:
```bash
# Get new token from https://railway.app/account/tokens
export RAILWAY_TOKEN=new_token_here
```

3. Check Railway status:
```bash
x402-deploy status --provider railway
```

4. View detailed logs:
```bash
x402-deploy deploy --provider railway --verbose
```

### Fly.io Deployment Failed

**Error:** `Error: Fly deployment failed`

**Solutions:**

1. Re-authenticate:
```bash
fly auth login
```

2. Check organization:
```bash
fly orgs list
```

3. Create app manually:
```bash
fly apps create my-app-name
x402-deploy deploy --provider fly --name my-app-name
```

### Vercel Deployment Failed

**Error:** `Error: Vercel deployment failed`

**Solutions:**

1. Check token:
```bash
echo $VERCEL_TOKEN
```

2. Check project settings:
```bash
x402-deploy status --provider vercel
```

3. Deploy with verbose output:
```bash
x402-deploy deploy --provider vercel --verbose
```

### Docker Build Failed

**Error:** `Error: Docker build failed`

**Solutions:**

1. Check Docker is running:
```bash
docker info
```

2. Clean Docker cache:
```bash
docker system prune -f
docker builder prune -f
```

3. Build with verbose output:
```bash
x402-deploy deploy --provider docker --verbose
```

---

## Payment Issues

### "Payment verification failed"

**Error:** `402 Payment Required - Verification failed`

**Causes & Solutions:**

1. **Invalid payment header:**
```bash
# Check X-PAYMENT header format
curl -v https://your-api.com/endpoint
```

2. **Expired payment:**
   - Payments have ~5 minute validity
   - Client needs to generate fresh payment

3. **Wrong network:**
```bash
# Verify network in config matches payment
cat x402.config.json | grep network
```

4. **Facilitator unreachable:**
```bash
# Test facilitator connection
curl https://x402.org/facilitator/health
```

### "Insufficient funds" from client

**Client error:** `Error: Insufficient USDC balance`

**Solutions:**
1. Client needs to top up wallet with USDC
2. Check if using correct network (testnet vs mainnet)
3. For testing, use testnet with faucet funds

### Payments not showing in dashboard

**Solutions:**

1. Check analytics is enabled:
```bash
x402-deploy status --analytics
```

2. Force analytics sync:
```bash
x402-deploy dashboard --sync
```

3. Check local database:
```bash
ls -la .x402/analytics.db
```

4. Rebuild analytics database:
```bash
x402-deploy analytics --rebuild
```

---

## Network Issues

### "Network unreachable"

**Error:** `Error: Cannot connect to network eip155:8453`

**Solutions:**

1. Check internet connection:
```bash
ping google.com
```

2. Try different RPC:
```json
{
  "payment": {
    "network": "eip155:8453",
    "rpc": "https://base-mainnet.g.alchemy.com/v2/YOUR_KEY"
  }
}
```

3. Check network status:
   - [Base Status](https://status.base.org)
   - [Arbitrum Status](https://status.arbitrum.io)

### "RPC rate limited"

**Error:** `Error: 429 Too Many Requests`

**Solutions:**

1. Use private RPC (Alchemy, Infura, QuickNode):
```json
{
  "payment": {
    "rpc": "https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
  }
}
```

2. Add retry logic (automatic in x402-deploy)

### Transaction stuck/pending

**Solutions:**

1. Check transaction status:
```bash
x402-deploy tx --hash 0xabc...
```

2. Wait for confirmation (usually <2min on L2s)

3. For stuck transactions, contact platform support

---

## Dashboard Issues

### Dashboard not loading

**Error:** `Error: Failed to load dashboard`

**Solutions:**

1. Check terminal supports colors:
```bash
echo $TERM  # Should be xterm-256color or similar
```

2. Try minimal mode:
```bash
x402-deploy dashboard --minimal
```

3. Use JSON output:
```bash
x402-deploy dashboard --json
```

### No earnings showing

**Solutions:**

1. Verify deployment is live:
```bash
x402-deploy status
curl https://your-api.com/health
```

2. Check analytics tracking:
```bash
x402-deploy logs --filter analytics
```

3. Make a test request:
```bash
# Generate test payment and call API
x402-deploy test --endpoint /api/data
```

### Webhook not firing

**Solutions:**

1. Test webhook endpoint:
```bash
x402-deploy webhook --test
```

2. Check webhook logs:
```bash
x402-deploy logs --filter webhook
```

3. Verify webhook URL is accessible:
```bash
curl -X POST https://your-webhook.com/endpoint \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## Gateway Issues

### "Gateway middleware not working"

**Solutions:**

1. Check middleware is applied correctly:
```typescript
// CORRECT - middleware before routes
app.use(gateway.middleware());
app.get('/api/data', handler);

// WRONG - routes before middleware
app.get('/api/data', handler);
app.use(gateway.middleware());
```

2. Check route patterns match:
```json
{
  "pricing": {
    "routes": {
      "GET /api/data": "$0.01"  // Must match exactly
    }
  }
}
```

### "Free routes still requiring payment"

**Solutions:**

1. Verify free route pattern:
```json
{
  "routes": {
    "GET /health": "$0",  // Price must be "$0"
    "GET /api/free/*": "$0"
  }
}
```

2. Check pattern matching order (specific patterns first):
```json
{
  "routes": {
    "GET /api/free/*": "$0",  // More specific first
    "GET /api/*": "$0.01"     // Catch-all last
  }
}
```

---

## Discovery Issues

### "Registration failed"

**Error:** `Error: Failed to register with x402scan`

**Solutions:**

1. Check discovery is enabled:
```json
{
  "discovery": {
    "enabled": true,
    "autoRegister": true
  }
}
```

2. Verify API is accessible:
```bash
curl https://your-api.com/.well-known/x402.json
```

3. Manual registration:
```bash
x402-deploy register --force
```

### "API not appearing on x402scan"

**Solutions:**

1. Check registration status:
```bash
x402-deploy discovery --status
```

2. Verify .well-known is accessible:
```bash
curl https://your-api.com/.well-known/x402.json
```

3. Wait for indexing (can take up to 24 hours)

4. Submit manually:
   - Visit [x402scan.com/submit](https://x402scan.com/submit)

---

## Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `E001` | Config not found | Run `x402-deploy init` |
| `E002` | Invalid config | Check JSON syntax |
| `E003` | Wallet invalid | Use valid Ethereum address |
| `E004` | Network error | Check internet/RPC |
| `E005` | Deploy failed | Check provider credentials |
| `E006` | Payment failed | Check payment header format |
| `E007` | Analytics error | Rebuild analytics database |
| `E008` | Webhook error | Verify webhook URL |

---

## Getting Help

### Debug Mode

Run any command with `--verbose` or `--debug`:

```bash
x402-deploy deploy --verbose
x402-deploy dashboard --debug
```

### Log Files

```bash
# View all logs
x402-deploy logs --all

# Export logs for support
x402-deploy logs --export > debug.log
```

### Community Support

- **GitHub Issues:** [github.com/nirholas/universal-crypto-mcp/issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- **Discord:** [discord.gg/x402](https://discord.gg/x402)
- **Twitter:** [@x402protocol](https://twitter.com/x402protocol)

### Reporting Bugs

Include in your bug report:
1. x402-deploy version: `x402-deploy --version`
2. Node.js version: `node --version`
3. Operating system
4. Full error message
5. Steps to reproduce
6. Config file (remove sensitive data)

```bash
# Generate bug report
x402-deploy doctor --report > bug-report.txt
```

---

[← Back to Docs](../README.md)
