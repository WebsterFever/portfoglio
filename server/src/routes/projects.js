// server/src/routes/projects.js
import express from 'express';
import { Project } from '../models/index.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/* -------------------- CORS -------------------- */
const ALLOWED = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

router.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    const reqHeaders = req.headers['access-control-request-headers'];
    res.setHeader(
      'Access-Control-Allow-Headers',
      reqHeaders || 'Content-Type,Authorization,x-portfolio-code'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* -------------------- Admin Guard -------------------- */
const ADMIN_CODE = process.env.ADMIN_CODE;

function ensureAdmin(req, res, next) {
  if (!ADMIN_CODE) {
    return res.status(500).json({ message: 'Server admin code not configured' });
  }

  const code = req.headers['x-portfolio-code'] || req.body?.code;

  if (code !== ADMIN_CODE) {
    return res.status(401).json({ message: 'Invalid admin code' });
  }

  next();
}

/* -------------------- Helpers -------------------- */
function normalizeOptionalUrl(v) {
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}

/* -------------------- Read Routes -------------------- */

// GET /api/projects
router.get('/', async (_req, res) => {
  const items = await Project.findAll({
    order: [['createdAt', 'DESC']],
  });
  res.json(items);
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const item = await Project.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

/* -------------------- Write Routes (Protected) -------------------- */

// POST /api/projects
router.post('/', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      link,
      link2,
      description,
      tags,
      developedAt,
      inProduction
    } = req.body;

    if (!title || !link) {
      return res.status(400).json({ message: 'title and link are required' });
    }

    // Parse tags
    let parsedTags = null;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        try {
          const maybe = JSON.parse(tags);
          if (Array.isArray(maybe)) parsedTags = maybe;
        } catch {
          parsedTags = tags.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    // ✅ Cloudinary URL
    const imagePath = req.file ? req.file.path : null;

    const created = await Project.create({
      title,
      link,
      link2: normalizeOptionalUrl(link2),
      description,
      tags: parsedTags,
      imagePath,
      developed_at: developedAt || null,
      in_production:
        typeof inProduction === 'string'
          ? inProduction === 'true'
          : !!inProduction,
    });

    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// PUT /api/projects/:id
router.put('/:id', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    const {
      title,
      link,
      link2,
      description,
      tags,
      developedAt,
      inProduction
    } = req.body;

    let parsedTags = item.tags;

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        try {
          const maybe = JSON.parse(tags);
          parsedTags = Array.isArray(maybe) ? maybe : item.tags;
        } catch {
          parsedTags = tags.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    let imagePath = item.imagePath;

    // If new image uploaded → replace URL
    if (req.file) {
      imagePath = req.file.path; // Cloudinary URL
    }

    const updatePayload = {
      title,
      link,
      description,
      tags: parsedTags,
      imagePath,
      developed_at: developedAt ?? item.developed_at,
      in_production:
        typeof inProduction === 'undefined'
          ? item.in_production
          : typeof inProduction === 'string'
          ? inProduction === 'true'
          : !!inProduction,
    };

    if (Object.prototype.hasOwnProperty.call(req.body, 'link2')) {
      updatePayload.link2 = normalizeOptionalUrl(link2);
    }

    await item.update(updatePayload);

    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    await item.destroy();

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;