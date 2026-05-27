const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

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

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, page_key, path, label, title, description, sort_order, created_at, updated_at
      FROM page_meta
      ORDER BY sort_order ASC, id ASC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching page meta:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch page meta' });
  }
});

router.get('/:pageKey', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, page_key, path, label, title, description, sort_order, created_at, updated_at
      FROM page_meta
      WHERE page_key = ?
      LIMIT 1
    `, [req.params.pageKey]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Page meta not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching page meta item:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch page meta item' });
  }
});

router.put('/:pageKey', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'title and description are required'
      });
    }

    const [result] = await pool.execute(`
      UPDATE page_meta
      SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE page_key = ?
    `, [title, description, req.params.pageKey]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Page meta not found' });
    }

    const [rows] = await pool.execute(`
      SELECT id, page_key, path, label, title, description, sort_order, created_at, updated_at
      FROM page_meta
      WHERE page_key = ?
      LIMIT 1
    `, [req.params.pageKey]);

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating page meta:', error);
    res.status(500).json({ success: false, error: 'Failed to update page meta' });
  }
});

module.exports = router;
