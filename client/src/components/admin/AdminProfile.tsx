import React, { useState, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';

interface AdminData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    role: string;
    joinDate: string;
    profilePicture: string;
  };
  securityInfo: {
    lastLogin: string;
    lastPasswordChange: string;
    twoFactorEnabled: boolean;
  };
  activityStats: {
    contributionsValidated: number;
    investmentsCreated: number;
    membersManaged: number;
    reportsGenerated: number;
  };
}

const AdminProfile: React.FC = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dummy data - will be replaced with API calls
  const [adminData, setAdminData] = useState<AdminData>({
    personalInfo: {
      name: 'John Admin',
      email: 'john.admin@example.com',
      phone: '+234 XXX XXX XXXX',
      role: 'Super Admin',
      joinDate: '2023-01-01',
      profilePicture: '', // Default empty profile picture
    },
    securityInfo: {
      lastLogin: '2024-02-20 14:30',
      lastPasswordChange: '2024-01-15',
      twoFactorEnabled: true,
    },
    activityStats: {
      contributionsValidated: 150,
      investmentsCreated: 12,
      membersManaged: 75,
      reportsGenerated: 25,
    },
  });

  const [editForm, setEditForm] = useState({ ...adminData.personalInfo });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminData({
      ...adminData,
      personalInfo: editForm,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    // In a real app, this would open a password change modal or redirect to a password change page
    toast.info('Password change functionality will be implemented soon');
  };

  const handleToggle2FA = () => {
    setAdminData({
      ...adminData,
      securityInfo: {
        ...adminData.securityInfo,
        twoFactorEnabled: !adminData.securityInfo.twoFactorEnabled,
      },
    });
    toast.success(
      `Two-factor authentication ${adminData.securityInfo.twoFactorEnabled ? 'disabled' : 'enabled'}`
    );
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData({
          ...adminData,
          personalInfo: {
            ...adminData.personalInfo,
            profilePicture: reader.result as string,
          },
        });
        toast.success('Profile picture updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Admin Profile</h2>
          {!isEditing && (
            <button className="secondary-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-container">
          {/* Profile Picture Section */}
          <div className="profile-section">
            <div className="profile-picture-container">
              <div 
                className="profile-picture" 
                onClick={handleProfilePictureClick}
                style={{
                  backgroundImage: adminData.personalInfo.profilePicture 
                    ? `url(${adminData.personalInfo.profilePicture})` 
                    : 'none',
                  cursor: 'pointer',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                {!adminData.personalInfo.profilePicture && (
                  <span style={{ color: '#666' }}>Click to upload</span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <p className="profile-picture-hint" style={{ textAlign: 'center', color: '#666', fontSize: '0.9em' }}>
                Click to change profile picture<br />
                (Max size: 5MB)
              </p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="profile-section">
            <h3>Personal Information</h3>
            {isEditing ? (
              <form onSubmit={handleEditSubmit}>
                <div className="profile-fields">
                  <div className="field-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="profile-actions">
                  <button type="button" className="button secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="button primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-fields">
                <div className="field-group">
                  <label>Full Name</label>
                  <p>{adminData.personalInfo.name}</p>
                </div>
                <div className="field-group">
                  <label>Email</label>
                  <p>{adminData.personalInfo.email}</p>
                </div>
                <div className="field-group">
                  <label>Phone</label>
                  <p>{adminData.personalInfo.phone}</p>
                </div>
                <div className="field-group">
                  <label>Role</label>
                  <p>{adminData.personalInfo.role}</p>
                </div>
                <div className="field-group">
                  <label>Join Date</label>
                  <p>{adminData.personalInfo.joinDate}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="profile-section">
            <h3>Security Settings</h3>
            <div className="profile-fields">
              <div className="field-group">
                <label>Last Login</label>
                <p>{adminData.securityInfo.lastLogin}</p>
              </div>
              <div className="field-group">
                <label>Last Password Change</label>
                <p>{adminData.securityInfo.lastPasswordChange}</p>
              </div>
              <div className="field-group">
                <label>Two-Factor Authentication</label>
                <p>{adminData.securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <div className="profile-actions">
              <button className="button secondary" onClick={handlePasswordChange}>
                Change Password
              </button>
              <button className="button secondary" onClick={handleToggle2FA}>
                {adminData.securityInfo.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
              </button>
            </div>
          </div>

          {/* Activity Stats Section */}
          <div className="profile-section">
            <h3>Activity Statistics</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Contributions Validated</h3>
                <div className="amount">{adminData.activityStats.contributionsValidated}</div>
              </div>
              <div className="summary-card">
                <h3>Investments Created</h3>
                <div className="amount">{adminData.activityStats.investmentsCreated}</div>
              </div>
              <div className="summary-card">
                <h3>Members Managed</h3>
                <div className="amount">{adminData.activityStats.membersManaged}</div>
              </div>
              <div className="summary-card">
                <h3>Reports Generated</h3>
                <div className="amount">{adminData.activityStats.reportsGenerated}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile; 