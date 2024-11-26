import React, { useState } from 'react';
import { FileUpload } from '../common/FileUpload';
import { fileUploadService } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';

interface ContributionDetails {
  amount: number;
  transferDate: string;
  bankName: string;
  accountNumber: string;
  proofFileId?: string;
}

export const ContributionUpload: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contributionDetails, setContributionDetails] = useState<ContributionDetails>({
    amount: 0,
    transferDate: '',
    bankName: '',
    accountNumber: '',
  });
  const toast = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      setIsSubmitting(true);
      const response = await fileUploadService.uploadFile(file, 'contribution');
      setContributionDetails(prev => ({
        ...prev,
        proofFileId: response.fileId
      }));
      toast.success('Proof of payment uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload proof of payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionDetails.proofFileId) {
      toast.error('Please upload proof of payment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      // TODO: Implement API call to submit contribution details
      toast.success('Contribution submitted successfully');
    } catch (error) {
      toast.error('Failed to submit contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contribution-upload">
      <h2>Submit Contribution</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (₦)</label>
          <input
            type="number"
            id="amount"
            min={5000}
            value={contributionDetails.amount}
            onChange={e => setContributionDetails(prev => ({
              ...prev,
              amount: Number(e.target.value)
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="transferDate">Transfer Date</label>
          <input
            type="date"
            id="transferDate"
            value={contributionDetails.transferDate}
            onChange={e => setContributionDetails(prev => ({
              ...prev,
              transferDate: e.target.value
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            value={contributionDetails.bankName}
            onChange={e => setContributionDetails(prev => ({
              ...prev,
              bankName: e.target.value
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            value={contributionDetails.accountNumber}
            onChange={e => setContributionDetails(prev => ({
              ...prev,
              accountNumber: e.target.value
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Proof of Payment</label>
          <FileUpload
            acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            maxSizeMB={2}
            onFileSelect={handleFileUpload}
            label="Upload proof of payment"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !contributionDetails.proofFileId}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
        </button>
      </form>
    </div>
  );
}; 