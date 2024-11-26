import { VercelRequest, VercelResponse } from '@vercel/node';
import { blobStorage } from '../server/src/services/blobStorage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const file = req.body;
      const url = await blobStorage.uploadFile(file, file.name);
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 