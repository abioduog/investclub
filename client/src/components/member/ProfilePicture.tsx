import React, { useState } from 'react';
import { FileUpload } from '../common/FileUpload';
import { uploadFile } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';
import defaultAvatar from '../../assets/default-avatar.png';

interface ProfilePictureProps {
  currentImageUrl?: string;
  onUpdate: (imageUrl: string) => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  currentImageUrl,
  onUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleProfilePictureUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadFile(file, 'profile');
      onUpdate(response.url);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-picture-section">
      <div className="current-picture">
        <img 
          src={currentImageUrl || defaultAvatar} 
          alt="Profile" 
          className="profile-image"
        />
      </div>
      <div className="upload-section">
        <FileUpload
          acceptedTypes={['image/jpeg', 'image/png']}
          maxSizeMB={1}
          onFileSelect={handleProfilePictureUpload}
          label={isUploading ? 'Uploading...' : 'Change Profile Picture'}
          className="profile-upload"
        />
      </div>
    </div>
  );
}; 