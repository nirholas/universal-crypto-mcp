#!/bin/bash

# Verification script to check all integrations work
# Run this after migration to ensure everything is properly connected

set -e

echo "🔍 Universal Crypto MCP - Integration Verification"
echo "==================================================="

ERRORS=0
WARNINGS=0

# Helper functions
check_file() {
    if [ -f "$1" ]; then
        echo "  ✅ $1"
    else
        echo "  ❌ $1 (missing)"
        ((ERRORS++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo "  ✅ $1/"
    else
        echo "  ❌ $1/ (missing)"
        ((ERRORS++))
    fi
}

# 1. Check core hooks exist
echo ""
echo "📁 Checking hooks..."
cd website-unified

check_file "hooks/useSwap.ts"
check_file "hooks/useLiquidity.ts"
check_file "hooks/useYield.ts"
check_file "hooks/useMarketData.ts"
check_file "hooks/useTrendingTokens.ts"
check_file "hooks/useWhaleAlerts.ts"
check_file "hooks/useAgents.ts"
check_file "hooks/useServices.ts"
check_file "hooks/useCredits.ts"
check_file "hooks/index.ts"

# 2. Check API routes
echo ""
echo "📡 Checking API routes..."

check_dir "app/api/defi"
check_file "app/api/defi/quote/route.ts"
check_file "app/api/defi/swap/route.ts"
check_file "app/api/defi/tokens/route.ts"
check_file "app/api/defi/balances/route.ts"
check_file "app/api/defi/pools/route.ts"
check_file "app/api/defi/farms/route.ts"

check_dir "app/api/market"
check_file "app/api/market/prices/route.ts"
check_file "app/api/market/global/route.ts"
check_file "app/api/market/fear-greed/route.ts"
check_file "app/api/market/whales/route.ts"

check_dir "app/api/credits"
check_file "app/api/credits/balance/route.ts"
check_file "app/api/credits/transactions/route.ts"
check_file "app/api/credits/packages/route.ts"
check_file "app/api/credits/purchase/route.ts"
check_file "app/api/credits/usage/route.ts"

check_dir "app/api/agents"
check_dir "app/api/marketplace"

# 3. Check app pages
echo ""
echo "📄 Checking pages..."

check_file "app/(analytics)/dashboard/page.tsx"
check_dir "app/(analytics)/defi"
check_dir "app/(analytics)/market"

check_file "app/(playground)/agents/page.tsx"
check_dir "app/(playground)/agents/[id]"
check_file "app/(playground)/agents/new/page.tsx"

check_dir "app/(marketplace)/discover"
check_dir "app/(marketplace)/subscriptions"
check_dir "app/(marketplace)/service"

# 4. Check components
echo ""
echo "🧩 Checking components..."

check_file "components/effects/SwapWidget.tsx"
check_file "components/effects/DeFiComponents.tsx"
check_file "components/effects/PriceTicker.tsx"
check_file "components/effects/TokenTable.tsx"
check_file "components/effects/AgentCard.tsx"

# 5. Check providers
echo ""
echo "🔌 Checking providers..."

check_dir "providers"
check_file "providers/WebSocketProvider.tsx"

# 6. Check lib utilities
echo ""
echo "📚 Checking lib..."

check_dir "lib/utils"
check_dir "lib/websocket"

# 7. TypeScript check
echo ""
echo "🔧 Running TypeScript check..."
if npx tsc --noEmit 2>/dev/null; then
    echo "  ✅ TypeScript compilation successful"
else
    echo "  ⚠️  TypeScript has errors (run 'npx tsc --noEmit' for details)"
    ((WARNINGS++))
fi

# 8. Summary
cd ..

echo ""
echo "==================================================="
echo "📊 Verification Summary"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed!"
else
    echo "❌ Errors: $ERRORS"
    echo "⚠️  Warnings: $WARNINGS"
fi

echo ""
echo "Next steps:"
echo "1. Start dev server: cd website-unified && pnpm dev"
echo "2. Run tests: pnpm test"
echo "3. Check browser at http://localhost:3000"

exit $ERRORS
