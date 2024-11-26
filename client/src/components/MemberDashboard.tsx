import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import '../styles/Dashboard.css';

const MemberDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Contributed', value: '₦150,000', icon: '💵' },
    { label: 'Active Investments', value: '3', icon: '💰' },
    { label: 'Total Returns', value: '₦15,000', icon: '📈' },
    { label: 'Next Contribution', value: '₦5,000', icon: '📅' },
  ];

  return (
    <DashboardLayout userRole="member">
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
          <h2>My Contributions</h2>
          <p>Loading contributions...</p>
        </div>

        <div className="dashboard-card">
          <h2>My Investments</h2>
          <p>Loading investments...</p>
        </div>

        <div className="dashboard-card">
          <h2>Investment Opportunities</h2>
          <p>Loading opportunities...</p>
        </div>

        <div className="dashboard-card">
          <h2>Recent Activities</h2>
          <p>Loading activities...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;