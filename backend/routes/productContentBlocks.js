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
      FROM product_content_blocks
      ${includeAll ? '' : 'WHERE is_active = true'}
      ORDER BY sort_order ASC, created_at ASC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching product content blocks:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product content blocks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, image_url, placement, product_id, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      INSERT INTO product_content_blocks (title, description, image_url, placement, product_id, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      title || '',
      description || '',
      image_url || null,
      placement || 'after_products',
      product_id || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true
    ]);

    const [rows] = await pool.execute('SELECT * FROM product_content_blocks WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating product content block:', error);
    res.status(500).json({ success: false, error: 'Failed to create product content block' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, image_url, placement, product_id, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      UPDATE product_content_blocks
      SET title = ?, description = ?, image_url = ?, placement = ?, product_id = ?,
          sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || '',
      description || '',
      image_url || null,
      placement || 'after_products',
      product_id || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Product content block not found' });
    }

    const [rows] = await pool.execute('SELECT * FROM product_content_blocks WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating product content block:', error);
    res.status(500).json({ success: false, error: 'Failed to update product content block' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM product_content_blocks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Product content block not found' });
    }

    res.json({ success: true, message: 'Product content block deleted successfully' });
  } catch (error) {
    console.error('Error deleting product content block:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product content block' });
  }
});

module.exports = router;
