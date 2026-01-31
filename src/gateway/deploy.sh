#!/bin/bash
#
# x402 Gateway - One-Click Deploy Script
# Deploy to Railway, Fly.io, or Docker
#
# @author nich
# @github github.com/nirholas

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
cat << "EOF"
 __   __  _  _    ___   ____  
 \ \ / / | || |  / _ \ |___ \ 
  \ V /  | || |_| | | |  __) |
  /   \  |__   _| |_| | / __/ 
 /_/\_\    |_|  \___/ |_____|
                              
 GATEWAY DEPLOYMENT
EOF
echo -e "${NC}"

PAY_TO="${PAY_TO_ADDRESS:-0x40252CFDF8B20Ed757D61ff157719F33Ec332402}"
FACILITATOR="${FACILITATOR_URL:-https://x402.org/facilitator}"
NETWORK="${DEFAULT_NETWORK:-base}"

echo -e "${YELLOW}Configuration:${NC}"
echo "  Pay To: $PAY_TO"
echo "  Facilitator: $FACILITATOR"
echo "  Network: $NETWORK"
echo ""

deploy_docker() {
    echo -e "${GREEN}Deploying with Docker Compose...${NC}"
    
    cd "$(dirname "$0")"
    
    # Build and start services
    docker compose up -d --build
    
    echo -e "${GREEN}✓ Services started${NC}"
    echo ""
    echo "Gateway running at: http://localhost:3402"
    echo "Nginx proxy at: http://localhost:80"
    echo ""
    echo "Commands:"
    echo "  docker compose logs -f    # View logs"
    echo "  docker compose down       # Stop services"
    echo "  docker compose ps         # Check status"
}

deploy_railway() {
    echo -e "${GREEN}Deploying to Railway...${NC}"
    
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}Installing Railway CLI...${NC}"
        npm install -g @railway/cli
    fi
    
    railway login
    
    # Create project if needed
    railway init --name x402-gateway 2>/dev/null || true
    
    # Set environment variables
    railway variables set PAY_TO_ADDRESS="$PAY_TO"
    railway variables set FACILITATOR_URL="$FACILITATOR"
    railway variables set DEFAULT_NETWORK="$NETWORK"
    railway variables set NODE_ENV=production
    
    # Add Redis
    railway add --plugin redis
    
    # Deploy
    railway up --detach
    
    echo -e "${GREEN}✓ Deployed to Railway${NC}"
    railway open
}

deploy_fly() {
    echo -e "${GREEN}Deploying to Fly.io...${NC}"
    
    if ! command -v fly &> /dev/null; then
        echo -e "${YELLOW}Installing Fly CLI...${NC}"
        curl -L https://fly.io/install.sh | sh
    fi
    
    fly auth login
    
    # Create fly.toml if not exists
    if [ ! -f fly.toml ]; then
        cat > fly.toml << EOF
app = "x402-gateway"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3402"
  PAY_TO_ADDRESS = "$PAY_TO"
  FACILITATOR_URL = "$FACILITATOR"
  DEFAULT_NETWORK = "$NETWORK"

[http_service]
  internal_port = 3402
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  path = "/health"
  timeout = "5s"
EOF
    fi
    
    # Create Redis
    fly redis create --name x402-redis --region iad 2>/dev/null || true
    
    # Deploy
    fly deploy
    
    echo -e "${GREEN}✓ Deployed to Fly.io${NC}"
    fly open
}

deploy_vercel() {
    echo -e "${GREEN}Deploying to Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    # Create vercel.json if not exists
    if [ ! -f vercel.json ]; then
        cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "dist/gateway/x402-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/gateway/x402-server.js"
    }
  ],
  "env": {
    "PAY_TO_ADDRESS": "$PAY_TO",
    "FACILITATOR_URL": "$FACILITATOR",
    "DEFAULT_NETWORK": "$NETWORK"
  }
}
EOF
    fi
    
    vercel --prod
    
    echo -e "${GREEN}✓ Deployed to Vercel${NC}"
}

# Menu
echo -e "${CYAN}Select deployment target:${NC}"
echo "  1) Docker Compose (local/VPS)"
echo "  2) Railway (cloud)"
echo "  3) Fly.io (cloud)"
echo "  4) Vercel (serverless)"
echo ""
read -p "Choice [1-4]: " choice

case $choice in
    1) deploy_docker ;;
    2) deploy_railway ;;
    3) deploy_fly ;;
    4) deploy_vercel ;;
    *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  x402 Gateway deployed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Endpoints:"
echo "  POST /mcp      - MCP server (x402 protected)"
echo "  GET  /pricing  - View tool pricing"
echo "  GET  /stats    - Usage statistics"
echo "  GET  /health   - Health check"
echo ""
echo "Payment flows to: $PAY_TO"
echo ""
