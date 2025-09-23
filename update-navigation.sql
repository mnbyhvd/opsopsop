-- Обновление навигационного меню
-- Удаляем все старые записи
DELETE FROM navigation_menu;

-- Вставляем только нужные пункты меню
INSERT INTO navigation_menu (title, url, sort_order, parent_id, is_active) VALUES
('Главная', '/', 1, NULL, true),
('Продукция', '/products', 2, NULL, true),
('Видео-презентации', '/videos', 3, NULL, true),
('Реквизиты', '/requisites', 4, NULL, true);
