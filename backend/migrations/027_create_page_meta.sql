-- CMS-managed title and description for static site pages.

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS page_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_page_meta_page_key (page_key)
);

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'home', '/', 'Главная', 'Автоматическая система пожарной сигнализации - Мастер', 'Современная интеллектуальная система пожарной сигнализации с интуитивным управлением, которая обеспечивает непрерывный мониторинг и быстрое реагирование.', 1
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'home');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'products', '/products', 'Продукция', 'Продукция | СПС МАСТЕР', 'Каталог продукции СПС МАСТЕР — приборы пожарной сигнализации, извещатели, блоки управления. Сертифицированное оборудование для объектов любой сложности.', 2
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'products');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'services', '/services', 'Услуги', 'Услуги | СПС МАСТЕР', 'Услуги СПС МАСТЕР: проектирование, монтаж, пусконаладка, обслуживание и экспертиза систем пожарной безопасности.', 3
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'services');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'portfolio', '/portfolio', 'Портфолио', 'Портфолио | СПС МАСТЕР', 'Портфолио СПС МАСТЕР: реализованные проекты пожарной сигнализации, СОУЭ, пожаротушения и комплексной противопожарной защиты.', 4
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'portfolio');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'videos', '/videos', 'Видео-презентации', 'Видеопрезентации | СПС МАСТЕР', 'Видеопрезентации и обзоры оборудования СПС МАСТЕР. Смотрите как работают наши системы пожарной сигнализации.', 5
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'videos');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'requisites', '/requisites', 'Реквизиты', 'Реквизиты | СПС МАСТЕР', 'Реквизиты компании СПС МАСТЕР — ИНН, КПП, ОГРН, банковские реквизиты и контактные данные для документооборота.', 6
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'requisites');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'about', '/about', 'О компании', 'О компании | СПС МАСТЕР', 'О компании СПС МАСТЕР — производитель систем пожарной и охранной сигнализации. История, команда, ценности.', 7
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'about');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'certificates', '/certificates', 'Сертификаты', 'Сертификаты | СПС МАСТЕР', 'Сертификаты и лицензии СПС МАСТЕР. Вся продукция сертифицирована и соответствует требованиям пожарной безопасности РФ.', 8
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'certificates');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'docs', '/docs', 'Документация', 'Документация | СПС МАСТЕР', 'Техническая документация, руководства по установке и эксплуатации оборудования СПС МАСТЕР. Скачать паспорта и инструкции.', 9
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'docs');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'support', '/support', 'Поддержка', 'Поддержка | СПС МАСТЕР', 'Техническая поддержка СПС МАСТЕР — телефон, email, форма обратной связи. Помогаем с монтажом, настройкой и обслуживанием систем пожарной сигнализации.', 10
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'support');

INSERT INTO page_meta (page_key, path, label, title, description, sort_order)
SELECT 'buy', '/buy', 'Оставить заявку', 'Оставить заявку | СПС МАСТЕР', 'Оставить заявку на системы пожарной сигнализации СПС МАСТЕР. Свяжемся с вами и подготовим предложение под задачи объекта.', 11
WHERE NOT EXISTS (SELECT 1 FROM page_meta WHERE page_key = 'buy');
