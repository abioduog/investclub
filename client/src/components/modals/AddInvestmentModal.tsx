import React, { useState } from 'react';
import Modal from './Modal';
import '../../styles/Modal.css';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvestmentFormData) => void;
}

export interface InvestmentFormData {
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

const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    title: '',
    description: '',
    targetAmount: '',
    minimumInvestment: '',
    expectedReturns: '',
    duration: '',
    riskLevel: 'medium',
    status: 'open',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Investment Opportunity">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="targetAmount">Target Amount</label>
            <input
              id="targetAmount"
              type="text"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="minimumInvestment">Minimum Investment</label>
            <input
              id="minimumInvestment"
              type="text"
              value={formData.minimumInvestment}
              onChange={(e) => setFormData({ ...formData, minimumInvestment: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expectedReturns">Expected Returns (%)</label>
            <input
              id="expectedReturns"
              type="text"
              value={formData.expectedReturns}
              onChange={(e) => setFormData({ ...formData, expectedReturns: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="riskLevel">Risk Level</label>
            <select
              id="riskLevel"
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as 'low' | 'medium' | 'high' })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'open' | 'closed' })}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button secondary">
            Cancel
          </button>
          <button type="submit" className="button primary">
            Create Investment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddInvestmentModal; 