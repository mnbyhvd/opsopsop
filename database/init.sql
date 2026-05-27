-- MySQL initialization script for master_sps database
-- Установка кодировки для правильного отображения кириллицы
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
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
    category_id INT NULL,
    youtube_url VARCHAR(500) DEFAULT NULL,
    specifications JSON,
    price DECIMAL(10,2),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create product_images table
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

-- Create product_documents table
CREATE TABLE IF NOT EXISTS product_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

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
    section_group VARCHAR(50) DEFAULT 'main',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create service_blocks table
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

-- Create portfolio_projects table
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

-- Create portfolio_sections table
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

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    youtube_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
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

-- Create video_presentations_settings table
CREATE TABLE IF NOT EXISTS video_presentations_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    background_video_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type ENUM('document', 'certificate', 'presentation') NOT NULL DEFAULT 'document',
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

-- Create home_blocks table
CREATE TABLE IF NOT EXISTS home_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create page_meta table
CREATE TABLE IF NOT EXISTS page_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL UNIQUE,
    path VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create requisites table
CREATE TABLE IF NOT EXISTS requisites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    inn VARCHAR(20),
    kpp VARCHAR(20),
    ogrn VARCHAR(20),
    legal_address TEXT,
    actual_address TEXT,
    postal_address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    bank_name VARCHAR(255),
    bik VARCHAR(20),
    bank_account VARCHAR(30),
    correspondent_account VARCHAR(30),
    director_name VARCHAR(255),
    director_position VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample navigation data
INSERT IGNORE INTO navigation_menu (title, url, sort_order, parent_id, is_active) VALUES
('Продукция', '/products', 1, NULL, true),
('Услуги', '/services', 2, NULL, true),
('Портфолио', '/portfolio', 3, NULL, true),
('Видео-презентации', '/videos', 4, NULL, true),
('Реквизиты', '/requisites', 5, NULL, true);

-- Insert sample categories data
INSERT IGNORE INTO categories (name, description, image_url, sort_order, is_active) VALUES
('Датчики', 'Датчики температуры и дыма', '/images/categories/sensors.jpg', 1, true),
('Модули', 'Модули пожаротушения', '/images/categories/modules.jpg', 2, true),
('Панели', 'Контрольные панели', '/images/categories/panels.jpg', 3, true),
('Компоненты', 'Вспомогательные компоненты', '/images/categories/components.jpg', 4, true);

-- Insert sample about section data
INSERT IGNORE INTO about_section (title, description, image_url, section_group, sort_order, is_active) VALUES
('Кольцевая топология шлейфов', 'Отказоустойчивость. При обрыве или коротком замыкании шлейф делится на два рабочих радиальных. Система продолжает работать.', '/images/placeholders/placeholder-about-1.png', 'main', 1, true),
('Изоляторы короткого замыкания (ИКЗ)', 'Встроенные в устройства ИКЗ автоматически изолируют поврежденный участок, сохраняя работоспособность остальной части шлейфа.', '/images/placeholders/placeholder-about-2.png', 'main', 2, true),
('Цифровой протокол M105', 'Цифровая связь с устройствами. До 199 извещателей и 20 модулей управления на один шлейф. Полный контроль состояния каждого устройства.', '/images/placeholders/placeholder-about-3.png', 'main', 3, true),
('Сеть MasterNet', 'Объедините до 32 панелей в единую кольцевую сеть с автоматическим обходом обрывов. Защита объектов с неограниченной площадью.', '/images/placeholders/placeholder-about-4.png', 'main', 4, true),
('Единая среда проектирования', 'Система подходит для объектов разного масштаба: от отдельных помещений до распределённых комплексов с несколькими панелями и сценариями оповещения.', '/images/placeholders/placeholder-about-1.png', 'secondary', 1, true),
('Интеграция с инженерными системами', 'Оборудование позволяет связывать пожарную автоматику, оповещение, диспетчеризацию и исполнительные устройства в единую управляемую инфраструктуру.', '/images/placeholders/placeholder-about-2.png', 'secondary', 2, true),
('Контроль состояния оборудования', 'Адресная архитектура помогает быстро находить события, неисправности и зоны срабатывания, сокращая время диагностики и обслуживания.', '/images/placeholders/placeholder-about-3.png', 'secondary', 3, true);

