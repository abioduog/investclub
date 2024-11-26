import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/Modal.css';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContributionData) => Promise<void>;
}

export interface ContributionData {
  amount: number;
  transaction_reference: string;
  payment_proof_url?: string;
  contribution_date: string;
}

const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ContributionData>({
    amount: 5000, // Minimum contribution amount
    transaction_reference: '',
    contribution_date: new Date().toISOString().split('T')[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.amount < 5000) {
      toast.error('Minimum contribution amount is ₦5,000');
      return;
    }
    
    if (!formData.transaction_reference) {
      toast.error('Transaction reference is required');
      return;
    }

    if (!selectedFile) {
      toast.error('Payment proof is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Upload file and get URL
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // const uploadResponse = await uploadFile(formData);
      // const payment_proof_url = uploadResponse.url;

      await onSubmit({
        ...formData,
        payment_proof_url: 'temporary_url' // This will be replaced with actual upload URL
      });

      toast.success('Contribution submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make Contribution">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="amount">Amount (₦)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="5000"
            step="100"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <small>Minimum contribution: ₦5,000</small>
        </div>

        <div className="form-group">
          <label htmlFor="transaction_reference">Transaction Reference</label>
          <input
            type="text"
            id="transaction_reference"
            name="transaction_reference"
            value={formData.transaction_reference}
            onChange={handleInputChange}
            placeholder="Enter bank transaction reference"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contribution_date">Contribution Date</label>
          <input
            type="date"
            id="contribution_date"
            name="contribution_date"
            value={formData.contribution_date}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="payment_proof">Payment Proof</label>
          <input
            type="file"
            id="payment_proof"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            required
          />
          <small>Maximum file size: 5MB. Accepted formats: Images, PDF</small>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContributionModal; 