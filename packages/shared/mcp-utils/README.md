# MCP Utils

MCP helper utilities for the Universal Crypto MCP ecosystem.

## Installation

```bash
pnpm add @universal-crypto-mcp/mcp-utils
```

## Usage

```typescript
import { defineTool, textResult, jsonResult, errorResult } from '@universal-crypto-mcp/mcp-utils';
import { z } from 'zod';

const myTool = defineTool(
  'my-tool',
  'A custom tool',
  z.object({
    input: z.string(),
  }),
  async (input) => {
    return jsonResult({ result: input.input });
  }
);
```

## License

Apache-2.0
