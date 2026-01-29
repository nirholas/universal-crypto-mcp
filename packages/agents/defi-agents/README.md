# DeFi Agents

DeFi-focused AI agents for the Universal Crypto MCP ecosystem.

## Features

- **Portfolio Management** - Track and manage multi-chain portfolios
- **Yield Optimization** - Find and execute yield farming strategies
- **Trading Automation** - Automated swap and bridge execution
- **Analytics** - On-chain analytics and insights

## Installation

```bash
pnpm add @universal-crypto-mcp/agent-defi
```

## Usage

```typescript
import { createDeFiAgent, createYieldAgent } from '@universal-crypto-mcp/agent-defi';

// Create a custom DeFi agent
const agent = createDeFiAgent({
  name: 'MyDeFiAgent',
  chains: ['eip155:1', 'eip155:42161', 'eip155:8453'],
  protocols: ['uniswap', 'aave', 'lido'],
  capabilities: ['swap', 'lend', 'stake'],
});

// Create a specialized yield agent
const yieldAgent = createYieldAgent('YieldHunter', ['eip155:1', 'eip155:42161']);
```

## Related

For the full AI agents library with curated agent definitions, see:
- [packages/defi/agents](../../defi/agents) - AI Agents Library

## License

Apache-2.0
