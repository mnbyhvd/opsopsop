-- Создание таблицы видео
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    duration VARCHAR(20),
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Вставляем тестовые данные видео
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, category, sort_order, is_active) VALUES
('Демонстрация системы МАСТЕР', 'Полная демонстрация возможностей системы МАСТЕР', '/videos/demo.mp4', '/videos/demo.gif', '5:30', 'Демонстрации', 1, true),
('Установка и настройка', 'Пошаговая инструкция по установке и настройке системы', '/videos/installation.mp4', '/videos/installation.gif', '3:45', 'Инструкции', 2, true),
('Технические характеристики', 'Подробный обзор технических характеристик оборудования', '/videos/tech-specs.mp4', '/videos/tech-specs.gif', '4:20', 'Техническая информация', 3, true),
('Обслуживание и ремонт', 'Руководство по обслуживанию и ремонту оборудования', '/videos/maintenance.mp4', '/videos/maintenance.gif', '6:15', 'Обслуживание', 4, true)
ON CONFLICT (id) DO NOTHING;
