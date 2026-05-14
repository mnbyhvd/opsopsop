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
    const includeAll = req.query.all === 'true';
    const [rows] = await pool.execute(`
      SELECT *
      FROM service_blocks
      ${includeAll ? '' : 'WHERE is_active = true'}
      ORDER BY sort_order ASC, created_at ASC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM service_blocks WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, image_url, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      INSERT INTO service_blocks (title, description, image_url, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `, [
      title || '',
      description || '',
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true
    ]);

    const [rows] = await pool.execute('SELECT * FROM service_blocks WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, error: 'Failed to create service' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, image_url, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      UPDATE service_blocks
      SET title = ?, description = ?, image_url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || '',
      description || '',
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const [rows] = await pool.execute('SELECT * FROM service_blocks WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, error: 'Failed to update service' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM service_blocks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, error: 'Failed to delete service' });
  }
});

module.exports = router;
