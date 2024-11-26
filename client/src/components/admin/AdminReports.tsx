import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

interface SummaryData {
  totalContributions: string;
  totalMembers: number;
  activeInvestments: number;
  totalReturns: string;
}

interface MonthlyData {
  month: string;
  contributions: string;
  investments: string;
  returns: string;
}

const AdminReports: React.FC = () => {
  // Dummy data - will be replaced with API calls
  const summaryData: SummaryData = {
    totalContributions: '₦15,750,000',
    totalMembers: 150,
    activeInvestments: 5,
    totalReturns: '₦2,250,000',
  };

  const [monthlyData] = useState<MonthlyData[]>([
    {
      month: 'January 2024',
      contributions: '₦2,500,000',
      investments: '₦2,000,000',
      returns: '₦350,000',
    },
    {
      month: 'February 2024',
      contributions: '₦2,750,000',
      investments: '₦2,250,000',
      returns: '₦400,000',
    },
    {
      month: 'March 2024',
      contributions: '₦3,000,000',
      investments: '₦2,500,000',
      returns: '₦450,000',
    },
  ]);

  const handleGenerateReport = (reportType: string) => {
    // In a real app, this would generate and download the report
    console.log(`Generating ${reportType} report...`);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Financial Reports</h2>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Contributions</h3>
            <div className="amount">{summaryData.totalContributions}</div>
            <p className="subtitle">From {summaryData.totalMembers} members</p>
          </div>

          <div className="summary-card">
            <h3>Active Investments</h3>
            <div className="amount">{summaryData.activeInvestments}</div>
            <p className="subtitle">Currently running</p>
          </div>

          <div className="summary-card">
            <h3>Total Returns</h3>
            <div className="amount">{summaryData.totalReturns}</div>
            <p className="subtitle">Generated so far</p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">📊</div>
            <div className="report-content">
              <h3>Monthly Report</h3>
              <p>Detailed report of contributions and investments for the current month</p>
              <div className="report-actions">
                <button 
                  className="secondary-button"
                  onClick={() => handleGenerateReport('monthly')}
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">📈</div>
            <div className="report-content">
              <h3>Investment Performance</h3>
              <p>Analysis of investment performance and returns</p>
              <div className="report-actions">
                <button 
                  className="secondary-button"
                  onClick={() => handleGenerateReport('investment')}
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">👥</div>
            <div className="report-content">
              <h3>Member Activity</h3>
              <p>Report on member contributions and participation</p>
              <div className="report-actions">
                <button 
                  className="secondary-button"
                  onClick={() => handleGenerateReport('member')}
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Data Table */}
        <div className="table-container" style={{ marginTop: '2rem' }}>
          <h3 style={{ padding: '1rem', margin: 0 }}>Monthly Summary</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Contributions</th>
                <th>Total Investments</th>
                <th>Returns Generated</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(data => (
                <tr key={data.month}>
                  <td>{data.month}</td>
                  <td>{data.contributions}</td>
                  <td>{data.investments}</td>
                  <td>{data.returns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports; 