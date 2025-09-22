-- Добавляем колонку youtube_url в таблицу videos
ALTER TABLE videos ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Создаем таблицу для настроек секции видео-презентаций
CREATE TABLE IF NOT EXISTS video_presentations_settings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
