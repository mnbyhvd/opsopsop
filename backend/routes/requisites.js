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

// GET реквизиты
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM requisites LIMIT 1');
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      // Возвращаем пустые реквизиты если их нет
      res.json({
        success: true,
        data: {
          id: 1,
          company_name: '',
          legal_name: '',
          inn: '',
          kpp: '',
          ogrn: '',
          legal_address: '',
          actual_address: '',
          phone: '',
          email: '',
          website: '',
          bank_name: '',
          bank_account: '',
          correspondent_account: '',
          bik: '',
          director_name: '',
          director_position: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error fetching requisites:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch requisites' });
  }
});

// PUT обновить реквизиты
router.put('/', async (req, res) => {
  try {
    const {
      company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
      phone, email, website, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position
    } = req.body;

    const result = await pool.query(`
      UPDATE requisites
      SET
        company_name = $1,
        legal_name = $2,
        inn = $3,
        kpp = $4,
        ogrn = $5,
        legal_address = $6,
        actual_address = $7,
        phone = $8,
        email = $9,
        website = $10,
        bank_name = $11,
        bank_account = $12,
        correspondent_account = $13,
        bik = $14,
        director_name = $15,
        director_position = $16,
        updated_at = NOW()
      WHERE id = 1
      RETURNING *;
    `, [
      company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
      phone, email, website, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position
    ]);

    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      // Если реквизитов нет, создаем их
      const insertResult = await pool.query(`
        INSERT INTO requisites (
          company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
          phone, email, website, bank_name, bank_account, correspondent_account,
          bik, director_name, director_position, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        RETURNING *;
      `, [
        company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
        phone, email, website, bank_name, bank_account, correspondent_account,
        bik, director_name, director_position
      ]);
      res.json({ success: true, data: insertResult.rows[0] });
    }
  } catch (error) {
    console.error('Error updating requisites:', error);
    res.status(500).json({ success: false, error: 'Failed to update requisites' });
  }
});

module.exports = router;
