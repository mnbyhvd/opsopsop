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
