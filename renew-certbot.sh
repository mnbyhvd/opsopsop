#!/bin/bash

# Скрипт для обновления SSL сертификатов

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Обновление SSL сертификатов...${NC}"

# Проверка существования директории ssl
if [ ! -d "./ssl" ]; then
    echo -e "${YELLOW}📁 Создание директории ssl...${NC}"
    mkdir -p ssl
fi

# Запуск certbot для получения/обновления сертификата
echo -e "${YELLOW}🔐 Запуск certbot...${NC}"

# Сначала пробуем обновить существующий сертификат
docker compose -f docker-compose.prod.yml --profile certbot run --rm certbot renew 2>&1 || {
    echo -e "${YELLOW}⚠️ Обновление не удалось, пробуем получить новый сертификат...${NC}"
    docker compose -f docker-compose.prod.yml --profile certbot run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email vikulindmitrii@yandex.ru \
        --agree-tos \
        --no-eff-email \
        -d sps-master.ru 2>&1
}

# Копирование сертификатов из контейнера
echo -e "${YELLOW}📋 Копирование сертификатов...${NC}"
if docker ps -a | grep -q "opsopsop-certbot"; then
    # Копируем из volume certbot
    docker run --rm \
        -v master_sps_certbot_webroot:/source \
        -v $(pwd)/ssl:/dest \
        alpine sh -c "if [ -f /source/cert.pem ]; then cp /source/cert.pem /dest/cert.pem; fi" 2>&1 || true
    
    # Пытаемся скопировать из /etc/letsencrypt
    docker run --rm \
        -v $(pwd)/ssl:/source \
        alpine sh -c "ls -la /source" 2>&1 || true
fi

# Если сертификаты в стандартном месте Let's Encrypt
if [ -d "/etc/letsencrypt/live/sps-master.ru" ]; then
    echo -e "${YELLOW}📋 Копирование из /etc/letsencrypt...${NC}"
    sudo cp /etc/letsencrypt/live/sps-master.ru/fullchain.pem ./ssl/cert.pem 2>&1 || true
    sudo cp /etc/letsencrypt/live/sps-master.ru/privkey.pem ./ssl/key.pem 2>&1 || true
    sudo chown $USER:$USER ./ssl/cert.pem ./ssl/key.pem 2>&1 || true
fi

# Перезапуск nginx для применения новых сертификатов
echo -e "${YELLOW}🔄 Перезапуск nginx...${NC}"
docker compose -f docker-compose.prod.yml restart nginx 2>&1 || {
    echo -e "${RED}❌ Не удалось перезапустить nginx${NC}"
    exit 1
}

echo -e "${GREEN}✅ Обновление завершено${NC}"
echo -e "${YELLOW}💡 Проверьте сертификаты командой: ./check-certbot.sh${NC}"

