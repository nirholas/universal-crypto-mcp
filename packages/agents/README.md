# 🤖 Agents

AI Agent frameworks and implementations for Universal Crypto MCP.

## Overview

This package contains production-ready AI agents optimized for crypto and DeFi operations. Each agent is designed to work with the Model Context Protocol (MCP) and can be deployed standalone or as part of a larger system.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `agenti/` | General-purpose agent framework | ✅ Production |
| `ucai/` | Universal Crypto AI agent with multi-chain support | ✅ Production |
| `defi-agents/` | Specialized DeFi agents (yield, trading, portfolio) | ✅ Production |
| `library/` | 505+ curated AI agent definitions | ✅ Production |

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all agents
pnpm -r build

# Run tests
pnpm -r test
```

## Agent Capabilities

### Universal Crypto AI (UCAI)
- Multi-chain wallet management (60+ networks)
- Token swaps via DEX aggregators
- Cross-chain bridging
- Gas estimation and optimization
- Transaction simulation

### DeFi Agents
- **Yield Agent**: Finds and executes optimal yield strategies
- **Trading Agent**: Automated swap and arbitrage execution
- **Portfolio Agent**: Tracks and rebalances multi-chain portfolios
- **Risk Agent**: Monitors positions and liquidation risks

### Agent Library
- 505+ pre-configured agent definitions
- 18 language translations
- Categories: DeFi, Development, Content, Business, Education
- Universal JSON format compatible with any AI platform

## Architecture

```
agents/
├── agenti/          # Core agent framework
│   ├── src/         # TypeScript source
│   └── dist/        # Compiled output
├── ucai/            # Universal Crypto AI
│   ├── src/         # Agent implementation
│   └── tools/       # MCP tools
├── defi-agents/     # DeFi specialists
│   ├── yield/       # Yield optimization
│   ├── trading/     # Trading automation
│   └── portfolio/   # Portfolio management
└── library/         # Agent definitions
    ├── src/agents/  # 505+ agents
    ├── schema/      # JSON schemas
    └── docs/        # Documentation
```

## Integration with MCP

All agents expose tools via the Model Context Protocol:

```typescript
import { createMCPServer } from '@universal-crypto-mcp/agent-ucai';

const server = createMCPServer({
  agents: ['yield', 'trading', 'portfolio'],
  chains: ['ethereum', 'arbitrum', 'base'],
});

server.listen(3000);
```

## Configuration

```typescript
// Agent configuration
const config = {
  // Supported chains (CAIP-2 format)
  chains: ['eip155:1', 'eip155:42161', 'eip155:8453'],
  
  // Enabled capabilities
  capabilities: ['swap', 'bridge', 'lend', 'stake'],
  
  // Risk parameters
  maxSlippage: 0.5,    // 0.5%
  maxGasPrice: 100,    // 100 gwei
  
  // Execution mode
  mode: 'simulation',  // 'simulation' | 'execution'
};
```

## Security

- All agents operate in simulation mode by default
- Transaction signing requires explicit user approval
- Private keys never leave the local environment
- Full audit trail for all operations

## Related

- [Universal Crypto MCP](../../) - Main repository
- [x402 Payments](../../x402/) - AI-native payment protocol
- [DeFi Protocols](../defi/protocols/) - Protocol integrations

## License

Apache-2.0
