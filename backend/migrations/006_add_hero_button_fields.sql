-- Добавление полей для кнопки в hero_section
ALTER TABLE hero_section 
ADD COLUMN IF NOT EXISTS button_text VARCHAR(100) DEFAULT 'Купить',
ADD COLUMN IF NOT EXISTS button_url VARCHAR(255) DEFAULT '/buy';

-- Обновление существующих записей
UPDATE hero_section 
SET button_text = 'Купить', button_url = '/buy' 
WHERE button_text IS NULL OR button_url IS NULL;
