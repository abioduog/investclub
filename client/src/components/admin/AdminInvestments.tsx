import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import AddInvestmentModal from '../modals/AddInvestmentModal';
import EditInvestmentModal from '../modals/EditInvestmentModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';

interface Investment {
  id: number;
  title: string;
  description: string;
  targetAmount: string;
  minimumInvestment: string;
  expectedReturns: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
  startDate: string;
  endDate: string;
}

const AdminInvestments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<Investment | null>(null);

  // Dummy data - will be replaced with API calls
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: 1,
      title: 'Real Estate Fund A',
      description: 'Investment in premium real estate properties',
      targetAmount: '₦5,000,000',
      minimumInvestment: '₦100,000',
      expectedReturns: '15%',
      duration: '12 months',
      riskLevel: 'medium',
      status: 'open',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    {
      id: 2,
      title: 'Tech Startup Fund',
      description: 'Investment in emerging tech startups',
      targetAmount: '₦3,000,000',
      minimumInvestment: '₦50,000',
      expectedReturns: '20%',
      duration: '6 months',
      riskLevel: 'high',
      status: 'open',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
    },
    {
      id: 3,
      title: 'Government Bonds',
      description: 'Low-risk government securities',
      targetAmount: '₦2,000,000',
      minimumInvestment: '₦20,000',
      expectedReturns: '10%',
      duration: '12 months',
      riskLevel: 'low',
      status: 'closed',
      startDate: '2023-06-01',
      endDate: '2024-06-01',
    },
  ]);

  const toast = useToast();

  const handleAddInvestment = (investmentData: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      id: investments.length + 1,
      ...investmentData,
    };

    setInvestments([...investments, newInvestment]);
    toast.success('Investment opportunity added successfully');
  };

  const handleEditInvestment = (id: number, investmentData: Partial<Investment>) => {
    setInvestments(investments.map(investment => 
      investment.id === id 
        ? { ...investment, ...investmentData }
        : investment
    ));
    toast.success('Investment updated successfully');
  };

  const handleEditClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (investment: Investment) => {
    setInvestmentToDelete(investment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteInvestment = () => {
    if (investmentToDelete) {
      setInvestments(investments.filter(inv => inv.id !== investmentToDelete.id));
      toast.success(`${investmentToDelete.title} has been deleted`);
      setInvestmentToDelete(null);
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = 
      investment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || investment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Investment Management</h2>
          <button 
            className="add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Create Investment
          </button>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search investments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter investments by status"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Target Amount</th>
                <th>Returns</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map(investment => (
                <tr key={investment.id}>
                  <td>
                    <div className="investment-title">
                      <strong>{investment.title}</strong>
                      <small>{investment.description}</small>
                    </div>
                  </td>
                  <td>{investment.targetAmount}</td>
                  <td>{investment.expectedReturns}</td>
                  <td>
                    <span className={`risk-badge ${investment.riskLevel}`}>
                      {investment.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${investment.status}`}>
                      {investment.status}
                    </span>
                  </td>
                  <td>{investment.duration}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditClick(investment)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteClick(investment)}
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

      <AddInvestmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddInvestment}
      />

      <EditInvestmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedInvestment(null);
        }}
        onSubmit={handleEditInvestment}
        investment={selectedInvestment}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setInvestmentToDelete(null);
        }}
        onConfirm={handleDeleteInvestment}
        itemName={investmentToDelete?.title || ''}
      />
    </DashboardLayout>
  );
};

export default AdminInvestments; 