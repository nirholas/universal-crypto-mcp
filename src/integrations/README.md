# Third-Party Integrations

This directory contains integration layers for third-party open source projects.

## Purpose

Integration code in this directory:
- Wraps vendor code for Universal Crypto MCP compatibility
- Maintains clear attribution to original authors
- Adds MCP-specific functionality
- Provides consistent interfaces

## Structure

```
integrations/
├── <project-name>/
│   ├── adapter.ts      # MCP adapter for vendor project
│   ├── index.ts        # Public exports
│   ├── types.ts        # Type definitions
│   └── README.md       # Integration documentation
```

## Attribution Requirements

Every integration file must clearly state:
1. **Original project name and repository**
2. **Original author(s)**
3. **License type**
4. **What parts are original vs. integration layer**

Example header:
```typescript
/**
 * [Integration Name]
 * 
 * Integrates [Original Project] into Universal Crypto MCP
 * Original: https://github.com/author/project
 * License: MIT (see vendor/project/LICENSE)
 * Original Author: [Name]
 * 
 * Integration layer by Nicholas (github.com/nirholas)
 * This file provides MCP compatibility for the original project
 */
```

## Integration Layers

Integration layers should:
- ✅ Keep vendor code unchanged in `vendor/`
- ✅ Provide thin wrapper in `src/integrations/`
- ✅ Credit original authors prominently
- ✅ Add MCP-specific features
- ✅ Document modifications clearly

Integration layers should NOT:
- ❌ Modify vendor code directly
- ❌ Remove attribution
- ❌ Claim original work as yours
- ❌ Mix integration and vendor code

## Example Integration

```typescript
// src/integrations/example-tool/adapter.ts

/**
 * Example Tool MCP Adapter
 * 
 * Integrates example-tool into Universal Crypto MCP
 * Original: https://github.com/author/example-tool
 * License: MIT
 * Original Author: John Doe
 * 
 * This adapter provides MCP compatibility while maintaining
 * proper attribution to the original author.
 * 
 * @author Nicholas (github.com/nirholas) - Integration only
 */

import { OriginalTool } from '@/vendor/example-tool'

export class ExampleToolAdapter {
  private tool: OriginalTool

  constructor() {
    // Integration code here
    this.tool = new OriginalTool()
  }

  async executeMCPCommand(params: any) {
    // MCP-specific wrapper around original tool
    return await this.tool.execute(params)
  }
}
```

## Guidelines

1. **Separate concerns**: Keep vendor code and integration code separate
2. **Proper attribution**: Always credit original authors
3. **Clear documentation**: Explain what's yours vs. theirs
4. **License compliance**: Follow all license terms
5. **Contribute back**: Consider submitting improvements upstream

---

**Maintained by**: Nicholas (github.com/nirholas, x.com/nichxbt)
