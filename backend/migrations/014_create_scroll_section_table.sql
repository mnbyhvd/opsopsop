-- Создание таблицы scroll_section
CREATE TABLE IF NOT EXISTS scroll_section (
    id SERIAL PRIMARY KEY,
    section_title VARCHAR(255) NOT NULL,
    section_subtitle TEXT NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы scroll_section_text_blocks
CREATE TABLE IF NOT EXISTS scroll_section_text_blocks (
    id SERIAL PRIMARY KEY,
    scroll_section_id INTEGER NOT NULL REFERENCES scroll_section(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Вставляем тестовые данные
INSERT INTO scroll_section (section_title, section_subtitle, video_url) VALUES
('ТЕХНОЛОГИИ БУДУЩЕГО', 'Инновационные решения для автоматического пожаротушения', '/videos/demo.mp4')
ON CONFLICT (id) DO NOTHING;

-- Получаем ID созданной записи
DO $$
DECLARE
    section_id INTEGER;
BEGIN
    SELECT id INTO section_id FROM scroll_section WHERE section_title = 'ТЕХНОЛОГИИ БУДУЩЕГО';
    
    -- Вставляем текстовые блоки
    INSERT INTO scroll_section_text_blocks (scroll_section_id, title, description, order_index) VALUES
    (section_id, 'Интеллектуальное управление', 'Система автоматически определяет тип возгорания и выбирает оптимальный способ тушения', 1),
    (section_id, 'Мгновенное реагирование', 'Обнаружение пожара за 3 секунды, подача огнетушащего вещества за 10 секунд', 2),
    (section_id, 'Экологическая безопасность', 'Использование современных экологически чистых огнетушащих веществ', 3),
    (section_id, 'Интеграция с системами', 'Полная совместимость с существующими системами безопасности здания', 4)
    ON CONFLICT (id) DO NOTHING;
END $$;
