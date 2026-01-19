const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'opsopsop-db',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'master_sps',
  user: process.env.DB_USER || 'master_sps_user',
  password: process.env.DB_PASSWORD || 'MasterSPS2024!',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET active site styles
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM site_styles 
      WHERE is_active = true
      ORDER BY version DESC, updated_at DESC
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      // Возвращаем дефолтные значения, если ничего не найдено
      return res.json({
        success: true,
        data: {
          colors: {
            background: '#0D0D0D',
            text: '#F5F5F5',
            accent: '#D71920',
            brand: '#ECC30B',
            glassBorder: 'rgba(255,255,255,0.1)'
          },
          radius: {
            xl: '16px',
            lg: '12px'
          },
          blur: {
            glass: '12px'
          },
          fonts: {
            headings: 'Bebas Neue',
            body: 'Inter',
            headingsFallback: 'Arial Black, Arial, sans-serif',
            bodyFallback: 'sans-serif',
            headingsColor: '#F5F5F5',
            bodyColor: '#F5F5F5',
            headingsUrl: null,
            bodyUrl: null
          },
          buttons: {
            primary: {
              bg: '#FFFFFF',
              text: '#0D0D0D',
              border: '#FFFFFF',
              hoverBg: 'rgba(255, 255, 255, 0.1)',
              hoverText: '#FFFFFF',
              hoverBorder: 'transparent',
              radius: '30px'
            },
            secondary: {
              bg: 'transparent',
              text: '#FFFFFF',
              border: '#FFFFFF',
              hoverBg: 'rgba(255, 255, 255, 0.1)',
              hoverText: '#FFFFFF',
              hoverBorder: '#FFFFFF',
              radius: '30px'
            }
          },
          inputs: {
            bg: 'rgba(255, 255, 255, 0.05)',
            text: '#F5F5F5',
            border: 'rgba(255, 255, 255, 0.1)',
            focusBg: 'rgba(255, 255, 255, 0.08)',
            focusText: '#F5F5F5',
            focusBorder: 'rgba(255, 255, 255, 0.6)',
            radius: '12px',
            placeholder: 'rgba(255, 255, 255, 0.5)'
          },
          search: {
            bg: 'rgba(255, 255, 255, 0.05)',
            text: '#F5F5F5',
            border: 'rgba(255, 255, 255, 0.1)',
            focusBg: 'rgba(255, 255, 255, 0.08)',
            focusBorder: 'rgba(255, 255, 255, 0.6)',
            radius: '12px'
          },
          navigation: {
            bg: 'rgba(255, 255, 255, 0.05)',
            text: '#F5F5F5',
            linkHover: '#D71920',
            border: 'rgba(255, 255, 255, 0.1)',
            radius: '16px'
          },
          cards: {
            bg: 'rgba(255, 255, 255, 0.05)',
            text: '#F5F5F5',
            border: 'rgba(255, 255, 255, 0.1)',
            radius: '16px',
            hoverBg: 'rgba(255, 255, 255, 0.08)'
          }
        }
      });
    }
    
    const style = rows[0];
    
    // Преобразуем плоскую структуру БД в вложенную структуру для фронтенда
    const formattedData = {
      colors: {
        background: style.color_background,
        text: style.color_text,
        accent: style.color_accent,
        brand: style.color_brand,
        glassBorder: style.color_glass_border
      },
      radius: {
        xl: style.radius_xl,
        lg: style.radius_lg
      },
      blur: {
        glass: style.blur_glass
      },
      fonts: {
        headings: style.font_headings,
        body: style.font_body,
        headingsFallback: style.font_headings_fallback,
        bodyFallback: style.font_body_fallback,
        headingsColor: style.font_headings_color || '#F5F5F5',
        bodyColor: style.font_body_color || '#F5F5F5',
        headingsUrl: style.font_headings_url || null,
        bodyUrl: style.font_body_url || null
      },
      buttons: {
        primary: {
          bg: style.button_primary_bg,
          text: style.button_primary_text,
          border: style.button_primary_border,
          hoverBg: style.button_primary_hover_bg,
          hoverText: style.button_primary_hover_text,
          hoverBorder: style.button_primary_hover_border,
          radius: style.button_primary_radius
        },
        secondary: {
          bg: style.button_secondary_bg,
          text: style.button_secondary_text,
          border: style.button_secondary_border,
          hoverBg: style.button_secondary_hover_bg,
          hoverText: style.button_secondary_hover_text,
          hoverBorder: style.button_secondary_hover_border,
          radius: style.button_secondary_radius
        }
      },
      inputs: {
        bg: style.input_bg,
        text: style.input_text,
        border: style.input_border,
        focusBg: style.input_focus_bg,
        focusText: style.input_focus_text,
        focusBorder: style.input_focus_border,
        radius: style.input_radius,
        placeholder: style.input_placeholder
      },
      search: {
        bg: style.search_bg,
        text: style.search_text,
        border: style.search_border,
        focusBg: style.search_focus_bg,
        focusBorder: style.search_focus_border,
        radius: style.search_radius
      },
      navigation: {
        bg: style.nav_bg,
        text: style.nav_text,
        linkHover: style.nav_link_hover,
        border: style.nav_border,
        radius: style.nav_radius
      },
      cards: {
        bg: style.card_bg,
        text: style.card_text,
        border: style.card_border,
        radius: style.card_radius,
        hoverBg: style.card_hover_bg
      }
    };
    
    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching site styles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch site styles',
      message: error.message
    });
  }
});

