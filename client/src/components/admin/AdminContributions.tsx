import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';

interface Contribution {
  id: number;
  memberName: string;
  amount: string;
  transactionRef: string;
  status: 'pending' | 'validated' | 'rejected';
  paymentProof: string;
  date: string;
}

const AdminContributions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  // Dummy data - will be replaced with API calls
  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: 1,
      memberName: 'John Doe',
      amount: '₦50,000',
      transactionRef: 'TRX123456',
      status: 'pending',
      paymentProof: 'proof1.jpg',
      date: '2024-02-15',
    },
    {
      id: 2,
      memberName: 'Jane Smith',
      amount: '₦75,000',
      transactionRef: 'TRX789012',
      status: 'validated',
      paymentProof: 'proof2.jpg',
      date: '2024-02-14',
    },
    {
      id: 3,
      memberName: 'Mike Johnson',
      amount: '₦25,000',
      transactionRef: 'TRX345678',
      status: 'rejected',
      paymentProof: 'proof3.jpg',
      date: '2024-02-13',
    },
  ]);

  const toast = useToast();

  const handleStatusChange = (contributionId: number, newStatus: 'validated' | 'rejected') => {
    setContributions(contributions.map(contribution =>
      contribution.id === contributionId
        ? { ...contribution, status: newStatus }
        : contribution
    ));
    toast.success(`Contribution ${newStatus} successfully`);
  };

  const handleDeleteClick = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteContribution = () => {
    if (selectedContribution) {
      setContributions(contributions.filter(c => c.id !== selectedContribution.id));
      toast.success('Contribution deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedContribution(null);
    }
  };

  const handleViewProof = (proofUrl: string) => {
    // In a real app, this would open the proof image/document
    console.log('Viewing proof:', proofUrl);
  };

  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = 
      contribution.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || contribution.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Contribution Management</h2>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by member or transaction ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
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
                <th>Member</th>
                <th>Amount</th>
                <th>Transaction Ref</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.map(contribution => (
                <tr key={contribution.id}>
                  <td>{contribution.memberName}</td>
                  <td>{contribution.amount}</td>
                  <td>{contribution.transactionRef}</td>
                  <td>{contribution.date}</td>
                  <td>
                    <span className={`status-badge ${contribution.status}`}>
                      {contribution.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {contribution.status === 'pending' && (
                        <>
                          <button
                            className="action-btn approve"
                            onClick={() => handleStatusChange(contribution.id, 'validated')}
                          >
                            Validate
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleStatusChange(contribution.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="action-btn view"
                        onClick={() => handleViewProof(contribution.paymentProof)}
                      >
                        View Proof
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteClick(contribution)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedContribution(null);
        }}
        onConfirm={handleDeleteContribution}
        itemName={`contribution from ${selectedContribution?.memberName || ''}`}
      />
    </DashboardLayout>
  );
};

export default AdminContributions; 