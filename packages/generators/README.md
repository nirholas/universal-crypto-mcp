# ⚙️ Generators MCP Servers

> Code generators, converters, and tooling for building MCP servers

## Overview

This package provides meta-tools for creating and discovering MCP servers. Convert ABIs to MCP tools, transform GitHub repos into MCP servers, and discover available tools.

## Available Servers

### 🔧 ABI to MCP
Convert smart contract ABIs into MCP tools:
- Automatic tool generation from ABI
- Type-safe parameter handling
- Multi-contract support

### 📦 Repo to MCP
Transform GitHub repositories into MCP servers:
- Analyze repo structure
- Generate tool definitions
- Create documentation

### 📚 Doc Extractor
Extract documentation for LLM consumption:
- Parse markdown and code
- Generate llms.txt
- Create context summaries

### 📋 Registry
Tool registry and catalog:
- Lyra Registry integration
- Tool metadata management
- Version tracking

### 🔍 Discovery
Tool discovery and search:
- Find relevant MCP tools
- Semantic search
- Category browsing

## Installation

```bash
# From workspace root
pnpm install

# Build generator packages
pnpm --filter "@nirholas/crypto-generators" build
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "abi-to-mcp": {
      "command": "node",
      "args": ["packages/generators/abi-to-mcp/dist/index.js"]
    },
    "tool-discovery": {
      "command": "node",
      "args": ["packages/generators/discovery/dist/index.js"]
    }
  }
}
```

## Available Tools

### ABI to MCP Tools
| Tool | Description |
|------|-------------|
| `generate_from_abi` | Generate MCP tools from ABI |
| `parse_abi` | Parse and analyze ABI |
| `fetch_verified_abi` | Fetch ABI from block explorer |

### Repo to MCP Tools
| Tool | Description |
|------|-------------|
| `analyze_repo` | Analyze GitHub repo structure |
| `generate_mcp_server` | Generate MCP server code |
| `create_tool_definitions` | Create tool definitions |

### Doc Extractor Tools
| Tool | Description |
|------|-------------|
| `extract_docs` | Extract documentation |
| `generate_llms_txt` | Create llms.txt file |
| `summarize_codebase` | Summarize code for LLMs |

### Registry Tools
| Tool | Description |
|------|-------------|
| `register_tool` | Register a tool |
| `update_tool` | Update tool metadata |
| `list_tools` | List registered tools |

### Discovery Tools
| Tool | Description |
|------|-------------|
| `search_tools` | Search for tools |
| `discover_tools` | Discover relevant tools |
| `get_tool_info` | Get tool details |

## Example: ABI to MCP

```typescript
// Input: Uniswap V2 Router ABI
const abi = await fetchVerifiedAbi('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');

// Output: MCP tools
const tools = generateFromAbi({
  abi,
  contractName: 'UniswapV2Router',
  functions: ['swapExactTokensForTokens', 'getAmountsOut'],
});

// Result:
// - swap_exact_tokens_for_tokens tool
// - get_amounts_out tool
// With proper Zod schemas and descriptions
```

## Example: Repo to MCP

```typescript
// Analyze a GitHub repo
const analysis = await analyzeRepo({
  owner: 'uniswap',
  repo: 'v3-core',
});

// Generate MCP server
const server = await generateMcpServer({
  analysis,
  outputDir: './generated-server',
  name: '@my-org/uniswap-mcp',
});
```

## Architecture

```
packages/generators/
├── abi-to-mcp/         # ABI → MCP converter
│   ├── src/
│   │   ├── parser.ts   # ABI parsing
│   │   ├── generator.ts # Tool generation
│   │   └── templates/  # Code templates
│   └── package.json
├── repo-to-mcp/        # GitHub → MCP converter
├── doc-extractor/      # Documentation extractor
├── registry/           # Tool registry (Lyra)
└── discovery/          # Tool discovery (Lyra)
```

## License

Apache-2.0

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
