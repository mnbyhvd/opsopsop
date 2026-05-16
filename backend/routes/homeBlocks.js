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

const normalizeBlock = (block) => ({
  ...block,
  is_active: Boolean(block.is_active)
});

const toBoolean = (value) => (
  value === true ||
  value === 1 ||
  value === '1' ||
  value === 'true'
);

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, block_key, title, description, sort_order, is_active, created_at, updated_at
      FROM home_blocks
      ORDER BY sort_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows.map(normalizeBlock)
    });
  } catch (error) {
    console.error('Error fetching homepage blocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch homepage blocks'
    });
  }
});

router.put('/:blockKey', async (req, res) => {
  try {
    const { blockKey } = req.params;
    const { is_active } = req.body;

    if (typeof is_active === 'undefined') {
      return res.status(400).json({
        success: false,
        error: 'is_active is required'
      });
    }

    const [result] = await pool.execute(`
      UPDATE home_blocks
      SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE block_key = ?
    `, [toBoolean(is_active), blockKey]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Homepage block not found'
      });
    }

    const [rows] = await pool.execute(`
      SELECT id, block_key, title, description, sort_order, is_active, created_at, updated_at
      FROM home_blocks
      WHERE block_key = ?
    `, [blockKey]);

    res.json({
      success: true,
      data: normalizeBlock(rows[0])
    });
  } catch (error) {
    console.error('Error updating homepage block:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update homepage block'
    });
  }
});

module.exports = router;
