import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

interface AdminProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
}

const AdminProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<AdminProfileData>({
    name: 'Admin User',
    email: 'admin@cmsogs88.com',
    phone: '+234 XXX XXX XXXX',
    role: 'Super Admin',
    lastLogin: '2024-03-15 10:30 AM',
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Admin Profile</h2>
          {!isEditing && (
            <button className="add-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-container">
          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="profile-fields">
              <div className="field-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    aria-label="Full Name"
                  />
                ) : (
                  <p>{profileData.name}</p>
                )}
              </div>
              <div className="field-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    aria-label="Email"
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>
              <div className="field-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    aria-label="Phone Number"
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Admin Details</h3>
            <div className="profile-fields">
              <div className="field-group">
                <label>Role</label>
                <p>{profileData.role}</p>
              </div>
              <div className="field-group">
                <label>Last Login</label>
                <p>{profileData.lastLogin}</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button className="secondary-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="add-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfilePage; 