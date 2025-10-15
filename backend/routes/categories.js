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

// GET /api/categories - получить все категории
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        description,
        image_url,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, created_at ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка категорий',
      error: error.message
    });
  }
});

// GET /api/categories/used - получить только используемые категории
router.get('/used', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT DISTINCT
        c.id,
        c.name,
        c.description,
        c.image_url,
        c.sort_order,
        c.is_active,
        c.created_at,
        c.updated_at
      FROM categories c
      INNER JOIN products p ON c.id = p.category_id
      WHERE c.is_active = true AND p.is_active = true
      ORDER BY c.sort_order ASC, c.created_at ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching used categories:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении используемых категорий',
      error: error.message
    });
  }
});

// GET /api/categories/unique - получить уникальные категории из таблицы products
router.get('/unique', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT DISTINCT category_name
      FROM products 
      WHERE category_name IS NOT NULL 
        AND category_name != '' 
        AND is_active = true
      ORDER BY category_name ASC
    `);
    
    res.json({
      success: true,
      data: rows.map(row => ({ name: row.category_name }))
    });
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении уникальных категорий',
      error: error.message
    });
  }
});

// GET /api/categories/:id - получить категорию по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        description,
        image_url,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM categories 
      WHERE id = ? AND is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Категория не найдена'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении категории',
      error: error.message
    });
  }
});

// POST /api/categories - создать новую категорию
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image_url, 
      sort_order 
    } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO categories (name, description, image_url, sort_order)
      VALUES (?, ?, ?, ?)
    `, [name, description, image_url, sort_order]);
    
    const [newCategory] = await pool.execute(`
      SELECT * FROM categories WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newCategory[0],
      message: 'Категория успешно создана'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании категории',
      error: error.message
    });
  }
});

// PUT /api/categories/:id - обновить категорию
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      image_url, 
      sort_order,
      is_active 
    } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE categories 
      SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, image_url, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Категория не найдена'
      });
    }
    
    const [updatedCategory] = await pool.execute(`
      SELECT * FROM categories WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedCategory[0],
      message: 'Категория успешно обновлена'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении категории',
      error: error.message
    });
  }
});

// DELETE /api/categories/:id - удалить категорию (мягкое удаление)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      UPDATE categories 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Категория не найдена'
      });
    }
    
    res.json({
      success: true,
      message: 'Категория успешно удалена'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении категории',
      error: error.message
    });
  }
});

module.exports = router;
