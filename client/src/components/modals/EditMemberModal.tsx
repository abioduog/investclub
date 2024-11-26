import React, { useState, useEffect } from 'react';
import '../../styles/Modal.css';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, memberData: MemberFormData) => void;
  member: Member | null;
}

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, onSubmit, member }) => {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Partial<MemberFormData>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        status: member.status,
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: Partial<MemberFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && member) {
      onSubmit(member.id, formData);
      onClose();
    }
  };

  if (!isOpen || !member) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Member</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Full Name *</label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter member's full name"
              aria-label="Full Name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-email">Email Address *</label>
            <input
              type="email"
              id="edit-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              aria-label="Email Address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-phone">Phone Number *</label>
            <input
              type="tel"
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              aria-label="Phone Number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-status">Status</label>
            <select
              id="edit-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              aria-label="Member Status"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal; 