# 🔧 Конфигурация Nginx для доступа к админке и фронтенду

## 📋 Проблема
После загрузки файлов нужно настроить веб-сервер, чтобы:
- **Фронтенд** был доступен по `http://yourdomain.com/`
- **Админка** была доступна по `http://yourdomain.com/admin/`
- **API** работало по `http://yourdomain.com/api/`

## ⚙️ Решение через ISPmanager

### 1. Настройка домена
1. В панели ISPmanager перейдите в **"WWW-домены"**
2. Выберите ваш домен
3. Перейдите в **"Настройки"** → **"Веб-сервер"**

### 2. Конфигурация Nginx
Добавьте следующую конфигурацию в настройки Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /home/u3265044/domains/yourdomain.com/public_html;
    index index.html;

    # Логи
    access_log /home/u3265044/domains/yourdomain.com/logs/access.log;
    error_log /home/u3265044/domains/yourdomain.com/logs/error.log;

    # Основной сайт (фронтенд)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Кэширование статических файлов
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Админка
    location /admin {
        alias /home/u3265044/domains/yourdomain.com/public_html/admin;
        try_files $uri $uri/ /admin/index.html;
        
        # Кэширование статических файлов админки
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API (проксирование на Node.js)
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
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Загрузки
    location /uploads {
        alias /home/u3265044/domains/yourdomain.com/public_html/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Безопасность
    location ~ /\. {
        deny all;
    }
}
```

### 3. Альтернативный способ (если нет доступа к Nginx)

Если нет прямого доступа к конфигурации Nginx, создайте файл `.htaccess` в корне `public_html/`:

```apache
RewriteEngine On

# API - проксирование на Node.js
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Админка
RewriteRule ^admin$ /admin/ [R=301,L]
RewriteRule ^admin/(.*)$ /admin/$1 [L]

# Фронтенд - SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/admin
RewriteCond %{REQUEST_URI} !^/api
RewriteRule . /index.html [L]
```

## 🔧 Настройка Node.js

### 1. Создание Node.js приложения
1. **WWW-домены** → **Node.js** → **Создать**
2. **Домен**: ваш домен
3. **Путь**: `/backend`
4. **Файл запуска**: `server.js`
5. **Порт**: `3001`

### 2. Переменные окружения
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=master_sps_db
DB_USER=master_sps_user
DB_PASSWORD=MasterSPS2024!
NODE_ENV=production
PORT=3001
```

### 3. Запуск приложения
1. Нажмите **"Запустить"** в настройках Node.js
2. Проверьте логи на наличие ошибок
3. Убедитесь, что приложение запустилось на порту 3001

## 🧪 Проверка работы

После настройки проверьте:

1. **Фронтенд**: `http://yourdomain.com/`
   - Должна загрузиться главная страница
   - Все статические файлы должны загружаться

2. **Админка**: `http://yourdomain.com/admin/`
   - Должна загрузиться админ панель
   - Логин: `admin`, Пароль: `admin123`

3. **API**: `http://yourdomain.com/api/`
   - Должен вернуть JSON с информацией о API

4. **База данных**: Проверьте, что API возвращает данные из базы

## 🐛 Устранение проблем

### Проблема: 404 ошибка для админки
**Решение**: Проверьте, что файлы админки находятся в папке `public_html/admin/`

### Проблема: API не работает
**Решение**: 
1. Убедитесь, что Node.js приложение запущено
2. Проверьте, что порт 3001 доступен
3. Проверьте переменные окружения

### Проблема: Статические файлы не загружаются
**Решение**: Проверьте права доступа к папкам и файлам

### Проблема: SPA routing не работает
**Решение**: Убедитесь, что настроен fallback на `index.html` для всех маршрутов

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи Nginx: `/home/u3265044/domains/yourdomain.com/logs/error.log`
2. Проверьте логи Node.js в панели ISPmanager
3. Убедитесь, что все файлы загружены в правильные папки

---

**Важно**: Замените `yourdomain.com` на ваш реальный домен во всех конфигурациях!
