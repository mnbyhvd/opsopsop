# 🚀 Развертывание на продакшене

## Переменные окружения

### Для локальной разработки:
```bash
# .env.local (создать в корне проекта)
REACT_APP_API_URL=http://localhost:3001
```

### Для продакшена (Docker):
```bash
# В docker-compose.yml уже настроено:
REACT_APP_API_URL=/api
```

## Развертывание

### 1. Локальная разработка:
```bash
# Установить переменную окружения
export REACT_APP_API_URL=http://localhost:3001

# Запустить контейнеры
docker compose up -d
```

### 2. Продакшен:
```bash
# API URL автоматически настроен на /api для проксирования через Nginx
docker compose up -d
```

## Конфигурация API

API URL автоматически определяется:
- **Локально**: `http://localhost:3001/api/*`
- **Продакшен**: `/api/*` (проксируется через Nginx)

## Nginx конфигурация

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Фронтенд
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Админка
    location /admin {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Проверка

После развертывания проверьте:
- Фронтенд: http://your-domain.com
- Админка: http://your-domain.com/admin
- API: http://your-domain.com/api/hero

## Логи

```bash
# Проверить логи всех сервисов
docker compose logs

# Проверить конкретный сервис
docker compose logs backend
docker compose logs frontend
docker compose logs admin
```
