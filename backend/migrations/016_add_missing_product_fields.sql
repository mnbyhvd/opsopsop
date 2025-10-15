-- Добавление недостающих полей в таблицу products
ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_page_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_name VARCHAR(255);

-- Обновление существующих записей с category_name на основе category
UPDATE products SET category_name = category WHERE category IS NOT NULL AND category_name IS NULL;

-- Добавление индекса для category_name
CREATE INDEX IF NOT EXISTS idx_products_category_name ON products(category_name);
