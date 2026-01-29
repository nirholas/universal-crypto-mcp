# Agenti MCP Server

General-purpose AI agent framework for the Universal Crypto MCP ecosystem.

## Installation

```bash
pnpm add @universal-crypto-mcp/agent-agenti
```

## Quick Start

```typescript
import { createAgent, defineTools } from '@universal-crypto-mcp/agent-agenti';

const agent = createAgent({
  name: 'MyAgent',
  description: 'A custom AI agent',
  version: '1.0.0',
});

// Define custom tools
agent.addTools(defineTools({
  greet: {
    description: 'Greet a user',
    parameters: {
      name: { type: 'string', required: true },
    },
    handler: async ({ name }) => `Hello, ${name}!`,
  },
}));

// Start MCP server
agent.listen(3000);
```

## Features

### Tool Definition

```typescript
import { defineTools, z } from '@universal-crypto-mcp/agent-agenti';

const tools = defineTools({
  calculate: {
    description: 'Perform arithmetic operations',
    parameters: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    handler: async ({ operation, a, b }) => {
      switch (operation) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return a / b;
      }
    },
  },
});
```

### Resource Management

```typescript
agent.addResources({
  'config://settings': {
    name: 'Agent Settings',
    mimeType: 'application/json',
    read: async () => JSON.stringify({ mode: 'production' }),
  },
});
```

### Prompt Templates

```typescript
agent.addPrompts({
  'analyze-code': {
    name: 'Code Analysis',
    description: 'Analyze code for issues',
    arguments: [
      { name: 'code', required: true },
      { name: 'language', required: false },
    ],
    template: ({ code, language }) => `
      Analyze this ${language || 'code'} for potential issues:
      
      \`\`\`${language || ''}
      ${code}
      \`\`\`
    `,
  },
});
```

### Event Handling

```typescript
agent.on('tool:call', ({ tool, args }) => {
  console.log(`Tool called: ${tool}`, args);
});

agent.on('error', (error) => {
  console.error('Agent error:', error);
});
```

## Configuration

```typescript
const agent = createAgent({
  name: 'MyAgent',
  description: 'Agent description',
  version: '1.0.0',
  
  // Server options
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  
  // Logging
  logging: {
    level: 'info',
    format: 'json',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 60000,
    maxRequests: 100,
  },
});
```

## API Reference

### `createAgent(options)`

Create a new agent instance.

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Agent name |
| `description` | `string` | Agent description |
| `version` | `string` | Semantic version |
| `server` | `ServerOptions` | Server configuration |
| `logging` | `LoggingOptions` | Logging configuration |

### `agent.addTools(tools)`

Register tools with the agent.

### `agent.addResources(resources)`

Register resources with the agent.

### `agent.addPrompts(prompts)`

Register prompt templates.

### `agent.listen(port)`

Start the MCP server.

## License

Apache-2.0
