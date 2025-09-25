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

// GET /api/scroll-section - получить данные scroll section
router.get('/', async (req, res) => {
  try {
    // Получаем основную информацию о секции
    const [sectionRows] = await pool.execute(`
      SELECT 
        id,
        section_title,
        section_subtitle,
        video_url,
        created_at,
        updated_at
      FROM scroll_section 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    if (sectionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scroll section not found'
      });
    }
    
    const section = sectionRows[0];
    
    // Получаем текстовые блоки для этой секции
    const [textBlocksRows] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        sort_order,
        created_at,
        updated_at
      FROM scroll_section_text_blocks 
      WHERE scroll_section_id = ? 
      ORDER BY sort_order ASC
    `, [section.id]);
    
    const textBlocks = textBlocksRows.map(block => ({
      id: block.id,
      title: block.title,
      description: block.description,
      order: block.sort_order,
      created_at: block.created_at,
      updated_at: block.updated_at
    }));
    
    res.json({
      success: true,
      data: {
        id: section.id,
        section_title: section.section_title,
        section_subtitle: section.section_subtitle,
        video_url: section.video_url,
        text_blocks: textBlocks,
        created_at: section.created_at,
        updated_at: section.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching scroll section:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных scroll section',
      error: error.message
    });
  }
});

// PUT /api/scroll-section - обновить данные scroll section
router.put('/', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      section_title, 
      section_subtitle, 
      video_url, 
      text_blocks 
    } = req.body;
    
    // Проверяем, есть ли записи в таблице
    const [existingRows] = await connection.execute(`
      SELECT id FROM scroll_section ORDER BY id DESC LIMIT 1
    `);
    
    let sectionId;
    if (existingRows.length === 0) {
      // Создаем новую запись
      const [insertResult] = await connection.execute(`
        INSERT INTO scroll_section (section_title, section_subtitle, video_url, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [section_title, section_subtitle, video_url]);
      sectionId = insertResult.insertId;
    } else {
      // Обновляем существующую запись
      const [sectionResult] = await connection.execute(`
        UPDATE scroll_section 
        SET 
          section_title = ?,
          section_subtitle = ?,
          video_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [section_title, section_subtitle, video_url, existingRows[0].id]);
      
      if (sectionResult.affectedRows === 0) {
        throw new Error('Failed to update scroll section');
      }
      sectionId = existingRows[0].id;
    }
    
    // sectionId уже получен выше
    
    // Удаляем старые текстовые блоки
    await connection.execute(`
      DELETE FROM scroll_section_text_blocks 
      WHERE scroll_section_id = ?
    `, [sectionId]);
    
    // Добавляем новые текстовые блоки
    if (text_blocks && text_blocks.length > 0) {
      for (const block of text_blocks) {
        await connection.execute(`
          INSERT INTO scroll_section_text_blocks 
          (scroll_section_id, title, description, sort_order)
          VALUES (?, ?, ?, ?)
        `, [sectionId, block.title, block.description, block.order]);
      }
    }
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Scroll section успешно обновлен'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating scroll section:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении scroll section',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
