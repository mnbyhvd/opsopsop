const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
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

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '') || `project-${Date.now()}`;
}

async function getProjectById(id) {
  const [rows] = await pool.execute('SELECT * FROM portfolio_projects WHERE id = ?', [id]);
  return rows[0] || null;
}

async function getSections(projectId, includeAll = false) {
  const [rows] = await pool.execute(`
    SELECT *
    FROM portfolio_sections
    WHERE project_id = ? ${includeAll ? '' : 'AND is_active = true'}
    ORDER BY sort_order ASC, created_at ASC
  `, [projectId]);

  return rows;
}

async function getDocuments(projectId, includeAll = false) {
  const [rows] = await pool.execute(`
    SELECT *
    FROM portfolio_documents
    WHERE project_id = ? ${includeAll ? '' : 'AND is_active = true'}
    ORDER BY sort_order ASC, created_at ASC
  `, [projectId]);

  return rows;
}

function resolveUploadPath(fileUrl) {
  const cleanUrl = String(fileUrl || '').split('?')[0];
  if (!cleanUrl.startsWith('/uploads/')) return null;
  const relativePath = cleanUrl.replace(/^\/uploads\//, '');
  return path.join(__dirname, '..', 'uploads', relativePath);
}

router.get('/', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const [rows] = await pool.execute(`
      SELECT *
      FROM portfolio_projects
      ${includeAll ? '' : 'WHERE is_active = true'}
      ORDER BY sort_order ASC, created_at ASC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio projects' });
  }
});

router.get('/:projectId/sections', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const sections = await getSections(req.params.projectId, includeAll);
    res.json({ success: true, data: sections });
  } catch (error) {
    console.error('Error fetching portfolio sections:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio sections' });
  }
});

router.post('/:projectId/sections', async (req, res) => {
  try {
    const { title, description, image_url, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      INSERT INTO portfolio_sections (project_id, title, description, image_url, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      req.params.projectId,
      title || '',
      description || '',
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true
    ]);

    const [rows] = await pool.execute('SELECT * FROM portfolio_sections WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating portfolio section:', error);
    res.status(500).json({ success: false, error: 'Failed to create portfolio section' });
  }
});

router.put('/sections/:sectionId', async (req, res) => {
  try {
    const { title, description, image_url, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      UPDATE portfolio_sections
      SET title = ?, description = ?, image_url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || '',
      description || '',
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true,
      req.params.sectionId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio section not found' });
    }

    const [rows] = await pool.execute('SELECT * FROM portfolio_sections WHERE id = ?', [req.params.sectionId]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating portfolio section:', error);
    res.status(500).json({ success: false, error: 'Failed to update portfolio section' });
  }
});

router.delete('/sections/:sectionId', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM portfolio_sections WHERE id = ?', [req.params.sectionId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio section not found' });
    }

    res.json({ success: true, message: 'Portfolio section deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio section:', error);
    res.status(500).json({ success: false, error: 'Failed to delete portfolio section' });
  }
});

router.get('/:projectId/documents', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const documents = await getDocuments(req.params.projectId, includeAll);
    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching portfolio documents:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio documents' });
  }
});

router.post('/:projectId/documents', async (req, res) => {
  try {
    const { title, file_url, file_type, file_size, original_filename, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      INSERT INTO portfolio_documents (
        project_id, title, file_url, file_type, file_size, original_filename, sort_order, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.params.projectId,
      title || original_filename || 'Документ',
      file_url || '',
      file_type || null,
      file_size || null,
      original_filename || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true
    ]);

    const [rows] = await pool.execute('SELECT * FROM portfolio_documents WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating portfolio document:', error);
    res.status(500).json({ success: false, error: 'Failed to create portfolio document' });
  }
});

router.put('/documents/:documentId', async (req, res) => {
  try {
    const { title, file_url, file_type, file_size, original_filename, sort_order, is_active } = req.body;
    const [result] = await pool.execute(`
      UPDATE portfolio_documents
      SET title = ?, file_url = ?, file_type = ?, file_size = ?, original_filename = ?,
          sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || original_filename || 'Документ',
      file_url || '',
      file_type || null,
      file_size || null,
      original_filename || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true,
      req.params.documentId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio document not found' });
    }

    const [rows] = await pool.execute('SELECT * FROM portfolio_documents WHERE id = ?', [req.params.documentId]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating portfolio document:', error);
    res.status(500).json({ success: false, error: 'Failed to update portfolio document' });
  }
});

