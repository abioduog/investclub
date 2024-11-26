import React, { useState, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';

interface MemberData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    membershipId: string;
    joinDate: string;
    profilePicture: string;
  };
  securityInfo: {
    lastLogin: string;
    lastPasswordChange: string;
  };
  investmentPreferences: {
    riskTolerance: 'low' | 'medium' | 'high';
    investmentGoals: string[];
    preferredSectors: string[];
  };
}

const MemberProfile: React.FC = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dummy data - will be replaced with API calls
  const [memberData, setMemberData] = useState<MemberData>({
    personalInfo: {
      name: 'John Member',
      email: 'john.member@example.com',
      phone: '+234 XXX XXX XXXX',
      membershipId: 'CMS-88-001',
      joinDate: '2023-01-01',
      profilePicture: '',
    },
    securityInfo: {
      lastLogin: '2024-03-15 14:30',
      lastPasswordChange: '2024-02-01',
    },
    investmentPreferences: {
      riskTolerance: 'medium',
      investmentGoals: ['Capital Growth', 'Regular Income'],
      preferredSectors: ['Real Estate', 'Technology'],
    },
  });

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberData({
          ...memberData,
          personalInfo: {
            ...memberData.personalInfo,
            profilePicture: reader.result as string,
          },
        });
        toast.success('Profile picture updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Profile</h2>
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
                  backgroundImage: memberData.personalInfo.profilePicture 
                    ? `url(${memberData.personalInfo.profilePicture})` 
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
                role="button"
                aria-label="Change profile picture"
                tabIndex={0}
              >
                {!memberData.personalInfo.profilePicture && (
                  <span style={{ color: '#666' }}>Click to upload</span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                aria-label="Upload profile picture"
                title="Choose a profile picture"
                id="profile-picture-input"
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
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="name-input">Name</label>
                <input
                  id="name-input"
                  type="text"
                  value={memberData.personalInfo.name}
                  onChange={(e) => setMemberData({
                    ...memberData,
                    personalInfo: { ...memberData.personalInfo, name: e.target.value }
                  })}
                  disabled={!isEditing}
                  title="Enter your full name"
                  placeholder="Enter your full name"
                  aria-label="Full name"
                />
              </div>
              <div className="info-item">
                <label htmlFor="email-input">Email</label>
                <input
                  id="email-input"
                  type="email"
                  value={memberData.personalInfo.email}
                  onChange={(e) => setMemberData({
                    ...memberData,
                    personalInfo: { ...memberData.personalInfo, email: e.target.value }
                  })}
                  disabled={!isEditing}
                  title="Enter your email address"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                />
              </div>
              <div className="info-item">
                <label htmlFor="phone-input">Phone</label>
                <input
                  id="phone-input"
                  type="tel"
                  value={memberData.personalInfo.phone}
                  onChange={(e) => setMemberData({
                    ...memberData,
                    personalInfo: { ...memberData.personalInfo, phone: e.target.value }
                  })}
                  disabled={!isEditing}
                  title="Enter your phone number"
                  placeholder="Enter your phone number"
                  aria-label="Phone number"
                />
              </div>
              <div className="info-item">
                <label htmlFor="membership-id-input">Membership ID</label>
                <input
                  id="membership-id-input"
                  type="text"
                  value={memberData.personalInfo.membershipId}
                  disabled
                  title="Your membership ID"
                  aria-label="Membership ID"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Investment Preferences Section */}
          <div className="profile-section">
            <h3>Investment Preferences</h3>
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="risk-tolerance-select">Risk Tolerance</label>
                <select
                  id="risk-tolerance-select"
                  value={memberData.investmentPreferences.riskTolerance}
                  onChange={(e) => setMemberData({
                    ...memberData,
                    investmentPreferences: {
                      ...memberData.investmentPreferences,
                      riskTolerance: e.target.value as 'low' | 'medium' | 'high'
                    }
                  })}
                  disabled={!isEditing}
                  title="Select your risk tolerance level"
                  aria-label="Risk tolerance level"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="info-item">
                <label htmlFor="investment-goals-input">Investment Goals</label>
                <input
                  id="investment-goals-input"
                  type="text"
                  value={memberData.investmentPreferences.investmentGoals.join(', ')}
                  disabled
                  title="Your investment goals"
                  aria-label="Investment goals"
                  readOnly
                />
              </div>
              <div className="info-item">
                <label htmlFor="preferred-sectors-input">Preferred Sectors</label>
                <input
                  id="preferred-sectors-input"
                  type="text"
                  value={memberData.investmentPreferences.preferredSectors.join(', ')}
                  disabled
                  title="Your preferred investment sectors"
                  aria-label="Preferred investment sectors"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Security Information Section */}
          <div className="profile-section">
            <h3>Security Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="last-login-input">Last Login</label>
                <input
                  id="last-login-input"
                  type="text"
                  value={memberData.securityInfo.lastLogin}
                  disabled
                  title="Your last login time"
                  aria-label="Last login time"
                  readOnly
                />
              </div>
              <div className="info-item">
                <label htmlFor="last-password-change-input">Last Password Change</label>
                <input
                  id="last-password-change-input"
                  type="text"
                  value={memberData.securityInfo.lastPasswordChange}
                  disabled
                  title="Date of last password change"
                  aria-label="Last password change date"
                  readOnly
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="button-group">
              <button className="secondary-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberProfile; 