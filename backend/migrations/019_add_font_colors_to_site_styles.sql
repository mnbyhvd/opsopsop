-- Добавляем колонки для цветов шрифтов
ALTER TABLE site_styles ADD COLUMN font_headings_color VARCHAR(7) DEFAULT '#F5F5F5';
ALTER TABLE site_styles ADD COLUMN font_body_color VARCHAR(7) DEFAULT '#F5F5F5';

-- Обновляем существующие записи
UPDATE site_styles SET 
  font_headings_color = '#F5F5F5',
  font_body_color = '#F5F5F5'
WHERE font_headings_color IS NULL OR font_body_color IS NULL;
