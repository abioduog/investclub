import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import '../../styles/DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'member';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const location = useLocation();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/members', label: 'Members' },
    { to: '/admin/investments', label: 'Investments' },
    { to: '/admin/contributions', label: 'Contributions' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/profile', label: 'Profile' },
  ];

  const memberLinks = [
    { to: '/member/dashboard', label: 'Dashboard' },
    { to: '/member/contributions', label: 'My Contributions' },
    { to: '/member/investments', label: 'My Investments' },
    { to: '/member/reports', label: 'My Reports' },
    { to: '/member/settings', label: 'Settings' },
    { to: '/member/support', label: 'Support' },
    { to: '/member/profile', label: 'My Profile' },
  ];

  const links = userRole === 'admin' ? adminLinks : memberLinks;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>CMS OGS 88</h2>
        </div>
        <nav>
          <ul>
            {links.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={location.pathname === link.to ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="content-wrapper">
        <DashboardHeader userRole={userRole} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 