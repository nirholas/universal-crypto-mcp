# Alby Lightning MCP Server

> Bitcoin Lightning Network payments via Alby wallet integration.

## Attribution

**Original Author:** [Alby](https://github.com/getAlby)  
**Original Repository:** [mcp](https://github.com/getAlby/mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Features

### From Original Implementation
- ✅ Send Lightning payments
- ✅ Receive Lightning payments
- ✅ Generate invoices
- ✅ Check balance
- ✅ Transaction history
- ✅ LNURL support

### Our Enhancements (Apache-2.0)
- ✅ Unified API compatibility
- ✅ Multi-wallet support
- ✅ Payment streaming
- ✅ Invoice management
- ✅ Webhook integration

## What is Lightning Network?

The Lightning Network is a Layer 2 payment protocol on top of Bitcoin that enables:
- ⚡ Instant transactions (milliseconds)
- 💰 Near-zero fees
- 🔒 High privacy
- 📈 High throughput

## Installation

```bash
pnpm add @nirholas/alby-mcp
```

## Configuration

```bash
export ALBY_ACCESS_TOKEN=your_alby_token
```

Get your access token at [Alby](https://getalby.com)

## Usage

### With MCP Server

```typescript
import { registerAlbyTools } from '@nirholas/alby-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-lightning-server', version: '1.0.0' });
registerAlbyTools(server);
```

### Standalone

```typescript
import { AlbyClient } from '@nirholas/alby-mcp';

const client = new AlbyClient({ accessToken: process.env.ALBY_ACCESS_TOKEN });

// Check balance
const balance = await client.getBalance();

// Send payment
const payment = await client.sendPayment({
  invoice: 'lnbc...',
});

// Create invoice
const invoice = await client.createInvoice({
  amount: 1000, // sats
  memo: 'Payment for service',
});
```

## Available Tools

| Tool | Description |
|------|-------------|
| `lightning_balance` | Get wallet balance in sats |
| `lightning_send` | Send a Lightning payment |
| `lightning_invoice` | Create a Lightning invoice |
| `lightning_decode` | Decode a Lightning invoice |
| `lightning_transactions` | Get transaction history |
| `lightning_lnurl_pay` | Pay via LNURL |

## Example Queries

```
What's my Lightning wallet balance?
```

```
Send 1000 sats to this invoice: lnbc...
```

```
Create an invoice for 5000 sats
```

## License

- Original Implementation: MIT (Alby)
- Enhancements: Apache-2.0 (Nich)
