# MCP Integration Quick Start

> Ethically integrate community MCP servers with full attribution

## Prerequisites

```bash
# Set GitHub token for API access
export GITHUB_TOKEN=your_token_here

# Get token at: https://github.com/settings/tokens
# Required scopes: public_repo (read-only is fine)
```

## Workflow

### 1️⃣ Discover

Find high-quality MCP servers in crypto/web3/defi space:

```bash
npm run discover:mcp-servers
```

**Output:** `INTEGRATION_CANDIDATES.md` with ranked list

**Filters automatically applied:**
- ✅ Compatible license (MIT/Apache/BSD)
- ✅ Active development (< 6 months old)
- ✅ Minimum stars/community traction
- ✅ Crypto/Web3/DeFi focused

### 2️⃣ Verify

Check specific repository before integration:

```bash
npm run verify:license -- https://github.com/owner/repo
```

**Checks:**
- License compatibility
- Attribution requirements
- Patent clauses
- Commercial use permissions

**Exit codes:**
- `0` = Compatible, safe to integrate
- `1` = Incompatible or missing license

### 3️⃣ Integrate

Add as git subtree (preserves full history):

```bash
npm run add:subtree -- https://github.com/owner/repo project-name
```

**This:**
- Verifies license first
- Adds code to `packages/integrations/project-name`
- Preserves git history and authorship
- Displays next steps

### 4️⃣ Attribute

Add to third-party notices:

```bash
npm run verify:license -- https://github.com/owner/repo --template
```

**Generates:**
- Full license text
- Copyright notices
- Source attribution
- Appends to `THIRD_PARTY_NOTICES.md`

**Manual step:** Edit and verify the attribution is complete

### 5️⃣ Adapt (Optional)

Create x402-enhanced wrapper:

```typescript
// packages/integrations/project-name/adapter.ts
import { MCPServerAdapter } from '../adapter.js';

export class ProjectAdapter extends MCPServerAdapter {
  constructor() {
    super({
      name: 'universal-crypto-project',
      version: '1.0.0',
      originalSource: {
        name: 'Original Project',
        url: 'https://github.com/owner/repo',
        author: '@author',
        license: 'MIT'
      }
    });
  }
  
  // Implement required methods
}
```

### 6️⃣ Audit

Check compliance before committing:

```bash
# Check all integrations have attribution
npm run update:attributions

# Audit all licenses (npm + integrations)
npm run audit:licenses
```

**Output:**
- ✅ All compliant
- ⚠️ Needs review
- ❌ Compliance issues

## Common Tasks

### Find DeFi-specific servers

```bash
npm run discover:mcp-servers -- --topic=defi
```

### Find by minimum stars

```bash
npm run discover:mcp-servers -- --min-stars=100
```

### Update existing subtree

```bash
cd packages/integrations/project-name
git subtree pull --prefix=packages/integrations/project-name \
  https://github.com/owner/repo main --squash
```

### Generate license report

```bash
npm run licenses > LICENSE_REPORT.txt
```

## What Gets Added

```
packages/integrations/
└── project-name/
    ├── ORIGINAL_LICENSE    ← Required: Full original license
    ├── adapter.ts          ← Optional: x402 enhancements
    ├── README.md          ← From original project
    └── ...                ← All original files
```

```
THIRD_PARTY_NOTICES.md      ← Required: Attribution
```

```
docs/
└── INTEGRATION_STRATEGY.md ← Reference docs
```

## Value We Add

Our integrations enhance original projects with:

1. **x402 Payments** - Crypto payment layer for any MCP tool
2. **Rate Limiting** - Tiered access control
3. **Caching** - Redis/memory caching
4. **Analytics** - Usage tracking and revenue reporting
5. **Clustering** - Multi-worker load balancing
6. **Monitoring** - Health checks and metrics
7. **Unified API** - Consistent interface across servers

## License Requirements by Type

### MIT License ✅

**Requirements:**
- Include copyright notice
- Include license text

**Allows:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

### Apache 2.0 ✅

**Requirements:**
- Include copyright notice
- Include license text
- Include NOTICE file (if present)
- State changes made

**Allows:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Patent grant protection

### BSD 2/3-Clause ✅

**Requirements:**
- Include copyright notice
- Include license text

**Allows:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution

### GPL ❌

**NOT COMPATIBLE**
- Viral copyleft
- Requires derivatives to be GPL
- Conflicts with commercial use

## Troubleshooting

### "GITHUB_TOKEN not set"

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### "License verification failed"

The project either:
- Has no license (cannot integrate)
- Has incompatible license (GPL, proprietary, NC)
- License file not detected (add manually)

### "Rate limit exceeded"

GitHub API limits:
- Without token: 60 requests/hour
- With token: 5000 requests/hour

Wait or use authenticated token.

### "Subtree conflict"

```bash
# Remove and re-add
rm -rf packages/integrations/project-name
npm run add:subtree -- https://github.com/owner/repo project-name
```

## Best Practices

✅ **Do:**
- Verify license before any integration
- Include full attribution and copyright
- Document integration in README
- Contribute improvements upstream
- Keep original author credits visible
- Update subtrees regularly

❌ **Don't:**
- Remove or modify copyright notices
- Claim original authorship
- Hide source of integrated code
- Violate license terms
- Integrate GPL/copyleft code
- Forget to update THIRD_PARTY_NOTICES.md

## Example: Complete Integration

```bash
# 1. Discover servers
npm run discover:mcp-servers
# Review INTEGRATION_CANDIDATES.md

# 2. Pick one and verify
npm run verify:license -- https://github.com/awesome/defi-mcp
# Shows: MIT License, compatible ✅

# 3. Add as subtree
npm run add:subtree -- https://github.com/awesome/defi-mcp awesome-defi
# Code added to packages/integrations/awesome-defi

# 4. Add attribution
npm run verify:license -- https://github.com/awesome/defi-mcp --template
# Appended to THIRD_PARTY_NOTICES.md

# 5. Create adapter (optional)
cat > packages/integrations/awesome-defi/adapter.ts << 'EOF'
import { MCPServerAdapter } from '../adapter.js';
export class AwesomeDefiAdapter extends MCPServerAdapter {
  // Implementation
}
EOF

# 6. Audit before commit
npm run audit:licenses
# Shows: All compliant ✅

# 7. Commit
git add .
git commit -m "feat: integrate awesome-defi MCP server with proper attribution"
```

## Resources

- **Strategy Guide:** [docs/INTEGRATION_STRATEGY.md](../docs/INTEGRATION_STRATEGY.md)
- **Integrations README:** [packages/integrations/README.md](../packages/integrations/README.md)
- **Third-Party Notices:** [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)
- **Open Source Guide:** https://opensource.guide/
- **Choose a License:** https://choosealicense.com/

## Support

Questions? Open an issue with label `integration`.

---

**Building on community work, the right way! 🤝**
