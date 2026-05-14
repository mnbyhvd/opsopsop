-- Add homepage about groups, services, and portfolio entities.

SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'about_section'
      AND COLUMN_NAME = 'section_group'
);
SET @sql = IF(
    @column_exists = 0,
    'ALTER TABLE about_section ADD COLUMN section_group VARCHAR(50) DEFAULT ''main''',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE about_section SET section_group = 'main' WHERE section_group IS NULL OR section_group = '';

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

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'about_section'
      AND INDEX_NAME = 'idx_about_section_group'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_about_section_group ON about_section(section_group)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'service_blocks'
      AND INDEX_NAME = 'idx_service_blocks_active'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_service_blocks_active ON service_blocks(is_active)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'service_blocks'
      AND INDEX_NAME = 'idx_service_blocks_sort'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_service_blocks_sort ON service_blocks(sort_order)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'portfolio_projects'
      AND INDEX_NAME = 'idx_portfolio_projects_slug'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_portfolio_projects_slug ON portfolio_projects(slug)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'portfolio_projects'
      AND INDEX_NAME = 'idx_portfolio_projects_active'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_portfolio_projects_active ON portfolio_projects(is_active)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'portfolio_projects'
      AND INDEX_NAME = 'idx_portfolio_projects_sort'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_portfolio_projects_sort ON portfolio_projects(sort_order)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'portfolio_sections'
      AND INDEX_NAME = 'idx_portfolio_sections_project'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_portfolio_sections_project ON portfolio_sections(project_id)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'portfolio_sections'
      AND INDEX_NAME = 'idx_portfolio_sections_active'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_portfolio_sections_active ON portfolio_sections(is_active)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'portfolio_sections'
      AND INDEX_NAME = 'idx_portfolio_sections_sort'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_portfolio_sections_sort ON portfolio_sections(sort_order)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
