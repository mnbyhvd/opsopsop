# 🐳 Гайд по деплою через SSH + Docker

## 🚀 **Автоматический деплой (рекомендуется)**

### **Один командой:**
```bash
./deploy-docker.sh server257.hosting.reg.ru my_domain_db my_password123
```

**Где:**
- `server257.hosting.reg.ru` - адрес сервера
- `my_domain_db` - имя базы данных
- `my_password123` - пароль базы данных

## 🔧 **Ручной деплой**

### **Шаг 1: Подключение к серверу**
```bash
ssh u3265044@server257.hosting.reg.ru
```

### **Шаг 2: Установка Docker**
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавляем пользователя в группу docker
sudo usermod -aG docker $USER

# Выходим и заходим заново
exit
ssh u3265044@server257.hosting.reg.ru
```

### **Шаг 3: Установка Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **Шаг 4: Загрузка проекта**
```bash
# С локального компьютера
scp -r . u3265044@server257.hosting.reg.ru:~/master-sps/
```

### **Шаг 5: Настройка проекта**
```bash
cd ~/master-sps

# Создаем .env файл
cat > .env << EOF
MYSQL_ROOT_PASSWORD=root_password_$(date +%s)
MYSQL_DATABASE=my_domain_db
MYSQL_USER=master_sps_user
MYSQL_PASSWORD=my_password123
NODE_ENV=production
EOF
```

### **Шаг 6: Запуск контейнеров**
```bash
# Запускаем все сервисы
docker-compose -f docker-compose.prod.yml up -d --build

# Проверяем статус
docker-compose -f docker-compose.prod.yml ps

# Смотрим логи
docker-compose -f docker-compose.prod.yml logs -f
```

### **Шаг 7: Настройка Nginx**
```bash
# Устанавливаем Nginx
sudo apt install nginx -y

# Создаем конфигурацию
sudo tee /etc/nginx/sites-available/master-sps > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    
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
        proxy_pass http://localhost:3002;
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
EOF

# Активируем сайт
sudo ln -sf /etc/nginx/sites-available/master-sps /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 🎯 **Результат**

После деплоя будет доступно:
- **Фронтенд**: `http://server257.hosting.reg.ru/`
- **Админка**: `http://server257.hosting.reg.ru/admin/`
- **API**: `http://server257.hosting.reg.ru/api/`

## 🔧 **Управление контейнерами**

### **Просмотр статуса:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

### **Просмотр логов:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### **Перезапуск сервисов:**
```bash
docker-compose -f docker-compose.prod.yml restart
```

### **Остановка всех сервисов:**
```bash
docker-compose -f docker-compose.prod.yml down
```

### **Обновление проекта:**
```bash
# Загружаем новые файлы
scp -r . u3265044@server257.hosting.reg.ru:~/master-sps/

# Перезапускаем контейнеры
ssh u3265044@server257.hosting.reg.ru "cd ~/master-sps && docker-compose -f docker-compose.prod.yml up -d --build"
```

## 🐛 **Устранение проблем**

### **Проблема: Контейнеры не запускаются**
```bash
# Проверяем логи
docker-compose -f docker-compose.prod.yml logs

# Проверяем статус
docker-compose -f docker-compose.prod.yml ps
```

### **Проблема: База данных не подключается**
```bash
# Проверяем подключение к MySQL
docker exec -it master_sps_db mysql -u master_sps_user -p

# Проверяем переменные окружения
docker exec -it master_sps_backend env | grep DB
```

### **Проблема: Nginx не работает**
```bash
# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx

# Проверяем статус
sudo systemctl status nginx
```

## 📊 **Мониторинг**

### **Использование ресурсов:**
```bash
docker stats
```

### **Логи всех сервисов:**
```bash
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### **Логи конкретного сервиса:**
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs admin
```

## 🎉 **Готово!**

Теперь у вас есть полностью рабочий сайт на Docker с:
- ✅ Автоматическим перезапуском
- ✅ Изолированными сервисами
- ✅ Легким обновлением
- ✅ Простым управлением

---

**Для быстрого деплоя используйте:**
```bash
./deploy-docker.sh server257.hosting.reg.ru my_domain_db my_password123
```
