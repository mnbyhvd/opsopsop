-- Увеличение длины полей цветов до 50 символов, чтобы поддерживать rgba/hsla
ALTER TABLE site_styles
  MODIFY COLUMN color_background VARCHAR(50) DEFAULT '#0D0D0D',
  MODIFY COLUMN color_text VARCHAR(50) DEFAULT '#F5F5F5',
  MODIFY COLUMN color_accent VARCHAR(50) DEFAULT '#D71920',
  MODIFY COLUMN color_brand VARCHAR(50) DEFAULT '#ECC30B',
  MODIFY COLUMN button_primary_bg VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN button_primary_text VARCHAR(50) DEFAULT '#0D0D0D',
  MODIFY COLUMN button_primary_border VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN button_primary_hover_text VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN button_secondary_bg VARCHAR(50) DEFAULT 'transparent',
  MODIFY COLUMN button_secondary_text VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN button_secondary_border VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN button_secondary_hover_bg VARCHAR(50) DEFAULT 'rgba(255, 255, 255, 0.1)',
  MODIFY COLUMN button_secondary_hover_text VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN button_secondary_hover_border VARCHAR(50) DEFAULT '#FFFFFF',
  MODIFY COLUMN input_text VARCHAR(50) DEFAULT '#F5F5F5',
  MODIFY COLUMN input_focus_text VARCHAR(50) DEFAULT '#F5F5F5',
  MODIFY COLUMN search_text VARCHAR(50) DEFAULT '#F5F5F5',
  MODIFY COLUMN nav_text VARCHAR(50) DEFAULT '#F5F5F5',
  MODIFY COLUMN nav_link_hover VARCHAR(50) DEFAULT '#D71920',
  MODIFY COLUMN card_text VARCHAR(50) DEFAULT '#F5F5F5';

