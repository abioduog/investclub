import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelector.css';

interface RoleSelectorProps {
  onRoleSelect: (role: 'admin' | 'member') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'admin' | 'member') => {
    localStorage.setItem('userRole', role);
    onRoleSelect(role);
    navigate(role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
  };

  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Select your role to continue</p>
        
        <div className="role-buttons">
          <button 
            className="role-button member"
            onClick={() => handleRoleSelect('member')}
          >
            <div className="icon">👤</div>
            <div className="role-info">
              <h3>Member</h3>
              <p>Access your investment dashboard</p>
            </div>
          </button>

          <button 
            className="role-button admin"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="icon">👑</div>
            <div className="role-info">
              <h3>Admin</h3>
              <p>Manage club investments and members</p>
            </div>
          </button>
        </div>

        <div className="back-link">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;