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

// GET /api/leads - получить все заявки
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        email,
        phone,
        company,
        message,
        status,
        created_at,
        updated_at
      FROM leads 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

// GET /api/leads/:id - получить заявку по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        email,
        phone,
        company,
        message,
        status,
        created_at,
        updated_at
      FROM leads 
      WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead'
    });
  }
});

// POST /api/leads - создать новую заявку
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;
    
    // Валидация обязательных полей
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and phone are required'
      });
    }
    
    const [result] = await pool.execute(`
      INSERT INTO leads (name, email, phone, company, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `, [name, email, phone, company || null, message || null]);
    
    const [newLead] = await pool.execute(`
      SELECT * FROM leads WHERE id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newLead[0]
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create lead'
    });
  }
});

// PUT /api/leads/:id - обновить заявку
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, message, status } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE leads 
      SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        company = COALESCE(?, company),
        message = COALESCE(?, message),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, email, phone, company, message, status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    const [updatedLead] = await pool.execute(`
      SELECT * FROM leads WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      data: updatedLead[0]
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update lead'
    });
  }
});

// DELETE /api/leads/:id - удалить заявку
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(`
      DELETE FROM leads 
      WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete lead'
    });
  }
});

module.exports = router;
