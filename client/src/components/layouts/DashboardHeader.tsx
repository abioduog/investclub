import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/DashboardHeader.css';

interface DashboardHeaderProps {
  userRole: 'admin' | 'member';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>{userRole === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}</h1>
        <div className="header-actions">
          <button 
            className="profile-button"
            onClick={() => navigate(`/${userRole}/profile`)}
          >
            <span className="profile-icon">👤</span>
            <span className="profile-text">Profile</span>
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 