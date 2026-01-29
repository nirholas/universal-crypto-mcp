# UCAI MCP Server

Universal Crypto AI agent for the Universal Crypto MCP ecosystem. Provides comprehensive crypto capabilities across 60+ blockchain networks.

## Installation

```bash
pnpm add @universal-crypto-mcp/agent-ucai
```

## Quick Start

```typescript
import { createUCAI } from '@universal-crypto-mcp/agent-ucai';

const agent = createUCAI({
  name: 'MyCryptoAgent',
  chains: ['eip155:1', 'eip155:42161', 'eip155:8453'],
  capabilities: ['swap', 'bridge', 'transfer', 'stake'],
});

agent.listen(3000);
```

## Features

### Multi-Chain Support

UCAI supports 60+ blockchain networks out of the box:

```typescript
const agent = createUCAI({
  chains: [
    'eip155:1',      // Ethereum
    'eip155:42161',  // Arbitrum
    'eip155:8453',   // Base
    'eip155:137',    // Polygon
    'eip155:10',     // Optimism
    'eip155:43114',  // Avalanche
    'eip155:56',     // BNB Chain
    // ... 50+ more chains
  ],
});
```

### Token Operations

```typescript
// Get token balance
const balance = await agent.tools.getBalance({
  address: '0x...',
  chain: 'ethereum',
  token: 'USDC',
});

// Transfer tokens
const tx = await agent.tools.transfer({
  to: '0x...',
  amount: '100',
  token: 'USDC',
  chain: 'base',
});

// Get token price
const price = await agent.tools.getPrice({
  token: 'ETH',
  currency: 'USD',
});
```

### DEX Trading

```typescript
// Get swap quote
const quote = await agent.tools.getSwapQuote({
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: '1',
  chain: 'ethereum',
});

// Execute swap
const swap = await agent.tools.executeSwap({
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: '1',
  chain: 'ethereum',
  slippage: 0.5, // 0.5%
});
```

### Cross-Chain Bridging

```typescript
// Get bridge quote
const bridgeQuote = await agent.tools.getBridgeQuote({
  token: 'USDC',
  amount: '1000',
  fromChain: 'ethereum',
  toChain: 'arbitrum',
});

// Execute bridge
const bridge = await agent.tools.executeBridge({
  token: 'USDC',
  amount: '1000',
  fromChain: 'ethereum',
  toChain: 'arbitrum',
});
```

### DeFi Operations

```typescript
// Stake tokens
const stake = await agent.tools.stake({
  protocol: 'lido',
  token: 'ETH',
  amount: '10',
});

// Lend tokens
const lend = await agent.tools.lend({
  protocol: 'aave',
  token: 'USDC',
  amount: '10000',
  chain: 'ethereum',
});

// Get yield opportunities
const yields = await agent.tools.getYieldOpportunities({
  token: 'USDC',
  minApy: 5,
  chains: ['ethereum', 'arbitrum', 'base'],
});
```

### Gas & Transaction Management

```typescript
// Estimate gas
const gas = await agent.tools.estimateGas({
  to: '0x...',
  data: '0x...',
  chain: 'ethereum',
});

// Simulate transaction
const simulation = await agent.tools.simulateTransaction({
  to: '0x...',
  data: '0x...',
  value: '1000000000000000000',
  chain: 'ethereum',
});
```

## Configuration

```typescript
const agent = createUCAI({
  name: 'MyCryptoAgent',
  
  // Supported chains (CAIP-2 format)
  chains: ['eip155:1', 'eip155:42161'],
  
  // Enabled capabilities
  capabilities: ['swap', 'bridge', 'transfer', 'stake', 'lend'],
  
  // RPC configuration
  rpc: {
    ethereum: process.env.ETH_RPC_URL,
    arbitrum: process.env.ARB_RPC_URL,
  },
  
  // Risk parameters
  risk: {
    maxSlippage: 0.5,     // 0.5%
    maxGasPrice: 100,     // 100 gwei
    requireSimulation: true,
  },
  
  // Execution mode
  mode: 'simulation', // 'simulation' | 'execution'
});
```

## Available Tools

| Tool | Description |
|------|-------------|
| `getBalance` | Get token balance for address |
| `getPrice` | Get current token price |
| `transfer` | Transfer tokens |
| `getSwapQuote` | Get DEX swap quote |
| `executeSwap` | Execute token swap |
| `getBridgeQuote` | Get cross-chain bridge quote |
| `executeBridge` | Execute cross-chain bridge |
| `stake` | Stake tokens in protocols |
| `unstake` | Unstake tokens |
| `lend` | Supply tokens to lending protocols |
| `borrow` | Borrow from lending protocols |
| `repay` | Repay borrowed tokens |
| `estimateGas` | Estimate transaction gas |
| `simulateTransaction` | Simulate transaction execution |
| `getYieldOpportunities` | Find yield opportunities |
| `getPortfolio` | Get portfolio overview |

## Security

- All transactions require explicit approval
- Simulation mode enabled by default
- Private keys never transmitted
- Full audit trail for operations

## License

Apache-2.0
