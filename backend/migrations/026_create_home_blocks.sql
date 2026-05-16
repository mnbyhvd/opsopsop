-- Homepage block visibility flags for CMS-managed rendering.

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS home_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_key VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_home_blocks_block_key (block_key)
);

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'hero', 'Hero секция', 'Главный экран сайта с основным заголовком и CTA.', 1, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'hero');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'about_main', 'О системе', 'Первый информационный блок о системе.', 2, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'about_main');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'technical_specs', 'Технические характеристики', 'Блок технических характеристик в цифрах.', 3, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'technical_specs');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'about_secondary', 'Решения', 'Второй информационный блок с отдельной группой данных.', 4, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'about_secondary');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'products', 'Продукция', 'Блок продукции на главной странице.', 5, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'products');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'video_presentations', 'Видео-презентации', 'Блок видео-презентаций на главной странице.', 6, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'video_presentations');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'downloads', 'Файлы для скачивания', 'Блок документов, сертификатов и презентаций.', 7, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'downloads');

INSERT INTO home_blocks (block_key, title, description, sort_order, is_active)
SELECT 'scroll_video', 'Scroll-блок с видео', 'Видео-блок со скролл-анимацией перед формой связи.', 8, true
WHERE NOT EXISTS (SELECT 1 FROM home_blocks WHERE block_key = 'scroll_video');
