import axios from 'axios';

export interface FileUploadResponse {
  url: string;
  fileId: number;
  metadata: {
    purpose: string;
    originalName: string;
    size: number;
    mimetype: string;
    timestamp: string;
  };
}

export const uploadFile = async (
  file: File,
  purpose: 'profile' | 'contribution' | 'document'
): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload/${purpose}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFileMetadata = async (fileId: string): Promise<FileUploadResponse> => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/upload/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
}; 