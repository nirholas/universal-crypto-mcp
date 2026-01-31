#!/bin/bash
# Add branding header to key TypeScript files
#
# Author: nich
# GitHub: https://github.com/nirholas
# Twitter: https://x.com/nichxbt

HEADER='/**
 * Universal Crypto MCP
 * The most extensive crypto MCP repository
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 * @see https://x.com/nichxbt
 */
'

# Add header to main entry points only (not all files)
for dir in /workspaces/universal-crypto-mcp/packages/*/; do
    category=$(basename "$dir")
    for subdir in "$dir"*/; do
        if [ -d "$subdir" ]; then
            pkg=$(basename "$subdir")
            entry="$subdir/src/index.ts"
            
            if [ -f "$entry" ]; then
                # Check if already has our header
                if ! grep -q "@author nich" "$entry" 2>/dev/null; then
                    # Check if file starts with comment
                    if head -1 "$entry" | grep -q "^/\*\*"; then
                        echo "Skipping (has header): $entry"
                    else
                        # Prepend header
                        echo "$HEADER" | cat - "$entry" > temp && mv temp "$entry"
                        echo "Added header: $entry"
                    fi
                fi
            fi
        fi
    done
done

echo "Header addition complete!"