// PUT update site styles
router.put('/', async (req, res) => {
  try {
    const {
      colors,
      radius,
      blur,
      fonts,
      buttons,
      inputs,
      search,
      navigation,
      cards
    } = req.body;
    
    // Деактивируем все предыдущие стили
    await pool.execute(`
      UPDATE site_styles SET is_active = false WHERE is_active = true
    `);
    
    // Получаем максимальную версию
    const [versionRows] = await pool.execute(`
      SELECT COALESCE(MAX(version), 0) as max_version FROM site_styles
    `);
    const nextVersion = (versionRows[0]?.max_version || 0) + 1;
    
    // Вставляем новые стили
    await pool.execute(`
      INSERT INTO site_styles (
        color_background, color_text, color_accent, color_brand, color_glass_border,
        radius_xl, radius_lg, blur_glass,
        font_headings, font_body, font_headings_fallback, font_body_fallback, font_headings_color, font_body_color, font_headings_url, font_body_url,
        button_primary_bg, button_primary_text, button_primary_border,
        button_primary_hover_bg, button_primary_hover_text, button_primary_hover_border, button_primary_radius,
        button_secondary_bg, button_secondary_text, button_secondary_border,
        button_secondary_hover_bg, button_secondary_hover_text, button_secondary_hover_border, button_secondary_radius,
        input_bg, input_text, input_border, input_focus_bg, input_focus_text, input_focus_border, input_radius, input_placeholder,
        search_bg, search_text, search_border, search_focus_bg, search_focus_border, search_radius,
        nav_bg, nav_text, nav_link_hover, nav_border, nav_radius,
        card_bg, card_text, card_border, card_radius, card_hover_bg,
        version, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      colors?.background || '#0D0D0D',
      colors?.text || '#F5F5F5',
      colors?.accent || '#D71920',
      colors?.brand || '#ECC30B',
      colors?.glassBorder || 'rgba(255,255,255,0.1)',
      radius?.xl || '16px',
      radius?.lg || '12px',
      blur?.glass || '12px',
      fonts?.headings || 'Bebas Neue',
      fonts?.body || 'Inter',
      fonts?.headingsFallback || 'Arial Black, Arial, sans-serif',
      fonts?.bodyFallback || 'sans-serif',
      fonts?.headingsColor || '#F5F5F5',
      fonts?.bodyColor || '#F5F5F5',
      fonts?.headingsUrl || null,
      fonts?.bodyUrl || null,
      buttons?.primary?.bg || '#FFFFFF',
      buttons?.primary?.text || '#0D0D0D',
      buttons?.primary?.border || '#FFFFFF',
      buttons?.primary?.hoverBg || 'rgba(255, 255, 255, 0.1)',
      buttons?.primary?.hoverText || '#FFFFFF',
      buttons?.primary?.hoverBorder || 'transparent',
      buttons?.primary?.radius || '30px',
      buttons?.secondary?.bg || 'transparent',
      buttons?.secondary?.text || '#FFFFFF',
      buttons?.secondary?.border || '#FFFFFF',
      buttons?.secondary?.hoverBg || 'rgba(255, 255, 255, 0.1)',
      buttons?.secondary?.hoverText || '#FFFFFF',
      buttons?.secondary?.hoverBorder || '#FFFFFF',
      buttons?.secondary?.radius || '30px',
      inputs?.bg || 'rgba(255, 255, 255, 0.05)',
      inputs?.text || '#F5F5F5',
      inputs?.border || 'rgba(255, 255, 255, 0.1)',
      inputs?.focusBg || 'rgba(255, 255, 255, 0.08)',
      inputs?.focusText || '#F5F5F5',
      inputs?.focusBorder || 'rgba(255, 255, 255, 0.6)',
      inputs?.radius || '12px',
      inputs?.placeholder || 'rgba(255, 255, 255, 0.5)',
      search?.bg || 'rgba(255, 255, 255, 0.05)',
      search?.text || '#F5F5F5',
      search?.border || 'rgba(255, 255, 255, 0.1)',
      search?.focusBg || 'rgba(255, 255, 255, 0.08)',
      search?.focusBorder || 'rgba(255, 255, 255, 0.6)',
      search?.radius || '12px',
      navigation?.bg || 'rgba(255, 255, 255, 0.05)',
      navigation?.text || '#F5F5F5',
      navigation?.linkHover || '#D71920',
      navigation?.border || 'rgba(255, 255, 255, 0.1)',
      navigation?.radius || '16px',
      cards?.bg || 'rgba(255, 255, 255, 0.05)',
      cards?.text || '#F5F5F5',
      cards?.border || 'rgba(255, 255, 255, 0.1)',
      cards?.radius || '16px',
      cards?.hoverBg || 'rgba(255, 255, 255, 0.08)',
      nextVersion,
      true
    ]);
    
    res.json({
      success: true,
      message: 'Site styles updated successfully',
      version: nextVersion
    });
  } catch (error) {
    console.error('Error updating site styles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update site styles',
      message: error.message
    });
  }
});

module.exports = router;
