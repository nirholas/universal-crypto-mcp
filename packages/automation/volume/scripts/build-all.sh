#!/bin/bash
# Build all packages in the monorepo

set -e

echo "🔨 Building all packages..."

# Build in dependency order
pnpm -r build

echo "✅ All packages built successfully!"
