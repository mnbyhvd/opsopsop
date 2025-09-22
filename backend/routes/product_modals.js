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

// GET /api/product-modals/:areaId - получить модальные окна для области
router.get('/:areaId', async (req, res) => {
  try {
    const { areaId } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        id,
        area_id,
        title,
        description,
        button_text,
        button_url,
        position_x,
        position_y,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM product_modals 
      WHERE area_id = ? AND is_active = true
      ORDER BY sort_order ASC
    `, [areaId]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching product modals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product modals'
    });
  }
});

// GET /api/product-modals - получить все модальные окна
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        area_id,
        title,
        description,
        button_text,
        button_url,
        position_x,
        position_y,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM product_modals 
      WHERE is_active = true
      ORDER BY area_id, sort_order ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching product modals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product modals'
    });
  }
});

// POST /api/product-modals - создать новое модальное окно
router.post('/', async (req, res) => {
  try {
    const { 
      area_id, 
      title, 
      description, 
      button_text, 
      button_url, 
      position_x, 
      position_y, 
      sort_order 
    } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO product_modals (area_id, title, description, button_text, button_url, position_x, position_y, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [area_id, title, description, button_text, button_url, position_x, position_y, sort_order || 0]);
    
    const [newModal] = await pool.execute(`
      SELECT * FROM product_modals WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newModal[0]
    });
  } catch (error) {
    console.error('Error creating product modal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product modal'
    });
  }
});

// PUT /api/product-modals/:id - обновить модальное окно
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      area_id, 
      title, 
      description, 
      button_text, 
      button_url, 
      position_x, 
      position_y, 
      sort_order,
      is_active 
    } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE product_modals 
      SET 
        area_id = COALESCE(?, area_id),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        button_text = COALESCE(?, button_text),
        button_url = COALESCE(?, button_url),
        position_x = COALESCE(?, position_x),
        position_y = COALESCE(?, position_y),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [area_id, title, description, button_text, button_url, position_x, position_y, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product modal not found'
      });
    }
    
    const [updatedModal] = await pool.execute(`
      SELECT * FROM product_modals WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedModal[0]
    });
  } catch (error) {
    console.error('Error updating product modal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product modal'
    });
  }
});

// DELETE /api/product-modals/:id - удалить модальное окно
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      DELETE FROM product_modals 
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product modal not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product modal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product modal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product modal'
    });
  }
});

module.exports = router;
