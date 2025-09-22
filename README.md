# 🚀 Master SPS - Система пожаротушения

## 📋 Описание проекта

Веб-сайт для компании Master SPS - производителя систем автоматического пожаротушения.

### 🏗️ Архитектура

- **Frontend** (React + TypeScript) - основной сайт
- **Admin** (React + TypeScript) - панель управления
- **Backend** (Node.js + Express) - API сервер
- **Database** (MySQL) - хранение данных

### 🐳 Docker развертывание

#### Быстрый старт:
```bash
# Клонируйте репозиторий
git clone <repository-url>
cd master-sps

# Запустите все сервисы
docker-compose -f docker-compose.prod.yml up -d --build

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps
```

#### Настройка переменных окружения:
```bash
# Создайте .env файл
cp .env.example .env

# Отредактируйте настройки
nano .env
```

### 🌐 Доступ к приложению

- **Фронтенд**: http://localhost:3000
- **Админка**: http://localhost:3002
- **API**: http://localhost:3001

### 🔧 Управление

#### Просмотр логов:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

#### Перезапуск сервисов:
```bash
docker-compose -f docker-compose.prod.yml restart
```

#### Остановка всех сервисов:
```bash
docker-compose -f docker-compose.prod.yml down
```

### 📁 Структура проекта

```
master-sps/
├── frontend/          # React фронтенд
├── admin/             # React админка
├── backend/           # Node.js API
├── database/          # SQL скрипты
├── docker-compose.yml # Docker конфигурация
└── README.md
```

### 🛠️ Разработка

#### Установка зависимостей:
```bash
# Frontend
cd frontend && npm install

# Admin
cd admin && npm install

# Backend
cd backend && npm install
```

#### Запуск в режиме разработки:
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start

# Admin
cd admin && npm start
```

### 📊 База данных

#### Создание базы данных:
```bash
# Подключитесь к MySQL
docker exec -it master_sps_db mysql -u root -p

# Импортируйте схему
source /docker-entrypoint-initdb.d/init.sql
```

### 🔐 Безопасность

- Все пароли хранятся в переменных окружения
- CORS настроен для всех доменов
- Helmet для безопасности HTTP заголовков

### 📞 Поддержка

При возникновении проблем:
1. Проверьте логи контейнеров
2. Убедитесь, что все сервисы запущены
3. Проверьте подключение к базе данных

---

**Версия**: 1.0.0  
**Лицензия**: MIT