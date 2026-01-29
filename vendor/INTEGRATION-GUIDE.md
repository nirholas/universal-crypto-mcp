# Vendor Integration Guide

This guide explains how to properly integrate third-party open source projects into Universal Crypto MCP.

## Philosophy

We believe in:
- **Respecting licenses** - Always comply with license terms
- **Proper attribution** - Give credit where credit is due
- **Contributing back** - Submit improvements upstream when possible
- **Transparency** - Be clear about what code comes from where

## Step-by-Step Integration Process

### 1. Verify License Compatibility

Before integrating:
```bash
# Check the project's license
cat path/to/project/LICENSE

# Verify it's MIT or compatible
# ✅ MIT
# ✅ BSD
# ✅ Apache 2.0
# ❌ GPL (not compatible with permissive licenses)
```

### 2. Create Vendor Directory

```bash
mkdir -p vendor/<project-name>
cd vendor/<project-name>
```

### 3. Clone or Copy Source

```bash
# Option A: Clone as subtree (recommended)
git subtree add --prefix vendor/<project-name> \
  https://github.com/original-author/project main --squash

# Option B: Copy relevant source files
cp -r /path/to/original/src/* ./
```

### 4. Preserve Original License

```bash
# Copy original LICENSE file
cp /path/to/original/LICENSE ./LICENSE

# Verify copyright notices in source files are intact
grep -r "Copyright" .
```

### 5. Create Attribution File

Create `ATTRIBUTION.md`:

```markdown
# Attribution

This project is based on/includes code from:

**Project**: [Original Project Name]  
**Original Author**: [Author Name]  
**License**: MIT  
**Repository**: https://github.com/original-author/project  
**Version**: [version or commit hash]  

## Copyright Notice

[Copy original copyright notice here]

## Modifications

The following modifications were made for Universal Crypto MCP integration:
- [List any changes made]

## Universal Crypto MCP Integration

Integrated into Universal Crypto MCP by Nicholas (github.com/nirholas)

## Original License

See LICENSE file for the full original license text.
```

### 6. Document Integration

Update the main `vendor/README.md` with project details.

### 7. Create Integration Layer

Create integration code in `src/integrations/<project-name>/`:

```typescript
/**
 * Integration wrapper for [Project Name]
 * 
 * Original project: https://github.com/original-author/project
 * License: MIT (see vendor/<project-name>/LICENSE)
 * 
 * This integration layer provides Universal Crypto MCP compatibility
 * while maintaining proper attribution to the original authors.
 * 
 * @author Nicholas (github.com/nirholas) - Integration layer only
 * @original-author [Original Author] - Core functionality
 */

import { OriginalClass } from '@/vendor/<project-name>'

export class UniversalCryptoAdapter {
  // Integration code here
  // Always maintain comments crediting original work
}
```

### 8. Update Documentation

Update relevant docs:
- `vendor/README.md` - Add project to table
- `THIRD-PARTY-LICENSES.md` - Add attribution
- `README.md` - Mention in credits section

### 9. Test Integration

```bash
# Verify code works
npm test

# Check license compliance
npm run audit-licenses

# Verify attribution is present
grep -r "Copyright" vendor/
```

## Example: Proper Attribution in Code

### Good ✅

```typescript
/**
 * Ethereum Balance Checker
 * 
 * Based on eth-balance-checker by Original Author
 * https://github.com/original/eth-balance-checker
 * 
 * Original code licensed under MIT License
 * Copyright (c) 2024 Original Author
 * 
 * Modifications for Universal Crypto MCP:
 * - Added multi-chain support
 * - Integrated with MCP protocol
 * 
 * Integration by Nicholas (github.com/nirholas)
 */
```

### Bad ❌

```typescript
/**
 * Ethereum Balance Checker
 * 
 * @author Nicholas
 */
// No mention of original work - this is plagiarism!
```

## License Compliance Checklist

Before merging vendor code:

- [ ] Original LICENSE file included
- [ ] Copyright notices preserved in source
- [ ] ATTRIBUTION.md created
- [ ] Original repository linked
- [ ] Modifications documented
- [ ] Integration layer clearly separated
- [ ] vendor/README.md updated
- [ ] THIRD-PARTY-LICENSES.md updated
- [ ] Tests passing
- [ ] License audit passes

## Contributing Back

When you improve vendor code:

1. **Document changes** in ATTRIBUTION.md
2. **Consider submitting upstream** - Original authors may want your improvements
3. **Keep attribution clear** - Your contributions are yours, original work is theirs

## Questions?

See MIT License requirements: https://opensource.org/licenses/MIT

**Key requirement**: Must include copyright notice and permission notice in all copies.

---

**Maintained by**: Nicholas (github.com/nirholas, x.com/nichxbt)  
**Purpose**: Ensure ethical and legal integration of open source code
