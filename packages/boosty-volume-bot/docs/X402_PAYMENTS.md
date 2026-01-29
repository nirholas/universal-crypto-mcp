# x402 Payment Integration

Boosty DeFi MCP Server supports HTTP 402 micropayments via the [x402 Protocol](https://x402.org) for monetizing tool calls.

## Overview

x402 is a standard for HTTP 402 "Payment Required" responses that enables:
- Pay-per-use API access
- Micropayments in USDC
- Support for multiple blockchain networks (Base, Ethereum, Solana)
- Seamless integration with MCP tools

## Configuration

### Environment Variables

```bash
# Required: Address to receive payments
X402_PAY_TO_ADDRESS=0x...

# Network for payments (default: base-mainnet)
X402_NETWORK=base-mainnet

# Facilitator URL (default: https://x402.org/facilitator)
X402_FACILITATOR_URL=https://x402.org/facilitator

# Default price in USD (default: $0.001)
X402_DEFAULT_PRICE=$0.001

# App branding
X402_APP_NAME=Boosty DeFi
X402_APP_LOGO=https://your-domain.com/logo.png

# Coinbase Developer Platform key (optional, for enhanced features)
CDP_CLIENT_KEY=your-cdp-key
```

### Supported Networks

| Network | Chain ID | USDC Address |
|---------|----------|--------------|
| Base Mainnet | eip155:8453 | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 |
| Base Sepolia | eip155:84532 | 0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| Ethereum Mainnet | eip155:1 | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |
| Solana Mainnet | solana:mainnet | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v |
| Solana Devnet | solana:devnet | 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU |

## Pricing

### Category Pricing

| Category | Price | Description |
|----------|-------|-------------|
| swaps | $0.01 | Token swap operations |
| walletOps | $0.001 | Wallet management (create, derive, etc.) |
| campaigns | $0.05 | Campaign operations |
| queries | Free | Read-only queries |
| bots | $0.02 | Bot operations |
| analysis | $0.005 | Market analysis |

### Per-Tool Pricing

Individual tools can have custom pricing that overrides category defaults:

| Tool | Price | Description |
|------|-------|-------------|
| execute_swap | $0.01 | Execute token swap |
| execute_batch_swaps | $0.05 | Execute multiple swaps |
| create_volume_campaign | $0.10 | Create new campaign |
| start_campaign | $0.05 | Start campaign |
| create_bot | $0.05 | Create trading bot |
| start_bot | $0.02 | Start trading bot |

### Free Tools

These tools are always free:
- `get_payment_pricing` - Get pricing info
- `get_tool_price` - Get specific tool price
- `get_payment_networks` - Get supported networks
- `get_swap_quote` - Get swap quotes
- `get_wallet_balances` - Check balances
- `get_campaign_status` - Check campaign status
- `list_wallets` - List wallets
- `list_campaigns` - List campaigns
- `list_active_bots` - List bots

## Integration Flow

### 1. Client Requests a Paid Tool

```
Client -> Server: CallToolRequest { name: "execute_swap", ... }
```

### 2. Server Returns 402 Payment Required

```json
{
  "error": "Payment Required",
  "code": 402,
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:8453",
    "maxAmountRequired": "10000",
    "resource": "tool://execute_swap",
    "description": "Execute token swap",
    "mimeType": "application/json",
    "payTo": "0x..."
  }],
  "x402Version": 1
}
```

### 3. Client Makes Payment

Client creates and signs a payment transaction, then includes proof in the `X-PAYMENT` header.

### 4. Server Verifies and Executes

```
Client -> Server: CallToolRequest with X-PAYMENT header
Server -> Facilitator: Verify payment
Server: Execute tool
Server -> Facilitator: Settle payment
Server -> Client: Tool result
```

## Usage Examples

### Check Pricing

```typescript
// Get all pricing
const pricing = await client.callTool('get_payment_pricing', {});

// Get specific tool price
const price = await client.callTool('get_tool_price', {
  tool_name: 'execute_swap'
});

// Get supported networks
const networks = await client.callTool('get_payment_networks', {});
```

### Making Paid Calls

With the x402 client library:

```typescript
import { createX402Client } from '@x402/client';

const x402Client = createX402Client({
  signer: yourWalletSigner,
  facilitatorUrl: 'https://x402.org/facilitator',
});

// This automatically handles 402 responses and payment
const result = await x402Client.post('/tool/execute_swap', {
  inputMint: '...',
  outputMint: '...',
  amount: 1000000,
});
```

## Security Considerations

1. **Payment Verification**: All payments are verified through the x402 facilitator before tool execution
2. **Atomic Settlement**: Payments are settled only after successful tool execution
3. **Rate Limiting**: Payment gating works alongside rate limiting
4. **Audit Logging**: All paid tool calls are logged with payment details

## Testing

For development, use Base Sepolia testnet:

```bash
X402_NETWORK=base-sepolia
X402_PAY_TO_ADDRESS=0x...  # Your testnet address
```

Get testnet USDC from the [Base Faucet](https://faucet.base.org).

## Disabling Payments

To run without payments, simply don't set `X402_PAY_TO_ADDRESS`. All tools will be accessible without payment.

## API Reference

### PaymentRequiredResponse

```typescript
interface PaymentRequiredResponse {
  error: 'Payment Required';
  code: 402;
  accepts: Array<{
    scheme: 'exact';
    network: string;
    maxAmountRequired: string;
    resource: string;
    description: string;
    mimeType: string;
    payTo: string;
  }>;
  x402Version: 1;
}
```

### Payment Header Format

The `X-PAYMENT` header should contain a JSON-encoded payment proof:

```typescript
interface PaymentProof {
  network: string;
  signature: string;
  transaction: string;
  // Additional network-specific fields
}
```

## Troubleshooting

### "Payment Required" for Free Tools

Check that the tool name is in the `ALWAYS_FREE_TOOLS` list in your configuration.

### Payment Verification Failed

1. Ensure the payment amount matches the required amount
2. Verify the network matches the configured network
3. Check that the transaction is confirmed on-chain

### Settlement Failed

1. Check network connectivity to the facilitator
2. Verify the transaction hasn't been double-spent
3. Review the error details in the response

## Resources

- [x402 Protocol Documentation](https://x402.org/docs)
- [x402 npm packages](https://www.npmjs.com/org/x402)
- [Base Network Documentation](https://docs.base.org)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com)
