-- Миграция для исправления структуры таблиц
USE master_sps;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

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
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS section_group VARCHAR(50) DEFAULT 'main';
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
UPDATE about_section SET section_group = 'main' WHERE section_group IS NULL OR section_group = '';

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

-- Создаем таблицы услуг и портфолио
CREATE TABLE IF NOT EXISTS service_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    summary TEXT,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES portfolio_projects(id) ON DELETE CASCADE
);

INSERT INTO navigation_menu (title, url, sort_order, parent_id, is_active)
SELECT 'Услуги', '/services', 2, NULL, true
WHERE NOT EXISTS (SELECT 1 FROM navigation_menu WHERE url = '/services');

INSERT INTO navigation_menu (title, url, sort_order, parent_id, is_active)
SELECT 'Портфолио', '/portfolio', 3, NULL, true
WHERE NOT EXISTS (SELECT 1 FROM navigation_menu WHERE url = '/portfolio');

INSERT INTO about_section (title, description, image_url, section_group, sort_order, is_active)
SELECT 'Единая среда проектирования', 'Система подходит для объектов разного масштаба: от отдельных помещений до распределённых комплексов с несколькими панелями и сценариями оповещения.', '/images/placeholders/placeholder-about-1.png', 'secondary', 1, true
WHERE NOT EXISTS (SELECT 1 FROM about_section WHERE section_group = 'secondary');

INSERT INTO about_section (title, description, image_url, section_group, sort_order, is_active)
SELECT 'Интеграция с инженерными системами', 'Оборудование позволяет связывать пожарную автоматику, оповещение, диспетчеризацию и исполнительные устройства в единую управляемую инфраструктуру.', '/images/placeholders/placeholder-about-2.png', 'secondary', 2, true
WHERE NOT EXISTS (SELECT 1 FROM about_section WHERE section_group = 'secondary' AND sort_order = 2);

INSERT INTO about_section (title, description, image_url, section_group, sort_order, is_active)
SELECT 'Контроль состояния оборудования', 'Адресная архитектура помогает быстро находить события, неисправности и зоны срабатывания, сокращая время диагностики и обслуживания.', '/images/placeholders/placeholder-about-3.png', 'secondary', 3, true
WHERE NOT EXISTS (SELECT 1 FROM about_section WHERE section_group = 'secondary' AND sort_order = 3);

INSERT INTO service_blocks (title, description, image_url, sort_order, is_active)
SELECT 'Проектирование систем противопожарной безопасности', 'Анализ объекта, разработка рабочей документации и подбор технических решений для систем пожарной сигнализации, оповещения и управления эвакуацией.', '/images/placeholders/placeholder-about-1.png', 1, true
WHERE NOT EXISTS (SELECT 1 FROM service_blocks);

INSERT INTO service_blocks (title, description, image_url, sort_order, is_active)
SELECT 'Монтаж систем пожарной сигнализации', 'Полный комплекс монтажных работ: прокладка трасс, установка оборудования, подключение и подготовка систем к пусконаладке.', '/images/placeholders/placeholder-about-2.png', 2, true
WHERE NOT EXISTS (SELECT 1 FROM service_blocks WHERE sort_order = 2);

INSERT INTO service_blocks (title, description, image_url, sort_order, is_active)
SELECT 'Монтаж систем пожаротушения', 'Установка и интеграция систем пожаротушения в общий контур безопасности объекта с проверкой исполнительных модулей.', '/images/placeholders/placeholder-about-3.png', 3, true
WHERE NOT EXISTS (SELECT 1 FROM service_blocks WHERE sort_order = 3);

INSERT INTO portfolio_projects (title, slug, location, summary, description, image_url, sort_order, is_active, meta_title, meta_description)
SELECT 'Автоматическая пожарная сигнализация и СОУЭ', 'aps-soue-moscow', 'Москва, Московский, Киевское шоссе, 22 км', 'Полное оснащение объекта современными системами противопожарной защиты.', 'В рамках проекта выполнено полное оснащение объекта современными системами противопожарной защиты: разработана рабочая документация, смонтирована адресно-аналоговая система автоматической пожарной сигнализации на базе приборов «Мастер 1-2F1E», а также система оповещения и управления эвакуацией 2-го типа.', '/images/placeholders/placeholder-about-1.png', 1, true, 'Автоматическая пожарная сигнализация и СОУЭ | СПС МАСТЕР', 'Пример проекта СПС МАСТЕР: пожарная сигнализация, СОУЭ, монтаж и пусконаладка.'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE slug = 'aps-soue-moscow');

INSERT INTO portfolio_sections (project_id, title, description, image_url, sort_order, is_active)
SELECT p.id, 'Система автоматической пожарной сигнализации', 'Обеспечение раннего обнаружения очага возгорания и определение его точного местоположения. Автоматическая выдача сигнала на запуск системы оповещения.', '/images/placeholders/placeholder-about-1.png', 1, true
FROM portfolio_projects p
WHERE p.slug = 'aps-soue-moscow'
AND NOT EXISTS (SELECT 1 FROM portfolio_sections s WHERE s.project_id = p.id);

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

CREATE INDEX IF NOT EXISTS idx_about_section_group ON about_section(section_group);
CREATE INDEX IF NOT EXISTS idx_service_blocks_active ON service_blocks(is_active);
CREATE INDEX IF NOT EXISTS idx_service_blocks_sort ON service_blocks(sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_slug ON portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_active ON portfolio_projects(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_sort ON portfolio_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_project ON portfolio_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_active ON portfolio_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_sort ON portfolio_sections(sort_order);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_active ON product_images(is_active);

CREATE INDEX IF NOT EXISTS idx_product_documents_product ON product_documents(product_id);
CREATE INDEX IF NOT EXISTS idx_product_documents_active ON product_documents(is_active);
