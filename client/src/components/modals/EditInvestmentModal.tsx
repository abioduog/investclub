import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { InvestmentFormData } from './AddInvestmentModal';
import '../../styles/Modal.css';

interface EditInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: Partial<InvestmentFormData>) => void;
  investment: {
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
  } | null;
}

const EditInvestmentModal: React.FC<EditInvestmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  investment,
}) => {
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

  useEffect(() => {
    if (investment) {
      setFormData(investment);
    }
  }, [investment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (investment) {
      onSubmit(investment.id, formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Investment">
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
            Update Investment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditInvestmentModal; 