# MCP Server Monetization

Complete guide to monetizing Model Context Protocol (MCP) servers with x402-deploy.

---

## What are MCP Servers?

MCP (Model Context Protocol) servers provide tools for AI assistants like Claude. With x402-deploy, you can monetize these tools - charging per tool call.

### Example Use Cases

- **Code analysis tools** - Charge per file analyzed
- **Web search tools** - Charge per search query
- **Data lookup tools** - Charge per data request
- **AI processing tools** - Charge per generation

---

## Quick Start

### 1. Create an MCP Server

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "my-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define your tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "analyze_code",
      description: "Analyze code for bugs and improvements",
      inputSchema: {
        type: "object",
        properties: {
          code: { type: "string", description: "Code to analyze" },
          language: { type: "string", description: "Programming language" }
        },
        required: ["code"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "analyze_code") {
    // Your tool logic here
    const analysis = await analyzeCode(args.code, args.language);
    return { content: [{ type: "text", text: analysis }] };
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 2. Initialize x402

```bash
cd my-mcp-server
x402-deploy init
```

The CLI will:
1. Detect MCP server project type
2. Create wallet for receiving payments
3. Set up per-tool pricing
4. Generate `x402.config.json`

### 3. Configure Pricing

```json
{
  "name": "my-tools",
  "version": "1.0.0",
  "project": {
    "type": "mcp-server",
    "language": "typescript",
    "entryPoint": "src/server.ts"
  },
  "payment": {
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "network": "eip155:8453",
    "token": "USDC"
  },
  "pricing": {
    "model": "per-call",
    "routes": {
      "tools/list": "$0",
      "tools/call:analyze_code": "$0.05",
      "tools/call:search_web": "$0.02",
      "tools/call:*": "$0.01"
    }
  }
}
```

### 4. Deploy

```bash
x402-deploy deploy
```

### 5. Share Your Server

Your MCP server is now live! Share the URL:

```bash
# Add to Claude Desktop config
{
  "mcpServers": {
    "my-tools": {
      "url": "https://my-tools.railway.app",
      "payment": {
        "wallet": "0xYourClientWallet",
        "network": "eip155:8453"
      }
    }
  }
}
```

---

## MCP Wrapper Details

x402-deploy wraps your MCP server with a payment layer:

```
┌─────────────────────────────────────────────────┐
│                 Client (Claude)                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Request: tools/call (with payment header)   │
│                     ↓                           │
│  2. x402 Gateway: Verify payment                │
│                     ↓                           │
│  3. Your MCP Server: Execute tool               │
│                     ↓                           │
│  4. Response: Tool result                       │
│                     ↓                           │
│  5. Analytics: Track payment & usage            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### How Pricing Works for MCP

| Request Type | Pattern | Typical Price |
|--------------|---------|---------------|
| List tools | `tools/list` | Free |
| Call specific tool | `tools/call:tool_name` | $0.01-$1.00 |
| Any tool call | `tools/call:*` | Fallback price |
| Resources | `resources/read` | $0.001-$0.10 |
| Prompts | `prompts/get` | $0.001-$0.05 |

---

## Programmatic Wrapper

For advanced use cases, wrap programmatically:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { wrapMCPServer } from "@nirholas/x402-deploy/gateway";

// Your original server
const server = new Server(
  { name: "my-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Set up your handlers
server.setRequestHandler("tools/list", async () => ({
  tools: [/* your tools */]
}));

server.setRequestHandler("tools/call", async (request) => {
  // Your tool implementation
});

// Wrap with x402 payment gateway
const wrappedServer = wrapMCPServer(server, {
  wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  network: "eip155:8453",
  facilitator: "https://x402.org/facilitator",
  pricing: {
    model: "per-call",
    routes: {
      "tools/list": "$0",
      "tools/call:analyze_code": "$0.05",
      "tools/call:*": "$0.01"
    }
  },
  analytics: {
    enabled: true,
    webhooks: ["https://myapp.com/webhook"]
  }
});

// Use wrapped server
const transport = new HttpServerTransport({ port: 3000 });
await wrappedServer.connect(transport);
```

---

## HTTP Transport for Paid MCP

For paid MCP servers, you need HTTP transport (not stdio):

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { HttpServerTransport } from "@nirholas/x402-deploy/mcp";

const server = new Server(
  { name: "my-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Your handlers...

// HTTP transport with x402
const transport = new HttpServerTransport({
  port: 3000,
  x402: {
    enabled: true,
    wallet: "0x...",
    network: "eip155:8453",
    pricing: {
      "tools/call:*": "$0.01"
    }
  }
});

await server.connect(transport);
console.log("MCP server running on http://localhost:3000");
```

---

## Claude Desktop Integration

### Client Configuration

Clients need to configure payment in Claude Desktop:

**claude_desktop_config.json:**
```json
{
  "mcpServers": {
    "my-tools": {
      "url": "https://my-tools.railway.app",
      "transport": "http",
      "payment": {
        "enabled": true,
        "wallet": "0xClientWalletAddress",
        "privateKey": "env:MCP_PAYMENT_KEY",
        "network": "eip155:8453",
        "autoApprove": {
          "maxPerCall": "$0.10",
          "maxPerHour": "$5.00"
        }
      }
    }
  }
}
```

### Payment Flow

1. Client calls tool
2. Server returns `402 Payment Required` with price
3. Client signs payment
4. Client retries with payment header
5. Server verifies and executes
6. Result returned to client

---

## Pricing Strategies for MCP

### By Tool Complexity

```json
{
  "pricing": {
    "routes": {
      "tools/list": "$0",
      "tools/call:get_time": "$0.001",
      "tools/call:search_web": "$0.02",
      "tools/call:analyze_code": "$0.05",
      "tools/call:generate_image": "$0.25",
      "tools/call:train_model": "$1.00"
    }
  }
}
```

### By Resource Usage

```json
{
  "pricing": {
    "model": "dynamic",
    "basePrice": "$0.001",
    "factors": {
      "inputSize": {
        "perKb": "$0.0001"
      },
      "computeTime": {
        "perSecond": "$0.001"
      }
    }
  }
}
```

### Free Tier + Premium

```json
{
  "pricing": {
    "model": "tiered",
    "tiers": [
      { "upTo": 100, "price": "$0" },
      { "upTo": 1000, "price": "$0.01" },
      { "upTo": null, "price": "$0.005" }
    ],
    "resetPeriod": "daily"
  }
}
```

---

## Discovery for MCP Servers

Register your MCP server for AI agents to discover:

```json
{
  "discovery": {
    "enabled": true,
    "autoRegister": true,
    "type": "mcp-server",
    "instructions": "Code analysis tools. Analyze code for bugs, security issues, and improvements.",
    "tools": [
      {
        "name": "analyze_code",
        "description": "Analyze code for issues",
        "price": "$0.05"
      },
      {
        "name": "suggest_fixes",
        "description": "Suggest code improvements",
        "price": "$0.03"
      }
    ]
  }
}
```

Your server will appear on [x402scan.com](https://x402scan.com) for AI agents to discover.

---

## Example: Code Analysis MCP Server

Complete example of a monetized code analysis server:

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { HttpServerTransport } from "@nirholas/x402-deploy/mcp";
import { analyzeWithGPT } from "./analyzer.js";

const server = new Server(
  { name: "code-analyzer", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "analyze_code",
      description: "Analyze code for bugs, security issues, and style problems",
      inputSchema: {
        type: "object",
        properties: {
          code: { type: "string", description: "Source code to analyze" },
          language: { type: "string", description: "Programming language" },
          checks: {
            type: "array",
            items: { type: "string" },
            description: "Types of checks: bugs, security, style, performance"
          }
        },
        required: ["code"]
      }
    },
    {
      name: "suggest_refactor",
      description: "Suggest refactoring improvements",
      inputSchema: {
        type: "object",
        properties: {
          code: { type: "string" },
          goal: { type: "string", description: "Refactoring goal" }
        },
        required: ["code"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "analyze_code": {
      const result = await analyzeWithGPT(args.code, args.language, args.checks);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    }
    
    case "suggest_refactor": {
      const suggestions = await suggestRefactor(args.code, args.goal);
      return {
        content: [{
          type: "text",
          text: suggestions
        }]
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start with x402 payment gateway
const transport = new HttpServerTransport({
  port: process.env.PORT || 3000,
  x402: {
    enabled: true,
    config: "./x402.config.json"
  }
});

await server.connect(transport);
console.log("Code analyzer MCP server running with x402 payments");
```

**x402.config.json:**
```json
{
  "name": "code-analyzer",
  "version": "1.0.0",
  "project": {
    "type": "mcp-server",
    "language": "typescript",
    "entryPoint": "src/server.ts",
    "buildCommand": "npm run build",
    "startCommand": "npm start"
  },
  "payment": {
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "network": "eip155:8453",
    "token": "USDC"
  },
  "pricing": {
    "model": "per-call",
    "routes": {
      "tools/list": "$0",
      "tools/call:analyze_code": "$0.05",
      "tools/call:suggest_refactor": "$0.03"
    }
  },
  "discovery": {
    "enabled": true,
    "instructions": "Professional code analysis tools. Analyze code for bugs, security vulnerabilities, style issues, and get refactoring suggestions.",
    "tags": ["code", "analysis", "security", "refactoring"]
  }
}
```

---

## Testing MCP Servers

### Local Testing

```bash
# Start server locally
npm run dev

# Test tool listing (free)
curl http://localhost:3000/mcp -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Test paid tool (will return 402)
curl http://localhost:3000/mcp -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"analyze_code","arguments":{"code":"const x = 1"}}}'
```

### Test with Payment

```bash
# Use x402-deploy test command
x402-deploy test --tool analyze_code --args '{"code":"const x = 1"}'
```

---

## Best Practices

### 1. Keep tools/list Free

Always make tool discovery free:
```json
{
  "routes": {
    "tools/list": "$0"
  }
}
```

### 2. Price by Value

Charge based on value delivered:
- Simple lookups: $0.001-$0.01
- API calls: $0.01-$0.05
- AI processing: $0.05-$0.50
- Heavy compute: $0.50-$5.00

### 3. Document Prices

Include pricing in tool descriptions:
```typescript
{
  name: "analyze_code",
  description: "Analyze code for issues ($0.05/call)"
}
```

### 4. Handle Errors Gracefully

Don't charge for errors:
```typescript
server.setRequestHandler("tools/call", async (request) => {
  try {
    // Tool logic
    return { content: [{ type: "text", text: result }] };
  } catch (error) {
    // Error response - payment should be refunded
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});
```

---

## Next Steps

- [Deployment Platforms](deployment.md) - Deploy your MCP server
- [Pricing Strategies](pricing.md) - Advanced pricing
- [Dashboard Guide](dashboard.md) - Monitor earnings

---

[← Back to Docs](../README.md)
