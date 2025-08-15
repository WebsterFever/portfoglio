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

/**
 * Allow one or multiple origins.
 * Example:
 *   CLIENT_ORIGIN=https://portfoglio-three.vercel.app
 * Or multiple, comma-separated:
 *   CLIENT_ORIGIN=https://portfoglio-three.vercel.app,http://localhost:5173
 */
const ALLOWED_ORIGINS = CLIENT_ORIGIN_ENV
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ---- Strict CORS / Preflight (no external deps) ----
// This guarantees preflight OPTIONS always returns the proper headers.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // If request comes from an allowed browser origin, emit CORS headers
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin'); // avoid cache poisoning
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

    // Echo requested headers if provided, otherwise fallback to common ones
    const reqHeaders = req.headers['access-control-request-headers'];
    res.setHeader(
      'Access-Control-Allow-Headers',
      reqHeaders || 'Content-Type,Authorization'
    );

    // We are not using cookies; keep this "false" unless you use credentials on fetch()
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  }

  // Short-circuit preflight and return 204 with the headers set above
  if (req.method === 'OPTIONS') return res.status(204).end();

  return next();
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
