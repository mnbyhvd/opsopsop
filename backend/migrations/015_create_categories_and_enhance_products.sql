-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Вставка базовых категорий
INSERT IGNORE INTO categories (name, description, sort_order, is_active) VALUES
('Контрольные панели', 'Центральные панели управления системами безопасности', 1, true),
('Датчики', 'Различные типы датчиков для систем безопасности', 2, true),
('Модули', 'Модули управления и расширения функциональности', 3, true),
('Контроллеры', 'Контроллеры для управления сложными системами', 4, true),
('Аксессуары', 'Дополнительные аксессуары и комплектующие', 5, true);

-- Добавление колонки category_id в таблицу products
ALTER TABLE products ADD COLUMN category_id INTEGER;

-- Обновление существующих продуктов с привязкой к категориям
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Контрольные панели') WHERE category = 'Контрольные панели';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Датчики') WHERE category = 'Датчики';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Модули') WHERE category = 'Модули';
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Контроллеры') WHERE category = 'Контроллеры';

-- Создание таблицы для хранения изображений продуктов (карусель)
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы для хранения документов продуктов
CREATE TABLE IF NOT EXISTS product_documents (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Добавление индексов для оптимизации
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_documents_product_id ON product_documents(product_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
