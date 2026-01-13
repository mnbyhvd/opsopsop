-- Добавляем колонку youtube_url в таблицу videos
-- Если колонка уже существует, будет ошибка, которую можно проигнорировать
ALTER TABLE videos ADD COLUMN youtube_url VARCHAR(500);
