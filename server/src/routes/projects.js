
import { Router } from 'express';
import { Project } from '../models/index.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Admin code guard
const ADMIN_CODE = process.env.ADMIN_CODE || '';
const checkCode = (req, res, next) => {
  const headerCode = req.headers['x-portfolio-code'] || req.headers['x-admin-code'];
  const bodyCode = req.body?.code;
  const provided = headerCode || bodyCode;
  if (!ADMIN_CODE) {
    return res.status(500).json({ message: 'Server missing ADMIN_CODE' });
  }
  if (!provided || String(provided) !== String(ADMIN_CODE)) {
    return res.status(401).json({ message: 'Invalid or missing admin code' });
  }
  next();
};

// CREATE (with optional image upload) - protected
router.post('/', checkCode, upload.single('image'), async (req, res) => {
  try {
    const { title, link, description, tags } = req.body;
    if (!title || !link) {
      return res.status(400).json({ message: 'title and link are required' });
    }

    const tagArray = typeof tags === 'string' && tags.length
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : null;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const project = await Project.create({ title, link, description, imagePath, tags: tagArray });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// LIST (no auth)
router.get('/', async (req, res) => {
  try {
    const items = await Project.findAll({ order: [['created_at', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// UPDATE - protected
router.put('/:id', checkCode, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, link, description, tags } = req.body;

    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const updates = {};
    if (title) updates.title = title;
    if (link) updates.link = link;
    if (description) updates.description = description;
    if (typeof tags === 'string') {
      updates.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (req.file) {
      updates.imagePath = `/uploads/${req.file.filename}`;
    }

    await project.update(updates);
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE - protected
router.delete('/:id', checkCode, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await Project.destroy({ where: { id } });
    if (!count) return res.status(404).json({ message: 'Project not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
