-- Сброс стилей сайта к дефолтным значениям
-- Эта миграция:
-- 1) Деактивирует все текущие записи в site_styles
-- 2) Вставляет новую запись с дефолтными значениями (как в первоначальной схеме)

-- Деактивируем все текущие стили
UPDATE site_styles SET is_active = false WHERE is_active = true;

-- Определяем следующую версию
SET @max_version := (SELECT COALESCE(MAX(version), 0) FROM site_styles);
SET @next_version := @max_version + 1;

-- Вставляем дефолтную запись стилей
INSERT INTO site_styles (
  color_background, color_text, color_accent, color_brand, color_glass_border,
  radius_xl, radius_lg, blur_glass,
  font_headings, font_body, font_headings_fallback, font_body_fallback,
  font_headings_color, font_body_color, font_headings_url, font_body_url,
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
  '#F5F5F5', '#F5F5F5', NULL, NULL,
  '#FFFFFF', '#0D0D0D', '#FFFFFF',
  'rgba(255, 255, 255, 0.1)', '#FFFFFF', 'transparent', '30px',
  'transparent', '#FFFFFF', '#FFFFFF',
  'rgba(255, 255, 255, 0.1)', '#FFFFFF', '#FFFFFF', '30px',
  'rgba(255, 255, 255, 0.05)', '#F5F5F5', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.08)', '#F5F5F5', 'rgba(255, 255, 255, 0.6)', '12px', 'rgba(255, 255, 255, 0.5)',
  'rgba(255, 255, 255, 0.05)', '#F5F5F5', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.6)', '12px',
  'rgba(255, 255, 255, 0.05)', '#F5F5F5', '#D71920', 'rgba(255, 255, 255, 0.1)', '16px',
  'rgba(255, 255, 255, 0.05)', '#F5F5F5', 'rgba(255, 255, 255, 0.1)', '16px', 'rgba(255, 255, 255, 0.08)',
  @next_version, true
);

