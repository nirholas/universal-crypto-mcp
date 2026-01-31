#!/bin/bash
#===============================================================================
# Backend Orchestrator - Full Stack Backend Management
# Orchestrates all backend services with a single command
#===============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/backend-automation.sh"
source "$SCRIPT_DIR/service-templates.sh"

#-------------------------------------------------------------------------------
# Full Stack Operations
#-------------------------------------------------------------------------------

# Create complete microservices architecture
create_full_stack() {
    banner
    log INFO "🏗️  Creating complete microservices architecture..."
    
    local base_port="${1:-3000}"
    
    # Create API Gateway first
    generate_api_gateway "api-gateway" "$base_port"
    
    # Create API services
    generate_express_api "user-service" "$((base_port + 1))"
    generate_fastify_api "crypto-service" "$((base_port + 2))"
    generate_hono_api "price-service" "$((base_port + 3))"
    generate_trpc_api "trading-service" "$((base_port + 4))"
    generate_graphql_api "query-service" "$((base_port + 5))"
    
    # Create supporting services
    generate_websocket_service "realtime-service" "$((base_port + 10))"
    generate_queue_worker "job-worker"
    generate_scheduler_service "scheduler" "$((base_port + 20))"
    
    # Create database schemas
    generate_prisma_setup "database"
    generate_drizzle_setup "database"
    
    # Generate infrastructure
    generate_docker_compose "full"
    generate_kubernetes_manifests "crypto-mcp"
    
    log INFO "✅ Full stack microservices created!"
    echo
    echo -e "${CYAN}Created Services:${NC}"
    echo "  📡 API Gateway:       http://localhost:$base_port"
    echo "  👤 User Service:      http://localhost:$((base_port + 1))"
    echo "  🪙 Crypto Service:    http://localhost:$((base_port + 2))"
    echo "  📈 Price Service:     http://localhost:$((base_port + 3))"
    echo "  💱 Trading Service:   http://localhost:$((base_port + 4))"
    echo "  🔍 Query Service:     http://localhost:$((base_port + 5))"
    echo "  🔌 Realtime Service:  ws://localhost:$((base_port + 10))"
    echo "  ⏰ Scheduler:         http://localhost:$((base_port + 20))"
    echo
}

# Install all dependencies
install_all() {
    log INFO "📦 Installing dependencies for all services..."
    
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            log INFO "Installing $name..."
            (cd "$dir" && pnpm install 2>/dev/null) || log WARN "Failed: $name"
        fi
    done
    
    log INFO "✅ All dependencies installed"
}

# Start all services in development mode
start_dev_stack() {
    log INFO "🚀 Starting development stack..."
    
    # Start infrastructure first
    if command -v docker &> /dev/null; then
        log INFO "Starting Docker infrastructure..."
        docker compose -f "${DEPLOY_DIR}/docker-compose.dev.yml" up -d postgres redis 2>/dev/null || true
        sleep 3
    fi
    
    # Start services in parallel
    local pids=()
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            log INFO "Starting $name..."
            (cd "$dir" && pnpm dev &) 
            pids+=($!)
        fi
    done
    
    log INFO "✅ All services started. Press Ctrl+C to stop."
    
    # Wait for all services
    trap "kill ${pids[*]} 2>/dev/null; exit" SIGINT SIGTERM
    wait
}

# Build all services for production
build_production() {
    log INFO "🏭 Building all services for production..."
    
    local failed=0
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            log INFO "Building $name..."
            (cd "$dir" && pnpm build) || {
                log ERROR "Build failed: $name"
                ((failed++))
            }
        fi
    done
    
    if [[ $failed -eq 0 ]]; then
        log INFO "✅ All builds completed successfully"
    else
        log ERROR "❌ $failed build(s) failed"
        return 1
    fi
}

