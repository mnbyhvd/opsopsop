-- Миграция для исправления структуры таблиц
USE master_sps;

-- Добавляем недостающие поля в таблицу products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_name VARCHAR(255) DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(500) DEFAULT NULL;

-- Добавляем недостающие поля в таблицу videos
ALTER TABLE videos ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(500) DEFAULT NULL;

-- Создаем таблицу categories если её нет
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Добавляем внешний ключ для category_id (если его еще нет)
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = 'master_sps' 
    AND TABLE_NAME = 'products' 
    AND CONSTRAINT_NAME = 'fk_products_category'
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL',
    'SELECT "Constraint already exists"'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
