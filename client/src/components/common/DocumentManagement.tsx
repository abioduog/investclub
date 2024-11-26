import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { uploadFile } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadDate: string;
}

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const toast = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadFile(file, 'document');
      const newDocument: Document = {
        id: response.fileId.toString(),
        name: file.name,
        url: response.url,
        type: file.type,
        uploadDate: new Date().toISOString()
      };
      setDocuments([...documents, newDocument]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  return (
    <div className="document-management">
      <h2>Document Management</h2>
      <FileUpload
        acceptedTypes={['application/pdf', 'image/*']}
        maxSizeMB={5}
        onFileSelect={handleFileUpload}
        label="Upload Document"
      />
      <div className="documents-list">
        {documents.map((doc) => (
          <div key={doc.id} className="document-item">
            <span>{doc.name}</span>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}; 