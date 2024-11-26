import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <nav className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/images/cms-logo.png" alt="CMS OGS 88" className="logo-img" />
          <span>CMS OGS 88 Investment Club</span>
        </div>
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Header; 