import { Router, Request, Response } from 'express';
import { put } from '@vercel/blob';
import { validateFile } from '../middleware/fileValidation';
import { db } from '../lib/db';

interface FileValidationRequest extends Request {
  fileValidation?: {
    purpose: string;
    originalName: string;
    size: number;
    mimetype: string;
    timestamp: string;
  };
  file?: Express.Multer.File;
}

const router = Router();

router.post('/:purpose', validateFile('profile'), async (req: FileValidationRequest, res: Response) => {
  try {
    const { purpose } = req.params;
    const { fileValidation } = req;
    
    if (!fileValidation || !req.file) {
      return res.status(400).json({ error: 'File validation failed' });
    }

    // Convert Buffer to Blob for upload
    const blob = await put(fileValidation.originalName, req.file.buffer, {
      access: 'public',
      contentType: fileValidation.mimetype,
      addRandomSuffix: true
    });

    // Store file metadata in database
    const result = await db.run(
      `INSERT INTO files (id, url, filename, size, type, purpose, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        blob.url,
        fileValidation.originalName,
        fileValidation.size,
        fileValidation.mimetype,
        purpose,
        'system' // Will be replaced with actual user ID once auth is implemented
      ]
    );

    return res.json({
      ...blob,
      fileId: result.lastID,
      metadata: fileValidation
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get file metadata
router.get('/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const file = await db.get('SELECT * FROM files WHERE id = ?', [fileId]);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    return res.status(500).json({ error: 'Failed to get file' });
  }
});

export default router; 