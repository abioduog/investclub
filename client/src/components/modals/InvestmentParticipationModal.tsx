import React, { useState } from 'react';
import Modal from './Modal';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/Modal.css';

interface InvestmentParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParticipationData) => Promise<void>;
  investment: {
    id: number;
    title: string;
    minimumInvestment: string;
    expectedReturns: string;
    duration: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface ParticipationData {
  investment_id: number;
  amount: number;
  agreed_to_terms: boolean;
}

const InvestmentParticipationModal: React.FC<InvestmentParticipationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  investment
}) => {
  const toast = useToast();
  const minimumAmount = parseInt(investment.minimumInvestment.replace(/[^0-9]/g, ''));
  
  const [formData, setFormData] = useState<ParticipationData>({
    investment_id: investment.id,
    amount: minimumAmount,
    agreed_to_terms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.amount < minimumAmount) {
      toast.error(`Minimum investment amount is ${investment.minimumInvestment}`);
      return;
    }
    
    if (!formData.agreed_to_terms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast.success('Investment participation submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit investment participation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invest in ${investment.title}`}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="investment-summary">
          <div className="summary-item">
            <span className="label">Expected Returns:</span>
            <span className="value">{investment.expectedReturns}</span>
          </div>
          <div className="summary-item">
            <span className="label">Duration:</span>
            <span className="value">{investment.duration}</span>
          </div>
          <div className="summary-item">
            <span className="label">Risk Level:</span>
            <span className={`value risk-badge ${investment.riskLevel}`}>
              {investment.riskLevel}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Investment Amount (₦)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min={minimumAmount}
            step="1000"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <small>Minimum investment: {investment.minimumInvestment}</small>
        </div>

        <div className="terms-section">
          <h4>Terms and Conditions</h4>
          <div className="terms-content">
            <p>By participating in this investment, you acknowledge and agree to the following:</p>
            <ul>
              <li>The investment duration is {investment.duration}</li>
              <li>Expected returns of {investment.expectedReturns} are not guaranteed</li>
              <li>This is a {investment.riskLevel} risk investment</li>
              <li>Early withdrawal may be subject to penalties</li>
              <li>Investment is subject to market conditions and risks</li>
            </ul>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="agreed_to_terms"
                checked={formData.agreed_to_terms}
                onChange={handleInputChange}
                required
              />
              I have read and agree to the terms and conditions
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="button secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="button primary"
            disabled={isSubmitting || !formData.agreed_to_terms}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Investment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InvestmentParticipationModal; 