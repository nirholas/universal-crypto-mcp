---
title: "Tool Catalog"
description: "380+ MCP tools for blockchain interactions"
category: "reference"
keywords: ["tools", "mcp", "catalog", "reference"]
order: 1
---

# Tool Catalog

Universal Crypto MCP provides 380+ tools for interacting with blockchain networks. This catalog organizes tools by category for easy discovery.

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| [Wallet](#wallet-tools) | 25+ | Balance, transfers, signing |
| [DeFi](#defi-tools) | 80+ | Swaps, lending, staking |
| [Market Data](#market-data-tools) | 50+ | Prices, charts, analytics |
| [Trading](#trading-tools) | 40+ | Orders, portfolio, analysis |
| [NFT](#nft-tools) | 30+ | Minting, trading, metadata |
| [Chain](#chain-tools) | 60+ | Blocks, transactions, contracts |
| [Security](#security-tools) | 20+ | Audits, protection, monitoring |
| [x402](#x402-tools) | 15+ | Payments, balance, history |
| [Agent](#agent-tools) | 30+ | Automation, monitoring |

## Wallet Tools

### Balance & Info

| Tool | Description | Example |
|------|-------------|---------|
| `wallet_balance` | Get native token balance | `wallet_balance({ address: "0x..." })` |
| `wallet_token_balance` | Get ERC20 token balance | `wallet_token_balance({ address: "0x...", token: "USDC" })` |
| `wallet_portfolio` | Get full portfolio | `wallet_portfolio({ address: "0x..." })` |
| `wallet_nfts` | List owned NFTs | `wallet_nfts({ address: "0x..." })` |
| `wallet_history` | Transaction history | `wallet_history({ address: "0x...", limit: 10 })` |

### Transactions

| Tool | Description | Example |
|------|-------------|---------|
| `wallet_send` | Send native tokens | `wallet_send({ to: "0x...", amount: "0.1" })` |
| `wallet_transfer` | Transfer ERC20 tokens | `wallet_transfer({ token: "USDC", to: "0x...", amount: "100" })` |
| `wallet_approve` | Approve token spending | `wallet_approve({ token: "USDC", spender: "0x...", amount: "1000" })` |

### Signing

| Tool | Description | Example |
|------|-------------|---------|
| `wallet_sign_message` | Sign a message | `wallet_sign_message({ message: "Hello" })` |
| `wallet_sign_typed_data` | Sign EIP-712 data | `wallet_sign_typed_data({ domain: {...}, types: {...}, value: {...} })` |
| `wallet_verify_signature` | Verify a signature | `wallet_verify_signature({ message: "Hello", signature: "0x..." })` |

## DeFi Tools

### Swapping

| Tool | Description | Example |
|------|-------------|---------|
| `defi_swap` | Execute token swap | `defi_swap({ tokenIn: "ETH", tokenOut: "USDC", amount: "1.0" })` |
| `defi_quote` | Get swap quote | `defi_quote({ tokenIn: "ETH", tokenOut: "USDC", amount: "1.0" })` |
| `defi_routes` | Find swap routes | `defi_routes({ tokenIn: "ETH", tokenOut: "USDC" })` |

### Lending

| Tool | Description | Example |
|------|-------------|---------|
| `defi_supply` | Supply to lending protocol | `defi_supply({ protocol: "aave", asset: "USDC", amount: "1000" })` |
| `defi_borrow` | Borrow from protocol | `defi_borrow({ protocol: "aave", asset: "USDC", amount: "500" })` |
| `defi_repay` | Repay borrowed amount | `defi_repay({ protocol: "aave", asset: "USDC", amount: "500" })` |
| `defi_withdraw` | Withdraw supplied assets | `defi_withdraw({ protocol: "aave", asset: "USDC", amount: "1000" })` |
| `defi_position` | Get lending position | `defi_position({ protocol: "aave", address: "0x..." })` |
| `defi_rates` | Get interest rates | `defi_rates({ protocol: "aave", asset: "USDC" })` |

### Liquidity

| Tool | Description | Example |
|------|-------------|---------|
| `defi_add_liquidity` | Add LP position | `defi_add_liquidity({ pool: "ETH/USDC", amount0: "1.0", amount1: "2000" })` |
| `defi_remove_liquidity` | Remove LP position | `defi_remove_liquidity({ positionId: 12345 })` |
| `defi_positions` | Get LP positions | `defi_positions({ address: "0x..." })` |
| `defi_collect_fees` | Collect LP fees | `defi_collect_fees({ positionId: 12345 })` |

### Staking

| Tool | Description | Example |
|------|-------------|---------|
| `defi_stake` | Stake tokens | `defi_stake({ protocol: "lido", amount: "10.0" })` |
| `defi_unstake` | Unstake tokens | `defi_unstake({ protocol: "lido", amount: "10.0" })` |
| `defi_rewards` | Check staking rewards | `defi_rewards({ protocol: "lido", address: "0x..." })` |
| `defi_apr` | Get current APR/APY | `defi_apr({ protocol: "lido" })` |

## Market Data Tools

### Prices

| Tool | Description | Example |
|------|-------------|---------|
| `price_current` | Get current price | `price_current({ token: "ETH" })` |
| `price_history` | Get price history | `price_history({ token: "ETH", days: 30 })` |
| `price_change` | Get price change | `price_change({ token: "ETH", period: "24h" })` |
| `price_multi` | Get multiple prices | `price_multi({ tokens: ["ETH", "BTC", "SOL"] })` |

### Analytics

| Tool | Description | Example |
|------|-------------|---------|
| `analytics_tvl` | Get protocol TVL | `analytics_tvl({ protocol: "aave" })` |
| `analytics_volume` | Get trading volume | `analytics_volume({ dex: "uniswap", period: "24h" })` |
| `analytics_gas` | Get gas prices | `analytics_gas({ chain: "ethereum" })` |
| `analytics_trending` | Get trending tokens | `analytics_trending({ limit: 10 })` |

### Sentiment

| Tool | Description | Example |
|------|-------------|---------|
| `sentiment_feargreed` | Fear & Greed Index | `sentiment_feargreed()` |
| `sentiment_social` | Social sentiment | `sentiment_social({ token: "ETH" })` |

## Trading Tools

### CEX Trading

| Tool | Description | Example |
|------|-------------|---------|
| `trading_order` | Place order | `trading_order({ exchange: "binance", pair: "BTC/USDT", side: "buy", amount: "0.01" })` |
| `trading_cancel` | Cancel order | `trading_cancel({ exchange: "binance", orderId: "123" })` |
| `trading_orders` | List open orders | `trading_orders({ exchange: "binance" })` |
| `trading_balance` | Get CEX balance | `trading_balance({ exchange: "binance" })` |

### Portfolio

| Tool | Description | Example |
|------|-------------|---------|
| `portfolio_value` | Total portfolio value | `portfolio_value({ addresses: ["0x..."] })` |
| `portfolio_pnl` | Profit/loss calculation | `portfolio_pnl({ address: "0x...", period: "30d" })` |
| `portfolio_allocation` | Asset allocation | `portfolio_allocation({ address: "0x..." })` |

## NFT Tools

| Tool | Description | Example |
|------|-------------|---------|
| `nft_metadata` | Get NFT metadata | `nft_metadata({ contract: "0x...", tokenId: 1 })` |
| `nft_floor_price` | Get collection floor | `nft_floor_price({ collection: "boredapeyachtclub" })` |
| `nft_sales` | Recent sales | `nft_sales({ collection: "boredapeyachtclub" })` |
| `nft_mint` | Mint NFT | `nft_mint({ contract: "0x...", to: "0x..." })` |
| `nft_transfer` | Transfer NFT | `nft_transfer({ contract: "0x...", tokenId: 1, to: "0x..." })` |

## Chain Tools

### Blocks & Transactions

| Tool | Description | Example |
|------|-------------|---------|
| `chain_block` | Get block info | `chain_block({ number: 18000000 })` |
| `chain_transaction` | Get transaction | `chain_transaction({ hash: "0x..." })` |
| `chain_receipt` | Get tx receipt | `chain_receipt({ hash: "0x..." })` |
| `chain_logs` | Get event logs | `chain_logs({ address: "0x...", topic: "Transfer" })` |

### Contracts

| Tool | Description | Example |
|------|-------------|---------|
| `contract_read` | Read contract | `contract_read({ address: "0x...", function: "balanceOf", args: ["0x..."] })` |
| `contract_write` | Write to contract | `contract_write({ address: "0x...", function: "transfer", args: [...] })` |
| `contract_abi` | Get contract ABI | `contract_abi({ address: "0x..." })` |

## Security Tools

| Tool | Description | Example |
|------|-------------|---------|
| `security_analyze_token` | Analyze token safety | `security_analyze_token({ address: "0x..." })` |
| `security_check_approvals` | Check token approvals | `security_check_approvals({ address: "0x..." })` |
| `security_simulate_tx` | Simulate transaction | `security_simulate_tx({ to: "0x...", data: "0x..." })` |
| `security_revoke_approval` | Revoke approval | `security_revoke_approval({ token: "0x...", spender: "0x..." })` |

## x402 Tools

| Tool | Description | Example |
|------|-------------|---------|
| `x402_pay_request` | Make paid HTTP request | `x402_pay_request({ url: "https://api.example.com", maxPayment: "0.10" })` |
| `x402_balance` | Check payment balance | `x402_balance()` |
| `x402_send` | Send direct payment | `x402_send({ to: "0x...", amount: "1.00" })` |
| `x402_estimate` | Estimate payment cost | `x402_estimate({ url: "https://api.example.com" })` |
| `x402_history` | Payment history | `x402_history({ limit: 10 })` |
| `x402_networks` | List supported networks | `x402_networks()` |

## Agent Tools

| Tool | Description | Example |
|------|-------------|---------|
| `agent_create` | Create new agent | `agent_create({ type: "trading", config: {...} })` |
| `agent_start` | Start agent | `agent_start({ agentId: "123" })` |
| `agent_stop` | Stop agent | `agent_stop({ agentId: "123" })` |
| `agent_status` | Get agent status | `agent_status({ agentId: "123" })` |
| `agent_logs` | Get agent logs | `agent_logs({ agentId: "123", limit: 100 })` |

## Using Tools

### In MCP Client

```typescript
// Tools are automatically available in MCP-compatible clients
const result = await mcp.callTool('wallet_balance', {
  address: '0xYourAddress',
});
```

### Directly via API

```typescript
import { tools } from '@universal-crypto-mcp/core';

const balance = await tools.wallet_balance({
  address: '0xYourAddress',
});
```

## See Also

- [Getting Started](../getting-started/index.md)
- [Package Reference](../packages/overview.md)
- [API Reference](../reference/api.md)
