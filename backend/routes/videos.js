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
    const result = await pool.query(
      'SELECT * FROM videos WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
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
    
    const result = await pool.query(`
      INSERT INTO videos (title, description, video_url, youtube_url, thumbnail_url, duration, sort_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `, [title, description, video_url, youtube_url, thumbnail_url, duration, sort_order, is_active]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
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
    
    const result = await pool.query(`
      UPDATE videos 
      SET title = $1, description = $2, video_url = $3, youtube_url = $4, thumbnail_url = $5, 
          duration = $6, sort_order = $7, is_active = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [title, description, video_url, youtube_url, thumbnail_url, duration, sort_order, is_active, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
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
    const result = await pool.query(
      'DELETE FROM videos WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
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
    const result = await pool.query(`
      SELECT * FROM video_presentations_settings 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
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
    const existingResult = await pool.query(`
      SELECT id FROM video_presentations_settings 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    let result;
    if (existingResult.rows.length > 0) {
      // Обновляем существующие настройки
      result = await pool.query(`
        UPDATE video_presentations_settings 
        SET title = $1, subtitle = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [title, subtitle, existingResult.rows[0].id]);
    } else {
      // Создаем новые настройки
      result = await pool.query(`
        INSERT INTO video_presentations_settings (title, subtitle, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING *
      `, [title, subtitle]);
    }
    
    res.json({
      success: true,
      data: result.rows[0]
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
