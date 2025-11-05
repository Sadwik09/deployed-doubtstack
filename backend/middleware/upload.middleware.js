import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|zip)$/i;
  const hasValidExtension = allowedExtensions.test(file.originalname);

  // Common MIME types (more comprehensive)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream' // For generic binary files
  ];
  
  const hasValidMimeType = allowedMimeTypes.includes(file.mimetype);

  // Accept file if it has valid extension OR valid MIME type
  if (hasValidExtension || hasValidMimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX, TXT, and ZIP files are allowed.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});
