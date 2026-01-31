#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Universal Crypto MCP - Enterprise Deployment Script
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script deploys the full UCM stack with x402 payment integration
#
# @author nirholas
# @license Apache-2.0
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$(dirname "$DEPLOY_DIR")")"

# ═══════════════════════════════════════════════════════════════════════════════
# Logging Functions
# ═══════════════════════════════════════════════════════════════════════════════

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "\n${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}\n"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Prerequisites Check
# ═══════════════════════════════════════════════════════════════════════════════

check_prerequisites() {
    log_step "🔍 Checking Prerequisites"
    
    local missing=()
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        missing+=("docker")
    else
        log_success "Docker: $(docker --version)"
    fi
    
    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        missing+=("docker-compose")
    else
        log_success "Docker Compose: $(docker compose version --short)"
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running!"
        exit 1
    fi
    
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing[*]}"
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Environment Setup
# ═══════════════════════════════════════════════════════════════════════════════

setup_environment() {
    log_step "🔧 Setting Up Environment"
    
    if [ ! -f "$DEPLOY_DIR/.env" ]; then
        if [ -f "$DEPLOY_DIR/.env.example" ]; then
            log_warning ".env file not found. Creating from .env.example..."
            cp "$DEPLOY_DIR/.env.example" "$DEPLOY_DIR/.env"
            log_warning "Please edit $DEPLOY_DIR/.env with your configuration"
            log_warning "Required variables:"
            echo "  - WALLET_ADDRESS: Your payment receiving wallet"
            echo "  - POSTGRES_PASSWORD: Database password"
            echo "  - JWT_SECRET: Authentication secret"
            echo "  - DOMAIN: Your domain name"
            read -p "Press Enter to continue after editing .env, or Ctrl+C to cancel..."
        else
            log_error ".env.example not found!"
            exit 1
        fi
    fi
    
    # Source environment
    set -a
    source "$DEPLOY_DIR/.env"
    set +a
    
    # Validate required variables
    local required_vars=(
        "WALLET_ADDRESS"
        "POSTGRES_PASSWORD"
        "JWT_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            log_error "Required environment variable $var is not set!"
            exit 1
        fi
    done
    
    log_success "Environment configured!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Directory Setup
# ═══════════════════════════════════════════════════════════════════════════════

setup_directories() {
    log_step "📁 Setting Up Directories"
    
    local dirs=(
        "$DEPLOY_DIR/data/postgres"
        "$DEPLOY_DIR/data/redis"
        "$DEPLOY_DIR/data/prometheus"
        "$DEPLOY_DIR/data/grafana"
        "$DEPLOY_DIR/data/loki"
        "$DEPLOY_DIR/data/alertmanager"
        "$DEPLOY_DIR/logs/nginx"
        "$DEPLOY_DIR/logs/gateway"
        "$DEPLOY_DIR/ssl/certs"
    )
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "Created: $dir"
        fi
    done
    
    # Set permissions
    chmod 777 "$DEPLOY_DIR/data/prometheus" 2>/dev/null || true
    chmod 777 "$DEPLOY_DIR/data/grafana" 2>/dev/null || true
    
    log_success "Directories created!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# SSL Setup
# ═══════════════════════════════════════════════════════════════════════════════

setup_ssl() {
    log_step "🔐 Setting Up SSL"
    
    local ssl_dir="$DEPLOY_DIR/ssl/certs"
    
    if [ -f "$ssl_dir/fullchain.pem" ] && [ -f "$ssl_dir/privkey.pem" ]; then
        log_success "SSL certificates already exist"
        return 0
    fi
    
    if [ "${USE_LETSENCRYPT:-false}" = "true" ]; then
        log_info "Setting up Let's Encrypt certificates..."
        bash "$SCRIPT_DIR/ssl-setup.sh" --letsencrypt
    else
        log_info "Generating self-signed certificates for development..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$ssl_dir/privkey.pem" \
            -out "$ssl_dir/fullchain.pem" \
            -subj "/CN=${DOMAIN:-localhost}/O=UCM/C=US" \
            2>/dev/null
        
        log_warning "Using self-signed certificates. Set USE_LETSENCRYPT=true for production."
    fi
    
    log_success "SSL configured!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Build Images
# ═══════════════════════════════════════════════════════════════════════════════

build_images() {
    log_step "🏗️ Building Docker Images"
    
    cd "$DEPLOY_DIR"
    
    # Build gateway image
    log_info "Building gateway image..."
    docker build -t ucm-gateway:latest -f Dockerfile.gateway "$PROJECT_ROOT"
    
    # Build dashboard image if exists
    if [ -f "Dockerfile.dashboard" ]; then
        log_info "Building dashboard image..."
        docker build -t ucm-dashboard:latest -f Dockerfile.dashboard "$PROJECT_ROOT"
    fi
    
    log_success "Images built!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Start Services
# ═══════════════════════════════════════════════════════════════════════════════

start_services() {
    log_step "🚀 Starting Services"
    
    cd "$DEPLOY_DIR"
    
    # Pull latest images
    log_info "Pulling latest base images..."
    docker compose -f docker-compose.enterprise.yml pull --ignore-pull-failures 2>/dev/null || true
    
    # Start database first
    log_info "Starting database services..."
    docker compose -f docker-compose.enterprise.yml up -d postgres redis
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    local retries=30
    while [ $retries -gt 0 ]; do
        if docker compose -f docker-compose.enterprise.yml exec -T postgres pg_isready -U "${POSTGRES_USER:-ucm}" >/dev/null 2>&1; then
            break
        fi
        retries=$((retries - 1))
        sleep 1
    done
    
    if [ $retries -eq 0 ]; then
        log_error "Database failed to start!"
        exit 1
    fi
    
    log_success "Database ready!"
    
    # Start remaining services
    log_info "Starting all services..."
    docker compose -f docker-compose.enterprise.yml up -d
    
    log_success "All services started!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Health Check
# ═══════════════════════════════════════════════════════════════════════════════

health_check() {
    log_step "🏥 Running Health Checks"
    
    local services=(
        "gateway:3000:/health"
        "prometheus:9090/-/healthy"
        "grafana:3001/api/health"
    )
    
    local all_healthy=true
    
    for service in "${services[@]}"; do
        IFS=':' read -r name port path <<< "$service"
        
        local url="http://localhost:$port$path"
        local retries=10
        local healthy=false
        
        while [ $retries -gt 0 ]; do
            if curl -sf "$url" >/dev/null 2>&1; then
                healthy=true
                break
            fi
            retries=$((retries - 1))
            sleep 2
        done
        
        if [ "$healthy" = true ]; then
            log_success "$name: healthy"
        else
            log_warning "$name: not responding (may still be starting)"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        log_success "All services healthy!"
    else
        log_warning "Some services may still be starting. Check docker logs for details."
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# Display Information
# ═══════════════════════════════════════════════════════════════════════════════

display_info() {
    log_step "📋 Deployment Information"
    
    local domain="${DOMAIN:-localhost}"
    
    echo -e "${CYAN}┌────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}           ${GREEN}Universal Crypto MCP Deployed!${NC}                  ${CYAN}│${NC}"
    echo -e "${CYAN}├────────────────────────────────────────────────────────────┤${NC}"
    echo -e "${CYAN}│${NC}                                                            ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}API Gateway:${NC}      https://$domain/api              ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Health Check:${NC}     https://$domain/health           ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}API Discovery:${NC}    https://$domain/api/x402/routes  ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                            ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${PURPLE}Monitoring:${NC}                                          ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Grafana:${NC}          http://localhost:3001             ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Prometheus:${NC}       http://localhost:9090             ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}AlertManager:${NC}     http://localhost:9093             ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                            ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${PURPLE}Payment Configuration:${NC}                               ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Wallet:${NC}           ${WALLET_ADDRESS:0:10}...${WALLET_ADDRESS: -8}    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Networks:${NC}         Base, Arbitrum, Polygon           ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                            ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${PURPLE}Grafana Credentials:${NC}                                 ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Username:${NC}         admin                             ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${YELLOW}Password:${NC}         (set in .env as GRAFANA_PASSWORD) ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                            ${CYAN}│${NC}"
    echo -e "${CYAN}└────────────────────────────────────────────────────────────┘${NC}"
    
    echo ""
    log_info "View logs: docker compose -f docker-compose.enterprise.yml logs -f"
    log_info "Stop: docker compose -f docker-compose.enterprise.yml down"
    log_info "Restart: docker compose -f docker-compose.enterprise.yml restart"
}

# ═══════════════════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}        ${GREEN}Universal Crypto MCP - Enterprise Deployment${NC}        ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}              ${YELLOW}x402 Payment Integration${NC}                     ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_prerequisites
    setup_environment
    setup_directories
    setup_ssl
    build_images
    start_services
    health_check
    display_info
    
    log_success "Deployment complete! 🎉"
}

# Run main with error handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    trap 'log_error "Deployment failed at line $LINENO"' ERR
    main "$@"
fi

