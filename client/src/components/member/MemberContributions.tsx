import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ContributionModal from '../modals/ContributionModal';
import type { ContributionData } from '../modals/ContributionModal';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';

interface Contribution {
  id: number;
  amount: string;
  date: string;
  status: 'pending' | 'validated' | 'rejected';
  transactionRef: string;
  paymentProof?: string;
}

const MemberContributions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // Dummy data - will be replaced with API calls
  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: 1,
      amount: '₦5,000',
      date: '2024-03-01',
      status: 'pending',
      transactionRef: 'TRX123456',
    },
    {
      id: 2,
      amount: '₦5,000',
      date: '2024-02-01',
      status: 'validated',
      transactionRef: 'TRX789012',
    },
    {
      id: 3,
      amount: '₦5,000',
      date: '2024-01-01',
      status: 'validated',
      transactionRef: 'TRX345678',
    },
  ]);

  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = contribution.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contribution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleContributionSubmit = async (data: ContributionData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/contributions', data);
      
      // Simulate API call
      const newContribution = {
        id: contributions.length + 1,
        amount: `₦${data.amount.toLocaleString()}`,
        date: data.contribution_date,
        status: 'pending' as const,
        transactionRef: data.transaction_reference,
        paymentProof: data.payment_proof_url
      };

      setContributions(prev => [newContribution, ...prev]);
      toast.success('Contribution submitted successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to submit contribution');
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleViewDetails = (id: number) => {
    // TODO: Implement view details functionality
    toast.info('View details feature coming soon!');
  };

  const handleCancelContribution = async (id: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/contributions/${id}`);
      
      setContributions(prev => prev.filter(c => c.id !== id));
      toast.success('Contribution cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel contribution');
    }
  };

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Contributions</h2>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Make Contribution
          </button>
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
            placeholder="Search by transaction reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search contributions"
          />
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter contributions by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction Ref</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.map(contribution => (
                <tr key={contribution.id}>
                  <td>{contribution.transactionRef}</td>
                  <td>{contribution.amount}</td>
                  <td>{contribution.date}</td>
                  <td>
                    <span className={`status-badge ${contribution.status}`}>
                      {contribution.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewDetails(contribution.id)}
                      >
                        View Details
                      </button>
                      {contribution.status === 'pending' && (
                        <button 
                          className="action-btn delete"
                          onClick={() => handleCancelContribution(contribution.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleContributionSubmit}
      />
    </DashboardLayout>
  );
};

export default MemberContributions; 