router.delete('/documents/:documentId', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM portfolio_documents WHERE id = ?', [req.params.documentId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio document not found' });
    }

    res.json({ success: true, message: 'Portfolio document deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio document:', error);
    res.status(500).json({ success: false, error: 'Failed to delete portfolio document' });
  }
});

router.get('/:projectId/documents.zip', async (req, res) => {
  try {
    const project = await getProjectById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Portfolio project not found' });
    }

    const documents = await getDocuments(req.params.projectId, false);
    if (documents.length === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio documents not found' });
    }

    const zip = new JSZip();
    let addedCount = 0;

    documents.forEach((document, index) => {
      const filePath = resolveUploadPath(document.file_url);
      if (!filePath || !fs.existsSync(filePath)) return;

      const extension = path.extname(document.original_filename || document.file_url || '') || path.extname(filePath);
      const safeName = String(document.title || document.original_filename || `document-${index + 1}`)
        .replace(/[\\/:*?"<>|]+/g, '-')
        .trim() || `document-${index + 1}`;
      const filename = safeName.endsWith(extension) ? safeName : `${safeName}${extension}`;
      zip.file(filename, fs.readFileSync(filePath));
      addedCount += 1;
    });

    if (addedCount === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio document files not found' });
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    const archiveName = `${project.slug || `project-${project.id}`}-documents.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating portfolio documents zip:', error);
    res.status(500).json({ success: false, error: 'Failed to generate portfolio documents zip' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const [rows] = await pool.execute(`
      SELECT *
      FROM portfolio_projects
      WHERE (slug = ? OR id = ?) ${includeAll ? '' : 'AND is_active = true'}
      LIMIT 1
    `, [req.params.slug, req.params.slug]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio project not found' });
    }

    const project = rows[0];
    project.sections = await getSections(project.id, includeAll);
    project.documents = await getDocuments(project.id, includeAll);
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio project' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      slug,
      location,
      summary,
      description,
      image_url,
      sort_order,
      is_active,
      meta_title,
      meta_description
    } = req.body;

    const safeSlug = normalizeSlug(slug || title);
    const [result] = await pool.execute(`
      INSERT INTO portfolio_projects (
        title, slug, location, summary, description, image_url, sort_order, is_active, meta_title, meta_description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title || '',
      safeSlug,
      location || '',
      summary || '',
      description || '',
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true,
      meta_title || '',
      meta_description || ''
    ]);

    const project = await getProjectById(result.insertId);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    res.status(500).json({ success: false, error: 'Failed to create portfolio project' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      slug,
      location,
      summary,
      description,
      image_url,
      sort_order,
      is_active,
      meta_title,
      meta_description
    } = req.body;

    const safeSlug = normalizeSlug(slug || title);
    const [result] = await pool.execute(`
      UPDATE portfolio_projects
      SET title = ?, slug = ?, location = ?, summary = ?, description = ?, image_url = ?, sort_order = ?,
          is_active = ?, meta_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || '',
      safeSlug,
      location || '',
      summary || '',
      description || '',
      image_url || null,
      sort_order || 0,
      is_active !== undefined ? is_active : true,
      meta_title || '',
      meta_description || '',
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio project not found' });
    }

    const project = await getProjectById(req.params.id);
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    res.status(500).json({ success: false, error: 'Failed to update portfolio project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM portfolio_projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Portfolio project not found' });
    }

    res.json({ success: true, message: 'Portfolio project deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete portfolio project' });
  }
});

module.exports = router;
