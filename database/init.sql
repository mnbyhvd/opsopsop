-- MySQL initialization script for master_sps database
-- Установка кодировки для правильного отображения кириллицы
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create navigation_menu table
CREATE TABLE IF NOT EXISTS navigation_menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES navigation_menu(id) ON DELETE CASCADE
);

-- Create footer_data table
CREATE TABLE IF NOT EXISTS footer_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_type VARCHAR(100) NOT NULL, -- 'navigation', 'contacts', 'legal', 'social'
    title VARCHAR(255),
    content TEXT,
    url VARCHAR(500),
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create about_section table
CREATE TABLE IF NOT EXISTS about_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create advantages table (used for technical specs)
CREATE TABLE IF NOT EXISTS advantages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    value VARCHAR(100),
    icon VARCHAR(100),
    color VARCHAR(7) DEFAULT '#ff6b6b',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create hero_section table
CREATE TABLE IF NOT EXISTS hero_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    background_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    specifications JSON,
    price DECIMAL(10,2),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    duration VARCHAR(20),
    sort_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    file_size BIGINT,
    file_type VARCHAR(100),
    original_filename VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('document', 'certificate')),
    sort_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    file_size BIGINT,
    file_type VARCHAR(100),
    original_filename VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create footer_settings table
CREATE TABLE IF NOT EXISTS footer_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_subtitle VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    contact_address TEXT,
    working_hours VARCHAR(100),
    form_title VARCHAR(255),
    form_description TEXT,
    privacy_policy_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create product_modals table
CREATE TABLE IF NOT EXISTS product_modals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    button_text VARCHAR(100),
    button_url VARCHAR(500),
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create scroll_section table
CREATE TABLE IF NOT EXISTS scroll_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_title VARCHAR(255) NOT NULL,
    section_subtitle TEXT,
    video_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create scroll_section_text_blocks table
CREATE TABLE IF NOT EXISTS scroll_section_text_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scroll_section_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scroll_section_id) REFERENCES scroll_section(id) ON DELETE CASCADE
);

-- Create requisites table
CREATE TABLE IF NOT EXISTS requisites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    inn VARCHAR(20),
    kpp VARCHAR(20),
    ogrn VARCHAR(20),
    legal_address TEXT,
    postal_address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    bank_name VARCHAR(255),
    bank_bik VARCHAR(20),
    bank_account VARCHAR(30),
    correspondent_account VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample navigation data
INSERT IGNORE INTO navigation_menu (title, url, sort_order, parent_id, is_active) VALUES
('О системе', '/about', 1, NULL, true),
('Продукция', '/products', 2, NULL, true),
('Видео-презентации', '/videos', 3, NULL, true),
('Документы', '/docs', 4, NULL, true),
('Сертификаты', '/certificates', 5, NULL, true),
('Поддержка', '/support', 6, NULL, true),
('Купить', '/buy', 7, NULL, true);

-- Insert sample about section data
INSERT IGNORE INTO about_section (title, description, image_url, sort_order, is_active) VALUES
('Кольцевая топология шлейфов', 'Отказоустойчивость. При обрыве или коротком замыкании шлейф делится на два рабочих радиальных. Система продолжает работать.', '/placeholder-about-1.png', 1, true),
('Изоляторы короткого замыкания (ИКЗ)', 'Встроенные в устройства ИКЗ автоматически изолируют поврежденный участок, сохраняя работоспособность остальной части шлейфа.', '/placeholder-about-2.png', 2, true),
('Цифровой протокол M105', 'Цифровая связь с устройствами. До 199 извещателей и 20 модулей управления на один шлейф. Полный контроль состояния каждого устройства.', '/placeholder-about-3.png', 3, true),
('Сеть MasterNet', 'Объедините до 32 панелей в единую кольцевую сеть с автоматическим обходом обрывов. Защита объектов с неограниченной площадью.', '/placeholder-about-4.png', 4, true);

-- Insert sample technical specs data
INSERT IGNORE INTO advantages (title, description, value, sort_order, is_active) VALUES
('Кольцевых шлейфов', 'Максимальное количество кольцевых шлейфов в одной панели', '4', 1, true),
('Извещателей на шлейф', 'Максимальное количество извещателей на один шлейф', '199', 2, true),
('Модулей управления', 'Максимальное количество модулей управления на шлейф', '1000', 3, true),
('Панелей в сети', 'Максимальное количество панелей в сети MasterNet', '32', 4, true);

-- Insert sample hero section data
INSERT IGNORE INTO hero_section (title, subtitle, description, background_image, is_active) VALUES
('АПС МАСТЕР', 'Система автоматического пожаротушения нового поколения', 'Инновационная система пожаротушения с цифровым протоколом M105, кольцевой топологией шлейфов и сетью MasterNet для максимальной надежности и эффективности.', '/hero-background.jpg', true);

