#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Universal Crypto MCP - SSL Setup Script
# ═══════════════════════════════════════════════════════════════════════════════
#
# Sets up SSL certificates using Let's Encrypt or self-signed
#
# @author nirholas
# @license Apache-2.0
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
SSL_DIR="$DEPLOY_DIR/ssl/certs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Load environment
if [ -f "$DEPLOY_DIR/.env" ]; then
    set -a
    source "$DEPLOY_DIR/.env"
    set +a
fi

DOMAIN="${DOMAIN:-localhost}"
EMAIL="${SSL_EMAIL:-admin@$DOMAIN}"

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --letsencrypt    Use Let's Encrypt for production certificates"
    echo "  --self-signed    Generate self-signed certificates (default)"
    echo "  --renew          Renew existing Let's Encrypt certificates"
    echo "  --domain DOMAIN  Override domain from .env"
    echo "  --email EMAIL    Email for Let's Encrypt notifications"
    echo "  -h, --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --letsencrypt --domain api.example.com"
    echo "  $0 --self-signed"
    echo "  $0 --renew"
}

generate_self_signed() {
    log_info "Generating self-signed certificate for: $DOMAIN"
    
    mkdir -p "$SSL_DIR"
    
    # Generate private key and certificate
    openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
        -keyout "$SSL_DIR/privkey.pem" \
        -out "$SSL_DIR/fullchain.pem" \
        -subj "/CN=$DOMAIN/O=Universal Crypto MCP/C=US" \
        -addext "subjectAltName=DNS:$DOMAIN,DNS:*.$DOMAIN,DNS:localhost,IP:127.0.0.1"
    
    # Create combined file for some servers
    cat "$SSL_DIR/fullchain.pem" "$SSL_DIR/privkey.pem" > "$SSL_DIR/combined.pem"
    
    # Set permissions
    chmod 644 "$SSL_DIR/fullchain.pem"
    chmod 600 "$SSL_DIR/privkey.pem"
    chmod 600 "$SSL_DIR/combined.pem"
    
    log_success "Self-signed certificate generated!"
    log_warning "For production, use --letsencrypt option"
}

setup_letsencrypt() {
    log_info "Setting up Let's Encrypt for: $DOMAIN"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        log_info "Installing certbot..."
        
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y certbot
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot
        elif command -v brew &> /dev/null; then
            brew install certbot
        else
            log_error "Cannot install certbot. Please install manually."
        fi
    fi
    
    # Stop nginx temporarily if running
    if docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" ps nginx 2>/dev/null | grep -q "running"; then
        log_info "Stopping nginx temporarily..."
        docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" stop nginx
        NGINX_WAS_RUNNING=true
    fi
    
    # Get certificate using standalone mode
    log_info "Requesting certificate from Let's Encrypt..."
    sudo certbot certonly --standalone \
        -d "$DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        --http-01-port 80
    
    # Copy certificates to our directory
    mkdir -p "$SSL_DIR"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/"
    sudo chown "$(whoami):$(whoami)" "$SSL_DIR/"*.pem
    chmod 644 "$SSL_DIR/fullchain.pem"
    chmod 600 "$SSL_DIR/privkey.pem"
    
    # Restart nginx if it was running
    if [ "${NGINX_WAS_RUNNING:-false}" = "true" ]; then
        log_info "Restarting nginx..."
        docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" start nginx
    fi
    
    # Setup auto-renewal
    setup_auto_renewal
    
    log_success "Let's Encrypt certificate installed!"
}

renew_letsencrypt() {
    log_info "Renewing Let's Encrypt certificates..."
    
    sudo certbot renew --quiet
    
    # Copy renewed certificates
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/"
        sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/"
        sudo chown "$(whoami):$(whoami)" "$SSL_DIR/"*.pem
        
        # Reload nginx
        docker compose -f "$DEPLOY_DIR/docker-compose.enterprise.yml" exec nginx nginx -s reload 2>/dev/null || true
        
        log_success "Certificates renewed!"
    else
        log_warning "No certificates found for $DOMAIN"
    fi
}

setup_auto_renewal() {
    log_info "Setting up automatic renewal..."
    
    # Create renewal script
    cat > "$SCRIPT_DIR/renew-certs.sh" << 'RENEW_EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/ssl-setup.sh" --renew
RENEW_EOF
    
    chmod +x "$SCRIPT_DIR/renew-certs.sh"
    
    # Add cron job (runs twice daily as recommended by Let's Encrypt)
    CRON_JOB="0 0,12 * * * $SCRIPT_DIR/renew-certs.sh >> /var/log/ucm-ssl-renewal.log 2>&1"
    
    # Check if cron job already exists
    if ! crontab -l 2>/dev/null | grep -q "renew-certs.sh"; then
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        log_success "Auto-renewal cron job added"
    else
        log_info "Auto-renewal cron job already exists"
    fi
}

verify_certificate() {
    log_info "Verifying certificate..."
    
    if [ ! -f "$SSL_DIR/fullchain.pem" ]; then
        log_error "Certificate not found at $SSL_DIR/fullchain.pem"
    fi
    
    # Check certificate details
    echo ""
    openssl x509 -in "$SSL_DIR/fullchain.pem" -noout -subject -dates -issuer
    echo ""
    
    # Check expiration
    local expires
    expires=$(openssl x509 -in "$SSL_DIR/fullchain.pem" -noout -enddate | cut -d= -f2)
    local expires_epoch
    expires_epoch=$(date -d "$expires" +%s)
    local now_epoch
    now_epoch=$(date +%s)
    local days_left=$(( (expires_epoch - now_epoch) / 86400 ))
    
    if [ $days_left -lt 30 ]; then
        log_warning "Certificate expires in $days_left days - consider renewing"
    else
        log_success "Certificate valid for $days_left more days"
    fi
}

# Parse arguments
MODE="self-signed"

while [[ $# -gt 0 ]]; do
    case $1 in
        --letsencrypt)
            MODE="letsencrypt"
            shift
            ;;
        --self-signed)
            MODE="self-signed"
            shift
            ;;
        --renew)
            MODE="renew"
            shift
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            ;;
    esac
done

# Main
case $MODE in
    self-signed)
        generate_self_signed
        ;;
    letsencrypt)
        setup_letsencrypt
        ;;
    renew)
        renew_letsencrypt
        ;;
esac

verify_certificate