-- Insert sample service blocks
INSERT IGNORE INTO service_blocks (title, description, image_url, sort_order, is_active) VALUES
('Проектирование систем противопожарной безопасности', 'Анализ объекта, разработка рабочей документации и подбор технических решений для систем пожарной сигнализации, оповещения и управления эвакуацией.', '/images/placeholders/placeholder-about-1.png', 1, true),
('Монтаж систем пожарной сигнализации', 'Полный комплекс монтажных работ: прокладка трасс, установка оборудования, подключение и подготовка систем к пусконаладке.', '/images/placeholders/placeholder-about-2.png', 2, true),
('Монтаж систем пожаротушения', 'Установка и интеграция систем пожаротушения в общий контур безопасности объекта с проверкой исполнительных модулей.', '/images/placeholders/placeholder-about-3.png', 3, true),
('Монтаж систем дымоудаления', 'Монтаж и настройка систем дымоудаления, обеспечивающих безопасную эвакуацию и снижение последствий задымления.', '/images/placeholders/placeholder-about-4.png', 4, true),
('Техническое обслуживание систем пожарной безопасности', 'Плановое обслуживание, диагностика, проверка работоспособности и документирование состояния систем на объекте.', '/images/placeholders/placeholder-about-1.png', 5, true),
('Экспертиза систем пожарной безопасности', 'Аудит проектных решений, проверка документации, обследование действующих систем и подготовка рекомендаций.', '/images/placeholders/placeholder-about-2.png', 6, true);

-- Insert sample portfolio projects
INSERT IGNORE INTO portfolio_projects (title, slug, location, summary, description, image_url, sort_order, is_active, meta_title, meta_description) VALUES
('Автоматическая пожарная сигнализация и СОУЭ', 'aps-soue-moscow', 'Москва, Московский, Киевское шоссе, 22 км', 'Полное оснащение объекта современными системами противопожарной защиты.', 'В рамках проекта выполнено полное оснащение объекта современными системами противопожарной защиты: разработана рабочая документация, смонтирована адресно-аналоговая система автоматической пожарной сигнализации на базе приборов «Мастер 1-2F1E», а также система оповещения и управления эвакуацией 2-го типа.', '/images/placeholders/placeholder-about-1.png', 1, true, 'Автоматическая пожарная сигнализация и СОУЭ | СПС МАСТЕР', 'Пример проекта СПС МАСТЕР: пожарная сигнализация, СОУЭ, монтаж и пусконаладка.'),
('Комплекс противопожарной защиты торгового объекта', 'fire-safety-trade-center', 'Москва', 'Проектирование, монтаж и проверка систем пожарной безопасности для торгового объекта.', 'Команда выполнила полный цикл работ от проектной документации до ввода комплекса противопожарной защиты в эксплуатацию.', '/images/placeholders/placeholder-about-2.png', 2, true, 'Комплекс противопожарной защиты | СПС МАСТЕР', 'Портфолио СПС МАСТЕР: комплексные решения пожарной безопасности.');

-- Insert sample portfolio sections
INSERT IGNORE INTO portfolio_sections (project_id, title, description, image_url, sort_order, is_active) VALUES
(1, 'Система автоматической пожарной сигнализации', 'Обеспечение раннего обнаружения очага возгорания и определение его точного местоположения. Автоматическая выдача сигнала на запуск системы оповещения.', '/images/placeholders/placeholder-about-1.png', 1, true),
(1, 'Система оповещения и управления эвакуацией', 'Проектирование системы оповещения 2-го типа и обеспечение необходимого уровня звукового давления для гарантированного слышимого сигнала.', '/images/placeholders/placeholder-about-2.png', 2, true),
(1, 'Состав проектных работ', 'Структурная схема, планы размещения оборудования и кабельных трасс, схемы подключения приборов и спецификация оборудования.', '/images/placeholders/placeholder-about-3.png', 3, true),
(1, 'Основное установленное оборудование', 'Приёмно-контрольный прибор, резервированное питание, дымовые и ручные пожарные извещатели, звуковые и световые оповещатели, кабельные линии.', '/images/placeholders/placeholder-about-4.png', 4, true),
(1, 'Ключевые технические решения', 'Алгоритмы принятия решения о пожаре, контроль целостности линий, подключение нагрузок и резервирование ключевых узлов системы.', '/images/placeholders/placeholder-about-1.png', 5, true),
(2, 'Проектирование и монтаж', 'Разработка рабочей документации, монтаж адресной системы и проведение комплексных испытаний.', '/images/placeholders/placeholder-about-2.png', 1, true),
(2, 'Пусконаладка и ввод в эксплуатацию', 'Проверка сценариев срабатывания, настройка оборудования и передача системы заказчику.', '/images/placeholders/placeholder-about-3.png', 2, true);

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
INSERT IGNORE INTO products (name, description, image_url, category, category_id, youtube_url, specifications, price, sort_order, is_active) VALUES
('Датчик температуры МАСТЕР-Т', 'Высокоточный датчик для измерения температуры окружающей среды с цифровым протоколом M105', '/placeholder-product-1.png', 'Датчики', 1, 'https://youtube.com/watch?v=master-t', '{"range": "-40°C до +85°C", "accuracy": "±0.5°C", "protection": "IP67", "protocol": "M105"}', 15000.00, 1, true),
('Модуль пожаротушения МАСТЕР-М', 'Автоматический модуль для тушения пожара с быстрым срабатыванием и цифровым управлением', '/placeholder-product-2.png', 'Модули', 2, 'https://youtube.com/watch?v=master-m', '{"response_time": "<3 сек", "volume": "2-6 литров", "type": "Порошковый", "protocol": "M105"}', 25000.00, 2, true),
('Контрольная панель МАСТЕР-П', 'Центральная панель управления системой пожаротушения с поддержкой сети MasterNet', '/placeholder-product-3.png', 'Панели', 3, 'https://youtube.com/watch?v=master-p', '{"channels": "до 32", "power": "12-24V", "interface": "LCD дисплей", "network": "MasterNet"}', 45000.00, 3, true),
('Изолятор короткого замыкания ИКЗ', 'Встроенный изолятор для автоматической изоляции поврежденных участков шлейфа', '/placeholder-product-4.png', 'Компоненты', 4, 'https://youtube.com/watch?v=ikz', '{"voltage": "12-24V", "current": "до 2А", "protection": "IP65", "mounting": "DIN-рейка"}', 5000.00, 4, true);

