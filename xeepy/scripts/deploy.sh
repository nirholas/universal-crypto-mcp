#!/bin/bash
# Xeepy Deployment Script for Production

set -e

echo "=========================================="
echo "Xeepy Production Deployment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env from .env.example and configure it"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found .env file"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker is installed"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker Compose is installed"

# Pull latest changes (if in git repo)
if [ -d .git ]; then
    echo ""
    echo "Pulling latest changes..."
    git pull
    echo -e "${GREEN}✓${NC} Code updated"
fi

# Build images
echo ""
echo "Building Docker images..."
docker-compose build --no-cache

echo -e "${GREEN}✓${NC} Images built"

# Stop existing containers
echo ""
echo "Stopping existing containers..."
docker-compose down

# Start services
echo ""
echo "Starting services..."
docker-compose up -d

echo -e "${GREEN}✓${NC} Services started"

# Wait for services to be healthy
echo ""
echo "Waiting for services to be healthy..."
sleep 10

# Check health
echo ""
echo "Checking service health..."

if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API server is healthy"
else
    echo -e "${RED}✗${NC} API server is not responding"
    echo "Check logs with: docker-compose logs xeepy-api"
    exit 1
fi

# Show status
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Services:"
echo "  API:        http://localhost:8000"
echo "  Docs:       http://localhost:8000/docs"
echo "  Prometheus: http://localhost:9090"
echo "  Grafana:    http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f xeepy-api    # View logs"
echo "  docker-compose ps                    # Check status"
echo "  docker-compose down                  # Stop services"
echo "  docker-compose restart xeepy-api     # Restart API"
echo ""
echo -e "${GREEN}🚀 Xeepy is now running!${NC}"
