import axios from 'axios';

export interface UploadResponse {
  url: string;
  fileId: string;
  filename: string;
  size: number;
}

export type UploadPurpose = 'profile' | 'contribution' | 'document';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fileUploadService = {
  async uploadFile(
    file: File, 
    purpose: UploadPurpose, 
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  },

  async deleteFile(fileId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/upload/${fileId}`);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw new Error('Failed to delete file');
    }
  },

  async getFileUrl(fileId: string): Promise<string> {
    try {
      const response = await axios.get(`${API_URL}/api/upload/${fileId}`);
      return response.data.url;
    } catch (error) {
      console.error('Failed to get file URL:', error);
      throw new Error('Failed to get file URL');
    }
  }
}; 