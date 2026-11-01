import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with safe sanitized filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Strip dangerous characters, add timestamp prefix
    const safeExt = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, safeExt)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${safeBase}-${uniqueSuffix}${safeExt}`);
  }
});

// Allowed file types: PDF, PPT/PPTX, DOC/DOCX, TXT, ZIP
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.zip']);
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed'
]);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Unsupported file extension: '${ext}'. Allowed types: PDF, PPT, PPTX, DOC, DOCX, TXT, ZIP.`), false);
  }

  // Also check MIME type if provided
  if (file.mimetype && !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    // Some browsers send generic octet-stream for docx/pptx
    if (file.mimetype !== 'application/octet-stream') {
      return cb(new Error(`Unsupported MIME type: '${file.mimetype}'.`), false);
    }
  }

  cb(null, true);
}

export const uploadResourceFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max
  }
});
