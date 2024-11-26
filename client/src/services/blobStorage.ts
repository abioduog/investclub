import axios from 'axios';

export const uploadToBlob = async (file: File, path: string = 'uploads'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload?filename=${path}/${file.name}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    throw error;
  }
}; 