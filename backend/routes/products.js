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

// GET /api/products - получить все продукты
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        description,
        image_url,
        category,
        specifications,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM products 
      WHERE is_active = true 
      ORDER BY sort_order ASC, created_at ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка продуктов',
      error: error.message
    });
  }
});

// GET /api/products/:id - получить продукт по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        description,
        image_url,
        category,
        specifications,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM products 
      WHERE id = ? AND is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Продукт не найден'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении продукта',
      error: error.message
    });
  }
});

// POST /api/products - создать новый продукт
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image_url, 
      category, 
      specifications, 
      sort_order 
    } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO products (name, description, image_url, category, specifications, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, image_url, category, specifications, sort_order]);
    
    const [newProduct] = await pool.execute(`
      SELECT * FROM products WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newProduct[0],
      message: 'Продукт успешно создан'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании продукта',
      error: error.message
    });
  }
});

// PUT /api/products/:id - обновить продукт
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      image_url, 
      category, 
      specifications, 
      sort_order,
      is_active 
    } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE products 
      SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        category = COALESCE(?, category),
        specifications = COALESCE(?, specifications),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, image_url, category, specifications, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Продукт не найден'
      });
    }
    
    const [updatedProduct] = await pool.execute(`
      SELECT * FROM products WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedProduct[0],
      message: 'Продукт успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении продукта',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - удалить продукт (мягкое удаление)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Продукт не найден'
      });
    }
    
    res.json({
      success: true,
      message: 'Продукт успешно удален'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении продукта',
      error: error.message
    });
  }
});

module.exports = router;
