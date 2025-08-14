import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads dir exists (one level up from src)
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

// MIME types we accept
const allowedMimes = new Set([
  'image/jpeg',
  'image/jpg',       // some tools send this
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/svg+xml',
]);

// Extensions we accept (fallback if MIME is generic)
const allowedExts = new Set(['.jpeg', '.jpg', '.png', '.webp', '.gif', '.heic', '.heif', '.svg']);

const fileFilter = (req, file, cb) => {
  const mime = file.mimetype?.toLowerCase() || '';
  const ext = path.extname(file.originalname).toLowerCase();

  // Some Windows uploads arrive as application/octet-stream — trust extension in that case
  const isGeneric = mime === 'application/octet-stream' || mime === 'binary/octet-stream';

  if (allowedMimes.has(mime) || (isGeneric && allowedExts.has(ext))) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed'), false);
};

// Increase size if you like (10 MB here)
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
