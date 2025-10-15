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

// GET /api/products - получить все продукты с фильтрацией
router.get('/', async (req, res) => {
  try {
    const { category_id, search, limit, offset } = req.query;
    
    let whereClause = 'WHERE p.is_active = true';
    let params = [];
    
    // Фильтр по категории
    if (category_id) {
      whereClause += ' AND p.category_id = ?';
      params.push(category_id);
    }
    
    // Поиск по названию и описанию
    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Пагинация
    const limitClause = limit ? `LIMIT ${parseInt(limit)}` : '';
    const offsetClause = offset ? `OFFSET ${parseInt(offset)}` : '';
    
    const [rows] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.image_url,
        p.category_name,
        p.category_id,
        c.name as category_name_from_table,
        p.specifications,
        p.sort_order,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.sort_order ASC, p.created_at ASC
      ${limitClause}
      ${offsetClause}
    `, params);
    
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

// GET /api/products/:id - получить продукт по ID с изображениями и документами
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем основную информацию о продукте
    const [productRows] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.image_url,
        p.category_name,
        p.category_id,
        c.name as category_name_from_table,
        p.specifications,
        p.sort_order,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.is_active = true
    `, [id]);
    
    if (productRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Продукт не найден'
      });
    }
    
    const product = productRows[0];
    
    // Получаем изображения продукта
    const [imageRows] = await pool.execute(`
      SELECT 
        id,
        image_url,
        alt_text,
        sort_order
      FROM product_images 
      WHERE product_id = ? AND is_active = true
      ORDER BY sort_order ASC
    `, [id]);
    
    // Получаем документы продукта
    const [documentRows] = await pool.execute(`
      SELECT 
        id,
        name,
        description,
        file_url,
        file_type,
        file_size,
        sort_order
      FROM product_documents 
      WHERE product_id = ? AND is_active = true
      ORDER BY sort_order ASC
    `, [id]);
    
    // Добавляем изображения и документы к продукту
    product.images = imageRows;
    product.documents = documentRows;
    
    res.json({
      success: true,
      data: product
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
      category_name, 
      category_id,
      specifications, 
      sort_order,
      is_active
    } = req.body;
    
    // Преобразуем undefined в null для MySQL
    const safeName = name || null;
    const safeDescription = description || null;
    const safeImageUrl = image_url || null;
    const safeCategoryName = category_name || null;
    const safeCategoryId = category_id || null;
    const safeSpecifications = specifications ? JSON.stringify(specifications) : null;
    const safeSortOrder = sort_order || 0;
    const safeIsActive = is_active !== undefined ? is_active : true;
    
    const [result] = await pool.execute(`
      INSERT INTO products (name, description, image_url, category_name, category_id, specifications, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [safeName, safeDescription, safeImageUrl, safeCategoryName, safeCategoryId, safeSpecifications, safeSortOrder, safeIsActive]);
    
    const [newProduct] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.image_url,
        p.category_name,
        p.category_id,
        c.name as category_name_from_table,
        p.specifications,
        p.sort_order,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
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
      category_name, 
      category_id,
      specifications, 
      sort_order,
      is_active 
    } = req.body;
    
    // Преобразуем undefined в null для MySQL
    const safeName = name || null;
    const safeDescription = description || null;
    const safeImageUrl = image_url || null;
    const safeCategoryName = category_name || null;
    const safeCategoryId = category_id || null;
    const safeSpecifications = specifications ? JSON.stringify(specifications) : null;
    const safeSortOrder = sort_order || 0;
    const safeIsActive = is_active !== undefined ? is_active : true;
    
    const [result] = await pool.execute(`
      UPDATE products 
      SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        category_name = COALESCE(?, category_name),
        category_id = COALESCE(?, category_id),
        specifications = COALESCE(?, specifications),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [safeName, safeDescription, safeImageUrl, safeCategoryName, safeCategoryId, safeSpecifications, safeSortOrder, safeIsActive, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Продукт не найден'
      });
    }
    
    const [updatedProduct] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.image_url,
        p.category_name,
        p.category_id,
        c.name as category_name_from_table,
        p.specifications,
        p.sort_order,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
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

// POST /api/products/:id/images - добавить изображение к продукту
router.post('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, alt_text, sort_order } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
      VALUES (?, ?, ?, ?)
    `, [id, image_url, alt_text, sort_order || 1]);
    
    res.status(201).json({
      success: true,
      data: { id: result.insertId },
      message: 'Изображение успешно добавлено'
    });
  } catch (error) {
    console.error('Error adding product image:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении изображения',
      error: error.message
    });
  }
});

// POST /api/products/:id/documents - добавить документ к продукту
router.post('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, file_url, file_type, file_size, sort_order } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO product_documents (product_id, name, description, file_url, file_type, file_size, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, name, description, file_url, file_type, file_size, sort_order || 1]);
    
    res.status(201).json({
      success: true,
      data: { id: result.insertId },
      message: 'Документ успешно добавлен'
    });
  } catch (error) {
    console.error('Error adding product document:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении документа',
      error: error.message
    });
  }
});

// DELETE /api/products/:id/images/:imageId - удалить изображение продукта
router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const [result] = await pool.execute(`
      UPDATE product_images 
      SET is_active = false
      WHERE id = ? AND product_id = ?
    `, [imageId, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Изображение не найдено'
      });
    }
    
    res.json({
      success: true,
      message: 'Изображение успешно удалено'
    });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении изображения',
      error: error.message
    });
  }
});

// DELETE /api/products/:id/documents/:documentId - удалить документ продукта
router.delete('/:id/documents/:documentId', async (req, res) => {
  try {
    const { id, documentId } = req.params;
    
    const [result] = await pool.execute(`
      UPDATE product_documents 
      SET is_active = false
      WHERE id = ? AND product_id = ?
    `, [documentId, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
    }
    
    res.json({
      success: true,
      message: 'Документ успешно удален'
    });
  } catch (error) {
    console.error('Error deleting product document:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении документа',
      error: error.message
    });
  }
});

module.exports = router;
