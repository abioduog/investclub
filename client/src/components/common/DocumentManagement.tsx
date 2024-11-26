import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { fileUploadService } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  fileId: string;
  size: number;
}

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // TODO: Fetch existing documents
    setLoading(false);
  }, []);

  const handleDocumentUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await fileUploadService.uploadFile(file, 'document');
      
      const newDocument: Document = {
        id: response.fileId,
        name: file.name,
        type: file.type,
        uploadDate: new Date().toISOString(),
        fileId: response.fileId,
        size: file.size
      };

      setDocuments(prev => [...prev, newDocument]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await fileUploadService.deleteFile(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="document-management">
      <div className="upload-section">
        <h3>Upload New Document</h3>
        <FileUpload
          acceptedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          maxSizeMB={5}
          onFileSelect={handleDocumentUpload}
          label={isUploading ? 'Uploading...' : 'Upload Document'}
        />
      </div>

      <div className="documents-list">
        <h3>Your Documents</h3>
        {documents.length === 0 ? (
          <p className="no-documents">No documents uploaded yet</p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="document-item">
              <div className="document-info">
                <span className="document-name">{doc.name}</span>
                <span className="document-size">
                  {(doc.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="document-date">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <div className="document-actions">
                <a 
                  href={`/api/files/${doc.fileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  View
                </a>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 