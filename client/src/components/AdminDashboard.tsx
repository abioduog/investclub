import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import '../styles/Dashboard.css';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard: React.FC = () => {
  const toast = useToast();

  const stats = [
    { label: 'Total Members', value: '35', icon: '👥' },
    { label: 'Active Investments', value: '12', icon: '💰' },
    { label: 'Total Contributions', value: '₦10M', icon: '💵' },
    { label: 'Pending Approvals', value: '5', icon: '⏳' },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Recent Contributions</h2>
          <p>Loading contributions...</p>
        </div>

        <div className="dashboard-card">
          <h2>Active Investments</h2>
          <p>Loading investments...</p>
        </div>

        <div className="dashboard-card">
          <h2>Member Activity</h2>
          <p>Loading activity...</p>
        </div>

        <div className="dashboard-card">
          <h2>Financial Overview</h2>
          <p>Loading overview...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;