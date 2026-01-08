#!/bin/bash

# Скрипт для проверки и обновления SSL сертификатов

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Проверка SSL сертификатов...${NC}"

# Проверка существования директории ssl
if [ ! -d "./ssl" ]; then
    echo -e "${YELLOW}📁 Создание директории ssl...${NC}"
    mkdir -p ssl
fi

# Проверка сертификатов в контейнере certbot
echo -e "${YELLOW}📋 Проверка сертификатов в certbot контейнере...${NC}"
if docker ps -a | grep -q "opsopsop-certbot"; then
    echo -e "${GREEN}✅ Certbot контейнер найден${NC}"
    
    # Проверка логов certbot
    echo -e "${YELLOW}📜 Последние логи certbot:${NC}"
    docker logs opsopsop-certbot --tail=50 2>&1 || echo -e "${RED}❌ Не удалось получить логи${NC}"
    
    # Попытка проверить сертификаты через certbot
    echo -e "${YELLOW}🔐 Проверка сертификатов через certbot...${NC}"
    docker exec opsopsop-certbot certbot certificates 2>&1 || {
        echo -e "${YELLOW}⚠️ Certbot контейнер не запущен, проверяем через временный контейнер...${NC}"
        docker compose -f docker-compose.prod.yml --profile certbot run --rm certbot certificates 2>&1 || echo -e "${YELLOW}⚠️ Сертификаты не найдены${NC}"
    }
else
    echo -e "${RED}❌ Certbot контейнер не найден${NC}"
fi

# Проверка файлов сертификатов
echo -e "${YELLOW}📄 Проверка файлов сертификатов в директории ssl...${NC}"
if [ -f "./ssl/cert.pem" ] && [ -f "./ssl/key.pem" ]; then
    echo -e "${GREEN}✅ Файлы сертификатов найдены${NC}"
    
    # Проверка срока действия сертификата
    if command -v openssl &> /dev/null; then
        echo -e "${YELLOW}📅 Информация о сертификате:${NC}"
        openssl x509 -in ./ssl/cert.pem -noout -subject -dates 2>&1 || echo -e "${RED}❌ Не удалось прочитать сертификат${NC}"
    fi
else
    echo -e "${RED}❌ Файлы сертификатов не найдены в ./ssl/${NC}"
    echo -e "${YELLOW}💡 Для получения нового сертификата выполните:${NC}"
    echo "   docker compose -f docker-compose.prod.yml run --rm certbot"
fi

# Проверка nginx конфигурации
echo -e "${YELLOW}🔧 Проверка конфигурации nginx...${NC}"
if docker ps | grep -q "opsopsop-nginx"; then
    docker exec opsopsop-nginx nginx -t 2>&1 || echo -e "${RED}❌ Ошибка в конфигурации nginx${NC}"
else
    echo -e "${YELLOW}⚠️ Nginx контейнер не запущен${NC}"
fi

# Проверка доступности сертификатов через HTTPS
echo -e "${YELLOW}🌐 Проверка доступности через HTTPS...${NC}"
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://sps-master.ru 2>&1 || echo "000")
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
        echo -e "${GREEN}✅ HTTPS доступен (код: $RESPONSE)${NC}"
    else
        echo -e "${RED}❌ HTTPS недоступен (код: $RESPONSE)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ curl не установлен, пропускаем проверку HTTPS${NC}"
fi

echo -e "${YELLOW}✅ Проверка завершена${NC}"

