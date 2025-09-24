#!/bin/bash

# Production Deployment Script with HTTPS
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if domain is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Please provide domain name${NC}"
    echo "Usage: ./deploy-production.sh yourdomain.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-admin@$DOMAIN}

echo -e "${YELLOW}📋 Domain: $DOMAIN${NC}"
echo -e "${YELLOW}📧 Email: $EMAIL${NC}"

# Update nginx config with domain
echo -e "${YELLOW}🔧 Updating nginx configuration...${NC}"
sed -i.bak "s/yourdomain.com/$DOMAIN/g" nginx.prod.conf
sed -i.bak "s/your-email@example.com/$EMAIL/g" production.env
sed -i.bak "s/yourdomain.com/$DOMAIN/g" production.env

# Create SSL directory
echo -e "${YELLOW}📁 Creating SSL directory...${NC}"
mkdir -p ssl

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Certbot...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot
    else
        echo -e "${RED}❌ Cannot install Certbot automatically. Please install it manually.${NC}"
        exit 1
    fi
fi

# Generate SSL certificate
echo -e "${YELLOW}🔐 Generating SSL certificate...${NC}"
sudo certbot certonly --standalone --non-interactive --agree-tos --email $EMAIL -d $DOMAIN

# Copy certificates
echo -e "${YELLOW}📋 Copying SSL certificates...${NC}"
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem

# Build and start services
echo -e "${YELLOW}🏗️ Building and starting services...${NC}"
docker compose -f docker-compose.prod.yml --env-file production.env up --build -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check if services are running
echo -e "${YELLOW}🔍 Checking service status...${NC}"
if docker ps | grep -q "master_sps_nginx"; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx failed to start${NC}"
    exit 1
fi

if docker ps | grep -q "master_sps_backend"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi

if docker ps | grep -q "master_sps_frontend"; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    exit 1
fi

if docker ps | grep -q "master_sps_admin"; then
    echo -e "${GREEN}✅ Admin panel is running${NC}"
else
    echo -e "${RED}❌ Admin panel failed to start${NC}"
    exit 1
fi

# Test HTTPS
echo -e "${YELLOW}🧪 Testing HTTPS connection...${NC}"
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    echo -e "${GREEN}✅ HTTPS is working${NC}"
else
    echo -e "${RED}❌ HTTPS test failed${NC}"
    exit 1
fi

# Setup auto-renewal
echo -e "${YELLOW}🔄 Setting up SSL auto-renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --renew-hook 'docker compose -f docker-compose.prod.yml restart nginx'") | crontab -

echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend: https://$DOMAIN${NC}"
echo -e "${GREEN}🔧 Admin: https://$DOMAIN/admin${NC}"
echo -e "${GREEN}📡 API: https://$DOMAIN/api${NC}"
