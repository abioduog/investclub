import { put, del, list } from '@vercel/blob';

export const blobStorage = {
  async uploadFile(file: Buffer, filename: string): Promise<string> {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return blob.url;
  },

  async deleteFile(url: string): Promise<void> {
    await del(url);
  },

  async listFiles(prefix: string): Promise<string[]> {
    const { blobs } = await list({ prefix });
    return blobs.map(blob => blob.url);
  }
}; 