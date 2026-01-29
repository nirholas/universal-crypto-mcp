# Calculator MCP Server with x402 Payments

A simple calculator Model Context Protocol (MCP) server that accepts cryptocurrency payments via x402.

## 💰 Pricing

- Basic operations (add, subtract, sqrt): **$0.001 USDC**
- Premium operations (multiply, divide): **$0.002 USDC**
- Power operation: **$0.003 USDC**

All payments in USDC on **Base network** (eip155:8453).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Wallet

Edit `x402.config.json` and set your wallet address:

```json
{
  "payment": {
    "wallet": "0xYourWalletAddress"
  }
}
```

Or set via environment variable:

```bash
export X402_WALLET=0xYourWalletAddress
```

### 3. Run Locally

```bash
npm run dev
```

### 4. Deploy

```bash
# Deploy to Railway
npx x402-deploy deploy railway

# Or Fly.io
npx x402-deploy deploy flyio

# Or Docker
npx x402-deploy export docker
docker build -t calculator-mcp .
docker run calculator-mcp
```

## 🧪 Testing

### Using MCP Inspector

```bash
npx @modelcontextprotocol/inspector npm run dev
```

### Manual Testing

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm start
```

Expected response (requires payment):

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {"name": "add", "description": "Add two numbers"},
      {"name": "subtract", "description": "Subtract two numbers"},
      ...
    ]
  }
}
```

### Test with Payment

1. **Get payment address:**
   ```bash
   curl http://localhost:3000/.well-known/x402
   ```

2. **Send USDC payment on Base:**
   - Amount: 0.001 USDC
   - To: Your wallet address
   - Network: Base (Chain ID: 8453)

3. **Call tool with payment hash:**
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"add","arguments":{"a":5,"b":3},"x-payment-hash":"0x..."}}' | npm start
   ```

## 📊 View Earnings

```bash
npx x402-deploy dashboard
```

Opens a web dashboard showing:
- Total earnings
- Call statistics
- Payment history
- Withdrawal options

## 🔧 Configuration

### Custom Pricing

Edit `x402.config.json`:

```json
{
  "pricing": {
    "default": "$0.001",
    "routes": {
      "tool:multiply": "$0.005",
      "tool:divide": "$0.005"
    }
  }
}
```

### Multi-Network Support

```json
{
  "payment": {
    "networks": ["eip155:8453", "eip155:42161", "eip155:137"]
  }
}
```

## 📖 MCP Tools

| Tool | Description | Price |
|------|-------------|-------|
| `add` | Add two numbers | $0.001 |
| `subtract` | Subtract two numbers | $0.001 |
| `multiply` | Multiply two numbers | $0.002 |
| `divide` | Divide two numbers | $0.002 |
| `power` | Raise to power | $0.003 |
| `sqrt` | Square root | $0.001 |

## 🌐 Discovery

This MCP server is automatically discoverable:

```bash
curl http://localhost:3000/.well-known/x402
```

Returns metadata about the server, pricing, and payment methods.

## 💡 Tips

- **Test Mode:** Set `X402_TEST_MODE=true` to skip payment verification
- **Lower Fees:** Use Base network for lowest gas fees
- **Subscriptions:** Add subscription support for unlimited calculations
- **Credits:** Implement credit packages for bulk discounts

## 📚 Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [x402 Protocol](https://x402.dev)
- [Base Network](https://base.org)
- [Parent Project](../../README.md)
