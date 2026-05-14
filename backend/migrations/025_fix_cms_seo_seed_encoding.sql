-- Repair UTF-8 seed data inserted through clients with a non-UTF-8 connection charset.

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

UPDATE navigation_menu
SET title = 'Услуги'
WHERE url = '/services'
  AND (title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%');

UPDATE navigation_menu
SET title = 'Портфолио'
WHERE url = '/portfolio'
  AND (title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%');

UPDATE about_section
SET
  title = 'Единая среда проектирования',
  description = 'Система подходит для объектов разного масштаба: от отдельных помещений до распределённых комплексов с несколькими панелями и сценариями оповещения.'
WHERE section_group = 'secondary'
  AND sort_order = 1
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
  );

UPDATE about_section
SET
  title = 'Интеграция с инженерными системами',
  description = 'Оборудование позволяет связывать пожарную автоматику, оповещение, диспетчеризацию и исполнительные устройства в единую управляемую инфраструктуру.'
WHERE section_group = 'secondary'
  AND sort_order = 2
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
  );

UPDATE about_section
SET
  title = 'Контроль состояния оборудования',
  description = 'Адресная архитектура помогает быстро находить события, неисправности и зоны срабатывания, сокращая время диагностики и обслуживания.'
WHERE section_group = 'secondary'
  AND sort_order = 3
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
  );

UPDATE service_blocks
SET
  title = 'Проектирование систем противопожарной безопасности',
  description = 'Анализ объекта, разработка рабочей документации и подбор технических решений для систем пожарной сигнализации, оповещения и управления эвакуацией.'
WHERE sort_order = 1
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
  );

UPDATE service_blocks
SET
  title = 'Монтаж систем пожарной сигнализации',
  description = 'Полный комплекс монтажных работ: прокладка трасс, установка оборудования, подключение и подготовка систем к пусконаладке.'
WHERE sort_order = 2
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
  );

UPDATE service_blocks
SET
  title = 'Монтаж систем пожаротушения',
  description = 'Установка и интеграция систем пожаротушения в общий контур безопасности объекта с проверкой исполнительных модулей.'
WHERE sort_order = 3
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
  );

UPDATE portfolio_projects
SET
  title = 'Автоматическая пожарная сигнализация и СОУЭ',
  location = 'Москва, Московский, Киевское шоссе, 22 км',
  summary = 'Полное оснащение объекта современными системами противопожарной защиты.',
  description = 'В рамках проекта выполнено полное оснащение объекта современными системами противопожарной защиты: разработана рабочая документация, смонтирована адресно-аналоговая система автоматической пожарной сигнализации на базе приборов «Мастер 1-2F1E», а также система оповещения и управления эвакуацией 2-го типа.',
  meta_title = 'Автоматическая пожарная сигнализация и СОУЭ | СПС МАСТЕР',
  meta_description = 'Пример проекта СПС МАСТЕР: пожарная сигнализация, СОУЭ, монтаж и пусконаладка.'
WHERE slug = 'aps-soue-moscow'
  AND (
    title LIKE '%Ð%' OR title LIKE '%Ñ%' OR title LIKE '%Â%'
    OR location LIKE '%Ð%' OR location LIKE '%Ñ%' OR location LIKE '%Â%'
    OR summary LIKE '%Ð%' OR summary LIKE '%Ñ%' OR summary LIKE '%Â%'
    OR description LIKE '%Ð%' OR description LIKE '%Ñ%' OR description LIKE '%Â%'
    OR meta_title LIKE '%Ð%' OR meta_title LIKE '%Ñ%' OR meta_title LIKE '%Â%'
    OR meta_description LIKE '%Ð%' OR meta_description LIKE '%Ñ%' OR meta_description LIKE '%Â%'
  );

UPDATE portfolio_sections s
JOIN portfolio_projects p ON p.id = s.project_id
SET
  s.title = 'Система автоматической пожарной сигнализации',
  s.description = 'Обеспечение раннего обнаружения очага возгорания и определение его точного местоположения. Автоматическая выдача сигнала на запуск системы оповещения.'
WHERE p.slug = 'aps-soue-moscow'
  AND s.sort_order = 1
  AND (
    s.title LIKE '%Ð%' OR s.title LIKE '%Ñ%' OR s.title LIKE '%Â%'
    OR s.description LIKE '%Ð%' OR s.description LIKE '%Ñ%' OR s.description LIKE '%Â%'
  );
