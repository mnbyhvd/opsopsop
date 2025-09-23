const express = require('express');
const router = express.Router();
const pool = require('../server'); // Используем pool из server.js

// GET export data
router.get('/', async (req, res) => {
  try {
    // Получаем все данные для экспорта
    const [leads] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
    const [products] = await pool.execute('SELECT * FROM products WHERE is_active = true ORDER BY sort_order ASC');
    const [videos] = await pool.execute('SELECT * FROM videos WHERE is_active = true ORDER BY sort_order ASC');
    const [documents] = await pool.execute('SELECT * FROM documents WHERE is_active = true ORDER BY sort_order ASC');
    
    const exportData = {
      leads,
      products,
      videos,
      documents,
      exported_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export data'
    });
  }
});

// POST export leads to CSV
router.post('/leads/csv', async (req, res) => {
  try {
    const [leads] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
    
    // Простой CSV экспорт
    const csvHeader = 'ID,Name,Email,Phone,Company,Message,Status,Priority,Created At\n';
    const csvRows = leads.map(lead => 
      `${lead.id},"${lead.name}","${lead.email}","${lead.phone}","${lead.company}","${lead.message}","${lead.status}","${lead.priority}","${lead.created_at}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export leads to CSV'
    });
  }
});

module.exports = router;
