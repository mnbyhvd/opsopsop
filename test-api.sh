#!/bin/bash

# API Testing Script
set -e

echo "🧪 Testing all API endpoints..."

BASE_URL="http://localhost:3001"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test function
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local data=$3
    
    echo -n "Testing $method $endpoint... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Test all GET endpoints
echo -e "\n${YELLOW}📡 Testing GET endpoints...${NC}"
test_endpoint "/api/hero"
test_endpoint "/api/navigation"
test_endpoint "/api/products"
test_endpoint "/api/about"
test_endpoint "/api/advantages"
test_endpoint "/api/technical-specs"
test_endpoint "/api/footer"
test_endpoint "/api/videos"
test_endpoint "/api/scroll-section"
test_endpoint "/api/documents"
test_endpoint "/api/footer-settings"
test_endpoint "/api/product-modals/1"
test_endpoint "/api/leads"

# Test POST endpoints
echo -e "\n${YELLOW}📝 Testing POST endpoints...${NC}"
test_endpoint "/api/leads" "POST" '{"name":"Test User","email":"test@example.com","phone":"+7 999 999-99-99","message":"Test message"}'

# Test frontend and admin
echo -e "\n${YELLOW}🌐 Testing frontend and admin...${NC}"
echo -n "Testing Frontend (http://localhost:3000)... "
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

echo -n "Testing Admin (http://localhost:3002)... "
if curl -s -I http://localhost:3002 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

echo -e "\n${GREEN}🎉 API testing completed!${NC}"
