const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

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

// GET navigation menu
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM navigation_menu 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch navigation menu'
    });
  }
});

// GET navigation menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT * FROM navigation_menu 
      WHERE id = ? AND is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Navigation item not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch navigation item'
    });
  }
});

// POST create new navigation item (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, url, sort_order, parent_id, is_active } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO navigation_menu (title, url, sort_order, parent_id, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [title, url, sort_order, parent_id, is_active || true]);
    
    const [newItem] = await pool.execute(`
      SELECT * FROM navigation_menu WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newItem[0]
    });
  } catch (error) {
    console.error('Error creating navigation item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create navigation item'
    });
  }
});

// PUT update navigation item (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, sort_order, parent_id, is_active } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE navigation_menu 
      SET title = ?, url = ?, sort_order = ?, parent_id = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, url, sort_order, parent_id, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Navigation item not found'
      });
    }
    
    const [updatedItem] = await pool.execute(`
      SELECT * FROM navigation_menu WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Error updating navigation item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update navigation item'
    });
  }
});

// DELETE navigation item (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      DELETE FROM navigation_menu 
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Navigation item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Navigation item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete navigation item'
    });
  }
});

module.exports = router;
