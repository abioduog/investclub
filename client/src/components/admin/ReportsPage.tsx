import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

const ReportsPage: React.FC = () => {
  const reports = [
    {
      title: 'Monthly Contribution Report',
      description: 'Summary of all member contributions for the current month',
      icon: '📊',
    },
    {
      title: 'Investment Performance Report',
      description: 'Detailed analysis of investment returns and performance',
      icon: '📈',
    },
    {
      title: 'Member Activity Report',
      description: 'Overview of member participation and contribution history',
      icon: '👥',
    },
    {
      title: 'Financial Statement',
      description: 'Complete financial statement including all transactions',
      icon: '💰',
    },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Reports</h2>
        </div>

        <div className="reports-grid">
          {reports.map((report, index) => (
            <div key={index} className="report-card">
              <div className="report-icon">{report.icon}</div>
              <div className="report-content">
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <div className="report-actions">
                  <button className="action-btn view">Generate Report</button>
                  <button className="action-btn download">Download PDF</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage; 