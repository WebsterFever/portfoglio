
// server/src/routes/projects.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Project } from '../models/index.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve '/uploads/xxx' to absolute path on disk
const toAbsUploadPath = (maybeSlashPath) =>
  path.join(__dirname, '..', '..', maybeSlashPath.replace(/^\//, ''));

/* -------------------------------------------------------
   Router-level CORS + preflight (OPTIONS) handling
   Ensures /api/projects* always returns CORS headers.
-------------------------------------------------------- */
const ALLOWED = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

router.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow server-to-server (no Origin) or any configured origin(s)
  if (!origin || ALLOWED.includes(origin)) {
    // reflect the calling origin to satisfy the browser
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );

    const reqHeaders = req.headers['access-control-request-headers'];
    res.setHeader(
      'Access-Control-Allow-Headers',
      reqHeaders || 'Content-Type,Authorization'
    );

    // keep false unless you actually use cookies
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* -------------------- Helpers -------------------- */

const parseTags = (value) => {
  if (value === undefined) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const j = JSON.parse(value);
      if (Array.isArray(j)) return j;
    } catch {
      // comma list fallback
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return null;
};

const parseBool = (v, fallback = true) => {
  if (v === undefined || v === null || v === '') return fallback;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase().trim();
  return ['1', 'true', 'yes', 'y', 'on'].includes(s)
    ? true
    : ['0', 'false', 'no', 'n', 'off'].includes(s)
    ? false
    : fallback;
};

// Accept YYYY-MM-DD or any date-ish string and trim to DATEONLY
const parseDateOnly = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  // if already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  // format to yyyy-mm-dd
  return d.toISOString().slice(0, 10);
};

/* -------------------- Routes -------------------- */

// GET /api/projects
router.get('/', async (_req, res) => {
  const items = await Project.findAll({ order: [['createdAt', 'DESC']] });
  res.json(items);
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const item = await Project.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// POST /api/projects  (multipart form, field: image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, link, description, tags, developedAt, inProduction } = req.body;
    if (!title || !link)
      return res.status(400).json({ message: 'title and link are required' });

    const created = await Project.create({
      title,
      link,
      description,
      tags: parseTags(tags),
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
      developedAt: parseDateOnly(developedAt),           // NEW
      inProduction: parseBool(inProduction, true),        // NEW
    });

    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// PUT /api/projects/:id  (multipart form, field: image)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    const { title, link, description, tags, developedAt, inProduction } = req.body;

    // tags
    let nextTags = item.tags;
    const parsed = parseTags(tags);
    if (parsed !== null) nextTags = parsed;

    // image
    let imagePath = item.imagePath;
    if (req.file) {
      if (imagePath) {
        const abs = toAbsUploadPath(imagePath);
        fs.promises.unlink(abs).catch(() => {});
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    await item.update({
      title: title ?? item.title,
      link: link ?? item.link,
      description: description ?? item.description,
      tags: nextTags,
      imagePath,
      developedAt:
        developedAt !== undefined ? parseDateOnly(developedAt) : item.developedAt, // NEW
      inProduction:
        inProduction !== undefined ? parseBool(inProduction, item.inProduction) : item.inProduction, // NEW
    });

    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await Project.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (item.imagePath) {
      const abs = toAbsUploadPath(item.imagePath);
      fs.promises.unlink(abs).catch(() => {});
    }

    await item.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
