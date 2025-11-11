import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

// Ensure upload directory exists
const uploadDir = config.uploadDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize, // 5MB default
  },
  fileFilter,
});

// Single file upload
export const uploadSingle = upload.single('image');

// Multiple files upload
export const uploadMultiple = upload.array('images', 10);

// In production, you would upload to S3 or Cloudinary instead
// For now, we'll use local storage and return the file URL

export const getFileUrl = (filename: string): string => {
  // In production, return S3 or Cloudinary URL
  // For development, return local file URL
  return `/uploads/${filename}`;
};