-- Insert sample videos data
INSERT IGNORE INTO videos (title, description, video_url, youtube_url, thumbnail_url, category, duration, sort_order, is_active) VALUES
('Демонстрация системы МАСТЕР', 'Полная демонстрация возможностей системы автоматического пожаротушения МАСТЕР', '/videos/demo.mp4', 'https://youtube.com/watch?v=demo', '/videos/demo-thumb.jpg', 'Демонстрация', '5:30', 1, true),
('Установка и настройка', 'Пошаговая инструкция по установке и настройке системы пожаротушения', '/videos/installation.mp4', 'https://youtube.com/watch?v=installation', '/videos/installation-thumb.jpg', 'Инструкция', '3:45', 2, true),
('Интеграция с системами безопасности', 'Как интегрировать МАСТЕР с существующими системами безопасности', '/videos/integration.mp4', 'https://youtube.com/watch?v=integration', '/videos/integration-thumb.jpg', 'Интеграция', '4:20', 3, true),
('Техническое обслуживание', 'Рекомендации по техническому обслуживанию системы', '/videos/maintenance.mp4', 'https://youtube.com/watch?v=maintenance', '/videos/maintenance-thumb.jpg', 'Обслуживание', '2:15', 4, true);

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
('navigation', 'О системе', NULL, '/about', NULL, 1, true),
('navigation', 'Продукция', NULL, '/products', NULL, 2, true),
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

-- Insert sample footer settings data
INSERT IGNORE INTO footer_settings (company_name, company_subtitle, contact_phone, contact_email, contact_address, working_hours, form_title, form_description, privacy_policy_url) VALUES
('ООО "АПС МАСТЕР"', 'Системы автоматического пожаротушения', '+7 (495) 123-45-67', 'info@aps-master.ru', 'г. Москва, ул. Примерная, д. 1', 'Пн-Пт 10:00-18:00', 'СВЯЖИТЕСЬ С НАМИ', 'Оставьте заявку и получите спецификацию и коммерческое предложение, подобранные именно под ваши задачи.', '#privacy');

-- Insert sample video presentations settings data
INSERT IGNORE INTO video_presentations_settings (title, subtitle, description, background_video_url, is_active) VALUES
('ВИДЕО-ПРЕЗЕНТАЦИИ', 'Демонстрация возможностей системы автоматического пожаротушения МАСТЕР', 'Посмотрите наши видео-презентации и узнайте больше о возможностях системы МАСТЕР', '/videos/demo.mp4', true);

-- Insert sample scroll section data
INSERT IGNORE INTO scroll_section (section_title, section_subtitle, video_url) VALUES
('ТЕХНОЛОГИИ БУДУЩЕГО', 'Инновационные решения для автоматического пожаротушения', '/videos/demo.mp4');

-- Insert sample scroll section text blocks
INSERT IGNORE INTO scroll_section_text_blocks (scroll_section_id, title, description, sort_order) VALUES
(1, 'Интеллектуальное управление', 'Система автоматически определяет тип возгорания и выбирает оптимальный способ тушения', 1),
(1, 'Цифровой протокол M105', 'Высокоскоростная передача данных между устройствами с полным контролем состояния', 2),
(1, 'Кольцевая топология', 'Отказоустойчивая архитектура с автоматическим обходом поврежденных участков', 3);

