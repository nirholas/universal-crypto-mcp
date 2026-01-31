---
sidebar_position: 2
---

# Quick Start

Get up and running with Universal Crypto MCP in 5 minutes.

## 1. Install the Package

```bash
npm install @nirholas/universal-crypto-mcp
```

## 2. Set Up Environment

Create a `.env` file:

```bash
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_here
```

## 3. Use in Claude Desktop

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"]
    }
  }
}
```

Restart Claude Desktop, and you'll have access to 150+ crypto tools!

## 4. Try Some Tools

Ask Claude:

> "What's the current price of ETH?"

> "Show me my wallet balance"

> "Swap 0.1 ETH for USDC on Base"

## Example: Building a Paid API

Create a simple paid API endpoint:

```typescript
import express from 'express';
import { paymentMiddleware } from '@nirholas/universal-crypto-mcp/x402';

const app = express();

// Add payment requirement
app.use('/api/data', paymentMiddleware({
  price: "$0.01",
  network: "eip155:8453", // Base
  payTo: "0xYourAddress",
}));

app.get('/api/data', (req, res) => {
  res.json({
    data: "This is premium content!",
    timestamp: Date.now()
  });
});

app.listen(3000);
```

## Example: Agent Wallet

Create a wallet for your AI agent:

```typescript
import { WalletManager } from '@nirholas/agent-wallet';

const manager = new WalletManager();

// Create wallet with spending limits
const { wallet, apiKey } = await manager.createWallet({
  name: 'Research Agent',
  owner: 'user_123',
  initialBalance: '50.00',
  spendingPolicy: {
    dailyLimit: '10.00',
    perTransactionLimit: '1.00',
    monthlyLimit: '100.00',
  },
});

console.log(`Wallet ID: ${wallet.id}`);
console.log(`API Key: ${apiKey}`);
```

Then use the wallet in your agent:

```typescript
import { AgentWalletClient } from '@nirholas/agent-wallet';
import axios from 'axios';

const client = new AgentWalletClient({
  walletId: process.env.AGENT_WALLET_ID,
  apiKey: process.env.AGENT_WALLET_API_KEY,
  facilitatorUrl: 'https://facilitator.example.com',
});

// Wrap API client for automatic payments
const api = client.wrapAxios(axios.create({
  baseURL: 'https://api.example.com'
}));

// This automatically pays if 402 is returned
const data = await api.get('/paid-endpoint');
```

## Example: Credit Purchase

Enable fiat payments with credits:

```typescript
import { CreditService } from '@nirholas/credits';

const credits = new CreditService({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  baseUrl: 'https://api.example.com'
});

// Create checkout session
const session = await credits.createCheckoutSession({
  userId: 'user_123',
  credits: 1000  // $9.00 with 10% discount
});

console.log(`Checkout URL: ${session.checkoutUrl}`);
```

## What's Next?

### Learn More
- 📚 [Facilitator Overview](../facilitator/overview)
- 🏪 [Marketplace Guide](../marketplace/overview)
- 🤖 [Agent Wallet Guide](../agent-wallet/overview)
- 💳 [Credits System](../credits/overview)

### Tutorials
- [Build a Paid API](../tutorials/build-paid-api)
- [Integrate Marketplace](../tutorials/integrate-marketplace)
- [Setup Agent Wallet](../tutorials/setup-agent-wallet)

### API Reference
- [Facilitator API](../api/facilitator)
- [Marketplace API](../api/marketplace)
- [Wallet API](../api/wallets)

## Common Patterns

### Check Payment Status

```typescript
import { FacilitatorClient } from '@nirholas/x402-facilitator';

const facilitator = new FacilitatorClient({
  url: 'https://facilitator.x402.org'
});

const status = await facilitator.getPaymentStatus(paymentId);
console.log(status);
```

### Subscribe to a Service

```typescript
import { SubscriptionManager } from '@nirholas/marketplace';

const subscriptions = new SubscriptionManager({
  chain: 'base',
  contractAddress: process.env.MARKETPLACE_CONTRACT
});

await subscriptions.subscribe({
  serviceId: 'premium-api',
  plan: 'monthly',
  autoRenew: true
});
```

### Monitor Wallet Balance

```typescript
const balance = await manager.getWallet(walletId);
console.log(`Balance: $${balance.balance}`);
console.log(`Daily spent: $${balance.spendingPolicy.currentDaySpent}`);
```

## Get Help

- 💬 [Discord Community](https://discord.gg/universal-crypto-mcp)
- 📖 [Full Documentation](https://docs.nirholas.com)
- 🐛 [Report Issues](https://github.com/nirholas/universal-crypto-mcp/issues)
