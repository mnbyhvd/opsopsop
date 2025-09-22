-- Создание таблиц для админки

-- Таблица для видео-презентаций
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    duration VARCHAR(20),
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица для документов и сертификатов
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('document', 'certificate')),
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица для настроек футера
CREATE TABLE IF NOT EXISTS footer_settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_subtitle VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    contact_address TEXT,
    working_hours VARCHAR(100),
    form_title VARCHAR(255),
    form_description TEXT,
    privacy_policy_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_videos_sort_order ON videos(sort_order);
CREATE INDEX IF NOT EXISTS idx_videos_is_active ON videos(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_sort_order ON documents(sort_order);
CREATE INDEX IF NOT EXISTS idx_documents_is_active ON documents(is_active);

-- Вставка тестовых данных для видео
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, sort_order, is_active) VALUES
('Демонстрация системы МАСТЕР', 'Полная демонстрация возможностей системы МАСТЕР', 'https://example.com/video1.mp4', 'https://example.com/thumb1.jpg', '5:30', 1, true),
('Установка и настройка', 'Пошаговая инструкция по установке и настройке системы', 'https://example.com/video2.mp4', 'https://example.com/thumb2.jpg', '3:45', 2, true),
('Интеграция с другими системами', 'Как интегрировать МАСТЕР с существующими системами безопасности', 'https://example.com/video3.mp4', 'https://example.com/thumb3.jpg', '4:20', 3, true)
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для документов
INSERT INTO documents (title, url, type, sort_order, is_active) VALUES
('Руководство пользователя', 'https://example.com/user-manual.pdf', 'document', 1, true),
('Техническое описание', 'https://example.com/tech-spec.pdf', 'document', 2, true),
('Сертификат соответствия', 'https://example.com/certificate.pdf', 'certificate', 1, true),
('Сертификат качества', 'https://example.com/quality-cert.pdf', 'certificate', 2, true)
ON CONFLICT DO NOTHING;

-- Вставка дефолтных настроек футера
INSERT INTO footer_settings (
    company_name, company_subtitle, contact_phone, contact_email, 
    contact_address, working_hours, form_title, form_description, 
    privacy_policy_url
) VALUES (
    'МАСТЕР', 'Элемент', '+7 (999) 999-99-99', 'email@gmail.ru',
    'г. Москва, ул. Остоженка, д.1/9', 'Пн-Пт 10:00-18:00',
    'СВЯЖИТЕСЬ С НАМИ',
    'Оставьте заявку и получите спецификацию и коммерческое предложение, подобранные именно под ваши задачи.',
    '#privacy'
) ON CONFLICT DO NOTHING;
