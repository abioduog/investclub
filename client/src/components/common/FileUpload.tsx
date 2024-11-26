import React, { useState, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';

interface FileUploadProps {
  acceptedTypes?: string[];
  maxSizeMB?: number;
  onFileSelect: (file: File) => void;
  label?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSizeMB = 5,
  onFileSelect,
  label = 'Upload File',
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Invalid file type');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div 
      className={`file-upload-container ${dragActive ? 'drag-active' : ''} ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="file-upload-input"
        onChange={handleChange}
        accept={acceptedTypes.join(',')}
        title="File upload"
        aria-label="File upload"
      />
      <label className="file-upload-label" htmlFor="file-upload">
        <div>
          <p>{label}</p>
          <p className="file-upload-hint">
            Drag and drop or click to select
          </p>
          <p className="file-upload-types">
            Accepted types: {acceptedTypes.join(', ')}
          </p>
        </div>
      </label>
    </div>
  );
}; 