# UCAI MCP Server

Universal Crypto AI agent for the Universal Crypto MCP ecosystem.

## Installation

```bash
pnpm add @universal-crypto-mcp/agent-ucai
```

## Usage

```typescript
import { createUCAI } from '@universal-crypto-mcp/agent-ucai';

const agent = createUCAI({
  name: 'MyCryptoAgent',
  chains: ['eip155:1', 'eip155:42161'],
  capabilities: ['swap', 'bridge', 'transfer']
});
```

## License

Apache-2.0
