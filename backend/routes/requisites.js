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
      phone, email, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position
    } = req.body;

    // Преобразуем undefined в null для MySQL
    const safeCompanyName = company_name !== undefined ? company_name : null;
    const safeLegalName = legal_name !== undefined ? legal_name : null;
    const safeInn = inn !== undefined ? inn : null;
    const safeKpp = kpp !== undefined ? kpp : null;
    const safeOgrn = ogrn !== undefined ? ogrn : null;
    const safeLegalAddress = legal_address !== undefined ? legal_address : null;
    const safeActualAddress = actual_address !== undefined ? actual_address : null;
    const safePhone = phone !== undefined ? phone : null;
    const safeEmail = email !== undefined ? email : null;
    const safeBankName = bank_name !== undefined ? bank_name : null;
    const safeBankAccount = bank_account !== undefined ? bank_account : null;
    const safeCorrespondentAccount = correspondent_account !== undefined ? correspondent_account : null;
    const safeBik = bik !== undefined ? bik : null;
    const safeDirectorName = director_name !== undefined ? director_name : null;
    const safeDirectorPosition = director_position !== undefined ? director_position : null;

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
        bank_name = ?,
        bank_account = ?,
        correspondent_account = ?,
        bik = ?,
        director_name = ?,
        director_position = ?,
        updated_at = NOW()
      WHERE id = 1
    `, [
      safeCompanyName, safeLegalName, safeInn, safeKpp, safeOgrn, safeLegalAddress, safeActualAddress,
      safePhone, safeEmail, safeBankName, safeBankAccount, safeCorrespondentAccount,
      safeBik, safeDirectorName, safeDirectorPosition
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
          phone, email, bank_name, bank_account, correspondent_account,
          bik, director_name, director_position, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        safeCompanyName, safeLegalName, safeInn, safeKpp, safeOgrn, safeLegalAddress, safeActualAddress,
        safePhone, safeEmail, safeBankName, safeBankAccount, safeCorrespondentAccount,
        safeBik, safeDirectorName, safeDirectorPosition
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
    const requisitesId = parseInt(id, 10);
    
    if (isNaN(requisitesId)) {
      return res.status(400).json({ success: false, error: 'Invalid requisites ID' });
    }

    console.log('PUT /api/requisites/:id - запрос получен:', { id: requisitesId, body: req.body });

    const {
      company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
      phone, email, bank_name, bank_account, correspondent_account,
      bik, director_name, director_position
    } = req.body;

    // Преобразуем undefined в null для MySQL
    const safeCompanyName = company_name !== undefined ? company_name : null;
    const safeLegalName = legal_name !== undefined ? legal_name : null;
    const safeInn = inn !== undefined ? inn : null;
    const safeKpp = kpp !== undefined ? kpp : null;
    const safeOgrn = ogrn !== undefined ? ogrn : null;
    const safeLegalAddress = legal_address !== undefined ? legal_address : null;
    const safeActualAddress = actual_address !== undefined ? actual_address : null;
    const safePhone = phone !== undefined ? phone : null;
    const safeEmail = email !== undefined ? email : null;
    const safeBankName = bank_name !== undefined ? bank_name : null;
    const safeBankAccount = bank_account !== undefined ? bank_account : null;
    const safeCorrespondentAccount = correspondent_account !== undefined ? correspondent_account : null;
    const safeBik = bik !== undefined ? bik : null;
    const safeDirectorName = director_name !== undefined ? director_name : null;
    const safeDirectorPosition = director_position !== undefined ? director_position : null;

    // Используем INSERT ... ON DUPLICATE KEY UPDATE для безопасного обновления/создания
    const [result] = await pool.execute(`
      INSERT INTO requisites (
        id, company_name, legal_name, inn, kpp, ogrn, legal_address, actual_address,
        phone, email, bank_name, bank_account, correspondent_account,
        bik, director_name, director_position, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        company_name = VALUES(company_name),
        legal_name = VALUES(legal_name),
        inn = VALUES(inn),
        kpp = VALUES(kpp),
        ogrn = VALUES(ogrn),
        legal_address = VALUES(legal_address),
        actual_address = VALUES(actual_address),
        phone = VALUES(phone),
        email = VALUES(email),
        bank_name = VALUES(bank_name),
        bank_account = VALUES(bank_account),
        correspondent_account = VALUES(correspondent_account),
        bik = VALUES(bik),
        director_name = VALUES(director_name),
        director_position = VALUES(director_position),
        updated_at = NOW()
    `, [
      requisitesId, safeCompanyName, safeLegalName, safeInn, safeKpp, safeOgrn, safeLegalAddress, safeActualAddress,
      safePhone, safeEmail, safeBankName, safeBankAccount, safeCorrespondentAccount,
      safeBik, safeDirectorName, safeDirectorPosition
    ]);

    // Получаем обновленные/созданные реквизиты
    const [rows] = await pool.execute('SELECT * FROM requisites WHERE id = ?', [requisitesId]);
    
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'Реквизиты не найдены' });
    }
  } catch (error) {
    console.error('Error updating requisites:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update requisites',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
