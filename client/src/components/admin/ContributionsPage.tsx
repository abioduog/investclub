import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import '../../styles/AdminPages.css';

interface Contribution {
  id: number;
  memberName: string;
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  reference: string;
}

const ContributionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data
  const contributions: Contribution[] = [
    {
      id: 1,
      memberName: 'John Doe',
      amount: '₦5,000',
      date: '2024-03-01',
      status: 'pending',
      reference: 'CONT-001',
    },
    {
      id: 2,
      memberName: 'Jane Smith',
      amount: '₦10,000',
      date: '2024-03-02',
      status: 'approved',
      reference: 'CONT-002',
    },
    {
      id: 3,
      memberName: 'Mike Johnson',
      amount: '₦5,000',
      date: '2024-03-03',
      status: 'rejected',
      reference: 'CONT-003',
    },
  ];

  const filteredContributions = contributions.filter(contribution =>
    contribution.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contribution.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Contribution Management</h2>
          <div className="header-actions">
            <button className="secondary-button">Download Report</button>
            <button className="add-button">Record Contribution</button>
          </div>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search contributions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select className="filter-select">
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
                <th>Member Name</th>
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
                  <td>{contribution.memberName}</td>
                  <td>{contribution.amount}</td>
                  <td>{contribution.date}</td>
                  <td>
                    <span className={`status-badge ${contribution.status}`}>
                      {contribution.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view">View</button>
                      {contribution.status === 'pending' && (
                        <>
                          <button className="action-btn approve">Approve</button>
                          <button className="action-btn reject">Reject</button>
                        </>
                      )}
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

export default ContributionsPage; 