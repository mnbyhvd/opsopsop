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

// GET technical specs data
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM advantages 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching technical specs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch technical specs data'
    });
  }
});

// GET technical spec by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT * FROM advantages 
      WHERE id = ? AND is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Technical spec not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching technical spec:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch technical spec'
    });
  }
});

// POST create new technical spec (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, value, sort_order, is_active } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO advantages (title, description, value, sort_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [title, description, value, sort_order || 0, is_active || true]);
    
    // Получаем созданный элемент
    const [rows] = await pool.execute('SELECT * FROM advantages WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error creating technical spec:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create technical spec'
    });
  }
});

// PUT update technical spec (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, value, sort_order, is_active } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE advantages 
      SET title = ?, description = ?, value = ?, sort_order = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [title, description, value, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Technical spec not found'
      });
    }
    
    // Получаем обновленный элемент
    const [rows] = await pool.execute('SELECT * FROM advantages WHERE id = ?', [id]);
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error updating technical spec:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update technical spec'
    });
  }
});

// DELETE technical spec (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      DELETE FROM advantages 
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Technical spec not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Technical spec deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting technical spec:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete technical spec'
    });
  }
});

module.exports = router;
