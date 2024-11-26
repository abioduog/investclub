import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/Dashboard.css';

const MemberDashboard: React.FC = () => {
  return (
    <DashboardLayout userRole="member">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Total Contributions</h3>
          <div className="card-content">
            <span className="card-value">₦150,000</span>
            <span className="card-icon">💰</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Active Investments</h3>
          <div className="card-content">
            <span className="card-value">2</span>
            <span className="card-icon">📈</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Investment Returns</h3>
          <div className="card-content">
            <span className="card-value">₦15,000</span>
            <span className="card-icon">💵</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Pending Contributions</h3>
          <div className="card-content">
            <span className="card-value">1</span>
            <span className="card-icon">⏳</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard; 