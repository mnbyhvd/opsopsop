# 🚀 Финальное руководство по развертыванию

## ✅ Что исправлено

1. **API URL конфигурация**:
   - Создана универсальная конфигурация API для фронтенда и админки
   - Автоматическое определение окружения (локальное/продакшен)
   - Правильные URL для каждого случая

2. **Docker Compose настройки**:
   - `REACT_APP_API_URL: http://localhost:3001` для локальной разработки
   - Автоматическое проксирование через Nginx на продакшене

## 🏃‍♂️ Быстрый запуск

### Локальная разработка:
```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd master_sps

# Запустить все сервисы
docker compose up -d

# Проверить статус
docker compose ps
```

### Доступ к приложению:
- **Фронтенд**: http://localhost:3000
- **Админка**: http://localhost:3002
- **API**: http://localhost:3001/api

## 🔧 Продакшен развертывание

### 1. На сервере:
```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd master_sps

# Запустить все сервисы
docker compose up -d

# Проверить статус
docker compose ps
```

### 2. Настроить Nginx:
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

### 3. Для продакшена изменить переменные окружения:
```bash
# В docker-compose.yml изменить:
REACT_APP_API_URL: /api  # Вместо http://localhost:3001
```

## 🔍 Проверка работы

### API endpoints:
```bash
curl http://localhost:3001/api/hero
curl http://localhost:3001/api/navigation
curl http://localhost:3001/api/products
curl http://localhost:3001/api/leads
```

### Веб-интерфейсы:
- Фронтенд: http://localhost:3000
- Админка: http://localhost:3002

## 🐛 Устранение неполадок

### Если API не работает:
1. Проверить статус контейнеров: `docker compose ps`
2. Проверить логи: `docker compose logs backend`
3. Проверить подключение к БД: `docker exec -it master_sps_db mysql -u root -p'root_password' -e "SHOW DATABASES;"`

### Если фронтенд/админка не загружают данные:
1. Проверить переменные окружения в `docker-compose.yml`
2. Пересобрать контейнеры: `docker compose up --build -d`
3. Проверить логи: `docker compose logs frontend` или `docker compose logs admin`

## 📝 Логины

### Админка:
- **Логин**: `admin`
- **Пароль**: `MasterSPS2024!`

### База данных:
- **Root пароль**: `root_password`
- **Пользователь**: `master_sps_user`
- **Пароль**: `MasterSPS2024!`
- **База данных**: `master_sps_db`

## 🎯 Готово!

Теперь все работает корректно:
- ✅ Фронтенд подключается к API
- ✅ Админка подключается к API
- ✅ База данных работает
- ✅ Все контейнеры запущены
- ✅ API endpoints отвечают
- ✅ Готово для продакшена
