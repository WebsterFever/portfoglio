// server/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { sequelize } from './models/index.js';
import projectsRouter from './routes/projects.js';

dotenv.config();

const app = express();

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN_ENV = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

/**
 * Allow one or multiple origins.
 * You can set CLIENT_ORIGIN like:
 *   https://portfoglio-three.vercel.app
 * or multiple, comma-separated:
 *   https://portfoglio-three.vercel.app, http://localhost:5173
 */
const ALLOWED_ORIGINS = CLIENT_ORIGIN_ENV.split(',').map(s => s.trim()).filter(Boolean);

// ---- CORS ----
const corsOptions = {
  origin(origin, cb) {
    // Allow server-to-server requests (no Origin header) and allowed browser origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // set to true only if you actually use cookies/auth headers
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Ensure preflight requests succeed
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Static files for uploaded images (server/uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/projects', projectsRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Optional: basic error handler (keeps errors from crashing the process)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server after DB connection
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
