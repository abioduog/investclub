declare namespace Express {
  export interface Request {
    fileValidation?: {
      purpose: string;
      originalName: string;
      size: number;
      mimetype: string;
      timestamp: string;
    };
  }
} 