# 🚀 Деплой проекта на Reg.ru через ISPmanager

## 📋 Подготовка

Проект уже собран в папке `deploy/` со следующими компонентами:
- **Фронтенд**: `deploy/frontend/` (React приложение)
- **Админка**: `deploy/admin/` (React админ панель)
- **Бэкенд**: `deploy/backend/` (Node.js API)
- **База данных**: `deploy/database/` (MySQL скрипты)

## 🔧 Шаги деплоя через ISPmanager

### 1. Вход в панель управления
- Откройте: https://server257.hosting.reg.ru:1500/
- Логин: `u3265044`
- Пароль: `JTghq57d06QNOf1K`

### 2. Создание базы данных MySQL

1. В панели ISPmanager перейдите в **"Базы данных"** → **"MySQL"**
2. Создайте новую базу данных:
   - **Имя базы**: `master_sps_db`
   - **Пользователь**: `master_sps_user`
   - **Пароль**: `MasterSPS2024!`
3. Запишите данные подключения:
   - **Хост**: `localhost` (или `127.0.0.1`)
   - **Порт**: `3306`
   - **База**: `master_sps_db`
   - **Пользователь**: `master_sps_user`
   - **Пароль**: `MasterSPS2024!`

### 3. Импорт структуры базы данных

1. Перейдите в **"Базы данных"** → **"phpMyAdmin"**
2. Выберите созданную базу `master_sps_db`
3. Перейдите на вкладку **"SQL"**
4. Скопируйте и выполните содержимое файла `deploy/database/init.sql`

### 4. Загрузка файлов через File Manager

1. В ISPmanager перейдите в **"Файлы"** → **"Файловый менеджер"**
2. Перейдите в корневую папку домена (обычно `/home/u3265044/domains/yourdomain.com/public_html/`)
3. Создайте структуру папок:
   ```
   public_html/
   ├── frontend/          # Файлы фронтенда
   ├── admin/             # Файлы админки
   ├── backend/           # Файлы бэкенда
   └── uploads/           # Папка для загрузок
   ```

### 5. Загрузка файлов

#### Фронтенд:
1. Загрузите все файлы из `deploy/frontend/` в папку `public_html/frontend/`
2. Убедитесь, что файл `index.html` находится в `public_html/frontend/index.html`

#### Админка:
1. Загрузите все файлы из `deploy/admin/` в папку `public_html/admin/`
2. Убедитесь, что файл `index.html` находится в `public_html/admin/index.html`

#### Бэкенд:
1. Загрузите все файлы из `deploy/backend/` в папку `public_html/backend/`
2. Убедитесь, что файл `server.js` находится в `public_html/backend/server.js`

### 6. Настройка Node.js приложения

1. В ISPmanager перейдите в **"WWW-домены"** → **"Node.js"**
2. Создайте новое Node.js приложение:
   - **Домен**: ваш домен
   - **Путь**: `/backend`
   - **Файл запуска**: `server.js`
   - **Порт**: `3001` (или любой доступный)

### 7. Настройка переменных окружения

В настройках Node.js приложения добавьте переменные окружения:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=master_sps_db
DB_USER=master_sps_user
DB_PASSWORD=MasterSPS2024!
NODE_ENV=production
PORT=3001
```

### 8. Настройка Nginx (если доступно)

Создайте конфигурацию Nginx для проксирования:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Фронтенд
    location / {
        root /home/u3265044/domains/yourdomain.com/public_html/frontend;
        try_files $uri $uri/ /index.html;
    }

    # Админка
    location /admin {
        alias /home/u3265044/domains/yourdomain.com/public_html/admin;
        try_files $uri $uri/ /admin/index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы
    location /uploads {
        alias /home/u3265044/domains/yourdomain.com/public_html/uploads;
    }
}
```

### 9. Запуск приложения

1. В настройках Node.js приложения нажмите **"Запустить"**
2. Проверьте логи на наличие ошибок
3. Убедитесь, что приложение запустилось на порту 3001

### 10. Проверка работы

1. **Фронтенд**: `http://yourdomain.com/`
2. **Админка**: `http://yourdomain.com/admin/`
3. **API**: `http://yourdomain.com/api/` (должен вернуть JSON)

## 🔧 Альтернативный способ через SSH (если доступен)

Если SSH доступен, можно использовать команды:

```bash
# Подключение к серверу
ssh u3265044@server257.hosting.reg.ru

# Загрузка файлов через scp
scp -r deploy/frontend/* u3265044@server257.hosting.reg.ru:domains/yourdomain.com/public_html/frontend/
scp -r deploy/admin/* u3265044@server257.hosting.reg.ru:domains/yourdomain.com/public_html/admin/
scp -r deploy/backend/* u3265044@server257.hosting.reg.ru:domains/yourdomain.com/public_html/backend/

# Установка зависимостей
cd domains/yourdomain.com/public_html/backend
npm install --production

# Запуск приложения
pm2 start server.js --name "master-sps-backend"
```

## 🐛 Устранение проблем

### Проблема: Node.js приложение не запускается
- Проверьте логи в панели ISPmanager
- Убедитесь, что все зависимости установлены
- Проверьте переменные окружения

### Проблема: База данных не подключается
- Проверьте данные подключения в переменных окружения
- Убедитесь, что база данных создана и импортирована
- Проверьте права пользователя базы данных

### Проблема: Статические файлы не загружаются
- Проверьте права доступа к папкам
- Убедитесь, что файлы загружены в правильные папки
- Проверьте конфигурацию Nginx

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в панели ISPmanager
2. Убедитесь, что все файлы загружены корректно
3. Проверьте настройки базы данных и Node.js приложения

---

**Важно**: Замените `yourdomain.com` на ваш реальный домен во всех конфигурациях!
