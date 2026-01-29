# Shared Packages

Shared utilities and common code for the Universal Crypto MCP ecosystem.

## Packages

### mcp-utils

MCP helper utilities for building MCP servers and tools.

```bash
pnpm add @nirholas/crypto-shared-mcp-utils
```

Features:
- Tool definition helpers
- Resource definition helpers
- Prompt definition helpers
- Response formatting utilities

### evm-utils

EVM helper utilities for blockchain interactions.

```bash
pnpm add @nirholas/crypto-shared-evm-utils
```

Features:
- Client creation helpers (public and wallet clients)
- Balance utilities
- Transaction utilities
- Contract interaction helpers

## Usage

These packages are designed to be used internally by other packages in the monorepo, but can also be published for external use.

```typescript
// MCP Utils
import { defineTool, textResult, jsonResult } from '@nirholas/crypto-shared-mcp-utils';

// EVM Utils
import { createReadClient, getNativeBalance } from '@nirholas/crypto-shared-evm-utils';
```

## Development

```bash
# Build all shared packages
pnpm -r --filter "./packages/shared/*" build

# Run tests
pnpm -r --filter "./packages/shared/*" test
```

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## License

Apache-2.0
