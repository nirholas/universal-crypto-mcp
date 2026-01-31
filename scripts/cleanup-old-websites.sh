#!/bin/bash

# Cleanup script for deprecated website files
# This script moves old website folders to .backups/ after migration to website-unified

set -e

echo "🧹 Universal Crypto MCP - Website Cleanup Script"
echo "================================================"

# Create backup directory
BACKUP_DIR=".backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Backup directory: $BACKUP_DIR"

# Function to safely move directory
move_if_exists() {
    local src="$1"
    local dest="$2"
    
    if [ -d "$src" ]; then
        echo "  Moving $src -> $dest"
        mv "$src" "$dest"
    else
        echo "  Skipping $src (not found)"
    fi
}

# 1. Backup old website folder (if exists and different from website-unified)
if [ -d "website" ] && [ "$(readlink -f website)" != "$(readlink -f website-unified)" ]; then
    echo ""
    echo "📦 Backing up old website folder..."
    move_if_exists "website" "$BACKUP_DIR/website"
fi

# 2. Check if dashboard package is now migrated
if [ -d "packages/dashboard" ]; then
    echo ""
    echo "📦 Checking dashboard package migration status..."
    
    # Check if dashboard functionality exists in website-unified
    if [ -f "website-unified/app/(analytics)/dashboard/page.tsx" ]; then
        echo "  Dashboard migrated to website-unified"
        echo "  Consider archiving packages/dashboard after verification"
        # Optionally move to backup
        # move_if_exists "packages/dashboard" "$BACKUP_DIR/packages-dashboard"
    else
        echo "  Dashboard not yet migrated - keeping packages/dashboard"
    fi
fi

# 3. Backup campaign folder if migrated
if [ -d "campaign" ]; then
    echo ""
    echo "📦 Checking campaign migration..."
    
    if [ -d "website-unified/app/(marketing)" ]; then
        echo "  Marketing pages available in website-unified"
        # Optionally backup
        # move_if_exists "campaign" "$BACKUP_DIR/campaign"
    fi
fi

# 4. Update pnpm-workspace.yaml to remove deprecated packages
echo ""
echo "📝 Checking workspace configuration..."

if [ -f "pnpm-workspace.yaml" ]; then
    # Check if website is listed in workspace
    if grep -q "website" pnpm-workspace.yaml; then
        echo "  Found 'website' in pnpm-workspace.yaml"
        echo "  Note: Update manually if old website is removed"
    fi
fi

# 5. Clean up node_modules caches if needed
echo ""
echo "🧹 Optional: Clean node_modules caches"
echo "  Run 'pnpm store prune' to clean pnpm cache"

# 6. Summary
echo ""
echo "================================================"
echo "✅ Cleanup complete!"
echo ""
echo "Backed up to: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Verify website-unified works correctly: cd website-unified && pnpm dev"
echo "2. Run tests: pnpm test"
echo "3. If everything works, delete $BACKUP_DIR"
echo ""
echo "To fully remove deprecated packages from workspaces:"
echo "  - Edit pnpm-workspace.yaml"
echo "  - Remove references to old packages"
echo "  - Run 'pnpm install' to update lockfile"
