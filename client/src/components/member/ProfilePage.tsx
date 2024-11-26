import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  graduationYear: string;
  bankName: string;
  accountNumber: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 XXX XXX XXXX',
    graduationYear: '1988',
    bankName: 'Example Bank',
    accountNumber: 'XXXXXXXXXXXX',
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
  };

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Profile</h2>
          {!isEditing && (
            <button className="add-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-container">
          <div className="profile-section">
            <h3>Personal Information</h3>
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
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
              <div className="field-group">
                <label>Graduation Year</label>
                <p>{profileData.graduationYear}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Bank Information</h3>
            <div className="profile-fields">
              <div className="field-group">
                <label>Bank Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.bankName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bankName: e.target.value })
                    }
                  />
                ) : (
                  <p>{profileData.bankName}</p>
                )}
              </div>
              <div className="field-group">
                <label>Account Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.accountNumber}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        accountNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{profileData.accountNumber}</p>
                )}
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

export default ProfilePage; 