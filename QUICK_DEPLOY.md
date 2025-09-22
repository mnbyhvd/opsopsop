# 🚀 Быстрый деплой на Reg.ru

## 📦 Готовые файлы

- **Архив для загрузки**: `master-sps-organized.tar.gz` (9.7MB) - **ИСПОЛЬЗУЙТЕ ЭТОТ!**
- **Инструкция**: `ISPmanager_DEPLOYMENT.md`

## ⚡ Быстрые шаги

### 1. Вход в панель
- URL: https://server257.hosting.reg.ru:1500/
- Логин: `u3265044`
- Пароль: `JTghq57d06QNOf1K`

### 2. Создание базы данных
1. **Базы данных** → **MySQL** → **Создать**
2. Имя: `master_sps_db`
3. Пользователь: `master_sps_user`
4. Пароль: `MasterSPS2024!`

### 3. Импорт данных
1. **phpMyAdmin** → выбрать базу `master_sps_db`
2. **SQL** → вставить содержимое `deploy/database/init.sql`

### 4. Загрузка файлов
1. **Файлы** → **Файловый менеджер**
2. Загрузить `master-sps-organized.tar.gz`
3. Распаковать в корень домена (`public_html/`)
4. **Готово!** Файлы уже правильно организованы:
   - Фронтенд в корне (`index.html`, `static/`, `images/`, `videos/`)
   - Админка в папке `admin/`
   - Бэкенд в папке `backend/`

### 5. Настройка Node.js
1. **WWW-домены** → **Node.js** → **Создать**
2. Путь: `/backend`
3. Файл: `server.js`
4. Переменные окружения:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=master_sps_db
   DB_USER=master_sps_user
   DB_PASSWORD=MasterSPS2024!
   NODE_ENV=production
   PORT=3001
   ```

### 6. Запуск
1. Запустить Node.js приложение
2. Проверить работу:
   - Фронтенд: `http://yourdomain.com/`
   - Админка: `http://yourdomain.com/admin/`
   - API: `http://yourdomain.com/api/`

## 🔧 Структура файлов после распаковки

```
public_html/
├── index.html         # React фронтенд (главная страница)
├── static/            # Статические файлы фронтенда
├── images/            # Изображения фронтенда
├── videos/            # Видео фронтенда
├── admin/             # React админка (доступна по /admin/)
│   ├── index.html
│   └── static/
├── backend/           # Node.js API
│   ├── server.js
│   └── routes/
└── uploads/           # Папка для загрузок
```

## ⚠️ Важно

- Замените `yourdomain.com` на ваш реальный домен
- Убедитесь, что Node.js поддерживается на хостинге
- Проверьте права доступа к папкам

## 📞 Если что-то не работает

1. Проверьте логи в панели ISPmanager
2. Убедитесь, что база данных создана и импортирована
3. Проверьте, что Node.js приложение запущено
4. Проверьте переменные окружения

---

**Готово!** 🎉 Ваш сайт должен работать на `http://yourdomain.com/`
