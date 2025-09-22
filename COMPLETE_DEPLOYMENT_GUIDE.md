# 🚀 Полный гайд по деплою проекта Master SPS на Reg.ru

## 📋 Обзор проекта

Проект состоит из:
- **Фронтенд** (React) - основной сайт
- **Админка** (React) - панель управления
- **Бэкенд** (Node.js) - API сервер
- **База данных** (MySQL) - хранение данных

## 🎯 Цель деплоя

Настроить доступ к:
- **Фронтенд**: `http://yourdomain.com/`
- **Админка**: `http://yourdomain.com/admin/`
- **API**: `http://yourdomain.com/api/`

## 📦 Подготовка

### Готовые файлы
- **Архив**: `master-sps-organized.tar.gz` (9.7MB)
- **База данных**: `database/init.sql`
- **Конфигурации**: Nginx, Node.js, PM2

### Структура после распаковки
```
public_html/
├── index.html         # Фронтенд (главная страница)
├── static/            # Статические файлы фронтенда
├── images/            # Изображения фронтенда
├── videos/            # Видео фронтенда
├── admin/             # Админка (доступна по /admin/)
│   ├── index.html
│   └── static/
├── backend/           # Node.js API
│   ├── server.js
│   └── routes/
├── database/          # SQL скрипты
└── uploads/           # Папка для загрузок
```

---

## 🔧 Шаг 1: Вход в панель управления

1. Откройте браузер и перейдите по адресу: **https://server257.hosting.reg.ru:1500/**
2. Введите данные для входа:
   - **Логин**: `u3265044`
   - **Пароль**: `JTghq57d06QNOf1K`
3. Нажмите **"Войти"**

---

## 🗄️ Шаг 2: Создание базы данных MySQL

### 2.1 Создание базы данных
1. В панели ISPmanager перейдите в **"Базы данных"** → **"MySQL"**
2. Нажмите **"Создать"**
3. Заполните форму:
   - **Имя базы данных**: `master_sps_db`
   - **Пользователь**: `master_sps_user`
   - **Пароль**: `MasterSPS2024!`
   - **Подтверждение пароля**: `MasterSPS2024!`
4. Нажмите **"Создать"**

### 2.2 Запишите данные подключения
```
Хост: localhost (или 127.0.0.1)
Порт: 3306
База данных: master_sps_db
Пользователь: master_sps_user
Пароль: MasterSPS2024!
```

---

## 📊 Шаг 3: Импорт структуры базы данных

### 3.1 Открытие phpMyAdmin
1. В панели ISPmanager перейдите в **"Базы данных"** → **"phpMyAdmin"**
2. Выберите созданную базу `master_sps_db`

### 3.2 Импорт данных
1. Перейдите на вкладку **"SQL"**
2. Скопируйте содержимое файла `database/init.sql` из архива
3. Вставьте SQL код в текстовое поле
4. Нажмите **"Выполнить"**

### 3.3 Проверка импорта
Убедитесь, что созданы таблицы:
- `admin_users`
- `navigation`
- `hero`
- `about`
- `advantages`
- `products`
- `videos`
- `scroll_section`
- `technical_specs`
- `footer`
- `footer_settings`
- `requisites`
- `leads`
- `product_modals`
- `documents`
- `certificates`

---

## 📁 Шаг 4: Загрузка файлов

### 4.1 Открытие файлового менеджера
1. В панели ISPmanager перейдите в **"Файлы"** → **"Файловый менеджер"**
2. Перейдите в корневую папку домена: `/home/u3265044/domains/yourdomain.com/public_html/`

### 4.2 Загрузка архива
1. Нажмите **"Загрузить файлы"**
2. Выберите файл `master-sps-organized.tar.gz`
3. Дождитесь завершения загрузки

### 4.3 Распаковка архива
1. Найдите загруженный файл `master-sps-organized.tar.gz`
2. Щелкните правой кнопкой мыши → **"Распаковать"**
3. Выберите **"Распаковать здесь"**
4. Дождитесь завершения распаковки

### 4.4 Проверка структуры
Убедитесь, что файлы расположены правильно:
```
public_html/
├── index.html         # ✅ Фронтенд
├── static/            # ✅ Статические файлы
├── images/            # ✅ Изображения
├── videos/            # ✅ Видео
├── admin/             # ✅ Админка
├── backend/           # ✅ Бэкенд
├── database/          # ✅ SQL скрипты
└── uploads/           # ✅ Папка для загрузок
```

---

## ⚙️ Шаг 5: Настройка Node.js приложения

### 5.1 Создание Node.js приложения
1. В панели ISPmanager перейдите в **"WWW-домены"** → **"Node.js"**
2. Нажмите **"Создать"**
3. Заполните форму:
   - **Домен**: выберите ваш домен
   - **Путь**: `/backend`
   - **Файл запуска**: `server.js`
   - **Порт**: `3001` (или любой доступный)
4. Нажмите **"Создать"**