-- Insert sample products data
INSERT IGNORE INTO products (name, description, image_url, category, specifications, price, sort_order, is_active) VALUES
('Датчик температуры МАСТЕР-Т', 'Высокоточный датчик для измерения температуры окружающей среды с цифровым протоколом M105', '/placeholder-product-1.png', 'Датчики', '{"range": "-40°C до +85°C", "accuracy": "±0.5°C", "protection": "IP67", "protocol": "M105"}', 15000.00, 1, true),
('Модуль пожаротушения МАСТЕР-М', 'Автоматический модуль для тушения пожара с быстрым срабатыванием и цифровым управлением', '/placeholder-product-2.png', 'Модули', '{"response_time": "<3 сек", "volume": "2-6 литров", "type": "Порошковый", "protocol": "M105"}', 25000.00, 2, true),
('Контрольная панель МАСТЕР-П', 'Центральная панель управления системой пожаротушения с поддержкой сети MasterNet', '/placeholder-product-3.png', 'Панели', '{"channels": "до 32", "power": "12-24V", "interface": "LCD дисплей", "network": "MasterNet"}', 45000.00, 3, true),
('Изолятор короткого замыкания ИКЗ', 'Встроенный изолятор для автоматической изоляции поврежденных участков шлейфа', '/placeholder-product-4.png', 'Компоненты', '{"voltage": "12-24V", "current": "до 2А", "protection": "IP65", "mounting": "DIN-рейка"}', 5000.00, 4, true);

-- Insert sample videos data
INSERT IGNORE INTO videos (title, description, video_url, thumbnail_url, duration, sort_order, is_active) VALUES
('Демонстрация системы МАСТЕР', 'Полная демонстрация возможностей системы автоматического пожаротушения МАСТЕР', '/videos/demo.mp4', '/videos/demo-thumb.jpg', '5:30', 1, true),
('Установка и настройка', 'Пошаговая инструкция по установке и настройке системы пожаротушения', '/videos/installation.mp4', '/videos/installation-thumb.jpg', '3:45', 2, true),
('Интеграция с системами безопасности', 'Как интегрировать МАСТЕР с существующими системами безопасности', '/videos/integration.mp4', '/videos/integration-thumb.jpg', '4:20', 3, true),
('Техническое обслуживание', 'Рекомендации по техническому обслуживанию системы', '/videos/maintenance.mp4', '/videos/maintenance-thumb.jpg', '2:15', 4, true);

-- Insert sample documents data
INSERT IGNORE INTO documents (title, url, type, sort_order, is_active) VALUES
('Руководство пользователя', 'https://example.com/user-manual.pdf', 'document', 1, true),
('Техническое описание', 'https://example.com/tech-spec.pdf', 'document', 2, true),
('Инструкция по монтажу', 'https://example.com/installation-guide.pdf', 'document', 3, true),
('Сертификат соответствия ГОСТ', 'https://example.com/gost-certificate.pdf', 'certificate', 1, true),
('Сертификат качества ISO 9001', 'https://example.com/iso-certificate.pdf', 'certificate', 2, true),
('Разрешение на применение', 'https://example.com/usage-permit.pdf', 'certificate', 3, true);

-- Insert sample footer data
INSERT IGNORE INTO footer_data (section_type, title, content, url, icon, sort_order, is_active) VALUES
-- Navigation section
('navigation', 'Главная', NULL, '/', NULL, 1, true),
('navigation', 'О системе', NULL, '/about', NULL, 2, true),
('navigation', 'Продукция', NULL, '/products', NULL, 3, true),
('navigation', 'Сертификаты', NULL, '/certificates', NULL, 4, true),
('navigation', 'Документация', NULL, '/docs', NULL, 5, true),
('navigation', 'Видео', NULL, '/videos', NULL, 6, true),
('navigation', 'Поддержка', NULL, '/support', NULL, 7, true),
('navigation', 'Купить', NULL, '/buy', NULL, 8, true),

-- Contacts section
('contacts', 'Телефон', '+7 (XXX) XXX-XX-XX', 'tel:+7XXXXXXXXXX', 'phone', 1, true),
('contacts', 'Email', 'info@aps-master.ru', 'mailto:info@aps-master.ru', 'email', 2, true),
('contacts', 'Адрес', 'г. Москва, ул. Примерная, д. 1', NULL, 'location', 3, true),

-- Legal section
('legal', 'Политика конфиденциальности', NULL, '/privacy', NULL, 1, true),
('legal', 'Условия использования', NULL, '/terms', NULL, 2, true),
('legal', '© 2024 АПС МАСТЕР. Все права защищены.', NULL, NULL, NULL, 3, true),

-- Social section
('social', 'Telegram', 'Наш Telegram канал', 'https://t.me/aps_master', 'telegram', 1, true),
('social', 'WhatsApp', 'Написать в WhatsApp', 'https://wa.me/7XXXXXXXXXX', 'whatsapp', 2, true);

-- Insert sample scroll section data
INSERT IGNORE INTO scroll_section (section_title, section_subtitle, video_url) VALUES
('ТЕХНОЛОГИИ БУДУЩЕГО', 'Инновационные решения для автоматического пожаротушения', '/videos/demo.mp4');