-- Insert homepage block visibility defaults
INSERT IGNORE INTO home_blocks (block_key, title, description, sort_order, is_active) VALUES
('hero', 'Hero секция', 'Главный экран сайта с основным заголовком и CTA.', 1, true),
('about_main', 'О системе', 'Первый информационный блок о системе.', 2, true),
('technical_specs', 'Технические характеристики', 'Блок технических характеристик в цифрах.', 3, true),
('about_secondary', 'Решения', 'Второй информационный блок с отдельной группой данных.', 4, true),
('products', 'Продукция', 'Блок продукции на главной странице.', 5, true),
('video_presentations', 'Видео-презентации', 'Блок видео-презентаций на главной странице.', 6, true),
('downloads', 'Файлы для скачивания', 'Блок документов, сертификатов и презентаций.', 7, true),
('scroll_video', 'Scroll-блок с видео', 'Видео-блок со скролл-анимацией перед формой связи.', 8, true);

-- Insert page SEO defaults
INSERT IGNORE INTO page_meta (page_key, path, label, title, description, sort_order) VALUES
('home', '/', 'Главная', 'Автоматическая система пожарной сигнализации - Мастер', 'Современная интеллектуальная система пожарной сигнализации с интуитивным управлением, которая обеспечивает непрерывный мониторинг и быстрое реагирование.', 1),
('products', '/products', 'Продукция', 'Продукция | СПС МАСТЕР', 'Каталог продукции СПС МАСТЕР — приборы пожарной сигнализации, извещатели, блоки управления. Сертифицированное оборудование для объектов любой сложности.', 2),
('services', '/services', 'Услуги', 'Услуги | СПС МАСТЕР', 'Услуги СПС МАСТЕР: проектирование, монтаж, пусконаладка, обслуживание и экспертиза систем пожарной безопасности.', 3),
('portfolio', '/portfolio', 'Портфолио', 'Портфолио | СПС МАСТЕР', 'Портфолио СПС МАСТЕР: реализованные проекты пожарной сигнализации, СОУЭ, пожаротушения и комплексной противопожарной защиты.', 4),
('videos', '/videos', 'Видео-презентации', 'Видеопрезентации | СПС МАСТЕР', 'Видеопрезентации и обзоры оборудования СПС МАСТЕР. Смотрите как работают наши системы пожарной сигнализации.', 5),
('requisites', '/requisites', 'Реквизиты', 'Реквизиты | СПС МАСТЕР', 'Реквизиты компании СПС МАСТЕР — ИНН, КПП, ОГРН, банковские реквизиты и контактные данные для документооборота.', 6),
('about', '/about', 'О компании', 'О компании | СПС МАСТЕР', 'О компании СПС МАСТЕР — производитель систем пожарной и охранной сигнализации. История, команда, ценности.', 7),
('certificates', '/certificates', 'Сертификаты', 'Сертификаты | СПС МАСТЕР', 'Сертификаты и лицензии СПС МАСТЕР. Вся продукция сертифицирована и соответствует требованиям пожарной безопасности РФ.', 8),
('docs', '/docs', 'Документация', 'Документация | СПС МАСТЕР', 'Техническая документация, руководства по установке и эксплуатации оборудования СПС МАСТЕР. Скачать паспорта и инструкции.', 9),
('support', '/support', 'Поддержка', 'Поддержка | СПС МАСТЕР', 'Техническая поддержка СПС МАСТЕР — телефон, email, форма обратной связи. Помогаем с монтажом, настройкой и обслуживанием систем пожарной сигнализации.', 10),
('buy', '/buy', 'Оставить заявку', 'Оставить заявку | СПС МАСТЕР', 'Оставить заявку на системы пожарной сигнализации СПС МАСТЕР. Свяжемся с вами и подготовим предложение под задачи объекта.', 11);

-- Insert sample requisites data
INSERT IGNORE INTO requisites (company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address, postal_address, phone, email, bank_name, bik, bank_account, correspondent_account, director_name, director_position) VALUES
('ООО "АПС МАСТЕР"', 'Общество с ограниченной ответственностью "АПС МАСТЕР"', '1234567890', '123456789', '1234567890123', 'г. Москва, ул. Примерная, д. 1, оф. 101', 'г. Москва, ул. Примерная, д. 1, оф. 101', 'г. Москва, ул. Примерная, д. 1, оф. 101', '+7 (495) 123-45-67', 'info@aps-master.ru', 'ПАО "Сбербанк"', '044525225', '40702810123456789012', '30101810400000000225', 'Иванов Иван Иванович', 'Генеральный директор');

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

