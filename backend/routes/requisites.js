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

    const [result] = await pool.execute(`
      UPDATE requisites
      SET
        company_name = ?,
        legal_name = ?,
        inn = ?,
        kpp = ?,
        ogrn = ?,
        legal_address = ?,
        actual_address = ?,
        phone = ?,
        email = ?,
        website = ?,
        bank_name = ?,
        bank_account = ?,
        correspondent_account = ?,
        bik = ?,
        director_name = ?,
        director_position = ?,
        updated_at = NOW()
      WHERE id = 1
    `, [
      company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
      phone, email, website, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position
    ]);

    if (result.affectedRows > 0) {
      // Получаем обновленные реквизиты
      const [rows] = await pool.execute('SELECT * FROM requisites WHERE id = 1');
      res.json({ success: true, data: rows[0] });
    } else {
      // Если реквизитов нет, создаем их
      const [insertResult] = await pool.execute(`
        INSERT INTO requisites (
          company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
          phone, email, website, bank_name, bank_account, correspondent_account,
          bik, director_name, director_position, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
        phone, email, website, bank_name, bank_account, correspondent_account,
        bik, director_name, director_position
      ]);
      
      // Получаем созданные реквизиты
      const [rows] = await pool.execute('SELECT * FROM requisites WHERE id = ?', [insertResult.insertId]);
      res.json({ success: true, data: rows[0] });
    }
  } catch (error) {
    console.error('Error updating requisites:', error);
    res.status(500).json({ success: false, error: 'Failed to update requisites' });
  }
});

// PUT обновить реквизиты по ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
      phone, email, website, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position
    } = req.body;

    const [result] = await pool.execute(`
      UPDATE requisites
      SET
        company_name = ?,
        legal_name = ?,
        inn = ?,
        kpp = ?,
        ogrn = ?,
        legal_address = ?,
        actual_address = ?,
        phone = ?,
        email = ?,
        website = ?,
        bank_name = ?,
        bank_account = ?,
        correspondent_account = ?,
        bik = ?,
        director_name = ?,
        director_position = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
      phone, email, website, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position, id
    ]);

    if (result.affectedRows > 0) {
      // Получаем обновленные реквизиты
      const [rows] = await pool.execute('SELECT * FROM requisites WHERE id = ?', [id]);
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'Реквизиты не найдены' });
    }
  } catch (error) {
    console.error('Error updating requisites:', error);
    res.status(500).json({ success: false, error: 'Failed to update requisites' });
  }
});

module.exports = router;
