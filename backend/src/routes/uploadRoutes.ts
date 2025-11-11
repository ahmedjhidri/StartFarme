import { Router } from 'express';
import { uploadSingle, uploadMultiple, getFileUrl } from '../middlewares/upload';
import { authenticate } from '../middlewares/auth';
import { Request, Response } from 'express';

const router = Router();

router.use(authenticate); // All routes require authentication

// Upload single image
router.post('/single', uploadSingle, (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = getFileUrl(req.file.filename);

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload multiple images
router.post('/multiple', uploadMultiple, (req: Request, res: Response) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];
    const fileUrls = files.map((file) => getFileUrl(file.filename));

    res.json({
      success: true,
      urls: fileUrls,
      files: files.map((file) => ({
        filename: file.filename,
        url: getFileUrl(file.filename),
      })),
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

export default router;