### 5.2 Настройка переменных окружения
В настройках Node.js приложения добавьте переменные:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=master_sps_db
DB_USER=master_sps_user
DB_PASSWORD=MasterSPS2024!
NODE_ENV=production
PORT=3001
```

### 5.3 Установка зависимостей
1. В настройках Node.js приложения найдите раздел **"Зависимости"**
2. Нажмите **"Установить зависимости"**
3. Дождитесь завершения установки

### 5.4 Запуск приложения
1. Нажмите **"Запустить"** в настройках Node.js
2. Проверьте статус - должно быть **"Запущено"**
3. Проверьте логи на наличие ошибок

---

## 🌐 Шаг 6: Настройка веб-сервера

### 6.1 Настройка Nginx (рекомендуется)

1. В панели ISPmanager перейдите в **"WWW-домены"**
2. Выберите ваш домен
3. Перейдите в **"Настройки"** → **"Веб-сервер"**
4. Добавьте следующую конфигурацию:

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

5. Сохраните конфигурацию
6. Перезапустите веб-сервер

### 6.2 Альтернатива: .htaccess (если нет доступа к Nginx)

Создайте файл `.htaccess` в корне `public_html/`:

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

---

## 🧪 Шаг 7: Проверка работы

### 7.1 Проверка фронтенда
1. Откройте браузер
2. Перейдите по адресу: `http://yourdomain.com/`
3. **Ожидаемый результат**: Загружается главная страница сайта
4. **Проверьте**: Все изображения, видео и стили загружаются

### 7.2 Проверка админки
1. Перейдите по адресу: `http://yourdomain.com/admin/`
2. **Ожидаемый результат**: Загружается страница входа в админку
3. **Тестовые данные для входа**:
   - Логин: `admin`
   - Пароль: `admin123`

### 7.3 Проверка API
1. Перейдите по адресу: `http://yourdomain.com/api/`
2. **Ожидаемый результат**: Возвращается JSON с информацией об API
3. **Дополнительные тесты**:
   - `http://yourdomain.com/api/navigation` - навигация
   - `http://yourdomain.com/api/hero` - главный блок
   - `http://yourdomain.com/api/products` - продукты

### 7.4 Проверка базы данных
1. В админке попробуйте войти
2. Проверьте, что данные загружаются из базы
3. Попробуйте изменить настройки и сохранить

---

## 🐛 Устранение проблем

### Проблема: 404 ошибка для админки
**Причина**: Неправильная настройка маршрутизации
**Решение**: 
1. Проверьте, что файлы админки находятся в `public_html/admin/`
2. Проверьте конфигурацию Nginx или .htaccess
3. Убедитесь, что веб-сервер перезапущен

### Проблема: API не работает
**Причина**: Node.js приложение не запущено или неправильно настроено
**Решение**:
1. Проверьте статус Node.js приложения в панели ISPmanager
2. Проверьте логи Node.js на наличие ошибок
3. Убедитесь, что порт 3001 доступен
4. Проверьте переменные окружения

### Проблема: База данных не подключается
**Причина**: Неправильные данные подключения
**Решение**:
1. Проверьте переменные окружения в Node.js
2. Убедитесь, что база данных создана и импортирована
3. Проверьте права пользователя базы данных

### Проблема: Статические файлы не загружаются
**Причина**: Неправильные права доступа или конфигурация
**Решение**:
1. Проверьте права доступа к папкам (755 для папок, 644 для файлов)
2. Проверьте конфигурацию кэширования
3. Убедитесь, что файлы загружены в правильные папки

### Проблема: SPA routing не работает
**Причина**: Не настроен fallback на index.html
**Решение**:
1. Проверьте конфигурацию Nginx (должен быть `try_files $uri $uri/ /index.html`)
2. Проверьте .htaccess файл
3. Убедитесь, что веб-сервер перезапущен

---

## 📊 Мониторинг и обслуживание

### Логи
- **Nginx**: `/home/u3265044/domains/yourdomain.com/logs/error.log`
- **Node.js**: В панели ISPmanager → Node.js → Логи
- **База данных**: В панели ISPmanager → MySQL → Логи

### Резервное копирование
1. **База данных**: Регулярно экспортируйте через phpMyAdmin
2. **Файлы**: Делайте резервные копии папки `public_html/`
3. **Конфигурации**: Сохраняйте настройки Nginx и Node.js

### Обновления
1. **Код**: Загружайте новые версии через файловый менеджер
2. **Зависимости**: Обновляйте через панель Node.js
3. **База данных**: Применяйте миграции через phpMyAdmin

---

## 🎉 Готово!

После выполнения всех шагов у вас будет полностью рабочий сайт с:
- ✅ Фронтендом на `http://yourdomain.com/`
- ✅ Админкой на `http://yourdomain.com/admin/`
- ✅ API на `http://yourdomain.com/api/`
- ✅ Подключенной базой данных MySQL

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в панели ISPmanager
2. Убедитесь, что все шаги выполнены правильно
3. Проверьте права доступа к файлам и папкам
4. Убедитесь, что все сервисы запущены

---

**Важно**: Замените `yourdomain.com` на ваш реальный домен во всех конфигурациях и URL!
