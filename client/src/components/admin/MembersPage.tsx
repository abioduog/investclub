import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import AddMemberModal from '../modals/AddMemberModal';
import EditMemberModal from '../modals/EditMemberModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import type { MemberFormData } from '../modals/AddMemberModal';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  totalContributions: string;
}

const AdminMembersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  
  // Dummy data - will be replaced with API calls
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+234 XXX XXX XXXX', status: 'active', joinDate: '2024-01-15', totalContributions: '₦150,000' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+234 XXX XXX XXXX', status: 'active', joinDate: '2024-01-20', totalContributions: '₦200,000' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+234 XXX XXX XXXX', status: 'inactive', joinDate: '2024-02-01', totalContributions: '₦50,000' },
  ]);

  const toast = useToast();

  const handleAddMember = (memberData: MemberFormData) => {
    // In a real app, this would be an API call
    const newMember: Member = {
      id: members.length + 1,
      ...memberData,
      joinDate: new Date().toISOString().split('T')[0],
      totalContributions: '₦0',
    };

    setMembers([...members, newMember]);
    toast.success('Member added successfully!');
  };

  const handleEditMember = (id: number, memberData: MemberFormData) => {
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, ...memberData }
        : member
    ));
    toast.success('Member updated successfully!');
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter(member => member.id !== memberToDelete.id));
      toast.success(`${memberToDelete.name} has been deleted`);
      setMemberToDelete(null);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="admin-page">
        <div className="page-header">
          <h2>Member Management</h2>
          <button 
            className="add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Member
          </button>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Total Contributions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`status-badge ${member.status}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>{member.joinDate}</td>
                  <td>{member.totalContributions}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditClick(member)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteClick(member)}
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

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={handleEditMember}
        member={selectedMember}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteMember}
        itemName={memberToDelete?.name || ''}
      />
    </DashboardLayout>
  );
};

export default AdminMembersList; 