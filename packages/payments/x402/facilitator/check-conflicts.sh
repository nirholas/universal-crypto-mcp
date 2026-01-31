#!/bin/bash

# Agent Conflict Detection Script
# Checks for duplicate implementations and potential conflicts

echo "🔍 Agent Conflict Detection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

CONFLICTS=0
WARNINGS=0

# Check for duplicate class definitions
echo "📝 Checking for duplicate classes..."
echo ""

DUPLICATE_CLASSES=$(grep -rn "^export class FeeService" src/ 2>/dev/null | wc -l)
if [ "$DUPLICATE_CLASSES" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Multiple FeeService implementations found!${NC}"
  grep -rn "^export class FeeService" src/
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$DUPLICATE_CLASSES" -eq 1 ]; then
  echo -e "${GREEN}✅ FeeService: Single implementation${NC}"
fi

DUPLICATE_SETTLEMENT=$(grep -rn "^export class.*Settlement.*Service" src/ 2>/dev/null | wc -l)
if [ "$DUPLICATE_SETTLEMENT" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Multiple SettlementService implementations found!${NC}"
  grep -rn "^export class.*Settlement.*Service" src/
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$DUPLICATE_SETTLEMENT" -eq 1 ]; then
  echo -e "${GREEN}✅ SettlementService: Single implementation${NC}"
fi

DUPLICATE_MULTICHAIN=$(grep -rn "^export class MultiChainClient" src/ 2>/dev/null | wc -l)
if [ "$DUPLICATE_MULTICHAIN" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Multiple MultiChainClient implementations found!${NC}"
  grep -rn "^export class MultiChainClient" src/
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$DUPLICATE_MULTICHAIN" -eq 1 ]; then
  echo -e "${GREEN}✅ MultiChainClient: Single implementation${NC}"
fi

echo ""
echo "🔧 Checking for duplicate functions..."
echo ""

# Check for duplicate settlement routes
DUPLICATE_ROUTES=$(grep -rn "createSettlementRoutes" src/routes/ 2>/dev/null | grep "export function" | wc -l)
if [ "$DUPLICATE_ROUTES" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Multiple createSettlementRoutes implementations!${NC}"
  grep -rn "createSettlementRoutes" src/routes/ | grep "export function"
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$DUPLICATE_ROUTES" -eq 1 ]; then
  echo -e "${GREEN}✅ createSettlementRoutes: Single implementation${NC}"
fi

# Check for duplicate fee routes
DUPLICATE_FEE_ROUTES=$(grep -rn "createFeesRouter" src/routes/ 2>/dev/null | grep "export function" | wc -l)
if [ "$DUPLICATE_FEE_ROUTES" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Multiple createFeesRouter implementations!${NC}"
  grep -rn "createFeesRouter" src/routes/ | grep "export function"
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$DUPLICATE_FEE_ROUTES" -eq 1 ]; then
  echo -e "${GREEN}✅ createFeesRouter: Single implementation${NC}"
fi

echo ""
echo "📂 Checking file structure..."
echo ""

# Check for multiple service files with similar names
if [ $(find src/services -name "*fee*settlement*.ts" -o -name "*settlement*fee*.ts" 2>/dev/null | wc -l) -gt 0 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found files with overlapping names${NC}"
  find src/services -name "*fee*settlement*.ts" -o -name "*settlement*fee*.ts"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for backup or duplicate files
BACKUP_FILES=$(find src/ -name "*.ts.bak" -o -name "*.ts.backup" -o -name "*-copy.ts" 2>/dev/null | wc -l)
if [ "$BACKUP_FILES" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found backup/duplicate files${NC}"
  find src/ -name "*.ts.bak" -o -name "*.ts.backup" -o -name "*-copy.ts"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "🔗 Checking server.ts integrations..."
echo ""

# Check how many times settlement service is initialized
SETTLEMENT_INITS=$(grep -n "createFeeSettlementService\|new FeeSettlementService" src/server.ts 2>/dev/null | wc -l)
if [ "$SETTLEMENT_INITS" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Settlement service initialized multiple times!${NC}"
  grep -n "createFeeSettlementService\|new FeeSettlementService" src/server.ts
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$SETTLEMENT_INITS" -eq 1 ]; then
  echo -e "${GREEN}✅ Settlement service: Single initialization${NC}"
fi

# Check how many times fee service is initialized  
FEE_INITS=$(grep -n "createFeeService\|new FeeService" src/server.ts 2>/dev/null | wc -l)
if [ "$FEE_INITS" -gt 1 ]; then
  echo -e "${RED}❌ CONFLICT: Fee service initialized multiple times!${NC}"
  grep -n "createFeeService\|new FeeService" src/server.ts
  CONFLICTS=$((CONFLICTS + 1))
elif [ "$FEE_INITS" -eq 1 ]; then
  echo -e "${GREEN}✅ Fee service: Single initialization${NC}"
fi

echo ""
echo "📊 Checking for inconsistent implementations..."
echo ""

# Check if settlement.ts actually settles on-chain or just simulates
if grep -q "simulated_settlement\|TODO.*settlement" src/services/settlement.ts 2>/dev/null; then
  echo -e "${YELLOW}⚠️  INFO: Settlement service uses simulated settlement${NC}"
  echo "   This is expected - on-chain settlement needs contract implementation"
fi

# Check if fees.ts stores in-memory or uses database
if ! grep -q "database\|prisma\|drizzle\|mongodb" src/services/fees.ts 2>/dev/null; then
  echo -e "${YELLOW}⚠️  INFO: Fee service uses in-memory storage${NC}"
  echo "   This is expected - database persistence can be added separately"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$CONFLICTS" -eq 0 ]; then
  echo -e "${GREEN}✅ No conflicts detected!${NC}"
else
  echo -e "${RED}❌ Found $CONFLICTS conflict(s)${NC}"
  echo ""
  echo "🔧 Recommended Actions:"
  echo "1. Review AGENT_COORDINATION.md"
  echo "2. Check which agent is responsible for each file"
  echo "3. Resolve conflicts by keeping the canonical implementation"
  echo "4. Update coordination file to prevent future conflicts"
fi

if [ "$WARNINGS" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $WARNINGS warning(s)${NC}"
else
  echo -e "${GREEN}✅ No warnings${NC}"
fi

echo ""

# Exit with error if conflicts found
if [ "$CONFLICTS" -gt 0 ]; then
  exit 1
else
  exit 0
fi