-- Insert sample scroll section text blocks
INSERT IGNORE INTO scroll_section_text_blocks (scroll_section_id, title, description, sort_order) VALUES
(1, 'Интеллектуальное управление', 'Система автоматически определяет тип возгорания и выбирает оптимальный способ тушения', 1),
(1, 'Цифровой протокол M105', 'Высокоскоростная передача данных между устройствами с полным контролем состояния', 2),
(1, 'Кольцевая топология', 'Отказоустойчивая архитектура с автоматическим обходом поврежденных участков', 3);

-- Insert sample requisites data
INSERT IGNORE INTO requisites (company_name, inn, kpp, ogrn, legal_address, postal_address, phone, email, bank_name, bank_bik, bank_account, correspondent_account) VALUES
('ООО "АПС МАСТЕР"', '1234567890', '123456789', '1234567890123', 'г. Москва, ул. Примерная, д. 1, оф. 101', 'г. Москва, ул. Примерная, д. 1, оф. 101', '+7 (495) 123-45-67', 'info@aps-master.ru', 'ПАО "Сбербанк"', '044525225', '40702810123456789012', '30101810400000000225');

-- Insert sample product modals data
INSERT IGNORE INTO product_modals (area_id, title, description, button_text, button_url, position_x, position_y, sort_order, is_active) VALUES
('area-1', 'Датчик температуры МАСТЕР-Т', 'Высокоточный датчик для измерения температуры окружающей среды с цифровым протоколом M105', 'Подробнее', '/products', 100, 200, 1, true),
('area-1', 'Технические характеристики', 'Диапазон: -40°C до +85°C, Точность: ±0.5°C, Защита: IP67', 'Скачать PDF', '/documents', 150, 250, 2, true),
('area-2', 'Модуль пожаротушения МАСТЕР-М', 'Автоматический модуль для тушения пожара с быстрым срабатыванием и цифровым управлением', 'Подробнее', '/products', 200, 300, 1, true),
('area-2', 'Применение', 'Подходит для защиты серверных, архивов, музеев и других помещений', 'Заказать', '/buy', 250, 350, 2, true),
('area-3', 'Контрольная панель МАСТЕР-П', 'Центральная панель управления системой пожаротушения с поддержкой сети MasterNet', 'Подробнее', '/products', 300, 400, 1, true),
('area-3', 'Возможности', 'До 32 каналов, питание 12-24V, LCD дисплей, поддержка MasterNet', 'Документация', '/docs', 350, 450, 2, true),
('area-4', 'Изолятор короткого замыкания ИКЗ', 'Встроенный изолятор для автоматической изоляции поврежденных участков шлейфа', 'Подробнее', '/products', 400, 500, 1, true),
('area-4', 'Преимущества', 'Напряжение: 12-24V, ток до 2А, защита IP65, монтаж на DIN-рейку', 'Сертификаты', '/certificates', 450, 550, 2, true);

-- Insert sample leads data
INSERT IGNORE INTO leads (name, email, phone, company, message, status) VALUES
('Иван Петров', 'ivan.petrov@example.com', '+7 (495) 123-45-67', 'ООО "ТехноСистемы"', 'Интересует система пожаротушения для серверной комнаты. Нужна консультация по выбору оборудования.', 'new'),
('Мария Сидорова', 'maria.sidorova@company.ru', '+7 (812) 987-65-43', 'ЗАО "Безопасность+"', 'Требуется расчет стоимости системы для офисного здания площадью 500 кв.м. Возможна ли установка в выходные?', 'in_progress'),
('Алексей Козлов', 'a.kozlov@techcorp.com', '+7 (903) 456-78-90', 'ТехКорп', 'Интересует модуль МАСТЕР-М. Есть ли скидки при заказе 10 штук?', 'completed'),
('Елена Волкова', 'elena.volkova@mail.ru', '+7 (916) 234-56-78', 'ИП Волкова Е.А.', 'Нужна система для частного дома. Какие документы требуются для получения лицензии?', 'new'),
('Дмитрий Соколов', 'd.sokolov@security.ru', '+7 (495) 555-12-34', 'ООО "Альфа-Безопасность"', 'Рассматриваем ваше оборудование для крупного проекта. Возможна ли техническая поддержка на объекте?', 'in_progress');

-- Create indexes for better performance
CREATE INDEX idx_navigation_menu_active ON navigation_menu(is_active);
CREATE INDEX idx_navigation_menu_sort ON navigation_menu(sort_order);
CREATE INDEX idx_navigation_menu_parent ON navigation_menu(parent_id);

CREATE INDEX idx_footer_data_section ON footer_data(section_type);
CREATE INDEX idx_footer_data_active ON footer_data(is_active);
CREATE INDEX idx_footer_data_sort ON footer_data(sort_order);

CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_sort_order ON documents(sort_order);
CREATE INDEX idx_documents_is_active ON documents(is_active);

CREATE INDEX idx_videos_sort_order ON videos(sort_order);
CREATE INDEX idx_videos_is_active ON videos(is_active);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_sort_order ON products(sort_order);