# MCP Server Integrations

This directory contains adapters and integrations with third-party MCP servers from the community.

## Philosophy

We believe in **building on top of** excellent open source work, not hiding it. Every integration here:

- ✅ **Preserves full attribution** to original authors
- ✅ **Complies with all license terms**
- ✅ **Is documented with clear provenance**
- ✅ **Contributes improvements back upstream**

## Structure

```
packages/integrations/
├── adapter.ts              # Base adapter class
├── project-name/           # Integrated MCP server
│   ├── ORIGINAL_LICENSE    # Original project license
│   ├── adapter.ts          # x402-enhanced adapter
│   └── ...                 # Original project files
└── another-project/
    └── ...
```

## Adding Integrations

### 1. Discover Quality MCP Servers

```bash
# Find crypto/web3/defi MCP servers
npm run discover:mcp-servers

# Results saved to INTEGRATION_CANDIDATES.md
```

### 2. Verify License

```bash
# Check if license is compatible
npm run verify:license -- https://github.com/author/project

# Must be MIT, Apache 2.0, or BSD
```

### 3. Add as Subtree

```bash
# Add with git subtree (preserves history)
npm run add:subtree -- https://github.com/author/project project-name
```

### 4. Add Attribution

```bash
# Generate attribution template
npm run verify:license -- https://github.com/author/project --template

# Manually verify THIRD_PARTY_NOTICES.md is complete
```

### 5. Create Adapter (Optional)

If you want to add x402 payments or other enhancements:

```typescript
// packages/integrations/project-name/adapter.ts
import { MCPServerAdapter, createAttributionHeader } from '../adapter.js';

/**
 * ${createAttributionHeader({
 *   originalProject: 'Project Name',
 *   originalUrl: 'https://github.com/author/project',
 *   originalAuthor: '@author',
 *   originalLicense: 'MIT'
 * })}
 */
export class ProjectAdapter extends MCPServerAdapter {
  constructor() {
    super({
      name: 'universal-crypto-project-name',
      version: '1.0.0',
      originalSource: {
        name: 'Project Name',
        url: 'https://github.com/author/project',
        author: '@author',
        license: 'MIT'
      }
    });
  }

  protected getUpstreamTools() {
    return [
      // Define tools from original project
    ];
  }

  protected async executeUpstreamTool(name: string, args: any) {
    // Delegate to original implementation
  }
}
```

### 6. Test

```bash
# Test the integration
npm run test:integration -- project-name
```

## Audit Compliance

Check that all integrations have proper attribution:

```bash
# Audit all licenses
npm run audit:licenses

# Update attribution file
npm run update:attributions
```

## Integration Methods

### Method 1: Git Subtree (For Direct Integration)

**Use when:** You want to include the code directly and potentially modify it

**Pros:**
- Full control over the code
- Can make modifications
- Single repository

**Cons:**
- More complex to sync updates
- Need to track changes carefully

### Method 2: Adapter Pattern (For Wrapping)

**Use when:** You want to add features without modifying original code

**Pros:**
- Clean separation
- Easy to update upstream
- Clear value addition

**Cons:**
- Extra abstraction layer
- May duplicate some functionality

### Method 3: NPM Dependency (For Stable APIs)

**Use when:** Project is well-maintained and has stable API

**Pros:**
- Simplest to maintain
- Automatic updates
- No code duplication

**Cons:**
- Less control
- Depends on external publishing

## Value Addition

Our integrations add:

1. **x402 Payments** - Monetize any MCP tool with crypto payments
2. **Unified API** - Consistent interface across all integrations
3. **Rate Limiting** - Protect your resources
4. **Analytics** - Track usage and revenue
5. **Enterprise Features** - Clustering, caching, monitoring

## Contributing Back

When we improve integrated code:

1. **Fork** the original repo on GitHub
2. **Create PR** with our improvements
3. **Document** in changelog
4. **Credit** in commit messages

## Example Integrations

### DeFi Analytics MCP (Example)

```bash
# Discover
npm run discover:mcp-servers -- --topic=defi

# Verify
npm run verify:license -- https://github.com/example/defi-analytics-mcp

# Add
npm run add:subtree -- https://github.com/example/defi-analytics-mcp defi-analytics

# Attribution
npm run verify:license -- https://github.com/example/defi-analytics-mcp --template
```

## License Compliance

All integrations must use compatible licenses:

✅ **Compatible:**
- MIT License
- Apache License 2.0
- BSD 2-Clause
- BSD 3-Clause
- ISC License

❌ **Incompatible:**
- GPL (any version) - Viral copyleft
- AGPL - Viral copyleft
- Commercial/Proprietary
- CC BY-NC - Non-commercial

## Questions?

- **Discovery issues?** Check your GITHUB_TOKEN is set
- **License concerns?** Open an issue for legal review
- **Integration help?** See [docs/INTEGRATION_STRATEGY.md](../../docs/INTEGRATION_STRATEGY.md)
- **Want to contribute?** PRs welcome for new integrations!

---

**Remember: Proper attribution isn't just legal compliance—it's being a good community member! 🤝**
