import express from 'express';
import multer from 'multer';
import { put, del } from '@vercel/blob';
import { db } from '../lib/db';

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const validTypes = {
  profile: ['image/jpeg', 'image/png'],
  contribution: ['image/jpeg', 'image/png', 'application/pdf'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { purpose } = req.body;

    if (!file || !purpose) {
      return res.status(400).json({ error: 'File and purpose are required' });
    }

    if (!validTypes[purpose]?.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const blob = await put(file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const fileRecord = await db.run(`
      INSERT INTO files (id, url, filename, size, type, purpose, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      blob.url,
      file.originalname,
      file.size,
      file.mimetype,
      purpose,
      'temp-user-id' // TODO: Get from auth
    ]);

    return res.status(200).json({
      url: blob.url,
      fileId: fileRecord.lastID,
      filename: file.originalname,
      size: file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await db.get('SELECT * FROM files WHERE id = ?', [fileId]);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    await del(file.url);
    await db.run('DELETE FROM files WHERE id = ?', [fileId]);

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
});

router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await db.get('SELECT * FROM files WHERE id = ?', [fileId]);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(200).json({ url: file.url });
  } catch (error) {
    console.error('Get file error:', error);
    return res.status(500).json({ error: 'Failed to get file' });
  }
});

export default router; 