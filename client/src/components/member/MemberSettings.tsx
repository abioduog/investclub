import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';
import '../../styles/MemberSettings.css';

interface SettingsState {
  notifications: {
    email: {
      contributions: boolean;
      investments: boolean;
      returns: boolean;
      news: boolean;
    };
    sms: {
      contributions: boolean;
      investments: boolean;
    };
  };
  communication: {
    emailFrequency: 'immediate' | 'daily' | 'weekly';
    language: 'en' | 'fr';
    timeZone: string;
  };
  account: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
  };
}

const MemberSettings: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'notifications' | 'communication' | 'account'>('notifications');
  
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: {
        contributions: true,
        investments: true,
        returns: true,
        news: false,
      },
      sms: {
        contributions: false,
        investments: false,
      },
    },
    communication: {
      emailFrequency: 'immediate',
      language: 'en',
      timeZone: 'Africa/Lagos',
    },
    account: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false,
    },
  });

  const handleNotificationChange = (type: 'email' | 'sms', setting: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type],
          [setting]: !prev.notifications[type][setting as keyof typeof prev.notifications[typeof type]],
        },
      },
    }));
  };

  const handleCommunicationChange = (field: keyof SettingsState['communication'], value: string) => {
    setSettings(prev => ({
      ...prev,
      communication: {
        ...prev.communication,
        [field]: value,
      },
    }));
  };

  const handlePasswordChange = (field: keyof SettingsState['account'], value: string) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [field]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would be an API call
    toast.success('Settings updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.account.newPassword !== settings.account.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // In a real app, this would be an API call
    toast.success('Password changed successfully');
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    }));
  };

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h3>Email Notifications</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications.email.contributions}
              onChange={() => handleNotificationChange('email', 'contributions')}
            />
            <span className="toggle-text">Contribution Updates</span>
          </label>
          <p className="setting-description">Receive notifications about your contributions and due dates</p>
        </div>
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications.email.investments}
              onChange={() => handleNotificationChange('email', 'investments')}
            />
            <span className="toggle-text">Investment Updates</span>
          </label>
          <p className="setting-description">Get notified about investment opportunities and performance</p>
        </div>
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications.email.returns}
              onChange={() => handleNotificationChange('email', 'returns')}
            />
            <span className="toggle-text">Returns & Dividends</span>
          </label>
          <p className="setting-description">Receive updates about investment returns and dividends</p>
        </div>
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications.email.news}
              onChange={() => handleNotificationChange('email', 'news')}
            />
            <span className="toggle-text">Club News & Updates</span>
          </label>
          <p className="setting-description">Stay informed about club news and general updates</p>
        </div>
      </div>

      <h3>SMS Notifications</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications.sms.contributions}
              onChange={() => handleNotificationChange('sms', 'contributions')}
            />
            <span className="toggle-text">Contribution Reminders</span>
          </label>
          <p className="setting-description">Receive SMS reminders for contribution deadlines</p>
        </div>
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications.sms.investments}
              onChange={() => handleNotificationChange('sms', 'investments')}
            />
            <span className="toggle-text">Investment Alerts</span>
          </label>
          <p className="setting-description">Get SMS alerts for urgent investment updates</p>
        </div>
      </div>
    </div>
  );

  const renderCommunicationTab = () => (
    <div className="settings-section">
      <h3>Communication Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label" htmlFor="emailFrequency">Email Frequency</label>
          <select
            id="emailFrequency"
            value={settings.communication.emailFrequency}
            onChange={(e) => handleCommunicationChange('emailFrequency', e.target.value)}
            className="setting-select"
          >
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
          </select>
          <p className="setting-description">Choose how often you receive email updates</p>
        </div>
        <div className="setting-item">
          <label className="setting-label" htmlFor="language">Language</label>
          <select
            id="language"
            value={settings.communication.language}
            onChange={(e) => handleCommunicationChange('language', e.target.value)}
            className="setting-select"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
          <p className="setting-description">Select your preferred language for communications</p>
        </div>
        <div className="setting-item">
          <label className="setting-label" htmlFor="timeZone">Time Zone</label>
          <select
            id="timeZone"
            value={settings.communication.timeZone}
            onChange={(e) => handleCommunicationChange('timeZone', e.target.value)}
            className="setting-select"
          >
            <option value="Africa/Lagos">Lagos (GMT+1)</option>
            <option value="Africa/Accra">Accra (GMT)</option>
            <option value="Europe/London">London (GMT/BST)</option>
          </select>
          <p className="setting-description">Set your time zone for accurate notifications</p>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.account.twoFactorEnabled}
              onChange={() => setSettings(prev => ({
                ...prev,
                account: { ...prev.account, twoFactorEnabled: !prev.account.twoFactorEnabled }
              }))}
            />
            <span className="toggle-text">Two-Factor Authentication</span>
          </label>
          <p className="setting-description">Add an extra layer of security to your account</p>
        </div>
      </div>

      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword} className="password-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={settings.account.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={settings.account.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={settings.account.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            required
          />
        </div>
        <button type="submit" className="change-password-button">Change Password</button>
      </form>
    </div>
  );

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>Settings</h2>
          <button className="save-button" onClick={handleSaveSettings}>
            Save Changes
          </button>
        </div>

        <div className="settings-container">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`tab-button ${activeTab === 'communication' ? 'active' : ''}`}
              onClick={() => setActiveTab('communication')}
            >
              Communication
            </button>
            <button
              className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account & Security
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'communication' && renderCommunicationTab()}
            {activeTab === 'account' && renderAccountTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberSettings; 