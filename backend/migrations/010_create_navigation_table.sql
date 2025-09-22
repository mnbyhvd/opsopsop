-- Создание таблицы для навигационного меню
CREATE TABLE IF NOT EXISTS navigation_menu (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    sort_order INTEGER DEFAULT 1,
    parent_id INTEGER REFERENCES navigation_menu(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_navigation_menu_sort_order ON navigation_menu(sort_order);
CREATE INDEX IF NOT EXISTS idx_navigation_menu_is_active ON navigation_menu(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_menu_parent_id ON navigation_menu(parent_id);

-- Вставка правильных данных навигации
INSERT INTO navigation_menu (title, url, sort_order, is_active) VALUES
('Главная', '/', 1, true),
('Продукция', '/products', 2, true),
('Видео-презентации', '/videos', 3, true)
ON CONFLICT DO NOTHING;

-- Добавление комментариев
COMMENT ON TABLE navigation_menu IS 'Таблица навигационного меню сайта';
COMMENT ON COLUMN navigation_menu.title IS 'Название пункта меню';
COMMENT ON COLUMN navigation_menu.url IS 'URL ссылки';
COMMENT ON COLUMN navigation_menu.sort_order IS 'Порядок сортировки';
COMMENT ON COLUMN navigation_menu.parent_id IS 'ID родительского пункта (для подменю)';
COMMENT ON COLUMN navigation_menu.is_active IS 'Активен ли пункт меню';
