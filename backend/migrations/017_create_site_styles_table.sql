-- Создание таблицы для хранения стилей сайта
CREATE TABLE IF NOT EXISTS site_styles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Основные цвета
    color_background VARCHAR(7) DEFAULT '#0D0D0D',
    color_text VARCHAR(7) DEFAULT '#F5F5F5',
    color_accent VARCHAR(7) DEFAULT '#D71920',
    color_brand VARCHAR(7) DEFAULT '#ECC30B',
    color_glass_border VARCHAR(50) DEFAULT 'rgba(255,255,255,0.1)',
    
    -- Радиусы скругления
    radius_xl VARCHAR(10) DEFAULT '16px',
    radius_lg VARCHAR(10) DEFAULT '12px',
    
    -- Эффекты размытия
    blur_glass VARCHAR(10) DEFAULT '12px',
    
    -- Шрифты
    font_headings VARCHAR(100) DEFAULT 'Bebas Neue',
    font_body VARCHAR(100) DEFAULT 'Inter',
    font_headings_fallback VARCHAR(200) DEFAULT 'Arial Black, Arial, sans-serif',
    font_body_fallback VARCHAR(200) DEFAULT 'sans-serif',
    
    -- Кнопки
    button_primary_bg VARCHAR(7) DEFAULT '#FFFFFF',
    button_primary_text VARCHAR(7) DEFAULT '#0D0D0D',
    button_primary_border VARCHAR(7) DEFAULT '#FFFFFF',
    button_primary_hover_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
    button_primary_hover_text VARCHAR(7) DEFAULT '#FFFFFF',
    button_primary_hover_border VARCHAR(7) DEFAULT 'transparent',
    button_primary_radius VARCHAR(10) DEFAULT '30px',
    
    button_secondary_bg VARCHAR(7) DEFAULT 'transparent',
    button_secondary_text VARCHAR(7) DEFAULT '#FFFFFF',
    button_secondary_border VARCHAR(7) DEFAULT '#FFFFFF',
    button_secondary_hover_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
    button_secondary_hover_text VARCHAR(7) DEFAULT '#FFFFFF',
    button_secondary_hover_border VARCHAR(7) DEFAULT '#FFFFFF',
    button_secondary_radius VARCHAR(10) DEFAULT '30px',
    
    -- Поля ввода
    input_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.05)',
    input_text VARCHAR(7) DEFAULT '#F5F5F5',
    input_border VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
    input_focus_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.08)',
    input_focus_text VARCHAR(7) DEFAULT '#F5F5F5',
    input_focus_border VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.6)',
    input_radius VARCHAR(10) DEFAULT '12px',
    input_placeholder VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.5)',
    
    -- Поля поиска
    search_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.05)',
    search_text VARCHAR(7) DEFAULT '#F5F5F5',
    search_border VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
    search_focus_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.08)',
    search_focus_border VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.6)',
    search_radius VARCHAR(10) DEFAULT '12px',
    
    -- Навигация
    nav_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.05)',
    nav_text VARCHAR(7) DEFAULT '#F5F5F5',
    nav_link_hover VARCHAR(7) DEFAULT '#D71920',
    nav_border VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
    nav_radius VARCHAR(10) DEFAULT '16px',
    
    -- Карточки и блоки
    card_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.05)',
    card_text VARCHAR(7) DEFAULT '#F5F5F5',
    card_border VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
    card_radius VARCHAR(10) DEFAULT '16px',
    card_hover_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.08)',
    
    -- Метаданные
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Вставка дефолтных значений
INSERT INTO site_styles (
    color_background, color_text, color_accent, color_brand, color_glass_border,
    radius_xl, radius_lg, blur_glass,
    font_headings, font_body, font_headings_fallback, font_body_fallback,
    button_primary_bg, button_primary_text, button_primary_border,
    button_primary_hover_bg, button_primary_hover_text, button_primary_hover_border, button_primary_radius,
    button_secondary_bg, button_secondary_text, button_secondary_border,
    button_secondary_hover_bg, button_secondary_hover_text, button_secondary_hover_border, button_secondary_radius,
    input_bg, input_text, input_border, input_focus_bg, input_focus_text, input_focus_border, input_radius, input_placeholder,
    search_bg, search_text, search_border, search_focus_bg, search_focus_border, search_radius,
    nav_bg, nav_text, nav_link_hover, nav_border, nav_radius,
    card_bg, card_text, card_border, card_radius, card_hover_bg,
    version, is_active
) VALUES (
    '#0D0D0D', '#F5F5F5', '#D71920', '#ECC30B', 'rgba(255,255,255,0.1)',
    '16px', '12px', '12px',
    'Bebas Neue', 'Inter', 'Arial Black, Arial, sans-serif', 'sans-serif',
    '#FFFFFF', '#0D0D0D', '#FFFFFF',
    'rgba(255, 255, 255, 0.1)', '#FFFFFF', 'transparent', '30px',
    'transparent', '#FFFFFF', '#FFFFFF',
    'rgba(255, 255, 255, 0.1)', '#FFFFFF', '#FFFFFF', '30px',
    'rgba(255, 255, 255, 0.05)', '#F5F5F5', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.08)', '#F5F5F5', 'rgba(255, 255, 255, 0.6)', '12px', 'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.05)', '#F5F5F5', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.6)', '12px',
    'rgba(255, 255, 255, 0.05)', '#F5F5F5', '#D71920', 'rgba(255, 255, 255, 0.1)', '16px',
    'rgba(255, 255, 255, 0.05)', '#F5F5F5', 'rgba(255, 255, 255, 0.1)', '16px', 'rgba(255, 255, 255, 0.08)',
    1, true
) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Создание индекса
CREATE INDEX IF NOT EXISTS idx_site_styles_is_active ON site_styles(is_active);
CREATE INDEX IF NOT EXISTS idx_site_styles_version ON site_styles(version);
