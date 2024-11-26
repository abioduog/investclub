import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const validationConfigs = {
  profile: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'] as string[]
  },
  contribution: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'] as string[]
  },
  document: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ] as string[]
  }
};

type UploadPurpose = keyof typeof validationConfigs;

export const validateFile = (purpose: UploadPurpose) => {
  const config = validationConfigs[purpose];
  const storage = multer.memoryStorage();
  
  const multerInstance = multer({
    storage,
    limits: { fileSize: config.maxSize },
    fileFilter: (req, file, cb) => {
      if (config.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`));
      }
    }
  });

  return (req: Request, res: Response, next: NextFunction) => {
    multerInstance.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
      }
      
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      (req as any).fileValidation = {
        purpose,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        timestamp: new Date().toISOString()
      };

      next();
    });
  };
}; 