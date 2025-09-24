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

// GET footer data
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM footer_data 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching footer data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch footer data'
    });
  }
});

// GET footer section by type
router.get('/section/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query(`
      SELECT * FROM footer_data 
      WHERE section_type = $1 AND is_active = true 
      ORDER BY sort_order ASC
    `, [type]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching footer section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch footer section'
    });
  }
});

// POST create new footer item (admin only)
router.post('/', async (req, res) => {
  try {
    const { 
      section_type, 
      title, 
      content, 
      url, 
      icon, 
      sort_order, 
      is_active 
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO footer_data (
        section_type, title, content, url, icon, sort_order, is_active, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [section_type, title, content, url, icon, sort_order, is_active || true]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating footer item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create footer item'
    });
  }
});

// PUT update footer item (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      section_type, 
      title, 
      content, 
      url, 
      icon, 
      sort_order, 
      is_active 
    } = req.body;
    
    const result = await pool.query(`
      UPDATE footer_data 
      SET section_type = $1, title = $2, content = $3, url = $4, icon = $5, 
          sort_order = $6, is_active = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [section_type, title, content, url, icon, sort_order, is_active, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Footer item not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating footer item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update footer item'
    });
  }
});

// DELETE footer item (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      DELETE FROM footer_data 
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Footer item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Footer item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting footer item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete footer item'
    });
  }
});

module.exports = router;
