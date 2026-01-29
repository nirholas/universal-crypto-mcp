#!/bin/bash
# Run tests for all packages

set -e

echo "🧪 Running tests for all packages..."

pnpm -r test

echo "✅ All tests passed!"
