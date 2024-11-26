import { Router } from 'express';
import { put } from '@vercel/blob';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = req.query.filename as string;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });

    res.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router; 