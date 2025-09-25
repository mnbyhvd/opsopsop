const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002', 
    'http://95.163.229.90',
    'http://95.163.229.90:3000',
    'http://95.163.229.90:3002',
    'http://95.163.229.90:3001',
    'https://95.163.229.90',
    'https://95.163.229.90:3000',
    'https://95.163.229.90:3002',
    'https://95.163.229.90:3001',
    'https://sps-master.ru',
    'https://www.sps-master.ru'
  ],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control', 'Pragma']
}));

// Обработка preflight OPTIONS запросов
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.sendStatus(200);
});
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
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

// Test database connection
pool.execute('SELECT NOW()')
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'APS Master API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// API routes will be added here
app.use('/api/navigation', require('./routes/navigation'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/footer-settings', require('./routes/footerSettings'));
app.use('/api/requisites', require('./routes/requisites'));
app.use('/api/scroll-section', require('./routes/scrollSection'));
app.use('/api/about', require('./routes/about'));
app.use('/api/advantages', require('./routes/advantages'));
app.use('/api/technical-specs', require('./routes/technicalSpecs'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/products', require('./routes/products'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/export', require('./routes/export'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/product-modals', require('./routes/product_modals'));

// Добавляем недостающие routes для админки
app.get('/api/leads/stats/overview', async (req, res) => {
  try {
    const [totalLeads] = await pool.execute('SELECT COUNT(*) as total FROM leads');
    const [newLeads] = await pool.execute('SELECT COUNT(*) as new FROM leads WHERE status = ?', ['new']);
    const [inProgressLeads] = await pool.execute('SELECT COUNT(*) as in_progress FROM leads WHERE status = ?', ['in_progress']);
    const [completedLeads] = await pool.execute('SELECT COUNT(*) as completed FROM leads WHERE status = ?', ['completed']);
    
    res.json({
      success: true,
      data: {
        total: totalLeads[0].total,
        new: newLeads[0].new,
        in_progress: inProgressLeads[0].in_progress,
        completed: completedLeads[0].completed
      }
    });
  } catch (error) {
    console.error('Error fetching leads stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leads stats' });
  }
});

// Добавляем route для настроек видео
app.get('/api/videos/settings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM videos WHERE is_active = true ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching video settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch video settings' });
  }
});

// Статические файлы для загрузок с CORS заголовками
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
}, express.static('uploads'));

// Статические файлы для изображений с правильными заголовками
app.use('/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Устанавливаем правильный Content-Type для изображений
  const ext = req.path.split('.').pop().toLowerCase();
  const contentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  
  if (contentTypes[ext]) {
    res.header('Content-Type', contentTypes[ext]);
  }
  
  next();
}, express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export pool for use in other modules
module.exports = { pool };