# Run all tests
test_all_services() {
    log INFO "🧪 Running tests for all services..."
    
    local failed=0
    local passed=0
    
    for dir in "$BACKEND_DIR"/*/; do
        if [[ -f "$dir/package.json" ]]; then
            name=$(basename "$dir")
            if grep -q '"test"' "$dir/package.json"; then
                log INFO "Testing $name..."
                if (cd "$dir" && pnpm test 2>/dev/null); then
                    ((passed++))
                else
                    ((failed++))
                fi
            fi
        fi
    done
    
    echo
    log INFO "Test Results: $passed passed, $failed failed"
    return $failed
}

# Deploy to environment
deploy_stack() {
    local env="${1:-dev}"
    
    case "$env" in
        dev|development)
            log INFO "🚀 Deploying to development..."
            docker compose -f "${DEPLOY_DIR}/docker-compose.dev.yml" up -d --build
            ;;
        staging)
            log INFO "🚀 Deploying to staging..."
            kubectl apply -k "${DEPLOY_DIR}/k8s/overlays/staging"
            ;;
        prod|production)
            if confirm "⚠️  Deploy to PRODUCTION?"; then
                log INFO "🚀 Deploying to production..."
                kubectl apply -k "${DEPLOY_DIR}/k8s/overlays/prod"
            else
                log WARN "Deployment cancelled"
                return 1
            fi
            ;;
        *)
            log ERROR "Unknown environment: $env"
            return 1
            ;;
    esac
    
    log INFO "✅ Deployment completed"
}

# Health check all services
health_check_all() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}           Service Health Check${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo
    
    local services=(
        "API Gateway|http://localhost:3000/health"
        "User Service|http://localhost:3001/health"
        "Crypto Service|http://localhost:3002/health"
        "Price Service|http://localhost:3003/health"
        "Trading Service|http://localhost:3004/health"
        "Query Service|http://localhost:3005/health"
        "Realtime Service|http://localhost:3010/health"
        "Scheduler|http://localhost:3020/health"
    )
    
    local healthy=0
    local unhealthy=0
    
    for service in "${services[@]}"; do
        IFS='|' read -r name url <<< "$service"
        response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 "$url" 2>/dev/null || echo "000")
        
        if [[ "$response" == "200" ]]; then
            echo -e "  ${GREEN}✓${NC} $name ${GREEN}(healthy)${NC}"
            ((healthy++))
        else
            echo -e "  ${RED}✗${NC} $name ${RED}(unreachable)${NC}"
            ((unhealthy++))
        fi
    done
    
    echo
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${GREEN}$healthy healthy${NC} | ${RED}$unhealthy unhealthy${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Interactive menu
interactive_menu() {
    while true; do
        clear
        banner
        echo -e "${WHITE}What would you like to do?${NC}"
        echo
        echo -e "  ${CYAN}1)${NC} Create full stack microservices"
        echo -e "  ${CYAN}2)${NC} Create single service"
        echo -e "  ${CYAN}3)${NC} Start development stack"
        echo -e "  ${CYAN}4)${NC} Build for production"
        echo -e "  ${CYAN}5)${NC} Run all tests"
        echo -e "  ${CYAN}6)${NC} Deploy to environment"
        echo -e "  ${CYAN}7)${NC} Health check all services"
        echo -e "  ${CYAN}8)${NC} View status"
        echo -e "  ${CYAN}9)${NC} Clean all"
        echo -e "  ${CYAN}0)${NC} Exit"
        echo
        echo -n "Select option: "
        read -r choice
        
        case "$choice" in
            1)
                create_full_stack
                read -rp "Press enter to continue..."
                ;;
            2)
                echo "Available frameworks: express, fastify, hono, trpc, graphql"
                echo -n "Framework: "
                read -r framework
                echo -n "Name: "
                read -r name
                echo -n "Port: "
                read -r port
                backend_create "$framework" "$name" "$port"
                read -rp "Press enter to continue..."
                ;;
            3)
                start_dev_stack
                ;;
            4)
                build_production
                read -rp "Press enter to continue..."
                ;;
            5)
                test_all_services
                read -rp "Press enter to continue..."
                ;;
            6)
                echo -n "Environment (dev/staging/prod): "
                read -r env
                deploy_stack "$env"
                read -rp "Press enter to continue..."
                ;;
            7)
                health_check_all
                read -rp "Press enter to continue..."
                ;;
            8)
                backend_status
                read -rp "Press enter to continue..."
                ;;
            9)
                if confirm "Remove all build artifacts and node_modules?"; then
                    find "$BACKEND_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
                    find "$BACKEND_DIR" -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
                    log INFO "✅ Cleaned"
                fi
                read -rp "Press enter to continue..."
                ;;
            0)
                exit 0
                ;;
            *)
                echo "Invalid option"
                sleep 1
                ;;
        esac
    done
}

#-------------------------------------------------------------------------------
# Main
#-------------------------------------------------------------------------------

show_orchestrator_help() {
    banner
    echo -e "${WHITE}Backend Orchestrator - Full Stack Management${NC}"
    echo
    echo -e "${CYAN}Usage:${NC} orchestrate.sh <command> [options]"
    echo
    echo -e "${CYAN}Commands:${NC}"
    echo "  full-stack [port]      Create complete microservices architecture"
    echo "  install                Install all dependencies"
    echo "  dev                    Start all services in dev mode"
    echo "  build                  Build all services for production"
    echo "  test                   Run all tests"
    echo "  deploy <env>           Deploy to environment (dev/staging/prod)"
    echo "  health                 Health check all services"
    echo "  status                 Show service status"
    echo "  interactive            Launch interactive menu"
    echo
    echo -e "${CYAN}Examples:${NC}"
    echo "  ./orchestrate.sh full-stack 3000"
    echo "  ./orchestrate.sh dev"
    echo "  ./orchestrate.sh deploy staging"
    echo "  ./orchestrate.sh interactive"
    echo
}

main() {
    local command="${1:-interactive}"
    shift 2>/dev/null || true
    
    case "$command" in
        full-stack|fullstack|create-all)
            create_full_stack "$@"
            ;;
        install)
            install_all
            ;;
        dev|start)
            start_dev_stack
            ;;
        build)
            build_production
            ;;
        test)
            test_all_services
            ;;
        deploy)
            deploy_stack "$@"
            ;;
        health)
            health_check_all
            ;;
        status)
            backend_status
            ;;
        interactive|menu)
            interactive_menu
            ;;
        help|--help|-h)
            show_orchestrator_help
            ;;
        *)
            log ERROR "Unknown command: $command"
            show_orchestrator_help
            exit 1
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
