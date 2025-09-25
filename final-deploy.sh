#!/bin/bash

echo "🚀 ФИНАЛЬНЫЙ ДЕПЛОЙ - РЕШЕНИЕ ВСЕХ ПРОБЛЕМ"
echo "=========================================="

echo "1. Остановка всех контейнеров..."
docker compose -f docker-compose.prod.yml down

echo "2. Удаление старых образов..."
docker image rm opsopsop-frontend opsopsop-admin opsopsop-backend opsopsop-nginx 2>/dev/null || true

echo "3. Очистка неиспользуемых ресурсов..."
docker system prune -f

echo "4. Пересборка и запуск backend..."
docker compose -f docker-compose.prod.yml up -d --build backend

echo "5. Ожидание запуска backend (30 сек)..."
sleep 30

echo "6. Проверка backend..."
docker logs opsopsop-backend --tail=10

echo "7. Пересборка и запуск frontend..."
docker compose -f docker-compose.prod.yml up -d --build frontend

echo "8. Ожидание запуска frontend (30 сек)..."
sleep 30

echo "9. Проверка frontend..."
docker logs opsopsop-frontend --tail=10

echo "10. Пересборка и запуск admin..."
docker compose -f docker-compose.prod.yml up -d --build admin

echo "11. Ожидание запуска admin (30 сек)..."
sleep 30

echo "12. Проверка admin..."
docker logs opsopsop-admin --tail=10

echo "13. Запуск nginx..."
docker compose -f docker-compose.prod.yml up -d nginx

echo "14. Ожидание запуска nginx (10 сек)..."
sleep 10

echo "15. Проверка nginx конфигурации..."
docker exec opsopsop-nginx nginx -t

echo "16. Перезагрузка nginx..."
docker exec opsopsop-nginx nginx -s reload

echo "17. Финальная проверка статуса..."
docker ps

echo "18. Тестирование API..."
curl -k https://sps-master.ru/api/hero || echo "❌ API недоступен"

echo "19. Тестирование админки..."
curl -k https://sps-master.ru/admin || echo "❌ Админка недоступна"

echo "20. Тестирование фронтенда..."
curl -k https://sps-master.ru/ || echo "❌ Фронтенд недоступен"

echo "✅ ФИНАЛЬНЫЙ ДЕПЛОЙ ЗАВЕРШЕН!"
echo "=============================="
echo "🌐 Фронтенд: https://sps-master.ru/"
echo "🔧 Админка: https://sps-master.ru/admin"
echo "📡 API: https://sps-master.ru/api/"
