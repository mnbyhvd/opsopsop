# 🔧 Инструкция по изменению настроек базы данных

## 📋 Что нужно изменить

Вам нужно изменить настройки базы данных в следующих файлах:

### 1. Основные файлы проекта
- `backend/server.js` - настройки подключения к БД
- `deploy/backend/server.js` - настройки для деплоя

### 2. Конфигурационные файлы
- `docker-compose.yml` - настройки Docker (если используете)

## 🚀 Быстрый способ (автоматический)

Используйте скрипт для автоматического изменения:

```bash
./update-database-config.sh <DB_NAME> <DB_USER> <DB_PASSWORD>
```

**Пример:**
```bash
./update-database-config.sh my_domain_db my_domain_user my_password123
```

## 🔧 Ручной способ

### 1. Измените `backend/server.js`

Найдите строки 31-33 и замените:

```javascript
// БЫЛО:
database: process.env.DB_NAME || 'master_sps_db',
user: process.env.DB_USER || 'master_sps_user',
password: process.env.DB_PASSWORD || 'MasterSPS2024!',

// СТАЛО:
database: process.env.DB_NAME || 'your_domain_db',
user: process.env.DB_USER || 'your_domain_user',
password: process.env.DB_PASSWORD || 'your_password123',
```

### 2. Измените `deploy/backend/server.js`

Сделайте те же изменения в файле для деплоя.

### 3. Измените `docker-compose.yml` (если используете)

Найдите секцию `environment` и замените:

```yaml
# БЫЛО:
environment:
  MYSQL_DATABASE: master_sps_db
  MYSQL_USER: master_sps_user
  MYSQL_PASSWORD: MasterSPS2024!

# СТАЛО:
environment:
  MYSQL_DATABASE: your_domain_db
  MYSQL_USER: your_domain_user
  MYSQL_PASSWORD: your_password123
```

## 📝 Переменные окружения

Создайте файл `.env` в папке `backend/` с вашими настройками:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_domain_db
DB_USER=your_domain_user
DB_PASSWORD=your_password123
NODE_ENV=production
PORT=3001
```

## 🔄 После изменения настроек

1. **Пересоберите проект:**
   ```bash
   ./build-all.sh
   ```

2. **Создайте новый архив:**
   ```bash
   ./organize-files.sh
   ```

3. **Загрузите новый архив на сервер**

## ⚠️ Важные замечания

1. **Безопасность**: Не храните пароли в коде! Используйте переменные окружения
2. **Права доступа**: Убедитесь, что пользователь БД имеет права на чтение/запись
3. **Кодировка**: Убедитесь, что БД использует UTF-8 для кириллицы

## 🧪 Проверка настроек

После изменения проверьте:

1. **Локально** (если есть локальная БД):
   ```bash
   cd backend
   npm start
   ```

2. **На сервере**: Проверьте логи Node.js приложения

## 📞 Если что-то не работает

1. Проверьте, что БД создана с правильным именем
2. Проверьте, что пользователь существует и имеет права
3. Проверьте, что пароль правильный
4. Проверьте логи подключения в Node.js

---

**Готово!** После изменения настроек проект будет использовать ваши данные для подключения к базе данных.
