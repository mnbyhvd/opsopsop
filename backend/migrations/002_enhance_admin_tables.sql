-- Обновление таблиц для расширенной функциональности админки

-- Добавляем поля для метаданных файлов
ALTER TABLE videos ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT NOW();

ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT NOW();

-- Добавляем поля для продуктов
ALTER TABLE products ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT NOW();

-- Добавляем поля для about секции
ALTER TABLE about ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE about ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
ALTER TABLE about ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
ALTER TABLE about ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP DEFAULT NOW();

-- Создаем таблицу для логов загрузки файлов
CREATE TABLE IF NOT EXISTS file_uploads (
    id SERIAL PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP DEFAULT NOW(),
    uploaded_by VARCHAR(100) DEFAULT 'admin'
);

-- Создаем таблицу для экспорта данных
CREATE TABLE IF NOT EXISTS data_exports (
    id SERIAL PRIMARY KEY,
    export_type VARCHAR(50) NOT NULL, -- 'videos', 'documents', 'products', 'about'
    export_format VARCHAR(10) NOT NULL, -- 'json', 'csv', 'xlsx'
    file_path VARCHAR(500) NOT NULL,
    export_date TIMESTAMP DEFAULT NOW(),
    exported_by VARCHAR(100) DEFAULT 'admin',
    record_count INTEGER DEFAULT 0
);

-- Создаем таблицу для настроек админки
CREATE TABLE IF NOT EXISTS admin_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Добавляем настройки по умолчанию
INSERT INTO admin_settings (setting_key, setting_value, setting_type, description) VALUES
('max_file_size', '104857600', 'number', 'Максимальный размер файла в байтах (100MB)'),
('allowed_image_types', '["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]', 'json', 'Разрешенные типы изображений'),
('allowed_video_types', '["video/mp4", "video/avi", "video/mov", "video/wmv"]', 'json', 'Разрешенные типы видео'),
('allowed_document_types', '["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]', 'json', 'Разрешенные типы документов'),
('upload_path', '/uploads', 'string', 'Путь для загрузки файлов'),
('enable_file_compression', 'true', 'boolean', 'Включить сжатие изображений'),
('video_quality', 'medium', 'string', 'Качество видео (low, medium, high)')
ON CONFLICT (setting_key) DO NOTHING;

-- Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_file_uploads_upload_date ON file_uploads(upload_date);
CREATE INDEX IF NOT EXISTS idx_file_uploads_file_type ON file_uploads(file_type);
CREATE INDEX IF NOT EXISTS idx_data_exports_export_date ON data_exports(export_date);
CREATE INDEX IF NOT EXISTS idx_data_exports_export_type ON data_exports(export_type);

-- Добавляем триггеры для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применяем триггеры к существующим таблицам
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_updated_at ON about;
CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_footer_settings_updated_at ON footer_settings;
CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON footer_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Создаем представление для статистики загрузок
CREATE OR REPLACE VIEW upload_stats AS
SELECT 
    file_type,
    COUNT(*) as file_count,
    SUM(file_size) as total_size,
    AVG(file_size) as avg_size,
    MAX(upload_date) as last_upload
FROM file_uploads 
GROUP BY file_type
ORDER BY file_count DESC;

-- Создаем представление для статистики экспорта
CREATE OR REPLACE VIEW export_stats AS
SELECT 
    export_type,
    export_format,
    COUNT(*) as export_count,
    SUM(record_count) as total_records,
    MAX(export_date) as last_export
FROM data_exports 
GROUP BY export_type, export_format
ORDER BY export_count DESC;
