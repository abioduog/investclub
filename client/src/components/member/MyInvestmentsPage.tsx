import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

interface Investment {
  id: number;
  title: string;
  amountInvested: string;
  expectedReturns: string;
  status: 'active' | 'completed';
  startDate: string;
  endDate: string;
}

const MyInvestmentsPage: React.FC = () => {
  // Dummy data
  const investments: Investment[] = [
    {
      id: 1,
      title: 'Real Estate Fund A',
      amountInvested: '₦50,000',
      expectedReturns: '₦57,500',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    {
      id: 2,
      title: 'Tech Startup Fund',
      amountInvested: '₦30,000',
      expectedReturns: '₦36,000',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
    },
  ];

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Investments</h2>
          <button className="add-button">View Opportunities</button>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Invested</h3>
            <p className="amount">₦80,000</p>
            <p className="subtitle">Across 2 investments</p>
          </div>
          <div className="summary-card">
            <h3>Expected Returns</h3>
            <p className="amount">₦93,500</p>
            <p className="subtitle">+16.875% average return</p>
          </div>
        </div>

        <div className="investment-grid">
          {investments.map(investment => (
            <div key={investment.id} className="investment-card">
              <div className="investment-header">
                <h3>{investment.title}</h3>
                <span className={`status-badge ${investment.status}`}>
                  {investment.status}
                </span>
              </div>
              <div className="investment-details">
                <div className="detail-row">
                  <span>Amount Invested:</span>
                  <span>{investment.amountInvested}</span>
                </div>
                <div className="detail-row">
                  <span>Expected Returns:</span>
                  <span>{investment.expectedReturns}</span>
                </div>
                <div className="detail-row">
                  <span>Start Date:</span>
                  <span>{investment.startDate}</span>
                </div>
                <div className="detail-row">
                  <span>End Date:</span>
                  <span>{investment.endDate}</span>
                </div>
              </div>
              <button className="action-btn view">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyInvestmentsPage; 