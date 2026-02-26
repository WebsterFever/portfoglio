// server/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { sequelize } from './models/index.js';
import projectsRouter from './routes/projects.js';

dotenv.config();

const app = express();

// ---- Paths ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Config ----
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN_ENV = process.env.CLIENT_ORIGIN || 'http://localhost:5173';


const ALLOWED_ORIGINS = CLIENT_ORIGIN_ENV
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ---- Strict CORS / Preflight (no external deps) ----
// This guarantees preflight OPTIONS always returns the proper headers.

// TEMP CORS FIX — allow everything
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// ---- Body parsing ----
app.use(express.json({ limit: '10mb' }));

// ---- Static files (uploaded images live in server/uploads) ----
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ---- API routes ----
app.use('/api/projects', projectsRouter);

// ---- Health check ----
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ---- Basic error handler (keeps unexpected errors from crashing the process) ----
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---- Boot after DB connection ----
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // For larger apps, prefer migrations
    console.log('DB connected & models synced.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
})();
