# Деплой на production (sps-master.ru)

## Быстрый деплой (обновление кода)

```bash
# 1. Залить изменения на сервер
git pull origin main

# 2. Пересобрать и перезапустить контейнеры
docker compose -f docker-compose.prod.yml up --build -d

# 3. Проверить статус
docker ps
```

---

## Деплой с миграцией БД

Используется когда изменяется схема базы данных (добавление таблиц, колонок, изменение типов).

```bash
# 1. Залить изменения
git pull origin main

# 2. Применить миграцию вручную (docker-entrypoint-initdb.d НЕ перезапускается автоматически)
docker exec opsopsop-db mysql -u master_sps_user -p'MasterSPS2024!' master_sps < database/migration_fix.sql

# 3. Пересобрать контейнеры
docker compose -f docker-compose.prod.yml up --build -d
```

> **Важно:** `docker-entrypoint-initdb.d` запускает SQL-скрипты только при первом старте БД (пустой volume).
> Для уже работающей базы всегда применяй миграции вручную через шаг 2.

---

## Исправление презентаций (разовая миграция)

Если презентации не сохраняются (ошибка 500 при POST /api/documents с type='presentation'):

```bash
docker exec opsopsop-db mysql -u master_sps_user -p'MasterSPS2024!' master_sps \
  -e "ALTER TABLE documents MODIFY COLUMN type ENUM('document', 'certificate', 'presentation') NOT NULL DEFAULT 'document';"
```

Проверить результат:
```bash
docker exec opsopsop-db mysql -u master_sps_user -p'MasterSPS2024!' master_sps \
  -e "DESCRIBE documents;"
```

---

## Полный первый деплой (с нуля)

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd opsopsop

# 2. Запустить всё
docker compose -f docker-compose.prod.yml up --build -d

# 3. БД инициализируется автоматически из database/init.sql и database/migration_fix.sql
# (только при первом старте с пустым volume mysql_data)
```

---

## Полезные команды

```bash
# Логи backend (смотреть ошибки БД)
docker logs opsopsop-backend --tail=100 -f

# Логи БД
docker logs opsopsop-db --tail=50

# Войти в БД вручную
docker exec -it opsopsop-db mysql -u master_sps_user -p'MasterSPS2024!' master_sps

# Перезапустить только backend (без пересборки)
docker compose -f docker-compose.prod.yml restart backend

# Пересобрать только frontend
docker compose -f docker-compose.prod.yml up --build -d frontend

# Пересобрать только admin
docker compose -f docker-compose.prod.yml up --build -d admin

# Проверить API
curl https://sps-master.ru/api/documents
```

---

## Структура контейнеров

| Контейнер         | Роль            | Порт  |
|-------------------|-----------------|-------|
| opsopsop-db       | MySQL 8.0       | 3306  |
| opsopsop-backend  | Node.js API     | 3001  |
| opsopsop-frontend | React фронтенд  | 80    |
| opsopsop-admin    | React админка   | 80    |
| opsopsop-nginx    | Reverse proxy   | 80/443|
