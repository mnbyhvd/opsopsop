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

// GET /api/videos - получить все видео
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM videos 
      ORDER BY sort_order ASC, created_at ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch videos'
    });
  }
});

// GET /api/videos/:id - получить видео по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM videos WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video'
    });
  }
});

// POST /api/videos - создать новое видео
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      video_url,
      youtube_url,
      thumbnail_url,
      duration,
      sort_order,
      is_active = true
    } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO videos (title, description, video_url, youtube_url, thumbnail_url, duration, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [title, description, video_url, youtube_url, thumbnail_url, duration, sort_order, is_active]);
    
    // Получаем созданное видео
    const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create video'
    });
  }
});

// PUT /api/videos/:id - обновить видео
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      video_url,
      youtube_url,
      thumbnail_url,
      duration,
      sort_order,
      is_active
    } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE videos 
      SET title = ?, description = ?, video_url = ?, youtube_url = ?, thumbnail_url = ?, 
          duration = ?, sort_order = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [title, description, video_url, youtube_url, thumbnail_url, duration, sort_order, is_active, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    // Получаем обновленное видео
    const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [id]);
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update video'
    });
  }
});

// DELETE /api/videos/:id - удалить видео
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM videos WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete video'
    });
  }
});

// GET /api/videos/settings - получить настройки секции
router.get('/settings', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM video_presentations_settings 
      ORDER BY id DESC 
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
    console.error('Error fetching video settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video settings'
    });
  }
});

// PUT /api/videos/settings - обновить настройки секции
router.put('/settings', async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    
    // Сначала проверяем, есть ли уже настройки
    const [existingRows] = await pool.execute(`
      SELECT id FROM video_presentations_settings 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    let result;
    if (existingRows.length > 0) {
      // Обновляем существующие настройки
      const [updateResult] = await pool.execute(`
        UPDATE video_presentations_settings 
        SET title = ?, subtitle = ?, updated_at = NOW()
        WHERE id = ?
      `, [title, subtitle, existingRows[0].id]);
      
      // Получаем обновленные настройки
      const [rows] = await pool.execute('SELECT * FROM video_presentations_settings WHERE id = ?', [existingRows[0].id]);
      result = { data: rows[0] };
    } else {
      // Создаем новые настройки
      const [insertResult] = await pool.execute(`
        INSERT INTO video_presentations_settings (title, subtitle, created_at, updated_at)
        VALUES (?, ?, NOW(), NOW())
      `, [title, subtitle]);
      
      // Получаем созданные настройки
      const [rows] = await pool.execute('SELECT * FROM video_presentations_settings WHERE id = ?', [insertResult.insertId]);
      result = { data: rows[0] };
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error updating video settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update video settings'
    });
  }
});

module.exports = router;
