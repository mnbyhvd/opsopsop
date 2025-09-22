# 🚀 Инструкция по деплою Master SPS

## Требования к серверу:
- Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- 2GB RAM минимум
- 20GB свободного места
- Домен с A-записью на IP сервера

## 1. Подготовка сервера

### Установка Node.js 18:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Установка MySQL 8.0:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Установка Nginx:
```bash
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Установка PM2:
```bash
sudo npm install -g pm2
sudo pm2 startup
```

## 2. Настройка базы данных

```bash
# Создание базы и пользователя
sudo mysql -u root -p < setup-database.sql

# Инициализация данных
mysql -u master_user -pmaster_password master_sps < init.sql
```

## 3. Развертывание приложения

### Создание директорий:
```bash
sudo mkdir -p /var/www/master_sps
sudo mkdir -p /var/log/pm2
```

### Копирование файлов:
```bash
sudo cp -r frontend/ /var/www/master_sps/
sudo cp -r admin/ /var/www/master_sps/
sudo cp -r backend/ /var/www/master_sps/
sudo chown -R www-data:www-data /var/www/master_sps/
```

### Установка зависимостей бэкенда:
```bash
cd /var/www/master_sps/backend
sudo npm install --production
```

## 4. Настройка Nginx

```bash
# Копирование конфигурации
sudo cp nginx.conf /etc/nginx/sites-available/master_sps

# Активация сайта
sudo ln -s /etc/nginx/sites-available/master_sps /etc/nginx/sites-enabled/

# Удаление дефолтного сайта
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезагрузка Nginx
sudo systemctl reload nginx
```

## 5. Запуск приложения

```bash
# Запуск бэкенда через PM2
cd /var/www/master_sps
sudo pm2 start ecosystem.config.js

# Сохранение конфигурации PM2
sudo pm2 save
```

## 6. Настройка SSL (опционально)

### Установка Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

### Получение SSL сертификата:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 7. Мониторинг и логи

### Просмотр логов PM2:
```bash
sudo pm2 logs master-sps-backend
```

### Просмотр логов Nginx:
```bash
sudo tail -f /var/log/nginx/master_sps_access.log
sudo tail -f /var/log/nginx/master_sps_error.log
```

### Перезапуск сервисов:
```bash
# Перезапуск бэкенда
sudo pm2 restart master-sps-backend

# Перезапуск Nginx
sudo systemctl restart nginx
```

## 8. Обновление приложения

```bash
# Остановка приложения
sudo pm2 stop master-sps-backend

# Копирование новых файлов
sudo cp -r frontend/ /var/www/master_sps/
sudo cp -r admin/ /var/www/master_sps/
sudo cp -r backend/ /var/www/master_sps/

# Установка новых зависимостей (если нужно)
cd /var/www/master_sps/backend
sudo npm install --production

# Запуск приложения
sudo pm2 start master-sps-backend
```

## 9. Структура файлов на сервере

```
/var/www/master_sps/
├── frontend/          # Статические файлы фронтенда
├── admin/            # Статические файлы админки
├── backend/          # Node.js приложение
│   ├── server.js
│   ├── routes/
│   ├── node_modules/
│   └── ...
├── ecosystem.config.js
└── README.md
```

## 10. Проверка работоспособности

- Фронтенд: http://your-domain.com
- Админка: http://your-domain.com/admin
- API: http://your-domain.com/api/leads

## 11. Резервное копирование

### Создание бэкапа базы данных:
```bash
mysqldump -u master_user -pmaster_password master_sps > backup_$(date +%Y%m%d).sql
```

### Восстановление из бэкапа:
```bash
mysql -u master_user -pmaster_password master_sps < backup_20231201.sql
```

## 12. Troubleshooting

### Если не работает API:
1. Проверьте статус PM2: `sudo pm2 status`
2. Проверьте логи: `sudo pm2 logs master-sps-backend`
3. Проверьте порт 3001: `sudo netstat -tlnp | grep 3001`

### Если не работает фронтенд:
1. Проверьте Nginx: `sudo nginx -t`
2. Проверьте права доступа: `ls -la /var/www/master_sps/frontend/`
3. Проверьте логи Nginx: `sudo tail -f /var/log/nginx/error.log`

### Если не работает админка:
1. Проверьте путь: `/var/www/master_sps/admin/`
2. Проверьте index.html в папке admin
3. Проверьте конфигурацию Nginx для /admin
