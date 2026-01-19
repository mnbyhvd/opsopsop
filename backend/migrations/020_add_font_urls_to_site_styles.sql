-- Добавляем колонки для URL кастомных шрифтов (если загружаются из внешних источников)
ALTER TABLE site_styles ADD COLUMN font_headings_url VARCHAR(500) DEFAULT NULL;
ALTER TABLE site_styles ADD COLUMN font_body_url VARCHAR(500) DEFAULT NULL;

-- Обновляем существующие записи
UPDATE site_styles SET 
  font_headings_url = NULL,
  font_body_url = NULL
WHERE font_headings_url IS NULL OR font_body_url IS NULL;
