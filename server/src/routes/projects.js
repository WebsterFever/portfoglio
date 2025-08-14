// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import { Project } from '../models/index.js';
// import { upload } from '../middleware/upload.js';

// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // helper: resolve '/uploads/xxx' to absolute path
// const toAbsUploadPath = (maybeSlashPath) =>
//   path.join(__dirname, '..', '..', maybeSlashPath.replace(/^\//, ''));

// // ---- Routes ----

// // GET /api/projects
// router.get('/', async (_req, res) => {
//   const items = await Project.findAll({ order: [['createdAt', 'DESC']] });
//   res.json(items);
// });

// // GET /api/projects/:id
// router.get('/:id', async (req, res) => {
//   const item = await Project.findByPk(req.params.id);
//   if (!item) return res.status(404).json({ message: 'Not found' });
//   res.json(item);
// });

// // POST /api/projects   (multipart form, field: image)
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { title, link, description, tags } = req.body;
//     if (!title || !link)
//       return res.status(400).json({ message: 'title and link are required' });

//     // tags can come as JSON string, comma string, or array
//     let parsedTags = null;
//     if (tags !== undefined) {
//       if (Array.isArray(tags)) {
//         parsedTags = tags;
//       } else if (typeof tags === 'string') {
//         try {
//           parsedTags = JSON.parse(tags); // try JSON
//           if (!Array.isArray(parsedTags)) parsedTags = null;
//         } catch {
//           parsedTags = tags
//             .split(',')
//             .map((s) => s.trim())
//             .filter(Boolean);
//         }
//       }
//     }

//     const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

//     const created = await Project.create({
//       title,
//       link,
//       description,
//       tags: parsedTags,
//       imagePath,
//     });

//     res.status(201).json(created);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Failed to create project' });
//   }
// });

// // PUT /api/projects/:id  (multipart form, field: image)
// router.put('/:id', upload.single('image'), async (req, res) => {
//   try {
//     const item = await Project.findByPk(req.params.id);
//     if (!item) return res.status(404).json({ message: 'Not found' });

//     const { title, link, description, tags } = req.body;

//     let parsedTags = item.tags;
//     if (tags !== undefined) {
//       if (Array.isArray(tags)) parsedTags = tags;
//       else if (typeof tags === 'string') {
//         try {
//           parsedTags = JSON.parse(tags);
//           if (!Array.isArray(parsedTags)) parsedTags = item.tags;
//         } catch {
//           parsedTags = tags
//             .split(',')
//             .map((s) => s.trim())
//             .filter(Boolean);
//         }
//       }
//     }

//     let imagePath = item.imagePath;
//     if (req.file) {
//       // delete old image quietly
//       if (imagePath) {
//         const abs = toAbsUploadPath(imagePath);
//         fs.promises.unlink(abs).catch(() => {});
//       }
//       imagePath = `/uploads/${req.file.filename}`;
//     }

//     await item.update({ title, link, description, tags: parsedTags, imagePath });
//     res.json(item);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Failed to update project' });
//   }
// });

// // DELETE /api/projects/:id
// router.delete('/:id', async (req, res) => {
//   try {
//     const item = await Project.findByPk(req.params.id);
//     if (!item) return res.status(404).json({ message: 'Not found' });

//     if (item.imagePath) {
//       const abs = toAbsUploadPath(item.imagePath);
//       fs.promises.unlink(abs).catch(() => {});
//     }

//     await item.destroy();
//     res.json({ ok: true });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Failed to delete project' });
//   }
// });

// export default router;
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
   Ensures /api/projects* always returns CORS headers,
   even if app-level middleware is bypassed.
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
    const { title, link, description, tags } = req.body;
    if (!title || !link)
      return res.status(400).json({ message: 'title and link are required' });

    // tags can be JSON string, comma string, or array
    let parsedTags = null;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags); // try JSON
          if (!Array.isArray(parsedTags)) parsedTags = null;
        } catch {
          parsedTags = tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await Project.create({
      title,
      link,
      description,
      tags: parsedTags,
      imagePath,
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

    const { title, link, description, tags } = req.body;

    let parsedTags = item.tags;
    if (tags !== undefined) {
      if (Array.isArray(tags)) parsedTags = tags;
      else if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
          if (!Array.isArray(parsedTags)) parsedTags = item.tags;
        } catch {
          parsedTags = tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    }

    let imagePath = item.imagePath;
    if (req.file) {
      // delete old image quietly
      if (imagePath) {
        const abs = toAbsUploadPath(imagePath);
        fs.promises.unlink(abs).catch(() => {});
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    await item.update({ title, link, description, tags: parsedTags, imagePath });
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
