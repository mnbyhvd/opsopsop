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

-- Создаем таблицу product_images если её нет
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создаем таблицу video_presentations_settings если её нет
CREATE TABLE IF NOT EXISTS video_presentations_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
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

-- Добавляем недостающие поля в таблицу products если их нет
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSON;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу videos если их нет
ALTER TABLE videos ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration VARCHAR(20);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 1;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Исправляем тип колонки type в таблице documents (добавляем 'presentation')
ALTER TABLE documents MODIFY COLUMN type ENUM('document', 'certificate', 'presentation') NOT NULL DEFAULT 'document';

-- Добавляем недостающие поля в таблицу documents если их нет
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу hero_section если их нет
ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS subtitle VARCHAR(255);
ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS background_image VARCHAR(500);
ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу about_section если их нет
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу advantages если их нет
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS value VARCHAR(100);
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#ff6b6b';
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE advantages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу navigation_menu если их нет
ALTER TABLE navigation_menu ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE navigation_menu ADD COLUMN IF NOT EXISTS parent_id INT NULL;
ALTER TABLE navigation_menu ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE navigation_menu ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE navigation_menu ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу footer_data если их нет
ALTER TABLE footer_data ADD COLUMN IF NOT EXISTS section_type VARCHAR(100) NOT NULL;
ALTER TABLE footer_data ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE footer_data ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE footer_data ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE footer_data ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE footer_data ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу leads если их нет
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу users если их нет
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу product_modals если их нет
ALTER TABLE product_modals ADD COLUMN IF NOT EXISTS position_x INT DEFAULT 0;
ALTER TABLE product_modals ADD COLUMN IF NOT EXISTS position_y INT DEFAULT 0;
ALTER TABLE product_modals ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE product_modals ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE product_modals ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE product_modals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу scroll_section если их нет
ALTER TABLE scroll_section ADD COLUMN IF NOT EXISTS section_title VARCHAR(255) NOT NULL;
ALTER TABLE scroll_section ADD COLUMN IF NOT EXISTS section_subtitle TEXT;
ALTER TABLE scroll_section ADD COLUMN IF NOT EXISTS video_url VARCHAR(500) NOT NULL;
ALTER TABLE scroll_section ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE scroll_section ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу scroll_section_text_blocks если их нет
ALTER TABLE scroll_section_text_blocks ADD COLUMN IF NOT EXISTS scroll_section_id INT NOT NULL;
ALTER TABLE scroll_section_text_blocks ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE scroll_section_text_blocks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE scroll_section_text_blocks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу requisites если их нет
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) NOT NULL;
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS inn VARCHAR(20);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS kpp VARCHAR(20);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS ogrn VARCHAR(20);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS legal_address TEXT;
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS postal_address TEXT;
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS bank_bik VARCHAR(20);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS bank_account VARCHAR(30);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS correspondent_account VARCHAR(30);
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE requisites ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Добавляем недостающие поля в таблицу footer_settings если их нет
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS company_subtitle VARCHAR(255);
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS contact_email VARCHAR(100);
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS contact_address TEXT;
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS working_hours VARCHAR(100);
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS form_title VARCHAR(255);
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS form_description TEXT;
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS privacy_policy_url VARCHAR(500);
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE footer_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Создаем индексы если их нет
CREATE INDEX IF NOT EXISTS idx_navigation_menu_active ON navigation_menu(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_menu_sort ON navigation_menu(sort_order);
CREATE INDEX IF NOT EXISTS idx_navigation_menu_parent ON navigation_menu(parent_id);

CREATE INDEX IF NOT EXISTS idx_footer_data_section ON footer_data(section_type);
CREATE INDEX IF NOT EXISTS idx_footer_data_active ON footer_data(is_active);
CREATE INDEX IF NOT EXISTS idx_footer_data_sort ON footer_data(sort_order);

CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_sort_order ON documents(sort_order);
CREATE INDEX IF NOT EXISTS idx_documents_is_active ON documents(is_active);

CREATE INDEX IF NOT EXISTS idx_videos_sort_order ON videos(sort_order);
CREATE INDEX IF NOT EXISTS idx_videos_is_active ON videos(is_active);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_active ON product_images(is_active);

CREATE INDEX IF NOT EXISTS idx_product_documents_product ON product_documents(product_id);
CREATE INDEX IF NOT EXISTS idx_product_documents_active ON product_documents(is_active);