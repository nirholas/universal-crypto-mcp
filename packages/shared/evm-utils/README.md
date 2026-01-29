# EVM Utils

EVM helper utilities for the Universal Crypto MCP ecosystem.

## Installation

```bash
pnpm add @universal-crypto-mcp/evm-utils
```

## Usage

```typescript
import { createReadClient, getNativeBalance, formatNativeBalance } from '@universal-crypto-mcp/evm-utils';
import { mainnet } from 'viem/chains';

const client = createReadClient({
  chain: mainnet,
  rpcUrl: 'https://eth.llamarpc.com',
});

const balance = await getNativeBalance(client, '0x...');
console.log('Balance:', formatNativeBalance(balance), 'ETH');
```

## License

Apache-2.0
