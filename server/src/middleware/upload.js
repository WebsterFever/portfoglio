// server/src/middleware/upload.js

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// ----------------------
// Cloudinary Configuration
// ----------------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ----------------------
// Allowed Types
// ----------------------
const allowedMimes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/svg+xml',
]);

const fileFilter = (_req, file, cb) => {
  const mime = file.mimetype?.toLowerCase() || '';

  if (allowedMimes.has(mime)) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed'), false);
};

// ----------------------
// Cloudinary Storage Engine
// ----------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    return {
      folder: 'portfolio-projects',
      allowed_formats: [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'gif',
        'heic',
        'heif',
        'svg',
      ],
      public_id: `${Date.now()}-${file.originalname
        .split('.')[0]
        .replace(/\s+/g, '-')
        .toLowerCase()}`,
    };
  },
});

// ----------------------
// Export Upload Middleware
// ----------------------
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});