#!/bin/bash
# Rebranding script for Universal Crypto MCP
# Updates copyright notices, author info, and adds branding footers
#
# Author: nich
# GitHub: https://github.com/nirholas
# Twitter: https://x.com/nichxbt

PACKAGES_DIR="/workspaces/universal-crypto-mcp/packages"

# Update LICENSE files to include original + our attribution
find "$PACKAGES_DIR" -name "LICENSE" -o -name "LICENSE.md" | while read file; do
    if ! grep -q "nirholas" "$file" 2>/dev/null; then
        echo "" >> "$file"
        echo "---" >> "$file"
        echo "Integrated into Universal Crypto MCP by nich (https://github.com/nirholas)" >> "$file"
        echo "Twitter: https://x.com/nichxbt" >> "$file"
        echo "---" >> "$file"
        echo "Updated LICENSE: $file"
    fi
done

# Find and update main README files (first level in each category)
for category in trading market-data defi wallets payments automation generators core; do
    readme="$PACKAGES_DIR/$category/README.md"
    if [ -f "$readme" ] && ! grep -q "nichxbt" "$readme"; then
        echo "" >> "$readme"
        echo "---" >> "$readme"
        echo "" >> "$readme"
        echo "## 👤 Author" >> "$readme"
        echo "" >> "$readme"
        echo "**nich** - Building the most extensive crypto MCP repository" >> "$readme"
        echo "" >> "$readme"
        echo "- 🐙 GitHub: [@nirholas](https://github.com/nirholas)" >> "$readme"
        echo "- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)" >> "$readme"
        echo "- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)" >> "$readme"
        echo "" >> "$readme"
        echo "## 🤝 Contributing" >> "$readme"
        echo "" >> "$readme"
        echo "Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)" >> "$readme"
        echo "" >> "$readme"
        echo "## 📄 License" >> "$readme"
        echo "" >> "$readme"
        echo "Apache-2.0 - see [LICENSE](../../LICENSE)" >> "$readme"
        echo "Updated README: $readme"
    fi
done

echo "Branding update complete!"
