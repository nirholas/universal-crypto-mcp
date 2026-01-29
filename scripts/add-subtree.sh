#!/bin/bash
# Add a git subtree with proper attribution

set -e

if [ $# -lt 2 ]; then
  echo "Usage: ./add-subtree.sh <repo-url> <name>"
  echo ""
  echo "Example:"
  echo "  ./add-subtree.sh https://github.com/author/project awesome-mcp"
  exit 1
fi

REPO_URL=$1
NAME=$2
PREFIX="packages/integrations/${NAME}"

echo "🔍 Verifying license compatibility..."
npm run verify:license -- "${REPO_URL}" || {
  echo "❌ License verification failed. Cannot integrate."
  exit 1
}

echo ""
echo "📦 Adding subtree: ${NAME}"
echo "   Source: ${REPO_URL}"
echo "   Target: ${PREFIX}"
echo ""

# Add subtree
git subtree add --prefix="${PREFIX}" "${REPO_URL}" main --squash

echo ""
echo "✅ Subtree added successfully!"
echo ""
echo "📝 Next steps:"
echo "  1. Add attribution to THIRD_PARTY_NOTICES.md"
echo "     npm run verify:license -- ${REPO_URL} --template"
echo ""
echo "  2. Create adapter if needed:"
echo "     cp src/integrations/adapter.ts packages/integrations/${NAME}/adapter.ts"
echo ""
echo "  3. Update documentation:"
echo "     Add to docs/INTEGRATION_STRATEGY.md"
echo ""
echo "  4. Test integration:"
echo "     npm run test:integration -- ${NAME}"
echo ""
