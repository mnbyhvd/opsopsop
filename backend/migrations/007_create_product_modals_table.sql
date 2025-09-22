-- Создание таблицы для модальных окон продуктов
CREATE TABLE IF NOT EXISTS product_modals (
    id SERIAL PRIMARY KEY,
    area_id VARCHAR(50) NOT NULL, -- ID области (area-1, area-2, etc.)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    button_text VARCHAR(100) DEFAULT 'Подробнее',
    button_url VARCHAR(500),
    position_x INTEGER DEFAULT 0, -- Позиция X относительно области
    position_y INTEGER DEFAULT 0, -- Позиция Y относительно области
    sort_order INTEGER DEFAULT 0, -- Порядок отображения
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_product_modals_area_id ON product_modals(area_id);
CREATE INDEX IF NOT EXISTS idx_product_modals_sort_order ON product_modals(area_id, sort_order);

-- Добавляем комментарии к таблице и колонкам
COMMENT ON TABLE product_modals IS 'Модальные окна для интерактивных областей продуктов';
COMMENT ON COLUMN product_modals.area_id IS 'ID области продукта (area-1, area-2, area-3, area-4)';
COMMENT ON COLUMN product_modals.title IS 'Заголовок модального окна';
COMMENT ON COLUMN product_modals.description IS 'Описание в модальном окне';
COMMENT ON COLUMN product_modals.button_text IS 'Текст кнопки';
COMMENT ON COLUMN product_modals.button_url IS 'URL для перехода по кнопке';
COMMENT ON COLUMN product_modals.position_x IS 'Позиция X относительно области (для расстановки рядом)';
COMMENT ON COLUMN product_modals.position_y IS 'Позиция Y относительно области (для расстановки рядом)';
COMMENT ON COLUMN product_modals.sort_order IS 'Порядок отображения модальных окон';
COMMENT ON COLUMN product_modals.is_active IS 'Активно ли модальное окно';