-- Insert sample product images data
INSERT IGNORE INTO product_images (product_id, image_url, alt_text, sort_order, is_active) VALUES
(1, '/images/products/datchik-temp-1.jpg', 'Датчик температуры МАСТЕР-Т - вид спереди', 1, true),
(1, '/images/products/datchik-temp-2.jpg', 'Датчик температуры МАСТЕР-Т - вид сбоку', 2, true),
(2, '/images/products/modul-pozhar-1.jpg', 'Модуль пожаротушения МАСТЕР-М - общий вид', 1, true),
(2, '/images/products/modul-pozhar-2.jpg', 'Модуль пожаротушения МАСТЕР-М - внутреннее устройство', 2, true),
(3, '/images/products/panel-uprav-1.jpg', 'Контрольная панель МАСТЕР-П - фронтальный вид', 1, true),
(3, '/images/products/panel-uprav-2.jpg', 'Контрольная панель МАСТЕР-П - задняя панель', 2, true),
(4, '/images/products/ikz-1.jpg', 'Изолятор короткого замыкания ИКЗ - общий вид', 1, true),
(4, '/images/products/ikz-2.jpg', 'Изолятор короткого замыкания ИКЗ - схема подключения', 2, true);

-- Insert sample product documents data
INSERT IGNORE INTO product_documents (product_id, name, description, file_url, file_type, file_size, sort_order, is_active) VALUES
(1, 'Руководство по эксплуатации МАСТЕР-Т', 'Подробное руководство по эксплуатации датчика температуры', '/documents/master-t-manual.pdf', 'application/pdf', 2048576, 1, true),
(1, 'Техническое описание МАСТЕР-Т', 'Технические характеристики и параметры датчика', '/documents/master-t-specs.pdf', 'application/pdf', 1024768, 2, true),
(2, 'Инструкция по монтажу МАСТЕР-М', 'Пошаговая инструкция по монтажу модуля пожаротушения', '/documents/master-m-install.pdf', 'application/pdf', 1536000, 1, true),
(2, 'Сертификат соответствия МАСТЕР-М', 'Сертификат соответствия ГОСТ для модуля пожаротушения', '/documents/master-m-cert.pdf', 'application/pdf', 512000, 2, true),
(3, 'Руководство администратора МАСТЕР-П', 'Руководство по настройке и администрированию панели', '/documents/master-p-admin.pdf', 'application/pdf', 3072000, 1, true),
(3, 'Схема подключения МАСТЕР-П', 'Электрическая схема подключения панели управления', '/documents/master-p-schema.pdf', 'application/pdf', 768000, 2, true),
(4, 'Техническое описание ИКЗ', 'Техническое описание изолятора короткого замыкания', '/documents/ikz-specs.pdf', 'application/pdf', 896000, 1, true),
(4, 'Инструкция по установке ИКЗ', 'Инструкция по установке и настройке ИКЗ', '/documents/ikz-install.pdf', 'application/pdf', 1280000, 2, true);

-- Insert sample users data
INSERT IGNORE INTO users (username, email, password_hash, role, is_active) VALUES
('admin', 'admin@aps-master.ru', '$2b$10$rQZ8K9vX7wE5tY3uI6oPCO8vX7wE5tY3uI6oPCO8vX7wE5tY3uI6oPC', 'admin', true);

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

CREATE INDEX idx_about_section_group ON about_section(section_group);
CREATE INDEX idx_service_blocks_active ON service_blocks(is_active);
CREATE INDEX idx_service_blocks_sort ON service_blocks(sort_order);
CREATE INDEX idx_portfolio_projects_slug ON portfolio_projects(slug);
CREATE INDEX idx_portfolio_projects_active ON portfolio_projects(is_active);
CREATE INDEX idx_portfolio_projects_sort ON portfolio_projects(sort_order);
CREATE INDEX idx_portfolio_sections_project ON portfolio_sections(project_id);
CREATE INDEX idx_portfolio_sections_active ON portfolio_sections(is_active);
CREATE INDEX idx_portfolio_sections_sort ON portfolio_sections(sort_order);

CREATE INDEX idx_home_blocks_sort ON home_blocks(sort_order);
CREATE INDEX idx_page_meta_sort ON page_meta(sort_order);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_active ON product_images(is_active);

CREATE INDEX idx_product_documents_product ON product_documents(product_id);
CREATE INDEX idx_product_documents_active ON product_documents(is_active);
