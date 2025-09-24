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

// GET /api/documents - получить все документы
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM documents 
      ORDER BY sort_order ASC, created_at ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
});

// GET /api/documents/:id - получить документ по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM documents WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document'
    });
  }
});

// POST /api/documents - создать новый документ
router.post('/', async (req, res) => {
  try {
    const {
      title,
      url,
      type,
      sort_order,
      is_active = true
    } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO documents (title, url, type, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [title, url, type, sort_order, is_active]);
    
    // Получаем созданный документ
    const [rows] = await pool.execute(
      'SELECT * FROM documents WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create document'
    });
  }
});

// PUT /api/documents/:id - обновить документ
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      url,
      type,
      sort_order,
      is_active
    } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE documents 
      SET title = ?, url = ?, type = ?, sort_order = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [title, url, type, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    // Получаем обновленный документ
    const [rows] = await pool.execute(
      'SELECT * FROM documents WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update document'
    });
  }
});

// DELETE /api/documents/:id - удалить документ
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM documents WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document'
    });
  }
});

module.exports = router;
