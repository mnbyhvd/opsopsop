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

// GET about section data
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM about_section 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching about section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch about section data'
    });
  }
});

// GET about section item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT * FROM about_section 
      WHERE id = ? AND is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'About section item not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching about section item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch about section item'
    });
  }
});

// POST create new about section item (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, image_url, sort_order, is_active } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO about_section (title, description, image_url, sort_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [title, description, image_url, sort_order || 0, is_active || true]);
    
    const [newItem] = await pool.execute(`
      SELECT * FROM about_section WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newItem[0]
    });
  } catch (error) {
    console.error('Error creating about section item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create about section item'
    });
  }
});

// PUT update about section item (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, sort_order, is_active } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE about_section 
      SET title = ?, description = ?, image_url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, image_url, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'About section item not found'
      });
    }
    
    const [updatedItem] = await pool.execute(`
      SELECT * FROM about_section WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Error updating about section item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update about section item'
    });
  }
});

// DELETE about section item (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      DELETE FROM about_section 
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'About section item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'About section item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about section item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete about section item'
    });
  }
});

module.exports = router;
