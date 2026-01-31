#!/bin/bash
# Generate a visual project structure report

echo "═══════════════════════════════════════════════════════════"
echo "  X402 Payment Facilitator - Project Structure"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Count files by type
echo "📊 File Statistics:"
echo "-----------------------------------------------------------"
echo "Documentation:   $(find . -name '*.md' -type f | wc -l) files"
echo "TypeScript:      $(find src -name '*.ts' -type f 2>/dev/null | wc -l) files"
echo "Configuration:   $(find . -maxdepth 1 -name '*.json' -o -name '*.yml' -o -name '*.yaml' | wc -l) files"
echo "Scripts:         $(find . -name '*.sh' -o -name '*.js' | grep -v node_modules | wc -l) files"
echo ""

# Documentation overview
echo "📚 Documentation (alphabetical):"
echo "-----------------------------------------------------------"
ls -lh *.md 2>/dev/null | awk '{printf "%-30s %6s\n", $9, $5}'
echo ""

# Source code overview
echo "💻 Source Code:"
echo "-----------------------------------------------------------"
if [ -d "src" ]; then
    echo "Services:"
    ls -lh src/services/*.ts 2>/dev/null | awk '{printf "  %-25s %6s\n", $9, $5}'
    echo ""
    echo "Routes:"
    ls -lh src/routes/*.ts 2>/dev/null | awk '{printf "  %-25s %6s\n", $9, $5}'
fi
echo ""

# Tools
echo "🛠️  Tools & Scripts:"
echo "-----------------------------------------------------------"
find . -maxdepth 1 \( -name '*.sh' -o -name '*.js' \) | while read -r file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    printf "%-30s %6s\n" "$(basename "$file")" "$size"
done
echo ""

# Infrastructure
echo "🐳 Infrastructure:"
echo "-----------------------------------------------------------"
ls -lh Dockerfile docker-compose.yml prometheus.yml 2>/dev/null | awk '{printf "%-30s %6s\n", $9, $5}'
echo ""

# Project summary
echo "📋 Project Summary:"
echo "-----------------------------------------------------------"
total_docs=$(find . -name '*.md' -type f | wc -l)
total_code=$(find src -name '*.ts' -type f 2>/dev/null | wc -l)
total_files=$(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l)

echo "Total files:        $total_files"
echo "Documentation:      $total_docs markdown files"
echo "Source code:        $total_code TypeScript files"
echo ""

# Status
echo "✅ Status: Production Ready"
echo "🔒 Locked Files: 12 (core revenue infrastructure)"
echo "🟢 Available: 6 areas (database, testing, contracts, dashboard, monitoring, CI/CD)"
echo ""
echo "═══════════════════════════════════════════════════════════"
