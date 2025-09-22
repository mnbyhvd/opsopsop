const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'master_sps',
  user: process.env.DB_USER || 'master_user',
  password: process.env.DB_PASSWORD || 'master_password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET footer settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM footer_settings 
      ORDER BY id ASC 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
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
      data: result.rows[0]
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch footer settings'
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  }
waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
    const existingSettings = await pool.query(`
      SELECT id FROM footer_settings ORDER BY id ASC LIMIT 1
    `);
    
    let result;
    if (existingSettings.rows.length === 0) {
      // Create new settings
      result = await pool.query(`
        INSERT INTO footer_settings (
          company_name, company_subtitle, contact_phone, contact_email, 
          contact_address, working_hours, form_title, form_description, 
          privacy_policy_url, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *
      `, [
        company_name, company_subtitle, contact_phone, contact_email,
        contact_address, working_hours, form_title, form_description,
        privacy_policy_url
      ]);
    } else {
      // Update existing settings
      result = await pool.query(`
        UPDATE footer_settings 
        SET company_name = $1, company_subtitle = $2, contact_phone = $3, 
            contact_email = $4, contact_address = $5, working_hours = $6,
            form_title = $7, form_description = $8, privacy_policy_url = $9,
            updated_at = NOW()
        WHERE id = $10
        RETURNING *
      `, [
        company_name, company_subtitle, contact_phone, contact_email,
        contact_address, working_hours, form_title, form_description,
        privacy_policy_url, existingSettings.rows[0].id
      ]);
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  } catch (error) {
    console.error('Error updating footer settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update footer settings'
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  }
waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = router;