# MCP Server Integration Strategy

> Building on the community ecosystem while maintaining proper attribution

---

## Philosophy

We believe in **building on top of** excellent open source work, not hiding it. When we integrate external MCP servers, we:

1. ✅ **Preserve full attribution** to original authors
2. ✅ **Comply with all license terms**
3. ✅ **Document our integrations clearly**
4. ✅ **Contribute improvements back upstream**
5. ✅ **Build value through aggregation and interoperability**

---

## Integration Methods

### Method 1: Git Subtree (Recommended)

**When to use:** For MIT/Apache licensed projects you want to include directly

```bash
# Add as subtree
git subtree add --prefix=packages/integrations/projectname \
  https://github.com/original/repo main --squash

# Update later
git subtree pull --prefix=packages/integrations/projectname \
  https://github.com/original/repo main --squash
```

**Required:** Add entry to `THIRD_PARTY_NOTICES.md`

### Method 2: Adapter Pattern

**When to use:** For projects you want to wrap with additional functionality

```typescript
// packages/integrations/wrapper-name/adapter.ts
import { OriginalServer } from 'external-package';

/**
 * Adapter for [Project Name](https://github.com/original/repo)
 * 
 * Original Author: @username
 * License: MIT
 * 
 * This adapter provides:
 * - x402 payment integration
 * - Rate limiting
 * - Unified API surface
 */
export class EnhancedOriginalServer {
  private upstream: OriginalServer;
  
  constructor() {
    this.upstream = new OriginalServer();
  }
  
  // Enhanced methods that add our value
}
```

### Method 3: Package Dependencies

**When to use:** For well-maintained packages that don't need modification

```json
{
  "dependencies": {
    "excellent-mcp-server": "^1.0.0"
  }
}
```

---

## Discovery Process

### Finding Quality MCP Servers

```bash
# Run discovery script
npm run discover:mcp-servers

# Filters applied:
# - Active development (commits in last 6 months)
# - Compatible license (MIT, Apache 2.0, BSD)
# - GitHub stars > 50
# - Crypto/Web3/DeFi related
```

### Evaluation Criteria

| Criteria | Weight | Notes |
|----------|--------|-------|
| License Compatibility | ⚠️ Must | MIT, Apache 2.0, BSD only |
| Code Quality | ⭐⭐⭐ | Well-tested, documented |
| Activity | ⭐⭐ | Recent commits |
| Community | ⭐ | Stars, forks, contributors |
| Functionality | ⭐⭐⭐ | Fills a gap in our ecosystem |

---

## Attribution Requirements

### For Git Subtrees

Create `packages/integrations/projectname/ORIGINAL_LICENSE` containing:

```
This code is originally from: https://github.com/original/repo
Original Author: @username
License: MIT

[Full license text]
```

### For Adapters

In every file that uses external code:

```typescript
/**
 * Based on [Project Name](https://github.com/original/repo)
 * Original License: MIT
 * Original Author: @username
 * 
 * Enhancements by Universal Crypto MCP team
 */
```

### In Documentation

```markdown
## Integrated Projects

This project builds on excellent work from:

- **[Project Name](https://github.com/original/repo)** by @author - Description of what we use it for
- **[Another Project](https://github.com/another/repo)** by @author - Description
```

---

## Value Addition

Our value comes from:

1. **Aggregation** - One place to access multiple MCP servers
2. **Interoperability** - Unified API surface across servers
3. **Payment Integration** - x402 monetization layer
4. **Enterprise Features** - Clustering, caching, monitoring
5. **Developer Experience** - Better docs, examples, templates

---

## Contribution Guidelines

### When We Modify External Code

1. **Fork the original repo** on GitHub
2. **Make improvements** in our fork with clear commits
3. **Open PR to upstream** with our changes
4. **Document in changelog** what we contributed back

### Tracking Upstream Changes

```bash
# Check for updates
git fetch subtree-remote

# Review changes
git log HEAD..subtree-remote/main

# Update if appropriate
git subtree pull --prefix=packages/integrations/projectname \
  https://github.com/original/repo main --squash
```

---

## License Verification

Before integrating any project:

```bash
# Run verification
npm run verify:license -- https://github.com/project/repo

# Checks:
# ✓ License file exists
# ✓ License is compatible (MIT/Apache/BSD)
# ✓ No conflicting sub-licenses
# ✓ Attribution requirements documented
```

---

## Example Integration

### Step-by-Step: Adding a New MCP Server

1. **Discover**
   ```bash
   npm run discover:mcp-servers -- --topic=defi
   ```

2. **Verify License**
   ```bash
   npm run verify:license -- https://github.com/author/awesome-defi-mcp
   ```

3. **Choose Integration Method**
   - Direct code → Subtree
   - Wrapper → Adapter
   - No modification → Dependency

4. **Add Integration**
   ```bash
   # Example: Subtree
   git subtree add --prefix=packages/integrations/awesome-defi \
     https://github.com/author/awesome-defi-mcp main --squash
   ```

5. **Add Attribution**
   ```bash
   # Update THIRD_PARTY_NOTICES.md
   npm run add:attribution -- awesome-defi
   ```

6. **Create Adapter (if needed)**
   ```typescript
   // packages/integrations/awesome-defi/adapter.ts
   export class AwesomeDefiAdapter extends X402MCP {
     // Add x402 payment layer
   }
   ```

7. **Document**
   ```bash
   # Add to README and docs
   echo "- [Awesome DeFi MCP](https://github.com/author/awesome-defi-mcp)" >> docs/integrations.md
   ```

8. **Test**
   ```bash
   npm run test:integration -- awesome-defi
   ```

---

## Community Engagement

### How We Give Back

- 🐛 **Bug Reports** - Report issues we find to upstream
- 🔧 **Pull Requests** - Contribute fixes and features
- 📚 **Documentation** - Improve docs and examples
- 💬 **Discussion** - Participate in community forums
- ⭐ **Recognition** - Star repos we integrate, mention in posts

### Crediting Contributors

In our README:

```markdown
## Built With

This project integrates and builds upon:

- [Project A](link) - DeFi protocol integration (MIT)
- [Project B](link) - Market data feeds (Apache 2.0)
- [Project C](link) - Wallet management (BSD-3)

Special thanks to all contributors of these projects! ⭐
```

---

## Legal Compliance

### MIT License Requirements

✅ **Must include** copyright notice and license text
✅ **Can** modify and redistribute
✅ **Can** use commercially
✅ **No** warranty or liability

### Apache 2.0 Requirements

✅ **Must include** copyright notice and license text
✅ **Must include** NOTICE file if it exists
✅ **Must state** changes made
✅ **Patent grant** protection

### What NOT to Do

❌ Remove copyright notices
❌ Claim original authorship
❌ Hide the source of integrated code
❌ Violate license terms
❌ Integrate GPL code (viral license)

---

## Automation

All integration tasks are automated:

```bash
# Discovery
npm run discover:mcp-servers

# License check
npm run verify:license -- <repo-url>

# Add subtree
npm run add:subtree -- <repo-url> <name>

# Update attributions
npm run update:attributions

# Check compliance
npm run audit:licenses
```

---

## Questions?

- Read: [Open Source Guide](https://opensource.guide/)
- Ask: Open an issue for integration questions
- Review: Check existing integrations as examples

**Remember: Proper attribution isn't just legal compliance—it's being a good community member! 🤝**
