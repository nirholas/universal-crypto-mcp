#!/bin/bash
#===============================================================================
# Quick Backend Commands - Convenience wrappers
#===============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/backend-automation.sh"

# Quick create commands
create-express() { backend_create express "${1:-express-api}" "${2:-3001}"; }
create-fastify() { backend_create fastify "${1:-fastify-api}" "${2:-3002}"; }
create-hono() { backend_create hono "${1:-hono-api}" "${2:-3003}"; }
create-trpc() { backend_create trpc "${1:-trpc-api}" "${2:-3004}"; }
create-graphql() { backend_create graphql "${1:-graphql-api}" "${2:-3005}"; }

# Full stack creation (all frameworks)
create-all() {
    log INFO "Creating all backend frameworks..."
    create-express "express-api" 3001 &
    create-fastify "fastify-api" 3002 &
    create-hono "hono-api" 3003 &
    create-trpc "trpc-api" 3004 &
    create-graphql "graphql-api" 3005 &
    wait
    log INFO "✅ All backends created!"
}

# Start all services
start-all() {
    log INFO "Starting all backend services..."
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            log INFO "Starting $name..."
            (cd "$dir" && pnpm dev &)
        fi
    done
}

# Stop all services
stop-all() {
    log INFO "Stopping all backend services..."
    pkill -f "tsx watch" || true
    pkill -f "node.*dist" || true
    log INFO "✅ All services stopped"
}

# Build all services
build-all() {
    log INFO "Building all backend services..."
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            log INFO "Building $name..."
            (cd "$dir" && pnpm build)
        fi
    done
    log INFO "✅ All builds completed"
}

# Test all services
test-all() {
    log INFO "Testing all backend services..."
    local failed=0
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            log INFO "Testing $name..."
            (cd "$dir" && pnpm test) || ((failed++))
        fi
    done
    [[ $failed -eq 0 ]] && log INFO "✅ All tests passed" || log WARN "⚠️  $failed test suite(s) failed"
}

# Docker shortcuts
docker-up() {
    docker compose -f "${DEPLOY_DIR}/docker-compose.${1:-dev}.yml" up -d "${@:2}"
}

docker-down() {
    docker compose -f "${DEPLOY_DIR}/docker-compose.${1:-dev}.yml" down "${@:2}"
}

docker-logs() {
    docker compose -f "${DEPLOY_DIR}/docker-compose.${1:-dev}.yml" logs -f "${@:2}"
}

docker-rebuild() {
    docker compose -f "${DEPLOY_DIR}/docker-compose.${1:-dev}.yml" up -d --build "${@:2}"
}

# Database shortcuts
db-migrate() {
    local name="${1:-database}"
    (cd "${BACKEND_DIR}/${name}" && pnpm prisma migrate dev)
}

db-seed() {
    local name="${1:-database}"
    (cd "${BACKEND_DIR}/${name}" && pnpm prisma db seed)
}

db-reset() {
    local name="${1:-database}"
    (cd "${BACKEND_DIR}/${name}" && pnpm prisma migrate reset)
}

db-studio() {
    local name="${1:-database}"
    (cd "${BACKEND_DIR}/${name}" && pnpm prisma studio)
}

# Health checks
health-check() {
    local ports=(3001 3002 3003 3004 3005)
    echo -e "${CYAN}Health Check Results:${NC}"
    for port in "${ports[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/health" 2>/dev/null)
        if [[ "$response" == "200" ]]; then
            echo -e "  ${GREEN}✓${NC} Port $port: Healthy"
        else
            echo -e "  ${RED}✗${NC} Port $port: Unreachable (HTTP $response)"
        fi
    done
}

# Benchmarks
benchmark() {
    local url="${1:-http://localhost:3001/health}"
    local requests="${2:-1000}"
    local concurrency="${3:-10}"
    
    if command -v wrk &> /dev/null; then
        log INFO "Running wrk benchmark: $url"
        wrk -t4 -c"$concurrency" -d30s "$url"
    elif command -v ab &> /dev/null; then
        log INFO "Running Apache Bench: $url"
        ab -n "$requests" -c "$concurrency" "$url"
    else
        log WARN "Install 'wrk' or 'ab' for benchmarking"
        # Simple curl timing fallback
        log INFO "Using curl timing..."
        for i in {1..10}; do
            curl -s -o /dev/null -w "Request $i: %{time_total}s\n" "$url"
        done
    fi
}

# Logs
show-logs() {
    local name="${1:-api}"
    tail -f "$LOGS_DIR"/*.log 2>/dev/null || log WARN "No logs found"
}

# Clean all
clean-all() {
    log WARN "This will remove all build artifacts and node_modules..."
    if confirm "Continue?"; then
        find "$BACKEND_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
        find "$BACKEND_DIR" -name "dist" -type d -exec rm -rf {} + 2>/dev/null
        rm -rf "$CACHE_DIR"
        log INFO "✅ Cleaned all backends"
    fi
}

# Export functions
export -f create-express create-fastify create-hono create-trpc create-graphql
export -f create-all start-all stop-all build-all test-all
export -f docker-up docker-down docker-logs docker-rebuild
export -f db-migrate db-seed db-reset db-studio
export -f health-check benchmark show-logs clean-all

# If called directly, show available commands
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo -e "${CYAN}Available Quick Commands:${NC}"
    echo "  create-express, create-fastify, create-hono, create-trpc, create-graphql"
    echo "  create-all, start-all, stop-all, build-all, test-all"
    echo "  docker-up, docker-down, docker-logs, docker-rebuild"
    echo "  db-migrate, db-seed, db-reset, db-studio"
    echo "  health-check, benchmark, show-logs, clean-all"
    echo
    echo "Usage: source $0"
fi
