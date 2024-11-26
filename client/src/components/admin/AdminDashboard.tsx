import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/Dashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Members</h3>
          <div className="card-content">
            <span className="card-value">150</span>
            <span className="card-icon">👥</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Total Contributions</h3>
          <div className="card-content">
            <span className="card-value">₦2.5M</span>
            <span className="card-icon">💰</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Active Investments</h3>
          <div className="card-content">
            <span className="card-value">5</span>
            <span className="card-icon">📈</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Pending Validations</h3>
          <div className="card-content">
            <span className="card-value">12</span>
            <span className="card-icon">⏳</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 