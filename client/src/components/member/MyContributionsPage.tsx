import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

interface Contribution {
  id: number;
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  reference: string;
}

const MyContributionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data
  const contributions: Contribution[] = [
    {
      id: 1,
      amount: '₦5,000',
      date: '2024-03-01',
      status: 'pending',
      reference: 'CONT-001',
    },
    {
      id: 2,
      amount: '₦5,000',
      date: '2024-02-01',
      status: 'approved',
      reference: 'CONT-002',
    },
    {
      id: 3,
      amount: '₦5,000',
      date: '2024-01-01',
      status: 'approved',
      reference: 'CONT-003',
    },
  ];

  const filteredContributions = contributions.filter(contribution =>
    contribution.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Contributions</h2>
          <button className="add-button">Make Contribution</button>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Contributed</h3>
            <p className="amount">₦15,000</p>
            <p className="subtitle">Last contribution: March 1, 2024</p>
          </div>
          <div className="summary-card">
            <h3>Monthly Target</h3>
            <p className="amount">₦5,000</p>
            <p className="subtitle">Due by end of month</p>
          </div>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select className="filter-select" aria-label="Filter by status">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.map(contribution => (
                <tr key={contribution.id}>
                  <td>{contribution.reference}</td>
                  <td>{contribution.amount}</td>
                  <td>{contribution.date}</td>
                  <td>
                    <span className={`status-badge ${contribution.status}`}>
                      {contribution.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view">View Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyContributionsPage; 