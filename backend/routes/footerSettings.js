const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Создаем отдельное подключение для этого роута
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'master_sps_db',
  user: process.env.DB_USER || 'master_sps_user',
  password: process.env.DB_PASSWORD || 'MasterSPS2024!',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET footer settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM footer_settings 
      ORDER BY id ASC 
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      // Return default settings if none exist
      const defaultSettings = {
        id: 1,
        company_name: 'МАСТЕР',
        company_subtitle: 'Элемент',
        contact_phone: '+7 (999) 999-99-99',
        contact_email: 'email@gmail.ru',
        contact_address: 'г. Москва, ул. Остоженка, д.1/9',
        working_hours: 'Пн-Пт 10:00-18:00',
        form_title: 'СВЯЖИТЕСЬ С НАМИ',
        form_description: 'Оставьте заявку и получите спецификацию и коммерческое предложение, подобранные именно под ваши задачи.',
        privacy_policy_url: '#privacy',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return res.json({
        success: true,
        data: defaultSettings
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch footer settings'
    });
  }
});

// PUT update footer settings
router.put('/', async (req, res) => {
  try {
    const { 
      company_name,
      company_subtitle,
      contact_phone,
      contact_email,
      contact_address,
      working_hours,
      form_title,
      form_description,
      privacy_policy_url
    } = req.body;
    
    // Check if settings exist
    const [existingSettings] = await pool.execute(`
      SELECT id FROM footer_settings ORDER BY id ASC LIMIT 1
    `);
    
    let result;
    if (existingSettings.length === 0) {
      // Create new settings
      const [insertResult] = await pool.execute(`
        INSERT INTO footer_settings (
          company_name, company_subtitle, contact_phone, contact_email, 
          contact_address, working_hours, form_title, form_description, 
          privacy_policy_url, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        company_name, company_subtitle, contact_phone, contact_email,
        contact_address, working_hours, form_title, form_description,
        privacy_policy_url
      ]);
      
      // Get the inserted record
      const [newRecord] = await pool.execute(`
        SELECT * FROM footer_settings WHERE id = ?
      `, [insertResult.insertId]);
      
      result = newRecord[0];
    } else {
      // Update existing settings
      await pool.execute(`
        UPDATE footer_settings 
        SET company_name = ?, company_subtitle = ?, contact_phone = ?, 
            contact_email = ?, contact_address = ?, working_hours = ?,
            form_title = ?, form_description = ?, privacy_policy_url = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        company_name, company_subtitle, contact_phone, contact_email,
        contact_address, working_hours, form_title, form_description,
        privacy_policy_url, existingSettings[0].id
      ]);
      
      // Get the updated record
      const [updatedRecord] = await pool.execute(`
        SELECT * FROM footer_settings WHERE id = ?
      `, [existingSettings[0].id]);
      
      result = updatedRecord[0];
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating footer settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update footer settings'
    });
  }
});

module.exports = router;