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

// GET /api/advantages - получить все преимущества
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        icon,
        color,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM advantages 
      WHERE is_active = true 
      ORDER BY sort_order ASC, created_at ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching advantages:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка преимуществ',
      error: error.message
    });
  }
});

// GET /api/advantages/:id - получить преимущество по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        icon,
        color,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM advantages 
      WHERE id = ? AND is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Преимущество не найдено'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching advantage:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении преимущества',
      error: error.message
    });
  }
});

// POST /api/advantages - создать новое преимущество
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      icon, 
      color, 
      sort_order 
    } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO advantages (title, description, icon, color, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, [title, description, icon, color, sort_order]);
    
    const [newItem] = await pool.execute(`
      SELECT * FROM advantages WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newItem[0],
      message: 'Преимущество успешно создано'
    });
  } catch (error) {
    console.error('Error creating advantage:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании преимущества',
      error: error.message
    });
  }
});

// PUT /api/advantages/:id - обновить преимущество
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      icon, 
      color, 
      sort_order,
      is_active 
    } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE advantages 
      SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        icon = COALESCE(?, icon),
        color = COALESCE(?, color),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, icon, color, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Преимущество не найдено'
      });
    }
    
    const [updatedItem] = await pool.execute(`
      SELECT * FROM advantages WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedItem[0],
      message: 'Преимущество успешно обновлено'
    });
  } catch (error) {
    console.error('Error updating advantage:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении преимущества',
      error: error.message
    });
  }
});

// DELETE /api/advantages/:id - удалить преимущество (мягкое удаление)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      UPDATE advantages 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Преимущество не найдено'
      });
    }
    
    res.json({
      success: true,
      message: 'Преимущество успешно удалено'
    });
  } catch (error) {
    console.error('Error deleting advantage:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении преимущества',
      error: error.message
    });
  }
});

module.exports = router;
