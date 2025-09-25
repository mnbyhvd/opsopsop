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

// GET hero section data
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM hero_section 
      WHERE is_active = true 
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hero section data'
    });
  }
});

// PUT update active hero section (admin only)
router.put('/', async (req, res) => {
  try {
    const { title, subtitle, description, background_image, is_active } = req.body;
    
    // Проверяем, что все обязательные поля переданы
    if (!title || !subtitle) {
      return res.status(400).json({
        success: false,
        error: 'Title and subtitle are required'
      });
    }
    
    // Update the active hero section
    const [result] = await pool.execute(`
      UPDATE hero_section 
      SET title = ?, subtitle = ?, description = ?, background_image = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE is_active = true
    `, [title, subtitle, description || null, background_image || null, is_active !== undefined ? is_active : true]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'No active hero section found'
      });
    }
    
    const [updatedItem] = await pool.execute(`
      SELECT * FROM hero_section WHERE is_active = true
    `);
    
    res.json({
      success: true,
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hero section'
    });
  }
});

// POST create/update hero section (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, description, background_image, is_active } = req.body;
    
    // First, deactivate all existing hero sections
    await pool.execute(`
      UPDATE hero_section 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
    `);
    
    // Create new active hero section
    const [result] = await pool.execute(`
      INSERT INTO hero_section (title, subtitle, description, background_image, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [title, subtitle, description, background_image, is_active || true]);
    
    const [newItem] = await pool.execute(`
      SELECT * FROM hero_section WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newItem[0]
    });
  } catch (error) {
    console.error('Error creating hero section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create hero section'
    });
  }
});

// PUT update hero section (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, background_image, is_active } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE hero_section 
      SET title = ?, subtitle = ?, description = ?, background_image = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, subtitle, description, background_image, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hero section not found'
      });
    }
    
    const [updatedItem] = await pool.execute(`
      SELECT * FROM hero_section WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hero section'
    });
  }
});

// DELETE hero section (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      DELETE FROM hero_section 
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hero section not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete hero section'
    });
  }
});

module.exports = router;
