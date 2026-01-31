#!/bin/bash
#
# Extract and Adapt Vendor Code
#
# This script finds the most useful code patterns from each vendor repo
# and creates adapted implementations in the appropriate packages.
#
# Usage: ./scripts/extract-vendor-code.sh [category]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
VENDOR_DIR="$ROOT_DIR/vendor"
PACKAGES_DIR="$ROOT_DIR/packages"

CATEGORY="${1:-all}"

echo "================================================"
echo "🔍 Extracting Vendor Code Patterns"
echo "================================================"
echo ""

# Function to find key TypeScript files in a repo
find_key_files() {
  local repo_dir="$1"
  local max_files="${2:-10}"
  
  # Priority: index files, main exports, core types
  find "$repo_dir" -type f \( -name "index.ts" -o -name "types.ts" -o -name "core.ts" -o -name "client.ts" -o -name "hooks.ts" \) \
    ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" \
    2>/dev/null | head -n "$max_files"
}

# Function to extract exports from a TypeScript file
extract_exports() {
  local file="$1"
  
  if [[ ! -f "$file" ]]; then
    return
  fi
  
  # Extract export declarations
  grep -E "^export (interface|type|function|class|const|enum|default)" "$file" 2>/dev/null | head -20 || true
}

# Function to create adapted implementation
create_adapted_impl() {
  local category="$1"
  local repo_name="$2"
  local target_pkg="$3"
  local target_dir="$4"
  
  local repo_dir="$VENDOR_DIR/$category/$repo_name"
  local output_dir="$PACKAGES_DIR/$target_pkg/$target_dir/$repo_name"
  
  if [[ ! -d "$repo_dir" ]]; then
    echo "    ⚠️  Repo not found: $repo_name"
    return
  fi
  
  mkdir -p "$output_dir"
  
  # Find key source files
  local key_files=$(find_key_files "$repo_dir")
  local file_count=$(echo "$key_files" | grep -c . || echo "0")
  
  echo "    📄 Found $file_count key files in $repo_name"
  
  # Extract and aggregate exports
  local all_exports=""
  for file in $key_files; do
    if [[ -f "$file" ]]; then
      local exports=$(extract_exports "$file")
      if [[ -n "$exports" ]]; then
        all_exports="$all_exports
// From: $(basename "$file")
$exports
"
      fi
    fi
  done
  
  # Generate adapted index.ts
  local output_file="$output_dir/index.ts"
  
  if [[ -f "$output_file" ]]; then
    echo "    ⏭️  Exists: $output_file"
    return
  fi
  
  cat > "$output_file" << EOF
/**
 * Adapted from: $repo_name
 * Source: vendor/$category/$repo_name/
 *
 * This module adapts the $repo_name library for UCM conventions.
 * See the original repository for full documentation.
 *
 * License: MIT (see vendor/$category/$repo_name/LICENSE)
 */

// ============================================================
// Exports found in source:
// ============================================================
$(echo "$all_exports" | sed 's/^/\/\/ /')

// ============================================================
// UCM Adapted Implementation
// ============================================================

// TODO: Implement based on the patterns above
// Reference: vendor/$category/$repo_name/

export const ${repo_name//-/_}_adapter = {
  name: '$repo_name',
  category: '$category',
  initialized: false,
  
  init(): void {
    console.log('Initializing $repo_name adapter...');
    this.initialized = true;
  },
};

export default ${repo_name//-/_}_adapter;
EOF

  echo "    ✅ Created: packages/$target_pkg/$target_dir/$repo_name/index.ts"
}

# Process wallet category
process_wallet() {
  echo ""
  echo "🔧 Processing: wallet"
  echo "   Target: packages/wallets/src/adapters"
  
  for repo in evm-hooks evm-client connect-modal multisig-sdk; do
    create_adapted_impl "wallet" "$repo" "wallets" "src/adapters"
  done
}

# Process AI agents category
process_ai_agents() {
  echo ""
  echo "🔧 Processing: ai-agents"
  echo "   Target: packages/agents/src/frameworks"
  
  for repo in langchain eliza crew-orchestration autonomous-agent social-agent; do
    create_adapted_impl "ai-agents" "$repo" "agents" "src/frameworks"
  done
}

# Process auth category
process_auth() {
  echo ""
  echo "🔧 Processing: auth"
  echo "   Target: packages/security/src/auth"
  
  for repo in nextjs-auth jwt-library middleware session-manager; do
    create_adapted_impl "auth" "$repo" "security" "src/auth"
  done
}

# Process contracts category
process_contracts() {
  echo ""
  echo "🔧 Processing: contracts"
  echo "   Target: packages/core/src/contracts"
  
  for repo in abi-types foundry-toolkit ethers permit-approvals; do
    create_adapted_impl "contracts" "$repo" "core" "src/contracts"
  done
}

# Process defi category
process_defi() {
  echo ""
  echo "🔧 Processing: defi"
  echo "   Target: packages/defi/src/protocols"
  
  for repo in tvl-adapters; do
    create_adapted_impl "defi" "$repo" "defi" "src/protocols"
  done
}

# Process payments category
process_payments() {
  echo ""
  echo "🔧 Processing: payments"
  echo "   Target: packages/payments/src/providers"
  
  for repo in stripe-sdk coinbase-sdk; do
    create_adapted_impl "payments" "$repo" "payments" "src/providers"
  done
}

# Process state category
process_state() {
  echo ""
  echo "🔧 Processing: state"
  echo "   Target: packages/shared/src/state"
  
  for repo in store atomic async-state immutable; do
    create_adapted_impl "state" "$repo" "shared" "src/state"
  done
}

# Process realtime category  
process_realtime() {
  echo ""
  echo "🔧 Processing: realtime"
  echo "   Target: packages/infrastructure/src/realtime"
  
  for repo in websocket-engine websocket-core redis-client; do
    create_adapted_impl "realtime" "$repo" "infrastructure" "src/realtime"
  done
}

# Main execution
case "$CATEGORY" in
  "wallet")
    process_wallet
    ;;
  "ai-agents")
    process_ai_agents
    ;;
  "auth")
    process_auth
    ;;
  "contracts")
    process_contracts
    ;;
  "defi")
    process_defi
    ;;
  "payments")
    process_payments
    ;;
  "state")
    process_state
    ;;
  "realtime")
    process_realtime
    ;;
  "all"|*)
    process_wallet
    process_ai_agents
    process_auth
    process_contracts
    process_defi
    process_payments
    process_state
    process_realtime
    ;;
esac

echo ""
echo "================================================"
echo "✅ Extraction complete!"
echo ""
echo "Generated adapters reference the original vendor code."
echo "Fill in the TODO sections with actual implementations."
echo "================================================"
